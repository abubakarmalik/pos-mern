import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createRefundApi, createSaleApi, fetchSaleApi, fetchSalesApi } from './api';

const initialState = {
  items: [],
  currentItem: null,
  lastCreatedItem: null,
  isLoading: false,
  isLoadingCurrent: false,
  isCreating: false,
  isRefunding: false,
  message: null,
  error: null,
};

const getErrorPayload = (error) => error.response?.data || { message: error.message };

export const fetchSales = createAsyncThunk(
  'sales/fetchSales',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await fetchSalesApi(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

export const fetchSale = createAsyncThunk(
  'sales/fetchSale',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchSaleApi(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

export const createSale = createAsyncThunk(
  'sales/createSale',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createSaleApi(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

export const createRefund = createAsyncThunk(
  'sales/createRefund',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createRefundApi(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    clearCurrentSale(state) {
      state.currentItem = null;
      state.error = null;
    },
    clearSalesMessage(state) {
      state.message = null;
      state.error = null;
    },
    clearCreatedSale(state) {
      state.lastCreatedItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload?.data || [];
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(fetchSale.pending, (state) => {
        state.isLoadingCurrent = true;
        state.error = null;
      })
      .addCase(fetchSale.fulfilled, (state, action) => {
        state.isLoadingCurrent = false;
        state.currentItem = action.payload?.data || null;
      })
      .addCase(fetchSale.rejected, (state, action) => {
        state.isLoadingCurrent = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(createSale.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.isCreating = false;
        state.lastCreatedItem = action.payload?.data || null;
        state.message = action.payload?.message || null;
      })
      .addCase(createSale.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(createRefund.pending, (state) => {
        state.isRefunding = true;
        state.error = null;
      })
      .addCase(createRefund.fulfilled, (state, action) => {
        state.isRefunding = false;
        state.message = action.payload?.message || null;
      })
      .addCase(createRefund.rejected, (state, action) => {
        state.isRefunding = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { clearCreatedSale, clearCurrentSale, clearSalesMessage } =
  salesSlice.actions;
export default salesSlice.reducer;
