import apiClient from '../../api/client';

export const fetchSettingsApi = () => apiClient.get('/settings');

export const updateSettingsApi = (payload) =>
  apiClient.patch('/settings', payload);
