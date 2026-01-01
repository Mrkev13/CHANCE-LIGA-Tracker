const fs = require('fs');

const fileContent = fs.readFileSync('c:\\TP\\client\\src\\redux\\slices\\matchesSlice.ts', 'utf-8');

// Extract the MANUAL_MATCHES array content
const startMarker = "export const MANUAL_MATCHES: Match[] = [";
const startIndex = fileContent.indexOf(startMarker);

if (startIndex === -1) {
    console.error("Could not find MANUAL_MATCHES start");
    process.exit(1);
}

const arrayStart = startIndex + startMarker.length - 1; // include '['

// Find the end of the array. It should be a closing '];' at the top level.
let bracketCount = 0;
let endIndex = -1;

for (let i = arrayStart; i < fileContent.length; i++) {
    if (fileContent[i] === '[') bracketCount++;
    else if (fileContent[i] === ']') bracketCount--;

    if (bracketCount === 0) {
        endIndex = i + 1;
        break;
    }
}

if (endIndex === -1) {
    console.error("Could not find MANUAL_MATCHES end");
    process.exit(1);
}

const matchesArrayString = fileContent.substring(arrayStart, endIndex);

let matches;
try {
    matches = eval(matchesArrayString);
} catch (e) {
    console.error("Error evaluating matches array:", e);
    process.exit(1);
}

// Now calculate table
function computeTableFromMatches(matches) {
  const teamsMap = new Map();

  // Helper to init team stats
  const initTeam = (id, name, logo) => ({
    teamId: id,
    name: name,
    logo: logo,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    form: []
  });

  matches.forEach(m => {
    if (m.status !== 'finished') return;

    // Home team
    if (!teamsMap.has(m.homeTeam.id)) {
      teamsMap.set(m.homeTeam.id, initTeam(m.homeTeam.id, m.homeTeam.name, m.homeTeam.logo));
    }
    // Away team
    if (!teamsMap.has(m.awayTeam.id)) {
      teamsMap.set(m.awayTeam.id, initTeam(m.awayTeam.id, m.awayTeam.name, m.awayTeam.logo));
    }

    const homeStats = teamsMap.get(m.homeTeam.id);
    const awayStats = teamsMap.get(m.awayTeam.id);

    homeStats.played++;
    awayStats.played++;

    homeStats.goalsFor += m.score.home;
    homeStats.goalsAgainst += m.score.away;

    awayStats.goalsFor += m.score.away;
    awayStats.goalsAgainst += m.score.home;

    if (m.score.home > m.score.away) {
      // Home win
      homeStats.won++;
      homeStats.points += 3;
      homeStats.form.push('W');
      
      awayStats.lost++;
      awayStats.form.push('L');
    } else if (m.score.home < m.score.away) {
      // Away win
      homeStats.lost++;
      homeStats.form.push('L');

      awayStats.won++;
      awayStats.points += 3;
      awayStats.form.push('W');
    } else {
      // Draw
      homeStats.drawn++;
      homeStats.points += 1;
      homeStats.form.push('D');

      awayStats.drawn++;
      awayStats.points += 1;
      awayStats.form.push('D');
    }
  });

  const table = Array.from(teamsMap.values())
    .map((t, index) => ({
      position: 0,
      team: {
        id: t.teamId,
        name: t.name,
        logo: t.logo
      },
      played: t.played,
      won: t.won,
      drawn: t.drawn,
      lost: t.lost,
      goalsFor: t.goalsFor,
      goalsAgainst: t.goalsAgainst,
      goalDifference: t.goalsFor - t.goalsAgainst,
      points: t.points,
      form: t.form.slice(-5)
    }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.team.name.localeCompare(b.team.name);
    })
    .map((entry, idx) => ({
      ...entry,
      position: idx + 1
    }));

  return table;
}

const table = computeTableFromMatches(matches);

console.log("Tabulka po aktualizaci (po 16. kole):");
console.log("Poz | Tým                  | Z  | V  | R  | P  | Skóre | Body | Forma");
console.log("-".repeat(80));

table.forEach(row => {
    const formStr = row.form.join('');
    const score = `${row.goalsFor}:${row.goalsAgainst}`;
    console.log(`${row.position.toString().padEnd(3)} | ${row.team.name.padEnd(20)} | ${row.played.toString().padEnd(2)} | ${row.won.toString().padEnd(2)} | ${row.drawn.toString().padEnd(2)} | ${row.lost.toString().padEnd(2)} | ${score.padEnd(5)} | ${row.points.toString().padEnd(4)} | ${formStr}`);
});
