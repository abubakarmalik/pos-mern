import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiFetch } from '../api/client';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import { formatCurrency } from '../utils/format';
import { useAuth } from '../auth/AuthProvider';

const ProductsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', search],
    queryFn: () => apiFetch(`/products?search=${encodeURIComponent(search)}`),
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => apiFetch(`/products/${id}/toggle`, { method: 'PATCH' }),
    onSuccess: () => {
      toast.success('Product updated');
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
    { key: 'category', label: 'Category', render: (row) => row.category || '-' },
    { key: 'price', label: 'Price', render: (row) => formatCurrency(row.salePriceCents) },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.isActive ? 'success' : 'danger'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {user?.role === 'ADMIN' && (
            <Link
              to={`/products/${row._id}/edit`}
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              Edit
            </Link>
          )}
          {user?.role === 'ADMIN' && (
            <button
              type="button"
              onClick={() => toggleMutation.mutate(row._id)}
              className="text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              {row.isActive ? 'Disable' : 'Enable'}
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-4 shadow">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Products</h2>
          {user?.role === 'ADMIN' && (
            <Link to="/products/new">
              <Button>Add Product</Button>
            </Link>
          )}
        </div>
        <div className="mt-4">
          <Input
            placeholder="Search by name, SKU, category"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>
      <div className="rounded-xl bg-white p-4 shadow">
        {isLoading ? <p className="text-sm text-slate-500">Loading...</p> : <Table columns={columns} data={products} />}
      </div>
    </div>
  );
};

export default ProductsPage;
