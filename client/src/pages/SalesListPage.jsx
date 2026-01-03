import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../api/client';
import Table from '../components/ui/Table';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { formatCurrency } from '../utils/format';

const SalesListPage = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const { data: salesData, isLoading } = useQuery({
    queryKey: ['sales', from, to],
    queryFn: () => {
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      return apiFetch(`/sales?${params.toString()}`);
    },
  });

  const sales = salesData?.data || [];

  const columns = [
    {
      key: 'invoiceNo',
      label: 'Invoice',
      render: (row) => (
        <Link
          to={`/sales/${row._id}`}
          className="font-medium text-blue-600 hover:underline"
        >
          {row.invoiceNo}
        </Link>
      ),
    },
    { key: 'createdAt', label: 'Date', render: (row) => new Date(row.createdAt).toLocaleString() },
    { key: 'totalCents', label: 'Total', render: (row) => formatCurrency(row.totalCents) },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'REFUNDED' ? 'danger' : 'success'}>
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-4 shadow">
        <h2 className="text-lg font-semibold text-slate-800">Sales</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Input type="date" label="From" value={from} onChange={(e) => setFrom(e.target.value)} />
          <Input type="date" label="To" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>
      <div className="rounded-xl bg-white p-4 shadow">
        {isLoading ? <p className="text-sm text-slate-500">Loading...</p> : <Table columns={columns} data={sales} />}
      </div>
    </div>
  );
};

export default SalesListPage;
