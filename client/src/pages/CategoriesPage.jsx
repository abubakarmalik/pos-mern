import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import CategoriesTable from '../components/categories/CategoriesTable';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import {
  clearCategoriesMessage,
  fetchCategories,
  toggleCategory,
} from '../features/categories/categoriesSlice';
import {
  selectCategories,
  selectCategoriesError,
  selectCategoriesLoading,
  selectCategoriesMessage,
  selectCategoryToggling,
} from '../features/categories/selectors';

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const isLoading = useSelector(selectCategoriesLoading);
  const isToggling = useSelector(selectCategoryToggling);
  const error = useSelector(selectCategoriesError);
  const message = useSelector(selectCategoriesMessage);
  const [search, setSearch] = useState('');
  const [isActive, setIsActive] = useState('');

  useEffect(() => {
    dispatch(fetchCategories({ search, isActive, limit: 20 }));
  }, [dispatch, isActive, search]);

  useEffect(() => {
    if (!error) return;
    toast.error(error);
    dispatch(clearCategoriesMessage());
  }, [dispatch, error]);

  useEffect(() => {
    if (!message) return;
    toast.success(message);
    dispatch(clearCategoriesMessage());
  }, [dispatch, message]);

  const handleToggle = (id) => {
    dispatch(toggleCategory(id)).catch(() => {});
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-4 shadow">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Categories</h2>
          <Link to="/categories/new">
            <Button>Add Category</Button>
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input
            placeholder="Search categories"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select
            value={isActive}
            onChange={(event) => setIsActive(event.target.value)}
          >
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
        </div>
      </div>
      <div className="rounded-xl bg-white p-4 shadow">
        <CategoriesTable
          categories={categories}
          isLoading={isLoading}
          isToggling={isToggling}
          onToggle={handleToggle}
        />
      </div>
    </div>
  );
};

export default CategoriesPage;
