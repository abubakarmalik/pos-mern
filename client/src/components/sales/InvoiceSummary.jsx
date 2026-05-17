import { formatCurrency } from '../../utils/format';

const InvoiceSummary = ({ currencySymbol, sale }) => (
  <div className="space-y-1 border-b border-dashed border-slate-400 py-3 text-xs">
    <div className="flex justify-between text-slate-600">
      <span>Subtotal</span>
      <span>{formatCurrency(sale.subtotal, currencySymbol)}</span>
    </div>
    <div className="flex justify-between text-slate-600">
      <span>Discounts</span>
      <span>{formatCurrency(sale.discountTotal, currencySymbol)}</span>
    </div>
    <div className="flex justify-between text-slate-600">
      <span>Tax</span>
      <span>{formatCurrency(sale.taxTotal, currencySymbol)}</span>
    </div>
    <div className="mt-2 flex justify-between border-y border-dashed border-slate-300 py-2 text-base font-bold text-slate-950">
      <span>Total</span>
      <span>{formatCurrency(sale.total, currencySymbol)}</span>
    </div>
    <div className="mt-2 space-y-1 text-slate-600">
      <div className="flex justify-between">
        <span>Payment</span>
        <span>{sale.paymentMethod}</span>
      </div>
      {sale.paymentMethod === 'CASH' && (
        <>
          <div className="flex justify-between">
            <span>Cash received</span>
            <span>{formatCurrency(sale.cashReceived, currencySymbol)}</span>
          </div>
          <div className="flex justify-between">
            <span>Change due</span>
            <span>{formatCurrency(sale.changeDue, currencySymbol)}</span>
          </div>
        </>
      )}
    </div>
  </div>
);

export default InvoiceSummary;
