import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createProductApi,
  fetchProductApi,
  fetchProductsApi,
  toggleProductApi,
  updateProductApi,
} from './api';
import { PRODUCTS_FEATURE_KEY } from './constants';

const initialState = {
  items: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  currentItem: null,
  isLoading: false,
  isLoadingCurrent: false,
  isCreating: false,
  isUpdating: false,
  isToggling: false,
  message: null,
  error: null,
};

const getErrorPayload = (error) => error.response?.data || { message: error.message };

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await fetchProductsApi(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchProductApi(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createProductApi(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await updateProductApi(id, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

export const toggleProduct = createAsyncThunk(
  'products/toggleProduct',
  async (id, { rejectWithValue }) => {
    try {
      const response = await toggleProductApi(id);
      return { ...response.data, id };
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

const productsSlice = createSlice({
  name: PRODUCTS_FEATURE_KEY,
  initialState,
  reducers: {
    clearCurrentProduct(state) {
      state.currentItem = null;
      state.error = null;
    },
    clearProductsMessage(state) {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload?.data?.items || [];
        state.pagination =
          action.payload?.data?.pagination || initialState.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(fetchProduct.pending, (state) => {
        state.isLoadingCurrent = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoadingCurrent = false;
        state.currentItem = action.payload?.data || null;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoadingCurrent = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(createProduct.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isCreating = false;
        state.currentItem = action.payload?.data || null;
        state.message = action.payload?.message || null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(updateProduct.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.currentItem = action.payload?.data || state.currentItem;
        state.message = action.payload?.message || null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(toggleProduct.pending, (state) => {
        state.isToggling = true;
        state.error = null;
      })
      .addCase(toggleProduct.fulfilled, (state, action) => {
        state.isToggling = false;
        state.message = action.payload?.message || null;
      })
      .addCase(toggleProduct.rejected, (state, action) => {
        state.isToggling = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { clearCurrentProduct, clearProductsMessage } = productsSlice.actions;
export default productsSlice.reducer;
