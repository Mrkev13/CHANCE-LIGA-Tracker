const nock = require('nock');
const fs = require('fs');
const path = require('path');
const { scrapeMatch } = require('../scrapeMatch');

describe('scrapeMatch', () => {
  const url = 'https://www.onlajny.com/match/id/123456';
  const fixturePath = path.join(__dirname, 'match_fixture.html');
  const fixtureHtml = fs.readFileSync(fixturePath, 'utf8');

  afterEach(() => {
    nock.cleanAll();
  });

  test('should correctly scrape match data from fixture', async () => {
    nock('https://www.onlajny.com')
      .get('/match/id/123456')
      .reply(200, fixtureHtml);

    const result = await scrapeMatch(url);

    expect(result).not.toBeNull();
    expect(result.matchId).toBe('123456');
    expect(result.homeTeam.name).toBe('Slavia Praha');
    expect(result.homeTeam.goals).toBe(2);
    expect(result.awayTeam.name).toBe('Sparta Praha');
    expect(result.awayTeam.goals).toBe(1);
    expect(result.matchStatus).toBe('LIVE');
    expect(result.currentMinute).toBe(75);

    // Scorer
    expect(result.homeTeam.scorers).toContainEqual({
      player: 'David Douděra',
      minute: 12,
      penalty: false
    });
    expect(result.awayTeam.scorers).toContainEqual({
      player: 'Lars Friis',
      minute: 55,
      penalty: true
    });

    // Cards
    expect(result.homeTeam.cards).toContainEqual({
      player: 'Jan Bořil',
      minute: 45,
      type: 'Y'
    });
    expect(result.awayTeam.cards).toContainEqual({
      player: 'Ladislav Krejčí',
      minute: 88,
      type: 'R'
    });

    // Substitution
    expect(result.homeTeam.substitutions).toContainEqual({
      out: 'Ivan Schranz',
      in: 'Mojmír Chytil',
      minute: 60
    });
  });

  test('should return null on network error', async () => {
    nock('https://www.onlajny.com')
      .get('/match/id/123456')
      .replyWithError('Network error');

    const result = await scrapeMatch(url);
    expect(result).toBeNull();
  });

  test('should handle missing data gracefully', async () => {
    nock('https://www.onlajny.com')
      .get('/match/id/123456')
      .reply(200, '<html><body>Empty</body></html>');

    const result = await scrapeMatch(url);
    expect(result).not.toBeNull();
    expect(result.homeTeam.goals).toBe(0);
    expect(result.matchStatus).toBe('NS');
  });
});