import axios from 'axios';
import { getToken } from '../../utils/authStorage';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const productsApiClient = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } });

productsApiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchProductsApi = (search = '') => productsApiClient.get('/products', { params: { search } });
export const toggleProductApi = (id) => productsApiClient.patch(`/products/${id}/toggle`);
