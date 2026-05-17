import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createUserApi, fetchUsersApi, toggleUserApi } from './api';

const initialState = {
  items: [],
  isLoading: false,
  isCreating: false,
  isToggling: false,
  message: null,
  error: null,
};

const getErrorPayload = (error) =>
  error.response?.data || { message: error.message };

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUsersApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createUserApi(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

export const toggleUser = createAsyncThunk(
  'users/toggleUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await toggleUserApi(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersMessage(state) {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload?.data || [];
        state.message = action.payload?.message || null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(createUser.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isCreating = false;
        state.items = [action.payload?.data, ...state.items].filter(Boolean);
        state.message = action.payload?.message || null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(toggleUser.pending, (state) => {
        state.isToggling = true;
        state.error = null;
      })
      .addCase(toggleUser.fulfilled, (state, action) => {
        state.isToggling = false;
        const updated = action.payload?.data;
        state.items = state.items.map((user) =>
          user.id === updated?.id
            ? { ...user, isActive: updated.isActive }
            : user,
        );
        state.message = action.payload?.message || null;
      })
      .addCase(toggleUser.rejected, (state, action) => {
        state.isToggling = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { clearUsersMessage } = usersSlice.actions;
export default usersSlice.reducer;
