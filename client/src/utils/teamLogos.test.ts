import { test, expect } from '@jest/globals';
import { getTeamLogo } from './teamLogos';

test('maps normalized names to correct logos', () => {
  expect(getTeamLogo('Slavia Praha')).toBe('/slavia.png');
  expect(getTeamLogo('Sparta Praha')).toBe('/sparta.png');
  expect(getTeamLogo('1. FC Slovácko')).toBe('/slovacko.png');
  expect(getTeamLogo('1 fc slovacko')).toBe('/slovacko.png');
  expect(getTeamLogo('Slovan Liberec')).toBe('/liberec.png');
  expect(getTeamLogo('Dukla Praha')).toBe('/dukla.png');
});

test('falls back to original when not mapped', () => {
  expect(getTeamLogo('Unknown FC', '/custom.png')).toBe('/custom.png');
});

test('falls back to default when neither mapped nor original provided', () => {
  expect(getTeamLogo('Unknown FC')).toBe('/logo192.png');
});
