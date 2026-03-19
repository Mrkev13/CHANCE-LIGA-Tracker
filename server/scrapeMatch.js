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
  const cleanUrl = url.trim().replace(/[`"']/g, '');
  logger.info('Starting scrape', { url: cleanUrl });
  try {
    const { data: html, status: httpStatus } = await axios.get(cleanUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      maxRedirects: 5
    });

    const $ = cheerio.load(html);
    
    // Extract matchId from URL or data attribute or meta tags
    const matchIdMatch = cleanUrl.match(/\/id\/(\d+)/) || 
                         cleanUrl.match(/id=(\d+)/) || 
                         cleanUrl.match(/-(\d+)\/?$/) ||
                         cleanUrl.match(/\/zapas\/(\d+)/);
    let matchId = matchIdMatch ? matchIdMatch[1] : null;
    
    if (!matchId) {
      matchId = $('[data-match-id]').attr('data-match-id') || 
                $('meta[property="og:url"]').attr('content')?.match(/id=(\d+)/)?.[1] ||
                'unknown';
    }

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

    // Extract events from summary boxes first (more reliable)
    $('.match-info-box, .score-box-summary, .stats-summary, .obsah.goals').each((_, box) => {
      const $box = $(box);
      
      // Look for cards
      $box.find('.yellowCards, .redCards, p[class*="cards_item"]').each((_, cardEl) => {
        const $cardEl = $(cardEl);
        const isYellow = $cardEl.hasClass('yellowCards') || $cardEl.find('.yellowCards').length > 0 || $cardEl.parent().find('.yellowCards').length > 0;
        const isRed = $cardEl.hasClass('redCards') || $cardEl.find('.redCards').length > 0 || $cardEl.parent().find('.redCards').length > 0;
        
        const container = $cardEl.closest('p, .match-info-box, .score-box-summary, .stats-summary, .obsah.goals');
        const fullText = container.text().trim();
        
        // Split by comma or multiple spaces
        const entries = fullText.split(/[,;\s\u00A0]{2,}/); 

        entries.forEach(entry => {
          // Regex for "90+3. Kohút (OVA)" or "10. Kohút"
          const cardMatch = entry.match(/(\d+(?:\+\d+)?)\.\s*([^(\n,]+)(?:\s*\(([^)]+)\))?/);
          if (cardMatch) {
            const minute = cardMatch[1];
            const playerName = cardMatch[2].trim();
            const teamShortcut = cardMatch[3] ? cardMatch[3].trim() : null;
            
            let isHome = true; // Default to home if no shortcut
            if (teamShortcut) {
              const upperShortcut = teamShortcut.toUpperCase();
              isHome = homeTeam.name.toUpperCase().includes(upperShortcut) || 
                       (homeTeam.shortName && homeTeam.shortName.toUpperCase() === upperShortcut);
              
              // If shortcut doesn't match home, check if it matches away
              const isAway = awayTeam.name.toUpperCase().includes(upperShortcut) || 
                             (awayTeam.shortName && awayTeam.shortName.toUpperCase() === upperShortcut);
              
              if (isAway) isHome = false;
            }

            const targetTeam = isHome ? homeTeam : awayTeam;
            
            if (playerName && !/Karty|Branky|Střídání/i.test(playerName)) {
              if (!targetTeam.cards.find(c => c.minute === minute && c.player === playerName)) {
                targetTeam.cards.push({ player: playerName, minute, type: isYellow ? 'Y' : 'R' });
              }
            }
          }
        });
      });

      // Look for goals
      $box.find('span[data-field="scorers"], p[class*="goals_item"]').each((_, scorerEl) => {
        const container = $(scorerEl).closest('p, .obsah.goals');
        const fullText = container.text().trim();
        const entries = fullText.split(/[,;\s\u00A0]{2,}/);
        
        entries.forEach(entry => {
          // Support for "90+3." format
          const goalMatch = entry.match(/(\d+(?:\+\d+)?)\.\s*([^(\n,]+)(?:\s*\(([^)]+)\))?/);
          if (goalMatch) {
            const minute = goalMatch[1];
            const playerName = goalMatch[2].trim();
            const teamShortcut = goalMatch[3] ? goalMatch[3].trim() : null;
            const penalty = /pen\./i.test(entry);
            const ownGoal = /vlastní|own/i.test(entry);

            let isHome = true;
            if (teamShortcut) {
              const upperShortcut = teamShortcut.toUpperCase();
              isHome = homeTeam.name.toUpperCase().includes(upperShortcut);
              const isAway = awayTeam.name.toUpperCase().includes(upperShortcut);
              if (isAway) isHome = false;
            }

            const targetTeam = isHome ? homeTeam : awayTeam;
            
            if (playerName && !/Branky|Karty|Střídání/i.test(playerName)) {
              if (!targetTeam.scorers.find(s => s.minute === minute && s.player === playerName)) {
                targetTeam.scorers.push({ player: playerName, minute, penalty, ownGoal });
              }
            }
          }
        });
      });

      // Original img-based extraction as fallback
      $box.find('img, span[class*="icon-"]').each((_, icon) => {
        const $icon = $(icon);
        const iconSrc = $icon.attr('src') || '';
        const iconClass = $icon.attr('class') || '';
        const parentText = $icon.parent().text().trim();
        const minuteMatch = parentText.match(/(\d+)\./);
        const minute = minuteMatch ? parseInt(minuteMatch[1]) : 0;
        const playerName = parentText.replace(/^\d+\.\s*/, '').split('(')[0].trim();

        const isHome = text.toLowerCase().includes(homeTeam.name.toLowerCase()) || 
                       (teamShort && homeTeam.name.toLowerCase().includes(teamShort.toLowerCase()));
        const targetTeam = isHome ? homeTeam : awayTeam;

        if (iconSrc.includes('goal') || iconClass.includes('goal') || iconClass.includes('icon-goal')) {
          targetTeam.scorers.push({ player: playerName, minute, penalty: parentText.includes('pen.') });
        } else if (iconSrc.includes('yellow-card') || iconClass.includes('card-y') || iconClass.includes('icon-card-y')) {
          targetTeam.cards.push({ player: playerName, minute, type: 'Y' });
        } else if (iconSrc.includes('red-card') || iconClass.includes('card-r') || iconClass.includes('icon-card-r')) {
          targetTeam.cards.push({ player: playerName, minute, type: 'R' });
        }
      });
    });

    // Fallback/Supplement: Extract events from commentary rows
    $('.onlajn .row, .commentary .entry, .event').each((_, el) => {
      const $el = $(el);
      const minute = parseInt($el.find('.time, .minute').text()) || 0;
      const text = $el.find('.text, .content').text().trim();
      const iconImg = $el.find('.icon img, .icon-card-y, .icon-card-r, .icon-goal');
      
      if (iconImg.length > 0 || text.includes('žlutou kartu') || text.includes('vstřelil branku')) {
        const isYellow = iconImg.attr('src')?.includes('yellow') || iconImg.hasClass('icon-card-y') || text.includes('žlutou kartu');
        const isRed = iconImg.attr('src')?.includes('red') || iconImg.hasClass('icon-card-r') || text.includes('červenou kartu');
        const isGoal = iconImg.attr('src')?.includes('goal') || iconImg.hasClass('icon-goal') || text.includes('vstřelil branku');
        const isSubst = iconImg.attr('src')?.includes('subst') || iconImg.hasClass('icon-subst') || text.includes('střídání');

        // Identify team from text shortcuts like (OVA), (HKR)
        const teamMatch = text.match(/\(([A-Z]{2,4})\)/);
        const teamShortcut = teamMatch ? teamMatch[1] : null;
        const isHome = teamShortcut ? homeTeam.name.toUpperCase().includes(teamShortcut) : $el.closest('.home').length > 0;
        const targetTeam = isHome ? homeTeam : awayTeam;

        if (isGoal) {
          const player = text.match(/([A-Z][a-zčřžšýáíé]+ [A-Z][a-zčřžšýáíé]+)/)?.[1] || 'Neznámý střelec';
          if (!targetTeam.scorers.find(s => s.minute === minute)) {
            targetTeam.scorers.push({ player, minute, penalty: text.includes('pen.') });
          }
        } else if (isYellow || isRed) {
          const player = text.match(/([A-Z][a-zčřžšýáíé]+ [A-Z][a-zčřžšýáíé]+)/)?.[1] || 'Neznámý hráč';
          if (!targetTeam.cards.find(c => c.minute === minute)) {
            targetTeam.cards.push({ player, minute, type: isYellow ? 'Y' : 'R' });
          }
        } else if (isSubst) {
          const outMatch = text.match(/odchází ([^,]+)/);
          const inMatch = text.match(/přichází ([^,.]+)/);
          if (outMatch && inMatch) {
            targetTeam.substitutions.push({ out: outMatch[1].trim(), in: inMatch[1].trim(), minute });
          }
        }
      }
    });

    // Remove duplicates that might have been caught by both methods
    const uniqueEvents = (arr) => arr.filter((v, i, a) => a.findIndex(t => JSON.stringify(t) === JSON.stringify(v)) === i);
    homeTeam.scorers = uniqueEvents(homeTeam.scorers);
    homeTeam.cards = uniqueEvents(homeTeam.cards);
    awayTeam.scorers = uniqueEvents(awayTeam.scorers);
    awayTeam.cards = uniqueEvents(awayTeam.cards);

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