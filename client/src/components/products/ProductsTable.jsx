import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
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

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);
  useEffect(() => {
    if (!error) return;
    toast.error(error);
    dispatch(clearProductsMessage());
  }, [dispatch, error]);
  useEffect(() => {
    if (!message) return;
    toast.success(message);
    dispatch(clearProductsMessage());
  }, [dispatch, message]);

  const columns = [
    { key: 'name', label: 'Product', render: (row) => <div><p className="font-medium text-slate-800">{row.name}</p><p className="text-xs text-slate-500">{row.sku || 'No SKU'}</p></div> },
    { key: 'category', label: 'Category', render: (row) => row.category || '-' },
    { key: 'price', label: 'Price', render: (row) => formatCurrency(row.salePrice) },
    { key: 'status', label: 'Status', render: (row) => <Badge variant={row.isActive ? 'success' : 'danger'}>{row.isActive ? 'Active' : 'Inactive'}</Badge> },
    { key: 'actions', label: 'Actions', render: (row) => <div className="flex gap-2">{user?.role === 'ADMIN' && <Link to={`/products/${row.id}/edit`} className="text-xs font-medium text-blue-600 hover:underline">Edit</Link>}{user?.role === 'ADMIN' && <button type="button" onClick={() => dispatch(toggleProduct(row.id)).then(() => dispatch(fetchProducts(filters)))} className="text-xs font-medium text-slate-600 hover:text-slate-900">{row.isActive ? 'Disable' : 'Enable'}</button>}</div> },
  ];

  if (isLoading) return <p className="text-sm text-slate-500">Loading...</p>;
  return (
    <div className="space-y-4">
      <Table columns={columns} data={items} />
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          Page {pagination.page} of {pagination.totalPages || 1} · {pagination.total} products
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

export default ProductsTable;
