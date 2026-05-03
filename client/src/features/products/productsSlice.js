import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchProductsApi, toggleProductApi } from './api';
import { PRODUCTS_FEATURE_KEY } from './constants';

const initialState = { items: [], isLoading: false, isMutating: false, message: null, error: null };

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (search, { rejectWithValue }) => {
  try {
    const response = await fetchProductsApi(search);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: error.message });
  }
});

export const toggleProduct = createAsyncThunk('products/toggleProduct', async (id, { rejectWithValue }) => {
  try {
    const response = await toggleProductApi(id);
    return { ...response.data, id };
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: error.message });
  }
});

const productsSlice = createSlice({
  name: PRODUCTS_FEATURE_KEY,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload?.data || [];
        state.message = action.payload?.message || null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(toggleProduct.pending, (state) => { state.isMutating = true; state.error = null; })
      .addCase(toggleProduct.fulfilled, (state, action) => {
        state.isMutating = false;
        state.message = action.payload?.message || null;
      })
      .addCase(toggleProduct.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export default productsSlice.reducer;
