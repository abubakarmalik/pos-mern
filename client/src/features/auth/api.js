import axios from 'axios';
import { clearAuthStorage, getToken } from '../../utils/authStorage';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const authApiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

authApiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthStorage();
    }
    return Promise.reject(error);
  },
);

export const loginUser = (credentials) => authApiClient.post('/auth/login', credentials);

export const fetchCurrentUserApi = () => authApiClient.get('/auth/me');
