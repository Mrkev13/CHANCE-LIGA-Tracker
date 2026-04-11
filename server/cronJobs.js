const cron = require('node-cron');
const Match = require('./models/Match');
const { scrapeMatch } = require('./scrapeMatch');
const winston = require('winston');
const fs = require('fs');
const path = require('path');
const { findPlayerData, normalizeName } = require('./utils/playerMatcher');

// Logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

let cronJob;

/**
 * Starts the scraping cron job
 */
function startScrapingCron() {
  logger.info('Starting scraping cron job');
  
  cronJob = cron.schedule('* * * * *', async () => {
    logger.info('Cron job started at', new Date().toISOString());
    
    try {
      const now = new Date().toISOString();
      // Find matches that are LIVE OR scheduled matches that should have started by now
      const matchesToScrape = await Match.find({
        $or: [
          { status: { $in: ['LIVE', 'live'] } },
          { 
            status: 'scheduled', 
            date: { $lte: now },
            url: { $exists: true, $ne: '' }
          }
        ]
      }).lean();
      
      logger.info(`Found ${matchesToScrape.length} matches to scrape`);
      
      let upsertCount = 0;
      
      for (const match of matchesToScrape) {
        if (!match.url) {
          logger.warn(`Match ${match.matchId || match.id} has no URL, skipping`);
          continue;
        }
        
        logger.info(`Scraping match: ${match.homeTeam?.name} vs ${match.awayTeam?.name}`, { id: match.id });
        const scrapedData = await scrapeMatch(match.url);
        
        if (scrapedData) {
          try {
            // Helper to get correct team and name
            const getEventData = async (scrapedPlayer, scrapedTeam) => {
              const verified = await findPlayerData(scrapedPlayer, match.homeTeam.id, match.awayTeam.id, scrapedTeam);
              return {
                id: verified.id,
                name: verified.name || scrapedPlayer,
                team: verified.side
              };
            };

            // Process all events in parallel with Promise.all
            const homeGoals = await Promise.all(scrapedData.homeTeam.scorers.map(async s => {
              const d = await getEventData(s.player, 'home');
              const eventKey = `goal-${s.minute}-${(d.name || "").substring(0, 3).toLowerCase()}`;
              return { type: 'goal', minute: s.minute, team: d.team, player: { id: d.id, name: d.name }, note: s.penalty ? 'pen.' : (s.ownGoal ? 'vlastní' : ''), eventKey };
            }));

            const awayGoals = await Promise.all(scrapedData.awayTeam.scorers.map(async s => {
              const d = await getEventData(s.player, 'away');
              const eventKey = `goal-${s.minute}-${(d.name || "").substring(0, 3).toLowerCase()}`;
              return { type: 'goal', minute: s.minute, team: d.team, player: { id: d.id, name: d.name }, note: s.penalty ? 'pen.' : (s.ownGoal ? 'vlastní' : ''), eventKey };
            }));

            const homeCards = await Promise.all(scrapedData.homeTeam.cards.map(async c => {
              const d = await getEventData(c.player, 'home');
              const type = c.type === 'Y' ? 'yellow_card' : 'red_card';
              const eventKey = `${type}-${c.minute}-${(d.name || "").substring(0, 3).toLowerCase()}`;
              return { type, minute: c.minute, team: d.team, player: { id: d.id, name: d.name }, eventKey };
            }));

            const awayCards = await Promise.all(scrapedData.awayTeam.cards.map(async c => {
              const d = await getEventData(c.player, 'away');
              const type = c.type === 'Y' ? 'yellow_card' : 'red_card';
              const eventKey = `${type}-${c.minute}-${(d.name || "").substring(0, 3).toLowerCase()}`;
              return { type, minute: c.minute, team: d.team, player: { id: d.id, name: d.name }, eventKey };
            }));

            const homeSubs = await Promise.all(scrapedData.homeTeam.substitutions.map(async s => {
              const dIn = await getEventData(s.in, 'home');
              const dOut = await getEventData(s.out, 'home');
              const eventKey = `sub-${s.minute}-${(dIn.name || "").substring(0, 3).toLowerCase()}-${(dOut.name || "").substring(0, 3).toLowerCase()}`;
              return { type: 'substitution', minute: s.minute, team: dIn.team, playerIn: { id: dIn.id, name: dIn.name }, playerOut: { id: dOut.id, name: dOut.name }, eventKey };
            }));

            const awaySubs = await Promise.all(scrapedData.awayTeam.substitutions.map(async s => {
              const dIn = await getEventData(s.in, 'away');
              const dOut = await getEventData(s.out, 'away');
              const eventKey = `sub-${s.minute}-${(dIn.name || "").substring(0, 3).toLowerCase()}-${(dOut.name || "").substring(0, 3).toLowerCase()}`;
              return { type: 'substitution', minute: s.minute, team: dIn.team, playerIn: { id: dIn.id, name: dIn.name }, playerOut: { id: dOut.id, name: dOut.name }, eventKey };
            }));

            const mappedEvents = [
              ...homeGoals, ...awayGoals,
              ...homeCards, ...awayCards,
              ...homeSubs, ...awaySubs
            ].map((e, idx) => ({ 
              ...e, 
              id: e.id || `scrape-${scrapedData.matchId}-${e.type}-${e.minute}-${idx}` 
            }));

            // Data Validation and Cleanup
            const seen = new Set();
            const validatedEvents = mappedEvents.filter(e => {
              const playerName = e.player?.name || e.playerIn?.name || '';
              const key = `${e.type}-${e.minute}-${playerName}-${e.team}`;
              if (seen.has(key)) return false;
              seen.add(key);

              // Programmatic fix for known errors
              if (e.type === 'goal' && playerName.includes('Labik') && e.minute === '18') {
                return false;
              }
              return true;
            });

            // Atomic upsert
            const updateFields = {
              data: scrapedData,
              lastScrapeAt: new Date(),
              score: {
                home: scrapedData.homeTeam.goals,
                away: scrapedData.awayTeam.goals
              },
              events: validatedEvents
            };

            // Only change status if it's explicitly live or finished on source
            if (scrapedData.matchStatus === 'FINISHED') {
              updateFields.status = 'finished';
            } else if (scrapedData.matchStatus === 'LIVE' || scrapedData.matchStatus === 'HT') {
              updateFields.status = 'live';
            }
            // If it's 'NS' (Not Started), we keep the current match.status (e.g., 'scheduled')

            // Only update matchId if we actually found a valid one
            if (scrapedData.matchId !== 'unknown') {
              updateFields.matchId = scrapedData.matchId;
            }

            const updatedMatch = await Match.findOneAndUpdate(
              { id: match.id },
              { $set: updateFields },
              { upsert: true, new: true }
            );
            
            upsertCount++;
            logger.info('Upserted document', {
              matchId: scrapedData.matchId,
              status: updatedMatch.status,
              timestamp: new Date().toISOString()
            });
          } catch (upsertError) {
            logger.error('Failed to upsert match', {
              matchId: scrapedData.matchId,
              error: upsertError.message,
              timestamp: new Date().toISOString()
            });
          }
        }
      }
      
      logger.info('Cron job finished', {
        upsertCount,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      logger.error('Cron job failed', {
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, stopping cron job');
    if (cronJob) cronJob.stop();
    process.exit(0);
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received, stopping cron job');
    if (cronJob) cronJob.stop();
    process.exit(0);
  });
}

module.exports = { startScrapingCron };