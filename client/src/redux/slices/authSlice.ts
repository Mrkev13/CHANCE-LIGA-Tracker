import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// V reálné aplikaci by toto bylo na serveru nebo v .env
// Pro demonstraci: jednoduchý hash pro "admin123"
// V praxi NIKDY neukládejte hesla v plain textu na klientovi
const ADMIN_HASH = 'admin123'; 

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  error: string | null;
  securityLogs: string[];
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  error: null,
  securityLogs: []
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      if (action.payload === ADMIN_HASH) {
        state.isAuthenticated = true;
        state.user = 'Admin';
        state.error = null;
        // Log successful login
        state.securityLogs.push(`[${new Date().toISOString()}] Úspěšné přihlášení uživatele Admin`);
      } else {
        state.isAuthenticated = false;
        state.user = null;
        state.error = 'Neplatné přístupové údaje';
        // Log failed attempt
        state.securityLogs.push(`[${new Date().toISOString()}] Neúspěšný pokus o přihlášení`);
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.securityLogs.push(`[${new Date().toISOString()}] Odhlášení uživatele`);
    },
    logSecurityEvent: (state, action: PayloadAction<string>) => {
      state.securityLogs.push(`[SECURITY][${new Date().toISOString()}] ${action.payload}`);
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { login, logout, logSecurityEvent, clearError } = authSlice.actions;
export default authSlice.reducer;
