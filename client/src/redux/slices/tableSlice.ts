import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Match } from './matchesSlice.ts';
import { TEAM_LIST } from '../teamData.ts';

// Definice typů
interface TableEntry {
  id: string;
  position: number;
  team: {
    id: string;
    name: string;
    logo: string;
  };
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string[];
}

interface TableState {
  table: TableEntry[];
  loading: boolean;
  error: string | null;
}

// Počáteční stav
const initialState: TableState = {
  table: [],
  loading: false,
  error: null
};

// Pomocná funkce: spočítá tabulku týmů z odehraných zápasů
export function computeTableFromMatches(matches: Match[]): TableEntry[] {
  type Agg = {
    teamId: string;
    name: string;
    logo: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
    form: string[]; // poslední výsledky (W/D/L) v pořadí od nejstaršího k nejnovějšímu
  };

  const teamsMap = new Map<string, Agg>();
  const seen = new Set<string>();
  const WIN_POINTS = 3;
  const DRAW_POINTS = 1;

  const ensureTeam = (teamId: string, name: string, logo: string): Agg => {
    if (!teamsMap.has(teamId)) {
      teamsMap.set(teamId, {
        teamId,
        name,
        logo,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
        form: []
      });
    }
    return teamsMap.get(teamId)!;
  };

  // Inicializace všech týmů z TEAM_LIST
  TEAM_LIST.forEach(team => {
    ensureTeam(team.id, team.name, team.logo);
  });

  // vezmeme jen skutečně odehrané zápasy
  const finishedMatches = matches
    .filter(m => m.status === 'finished' || m.status === 'awarded')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Pro každý zápas aktualizujeme statistiky obou týmů
  finishedMatches.forEach(match => {
    const key = match.id ?? `${match.homeTeam?.id ?? ''}-${match.awayTeam?.id ?? ''}-${match.date ?? ''}`;
    if (seen.has(key)) return;
    seen.add(key);

    const home = ensureTeam(match.homeTeam.id, match.homeTeam.name, match.homeTeam.logo);
    const away = ensureTeam(match.awayTeam.id, match.awayTeam.name, match.awayTeam.logo);

    const homeGoals = Number(match.score?.home);
    const awayGoals = Number(match.score?.away);
    const validScores = Number.isFinite(homeGoals) && Number.isFinite(awayGoals);
    if (!validScores) return;

    home.played += 1;
    away.played += 1;
    home.goalsFor += homeGoals;
    home.goalsAgainst += awayGoals;
    away.goalsFor += awayGoals;
    away.goalsAgainst += homeGoals;

    if (homeGoals > awayGoals) {
      // výhra domácích
      home.won += 1;
      home.points += WIN_POINTS;
      away.lost += 1;
      home.form.push('W');
      away.form.push('L');
    } else if (homeGoals < awayGoals) {
      // výhra hostů
      away.won += 1;
      away.points += WIN_POINTS;
      home.lost += 1;
      home.form.push('L');
      away.form.push('W');
    } else {
      // remíza
      home.drawn += 1;
      away.drawn += 1;
      home.points += DRAW_POINTS;
      away.points += DRAW_POINTS;
      home.form.push('D');
      away.form.push('D');
    }
  });

  const table: TableEntry[] = Array.from(teamsMap.values())
    .map((t, index) => ({
      id: t.teamId,
      position: index + 1, // dočasně; správné pořadí spočítáme až po seřazení
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
      form: t.form.slice(-5).reverse()
    }))
    .sort((a, b) => {
      // 1) body
      if (b.points !== a.points) return b.points - a.points;
      // 2) rozdíl skóre
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      // 3) vstřelené góly
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      // 4) abecedně podle názvu týmu
      return a.team.name.localeCompare(b.team.name);
    })
    .map((entry, idx) => ({
      ...entry,
      position: idx + 1
    }));

  return table;
}

// Asynchronní akce pro načtení tabulky – počítá se z lokálních zápasů
export const fetchTable = createAsyncThunk(
  'table/fetchTable',
  async (_, { rejectWithValue }) => {
    try {
      // dynamicky spočítáme tabulku z lokálních zápasů
      // kvůli případnému importnímu cyklu načteme MANUAL_MATCHES lazy až tady
      const { MANUAL_MATCHES } = await import('./matchesSlice.ts');
      const allMatches: Match[] = MANUAL_MATCHES as Match[];
      const table = computeTableFromMatches(allMatches);
      return table;
    } catch (error) {
      return rejectWithValue('Nepodařilo se načíst tabulku ligy.');
    }
  }
);

// Slice
const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTable.fulfilled, (state, action) => {
        state.loading = false;
        state.table = action.payload;
      })
      .addCase(fetchTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default tableSlice.reducer;
