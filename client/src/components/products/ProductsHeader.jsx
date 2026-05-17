import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../ui/Button';
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
    <div className="rounded-xl bg-white p-4 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Products</h2>
        {user?.role === 'ADMIN' && (
          <Link to="/products/new">
            <Button>Add Product</Button>
          </Link>
        )}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <Input
          placeholder="Search by name, SKU, category"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <Select
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
          value={isActive}
          onChange={(event) => onIsActiveChange(event.target.value)}
        >
          <option value="">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </Select>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={lowStock}
            onChange={(event) => onLowStockChange(event.target.checked)}
          />
          Low stock
        </label>
      </div>
    </div>
  );
};

export default ProductsHeader;
