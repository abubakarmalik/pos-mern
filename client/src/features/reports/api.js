import apiClient from '../../api/client';

export const fetchSummaryReportApi = ({ from, to } = {}) =>
  apiClient.get('/reports/summary', {
    params: {
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
    },
  });

export const fetchTopProductsReportApi = ({ from, to } = {}) =>
  apiClient.get('/reports/top-products', {
    params: {
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
    },
  });
