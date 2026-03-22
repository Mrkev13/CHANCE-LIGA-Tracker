
const Match = require('../models/Match');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const localMatchesPath = path.join(__dirname, '../../parsed_matches.json');

/**
 * Fetches all matches from both MongoDB and local JSON file,
 * merges them and removes duplicates.
 */
async function getAllMatchesMerged() {
  let dbMatches = [];
  let localMatches = [];

  // 1. Fetch from DB if connected
  if (mongoose.connection.readyState === 1) {
    try {
      dbMatches = await Match.find({}).lean();
    } catch (err) {
      logger.error('Error fetching matches from DB', { error: err.message });
    }
  }

  // 2. Fetch from local JSON if exists
  if (fs.existsSync(localMatchesPath)) {
    try {
      localMatches = JSON.parse(fs.readFileSync(localMatchesPath, 'utf-8'));
    } catch (err) {
      logger.error('Error reading local matches file', { error: err.message });
    }
  }

  // 3. Merge and deduplicate
  // We use a Map to ensure unique matches by ID
  const mergedMap = new Map();

  // Add local matches first
  localMatches.forEach(m => {
    const id = m.id || `${m.homeTeam?.id}-${m.awayTeam?.id}-${m.date}`;
    mergedMap.set(id, m);
  });

  // Add DB matches (DB matches overwrite local matches if ID is same)
  dbMatches.forEach(m => {
    const id = m.id || m._id.toString();
    mergedMap.set(id, m);
  });

  return Array.from(mergedMap.values());
}

module.exports = {
  getAllMatchesMerged
};
