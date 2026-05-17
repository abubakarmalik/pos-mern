import apiClient from '../../api/client';

const cleanParams = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== ''),
  );

export const fetchSalesApi = (params = {}) =>
  apiClient.get('/sales', { params: cleanParams(params) });

export const fetchSaleApi = (id) => apiClient.get(`/sales/${id}`);

export const createSaleApi = (payload) => apiClient.post('/sales', payload);

export const createRefundApi = (payload) => apiClient.post('/refunds', payload);
