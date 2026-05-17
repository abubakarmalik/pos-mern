import Pagination from '../ui/Pagination';
import Table from '../ui/Table';

const formatDate = (value) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const StockLedgerTable = ({
  isLoading,
  ledger,
  onPageChange,
  pagination,
}) => {
  const columns = [
    {
      key: 'product',
      label: 'Product',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800">
            {row.product?.name || '-'}
          </p>
          <p className="text-xs text-slate-500">{row.product?.sku || ''}</p>
        </div>
      ),
    },
    { key: 'type', label: 'Type' },
    { key: 'qtyChange', label: 'Qty Change' },
    { key: 'balanceAfter', label: 'Balance' },
    { key: 'note', label: 'Note', render: (row) => row.note || '-' },
    {
      key: 'createdAt',
      label: 'Created',
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div className="space-y-4">
      <Table
        columns={columns}
        data={ledger}
        isLoading={isLoading}
        emptyTitle="No stock movement"
        emptyDescription="Inventory adjustments and sales movement will appear here."
      />
      <Pagination pagination={pagination} onPageChange={onPageChange} itemLabel="entries" />
    </div>
  );
};

export default StockLedgerTable;
