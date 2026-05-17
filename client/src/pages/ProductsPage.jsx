import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import ProductsHeader from '../components/products/ProductsHeader';
import ProductsTable from '../components/products/ProductsTable';
import { selectUser } from '../features/auth/authSelector';

const ProductsPage = () => {
  const user = useSelector(selectUser);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isActive, setIsActive] = useState('');
  const [lowStock, setLowStock] = useState(false);
  const [page, setPage] = useState(1);

  const filters = useMemo(
    () => ({
      page,
      limit: 20,
      search,
      categoryId,
      isActive,
      lowStock,
    }),
    [categoryId, isActive, lowStock, page, search],
  );

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <ProductsHeader
        categoryId={categoryId}
        isActive={isActive}
        lowStock={lowStock}
        onCategoryChange={(value) => {
          setCategoryId(value);
          setPage(1);
        }}
        onIsActiveChange={(value) => {
          setIsActive(value);
          setPage(1);
        }}
        onLowStockChange={(value) => {
          setLowStock(value);
          setPage(1);
        }}
        onSearchChange={handleSearchChange}
        search={search}
        user={user}
      />
      <div className="rounded-xl bg-white p-4 shadow">
        <ProductsTable
          filters={filters}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
