import { configureStore } from '@reduxjs/toolkit';
import matchesReducer from './slices/matchesSlice.ts';
import teamsReducer from './slices/teamsSlice.ts';
import tableReducer from './slices/tableSlice.ts';
import authReducer from './slices/authSlice.ts';

export const store = configureStore({
  reducer: {
    matches: matchesReducer,
    teams: teamsReducer,
    table: tableReducer,
    auth: authReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
