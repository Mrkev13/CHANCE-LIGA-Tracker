const axios = require('axios');
const cheerio = require('cheerio');
const winston = require('winston');

// Logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

/**
 * Scrapes a match from onlajny.com
 * @param {string} url 
 * @returns {Promise<Object|null>}
 */
async function scrapeMatch(url) {
  const start = Date.now();
  try {
    const { data: html, status: httpStatus } = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      maxRedirects: 5
    });

    const $ = cheerio.load(html);
    
    // Extract matchId from URL or data attribute
    const matchIdMatch = url.match(/match\/id\/(\d+)/) || url.match(/id=(\d+)/);
    const matchId = matchIdMatch ? matchIdMatch[1] : $('[data-match-id]').attr('data-match-id') || 'unknown';

    const homeTeam = {
      name: $('.team-home .name').text().trim() || $('.team-home-name').text().trim(),
      goals: parseInt($('.score-home').text()) || 0,
      scorers: [],
      cards: [],
      substitutions: []
    };

    const awayTeam = {
      name: $('.team-away .name').text().trim() || $('.team-away-name').text().trim(),
      goals: parseInt($('.score-away').text()) || 0,
      scorers: [],
      cards: [],
      substitutions: []
    };

    // Extract events
    $('.event').each((_, el) => {
      const $el = $(el);
      const minute = parseInt($el.find('.minute').text()) || 0;
      const team = $el.closest('.home').length ? 'home' : 'away';
      const targetTeam = team === 'home' ? homeTeam : awayTeam;

      if ($el.hasClass('goal')) {
        const player = $el.find('.player').text().trim();
        const penalty = $el.text().includes('(pen.)');
        targetTeam.scorers.push({ player, minute, penalty });
      } else if ($el.hasClass('card-y') || $el.hasClass('card-r')) {
        const player = $el.find('.player').text().trim();
        const type = $el.hasClass('card-y') ? 'Y' : 'R';
        targetTeam.cards.push({ player, minute, type });
      } else if ($el.hasClass('subst')) {
        const outPlayer = $el.find('.player-out').text().trim();
        const inPlayer = $el.find('.player-in').text().trim();
        targetTeam.substitutions.push({ out: outPlayer, in: inPlayer, minute });
      }
    });

    // Match status and minute
    const statusText = $('.match-status').text().trim().toUpperCase();
    let matchStatus = 'NS';
    if (statusText.includes('LIVE') || statusText.includes('PROBÍHÁ')) matchStatus = 'LIVE';
    else if (statusText.includes('FINISHED') || statusText.includes('KONEC')) matchStatus = 'FINISHED';
    else if (statusText.includes('HT') || statusText.includes('PŘESTÁVKA')) matchStatus = 'HT';

    const currentMinute = parseInt($('.current-minute').text()) || null;

    const result = {
      matchId,
      homeTeam,
      awayTeam,
      matchStatus,
      currentMinute,
      lastScrapeAt: new Date().toISOString()
    };

    logger.info('Scrape successful', {
      matchId,
      httpStatus,
      duration: Date.now() - start,
      timestamp: new Date().toISOString()
    });

    return result;

  } catch (error) {
    logger.error('Scrape failed', {
      url,
      error: error.message,
      duration: Date.now() - start,
      timestamp: new Date().toISOString()
    });
    return null;
  }
}

module.exports = { scrapeMatch };