import apiClient from '../../api/client';

const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value != null),
  );

export const fetchSummaryReportApi = (params = {}) =>
  apiClient.get('/reports/summary', { params: cleanParams(params) });

export const fetchTopProductsReportApi = (params = {}) =>
  apiClient.get('/reports/top-products', { params: cleanParams(params) });

export const fetchDashboardReportApi = (params = {}) =>
  apiClient.get('/reports/dashboard', { params: cleanParams(params) });

export const fetchCashierPerformanceReportApi = (params = {}) =>
  apiClient.get('/reports/cashier-performance', { params: cleanParams(params) });

export const fetchInventoryMovementReportApi = (params = {}) =>
  apiClient.get('/reports/inventory-movement', { params: cleanParams(params) });
