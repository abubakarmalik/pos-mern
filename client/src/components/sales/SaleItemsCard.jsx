import { formatCurrency } from '../../utils/format';

const SaleItemsCard = ({ sale }) => (
  <div className="rounded-xl bg-white p-4 shadow">
    <table className="min-w-full text-sm">
      <thead className="text-left text-slate-600">
        <tr>
          <th className="py-2">Item</th>
          <th className="py-2">Qty</th>
          <th className="py-2">Total</th>
        </tr>
      </thead>
      <tbody>
        {sale.items.map((item) => (
          <tr key={item.productId} className="border-t border-slate-100">
            <td className="py-2">
              <p className="font-medium text-slate-800">
                {item.nameSnapshot}
              </p>
              <p className="text-xs text-slate-500">{item.skuSnapshot}</p>
            </td>
            <td className="py-2">{item.qty}</td>
            <td className="py-2">{formatCurrency(item.lineTotal)}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="mt-4 text-sm text-slate-600">
      <p>Total: {formatCurrency(sale.total)}</p>
      <p>Status: {sale.status}</p>
    </div>
  </div>
);

export default SaleItemsCard;
