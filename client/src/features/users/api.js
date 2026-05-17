import apiClient from '../../api/client';

export const fetchUsersApi = () => apiClient.get('/users');

export const createUserApi = (payload) => apiClient.post('/users', payload);

export const toggleUserApi = (id) => apiClient.patch(`/users/${id}/toggle`);
