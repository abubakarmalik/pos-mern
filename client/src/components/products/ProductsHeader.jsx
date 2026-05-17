import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { fetchCategories } from '../../features/categories/categoriesSlice';
import { selectCategories } from '../../features/categories/selectors';

const ProductsHeader = ({
  categoryId,
  isActive,
  lowStock,
  onCategoryChange,
  onIsActiveChange,
  onLowStockChange,
  onSearchChange,
  search,
  user,
}) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Catalog filters</h2>
          <p className="mt-1 text-sm text-slate-500">Search and narrow the product table.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <Link to="/products/new">
            <Button leftIcon={<FiPlus />}>Add Product</Button>
          </Link>
        )}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto]">
        <Input
          label="Search"
          placeholder="Search by name, SKU, category"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <Select
          label="Category"
          value={categoryId}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        <Select
          label="Status"
          value={isActive}
          onChange={(event) => onIsActiveChange(event.target.value)}
        >
          <option value="">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </Select>
        <label className="mt-6 flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={lowStock}
            onChange={(event) => onLowStockChange(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
          />
          Low stock
        </label>
      </div>
    </Card>
  );
};

export default ProductsHeader;
