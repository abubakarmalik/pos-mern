import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiFetch } from '../api/client';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { useAuth } from '../auth/AuthProvider';

const InventoryPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qtyChange, setQtyChange] = useState('');
  const [note, setNote] = useState('');

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => apiFetch('/products'),
  });

  const adjustMutation = useMutation({
    mutationFn: (payload) => apiFetch('/inventory/adjust', { method: 'POST', body: payload }),
    onSuccess: () => {
      toast.success('Stock adjusted');
      setAdjustOpen(false);
      setQtyChange('');
      setNote('');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => toast.error(error.message),
  });

  const products = productsData?.data || [];

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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedProduct(row);
              setAdjustOpen(true);
            }}
          >
            Adjust
          </Button>
        ) : (
          <span className="text-xs text-slate-400">View only</span>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-4 shadow">
        <h2 className="text-lg font-semibold text-slate-800">Inventory</h2>
      </div>
      <div className="rounded-xl bg-white p-4 shadow">
        {isLoading ? <p className="text-sm text-slate-500">Loading...</p> : <Table columns={columns} data={products} />}
      </div>

      <Modal
        open={adjustOpen}
        title={`Adjust Stock - ${selectedProduct?.name || ''}`}
        onClose={() => setAdjustOpen(false)}
      >
        <div className="space-y-4">
          <Input
            label="Quantity Change"
            type="number"
            value={qtyChange}
            onChange={(event) => setQtyChange(event.target.value)}
          />
          <Input label="Note" value={note} onChange={(event) => setNote(event.target.value)} />
          <Button
            onClick={() =>
              adjustMutation.mutate({
                productId: selectedProduct?._id,
                qtyChange: Number(qtyChange),
                note,
              })
            }
            disabled={adjustMutation.isLoading}
            className="w-full"
          >
            {adjustMutation.isLoading ? 'Saving...' : 'Apply Adjustment'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default InventoryPage;
