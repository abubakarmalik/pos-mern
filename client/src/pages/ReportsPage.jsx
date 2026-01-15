import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../api/client';
import Input from '../components/ui/Input';
import Table from '../components/ui/Table';
import { formatCurrency } from '../utils/format';
import { getTodayRange, toISODate } from '../utils/date';

const ReportsPage = () => {
  const todayRange = useMemo(() => getTodayRange(), []);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const { data: todaySummary } = useQuery({
    queryKey: ['reports', 'today'],
    queryFn: () =>
      apiFetch(
        `/reports/summary?from=${toISODate(todayRange.start)}&to=${toISODate(todayRange.end)}`,
      ),
  });

  const { data: rangeSummary } = useQuery({
    queryKey: ['reports', 'range', from, to],
    queryFn: () => {
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      return apiFetch(`/reports/summary?${params.toString()}`);
    },
  });

  const { data: topProductsData } = useQuery({
    queryKey: ['reports', 'top', from, to],
    queryFn: () => {
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      return apiFetch(`/reports/top-products?${params.toString()}`);
    },
  });

  const summary = rangeSummary?.data || {};
  const topProducts = topProductsData?.data || [];

  const columns = [
    { key: 'name', label: 'Product' },
    { key: 'sku', label: 'SKU' },
    { key: 'qtySold', label: 'Qty Sold' },
    { key: 'revenue', label: 'Revenue', render: (row) => formatCurrency(row.revenue) },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-4 shadow">
        <h2 className="text-lg font-semibold text-slate-800">Reports</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-600">Today</h3>
            <p className="text-sm text-slate-500">Sales: {todaySummary?.data?.salesCount || 0}</p>
            <p className="text-sm text-slate-500">
              Net: {formatCurrency(todaySummary?.data?.netTotal || 0)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-600">Date Range</h3>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <Input type="date" label="From" value={from} onChange={(e) => setFrom(e.target.value)} />
              <Input type="date" label="To" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <p className="mt-2 text-sm text-slate-500">Sales: {summary.salesCount || 0}</p>
            <p className="text-sm text-slate-500">Net: {formatCurrency(summary.netTotal || 0)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="text-base font-semibold text-slate-800">Top Products</h3>
        <div className="mt-4">
          <Table columns={columns} data={topProducts} />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
