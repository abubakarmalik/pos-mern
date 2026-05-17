import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchCashierPerformanceReportApi,
  fetchDashboardReportApi,
  fetchInventoryMovementReportApi,
  fetchSummaryReportApi,
} from './api';

const initialState = {
  todaySummary: {},
  rangeSummary: {},
  topProducts: [],
  lowStockProducts: [],
  salesByDate: [],
  salesByPaymentMethod: [],
  cashierPerformance: [],
  inventoryMovement: [],
  isLoadingToday: false,
  isLoadingRange: false,
  error: null,
};

const getErrorPayload = (error) => error.response?.data || { message: error.message };

export const fetchTodaySummary = createAsyncThunk(
  'reports/fetchTodaySummary',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetchSummaryReportApi(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

export const fetchRangeReport = createAsyncThunk(
  'reports/fetchRangeReport',
  async (params = {}, { rejectWithValue }) => {
    try {
      const [
        dashboardResponse,
        cashierPerformanceResponse,
        inventoryMovementResponse,
      ] = await Promise.all([
        fetchDashboardReportApi(params),
        fetchCashierPerformanceReportApi(params),
        fetchInventoryMovementReportApi(params),
      ]);

      const dashboard = dashboardResponse.data?.data || {};

      return {
        summary: dashboard.summary || {},
        topProducts: dashboard.topProducts || [],
        lowStockProducts: dashboard.lowStockProducts || [],
        salesByDate: dashboard.salesByDate || [],
        salesByPaymentMethod: dashboard.salesByPaymentMethod || [],
        cashierPerformance: cashierPerformanceResponse.data?.data || [],
        inventoryMovement: inventoryMovementResponse.data?.data || [],
      };
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodaySummary.pending, (state) => {
        state.isLoadingToday = true;
        state.error = null;
      })
      .addCase(fetchTodaySummary.fulfilled, (state, action) => {
        state.isLoadingToday = false;
        state.todaySummary = action.payload?.data || {};
      })
      .addCase(fetchTodaySummary.rejected, (state, action) => {
        state.isLoadingToday = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(fetchRangeReport.pending, (state) => {
        state.isLoadingRange = true;
        state.error = null;
      })
      .addCase(fetchRangeReport.fulfilled, (state, action) => {
        state.isLoadingRange = false;
        state.rangeSummary = action.payload?.summary || {};
        state.topProducts = action.payload?.topProducts || [];
        state.lowStockProducts = action.payload?.lowStockProducts || [];
        state.salesByDate = action.payload?.salesByDate || [];
        state.salesByPaymentMethod = action.payload?.salesByPaymentMethod || [];
        state.cashierPerformance = action.payload?.cashierPerformance || [];
        state.inventoryMovement = action.payload?.inventoryMovement || [];
      })
      .addCase(fetchRangeReport.rejected, (state, action) => {
        state.isLoadingRange = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export default reportsSlice.reducer;
