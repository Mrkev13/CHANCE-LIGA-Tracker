const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
  // New fields
  matchId: { type: String, unique: true, index: true },
  url: String,
  status: { type: String, enum: ['NS', 'LIVE', 'HT', 'FINISHED', 'live', 'finished', 'scheduled', 'awarded', 'canceled', 'not_played'] },
  lastScrapeAt: Date,
  data: { type: mongoose.Schema.Types.Mixed },
  
  // Existing fields
  id: { type: String, unique: true },
  date: { type: String },
  round: { type: String },
  stadium: { type: String },
  competition: { id: String, name: String },
  homeTeam: {
    id: String,
    name: String,
    logo: String,
    shortName: String
  },
  awayTeam: {
    id: String,
    name: String,
    logo: String,
    shortName: String
  },
  score: {
    home: { type: Number, default: 0 },
    away: { type: Number, default: 0 }
  },
  events: [{
    id: String,
    type: { type: String },
    minute: String,
    team: String,
    player: { id: String, name: String },
    assistPlayer: { id: String, name: String },
    playerIn: { id: String, name: String },
    playerOut: { id: String, name: String },
    note: String
  }]
}, {
  timestamps: true
});

matchSchema.index({ status: 1 });
matchSchema.index({ round: 1 });
matchSchema.index({ date: -1 });

module.exports = mongoose.model('Match', matchSchema);
