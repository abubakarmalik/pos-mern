import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/format';
import { fetchProducts, toggleProduct } from './productsSlice';

const ProductsTable = ({ search }) => {
  const dispatch = useDispatch();
  const { items, isLoading, error, message } = useSelector((state) => state.products);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => { dispatch(fetchProducts(search)); }, [dispatch, search]);
  useEffect(() => { if (error) toast.error(error); }, [error]);
  useEffect(() => { if (message) toast.success(message); }, [message]);

  const columns = [
    { key: 'name', label: 'Product', render: (row) => <div><p className="font-medium text-slate-800">{row.name}</p><p className="text-xs text-slate-500">{row.sku || 'No SKU'}</p></div> },
    { key: 'category', label: 'Category', render: (row) => row.category || '-' },
    { key: 'price', label: 'Price', render: (row) => formatCurrency(row.salePrice) },
    { key: 'status', label: 'Status', render: (row) => <Badge variant={row.isActive ? 'success' : 'danger'}>{row.isActive ? 'Active' : 'Inactive'}</Badge> },
    { key: 'actions', label: 'Actions', render: (row) => <div className="flex gap-2">{user?.role === 'ADMIN' && <Link to={`/products/${row._id}/edit`} className="text-xs font-medium text-blue-600 hover:underline">Edit</Link>}{user?.role === 'ADMIN' && <button type="button" onClick={() => dispatch(toggleProduct(row._id)).then(() => dispatch(fetchProducts(search)))} className="text-xs font-medium text-slate-600 hover:text-slate-900">{row.isActive ? 'Disable' : 'Enable'}</button>}</div> },
  ];

  if (isLoading) return <p className="text-sm text-slate-500">Loading...</p>;
  return <Table columns={columns} data={items} />;
};

export default ProductsTable;
