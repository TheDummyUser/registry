import { combineReducers } from '@reduxjs/toolkit';

import authReducer from '~/redux/slices/authSlice';
import { authApi } from './services/authService';

const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
});

export default rootReducer;
