import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiPower } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import ConfirmDialog from '../ui/ConfirmDialog';
import Pagination from '../ui/Pagination';
import { formatCurrency } from '../../utils/format';
import { selectUser } from '../../features/auth/authSelector';
import {
  selectProducts,
  selectProductsError,
  selectProductsLoading,
  selectProductsMessage,
  selectProductsPagination,
} from '../../features/products/selectors';
import {
  clearProductsMessage,
  fetchProducts,
  toggleProduct,
} from '../../features/products/productsSlice';

const ProductsTable = ({ filters, onPageChange }) => {
  const dispatch = useDispatch();
  const items = useSelector(selectProducts);
  const pagination = useSelector(selectProductsPagination);
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const message = useSelector(selectProductsMessage);
  const user = useSelector(selectUser);
  const [pendingToggle, setPendingToggle] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);
  useEffect(() => {
    if (!message) return;
    toast.success(message);
    dispatch(clearProductsMessage());
  }, [dispatch, message]);

  const isAdmin = user?.role === 'ADMIN';
  const columns = [
    { key: 'name', label: 'Product', render: (row) => <div><p className="font-medium text-slate-900">{row.name}</p><p className="text-xs text-slate-500">{row.sku || 'No SKU'}{row.barcode ? ` · ${row.barcode}` : ''}</p></div> },
    { key: 'category', label: 'Category', render: (row) => row.category || '-' },
    { key: 'price', label: 'Price', render: (row) => formatCurrency(row.salePrice) },
    { key: 'status', label: 'Status', render: (row) => <Badge variant={row.isActive ? 'success' : 'danger'}>{row.isActive ? 'Active' : 'Inactive'}</Badge> },
    isAdmin && { key: 'actions', label: 'Actions', render: (row) => <div className="flex flex-wrap gap-2"><Link to={`/products/${row.id}/edit`} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-cyan-700 hover:bg-cyan-50"><FiEdit2 /> Edit</Link><Button variant="ghost" size="sm" leftIcon={<FiPower />} onClick={() => setPendingToggle(row)}>{row.isActive ? 'Disable' : 'Enable'}</Button></div> },
  ].filter(Boolean);

  return (
    <Card className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <Table
        columns={columns}
        data={items}
        isLoading={isLoading}
        emptyTitle="No products found"
        emptyDescription="Adjust filters or add a new product to the catalog."
      />
      <Pagination pagination={pagination} onPageChange={onPageChange} itemLabel="products" />
      <ConfirmDialog
        open={Boolean(pendingToggle)}
        title={`${pendingToggle?.isActive ? 'Disable' : 'Enable'} product?`}
        description="This changes whether the product can be used in new POS sales."
        confirmLabel={pendingToggle?.isActive ? 'Disable product' : 'Enable product'}
        loadingLabel="Updating..."
        variant={pendingToggle?.isActive ? 'danger' : 'primary'}
        onCancel={() => setPendingToggle(null)}
        onConfirm={() => {
          dispatch(toggleProduct(pendingToggle.id))
            .unwrap()
            .then(() => dispatch(fetchProducts(filters)))
            .catch((toggleError) => toast.error(toggleError.message))
            .finally(() => setPendingToggle(null));
        }}
      />
    </Card>
  );
};

export default ProductsTable;
