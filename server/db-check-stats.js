
const mongoose = require('mongoose');
const Match = require('./models/Match');
require('dotenv').config();

async function check() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://stany007:Stany007@tracker.o0tq0.mongodb.net/tracker?retryWrites=true&w=majority';
    await mongoose.connect(uri);
    const count = await Match.countDocuments();
    console.log(`Total matches in DB: ${count}`);
    
    const sample = await Match.findOne({ status: 'finished' });
    if (sample) {
      console.log(`Sample match: ${sample.homeTeam.name} vs ${sample.awayTeam.name}`);
      console.log(`Events count: ${sample.events.length}`);
    }

    const choreGols = await Match.aggregate([
      { $unwind: '$events' },
      { $match: { 'events.type': 'goal', 'events.player.name': /Chorý/i } },
      { $count: 'goals' }
    ]);
    console.log(`Chorý goals in DB: ${choreGols[0]?.goals || 0}`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
