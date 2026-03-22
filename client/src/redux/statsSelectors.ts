import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { TEAM_LIST } from './teamData';

export interface PlayerStat {
  id: string;
  name: string;
  count: number;
  teamId?: string;
  teamName?: string;
  lastRound?: number;
  lastDate?: string;
}

const selectMatches = (state: RootState) => state.matches.matches;
const selectServerStats = (state: RootState) => state.stats;

// Shared Helper Logic
const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const toShort = (s: string) => {
    const parts = s.trim().split(/\s+/);
    if (parts.length < 2) return s;
    const surname = parts.slice(1).join(' ');
    const firstname = parts[0];
    return `${surname} ${firstname.charAt(0)}.`; 
};

// Pre-calculate canonical map and player-to-team mapping
const canonicalMap = new Map<string, string>();
const playerTeamMap = new Map<string, { id: string, name: string }>();

TEAM_LIST.forEach(team => {
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
      if (normShort.endsWith('.')) {
          canonicalMap.set(normShort.slice(0, -1), p.name);
      }
      
      // Add surname-only if not already present (to avoid ambiguity)
      if (!canonicalMap.has(normSurname)) {
          canonicalMap.set(normSurname, p.name);
      }

      // Store team info for this player
      playerTeamMap.set(normalize(p.name), teamInfo);
    }
  });
});

const resolveName = (name: string) => {
    if (!name) return '';
    const norm = normalize(name);
    if (canonicalMap.has(norm)) return canonicalMap.get(norm)!;
    
    // Try swapping words for 2-word names (e.g. "Chorý Tomáš" -> "Tomáš Chorý")
    const parts = name.trim().split(/\s+/);
    if (parts.length === 2) {
        const swapped = normalize(`${parts[1]} ${parts[0]}`);
        if (canonicalMap.has(swapped)) return canonicalMap.get(swapped)!;
    }
    
    return name.trim();
};

const getPlayerTeam = (playerName: string, eventTeam?: { id: string, name: string }) => {
    const canonicalName = resolveName(playerName);
    const mappedTeam = playerTeamMap.get(normalize(canonicalName));
    if (mappedTeam) return mappedTeam;
    return eventTeam; // Fallback to match event team
};

const selectPlayerStatsRaw = createSelector(
  [selectMatches],
  (matches) => {
    const goals = new Map<string, PlayerStat>();
    const assists = new Map<string, PlayerStat>();
    const yellowCards = new Map<string, PlayerStat>();
    const redCards = new Map<string, PlayerStat>();
    const allNames = new Set<string>();

    const updateStat = (
      map: Map<string, PlayerStat>,
      originalId: string,
      name: string,
      roundNum: number,
      teamId?: string,
      teamName?: string,
      dateIso?: string
    ) => {
      const canonicalName = resolveName(name);
      const key = normalize(canonicalName); // Use normalized canonical name as stable key
      allNames.add(canonicalName);
      
      const correctTeam = getPlayerTeam(name, teamId && teamName ? { id: teamId, name: teamName } : undefined);
      const finalTeamId = correctTeam?.id || teamId;
      const finalTeamName = correctTeam?.name || teamName;

      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
        
        // Update to the latest round/date, but keep soupiska team if found
        const prevRound = existing.lastRound ?? -1;
        const prevDate = existing.lastDate ?? '';
        
        const isNewer = roundNum > prevRound || (roundNum === prevRound && (dateIso ?? '') > prevDate);
        
        if (isNewer || correctTeam) {
          existing.teamId = finalTeamId || existing.teamId;
          existing.teamName = finalTeamName || existing.teamName;
          if (isNewer) {
            existing.lastRound = roundNum;
            existing.lastDate = dateIso || existing.lastDate;
          }
        }
        
        // Keep the "fullest" name (e.g. "Jan Novák" is better than "Novák J.")
        if (name.length > existing.name.length || (canonicalName !== name && existing.name === name)) {
            existing.name = canonicalName;
        }
      } else {
        map.set(key, { 
          id: originalId, 
          name: canonicalName, 
          count: 1, 
          teamId: finalTeamId, 
          teamName: finalTeamName, 
          lastRound: roundNum, 
          lastDate: dateIso 
        });
      }
    };

    matches.forEach((match) => {
      // Only count stats from matches that have actually started or finished
      // Include 'scheduled' if it has events (some old data might be 'scheduled' but have events)
      // Or just check if there are events at all.
      const hasEvents = match.events && match.events.length > 0;
      if (!['finished', 'awarded', 'live'].includes(match.status) && !hasEvents) return;

      const roundNum = match.round ? parseInt(String(match.round), 10) || 0 : 0;
      const dateIso = match.date;
      
      match.events.forEach((event) => {
        const tId = event.team === 'home' ? match.homeTeam.id : match.awayTeam.id;
        const tName = event.team === 'home' ? match.homeTeam.name : match.awayTeam.name;

        // Collect names from all events for the name search index
        if (event.player?.name) allNames.add(resolveName(event.player.name));
        if (event.assistPlayer?.name) allNames.add(resolveName(event.assistPlayer.name));
        if (event.playerIn?.name) allNames.add(resolveName(event.playerIn.name));
        if (event.playerOut?.name) allNames.add(resolveName(event.playerOut.name));

        if (event.type === 'goal' && event.player) {
          updateStat(goals, event.player.id, event.player.name, roundNum, tId, tName, dateIso);
          if (event.assistPlayer) {
            updateStat(assists, event.assistPlayer.id, event.assistPlayer.name, roundNum, tId, tName, dateIso);
          }
        } else if (event.type === 'yellow_card' && event.player) {
          updateStat(yellowCards, event.player.id, event.player.name, roundNum, tId, tName, dateIso);
        } else if (event.type === 'red_card' && event.player) {
          updateStat(redCards, event.player.id, event.player.name, roundNum, tId, tName, dateIso);
        }
      });
    });

    return {
      goals,
      assists,
      yellowCards,
      redCards,
      allNames
    };
  }
);

const sortAndSlice = (map: Map<string, PlayerStat>, limit: number = 10) => {
  return Array.from(map.values())
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name, 'cs'); // Stable secondary sort by name
    })
    .slice(0, limit);
};

export const selectTopScorers = createSelector(
  [selectPlayerStatsRaw, selectServerStats],
  (stats, serverStats) => {
    const merged = new Map<string, PlayerStat>();
    
    // 1. Add server stats (Source of Truth)
    serverStats.goals.forEach(ps => {
      const canonicalName = resolveName(ps.name);
      const key = normalize(canonicalName);
      const existing = merged.get(key);
      if (existing) {
        existing.count = Math.max(existing.count, ps.count);
      } else {
        merged.set(key, { ...ps, name: canonicalName });
      }
    });
    
    // 2. Add client stats (only if they provide MORE info, e.g. live updates)
    stats.goals.forEach((ps, key) => {
      const existing = merged.get(key);
      if (!existing || ps.count > existing.count) {
        merged.set(key, ps);
      }
    });
    
    return sortAndSlice(merged);
  }
);

export const selectTopAssists = createSelector(
  [selectPlayerStatsRaw, selectServerStats],
  (stats, serverStats) => {
    const merged = new Map<string, PlayerStat>();
    
    serverStats.assists.forEach(ps => {
      const canonicalName = resolveName(ps.name);
      const key = normalize(canonicalName);
      const existing = merged.get(key);
      if (existing) {
        existing.count = Math.max(existing.count, ps.count);
      } else {
        merged.set(key, { ...ps, name: canonicalName });
      }
    });
    
    stats.assists.forEach((ps, key) => {
      const existing = merged.get(key);
      if (!existing || ps.count > existing.count) {
        merged.set(key, ps);
      }
    });
    
    return sortAndSlice(merged);
  }
);

export const selectTopYellowCards = createSelector(
  [selectPlayerStatsRaw, selectServerStats],
  (stats, serverStats) => {
    const merged = new Map<string, PlayerStat>();
    
    serverStats.yellowCards.forEach(ps => {
      const canonicalName = resolveName(ps.name);
      const key = normalize(canonicalName);
      const existing = merged.get(key);
      if (existing) {
        existing.count = Math.max(existing.count, ps.count);
      } else {
        merged.set(key, { ...ps, name: canonicalName });
      }
    });
    
    stats.yellowCards.forEach((ps, key) => {
      const existing = merged.get(key);
      if (!existing || ps.count > existing.count) {
        merged.set(key, ps);
      }
    });
    
    return sortAndSlice(merged);
  }
);

export const selectTopRedCards = createSelector(
  [selectPlayerStatsRaw, selectServerStats],
  (stats, serverStats) => {
    const merged = new Map<string, PlayerStat>();
    
    serverStats.redCards.forEach(ps => {
      const canonicalName = resolveName(ps.name);
      const key = normalize(canonicalName);
      const existing = merged.get(key);
      if (existing) {
        existing.count = Math.max(existing.count, ps.count);
      } else {
        merged.set(key, { ...ps, name: canonicalName });
      }
    });
    
    stats.redCards.forEach((ps, key) => {
      const existing = merged.get(key);
      if (!existing || ps.count > existing.count) {
        merged.set(key, ps);
      }
    });
    
    return sortAndSlice(merged);
  }
);

export const selectAllPlayerNames = createSelector(
  [selectPlayerStatsRaw],
  (stats) => {
    // Structure to hold player entries
    interface Entry {
      original: string;
      normalized: string;
      tokens: string[];
      isCanonical: boolean;
      score: number;
    }

    const entries = new Map<string, Entry>();

    // Helper: Normalize name for consistent comparison
    // Removes accents, lowercases, replaces dots with spaces
    const normalize = (s: string) => 
      s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\./g, " ").trim();

    // Helper: Tokenize normalized name
    const tokenize = (norm: string) => norm.split(/\s+/).filter(Boolean);

    // Helper: Calculate score for "quality" of name
    const getScore = (name: string, isCanonical: boolean) => {
      let score = name.length;
      // Bonus for accents (non-ascii)
      // eslint-disable-next-line no-control-regex
      const nonAscii = name.match(/[^\x00-\x7F]/g);
      if (nonAscii) score += nonAscii.length * 2;
      // Huge bonus for canonical
      if (isCanonical) score += 1000;
      return score;
    };

    const addOrUpdate = (name: string, isCanonical: boolean) => {
      if (!name) return;
      const norm = normalize(name);
      if (!norm) return;
      
      const currentScore = getScore(name, isCanonical);
      const existing = entries.get(norm);

      if (!existing) {
        entries.set(norm, {
          original: name,
          normalized: norm,
          tokens: tokenize(norm),
          isCanonical,
          score: currentScore
        });
      } else {
        // If new one is better (e.g. canonical or has accents), update original
        if (currentScore > existing.score) {
          existing.original = name;
          existing.isCanonical = existing.isCanonical || isCanonical; // Once canonical, always canonical
          existing.score = currentScore;
        }
      }
    };

    // 1. Add Canonical Names (High priority)
    TEAM_LIST.forEach(team => {
      team.players?.forEach(p => {
        if (p.name) addOrUpdate(p.name, true);
      });
    });

    // 2. Add Historical Names
    stats.allNames.forEach(rawName => {
      addOrUpdate(rawName, false);
    });

    // 3. Deduplicate / Hide subsets
    // We want to hide entry A if it is a "subset" of entry B, AND B is Canonical.
    // Subset definition: All tokens of A match tokens of B.
    
    const validEntries = Array.from(entries.values());
    const finalNames = new Set<string>();

    validEntries.forEach(entryA => {
      // Check if entryA is covered by any OTHER entryB which is Canonical
      const isCovered = validEntries.some(entryB => {
        if (entryA === entryB) return false; // Don't check against self
        if (!entryB.isCanonical) return false; // Only canonicals can "eat" others (safest bet)

        // Check if A is subset of B
        // Heuristic:
        // 1. If A tokens are subset of B tokens.
        // Match logic: exact match OR (A token is single char prefix of B token)
        
        const allTokensMatch = entryA.tokens.every(tokenA => {
          return entryB.tokens.some(tokenB => {
            if (tokenA === tokenB) return true;
            if (tokenA.length === 1 && tokenB.startsWith(tokenA)) return true;
            return false;
          });
        });

        return allTokensMatch;
      });

      if (!isCovered) {
        finalNames.add(entryA.original);
      }
    });

    return Array.from(finalNames).sort();
  }
);