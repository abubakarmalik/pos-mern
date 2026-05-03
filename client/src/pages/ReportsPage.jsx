import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../components/ui/Input';
import Table from '../components/ui/Table';
import {
  fetchRangeReport,
  fetchTodaySummary,
} from '../features/reports/reportsSlice';
import {
  selectRangeSummary,
  selectTodaySummary,
  selectTopProductsReport,
} from '../features/reports/selectors';
import { formatCurrency } from '../utils/format';
import { getTodayRange, toISODate } from '../utils/date';

const ReportsPage = () => {
  const dispatch = useDispatch();
  const todayRange = useMemo(() => getTodayRange(), []);
  const todaySummary = useSelector(selectTodaySummary);
  const summary = useSelector(selectRangeSummary);
  const topProducts = useSelector(selectTopProductsReport);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => {
    dispatch(
      fetchTodaySummary({
        from: toISODate(todayRange.start),
        to: toISODate(todayRange.end),
      }),
    )
      .unwrap()
      .catch((error) => toast.error(error.message));
  }, [dispatch, todayRange]);

  useEffect(() => {
    dispatch(fetchRangeReport({ from, to }))
      .unwrap()
      .catch((error) => toast.error(error.message));
  }, [dispatch, from, to]);

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
            <p className="text-sm text-slate-500">Sales: {todaySummary.salesCount || 0}</p>
            <p className="text-sm text-slate-500">
              Net: {formatCurrency(todaySummary.netTotal || 0)}
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
