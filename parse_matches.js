const fs = require('fs');
const path = require('path');

const teamMap = {
    "Dukla": "t_duk",
    "Plzeň": "t_plz",
    "Olomouc": "t_olo",
    "Zlín": "t_zli",
    "Boleslav": "t_mbo",
    "Hradec Králové": "t_hrk",
    "Slovácko": "t_slo",
    "Teplice": "t_tep",
    "Jablonec": "t_jab",
    "Slavia": "t_sla",
    "Karviná": "t_kar",
    "Bohemians": "t_boh",
    "Liberec": "t_lib",
    "Sparta": "t_spa",
    "Pardubice": "t_par",
    "Baník": "t_ban"
};

const teamFullNames = {
    "t_sla": "Slavia Praha",
    "t_spa": "Sparta Praha",
    "t_jab": "FK Jablonec",
    "t_olo": "SK Sigma Olomouc",
    "t_lib": "Slovan Liberec",
    "t_plz": "FC Viktoria Plzeň",
    "t_kar": "MFK Karviná",
    "t_hrk": "Hradec Králové",
    "t_zli": "FC Zlín",
    "t_boh": "Bohemians Praha 1905",
    "t_tep": "FK Teplice",
    "t_duk": "Dukla Praha",
    "t_mbo": "FK Mladá Boleslav",
    "t_par": "FK Pardubice",
    "t_slo": "1. FC Slovácko",
    "t_ban": "FC Baník Ostrava"
};

// Also map team IDs to Stadiums
const teamStadiums = {
    "t_sla": "Eden Aréna",
    "t_spa": "Letná",
    "t_jab": "Stadion Střelnice",
    "t_olo": "Andrův stadion",
    "t_lib": "Stadion U Nisy",
    "t_plz": "Doosan Arena",
    "t_kar": "Městský stadion Karviná",
    "t_hrk": "Malšovická aréna",
    "t_zli": "Stadion Letná Zlín",
    "t_boh": "Ďolíček",
    "t_tep": "Stadion Na Stínadlech",
    "t_duk": "Juliska",
    "t_mbo": "Městský stadion Mladá Boleslav",
    "t_par": "CFIG Aréna",
    "t_slo": "Městský stadion Miroslava Valenty",
    "t_ban": "Městský stadion Vítkovice"
};

function parseDate(dateStr) {
    // Format: "16. 8. 25" or "20. 9."
    const parts = dateStr.split('.').map(s => s.trim());
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    let year = 2025;
    
    if (parts.length > 2 && parts[2]) {
        const yStr = parts[2];
        if (yStr.length === 2) {
            year = 2000 + parseInt(yStr, 10);
        } else {
            year = parseInt(yStr, 10);
        }
    }
    
    // ISO format: YYYY-MM-DDTHH:mm:ssZ
    const mStr = month.toString().padStart(2, '0');
    const dStr = day.toString().padStart(2, '0');
    return `${year}-${mStr}-${dStr}T15:00:00Z`;
}

function main() {
    const rawData = fs.readFileSync('c:\\TP\\temp_raw_matches.json', 'utf-8');
    const lines = rawData.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    
    const matches = [];
    let currentRound = "";
    let i = 0;
    
    while (i < lines.length) {
        const line = lines[i];
        
        if (line.includes("Skupinová fáze")) {
            const match = line.match(/Hrací den (\d+)/);
            if (match) {
                currentRound = match[1];
            }
            i++;
            continue;
        }
        
        if (line === "KONEC") {
            try {
                // Ensure we have enough lines left
                if (i + 7 >= lines.length) break;

                const dateStr = lines[i+1];
                const homeNameShort = lines[i+2];
                // i+3 duplicate home
                const homeScore = parseInt(lines[i+4], 10);
                const awayNameShort = lines[i+5];
                // i+6 duplicate away
                const awayScore = parseInt(lines[i+7], 10);
                
                const homeId = teamMap[homeNameShort];
                const awayId = teamMap[awayNameShort];
                
                if (homeId && awayId) {
                    const date = parseDate(dateStr);
                    // Generate a random-ish suffix to avoid collisions if multiple matches same day same teams (unlikely but safe)
                    // Or just use index to be unique
                    const matchId = `${date.substring(0, 10)}-${homeId}-${awayId}`; 
                    
                    const matchObj = {
                        id: matchId,
                        homeTeam: { id: homeId, name: teamFullNames[homeId], logo: '' },
                        awayTeam: { id: awayId, name: teamFullNames[awayId], logo: '' },
                        score: { home: homeScore, away: awayScore },
                        status: 'finished',
                        date: date,
                        stadium: teamStadiums[homeId] || 'Unknown',
                        competition: { id: 'chance', name: 'Chance Liga 2025/26' },
                        round: currentRound,
                        events: []
                    };
                    matches.push(matchObj);
                } else {
                    console.error(`Unknown team: ${homeNameShort} or ${awayNameShort}`);
                }
                
                i += 8;
            } catch (e) {
                console.error("Error parsing block at line " + i, e);
                i++;
            }
        } else {
            i++;
        }
    }
    
    fs.writeFileSync('c:\\TP\\parsed_matches.json', JSON.stringify(matches, null, 2));
}

main();
