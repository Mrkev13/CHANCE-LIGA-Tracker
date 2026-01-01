import { configureStore } from '@reduxjs/toolkit';
import matchesReducer from './slices/matchesSlice.ts';
import teamsReducer from './slices/teamsSlice.ts';
import tableReducer from './slices/tableSlice.ts';

export const store = configureStore({
  reducer: {
    matches: matchesReducer,
    teams: teamsReducer,
    table: tableReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
