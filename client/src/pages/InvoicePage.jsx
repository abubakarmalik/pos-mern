import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import InvoiceHeader from '../components/sales/InvoiceHeader';
import InvoiceItemsTable from '../components/sales/InvoiceItemsTable';
import InvoiceSummary from '../components/sales/InvoiceSummary';
import Button from '../components/ui/Button';
import { fetchSale } from '../features/sales/salesSlice';
import {
  selectCurrentSale,
  selectCurrentSaleLoading,
} from '../features/sales/selectors';
import { fetchSettings } from '../features/settings/settingsSlice';
import {
  selectCurrencySymbol,
  selectSettings,
} from '../features/settings/selectors';

const InvoicePage = () => {
  const { saleId } = useParams();
  const dispatch = useDispatch();
  const sale = useSelector(selectCurrentSale);
  const isLoading = useSelector(selectCurrentSaleLoading);
  const settings = useSelector(selectSettings);
  const currencySymbol = useSelector(selectCurrencySymbol);

  useEffect(() => {
    dispatch(fetchSale(saleId))
      .unwrap()
      .catch((error) => toast.error(error.message));
    dispatch(fetchSettings());
  }, [dispatch, saleId]);

  if (isLoading) return <div>Loading...</div>;

  if (!sale) return <div>Sale not found.</div>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <InvoiceHeader sale={sale} settings={settings} />
      <InvoiceItemsTable
        currencySymbol={currencySymbol}
        items={sale.items}
      />
      <InvoiceSummary currencySymbol={currencySymbol} sale={sale} />

      <Button onClick={() => window.print()} className="print:hidden">
        Print Receipt
      </Button>
    </div>
  );
};

export default InvoicePage;
