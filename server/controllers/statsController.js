const Match = require('../models/Match');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const { getAllMatchesMerged } = require('../utils/matchFetcher');

// Shared normalization logic
const normalize = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const toShort = (s) => {
    const parts = s.trim().split(/\s+/);
    if (parts.length < 2) return s;
    const surname = parts.slice(1).join(' ');
    const firstname = parts[0];
    return `${surname} ${firstname.charAt(0)}.`; 
};

// Load teams and pre-calculate canonical map
let TEAMS_DATA = [];
try {
  TEAMS_DATA = JSON.parse(fs.readFileSync(path.join(__dirname, '../../client/src/shared/teams.json'), 'utf-8'));
} catch (err) {
  logger.error('Error loading teams.json in statsController', { error: err.message });
}

// Pre-calculate canonical map and player-to-team mapping
const canonicalMap = new Map();
const playerTeamMap = new Map(); // Map normalized canonical name to team data

TEAMS_DATA.forEach(team => {
  const teamInfo = { id: team.id, name: team.name };
  team.players?.forEach(p => {
    if (p.name) {
      const normFull = normalize(p.name);
      const normShort = normalize(toShort(p.name));
      const parts = p.name.split(/\s+/);
      const surname = parts[parts.length - 1];
      const normSurname = normalize(surname);

      canonicalMap.set(normFull, p.name);
      canonicalMap.set(normShort, p.name);
      if (normShort.endsWith('.')) canonicalMap.set(normShort.slice(0, -1), p.name);
      if (!canonicalMap.has(normSurname)) canonicalMap.set(normSurname, p.name);
      
      // Store team info for this player
      playerTeamMap.set(normalize(p.name), teamInfo);
    }
  });
});

const resolveName = (name) => {
  if (!name) return '';
  const norm = normalize(name);
  if (canonicalMap.has(norm)) return canonicalMap.get(norm);
  
  const parts = name.trim().split(/\s+/);
  if (parts.length === 2) {
    const swapped = normalize(`${parts[1]} ${parts[0]}`);
    if (canonicalMap.has(swapped)) return canonicalMap.get(swapped);
  }
  return name.trim();
};

const getPlayerTeam = (playerName, eventTeam) => {
    const canonicalName = resolveName(playerName);
    const mappedTeam = playerTeamMap.get(normalize(canonicalName));
    if (mappedTeam) return mappedTeam;
    return eventTeam; // Fallback to match event team
};

exports.getPlayerStats = async (req, res) => {
  try {
    // 1. Fetch ALL matches from DB and local file
    const matches = await getAllMatchesMerged();
    
    const stats = {
      goals: new Map(),
      assists: new Map(),
      yellowCards: new Map(),
      redCards: new Map()
    };

    const processPlayer = (map, player, team, count = 1) => {
      if (!player || !player.name || player.name === 'Neznámý hráč') return;
      
      const canonicalName = resolveName(player.name);
      const key = normalize(canonicalName);
      const correctTeam = getPlayerTeam(player.name, team);
      
      const existing = map.get(key) || { 
        id: player.id || `temp-${key}`, 
        name: canonicalName, 
        count: 0,
        teamId: correctTeam?.id,
        teamName: correctTeam?.name
      };
      existing.count += count;
      
      // Always prefer team from soupiska if available
      if (correctTeam) {
          existing.teamId = correctTeam.id;
          existing.teamName = correctTeam.name;
      }
      
      map.set(key, existing);
    };

    // 2. Process ALL matches that have events, regardless of status
    matches.forEach(match => {
      if (!match.events || match.events.length === 0) return;
      
      match.events.forEach(event => {
        // Find the team from the event or match
        let team = event.team === 'home' ? match.homeTeam : match.awayTeam;
        
        // If event.team is not 'home'/'away', try to guess from player's canonical team if possible
        // (For now, we trust the event.team mapping which is standard)

        if (event.type === 'goal') {
          processPlayer(stats.goals, event.player, team);
          if (event.assistPlayer) {
            processPlayer(stats.assists, event.assistPlayer, team);
          }
        } else if (event.type === 'yellow_card') {
          processPlayer(stats.yellowCards, event.player, team);
        } else if (event.type === 'red_card') {
          processPlayer(stats.redCards, event.player, team);
        }
      });
    });

    const sortAndFormat = (map) => {
      return Array.from(map.values())
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'cs'))
        .slice(0, 100); // Increase to top 100 to ensure we don't miss anyone in merge
    };

    res.json({
      goals: sortAndFormat(stats.goals),
      assists: sortAndFormat(stats.assists),
      yellowCards: sortAndFormat(stats.yellowCards),
      redCards: sortAndFormat(stats.redCards)
    });
  } catch (error) {
    logger.error('Error fetching player stats', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};
