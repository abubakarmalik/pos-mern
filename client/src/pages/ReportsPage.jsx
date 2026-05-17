import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import PageHeader from '../components/ui/PageHeader';
import Select from '../components/ui/Select';
import StatCard from '../components/ui/StatCard';
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
  selectReportsError,
  selectReportsLoading,
  selectSalesByDateReport,
  selectSalesByPaymentMethodReport,
  selectTodaySummary,
  selectTopProductsReport,
} from '../features/reports/selectors';
import { fetchUsers } from '../features/users/usersSlice';
import { selectUsers } from '../features/users/selectors';
import { formatCurrency } from '../utils/format';
import { getTodayRange, toISODate } from '../utils/date';
import useDebounce from '../hooks/useDebounce';

const paymentMethods = ['CASH', 'CARD', 'BANK', 'JAZZCASH', 'EASYPAISA'];

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
  const isLoading = useSelector(selectReportsLoading);
  const error = useSelector(selectReportsError);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [cashierId, setCashierId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const reportFilters = useMemo(
    () => ({ from, to, cashierId, paymentMethod, categoryId }),
    [categoryId, cashierId, from, paymentMethod, to],
  );
  const debouncedFilters = useDebounce(reportFilters);

  useEffect(() => {
    dispatch(
      fetchTodaySummary({
        from: toISODate(todayRange.start),
        to: toISODate(todayRange.end),
      }),
    );
  }, [dispatch, todayRange]);

  useEffect(() => {
    dispatch(fetchCategories({ limit: 100, isActive: true }));
    if (currentUser?.role === 'ADMIN') {
      dispatch(fetchUsers());
    }
  }, [currentUser?.role, dispatch]);

  useEffect(() => {
    dispatch(fetchRangeReport(debouncedFilters));
  }, [debouncedFilters, dispatch]);

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
      <PageHeader
        title="Reports"
        description="Track daily performance, product movement, payment mix, and low-stock risk."
      />
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today sales" value={todaySummary.salesCount || 0} loading={isLoading} />
        <StatCard
          label="Today net"
          value={formatCurrency(todaySummary.netTotal || 0)}
          tone="emerald"
          loading={isLoading}
        />
        <StatCard
          label="Range net sales"
          value={formatCurrency(summary.netSales || 0)}
          tone="blue"
          loading={isLoading}
        />
        <StatCard
          label="Refunds"
          value={formatCurrency(summary.totalRefunds || 0)}
          tone="amber"
          loading={isLoading}
        />
      </div>

      <Card>
        <h2 className="text-base font-semibold text-slate-900">Date range filters</h2>
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
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-slate-800">Top Products</h3>
        <div className="mt-4">
          <Table columns={topProductColumns} data={topProducts} isLoading={isLoading} emptyTitle="No product sales" />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h3 className="text-base font-semibold text-slate-800">Sales By Date</h3>
          <div className="mt-4">
            <Table columns={salesByDateColumns} data={salesByDate} isLoading={isLoading} />
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-slate-800">Sales By Payment</h3>
          <div className="mt-4">
            <Table columns={paymentColumns} data={salesByPaymentMethod} isLoading={isLoading} />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h3 className="text-base font-semibold text-slate-800">Cashier Performance</h3>
          <div className="mt-4">
            <Table columns={cashierColumns} data={cashierPerformance} isLoading={isLoading} />
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-slate-800">Inventory Movement</h3>
          <div className="mt-4">
            <Table columns={movementColumns} data={inventoryMovement} isLoading={isLoading} />
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-base font-semibold text-slate-800">Low Stock Products</h3>
        <div className="mt-4">
          <Table columns={lowStockColumns} data={lowStockProducts} isLoading={isLoading} emptyTitle="No low stock products" />
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;
