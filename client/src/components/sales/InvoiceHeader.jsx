const InvoiceHeader = ({ sale, settings }) => (
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
);

export default InvoiceHeader;
