const Match = require('../models/Match');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { TEAM_ALIASES, ALLOWED_SCRAPE_HOSTS } = require('../utils/constants');
const { getAllMatchesMerged } = require('../utils/matchFetcher');

const localMatchesPath = path.join(__dirname, '../../parsed_matches.json');
let localMatches = [];
if (fs.existsSync(localMatchesPath)) {
  try {
    localMatches = JSON.parse(fs.readFileSync(localMatchesPath, 'utf-8'));
  } catch (err) {
    console.error('Error parsing local matches file:', err);
  }
}

let seeded = false;

const ensureData = async () => {
  return await getAllMatchesMerged();
};

exports.getMatchesSummary = async (_req, res) => {
  try {
    const matches = await getAllMatchesMerged();
    const mapped = matches.map((m) => ({
      id: m.id,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      score: m.score,
      status: m.status,
      date: m.date,
      stadium: m.stadium,
      competition: m.competition,
      round: m.round,
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllMatches = async (_req, res) => {
  try {
    const matches = await getAllMatchesMerged();
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Import a match by URL manually
 */
const { scrapeMatch } = require('../scrapeMatch');

// Re-use normalization logic from cronJobs or move to shared utils
const TEAMS_DATA = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../client/src/shared/teams.json'), 'utf-8')
);

function normalizeName(name) {
  if (!name) return "";
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

async function findPlayerData(scrapedName, teamId) {
  if (!scrapedName) return { id: null, name: null };
  const normScraped = normalizeName(scrapedName);
  
  logger.debug(`Hledám hráče: "${scrapedName}" pro tým ID: ${teamId}`);

  // 1. Search in teams.json first
  const team = TEAMS_DATA.find(t => t.id === teamId);
  if (team && team.players) {
    const p = team.players.find(p => {
      const normP = normalizeName(p.name);
      return normP.includes(normScraped) || normScraped.includes(normP);
    });
    if (p) {
      logger.info(`Nalezen v soupisce: "${scrapedName}" -> "${p.name}" (${p.id})`);
      return { id: p.id, name: p.name };
    }
  }

  // 2. Search in DB
  if (mongoose.connection.readyState === 1) {
    try {
      const query = {
        $or: [{ 'homeTeam.id': teamId }, { 'awayTeam.id': teamId }],
        'events.player.name': new RegExp(normScraped.split(' ').join('.*'), 'i')
      };
      
      const recentMatches = await Match.find(query).sort({ date: -1 }).limit(10).lean();

      if (recentMatches && recentMatches.length > 0) {
        const candidates = new Map();
        recentMatches.forEach(m => {
          m.events.forEach(e => {
            if (e.player && e.player.name && (e.team === 'home' || e.team === 'away')) {
               // Check if team matches
               const eventTeamId = e.team === 'home' ? m.homeTeam.id : m.awayTeam.id;
               if (eventTeamId !== teamId) return;

               const normE = normalizeName(e.player.name);
               if (normE.includes(normScraped) || normScraped.includes(normE)) {
                 const existing = candidates.get(e.player.name) || { id: e.player.id, count: 0, length: e.player.name.length };
                 existing.count++;
                 candidates.set(e.player.name, existing);
               }
            }
          });
        });

        if (candidates.size > 0) {
          const sorted = [...candidates.entries()].sort((a, b) => (b[1].count - a[1].count) || (b[1].length - a[1].length));
          const [bestName, bestData] = sorted[0];
          logger.info(`Nalezen v historii: "${scrapedName}" -> "${bestName}" (${bestData.id})`);
          return { id: bestData.id, name: bestName };
        }
      }
    } catch (err) {
      logger.error('Chyba při vyhledávání v DB:', err);
    }
  }

  logger.warn(`Hráč nenalezen, vracím původní: "${scrapedName}"`);
  return { id: null, name: scrapedName };
}

exports.importMatchByUrl = async (req, res) => {
  try {
    const { url } = req.body;
    logger.info('Přijat požadavek na import URL', { url });

    if (!url) {
      return res.status(400).json({ error: 'URL je povinná' });
    }

    // SSRF Protection & URL Validation
    try {
      const parsedUrl = new URL(url);
      if (!ALLOWED_SCRAPE_HOSTS.includes(parsedUrl.hostname)) {
        logger.warn('Nepovolený hostname pro import', { hostname: parsedUrl.hostname });
        return res.status(400).json({ error: 'Import je povolen pouze z www.onlajny.com' });
      }
    } catch (err) {
      return res.status(400).json({ error: 'Neplatný formát URL' });
    }

    logger.info('Spouštím scraper', { url });
    const scrapedData = await scrapeMatch(url);

    if (!scrapedData) {
      logger.error('Scraper nevrátil žádná data', { url });
      return res.status(500).json({ error: 'Nepodařilo se stáhnout data ze zápasu.' });
    }
    logger.info('Data úspěšně stažena', { matchId: scrapedData.matchId });

    const findTeamId = (name) => {
      if (!name) return null;
      
      // Normalize function for more aggressive matching
      const aggressiveNormalize = (s) => {
        let normalized = normalizeName(s)
          .replace(/^(ac|fk|sk|mfk|1\.)\s*/gi, '') // Remove prefixes
          .replace(/\.fc\s*/gi, 'fc') // Handle 1.FC -> 1. FC
          .trim();
        
        // Remove city suffixes ONLY if it's not the entire name
        const citySuffixes = ['praha', 'plzen', 'ostrava', 'budejovice', 'boleslav', 'hradec', 'kralove', 'zlin'];
        for (const city of citySuffixes) {
          const regex = new RegExp(`\\s+${city}$`, 'i');
          if (regex.test(normalized) && normalized.length > city.length + 2) {
            normalized = normalized.replace(regex, '');
          }
        }
        
        return normalized.replace(/\s+/g, '').trim();
      };

      const normalized = aggressiveNormalize(name);
      
      // 0. Exact match on shortName/ID if it's already an ID
      if (name.startsWith('t_')) return name;

      // 1. Check aliases first from constants
      for (const [alias, fullName] of Object.entries(TEAM_ALIASES)) {
        if (aggressiveNormalize(alias) === normalized || aggressiveNormalize(fullName) === normalized) {
          const team = TEAMS_DATA.find(t => aggressiveNormalize(t.name) === aggressiveNormalize(fullName));
          if (team) return team.id;
        }
      }

      // 2. Try match on TEAMS_DATA - Exact match first
      let team = TEAMS_DATA.find(t => aggressiveNormalize(t.name) === normalized);
      if (team) return team.id;

      // 3. Partial match (contains)
      team = TEAMS_DATA.find(t => {
        const normT = aggressiveNormalize(t.name);
        return normT.includes(normalized) || normalized.includes(normT);
      });
      
      return team ? team.id : null;
    };

    const homeTeamId = findTeamId(scrapedData.homeTeam.name);
    const awayTeamId = findTeamId(scrapedData.awayTeam.name);

    if (!homeTeamId || !awayTeamId) {
      logger.warn('Týmy nenalezeny v databázi', { home: scrapedData.homeTeam.name, away: scrapedData.awayTeam.name });
      return res.status(404).json({ 
        error: `Týmy nenalezeny v databázi. Domácí: ${scrapedData.homeTeam.name || '?'}, Hosté: ${scrapedData.awayTeam.name || '?'}` 
      });
    }

    const homeTeamData = TEAMS_DATA.find(t => t.id === homeTeamId);
    const awayTeamData = TEAMS_DATA.find(t => t.id === awayTeamId);

    if (!homeTeamData || !awayTeamData) {
      logger.error('Data týmu nenalezena v TEAMS_DATA pro ID', { homeTeamId, awayTeamId });
      return res.status(500).json({ error: 'Data o týmech nebyla nalezena v konfiguračním souboru.' });
    }

    // Map events asynchronously with verification - using Promise.all for performance
    const mapGoal = async (s, teamSide, teamId) => {
      const [player, assist] = await Promise.all([
        findPlayerData(s.player, teamId),
        s.assist ? findPlayerData(s.assist, teamId) : Promise.resolve(null)
      ]);
      return {
        type: 'goal',
        minute: s.minute,
        team: teamSide,
        player: { id: player.id, name: player.name || s.player },
        assistPlayer: assist ? { id: assist.id, name: assist.name || s.assist } : undefined,
        note: s.penalty ? 'pen.' : (s.ownGoal ? 'vlastní' : ''),
        eventKey: `goal-${s.minute}-${(player.name || s.player || "").substring(0, 3).toLowerCase()}`
      };
    };

    const mapCard = async (c, teamSide, teamId) => {
      const player = await findPlayerData(c.player, teamId);
      const type = c.type === 'Y' ? 'yellow_card' : 'red_card';
      return {
        type,
        minute: c.minute,
        team: teamSide,
        player: { id: player.id, name: player.name || c.player },
        eventKey: `${type}-${c.minute}-${(player.name || c.player || "").substring(0, 3).toLowerCase()}`
      };
    };

    const mapSub = async (s, teamSide, teamId) => {
      const [playerIn, playerOut] = await Promise.all([
        findPlayerData(s.in, teamId),
        findPlayerData(s.out, teamId)
      ]);
      return {
        type: 'substitution',
        minute: s.minute,
        team: teamSide,
        playerIn: { id: playerIn.id, name: playerIn.name || s.in },
        playerOut: { id: playerOut.id, name: playerOut.name || s.out },
        eventKey: `sub-${s.minute}-${(playerIn.name || s.in || "").substring(0, 3).toLowerCase()}-${(playerOut.name || s.out || "").substring(0, 3).toLowerCase()}`
      };
    };

    // Process all events in parallel
    const [
      homeGoals, awayGoals,
      homeCards, awayCards,
      homeSubs, awaySubs
    ] = await Promise.all([
      Promise.all(scrapedData.homeTeam.scorers.map(s => mapGoal(s, 'home', homeTeamId))),
      Promise.all(scrapedData.awayTeam.scorers.map(s => mapGoal(s, 'away', awayTeamId))),
      Promise.all(scrapedData.homeTeam.cards.map(c => mapCard(c, 'home', homeTeamId))),
      Promise.all(scrapedData.awayTeam.cards.map(c => mapCard(c, 'away', awayTeamId))),
      Promise.all(scrapedData.homeTeam.substitutions.map(s => mapSub(s, 'home', homeTeamId))),
      Promise.all(scrapedData.awayTeam.substitutions.map(s => mapSub(s, 'away', awayTeamId)))
    ]);

    const mappedEvents = [
      ...homeGoals, ...awayGoals,
      ...homeCards, ...awayCards,
      ...homeSubs, ...awaySubs
    ];

    // Add generated IDs for each event if not present
    mappedEvents.forEach((e, idx) => {
      if (!e.id) {
        const uniqueSuffix = e.player?.id || e.playerIn?.id || idx;
        e.id = `scrape-${scrapedData.matchId}-${e.type}-${e.minute}-${uniqueSuffix}`;
      }
    });

    const updateFields = {
      data: scrapedData,
      lastScrapeAt: new Date(),
      url: url,
      homeTeam: {
        id: homeTeamId,
        name: homeTeamData.name,
        logo: homeTeamData.logo || "",
        shortName: homeTeamData.shortName || homeTeamData.name.substring(0, 3).toUpperCase()
      },
      awayTeam: {
        id: awayTeamId,
        name: awayTeamData.name,
        logo: awayTeamData.logo || "",
        shortName: awayTeamData.shortName || awayTeamData.name.substring(0, 3).toUpperCase()
      },
      score: {
        home: scrapedData.homeTeam.goals,
        away: scrapedData.awayTeam.goals
      },
      events: mappedEvents,
      date: scrapedData.date || new Date().toISOString(),
      stadium: scrapedData.stadium || homeTeamData.stadium,
      competition: { id: 'chance', name: 'Chance Liga 2025/26' },
      round: scrapedData.round || "1"
    };

    const scrapedMatchId = scrapedData.matchId !== 'unknown' ? scrapedData.matchId : null;
    
    const possibleMatches = await Match.find({
      $or: [
        { 'homeTeam.id': homeTeamId, 'awayTeam.id': awayTeamId },
        ...(scrapedMatchId ? [{ matchId: scrapedMatchId }] : [])
      ]
    });

    let existingMatch = null;
    if (possibleMatches.length > 0) {
      existingMatch = possibleMatches.find(m => m.matchId === scrapedMatchId) || possibleMatches[0];
      
      if (possibleMatches.length > 1) {
        logger.info(`Nalezeno ${possibleMatches.length} možných shod, čistím duplicity...`);
        const otherIds = possibleMatches
          .filter(m => m._id.toString() !== existingMatch._id.toString())
          .map(m => m._id);
        await Match.deleteMany({ _id: { $in: otherIds } });
      }

      // Zachovat původní datum ze zápasu v DB, pokud scraper nevrátil nové
      if (existingMatch.date && updateFields.date && updateFields.date.endsWith('T15:00:00Z')) {
        updateFields.date = existingMatch.date;
      }
    }

    if (scrapedMatchId) {
      updateFields.matchId = scrapedMatchId;
    }

    const datePart = (scrapedData.date || new Date().toISOString()).split('T')[0];
    const internalId = existingMatch ? existingMatch.id : `${datePart}-${homeTeamId}-${awayTeamId}`;
    updateFields.id = internalId;

    if (scrapedData.matchStatus === 'FINISHED' || (scrapedData.date && new Date(scrapedData.date) < new Date())) {
      updateFields.status = 'finished';
    } else if (scrapedData.matchStatus === 'LIVE' || scrapedData.matchStatus === 'HT') {
      updateFields.status = 'live';
    } else {
      updateFields.status = 'scheduled';
    }

    // Force 'finished' status for imported matches if user requested
    if (scrapedData.matchStatus === 'FINISHED') {
      updateFields.status = 'finished';
    }

    const finalQuery = existingMatch ? { _id: existingMatch._id } : { id: internalId };

    const match = await Match.findOneAndUpdate(
      finalQuery,
      { $set: updateFields },
      { new: true, upsert: true }
    );

    logger.info('Upserted document', { matchId: match.matchId, status: match.status });
    res.json(match);

  } catch (error) {
    logger.error('Chyba při importu zápasu:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getLiveMatches = async (_req, res) => {
  try {
    let matches;
    if (mongoose.connection.readyState === 1) {
      matches = await Match.find({ status: 'live' }).lean();
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
      match = await Match.findOne({ id: req.params.id }).lean();
      if (!match) {
        const local = localMatches.find(m => m.id === req.params.id);
        if (local) {
          const created = await Match.create(local);
          match = created.toObject();
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
  
  // Validation
  if (updatedData.score) {
    if (updatedData.score.home < 0 || updatedData.score.away < 0) {
      return res.status(400).json({ message: 'Skóre nemůže být záporné' });
    }
  }

  // Transaction simulation (Mongoose transactions require replica set, checking just connection state here)
  const session = mongoose.connection.readyState === 1 ? await mongoose.startSession() : null;
  if (session) session.startTransaction();

  try {
    if (mongoose.connection.readyState === 1) {
      const match = await Match.findOneAndUpdate(
        { id: id },
        updatedData,
        { new: true, upsert: true, session } // Use session if available
      );
      
      if (session) {
        await session.commitTransaction();
        session.endSession();
      }
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
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    console.error(error);
    res.status(500).json({ message: 'Chyba při ukládání: ' + error.message });
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
  
  // Find highest round number that has at least one 'finished' or 'live' match
  const finishedOrLiveRounds = keys.filter(rk => 
    map[rk].some(m => m.status === 'finished' || m.status === 'live')
  );
  
  // Sort descending by round number
  finishedOrLiveRounds.sort((a, b) => Number(b) - Number(a));
  
  const latestPlayedRound = finishedOrLiveRounds.length > 0 ? finishedOrLiveRounds[0] : null;

  const remainingDesc = keys
    .filter((rk) => rk !== latestPlayedRound)
    .sort((a, b) => Number(b) - Number(a));
  const ordered = latestPlayedRound ? [latestPlayedRound, ...remainingDesc] : remainingDesc;
  const rounds = ordered.map((rk) => ({
    round: rk,
    played: map[rk].some(m => m.status === 'finished' || m.status === 'live'),
    lastPlayedAt: null, // No longer using time-based sorting
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
  if (mongoose.connection.readyState === 1) {
    const matches = await Match.find({}).lean();
    res.json(matches);
  } else {
    res.json(localMatches);
  }
};

exports.getRoundMetadata = async (_req, res) => {
  try {
    let matches;
    if (mongoose.connection.readyState === 1) {
      matches = await ensureData();
    } else {
      matches = localMatches;
    }

    const rounds = [...new Set(matches.map(m => String(m.round)).filter(Boolean))];
    rounds.sort((a, b) => Number(a) - Number(b));

    // Current round: highest round with 'finished' or 'live'
    const finishedOrLiveRounds = [...new Set(matches
      .filter(m => m.status === 'finished' || m.status === 'live')
      .map(m => String(m.round))
      .filter(Boolean)
    )];
    finishedOrLiveRounds.sort((a, b) => Number(b) - Number(a));
    
    const currentRound = finishedOrLiveRounds.length > 0 ? finishedOrLiveRounds[0] : (rounds.length > 0 ? rounds[0] : null);
    
    // Next round: the one after current
    let nextRound = null;
    if (currentRound) {
      const idx = rounds.indexOf(currentRound);
      if (idx !== -1 && idx < rounds.length - 1) {
        nextRound = rounds[idx + 1];
      }
    }

    res.json({
      rounds,
      currentRound,
      nextRound
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMatch = async (req, res) => {
  const { id } = req.params;
  try {
    if (mongoose.connection.readyState === 1) {
      const match = await Match.findOneAndDelete({ id: id });
      if (!match) {
        return res.status(404).json({ message: 'Zápas nenalezen v databázi' });
      }
      res.json({ success: true, message: 'Zápas byl úspěšně smazán z databáze.' });
    } else {
      const index = localMatches.findIndex(m => m.id === id);
      if (index !== -1) {
        localMatches.splice(index, 1);
        fs.writeFileSync(localMatchesPath, JSON.stringify(localMatches, null, 2), 'utf-8');
        res.json({ success: true, message: 'Zápas byl úspěšně smazán z lokálního souboru.' });
      } else {
        res.status(404).json({ message: 'Zápas nenalezen (lokální)' });
      }
    }
  } catch (error) {
    console.error('Chyba při mazání zápasu:', error);
    res.status(500).json({ message: 'Chyba při mazání zápasu: ' + error.message });
  }
};

exports.getMatchesByRound = async (req, res) => {
  try {
    const { round } = req.params;
    if (mongoose.connection.readyState === 1) {
      const matches = await Match.find(
        { round: String(round) },
        'id homeTeam awayTeam score status date stadium competition round'
      ).lean();
      res.json(matches.sort((a, b) => new Date(a.date) - new Date(b.date)));
    } else {
      const matches = localMatches
        .filter(m => String(m.round) === String(round))
        .map(m => ({
          id: m.id,
          homeTeam: m.homeTeam,
          awayTeam: m.awayTeam,
          score: m.score,
          status: m.status,
          date: m.date,
          stadium: m.stadium,
          competition: m.competition,
          round: m.round
        }));
      res.json(matches.sort((a, b) => new Date(a.date) - new Date(b.date)));
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
