import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = (typeof (globalThis as any).process !== 'undefined' && (globalThis as any).process.env?.REACT_APP_API_URL) || 'http://localhost:5000/api';

export interface Match {
  id: string;
  homeTeam: {
    id: string;
    name: string;
    logo: string;
  };
  awayTeam: {
    id: string;
    name: string;
    logo: string;
  };
  score: {
    home: number;
    away: number;
  };
  status: 'scheduled' | 'live' | 'finished';
  date: string;
  stadium: string;
  events: Array<{
    id: string;
    type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
    minute: number;
    team: 'home' | 'away';
    player: {
      id: string;
      name: string;
    };
    assistPlayer?: {
      id: string;
      name: string;
    };
  }>;
}

interface MatchesState {
  matches: Match[];
  liveMatches: Match[];
  currentMatch: Match | null;
  loading: boolean;
  error: string | null;
}

const initialState: MatchesState = {
  matches: [],
  liveMatches: [],
  currentMatch: null,
  loading: false,
  error: null
};

export const fetchMatches = createAsyncThunk(
  'matches/fetchMatches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/matches`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Nepodařilo se načíst zápasy');
    }
  }
);

export const fetchLiveMatches = createAsyncThunk(
  'matches/fetchLiveMatches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/matches/live`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Nepodařilo se načíst živé zápasy');
    }
  }
);

export const fetchMatchById = createAsyncThunk(
  'matches/fetchMatchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/matches/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Nepodařilo se načíst detail zápasu');
    }
  }
);

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    clearCurrentMatch: (state) => {
      state.currentMatch = null;
    },
    updateLiveMatch: (state, action) => {
      const updatedMatch = action.payload;
      state.liveMatches = state.liveMatches.map(match => 
        match.id === updatedMatch.id ? updatedMatch : match
      );
      if (state.currentMatch && state.currentMatch.id === updatedMatch.id) {
        state.currentMatch = updatedMatch;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchLiveMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLiveMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.liveMatches = action.payload;
      })
      .addCase(fetchLiveMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMatchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatchById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMatch = action.payload;
      })
      .addCase(fetchMatchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCurrentMatch, updateLiveMatch } = matchesSlice.actions;
export default matchesSlice.reducer;