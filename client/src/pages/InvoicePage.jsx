import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiPrinter } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import InvoiceHeader from '../components/sales/InvoiceHeader';
import InvoiceItemsTable from '../components/sales/InvoiceItemsTable';
import InvoiceSummary from '../components/sales/InvoiceSummary';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { PageLoader } from '../components/ui/Loader';
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
    dispatch(fetchSale(saleId));
    dispatch(fetchSettings());
  }, [dispatch, saleId]);

  if (isLoading) return <PageLoader label="Loading receipt" />;

  if (!sale) return <Card>Sale not found.</Card>;

  return (
    <div className="mx-auto max-w-sm print:max-w-none">
      <div className="rounded-xl border border-slate-200 bg-white p-5 font-mono text-slate-900 shadow-sm print:border-0 print:p-0 print:shadow-none">
        <InvoiceHeader sale={sale} settings={settings} />
        <InvoiceItemsTable
          currencySymbol={currencySymbol}
          items={sale.items}
        />
        <InvoiceSummary currencySymbol={currencySymbol} sale={sale} />
        <footer className="pt-4 text-center text-xs text-slate-600">
          <p className="font-semibold uppercase tracking-wide">Thank you</p>
          <p>Please keep this receipt for your records.</p>
        </footer>
      </div>

      <Button
        onClick={() => window.print()}
        className="mt-4 w-full print:hidden"
        leftIcon={<FiPrinter />}
      >
        Print Receipt
      </Button>
    </div>
  );
};

export default InvoicePage;
