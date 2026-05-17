import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SalesFilters from '../components/sales/SalesFilters';
import SalesTable from '../components/sales/SalesTable';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import Pagination from '../components/ui/Pagination';
import { fetchSales } from '../features/sales/salesSlice';
import {
  selectSales,
  selectSalesLoading,
  selectSalesPagination,
} from '../features/sales/selectors';
import useDebounce from '../hooks/useDebounce';

const SalesListPage = () => {
  const dispatch = useDispatch();
  const sales = useSelector(selectSales);
  const pagination = useSelector(selectSalesPagination);
  const isLoading = useSelector(selectSalesLoading);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const debouncedFrom = useDebounce(from);
  const debouncedTo = useDebounce(to);

  useEffect(() => {
    dispatch(fetchSales({ page, limit: 20, dateFrom: debouncedFrom, dateTo: debouncedTo }));
  }, [debouncedFrom, debouncedTo, dispatch, page]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Sales"
        description="Review invoices, totals, payment activity, and refund status."
      />
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
      <Card className="space-y-4">
        <SalesTable isLoading={isLoading} sales={sales} />
        <Pagination pagination={pagination} onPageChange={setPage} itemLabel="sales" />
      </Card>
    </div>
  );
};

export default SalesListPage;
