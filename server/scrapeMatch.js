const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('./utils/logger');

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

    // NEW: Robust extraction from lineups if substitutions are missing from summary
    const parseLineupsForSubs = ($, hName, aName) => {
      const subs = { home: [], away: [] };
      
      const hNorm = hName.toLowerCase().replace(/^(fc|sk|ac|fk|1\.)\s*/gi, '').trim();
      const aNorm = aName.toLowerCase().replace(/^(fc|sk|ac|fk|1\.)\s*/gi, '').trim();

      logger.info('Searching lineups for subs', { hNorm, aNorm });

      const extractFromText = (t, side) => {
        const matches = t.matchAll(/([^,–—:\n\r()]+)\s*\((\d{1,2}(?:\+\d+)?)\.?\s*([^)]+)\)/g);
        for (const m of matches) {
          let pOut = cleanStr(m[1]);
          const min = m[2];
          let pIn = cleanStr(m[3]);
          if (/^(GK|C|B|ŽK|ČK|trenér|rozhodčí|diváci)$/i.test(pIn) || pIn.length < 2) continue;
          if (pOut.includes(':')) pOut = pOut.split(':').pop().trim();
          if (pOut && pIn && min) {
            if (!subs[side].find(s => s.minute === min && s.out === pOut)) {
              logger.info('Lineup sub found', { side, min, pOut, pIn });
              subs[side].push({ minute: min, out: pOut, in: pIn });
            }
          }
        }
      };

      // Find the lineups in all likely elements
      $('p, div, li, strong, b').each((_, el) => {
        const $el = $(el);
        const text = $el.text().trim();
        const textNorm = text.toLowerCase();
        
        if (text.length > 3000 || text.includes('function') || text.includes('$(')) return;

        const hPos = textNorm.indexOf(hNorm + ':');
        const aPos = textNorm.indexOf(aNorm + ':');

        if (hPos !== -1 || aPos !== -1) {
          // Case where both lineups are in the same element
          if (hPos !== -1 && aPos !== -1) {
            const first = hPos < aPos ? { side: 'home', start: hPos, end: aPos } : { side: 'away', start: aPos, end: hPos };
            const second = hPos < aPos ? { side: 'away', start: aPos, end: text.length } : { side: 'home', start: hPos, end: text.length };
            
            extractFromText(text.substring(first.start, first.end), first.side);
            extractFromText(text.substring(second.start, second.end), second.side);
          } else {
            // Only one lineup in this element
            const side = hPos !== -1 ? 'home' : 'away';
            extractFromText(text, side);
          }
        }
      });
      
      return subs;
    };

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

    const parseLine = (line, isGoals) => {
      const results = [];
      // Splits teams by - or –
      // Important: handle cases where only one team is listed or separator is missing
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
            
            // IMPROVED SIDE DETECTION: Look for (ZLN) or (SLA) in the entry or note
            const teamIdMatch = entry.match(/\(([A-Z]{3})\)/) || (note && note.match(/^([A-Z]{3})$/));
            if (teamIdMatch) {
                const teamCode = teamIdMatch[1].toUpperCase();
                // Check against TEAM_ALIASES to find full name, then check if it's home or away
                const { TEAM_ALIASES } = require('./utils/constants');
                const fullName = TEAM_ALIASES[teamCode];
                if (fullName) {
                    if (homeTeam.name.includes(fullName) || fullName.includes(homeTeam.name)) finalSide = 'home';
                    else if (awayTeam.name.includes(fullName) || fullName.includes(awayTeam.name)) finalSide = 'away';
                } else {
                    // Fallback to simple string match
                    if (homeTeam.name.toUpperCase().includes(teamCode)) finalSide = 'home';
                    else if (awayTeam.name.toUpperCase().includes(teamCode)) finalSide = 'away';
                }
            } else if (note && note.length <= 4 && /^[A-Z]+$/.test(note)) {
                if (homeTeam.name.toUpperCase().includes(note.toUpperCase())) finalSide = 'home';
                else if (awayTeam.name.toUpperCase().includes(note.toUpperCase())) finalSide = 'away';
            }

            if (isGoals) {
              const isPenalty = /pen\./i.test(entry) || /pen\./i.test(note) || entry.includes('pk');
              const isOwnGoal = /vlastní/i.test(entry) || /vlastní/i.test(note) || entry.includes('vl.');
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

    const parseSubs = (line) => {
      const results = [];
      // Splits teams by - or –
      const sides = line.split(/\s*[\-\–\—]\s*(?=\d|\()/);
      sides.forEach((sideText, sideIndex) => {
        let defaultSide = (sideIndex === 0 && sides.length > 1) ? 'home' : 'away';
        // Splits individual subs: 60. Out (In)
        const entries = sideText.split(/\s*[,;]\s*|\s{2,}/);
        entries.forEach(entry => {
          if (!entry.trim() || entry === '-' || entry === '–') return;
          
          let finalSide = defaultSide;
          // Team ID check from (LIB) note or at start of entry
          const teamPrefixMatch = entry.match(/^\s*\(([A-Z]{2,4})\)\s*/);
          if (teamPrefixMatch) {
             const teamId = teamPrefixMatch[1];
             entry = entry.replace(/^\s*\(([A-Z]{2,4})\)\s*/, '');
             if (homeTeam.name.toUpperCase().includes(teamId)) finalSide = 'home';
             else if (awayTeam.name.toUpperCase().includes(teamId)) finalSide = 'away';
          }

          // Match 60. Out (In)
          const subMatch = entry.match(/(\d+(?:\+\d+)?)(?:'|\.)?\s*([^(\n,\-\–\—]+)(?:\s*\(([^)]+)\))?/);
          if (subMatch) {
              const minute = subMatch[1];
              let out = subMatch[2].trim();
              let in_ = subMatch[3] ? subMatch[3].trim() : '';
              
              if (in_) {
                  results.push({ minute, out, in: in_, side: finalSide });
              }
          }
        });
      });
      return results;
    };

    // Extract Goals, Cards & Subs from any element containing them
    $('p, div, li').each((_, el) => {
        const $el = $(el);
        const text = $el.text().trim();
        
        if (text.toLowerCase().includes('branky:') && text.length < 2000) {
            const line = text.match(/Branky:\s*(.*?)(?=\n|Karty:|Střídání|$)/si)?.[1] || text.replace(/.*Branky:\s*/i, '');
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
            const line = text.match(/Karty:\s*(.*?)(?=\n|Sestavy|Střídání|Neproměněná|$)/si)?.[1] || text.replace(/.*Karty:\s*/i, '');
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

        if (text.toLowerCase().includes('střídání:') && text.length < 2000) {
            const line = text.match(/Střídání:\s*(.*?)(?=\n|Sestavy|Rozhodčí|$)/si)?.[1] || text.replace(/.*Střídání:\s*/i, '');
            const subs = parseSubs(line.trim());
            subs.forEach(s => {
                const target = s.side === 'home' ? homeTeam : awayTeam;
                if (!target.substitutions.find(sub => sub.minute === s.minute && sub.out === s.out)) {
                    logger.info('Substitution detected', s);
                    target.substitutions.push({ minute: s.minute, in: s.in, out: s.out });
                }
            });
        }
    });

    // Fallback: Parse lineups if no subs were found in the summary
    if (homeTeam.substitutions.length === 0 && awayTeam.substitutions.length === 0) {
      const lineupSubs = parseLineupsForSubs($, homeName, awayName);
      lineupSubs.home.forEach(s => homeTeam.substitutions.push(s));
      lineupSubs.away.forEach(s => awayTeam.substitutions.push(s));
      if (homeTeam.substitutions.length > 0 || awayTeam.substitutions.length > 0) {
        logger.info('Substitutions extracted from lineups', { 
          home: homeTeam.substitutions.length, 
          away: awayTeam.substitutions.length 
        });
      }
    }

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
