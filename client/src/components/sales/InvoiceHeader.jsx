const InvoiceHeader = ({ sale, settings }) => (
  <header className="border-b border-dashed border-slate-400 pb-4 text-center">
    <h2 className="text-lg font-bold uppercase tracking-wide text-slate-950">
      {settings?.shopName || 'Minimal POS'}
    </h2>
    {settings?.address && <p className="mt-1 text-xs text-slate-600">{settings.address}</p>}
    {settings?.phone && <p className="text-xs text-slate-600">Tel: {settings.phone}</p>}
    <div className="mt-4 space-y-1 text-left text-xs text-slate-700">
      <div className="flex justify-between gap-3">
        <span>Invoice</span>
        <span className="font-semibold">{sale.invoiceNo}</span>
      </div>
      <div className="flex justify-between gap-3">
        <span>Date</span>
        <span>{new Date(sale.createdAt).toLocaleString()}</span>
      </div>
      <div className="flex justify-between gap-3">
        <span>Cashier</span>
        <span>{sale.cashier?.name || 'Staff'}</span>
      </div>
    </div>
  </header>
);

export default InvoiceHeader;
