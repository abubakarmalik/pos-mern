import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import inventoryReducer from './inventory/inventorySlice';
import productsReducer from './products/productsSlice';
import reportsReducer from './reports/reportsSlice';
import salesReducer from './sales/salesSlice';
import settingsReducer from './settings/settingsSlice';
import usersReducer from './users/usersSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    products: productsReducer,
    reports: reportsReducer,
    sales: salesReducer,
    settings: settingsReducer,
    users: usersReducer,
  },
});

export default store;
