const path = require('path');
const fs = require('fs');
const teams = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../client/src/shared/teams.json'), 'utf-8')
);
const allMatches = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../parsed_matches.json'), 'utf-8')
);

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
  const teamMatches = allMatches.filter(m => m.homeTeam.id === id || m.awayTeam.id === id);
  res.json(teamMatches);
};
