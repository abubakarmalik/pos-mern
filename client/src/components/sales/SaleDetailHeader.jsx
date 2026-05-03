import Button from '../ui/Button';

const SaleDetailHeader = ({ onRefund, sale, user }) => (
  <div className="rounded-xl bg-white p-4 shadow">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          {sale.invoiceNo}
        </h2>
        <p className="text-sm text-slate-500">
          {new Date(sale.createdAt).toLocaleString()}
        </p>
      </div>
      {user?.role === 'ADMIN' && sale.status !== 'REFUNDED' && (
        <Button variant="danger" onClick={onRefund}>
          Refund Sale
        </Button>
      )}
    </div>
  </div>
);

export default SaleDetailHeader;
