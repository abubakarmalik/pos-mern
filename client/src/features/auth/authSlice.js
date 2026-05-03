import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { clearAuthStorage, getAuthStorage, setAuthStorage } from '../../utils/authStorage';
import { fetchCurrentUserApi, loginUser } from './api';

const authStorage = getAuthStorage();

const initialState = {
  user: authStorage?.user || null,
  token: authStorage?.token || null,
  isAuthenticated: Boolean(authStorage?.token),
  isLoading: false,
  message: null,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    if (!auth?.token) return null;
    const response = await fetchCurrentUserApi();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: error.message });
  }
});

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await loginUser({ email, password });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: error.message });
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  clearAuthStorage();
  return { message: 'Logged out' };
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthMessage(state) {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.data?.user || state.user;
        state.message = action.payload?.message || null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        const payloadData = action.payload?.data || {};
        setAuthStorage(payloadData);
        state.user = payloadData.user || null;
        state.token = payloadData.token || null;
        state.isAuthenticated = Boolean(payloadData.token);
        state.message = action.payload?.message || null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.message = action.payload.message;
      });
  },
});

export const { clearAuthMessage } = authSlice.actions;
export default authSlice.reducer;
