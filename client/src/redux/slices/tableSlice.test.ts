import { test, expect } from '@jest/globals';
import { computeTableFromMatches } from './tableSlice';

const sample = [
  {
    id: 'm1',
    homeTeam: { id: 'A', name: 'A', logo: '' },
    awayTeam: { id: 'B', name: 'B', logo: '' },
    score: { home: 2, away: 1 },
    status: 'finished',
    date: '2025-01-01T00:00:00Z',
    stadium: '',
    events: []
  },
  {
    id: 'm2',
    homeTeam: { id: 'B', name: 'B', logo: '' },
    awayTeam: { id: 'C', name: 'C', logo: '' },
    score: { home: 0, away: 0 },
    status: 'finished',
    date: '2025-01-02T00:00:00Z',
    stadium: '',
    events: []
  }
] as any;

test('computes table points and ordering', () => {
  const table = computeTableFromMatches(sample);
  const teamA = table.find(t => t.team.id === 'A')!;
  const teamB = table.find(t => t.team.id === 'B')!;
  const teamC = table.find(t => t.team.id === 'C')!;
  expect(teamA.points).toBe(3);
  expect(teamB.points).toBe(1);
  expect(teamC.points).toBe(1);
  expect(teamA.played).toBe(1);
  expect(teamB.played).toBe(2);
  expect(teamC.played).toBe(1);
});
