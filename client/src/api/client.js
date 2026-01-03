import { getToken } from '../auth/authStorage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const apiFetch = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();
  if (!response.ok || data.success === false) {
    const error = new Error(data.message || 'Request failed');
    error.errors = data.errors;
    throw error;
  }

  return data;
};
