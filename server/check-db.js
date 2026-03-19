const mongoose = require('mongoose');
const Match = require('./models/Match');

async function checkMatch() {
  try {
    await mongoose.connect('mongodb+srv://stany007:Stany007@tracker.o0tq0.mongodb.net/tracker?retryWrites=true&w=majority');
    const match = await Match.findOne({ matchId: '493353' });
    if (match) {
      console.log('Match found:');
      console.log('Home:', match.homeTeam.name);
      console.log('Away:', match.awayTeam.name);
      console.log('Events:', JSON.stringify(match.events, null, 2));
    } else {
      console.log('Match 493353 not found in DB');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkMatch();
