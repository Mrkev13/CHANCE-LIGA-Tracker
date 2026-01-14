import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Match } from './slices/matchesSlice';

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

    const updateStat = (
      map: Map<string, PlayerStat>,
      id: string,
      name: string,
      teamId?: string,
      teamName?: string,
      roundNum?: number,
      dateIso?: string
    ) => {
      const existing = map.get(id);
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
        map.set(id, { id, name, count: 1, teamId, teamName, lastRound: roundNum, lastDate: dateIso });
      }
    };

    matches.forEach((match) => {
      const roundNum = match.round ? Number(match.round) : 0;
      const dateIso = match.date;
      match.events.forEach((event) => {
        const tId = event.team === 'home' ? match.homeTeam.id : match.awayTeam.id;
        const tName = event.team === 'home' ? match.homeTeam.name : match.awayTeam.name;
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
      redCards
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
