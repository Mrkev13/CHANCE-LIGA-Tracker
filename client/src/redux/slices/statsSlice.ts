import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface PlayerStat {
  id: string;
  name: string;
  count: number;
  teamId?: string;
  teamName?: string;
}

export interface StatsState {
  goals: PlayerStat[];
  assists: PlayerStat[];
  yellowCards: PlayerStat[];
  redCards: PlayerStat[];
  loading: boolean;
  error: string | null;
}

const initialState: StatsState = {
  goals: [],
  assists: [],
  yellowCards: [],
  redCards: [],
  loading: false,
  error: null
};

export const fetchPlayerStats = createAsyncThunk(
  'stats/fetchPlayerStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/stats/players`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Chyba při načítání statistik');
    }
  }
);

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayerStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayerStats.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.goals = action.payload.goals;
        state.assists = action.payload.assists;
        state.yellowCards = action.payload.yellowCards;
        state.redCards = action.payload.redCards;
      })
      .addCase(fetchPlayerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default statsSlice.reducer;
