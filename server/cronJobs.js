const cron = require('node-cron');
const Match = require('./models/Match');
const { scrapeMatch } = require('./scrapeMatch');
const winston = require('winston');

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
        
        const scrapedData = await scrapeMatch(match.url);
        
        if (scrapedData) {
          try {
            // Atomic upsert
            const updatedMatch = await Match.findOneAndUpdate(
              { $or: [{ matchId: scrapedData.matchId }, { id: match.id }] },
              {
                $set: {
                  matchId: scrapedData.matchId,
                  data: scrapedData,
                  lastScrapeAt: new Date(),
                  // If it was scheduled, change to live. If finished, change to finished.
                  status: scrapedData.matchStatus === 'FINISHED' ? 'FINISHED' : 'LIVE',
                  // Optionally update other fields based on scraped data
                  score: {
                    home: scrapedData.homeTeam.goals,
                    away: scrapedData.awayTeam.goals
                  }
                }
              },
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