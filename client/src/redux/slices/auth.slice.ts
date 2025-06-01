import type { Tokens, UserDetails } from "@/utils/api.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuth: boolean;
  user: UserDetails | null;
  tokens: Tokens | null;
}

const initialState: AuthState = {
  isAuth: false,
  user: null,
  tokens: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (
      state,
      action: PayloadAction<{ user: UserDetails; tokens: Tokens }>,
    ) => {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuth = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuth = false;
    },
    updateUserDetails: (state, action: PayloadAction<Partial<UserDetails>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateTokens: (state, action: PayloadAction<Tokens>) => {
      state.tokens = action.payload;
    },
  },
});

export const { setAuthUser, clearAuth, updateUserDetails, updateTokens } =
  authSlice.actions;
export default authSlice.reducer;
