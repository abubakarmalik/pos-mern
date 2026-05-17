import apiClient from '../../api/client';

const cleanParams = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== ''),
  );

export const fetchCategoriesApi = (params = {}) =>
  apiClient.get('/categories', { params: cleanParams(params) });

export const fetchCategoryApi = (id) => apiClient.get(`/categories/${id}`);

export const createCategoryApi = (payload) =>
  apiClient.post('/categories', payload);

export const updateCategoryApi = (id, payload) =>
  apiClient.patch(`/categories/${id}`, payload);

export const toggleCategoryApi = (id) =>
  apiClient.patch(`/categories/${id}/toggle`);
