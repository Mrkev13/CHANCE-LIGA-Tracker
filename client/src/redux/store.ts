import { configureStore } from '@reduxjs/toolkit';
import matchesReducer from './slices/matchesSlice';
import teamsReducer from './slices/teamsSlice';
import tableReducer from './slices/tableSlice';
import authReducer from './slices/authSlice';
import statsReducer from './slices/statsSlice';

export const store = configureStore({
  reducer: {
    matches: matchesReducer,
    teams: teamsReducer,
    table: tableReducer,
    auth: authReducer,
    stats: statsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
