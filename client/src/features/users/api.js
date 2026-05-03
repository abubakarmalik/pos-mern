import apiClient from '../../api/client';

export const fetchUsersApi = () => apiClient.get('/users');
