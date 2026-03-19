const cron = require('node-cron');
const Match = require('./models/Match');
const { scrapeMatch } = require('./scrapeMatch');
const winston = require('winston');
const fs = require('fs');
const path = require('path');

// Load team data for player verification
const TEAMS_DATA = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../client/src/shared/teams.json'), 'utf-8')
);

/**
 * Normalizes string for robust comparison
 * Removes diacritics, lowercase, trim
 */
function normalizeName(name) {
  if (!name) return "";
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

/**
 * Team Aliases for robust mapping
 */
const teamAliases = {
  "t_spa": ["sparta", "ac sparta praha", "sparta praha"],
  "t_sla": ["slavia", "sk slavia praha", "slavia praha"],
  "t_plz": ["viktoria plzen", "viktorka", "plzen"],
  "t_ban": ["banik", "fc banik ostrava", "ostrava", "ova"],
  "t_hrk": ["hradec kralove", "votroci", "hradec", "hkr"],
  "t_duk": ["dukla", "dukla praha"],
  "t_jab": ["jablonec", "fk jablonec", "jab"],
  "t_zli": ["zlin", "fc zlin"],
  "t_boh": ["bohemians", "bohemians praha 1905", "klokani"],
  "t_tep": ["teplice", "fk teplice"],
  "t_lib": ["liberec", "slovan liberec"],
  "t_kar": ["karvina", "mfk karvina"],
  "t_mbo": ["boleslav", "mlada boleslav", "fk mlada boleslav"],
  "t_par": ["pardubice", "fk pardubice"],
  "t_slo": ["slovacko", "1. fc slovacko"],
  "t_olo": ["olomouc", "sigma olomouc", "sk sigma olomouc"]
};

/**
 * Normalizes player name and finds team
 * e.g. "Kohút" -> "Kohút D." if found in Ostrava roster
 */
function findPlayerData(scrapedName, homeTeamId, awayTeamId) {
  const normScraped = normalizeName(scrapedName);
  const homeTeam = TEAMS_DATA.find(t => t.id === homeTeamId);
  const awayTeam = TEAMS_DATA.find(t => t.id === awayTeamId);

  const findInTeam = (team, normName) => {
    if (!team || !team.players) return null;
    return team.players.find(p => {
      const normP = normalizeName(p.name);
      return normP.includes(normName) || normName.includes(normP);
    });
  };

  const homePlayer = findInTeam(homeTeam, normScraped);
  const awayPlayer = findInTeam(awayTeam, normScraped);

  if (homePlayer && !awayPlayer) return { name: homePlayer.name, team: 'home' };
  if (awayPlayer && !homePlayer) return { name: awayPlayer.name, team: 'away' };
  
  return { name: scrapedName, team: null };
}

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
            const getEventData = (scrapedPlayer, scrapedTeam) => {
              const verified = findPlayerData(scrapedPlayer, match.homeTeam.id, match.awayTeam.id);
              return {
                name: verified.name || scrapedPlayer,
                team: verified.team || scrapedTeam
              };
            };

            // Atomic upsert - use original DB ID as primary identifier
            const updateFields = {
              data: scrapedData,
              lastScrapeAt: new Date(),
              score: {
                home: scrapedData.homeTeam.goals,
                away: scrapedData.awayTeam.goals
              },
              // Map scraped events to the standard events format for the frontend
              events: [
                ...scrapedData.homeTeam.scorers.map(s => {
                  const d = getEventData(s.player, 'home');
                  const eventKey = `goal-${s.minute}-${(d.name || "").substring(0, 3).toLowerCase()}`;
                  return { type: 'goal', minute: s.minute, team: d.team, player: d.name, note: s.penalty ? 'pen.' : (s.ownGoal ? 'vlastní' : ''), eventKey };
                }),
                ...scrapedData.awayTeam.scorers.map(s => {
                  const d = getEventData(s.player, 'away');
                  const eventKey = `goal-${s.minute}-${(d.name || "").substring(0, 3).toLowerCase()}`;
                  return { type: 'goal', minute: s.minute, team: d.team, player: d.name, note: s.penalty ? 'pen.' : (s.ownGoal ? 'vlastní' : ''), eventKey };
                }),
                ...scrapedData.homeTeam.cards.map(c => {
                  const d = getEventData(c.player, 'home');
                  const type = c.type === 'Y' ? 'yellow_card' : 'red_card';
                  const eventKey = `${type}-${c.minute}-${(d.name || "").substring(0, 3).toLowerCase()}`;
                  return { type, minute: c.minute, team: d.team, player: d.name, eventKey };
                }),
                ...scrapedData.awayTeam.cards.map(c => {
                  const d = getEventData(c.player, 'away');
                  const type = c.type === 'Y' ? 'yellow_card' : 'red_card';
                  const eventKey = `${type}-${c.minute}-${(d.name || "").substring(0, 3).toLowerCase()}`;
                  return { type, minute: c.minute, team: d.team, player: d.name, eventKey };
                }),
                ...scrapedData.homeTeam.substitutions.map(s => {
                  const dIn = getEventData(s.in, 'home');
                  const dOut = getEventData(s.out, 'home');
                  const eventKey = `sub-${s.minute}-${(dIn.name || "").substring(0, 3).toLowerCase()}-${(dOut.name || "").substring(0, 3).toLowerCase()}`;
                  return { type: 'substitution', minute: s.minute, team: dIn.team, playerIn: dIn.name, playerOut: dOut.name, eventKey };
                }),
                ...scrapedData.awayTeam.substitutions.map(s => {
                  const dIn = getEventData(s.in, 'away');
                  const dOut = getEventData(s.out, 'away');
                  const eventKey = `sub-${s.minute}-${(dIn.name || "").substring(0, 3).toLowerCase()}-${(dOut.name || "").substring(0, 3).toLowerCase()}`;
                  return { type: 'substitution', minute: s.minute, team: dIn.team, playerIn: dIn.name, playerOut: dOut.name, eventKey };
                })
              ].map((e, idx) => ({ ...e, id: e.id || `scrape-${scrapedData.matchId}-${idx}` }))
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