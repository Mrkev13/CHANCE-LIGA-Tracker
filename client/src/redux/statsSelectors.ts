import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Match } from './slices/matchesSlice';
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

const selectPlayerStatsRaw = createSelector(
  [selectMatches],
  (matches) => {
    const goals = new Map<string, PlayerStat>();
    const assists = new Map<string, PlayerStat>();
    const yellowCards = new Map<string, PlayerStat>();
    const redCards = new Map<string, PlayerStat>();
    const allNames = new Set<string>();

    // Canonical Name Resolution Logic
    const canonicalMap = new Map<string, string>();
    const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    const toShort = (s: string) => {
        const parts = s.trim().split(/\s+/);
        if (parts.length < 2) return s;
        const surname = parts.slice(1).join(' ');
        const firstname = parts[0];
        return `${surname} ${firstname.charAt(0)}.`; 
    };

    TEAM_LIST.forEach(team => {
      team.players?.forEach(p => {
        if (p.name) {
          const normFull = normalize(p.name);
          const normShort = normalize(toShort(p.name));
          canonicalMap.set(normFull, p.name);
          canonicalMap.set(normShort, p.name);
          if (normShort.endsWith('.')) {
              canonicalMap.set(normShort.slice(0, -1), p.name);
          }
        }
      });
    });

    const resolveName = (name: string) => {
        if (!name) return '';
        const norm = normalize(name);
        return canonicalMap.get(norm) || name.trim();
    };

    const updateStat = (
      map: Map<string, PlayerStat>,
      originalId: string, // ID z eventu (může být náhodné)
      name: string,
      teamId?: string,
      teamName?: string,
      roundNum?: number,
      dateIso?: string
    ) => {
      // Použijeme jméno jako klíč pro agregaci, aby se sloučily statistiky 
      // hráče i když má v různých zápasech různé vygenerované ID.
      const key = resolveName(name); 
      allNames.add(key);
      
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
        const prevRound = existing.lastRound ?? -1;
        const prevDate = existing.lastDate ?? '';
        const isNewerRound = (roundNum ?? -1) > prevRound;
        const isSameRoundNewerDate = (roundNum ?? -1) === prevRound && (dateIso ?? '') > prevDate;
        if (isNewerRound || isSameRoundNewerDate) {
          existing.teamId = teamId;
          existing.teamName = teamName;
          existing.lastRound = roundNum;
          existing.lastDate = dateIso;
        }
      } else {
        // Použijeme originalId, ale pokud jich bude víc, zůstane to první.
        // To nevadí, pro zobrazení potřebujeme hlavně jméno a počet.
        map.set(key, { id: originalId, name, count: 1, teamId, teamName, lastRound: roundNum, lastDate: dateIso });
      }
    };

    matches.forEach((match) => {
      const roundNum = match.round ? Number(match.round) : 0;
      const dateIso = match.date;
      match.events.forEach((event) => {
        const tId = event.team === 'home' ? match.homeTeam.id : match.awayTeam.id;
        const tName = event.team === 'home' ? match.homeTeam.name : match.awayTeam.name;

        // Collect names from all events
        if (event.player?.name) allNames.add(resolveName(event.player.name));
        if (event.assistPlayer?.name) allNames.add(resolveName(event.assistPlayer.name));
        if (event.playerIn?.name) allNames.add(resolveName(event.playerIn.name));
        if (event.playerOut?.name) allNames.add(resolveName(event.playerOut.name));

        if (event.type === 'goal' && event.player) {
          updateStat(goals, event.player.id, event.player.name, tId, tName, roundNum, dateIso);
          if (event.assistPlayer) {
            updateStat(assists, event.assistPlayer.id, event.assistPlayer.name, tId, tName, roundNum, dateIso);
          }
        } else if (event.type === 'yellow_card' && event.player) {
          updateStat(yellowCards, event.player.id, event.player.name, tId, tName, roundNum, dateIso);
        } else if (event.type === 'red_card' && event.player) {
          updateStat(redCards, event.player.id, event.player.name, tId, tName, roundNum, dateIso);
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
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const selectTopScorers = createSelector(
  [selectPlayerStatsRaw],
  (stats) => sortAndSlice(stats.goals)
);

export const selectTopAssists = createSelector(
  [selectPlayerStatsRaw],
  (stats) => sortAndSlice(stats.assists)
);

export const selectTopYellowCards = createSelector(
  [selectPlayerStatsRaw],
  (stats) => sortAndSlice(stats.yellowCards)
);

export const selectTopRedCards = createSelector(
  [selectPlayerStatsRaw],
  (stats) => sortAndSlice(stats.redCards)
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
