const path = require('path');
const fs = require('fs');
const Match = require('../models/Match');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const teams = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../client/src/shared/teams.json'), 'utf-8')
);

const localMatchesPath = path.join(__dirname, '../../parsed_matches.json');
let localMatches = [];
if (fs.existsSync(localMatchesPath)) {
  try {
    localMatches = JSON.parse(fs.readFileSync(localMatchesPath, 'utf-8'));
  } catch (err) {
    logger.error('Error parsing local matches file', { error: err.message });
  }
}

exports.getAllTeams = async (req, res) => {
  res.json(teams);
};

exports.getTeamById = async (req, res) => {
  const team = teams.find(t => t.id === req.params.id);
  if (!team) return res.status(404).json({ message: 'Tým nenalezen' });
  res.json(team);
};

exports.getTeamMatches = async (req, res) => {
  const { id } = req.params;
  try {
    if (mongoose.connection.readyState === 1) {
      const teamMatches = await Match.find({
        $or: [{ 'homeTeam.id': id }, { 'awayTeam.id': id }]
      }).lean();
      res.json(teamMatches);
    } else {
      const teamMatches = localMatches.filter(m => m.homeTeam.id === id || m.awayTeam.id === id);
      res.json(teamMatches);
    }
  } catch (error) {
    logger.error('Error in getTeamMatches', { teamId: id, error: error.message });
    res.status(500).json({ message: error.message });
  }
};
