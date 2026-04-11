const Match = require('../models/Match');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const TEAMS_DATA = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../client/src/shared/teams.json'), 'utf-8')
);

function normalizeName(name) {
  if (!name) return "";
  return name.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\b[a-z]\.\s/gi, "") // Remove initials like "J. "
    .replace(/\s[a-z]\.$/gi, "") // Remove initials like " J."
    .trim();
}

/**
 * Finds player ID, full name and team from soupiska or history
 * @param {string} scrapedName 
 * @param {string} homeTeamId 
 * @param {string} awayTeamId 
 * @param {string} preferredSide 
 * @returns {Promise<{id: string|null, name: string, side: string}>}
 */
async function findPlayerData(scrapedName, homeTeamId, awayTeamId, preferredSide = 'home') {
  if (!scrapedName) return { id: null, name: null, side: preferredSide };
  const normScraped = normalizeName(scrapedName);
  
  const homeTeam = TEAMS_DATA.find(t => t.id === homeTeamId);
  const awayTeam = TEAMS_DATA.find(t => t.id === awayTeamId);

  const findInRoster = (team) => {
    if (!team || !team.players) return null;
    return team.players.find(p => {
      const normP = normalizeName(p.name);
      return normP.includes(normScraped) || normScraped.includes(normP);
    });
  };

  // 1. Search in rosters (try preferred side first)
  const prefTeam = preferredSide === 'home' ? homeTeam : awayTeam;
  const otherTeam = preferredSide === 'home' ? awayTeam : homeTeam;
  
  const prefMatch = findInRoster(prefTeam);
  if (prefMatch) return { id: prefMatch.id, name: prefMatch.name, side: preferredSide };
  
  const otherMatch = findInRoster(otherTeam);
  if (otherMatch) return { id: otherMatch.id, name: otherMatch.name, side: preferredSide === 'home' ? 'away' : 'home' };

  // 2. Search in DB history
  if (mongoose.connection.readyState === 1) {
    try {
      const query = {
        $or: [{ 'homeTeam.id': homeTeamId }, { 'awayTeam.id': awayTeamId }, { 'homeTeam.id': awayTeamId }, { 'awayTeam.id': homeTeamId }],
        'events.player.name': new RegExp(normScraped.split(' ').join('.*'), 'i')
      };
      
      const recentMatches = await Match.find(query).sort({ date: -1 }).limit(10).lean();

      if (recentMatches && recentMatches.length > 0) {
        const candidates = new Map();
        recentMatches.forEach(m => {
          m.events.forEach(e => {
            if (e.player && e.player.name) {
               const eventTeamId = e.team === 'home' ? m.homeTeam.id : m.awayTeam.id;
               const isHome = eventTeamId === homeTeamId;
               const isAway = eventTeamId === awayTeamId;
               if (!isHome && !isAway) return;

               const normE = normalizeName(e.player.name);
               if (normE.includes(normScraped) || normScraped.includes(normE)) {
                 const side = isHome ? 'home' : 'away';
                 const key = `${e.player.name}-${side}`;
                 const existing = candidates.get(key) || { id: e.player.id, name: e.player.name, side, count: 0 };
                 existing.count++;
                 candidates.set(key, existing);
               }
            }
          });
        });

        if (candidates.size > 0) {
          const sorted = [...candidates.values()].sort((a, b) => (b.count - a.count) || (b.name.length - a.name.length));
          return { id: sorted[0].id, name: sorted[0].name, side: sorted[0].side };
        }
      }
    } catch (err) {
      logger.error('Error searching player in DB:', err);
    }
  }

  return { id: null, name: scrapedName, side: preferredSide };
}

module.exports = { findPlayerData, normalizeName };
