const path = require('path');
const fs = require('fs');
const allMatches = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../parsed_matches.json'), 'utf-8')
);

exports.getAllMatches = async (_req, res) => {
  res.json(allMatches);
};

function groupRoundsSorted(matches) {
  const map = {};
  for (const m of matches) {
    if (!m.round) continue;
    const key = String(m.round);
    (map[key] ||= []).push(m);
  }
  const keys = Object.keys(map);
  const playedStatuses = new Set(['finished', 'live']);
  const roundLastPlayedAt = {};
  for (const rk of keys) {
    const times = map[rk]
      .filter((m) => playedStatuses.has(m.status))
      .map((m) => new Date(m.date).getTime());
    roundLastPlayedAt[rk] = times.length ? Math.max(...times) : -1;
  }
  const latestPlayedRound = keys
    .filter((rk) => roundLastPlayedAt[rk] !== -1)
    .sort((a, b) => roundLastPlayedAt[b] - roundLastPlayedAt[a])[0];
  const remainingDesc = keys
    .filter((rk) => rk !== latestPlayedRound)
    .sort((a, b) => Number(b) - Number(a));
  const ordered = latestPlayedRound ? [latestPlayedRound, ...remainingDesc] : remainingDesc;
  const rounds = ordered.map((rk) => ({
    round: rk,
    played: roundLastPlayedAt[rk] !== -1,
    lastPlayedAt: roundLastPlayedAt[rk] !== -1 ? new Date(roundLastPlayedAt[rk]).toISOString() : null,
    matches: map[rk].sort((a, b) => new Date(a.date) - new Date(b.date)),
  }));
  return { rounds, order: ordered };
}

exports.getRoundsSorted = async (_req, res) => {
  const result = groupRoundsSorted(allMatches);
  res.json(result);
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

exports.updateMatch = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  
  const index = allMatches.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Zápas nenalezen' });
  }
  
  // Merge data
  allMatches[index] = { ...allMatches[index], ...updatedData, id };
  
  try {
    fs.writeFileSync(path.join(__dirname, '../../parsed_matches.json'), JSON.stringify(allMatches, null, 2), 'utf-8');
    res.json(allMatches[index]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Chyba při ukládání' });
  }
};
