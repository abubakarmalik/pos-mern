import apiClient from '../../api/client';

export const adjustInventoryApi = (payload) =>
  apiClient.post('/inventory/adjust', payload);

export const fetchStockLedgerApi = (params = {}) =>
  apiClient.get('/inventory/ledger', { params });
