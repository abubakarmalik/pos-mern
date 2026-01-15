import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from '../components/ui/Button';
import { apiFetch } from '../api/client';
import { formatCurrency } from '../utils/format';

const InvoicePage = () => {
  const { saleId } = useParams();

  const { data: saleData, isLoading } = useQuery({
    queryKey: ['sales', saleId],
    queryFn: () => apiFetch(`/sales/${saleId}`),
  });

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: () => apiFetch('/settings'),
  });

  if (isLoading) return <div>Loading...</div>;

  const sale = saleData?.data;
  const settings = settingsData?.data;
  const currencySymbol = settings?.currencySymbol || 'PKR';

  if (!sale) return <div>Sale not found.</div>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            {settings?.shopName || 'Minimal POS'}
          </h2>
          <p className="text-sm text-slate-500">{settings?.address}</p>
          <p className="text-sm text-slate-500">{settings?.phone}</p>
        </div>
        <div className="text-right text-sm text-slate-600">
          <p>Invoice: {sale.invoiceNo}</p>
          <p>{new Date(sale.createdAt).toLocaleString()}</p>
          <p>Cashier: {sale.cashierId?.name || 'Staff'}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Qty</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item) => (
              <tr key={item.productId} className="border-t border-slate-100">
                <td className="px-4 py-2">
                  <p className="font-medium text-slate-800">
                    {item.nameSnapshot}
                  </p>
                  <p className="text-xs text-slate-500">{item.skuSnapshot}</p>
                </td>
                <td className="px-4 py-2">{item.qty}</td>
                <td className="px-4 py-2">
                  {formatCurrency(item.salePriceSnapshot, currencySymbol)}
                </td>
                <td className="px-4 py-2">
                  {formatCurrency(item.lineTotal, currencySymbol)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Subtotal</span>
          <span>{formatCurrency(sale.subtotal, currencySymbol)}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Discounts</span>
          <span>{formatCurrency(sale.discountTotal, currencySymbol)}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Tax</span>
          <span>{formatCurrency(sale.taxTotal, currencySymbol)}</span>
        </div>
        <div className="mt-2 flex justify-between text-base font-semibold text-slate-800">
          <span>Total</span>
          <span>{formatCurrency(sale.total, currencySymbol)}</span>
        </div>
        <div className="mt-2 text-sm text-slate-500">
          <p>Payment: {sale.paymentMethod}</p>
          {sale.paymentMethod === 'CASH' && (
            <p>
              Cash: {formatCurrency(sale.cashReceived, currencySymbol)} | Change:{' '}
              {formatCurrency(sale.changeDue, currencySymbol)}
            </p>
          )}
        </div>
      </div>

      <Button onClick={() => window.print()} className="print:hidden">
        Print Receipt
      </Button>
    </div>
  );
};

export default InvoicePage;
