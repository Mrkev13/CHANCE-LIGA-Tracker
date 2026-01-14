const Match = require('../models/Match');
const path = require('path');
const fs = require('fs');

// Load local JSON as fallback/seed source
const localMatchesPath = path.join(__dirname, '../../parsed_matches.json');
let localMatches = [];
try {
  localMatches = JSON.parse(fs.readFileSync(localMatchesPath, 'utf-8'));
} catch (err) {
  console.error('Error reading local matches file:', err);
}

// Helper: Ensure DB has data
const ensureData = async () => {
  if (mongoose.connection.readyState !== 1) return localMatches; // Not connected
  
  const count = await Match.countDocuments();
  if (count === 0 && localMatches.length > 0) {
    console.log('Seeding database from local JSON...');
    await Match.insertMany(localMatches);
  }
  return await Match.find({});
};

const mongoose = require('mongoose');

exports.getAllMatches = async (_req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const matches = await ensureData();
      res.json(matches);
    } else {
      res.json(localMatches);
    }
  } catch (error) {
    console.error(error);
    res.json(localMatches);
  }
};

exports.getLiveMatches = async (_req, res) => {
  try {
    let matches;
    if (mongoose.connection.readyState === 1) {
      matches = await Match.find({ status: 'live' });
    } else {
      matches = localMatches.filter(m => m.status === 'live');
    }
    res.json(matches);
  } catch (error) {
    res.json(localMatches.filter(m => m.status === 'live'));
  }
};

exports.getMatchById = async (req, res) => {
  try {
    let match;
    if (mongoose.connection.readyState === 1) {
      match = await Match.findOne({ id: req.params.id });
      if (!match) {
        // Try to sync if missing (e.g. newly added in code but not in DB)
        const local = localMatches.find(m => m.id === req.params.id);
        if (local) {
          match = await Match.create(local);
        }
      }
    } else {
      match = localMatches.find(m => m.id === req.params.id);
    }
    
    if (!match) return res.status(404).json({ message: 'Zápas nenalezen' });
    res.json(match);
  } catch (error) {
    const match = localMatches.find(m => m.id === req.params.id);
    if (match) res.json(match);
    else res.status(500).json({ message: 'Chyba serveru' });
  }
};

exports.updateMatch = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  
  try {
    if (mongoose.connection.readyState === 1) {
      const match = await Match.findOneAndUpdate(
        { id: id },
        updatedData,
        { new: true, upsert: true } // Create if not exists
      );
      res.json(match);
    } else {
      // Fallback to file system
      const index = localMatches.findIndex(m => m.id === id);
      if (index !== -1) {
        localMatches[index] = { ...localMatches[index], ...updatedData, id };
        fs.writeFileSync(localMatchesPath, JSON.stringify(localMatches, null, 2), 'utf-8');
        res.json(localMatches[index]);
      } else {
        res.status(404).json({ message: 'Zápas nenalezen (lokální)' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Chyba při ukládání' });
  }
};

// Helper for grouping rounds (kept logic, adapted for DB data)
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
  try {
    let matches;
    if (mongoose.connection.readyState === 1) {
      matches = await ensureData();
    } else {
      matches = localMatches;
    }
    const result = groupRoundsSorted(matches);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRawMatches = async (_req, res) => {
  // Just return all
  if (mongoose.connection.readyState === 1) {
    const matches = await Match.find({});
    res.json(matches);
  } else {
    res.json(localMatches);
  }
};
