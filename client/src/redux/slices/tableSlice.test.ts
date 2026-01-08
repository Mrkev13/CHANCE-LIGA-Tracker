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

test('skips invalid scores and duplicates', () => {
  const invalid = [
    { id: 'x1', homeTeam: { id: 'A', name: 'A', logo: '' }, awayTeam: { id: 'B', name: 'B', logo: '' }, score: { home: NaN, away: 1 }, status: 'finished', date: '2025-01-03T00:00:00Z', stadium: '', events: [] },
    { id: 'x2', homeTeam: { id: 'A', name: 'A', logo: '' }, awayTeam: { id: 'B', name: 'B', logo: '' }, score: { home: 2, away: 0 }, status: 'finished', date: '2025-01-04T00:00:00Z', stadium: '', events: [] },
    { id: 'x2', homeTeam: { id: 'A', name: 'A', logo: '' }, awayTeam: { id: 'B', name: 'B', logo: '' }, score: { home: 2, away: 0 }, status: 'finished', date: '2025-01-04T00:00:00Z', stadium: '', events: [] }
  ] as any;
  const table = computeTableFromMatches(invalid);
  const teamA = table.find(t => t.team.id === 'A')!;
  const teamB = table.find(t => t.team.id === 'B')!;
  expect(teamA.points).toBe(3);
  expect(teamB.points).toBe(0);
  expect(teamA.played).toBe(1);
  expect(teamB.played).toBe(1);
});

test('returns consistent results across repeated calls', () => {
  const input = [
    { id: 'y1', homeTeam: { id: 'A', name: 'A', logo: '' }, awayTeam: { id: 'B', name: 'B', logo: '' }, score: { home: 1, away: 1 }, status: 'finished', date: '2025-01-05T00:00:00Z', stadium: '', events: [] },
    { id: 'y2', homeTeam: { id: 'C', name: 'C', logo: '' }, awayTeam: { id: 'A', name: 'A', logo: '' }, score: { home: 0, away: 2 }, status: 'finished', date: '2025-01-06T00:00:00Z', stadium: '', events: [] }
  ] as any;
  const t1 = computeTableFromMatches(input);
  const t2 = computeTableFromMatches(input);
  expect(JSON.stringify(t1)).toBe(JSON.stringify(t2));
});
