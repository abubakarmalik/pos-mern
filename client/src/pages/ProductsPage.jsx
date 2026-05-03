import { useState } from 'react';
import { useSelector } from 'react-redux';
import ProductsHeader from '../components/products/ProductsHeader';
import ProductsTable from '../components/products/ProductsTable';
import { selectUser } from '../features/auth/authSelector';

const ProductsPage = () => {
  const user = useSelector(selectUser);
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-4">
      <ProductsHeader
        onSearchChange={setSearch}
        search={search}
        user={user}
      />
      <div className="rounded-xl bg-white p-4 shadow">
        <ProductsTable search={search} />
      </div>
    </div>
  );
};

export default ProductsPage;
