import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchSummaryReportApi, fetchTopProductsReportApi } from './api';

const initialState = {
  todaySummary: {},
  rangeSummary: {},
  topProducts: [],
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
      const [summaryResponse, topProductsResponse] = await Promise.all([
        fetchSummaryReportApi(params),
        fetchTopProductsReportApi(params),
      ]);

      return {
        summary: summaryResponse.data?.data || {},
        topProducts: topProductsResponse.data?.data || [],
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
      })
      .addCase(fetchRangeReport.rejected, (state, action) => {
        state.isLoadingRange = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export default reportsSlice.reducer;
