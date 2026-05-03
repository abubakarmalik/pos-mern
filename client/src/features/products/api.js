import apiClient from '../../api/client';

export const fetchProductsApi = (search = '') =>
  apiClient.get('/products', { params: search ? { search } : undefined });

export const fetchProductApi = (id) => apiClient.get(`/products/${id}`);

export const createProductApi = (payload) => apiClient.post('/products', payload);

export const updateProductApi = (id, payload) =>
  apiClient.patch(`/products/${id}`, payload);

export const toggleProductApi = (id) => apiClient.patch(`/products/${id}/toggle`);
