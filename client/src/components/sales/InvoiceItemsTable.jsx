import { formatCurrency } from '../../utils/format';

const InvoiceItemsTable = ({ currencySymbol, items }) => (
  <div className="border-b border-dashed border-slate-400 py-3">
    <table className="w-full text-xs">
      <thead className="text-left uppercase text-slate-500">
        <tr>
          <th className="py-1">Item</th>
          <th className="py-1 text-center">Qty</th>
          <th className="py-1 text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.productId} className="border-t border-dashed border-slate-200">
            <td className="py-2 pr-2">
              <p className="font-semibold text-slate-900">
                {item.nameSnapshot}
              </p>
              <p className="text-[11px] text-slate-500">
                {item.skuSnapshot || 'No SKU'} · {formatCurrency(item.salePriceSnapshot, currencySymbol)}
              </p>
            </td>
            <td className="py-2 text-center">{item.qty}</td>
            <td className="py-2 text-right font-semibold">
              {formatCurrency(item.lineTotal, currencySymbol)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default InvoiceItemsTable;
