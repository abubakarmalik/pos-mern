import axios from 'axios';
import { clearAuthStorage, getToken } from '../utils/authStorage';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthStorage();
    }

    const apiError = new Error(
      error.response?.data?.message || error.message || 'Request failed',
    );
    apiError.code = error.response?.data?.error?.code;
    apiError.details = error.response?.data?.error?.details;
    apiError.status = error.response?.status;
    apiError.response = error.response;
    return Promise.reject(apiError);
  },
);

export default apiClient;
