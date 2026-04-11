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
        // Handle cases like "Player (C) (45. Sub)" or "Player (45. Sub1, 90. Sub2)"
        // First, normalize names by removing (C) temporarily for matching if needed, 
        // or just allow (C) in the name part
        const matches = t.matchAll(/([^,–—:\n\r]+?)\s*(?:\(C\))?\s*\((\d{1,2}(?:\+\d+)?)\.?\s*([^)]+)\)/g);
        for (const m of matches) {
          let pOut = cleanStr(m[1]);
          const minPart = m[2];
          const inPart = m[3];
          
          // inPart could be "Nyarko, 90. Auta"
          const inMatches = inPart.split(/[,;]\s*/);
          let currentOut = pOut;
          
          inMatches.forEach((inEntry, idx) => {
            // Check if this entry itself has a minute (sub of a sub)
            const subSubMatch = inEntry.match(/(\d{1,2}(?:\+\d+)?)\.?\s*(.*)/);
            if (subSubMatch) {
              const subMin = subSubMatch[1];
              const subIn = cleanStr(subSubMatch[2]);
              if (subIn && subIn.length > 2) {
                if (!subs[side].find(s => s.minute === subMin && s.in === subIn)) {
                  subs[side].push({ minute: subMin, out: currentOut, in: subIn });
                }
                currentOut = subIn; // Next sub in this chain will be from this player
              }
            } else if (idx === 0) {
              // First entry in parenthesis, use the outer minute
              const subIn = cleanStr(inEntry);
              if (subIn && subIn.length > 2) {
                if (!subs[side].find(s => s.minute === minPart && s.in === subIn)) {
                  subs[side].push({ minute: minPart, out: currentOut, in: subIn });
                }
                currentOut = subIn;
              }
            }
          });
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
      line = line.replace(/&nbsp;/g, ' ').trim();
      
      // Split by sides first
      const sides = line.split(/\s+[\-\–\—]\s+(?=\d)/);
      
      sides.forEach((sideText, sideIndex) => {
        let defaultSide = (sideIndex === 0 && sides.length > 1) ? 'home' : (sides.length === 1 ? 'home' : 'away');
        
        // NEW: Robust splitting by commas, multiple spaces OR by a minute pattern (e.g., " 60." or " 90+7.")
        // This ensures that even if commas are missing, we split the players correctly.
        const entries = sideText.split(/\s*[,;]\s*|\s{2,}|(?=\s\d{1,2}(?:\+\d+)?(?:\.|'))/).filter(e => e.trim());
        
        entries.forEach(entry => {
          entry = entry.trim();
          if (!entry || entry === '-' || entry === '–') return;
          if (!isGoals && /asistent trenéra|trenér|trenér brankářů|vedoucí mužstva/i.test(entry)) return;

          const match = entry.match(/^(\d{1,2}(?:\+\d+)?)(?:'|\.)?\s*(.*)/);
          if (match) {
            const minute = match[1];
            let rest = match[2].trim();
            rest = rest.replace(/^(\(?\d+\s*:\s*\d+\)?\.?\s*)/, '').trim();

            const playerMatch = rest.match(/^([^(\n,\-\–\—]+)(?:\s*\(([^)]+)\))?/);
            if (!playerMatch) return;

            let player = cleanStr(playerMatch[1]);
            const note = playerMatch[2] ? playerMatch[2].trim() : '';

            if (player && player.length > 2 && !/^\d+\s*:\s*\d+$/.test(player)) {
                let finalSide = defaultSide;
                
                const teamIdMatch = entry.match(/\(([A-Z]{3,4})\)/) || (note && note.match(/^([A-Z]{3,4})$/));
                if (teamIdMatch) {
                    const teamCode = teamIdMatch[1].toUpperCase();
                    const { TEAM_ALIASES } = require('./utils/constants');
                    const fullName = TEAM_ALIASES[teamCode];
                    if (fullName) {
                        if (homeName.includes(fullName) || fullName.includes(homeName)) finalSide = 'home';
                        else if (awayName.includes(fullName) || fullName.includes(awayName)) finalSide = 'away';
                    }
                }

                if (isGoals) {
                  const isPenalty = /pen\./i.test(entry) || /pen\./i.test(note) || entry.includes('pk');
                  const isOwnGoal = /vlastní/i.test(entry) || /vlastní/i.test(note) || entry.includes('vl.');
                  const assist = (!isPenalty && !isOwnGoal && note && note.length > 3) ? note : null;
                  player = player.replace(/\s*\(?pen\.?\)?/gi, '').replace(/\s*\(?vlastní\)?/gi, '').trim();
                  results.push({ player, minute, side: finalSide, penalty: isPenalty, ownGoal: isOwnGoal, assist });
                } else {
                  // For cards, we also include the entry text to check for ŽK/ČK later
                  results.push({ player, minute, side: finalSide, entry });
                }
            }
          }
        });
      });
      return results;
    };

    const parseSubs = (line) => {
      const results = [];
      const sides = line.split(/\s+[\-\–\—]\s+(?=\d)/);
      sides.forEach((sideText, sideIndex) => {
        let defaultSide = (sideIndex === 0 && sides.length > 1) ? 'home' : (sides.length === 1 ? 'home' : 'away');
        const entries = sideText.split(/\s*[,;]\s*|\s{2,}/);
        
        entries.forEach(entry => {
          if (!entry.trim() || entry === '-' || entry === '–') return;
          
          let finalSide = defaultSide;
          const teamPrefixMatch = entry.match(/^\s*\(([A-Z]{2,4})\)\s*/);
          if (teamPrefixMatch) {
             const teamId = teamPrefixMatch[1];
             entry = entry.replace(/^\s*\(([A-Z]{2,4})\)\s*/, '');
             if (homeName.toUpperCase().includes(teamId)) finalSide = 'home';
             else if (awayName.toUpperCase().includes(teamId)) finalSide = 'away';
          }

          // Format: "Minute. In (odchod: Out)" OR "Minute. In (Out)"
          const subMatch = entry.match(/(\d{1,2}(?:\+\d+)?)(?:'|\.)?\s*([^(\n,\-\–\—]+)(?:\s*\(([^)]+)\))?/);
          if (subMatch) {
              const minute = subMatch[1];
              // Improved name cleaning: remove leading/embedded minutes like "84. Name"
              let p1 = cleanStr(subMatch[2]).replace(/^\d+\.?\s*/, '').trim();
              let p2 = subMatch[3] ? cleanStr(subMatch[3]).replace(/odchod:\s*/i, '').replace(/^\d+\.?\s*/, '').trim() : '';
              
              // Clarification from user: First name is IN, Second (parenthesis) is OUT
              let in_ = p1;
              let out = p2;

              if (in_ && out && in_.length > 2 && out.length > 2) {
                  results.push({ minute, in: in_, out, side: finalSide });
              } else if (in_ && in_.length > 2) {
                  // Fallback for cases with only one name
                  results.push({ minute, in: in_, out: '?', side: finalSide });
              }
          }
        });
      });
      return results;
    };

    const processedTexts = new Set();

    $('p, div, li').each((_, el) => {
        const $el = $(el);
        const text = $el.text().trim();
        if (!text || text.length > 2000 || processedTexts.has(text)) return;
        
        const textLower = text.toLowerCase();
        let foundSomething = false;

        if (textLower.includes('branky:')) {
            const lineMatch = text.match(/Branky:\s*(.*?)(?=\n|Karty:|ŽK:|ČK:|Střídání|Sestavy|$)/si);
            if (lineMatch) {
                const goals = parseLine(lineMatch[1].trim(), true);
                goals.forEach(g => {
                    const target = g.side === 'home' ? homeTeam : awayTeam;
                    if (!target.scorers.find(s => s.minute === g.minute && s.player === g.player)) {
                        target.scorers.push({ player: g.player, minute: g.minute, penalty: g.penalty, ownGoal: g.ownGoal, assist: g.assist });
                    }
                });
                foundSomething = true;
            }
        }
        
        if (textLower.includes('karty:') || textLower.includes('žk:') || textLower.includes('čk:')) {
            const lineMatch = text.match(/(?:Karty|ŽK|ČK):\s*(.*?)(?=\n|Sestavy|Střídání|Neproměněná|Branky|$)/si);
            if (lineMatch) {
                const cardEntries = parseLine(lineMatch[1].trim(), false);
                const html = $el.html() || '';
                
                cardEntries.forEach(c => {
                    const target = c.side === 'home' ? homeTeam : awayTeam;
                    
                    // Robust check for card types in summary text
                    const entryLower = c.entry.toLowerCase();
                    const explicitRed = entryLower.includes('červená') || entryLower.includes('2.žk') || entryLower.includes('čk');
                    const explicitYellow = entryLower.includes('žlutá') || entryLower.includes('žk');
                    
                    let isRed = explicitRed;
                    let isYellow = explicitYellow;
                    
                    // If no explicit text, find the icon closest to the name in the summary HTML
                    if (!isRed && !isYellow) {
                        const namePos = html.indexOf(c.player);
                        if (namePos !== -1) {
                            const iconPattern = /card-(y|r|yr|y2r)/gi;
                            const window = html.substring(Math.max(0, namePos - 40), Math.min(html.length, namePos + 40));
                            const matches = [...window.matchAll(iconPattern)];
                            if (matches.length > 0) {
                                let closest = matches[0];
                                let minDist = Math.abs(closest.index - 40);
                                matches.forEach(m => {
                                    const dist = Math.abs(m.index - 40);
                                    if (dist < minDist) {
                                        minDist = dist;
                                        closest = m;
                                    }
                                });
                                const type = closest[1].toLowerCase();
                                isRed = type === 'r' || type === 'yr' || type === 'y2r';
                                isYellow = !isRed;
                            }
                        }
                    }

                    if (!target.cards.find(card => card.minute === c.minute && card.player === c.player)) {
                        target.cards.push({ 
                            player: c.player, 
                            minute: c.minute, 
                            type: isRed ? 'R' : 'Y', 
                            isExplicit: explicitRed || explicitYellow,
                            isSummary: true // Mark as summary so timeline can override it later
                        });
                    }
                });
                foundSomething = true;
            }
        }

        if (textLower.includes('střídání:')) {
            const lineMatch = text.match(/Střídání:\s*(.*?)(?=\n|Sestavy|Rozhodčí|Branky|Karty|ŽK:|ČK:|$)/si);
            if (lineMatch) {
                const subs = parseSubs(lineMatch[1].trim());
                subs.forEach(s => {
                    const target = s.side === 'home' ? homeTeam : awayTeam;
                    if (!target.substitutions.find(sub => sub.minute === s.minute && sub.out === s.out)) {
                        target.substitutions.push({ minute: s.minute, in: s.in, out: s.out });
                    }
                });
                foundSomething = true;
            }
        }

        if (foundSomething) {
            processedTexts.add(text);
            $el.find('p, div, li').each((_, child) => processedTexts.add($(child).text().trim()));
        }
    });

    // 2. LIVE Fallback: Parse from the reportage timeline if summary is incomplete
    if (matchStatus === 'LIVE' || (homeTeam.scorers.length === 0 && awayTeam.scorers.length === 0)) {
        $('.onlajn, .event').each((_, el) => {
            const $el = $(el);
            // Extract ONLY the time part (usually XX. or XX')
            let timeText = $el.find('.time').text().trim();
            const timeMatch = timeText.match(/^(\d{1,2}(?:\+\d+)?)/);
            if (!timeMatch) return;
            const time = timeMatch[1];

            const text = $el.text().trim();
            const textLower = text.toLowerCase();
            
            // Detect side from icon class, alignment, OR team names in text
            let side = 'home';
            const isAwayClass = $el.hasClass('away') || $el.hasClass('onlajn-away') || $el.find('.away, .onlajn-away, .event-right, .event-away').length > 0 || $el.css('text-align') === 'right' || $el.parent().hasClass('away') || $el.parent().hasClass('onlajn-away');
            
            if (isAwayClass) {
                side = 'away';
            }

            // Refine side detection using team names or codes if possible
            if (awayName && text.includes(awayName)) side = 'away';
            else if (homeName && text.includes(homeName)) side = 'home';

            // Special case: check for team codes like (SPA) or SPA
            const teamCodeMatch = text.match(/\(?\b([A-Z]{3,4})\b\)?/);
            if (teamCodeMatch) {
                const teamCode = teamCodeMatch[1].toUpperCase();
                const { TEAM_ALIASES } = require('./utils/constants');
                const fullName = TEAM_ALIASES[teamCode];
                if (fullName) {
                    if (homeName.includes(fullName) || fullName.includes(homeName)) side = 'home';
                    else if (awayName.includes(fullName) || fullName.includes(awayName)) side = 'away';
                }
            }

            const target = side === 'home' ? homeTeam : awayTeam;

            // Goal detection - check for goal icons or "Gól!" text
            const goalIcon = $el.find('.icon-goal, .soccer-ball, .ball-goal, [class*="goal"]:not([class*="card"]):not([class*="yellow"]):not([class*="red"])');
            const isGoal = (goalIcon.length > 0 || text.includes('Gól!')) && !text.includes('ŽK') && !text.includes('ČK');
            if (isGoal) {
                // Try to find player name - avoid score and minutes
                let player = text.replace(timeText, '').replace(/^\s*[:\-\–\—\.]\s*/, '').trim();
                // Clean team code at the start (e.g., "TEP 2:2 Auta")
                player = player.replace(/^[A-Z]{3,4}\s+/, '').trim();
                // Clean score like 1:0
                player = player.replace(/^(\(?\d+\s*:\s*\d+\)?\.?\s*)/, '').trim();
                // Extract only the name part - stop at common card or sub keywords
                const nameMatch = player.match(/^([^(\n:ŽK|ČK|střídání|nastupuje|přichází|vyloučen)]+)/);
                if (nameMatch) {
                    player = cleanStr(nameMatch[1]);
                    // Final check: must not be just a team name and must be reasonably long
                    if (player && player.length > 2 && player !== homeName && player !== awayName) {
                        // Global deduplication: check both home and away team
                        const alreadyExists = homeTeam.scorers.find(s => s.minute === time && s.player === player) || 
                                             awayTeam.scorers.find(s => s.minute === time && s.player === player);
                        if (!alreadyExists) {
                            target.scorers.push({ player, minute: time });
                        }
                    }
                }
            }

            // Card detection
            const cardIcon = $el.find('.icon-card, .yellow-card, .red-card, [class*="card"]');
            const hasExplicitText = textLower.includes('žk') || textLower.includes('čk') || 
                                    textLower.includes('vyloučen') || textLower.includes('2.žk') || 
                                    textLower.includes('žlutá karta') || textLower.includes('červená karta');
            const isCard = (cardIcon.length > 0 || hasExplicitText) && !text.includes('Gól!');
            
            if (isCard) {
                const explicitRed = textLower.includes('čk') || textLower.includes('vyloučen') || 
                                    textLower.includes('2.žk') || textLower.includes('červená karta');
                const explicitYellow = textLower.includes('žk') || textLower.includes('žlutá karta');
                
                // Trust text over icons if text is present
                let isRed = false;
                if (explicitRed) isRed = true;
                else if (explicitYellow) isRed = false;
                else isRed = $el.find('.red-card, [class*="red"]').length > 0;
                
                let player = text.replace(timeText, '').replace(/^\s*[:\-\–\—\.]\s*/, '').trim();
                // Clean team code at the start
                player = player.replace(/^[A-Z]{3,4}\s+/, '').trim();
                // Clean common card prefixes
                player = player.replace(/^(?:ŽK|ČK|Karta|Žlutá karta|Červená karta)\s*[:\-\–\—]?\s*/i, '').trim();
                const nameMatch = player.match(/^([^(\n:gól|branka|střídání|nastupuje|přichází)]+)/);
                if (nameMatch) {
                    player = cleanStr(nameMatch[1]);
                    if (player && player.length > 2 && player !== homeName && player !== awayName) {
                        // Global search for existing card to upgrade/deduplicate
                        let existingCard = homeTeam.cards.find(c => c.minute === time && c.player === player) || 
                                           awayTeam.cards.find(c => c.minute === time && c.player === player);
                        
                        if (!existingCard) {
                            target.cards.push({ player, minute: time, type: isRed ? 'R' : 'Y', isExplicit: explicitRed || explicitYellow, isTimeline: true });
                        } else {
                            // Timeline always overrides summary or upgrades type
                            if (explicitRed) {
                                existingCard.type = 'R';
                                existingCard.isExplicit = true;
                            } else if (explicitYellow) {
                                existingCard.type = 'Y';
                                existingCard.isExplicit = true;
                            } else if (isRed && !existingCard.isExplicit) {
                                existingCard.type = 'R';
                            }
                            existingCard.isTimeline = true;
                        }
                    }
                }
            }

            // Substitution detection
            if ((textLower.includes('střídání') || $el.find('.icon-sub, [class*="sub"]').length > 0) && !isGoal && !isCard) {
                // Split by newline or lookahead for new minutes
                const subLines = text.split(/\n|(?=\d{1,2}\.?\s*[^(\n]+\s*\()/);
                subLines.forEach(subLine => {
                    // Try standard format: "Minute. In (Out)" or "Minute. Out (In)"
                    const subMatch = subLine.match(/(\d{1,2}(?:\+\d+)?)\.?\s*([^(\n,]+)\s*\(([^)]+)\)/);
                    if (subMatch) {
                        const minute = subMatch[1];
                        let p1 = cleanStr(subMatch[2]);
                        let p2 = cleanStr(subMatch[3]);
                        
                        p1 = p1.replace(/^\d+\.?\s*/, '').replace(/^(\(?\d+\s*:\s*\d+\)?\.?\s*)/, '').trim();
                        p2 = p2.replace(/^\d+\.?\s*/, '').replace(/^(\(?\d+\s*:\s*\d+\)?\.?\s*)/, '').replace(/odchod:\s*/i, '').trim();
                        
                        let pIn = p1;
                        let pOut = p2;

                        if (subLine.toLowerCase().includes('odchází') || subLine.toLowerCase().includes('odchod:')) {
                            pIn = p2; pOut = p1;
                        } else if (subLine.toLowerCase().includes('přichází') || subLine.toLowerCase().includes('nastupuje')) {
                            pIn = p1; pOut = p2;
                        }
                        
                        if (pIn && pOut && pIn.length > 2 && pOut.length > 2 && pIn !== homeName && pIn !== awayName && pOut !== homeName && pOut !== awayName && !pOut.toLowerCase().includes('střídání')) {
                            if (!target.substitutions.find(s => s.minute === minute && s.out === pOut)) {
                                target.substitutions.push({ minute, in: pIn, out: pOut });
                            }
                        }
                    } else {
                        // Try alternative format: "Minute. -Out +In"
                        const altMatch = subLine.match(/(\d{1,2}(?:\+\d+)?)\.?\s*-(.+?)\s*\+(.+?)(?:\s|$|\()/);
                        if (altMatch) {
                            const minute = altMatch[1];
                            const pOut = cleanStr(altMatch[2]);
                            const pIn = cleanStr(altMatch[3]);
                            if (pIn && pOut && pIn.length > 2 && pOut.length > 2) {
                                if (!target.substitutions.find(s => s.minute === minute && s.out === pOut)) {
                                    target.substitutions.push({ minute, in: pIn, out: pOut });
                                }
                            }
                        }
                    }
                });
            }
        });
    }

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
