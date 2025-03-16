import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  response: any;
  isLoggedin: boolean;
}

const initialState: AuthState = {
  response: null,
  isLoggedin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setResponse: (state, action: PayloadAction<any>) => {
      state.response = action.payload;
      state.isLoggedin = true;
    },
    setLoggedOut: (state) => {
      state.response = null;
      state.isLoggedin = false;
    },
  },
});

export const { setResponse, setLoggedOut } = authSlice.actions;
export default authSlice.reducer;
