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
    const bodyText = $('body').text();
    
    // Extract matchId
    const matchIdMatch = cleanUrl.match(/\/id\/(\d+)/) || 
                         cleanUrl.match(/id=(\d+)/) || 
                         cleanUrl.match(/-(\d+)\/?$/) ||
                         cleanUrl.match(/\/zapas\/(\d+)/);
    let matchId = matchIdMatch ? matchIdMatch[1] : null;
    if (!matchId) {
      matchId = $('[data-match-id]').attr('data-match-id') || 'unknown';
    }

    const cleanStr = (s) => {
      if (!s) return '';
      return s
        .replace(/\s+/g, ' ')
        .replace(/\d+\s*:\s*\d+.*/g, '')
        .replace(/\([^)]*liga[^)]*\)/gi, '')
        .replace(/\|.*/g, '')
        .replace(/:$/g, '')
        .trim();
    };

    // Find team names from Meta tags first (as requested by user)
    let homeName = '';
    let awayName = '';
    
    const ogTitle = $('meta[property="og:title"]').attr('content') || $('title').text();
    // Usually "LIB 1:1 TEP | FC Slovan Liberec - FK Teplice (Chance Liga) | Onlajny.com"
    // We want the part after | and before -
    const fullTitleParts = ogTitle.split('|');
    if (fullTitleParts.length >= 2) {
        const teamPart = fullTitleParts[1].trim();
        const teams = teamPart.split(/[\-\–\—]|vs\.?|–/);
        if (teams.length >= 2) {
            homeName = cleanStr(teams[0]);
            awayName = cleanStr(teams[1]);
        }
    }

    // Fallback: try to find in H1 or labels
    if (!homeName || !awayName) {
        $('p, div, li, h2, h3').each((_, el) => {
            const text = $(el).text().trim();
            if (text.endsWith(':') && text.length > 5 && text.length < 50 && !/Branky|Karty|Střídání|Rozhodčí|Diváci|Sestavy|Penalta|Rozstřel/i.test(text)) {
                if (!homeName) homeName = cleanStr(text);
                else if (!awayName) awayName = cleanStr(text);
            }
        });
    }

    // Final fallback
    if (!homeName || !awayName) {
        const titleParts = ogTitle.split(/[\-\–\—]|vs\.?|–/);
        if (titleParts.length >= 2) {
            if (!homeName) homeName = cleanStr(titleParts[0]);
            if (!awayName) awayName = cleanStr(titleParts[1]);
        }
    }

    const homeTeam = {
      name: homeName,
      goals: 0,
      scorers: [],
      cards: [],
      substitutions: []
    };

    const awayTeam = {
      name: awayName,
      goals: 0,
      scorers: [],
      cards: [],
      substitutions: []
    };

    // Robust score extraction
    const scoreMatch = bodyText.match(/(\d+)\s*:\s*(\d+)/);
    if (scoreMatch) {
      homeTeam.goals = parseInt(scoreMatch[1]);
      awayTeam.goals = parseInt(scoreMatch[2]);
    }

    // Status and Date
    let matchStatus = 'NS';
    if (bodyText.includes('Konec utkání') || bodyText.includes('zápas skončil')) matchStatus = 'FINISHED';
    else if (bodyText.includes('Právě probíhá') || bodyText.includes('LIVE')) matchStatus = 'LIVE';

    let date = null;
    const dateStrMatch = bodyText.match(/(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})/);
    if (dateStrMatch) {
      date = `${dateStrMatch[3]}-${dateStrMatch[2].padStart(2, '0')}-${dateStrMatch[1].padStart(2, '0')}T15:00:00Z`;
    }

    // Helper to parse entries (goals/cards)
    const parseLine = (line, isGoals) => {
      const results = [];
      const sides = line.split(/\s*[\-\–\—]\s*(?=\d)/);
      sides.forEach((sideText, sideIndex) => {
        let defaultSide = (sideIndex === 0 && sides.length > 1) ? 'home' : 'away';
        const entries = sideText.split(/\s*[,;]\s*|\s{2,}/);
        entries.forEach(entry => {
          if (!entry.trim() || entry === '-' || entry === '–') return;
          if (!isGoals && /asistent trenéra|trenér|trenér brankářů|vedoucí mužstva/i.test(entry)) return;

          const match = entry.match(/(\d+(?:\+\d+)?)(?:'|\.)?\s*([^(\n,\-\–\—]+)(?:\s*\(([^)]+)\))?/);
          if (match) {
            const minute = match[1];
            let player = match[2].trim().replace(/\s*\([A-Z]{2,4}\)/g, '').trim();
            const note = match[3] ? match[3].trim() : '';

            let finalSide = defaultSide;
            if (note && note.length <= 4 && /^[A-Z]+$/.test(note)) {
              if (homeTeam.name.toUpperCase().includes(note.toUpperCase())) finalSide = 'home';
              else if (awayTeam.name.toUpperCase().includes(note.toUpperCase())) finalSide = 'away';
            }

            if (isGoals) {
              const isPenalty = /pen\./i.test(entry) || /pen\./i.test(note);
              const isOwnGoal = /vlastní/i.test(entry) || /vlastní/i.test(note);
              const assist = (!isPenalty && !isOwnGoal && note && note.length > 3) ? note : null;
              player = player.replace(/\s*\(?pen\.?\)?/gi, '').replace(/\s*\(?vlastní\)?/gi, '').trim();
              results.push({ player, minute, side: finalSide, penalty: isPenalty, ownGoal: isOwnGoal, assist });
            } else {
              results.push({ player, minute, side: finalSide, entry });
            }
          }
        });
      });
      return results;
    };

    // Extract Goals & Cards from any element containing them
    $('p, div, li').each((_, el) => {
        const $el = $(el);
        const text = $el.text().trim();
        
        if (text.toLowerCase().includes('branky:') && text.length < 2000) {
            const line = text.match(/Branky:\s*(.*?)(?=\n|Karty:|$)/si)?.[1] || text.replace(/.*Branky:\s*/i, '');
            const goals = parseLine(line.trim(), true);
            goals.forEach(g => {
                const target = g.side === 'home' ? homeTeam : awayTeam;
                if (!target.scorers.find(s => s.minute === g.minute && s.player === g.player)) {
                    logger.info('Goal detected', g);
                    target.scorers.push({ player: g.player, minute: g.minute, penalty: g.penalty, ownGoal: g.ownGoal, assist: g.assist });
                }
            });
        }
        
        if (text.toLowerCase().includes('karty:') && text.length < 2000) {
            const line = text.match(/Karty:\s*(.*?)(?=\n|Sestavy|Neproměněná|$)/si)?.[1] || text.replace(/.*Karty:\s*/i, '');
            const cards = parseLine(line.trim(), false);
            const html = $el.html() || '';
            cards.forEach(c => {
                const target = c.side === 'home' ? homeTeam : awayTeam;
                const nameEscaped = c.player.replace(/[-\/\^$*+?.()|[\]{}]/g, '\$&');
                // Red card detection: more aggressive check in HTML and text
                const isRed = c.entry.toLowerCase().includes('červená') || 
                            c.entry.toLowerCase().includes('2.žk') ||
                            c.entry.toLowerCase().includes('čk') ||
                            line.toLowerCase().includes(`${c.player.toLowerCase()} (2.žk=čk)`) ||
                            /card-(r|yr|y2r)/i.test(html) && new RegExp(`${nameEscaped}.*?card-(r|yr|y2r)|card-(r|yr|y2r).*?${nameEscaped}`, 'i').test(html);
                if (!target.cards.find(card => card.minute === c.minute && card.player === c.player)) {
                    logger.info('Card detected', { player: c.player, minute: c.minute, type: isRed ? 'R' : 'Y', side: c.side });
                    target.cards.push({ player: c.player, minute: c.minute, type: isRed ? 'R' : 'Y' });
                }
            });
        }
    });

    // Supplement/Fix red cards from ANY element in the body
    $('p, div, li, span, tr').each((_, el) => {
        const text = $(el).text().trim();
        // Look for things like "87. Fully (2.ŽK=ČK)" or "87. min: Fully vyloučen"
        if ((text.includes('2.ŽK=ČK') || text.includes('ČK') || text.includes('vyloučen')) && text.length < 500) {
            const minuteMatch = text.match(/(\d+)/);
            if (minuteMatch) {
                const minute = minuteMatch[1];
                [homeTeam, awayTeam].forEach(team => {
                    team.cards.forEach(card => {
                        if (card.minute === minute) {
                            card.type = 'R';
                            logger.info('Red card fixed from reportage', { player: card.player, minute });
                        }
                    });
                });
            }
        }
    });

    const result = {
      matchId,
      homeTeam,
      awayTeam,
      matchStatus,
      currentMinute: parseInt($('.current-minute').text()) || null,
      date,
      stadium: cleanStr($('.match-stadium').text() || bodyText.match(/Stadion.*?,(.*?)(?=\n|$)/)?.[1]),
      round: (bodyText.match(/(\d+)\.\s*kolo/) || [])[1],
      lastScrapeAt: new Date().toISOString()
    };

    logger.info('Scrape successful', { matchId, home: homeTeam.name, away: awayTeam.name, score: `${homeTeam.goals}:${awayTeam.goals}` });
    return result;

  } catch (error) {
    logger.error('Scrape failed', { url, error: error.message });
    return null;
  }
}

module.exports = { scrapeMatch };
