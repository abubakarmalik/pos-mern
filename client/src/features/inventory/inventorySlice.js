import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { adjustInventoryApi, fetchStockLedgerApi } from './api';

const initialState = {
  ledgerItems: [],
  ledgerPagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  isAdjusting: false,
  isLoadingLedger: false,
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

export const fetchStockLedger = createAsyncThunk(
  'inventory/fetchStockLedger',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await fetchStockLedgerApi(params);
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
      })
      .addCase(fetchStockLedger.pending, (state) => {
        state.isLoadingLedger = true;
        state.error = null;
      })
      .addCase(fetchStockLedger.fulfilled, (state, action) => {
        state.isLoadingLedger = false;
        state.ledgerItems = action.payload?.data?.items || [];
        state.ledgerPagination =
          action.payload?.data?.pagination || initialState.ledgerPagination;
      })
      .addCase(fetchStockLedger.rejected, (state, action) => {
        state.isLoadingLedger = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { clearInventoryMessage } = inventorySlice.actions;
export default inventorySlice.reducer;
