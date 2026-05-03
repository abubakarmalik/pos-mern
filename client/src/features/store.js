import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import productsReducer from './products/productsSlice';
import usersReducer from './users/usersSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    users: usersReducer,
  },
});

export default store;
