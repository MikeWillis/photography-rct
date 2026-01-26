// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('adminToken') || null,
    isAdmin: !!localStorage.getItem('adminToken'),
  },
  reducers: {
    setLogin: (state, action) => {
      state.token = action.payload;
      state.isAdmin = true;
      localStorage.setItem('adminToken', action.payload); // Sync with storage
    },
    setLogout: (state) => {
      state.token = null;
      state.isAdmin = false;
      localStorage.removeItem('adminToken');
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;