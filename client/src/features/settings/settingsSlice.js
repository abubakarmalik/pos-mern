import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchSettingsApi, updateSettingsApi } from './api';

const initialState = {
  item: null,
  isLoading: false,
  isSaving: false,
  message: null,
  error: null,
};

const getErrorPayload = (error) => error.response?.data || { message: error.message };

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchSettingsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await updateSettingsApi(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearSettingsMessage(state) {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.item = action.payload?.data || null;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(updateSettings.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.isSaving = false;
        state.item = action.payload?.data || state.item;
        state.message = action.payload?.message || null;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { clearSettingsMessage } = settingsSlice.actions;
export default settingsSlice.reducer;
