import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Definice typů
interface Team {
  id: string;
  name: string;
  logo: string;
  stadium: string;
  foundedYear: number;
  coach: string;
  description: string;
}

interface TeamsState {
  teams: Team[];
  currentTeam: Team | null;
  loading: boolean;
  error: string | null;
}

// Počáteční stav
const initialState: TeamsState = {
  teams: [],
  currentTeam: null,
  loading: false,
  error: null
};

// Asynchronní akce pro načtení všech týmů
export const fetchTeams = createAsyncThunk(
  'teams/fetchTeams',
  async (_, { rejectWithValue }) => {
    try {
      // V reálné aplikaci by zde byl API call
      // Simulace API volání s ukázkovými daty
      const response = await new Promise<Team[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: '1',
              name: 'Sparta Praha',
              logo: '/logos/sparta.png',
              stadium: 'Letná',
              foundedYear: 1893,
              coach: 'Lars Friis',
              description: 'AC Sparta Praha je český fotbalový klub, který patří mezi nejstarší a nejúspěšnější v české historii.'
            },
            {
              id: '2',
              name: 'Slavia Praha',
              logo: '/logos/slavia.png',
              stadium: 'Eden Aréna',
              foundedYear: 1892,
              coach: 'Jindřich Trpišovský',
              description: 'SK Slavia Praha je český fotbalový klub, který je jedním z nejstarších a nejúspěšnějších klubů v české historii.'
            },
            {
              id: '3',
              name: 'Viktoria Plzeň',
              logo: '/logos/plzen.png',
              stadium: 'Doosan Arena',
              foundedYear: 1911,
              coach: 'Miroslav Koubek',
              description: 'FC Viktoria Plzeň je český fotbalový klub, který se v posledních letech stal jedním z nejúspěšnějších klubů v české lize.'
            }
          ]);
        }, 500);
      });
      
      return response;
    } catch (error) {
      return rejectWithValue('Nepodařilo se načíst týmy.');
    }
  }
);

// Asynchronní akce pro načtení konkrétního týmu
export const fetchTeamById = createAsyncThunk(
  'teams/fetchTeamById',
  async (teamId: string, { rejectWithValue }) => {
    try {
      // V reálné aplikaci by zde byl API call
      // Simulace API volání s ukázkovými daty
      const response = await new Promise<Team>((resolve, reject) => {
        setTimeout(() => {
          const teams = [
            {
              id: '1',
              name: 'Sparta Praha',
              logo: '/logos/sparta.png',
              stadium: 'Letná',
              foundedYear: 1893,
              coach: 'Lars Friis',
              description: 'AC Sparta Praha je český fotbalový klub, který patří mezi nejstarší a nejúspěšnější v české historii.'
            },
            {
              id: '2',
              name: 'Slavia Praha',
              logo: '/logos/slavia.png',
              stadium: 'Eden Aréna',
              foundedYear: 1892,
              coach: 'Jindřich Trpišovský',
              description: 'SK Slavia Praha je český fotbalový klub, který je jedním z nejstarších a nejúspěšnějších klubů v české historii.'
            },
            {
              id: '3',
              name: 'Viktoria Plzeň',
              logo: '/logos/plzen.png',
              stadium: 'Doosan Arena',
              foundedYear: 1911,
              coach: 'Miroslav Koubek',
              description: 'FC Viktoria Plzeň je český fotbalový klub, který se v posledních letech stal jedním z nejúspěšnějších klubů v české lize.'
            }
          ];
          
          const team = teams.find(t => t.id === teamId);
          if (team) {
            resolve(team);
          } else {
            reject('Tým nebyl nalezen');
          }
        }, 500);
      });
      
      return response;
    } catch (error) {
      return rejectWithValue('Nepodařilo se načíst informace o týmu.');
    }
  }
);

// Slice
const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Načtení všech týmů
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Načtení konkrétního týmu
      .addCase(fetchTeamById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTeam = action.payload;
      })
      .addCase(fetchTeamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default teamsSlice.reducer;