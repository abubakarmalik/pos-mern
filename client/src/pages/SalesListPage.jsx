import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import SalesFilters from '../components/sales/SalesFilters';
import SalesTable from '../components/sales/SalesTable';
import { fetchSales } from '../features/sales/salesSlice';
import {
  selectSales,
  selectSalesLoading,
  selectSalesPagination,
} from '../features/sales/selectors';

const SalesListPage = () => {
  const dispatch = useDispatch();
  const sales = useSelector(selectSales);
  const pagination = useSelector(selectSalesPagination);
  const isLoading = useSelector(selectSalesLoading);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchSales({ page, limit: 20, dateFrom: from, dateTo: to }))
      .unwrap()
      .catch((error) => toast.error(error.message));
  }, [dispatch, from, page, to]);

  return (
    <div className="space-y-4">
      <SalesFilters
        from={from}
        onFromChange={(value) => {
          setFrom(value);
          setPage(1);
        }}
        onToChange={(value) => {
          setTo(value);
          setPage(1);
        }}
        to={to}
      />
      <div className="rounded-xl bg-white p-4 shadow">
        <SalesTable isLoading={isLoading} sales={sales} />
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>
            Page {pagination.page} of {pagination.totalPages || 1} ·{' '}
            {pagination.total} sales
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => setPage(pagination.page - 1)}
              className="rounded-md border border-slate-200 px-3 py-1 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage(pagination.page + 1)}
              className="rounded-md border border-slate-200 px-3 py-1 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesListPage;
