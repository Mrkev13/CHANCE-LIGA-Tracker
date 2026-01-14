const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  status: { type: String, required: true },
  round: { type: String },
  stadium: { type: String },
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
    minute: Number,
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

module.exports = mongoose.model('Match', matchSchema);
