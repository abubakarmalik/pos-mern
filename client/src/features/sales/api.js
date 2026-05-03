import apiClient from '../../api/client';

export const fetchSalesApi = ({ from, to } = {}) =>
  apiClient.get('/sales', {
    params: {
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
    },
  });

export const fetchSaleApi = (id) => apiClient.get(`/sales/${id}`);

export const createSaleApi = (payload) => apiClient.post('/sales', payload);

export const createRefundApi = (payload) => apiClient.post('/refunds', payload);
