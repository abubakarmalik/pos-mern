import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ProductsTable from '../features/products/ProductsTable';

const ProductsPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [search, setSearch] = useState('');

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
          <Input placeholder="Search by name, SKU, category" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
      </div>
      <div className="rounded-xl bg-white p-4 shadow">
        <ProductsTable search={search} />
      </div>
    </div>
  );
};

export default ProductsPage;
