import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Team } from '../teamData.ts'
import { TEAM_LIST } from '../teamData.ts'

interface TeamsState {
  teams: Team[]
  loading: boolean
  error: string | null
}

const initialState: TeamsState = {
  teams: [],
  loading: false,
  error: null
}

export const fetchTeams = createAsyncThunk(
  'teams/fetchTeams',
  async (_, { rejectWithValue }) => {
    try {
      return TEAM_LIST
    } catch (e) {
      return rejectWithValue('Nepodařilo se načíst týmy')
    }
  }
)

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false
        state.teams = action.payload as Team[]
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export default teamsSlice.reducer
