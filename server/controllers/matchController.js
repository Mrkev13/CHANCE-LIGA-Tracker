const path = require('path');
const fs = require('fs');
const allMatches = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../parsed_matches.json'), 'utf-8')
);

exports.getAllMatches = async (_req, res) => {
  res.json(allMatches);
};

exports.getLiveMatches = async (_req, res) => {
  res.json(allMatches.filter(m => m.status === 'live'));
};

exports.getMatchById = async (req, res) => {
  const match = allMatches.find(m => m.id === req.params.id);
  if (!match) return res.status(404).json({ message: 'Zápas nenalezen' });
  res.json(match);
};

exports.getRawMatches = async (_req, res) => {
  res.json(allMatches);
};
