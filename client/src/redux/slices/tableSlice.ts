import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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

// Asynchronní akce pro načtení tabulky
export const fetchTable = createAsyncThunk(
  'table/fetchTable',
  async (_, { rejectWithValue }) => {
    try {
      // V reálné aplikaci by zde byl API call
      // Simulace API volání s ukázkovými daty
      const response = await new Promise<TableEntry[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: '1',
              position: 1,
              team: {
                id: '1',
                name: 'Sparta Praha',
                logo: '/logos/sparta.png'
              },
              played: 10,
              won: 8,
              drawn: 1,
              lost: 1,
              goalsFor: 24,
              goalsAgainst: 8,
              goalDifference: 16,
              points: 25,
              form: ['W', 'W', 'W', 'D', 'W']
            },
            {
              id: '2',
              position: 2,
              team: {
                id: '2',
                name: 'Slavia Praha',
                logo: '/logos/slavia.png'
              },
              played: 10,
              won: 7,
              drawn: 2,
              lost: 1,
              goalsFor: 22,
              goalsAgainst: 7,
              goalDifference: 15,
              points: 23,
              form: ['W', 'W', 'D', 'W', 'D']
            },
            {
              id: '3',
              position: 3,
              team: {
                id: '3',
                name: 'Viktoria Plzeň',
                logo: '/logos/plzen.png'
              },
              played: 10,
              won: 6,
              drawn: 2,
              lost: 2,
              goalsFor: 18,
              goalsAgainst: 10,
              goalDifference: 8,
              points: 20,
              form: ['W', 'L', 'W', 'W', 'D']
            }
          ]);
        }, 500);
      });
      
      return response;
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