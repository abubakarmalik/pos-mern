import apiClient from '../../api/client';

const cleanParams = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== false),
  );

export const fetchProductsApi = (params = {}) =>
  apiClient.get('/products', { params: cleanParams(params) });

export const fetchProductApi = (id) => apiClient.get(`/products/${id}`);

export const createProductApi = (payload) => apiClient.post('/products', payload);

export const updateProductApi = (id, payload) =>
  apiClient.patch(`/products/${id}`, payload);

export const toggleProductApi = (id) => apiClient.patch(`/products/${id}/toggle`);
