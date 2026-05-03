import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch } from '../../api/client';
import {
  clearAuthStorage,
  getAuthStorage,
  setAuthStorage,
} from '../../utils/authStorage';

const authStorage = getAuthStorage();

const initialState = {
  user: authStorage?.user || null,
  token: authStorage?.token || null,
  isAuthenticated: Boolean(authStorage?.token),
  isLoading: false,
};

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth?.token) return null;
      const response = await apiFetch('/auth/me');
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user');
    }
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  clearAuthStorage();
  return true;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload || state.user;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        setAuthStorage(action.payload);
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = Boolean(action.payload.token);
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
