import apiClient from '../../api/client';

export const loginUser = (credentials) => apiClient.post('/auth/login', credentials);
export const fetchCurrentUserApi = () => apiClient.get('/auth/me');
export const logoutUser = () => apiClient.post('/auth/logout');
