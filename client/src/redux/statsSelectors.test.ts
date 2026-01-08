import { describe, it, expect } from '@jest/globals';
import { selectTopScorers, selectTopAssists, selectTopYellowCards } from './statsSelectors';
import { RootState } from './store';
import { Match } from './slices/matchesSlice';

describe('statsSelectors', () => {
  const mockMatches: Match[] = [
    {
      id: 'm1',
      homeTeam: { id: 'h1', name: 'Home', logo: '' },
      awayTeam: { id: 'a1', name: 'Away', logo: '' },
      score: { home: 1, away: 0 },
      status: 'finished',
      date: '2025-01-01',
      stadium: 'Stadium',
      events: [
        {
          id: 'e1',
          type: 'goal',
          minute: 10,
          team: 'home',
          player: { id: 'p1', name: 'Player 1' },
          assistPlayer: { id: 'p2', name: 'Player 2' }
        },
        {
          id: 'e2',
          type: 'goal',
          minute: 20,
          team: 'home',
          player: { id: 'p1', name: 'Player 1' }
        },
        {
          id: 'e3',
          type: 'yellow_card',
          minute: 30,
          team: 'away',
          player: { id: 'p3', name: 'Player 3' }
        }
      ]
    }
  ];

  const mockState = {
    matches: {
      matches: mockMatches
    }
  } as unknown as RootState;

  it('selects top scorers correctly', () => {
    const scorers = selectTopScorers(mockState);
    expect(scorers).toHaveLength(1);
    expect(scorers[0]).toEqual({ id: 'p1', name: 'Player 1', count: 2 });
  });

  it('selects top assists correctly', () => {
    const assists = selectTopAssists(mockState);
    expect(assists).toHaveLength(1);
    expect(assists[0]).toEqual({ id: 'p2', name: 'Player 2', count: 1 });
  });

  it('selects yellow cards correctly', () => {
    const cards = selectTopYellowCards(mockState);
    expect(cards).toHaveLength(1);
    expect(cards[0]).toEqual({ id: 'p3', name: 'Player 3', count: 1 });
  });
});
