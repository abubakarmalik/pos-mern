import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { adjustInventoryApi } from './api';

const initialState = {
  isAdjusting: false,
  message: null,
  error: null,
};

const getErrorPayload = (error) => error.response?.data || { message: error.message };

export const adjustInventory = createAsyncThunk(
  'inventory/adjustInventory',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await adjustInventoryApi(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearInventoryMessage(state) {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adjustInventory.pending, (state) => {
        state.isAdjusting = true;
        state.error = null;
      })
      .addCase(adjustInventory.fulfilled, (state, action) => {
        state.isAdjusting = false;
        state.message = action.payload?.message || null;
      })
      .addCase(adjustInventory.rejected, (state, action) => {
        state.isAdjusting = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { clearInventoryMessage } = inventorySlice.actions;
export default inventorySlice.reducer;
