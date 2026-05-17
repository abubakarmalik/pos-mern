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

  if (isLoading) return <p className="text-sm text-slate-500">Loading...</p>;

  return (
    <div className="space-y-4">
      <Table columns={columns} data={ledger} />
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          Page {pagination.page} of {pagination.totalPages || 1} ·{' '}
          {pagination.total} entries
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
            className="rounded-md border border-slate-200 px-3 py-1 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
            className="rounded-md border border-slate-200 px-3 py-1 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockLedgerTable;
