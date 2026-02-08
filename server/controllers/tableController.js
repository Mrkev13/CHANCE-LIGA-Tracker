const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Match = require('../models/Match');

const localMatchesPath = path.join(__dirname, '../../parsed_matches.json');

// Helper to get matches (DB or File)
const getMatches = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return await Match.find({ status: { $in: ['finished', 'awarded', 'live'] } });
    }
  } catch (e) {
    console.error('Table DB Error:', e);
  }
  
  // Fallback
  try {
    const local = JSON.parse(fs.readFileSync(localMatchesPath, 'utf-8'));
    return local; // We filter status in compute function anyway
  } catch (e) {
    return [];
  }
};

const teams = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../client/src/shared/teams.json'), 'utf-8')
);

function computeTableFromMatches(ms) {
  const map = new Map();
  const seen = new Set();
  const WIN_POINTS = 3;
  const DRAW_POINTS = 1;
  const ensure = (id, name, logo) => {
    if (!map.has(id)) {
      map.set(id, {
        teamId: id,
        name,
        logo,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
        form: []
      });
    }
    return map.get(id);
  };
  teams.forEach(t => ensure(t.id, t.name, t.logo));
  ms.filter(m => m.status === 'finished' || m.status === 'awarded' || m.status === 'live').forEach(m => {
    const key = m.id ?? `${m.homeTeam?.id ?? ''}-${m.awayTeam?.id ?? ''}-${m.date ?? ''}`;
    if (seen.has(key)) return;
    seen.add(key);
    const home = ensure(m.homeTeam.id, m.homeTeam.name, m.homeTeam.logo);
    const away = ensure(m.awayTeam.id, m.awayTeam.name, m.awayTeam.logo);
    const hg = Number(m.score?.home);
    const ag = Number(m.score?.away);
    const validScores = Number.isFinite(hg) && Number.isFinite(ag);
    if (!validScores) return;
    home.played += 1;
    away.played += 1;
    home.goalsFor += hg;
    home.goalsAgainst += ag;
    away.goalsFor += ag;
    away.goalsAgainst += hg;
    if (hg > ag) {
      home.won += 1;
      home.points += WIN_POINTS;
      away.lost += 1;
      home.form.push('W');
      away.form.push('L');
    } else if (hg < ag) {
      away.won += 1;
      away.points += WIN_POINTS;
      home.lost += 1;
      home.form.push('L');
      away.form.push('W');
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += DRAW_POINTS;
      away.points += DRAW_POINTS;
      home.form.push('D');
      away.form.push('D');
    }
  });
  return Array.from(map.values())
    .map(t => ({
      id: t.teamId,
      position: 0,
      team: { id: t.teamId, name: t.name, logo: t.logo },
      played: t.played,
      won: t.won,
      drawn: t.drawn,
      lost: t.lost,
      goalsFor: t.goalsFor,
      goalsAgainst: t.goalsAgainst,
      goalDifference: t.goalsFor - t.goalsAgainst,
      points: t.points,
      form: t.form.slice(-5)
    }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.team.name.localeCompare(b.team.name);
    })
    .map((entry, idx) => ({ ...entry, position: idx + 1 }));
}

exports.getTable = async (_req, res) => {
  const matches = await getMatches();
  res.json(computeTableFromMatches(matches));
};

exports.getHomeTable = async (_req, res) => {
  const matches = await getMatches();
  res.json(computeTableFromMatches(matches)); 
};

exports.getAwayTable = async (_req, res) => {
  const matches = await getMatches();
  res.json(computeTableFromMatches(matches));
};
