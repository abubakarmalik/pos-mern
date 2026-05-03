import { formatCurrency } from '../../utils/format';

const InvoiceItemsTable = ({ currencySymbol, items }) => (
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
        {items.map((item) => (
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
);

export default InvoiceItemsTable;
