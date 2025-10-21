import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Definice typů
interface Player {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  position: string;
  number: number;
  age: number;
  nationality: string;
  photo: string;
  stats: {
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    minutesPlayed: number;
  };
}

interface PlayersState {
  players: Player[];
  currentPlayer: Player | null;
  loading: boolean;
  error: string | null;
}

// Počáteční stav
const initialState: PlayersState = {
  players: [],
  currentPlayer: null,
  loading: false,
  error: null
};

// Asynchronní akce pro načtení všech hráčů
export const fetchPlayers = createAsyncThunk(
  'players/fetchPlayers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/players`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Nepodařilo se načíst hráče.');
    }
  }
);

// Asynchronní akce pro načtení konkrétního hráče
export const fetchPlayerById = createAsyncThunk(
  'players/fetchPlayerById',
  async (playerId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/players/${playerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Nepodařilo se načíst informace o hráči.');
    }
  }
);

// Slice
const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Načtení všech hráčů
      .addCase(fetchPlayers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.loading = false;
        state.players = action.payload;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Načtení konkrétního hráče
      .addCase(fetchPlayerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlayer = action.payload;
      })
      .addCase(fetchPlayerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default playersSlice.reducer;