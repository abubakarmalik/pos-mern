import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Table from '../ui/Table';

const InventoryTable = ({ isLoading, onAdjust, products, user }) => {
  const columns = [
    {
      key: 'name',
      label: 'Product',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-500">{row.sku || 'No SKU'}</p>
        </div>
      ),
    },
    {
      key: 'stockOnHand',
      label: 'Stock',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.stockOnHand}</span>
          {row.minStock != null && row.stockOnHand <= row.minStock && (
            <Badge variant="warning">Low</Badge>
          )}
        </div>
      ),
    },
    { key: 'unit', label: 'Unit' },
    {
      key: 'action',
      label: 'Action',
      render: (row) =>
        user?.role === 'ADMIN' ? (
          <Button variant="ghost" size="sm" onClick={() => onAdjust(row)}>
            Adjust
          </Button>
        ) : (
          <span className="text-xs text-slate-400">View only</span>
        ),
    },
  ];

  if (isLoading) return <p className="text-sm text-slate-500">Loading...</p>;
  return <Table columns={columns} data={products} />;
};

export default InventoryTable;
