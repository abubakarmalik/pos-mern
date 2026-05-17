import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import ProductsHeader from '../components/products/ProductsHeader';
import ProductsTable from '../components/products/ProductsTable';
import PageHeader from '../components/ui/PageHeader';
import { selectUser } from '../features/auth/authSelector';
import useDebounce from '../hooks/useDebounce';

const ProductsPage = () => {
  const user = useSelector(selectUser);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isActive, setIsActive] = useState('');
  const [lowStock, setLowStock] = useState(false);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  const filters = useMemo(
    () => ({
      page,
      limit: 20,
      search: debouncedSearch,
      categoryId,
      isActive,
      lowStock,
    }),
    [categoryId, debouncedSearch, isActive, lowStock, page],
  );

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Products"
        description="Manage pricing, stock status, categories, and active products for the POS catalog."
      />
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
      <ProductsTable filters={filters} onPageChange={setPage} />
    </div>
  );
};

export default ProductsPage;
