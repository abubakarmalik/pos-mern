import { formatCurrency } from '../../utils/format';

const InvoiceSummary = ({ currencySymbol, sale }) => (
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
);

export default InvoiceSummary;
