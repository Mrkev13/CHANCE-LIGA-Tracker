import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Match } from './slices/matchesSlice';

export interface PlayerStat {
  id: string;
  name: string;
  count: number;
  teamId?: string; // Optional: could be useful later
}

const selectMatches = (state: RootState) => state.matches.matches;

const selectPlayerStatsRaw = createSelector(
  [selectMatches],
  (matches) => {
    const goals = new Map<string, PlayerStat>();
    const assists = new Map<string, PlayerStat>();
    const yellowCards = new Map<string, PlayerStat>();
    const redCards = new Map<string, PlayerStat>();

    const updateStat = (map: Map<string, PlayerStat>, id: string, name: string) => {
      const existing = map.get(id);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(id, { id, name, count: 1 });
      }
    };

    matches.forEach((match) => {
      match.events.forEach((event) => {
        if (event.type === 'goal' && event.player) {
          updateStat(goals, event.player.id, event.player.name);
          if (event.assistPlayer) {
            updateStat(assists, event.assistPlayer.id, event.assistPlayer.name);
          }
        } else if (event.type === 'yellow_card' && event.player) {
          updateStat(yellowCards, event.player.id, event.player.name);
        } else if (event.type === 'red_card' && event.player) {
          updateStat(redCards, event.player.id, event.player.name);
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
