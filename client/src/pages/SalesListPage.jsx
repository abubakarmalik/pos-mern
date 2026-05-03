import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import SalesFilters from '../components/sales/SalesFilters';
import SalesTable from '../components/sales/SalesTable';
import { fetchSales } from '../features/sales/salesSlice';
import {
  selectSales,
  selectSalesLoading,
} from '../features/sales/selectors';

const SalesListPage = () => {
  const dispatch = useDispatch();
  const sales = useSelector(selectSales);
  const isLoading = useSelector(selectSalesLoading);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => {
    dispatch(fetchSales({ from, to }))
      .unwrap()
      .catch((error) => toast.error(error.message));
  }, [dispatch, from, to]);

  return (
    <div className="space-y-4">
      <SalesFilters
        from={from}
        onFromChange={setFrom}
        onToChange={setTo}
        to={to}
      />
      <div className="rounded-xl bg-white p-4 shadow">
        <SalesTable isLoading={isLoading} sales={sales} />
      </div>
    </div>
  );
};

export default SalesListPage;
