const mongoose = require('mongoose');
const Match = require('./models/Match');
const path = require('path');
const fs = require('fs');
const logger = require('./utils/logger');

const TEAMS_DATA = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../client/src/shared/teams.json'), 'utf-8')
);

function normalizeName(name) {
  if (!name) return "";
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

async function findBetterPlayerInfo(scrapedName, teamId) {
  if (!scrapedName) return null;
  const normScraped = normalizeName(scrapedName);
  const team = TEAMS_DATA.find(t => t.id === teamId);

  if (team && team.players) {
    const p = team.players.find(p => {
      const normP = normalizeName(p.name);
      return normP.includes(normScraped) || normScraped.includes(normP);
    });
    if (p) return { id: p.id, name: p.name };
  }
  return null;
}

async function migrate() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://stany007:Stany007@tracker.o0tq0.mongodb.net/tracker?retryWrites=true&w=majority';
    await mongoose.connect(uri);
    logger.info('Connected to DB for migration');

    const matches = await Match.find({});
    logger.info(`Found ${matches.length} matches to process`);

    for (const match of matches) {
      let changed = false;
      
      for (const event of match.events) {
        const teamId = event.team === 'home' ? match.homeTeam.id : match.awayTeam.id;
        
        // Fix player
        if (event.player && event.player.name) {
          const better = await findBetterPlayerInfo(event.player.name, teamId);
          if (better && (better.id !== event.player.id || better.name !== event.player.name)) {
            logger.info(`Updating player: "${event.player.name}" -> "${better.name}" in match ${match.id}`);
            event.player.id = better.id;
            event.player.name = better.name;
            changed = true;
          }
        }

        // Fix assistPlayer
        if (event.assistPlayer && event.assistPlayer.name) {
          const better = await findBetterPlayerInfo(event.assistPlayer.name, teamId);
          if (better && (better.id !== event.assistPlayer.id || better.name !== event.assistPlayer.name)) {
            logger.info(`Updating assist: "${event.assistPlayer.name}" -> "${better.name}" in match ${match.id}`);
            event.assistPlayer.id = better.id;
            event.assistPlayer.name = better.name;
            changed = true;
          }
        }

        // Fix playerIn/playerOut for substitutions
        if (event.playerIn && event.playerIn.name) {
          const better = await findBetterPlayerInfo(event.playerIn.name, teamId);
          if (better && (better.id !== event.playerIn.id || better.name !== event.playerIn.name)) {
            event.playerIn.id = better.id;
            event.playerIn.name = better.name;
            changed = true;
          }
        }
        if (event.playerOut && event.playerOut.name) {
          const better = await findBetterPlayerInfo(event.playerOut.name, teamId);
          if (better && (better.id !== event.playerOut.id || better.name !== event.playerOut.name)) {
            event.playerOut.id = better.id;
            event.playerOut.name = better.name;
            changed = true;
          }
        }
      }

      if (changed) {
        await match.save();
        logger.info(`Match ${match.id} saved with updated player info`);
      }
    }

    logger.info('Migration completed successfully');
    process.exit(0);
  } catch (err) {
    logger.error('Migration failed', { error: err.message });
    process.exit(1);
  }
}

migrate();
