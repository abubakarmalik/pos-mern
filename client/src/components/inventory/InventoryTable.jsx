import { FiSliders } from 'react-icons/fi';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Table from '../ui/Table';

const InventoryTable = ({ isLoading, onAdjust, products, user }) => {
  const isAdmin = user?.role === 'ADMIN';
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
    isAdmin && {
      key: 'action',
      label: 'Action',
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<FiSliders />}
          onClick={() => onAdjust(row)}
        >
          Adjust
        </Button>
      ),
    },
  ].filter(Boolean);

  return (
    <Table
      columns={columns}
      data={products}
      isLoading={isLoading}
      emptyTitle="No inventory products"
      emptyDescription="Products will appear here after they are created."
    />
  );
};

export default InventoryTable;
