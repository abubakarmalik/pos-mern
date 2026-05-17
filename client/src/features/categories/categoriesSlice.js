import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createCategoryApi,
  fetchCategoriesApi,
  fetchCategoryApi,
  toggleCategoryApi,
  updateCategoryApi,
} from './api';

const initialState = {
  items: [],
  currentItem: null,
  pagination: {
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  isLoadingCurrent: false,
  isCreating: false,
  isUpdating: false,
  isToggling: false,
  message: null,
  error: null,
};

const getErrorPayload = (error) =>
  error.response?.data || { message: error.message };

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await fetchCategoriesApi({
        page: 1,
        limit: 100,
        ...params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

export const fetchCategory = createAsyncThunk(
  'categories/fetchCategory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchCategoryApi(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createCategoryApi(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await updateCategoryApi(id, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

export const toggleCategory = createAsyncThunk(
  'categories/toggleCategory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await toggleCategoryApi(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCurrentCategory(state) {
      state.currentItem = null;
      state.error = null;
    },
    clearCategoriesMessage(state) {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload?.data?.items || [];
        state.pagination =
          action.payload?.data?.pagination || initialState.pagination;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(fetchCategory.pending, (state) => {
        state.isLoadingCurrent = true;
        state.error = null;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.isLoadingCurrent = false;
        state.currentItem = action.payload?.data || null;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.isLoadingCurrent = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(createCategory.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isCreating = false;
        state.currentItem = action.payload?.data || null;
        state.message = action.payload?.message || null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(updateCategory.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.currentItem = action.payload?.data || state.currentItem;
        state.message = action.payload?.message || null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(toggleCategory.pending, (state) => {
        state.isToggling = true;
        state.error = null;
      })
      .addCase(toggleCategory.fulfilled, (state, action) => {
        state.isToggling = false;
        const updated = action.payload?.data;
        state.items = state.items.map((category) =>
          category.id === updated?.id ? updated : category,
        );
        state.message = action.payload?.message || null;
      })
      .addCase(toggleCategory.rejected, (state, action) => {
        state.isToggling = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { clearCategoriesMessage, clearCurrentCategory } =
  categoriesSlice.actions;
export default categoriesSlice.reducer;
