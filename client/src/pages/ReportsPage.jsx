import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Table from '../components/ui/Table';
import { selectUser } from '../features/auth/authSelector';
import { fetchCategories } from '../features/categories/categoriesSlice';
import { selectCategories } from '../features/categories/selectors';
import {
  fetchRangeReport,
  fetchTodaySummary,
} from '../features/reports/reportsSlice';
import {
  selectCashierPerformanceReport,
  selectInventoryMovementReport,
  selectLowStockProductsReport,
  selectRangeSummary,
  selectSalesByDateReport,
  selectSalesByPaymentMethodReport,
  selectTodaySummary,
  selectTopProductsReport,
} from '../features/reports/selectors';
import { fetchUsers } from '../features/users/usersSlice';
import { selectUsers } from '../features/users/selectors';
import { formatCurrency } from '../utils/format';
import { getTodayRange, toISODate } from '../utils/date';

const paymentMethods = ['CASH', 'CARD', 'BANK', 'JAZZCASH', 'EASYPAISA'];

const SummaryMetric = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium uppercase text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-semibold text-slate-700">{value}</p>
  </div>
);

const ReportsPage = () => {
  const dispatch = useDispatch();
  const todayRange = useMemo(() => getTodayRange(), []);
  const todaySummary = useSelector(selectTodaySummary);
  const summary = useSelector(selectRangeSummary);
  const topProducts = useSelector(selectTopProductsReport);
  const lowStockProducts = useSelector(selectLowStockProductsReport);
  const salesByDate = useSelector(selectSalesByDateReport);
  const salesByPaymentMethod = useSelector(selectSalesByPaymentMethodReport);
  const cashierPerformance = useSelector(selectCashierPerformanceReport);
  const inventoryMovement = useSelector(selectInventoryMovementReport);
  const categories = useSelector(selectCategories);
  const users = useSelector(selectUsers);
  const currentUser = useSelector(selectUser);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [cashierId, setCashierId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [categoryId, setCategoryId] = useState('');

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
    dispatch(fetchCategories({ limit: 100, isActive: true }));
    if (currentUser?.role === 'ADMIN') {
      dispatch(fetchUsers());
    }
  }, [currentUser?.role, dispatch]);

  useEffect(() => {
    dispatch(fetchRangeReport({ from, to, cashierId, paymentMethod, categoryId }))
      .unwrap()
      .catch((error) => toast.error(error.message));
  }, [categoryId, cashierId, dispatch, from, paymentMethod, to]);

  const topProductColumns = [
    { key: 'name', label: 'Product' },
    { key: 'sku', label: 'SKU' },
    { key: 'qtySold', label: 'Qty Sold' },
    { key: 'revenue', label: 'Revenue', render: (row) => formatCurrency(row.revenue) },
  ];

  const salesByDateColumns = [
    { key: 'date', label: 'Date', render: (row) => String(row.date).slice(0, 10) },
    { key: 'salesCount', label: 'Sales' },
    { key: 'total', label: 'Total', render: (row) => formatCurrency(row.total) },
  ];

  const paymentColumns = [
    { key: 'paymentMethod', label: 'Method' },
    { key: 'salesCount', label: 'Sales' },
    { key: 'total', label: 'Total', render: (row) => formatCurrency(row.total) },
  ];

  const cashierColumns = [
    { key: 'cashierName', label: 'Cashier' },
    { key: 'username', label: 'Username' },
    { key: 'salesCount', label: 'Sales' },
    { key: 'total', label: 'Total', render: (row) => formatCurrency(row.total) },
  ];

  const movementColumns = [
    { key: 'type', label: 'Type' },
    { key: 'count', label: 'Entries' },
    { key: 'qtyChange', label: 'Qty Change' },
  ];

  const lowStockColumns = [
    { key: 'name', label: 'Product' },
    { key: 'sku', label: 'SKU' },
    { key: 'categoryName', label: 'Category' },
    { key: 'stockOnHand', label: 'Stock' },
    { key: 'minStock', label: 'Min Stock' },
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
            <div className="mt-2 grid gap-2 md:grid-cols-5">
              <Input type="date" label="From" value={from} onChange={(e) => setFrom(e.target.value)} />
              <Input type="date" label="To" value={to} onChange={(e) => setTo(e.target.value)} />
              <Select
                label="Cashier"
                value={cashierId}
                onChange={(event) => setCashierId(event.target.value)}
              >
                <option value="">All cashiers</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
              <Select
                label="Payment"
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
              >
                <option value="">All payments</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </Select>
              <Select
                label="Category"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryMetric label="Sales" value={summary.salesCount || 0} />
              <SummaryMetric label="Net total" value={formatCurrency(summary.netTotal || 0)} />
              <SummaryMetric label="Refunds" value={formatCurrency(summary.totalRefunds || 0)} />
              <SummaryMetric label="Net sales" value={formatCurrency(summary.netSales || 0)} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="text-base font-semibold text-slate-800">Top Products</h3>
        <div className="mt-4">
          <Table columns={topProductColumns} data={topProducts} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl bg-white p-4 shadow">
          <h3 className="text-base font-semibold text-slate-800">Sales By Date</h3>
          <div className="mt-4">
            <Table columns={salesByDateColumns} data={salesByDate} />
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow">
          <h3 className="text-base font-semibold text-slate-800">Sales By Payment</h3>
          <div className="mt-4">
            <Table columns={paymentColumns} data={salesByPaymentMethod} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl bg-white p-4 shadow">
          <h3 className="text-base font-semibold text-slate-800">Cashier Performance</h3>
          <div className="mt-4">
            <Table columns={cashierColumns} data={cashierPerformance} />
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow">
          <h3 className="text-base font-semibold text-slate-800">Inventory Movement</h3>
          <div className="mt-4">
            <Table columns={movementColumns} data={inventoryMovement} />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="text-base font-semibold text-slate-800">Low Stock Products</h3>
        <div className="mt-4">
          <Table columns={lowStockColumns} data={lowStockProducts} />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
