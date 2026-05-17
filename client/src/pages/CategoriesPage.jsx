import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPlus } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import CategoriesTable from '../components/categories/CategoriesTable';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Input from '../components/ui/Input';
import PageHeader from '../components/ui/PageHeader';
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
import useDebounce from '../hooks/useDebounce';

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const isLoading = useSelector(selectCategoriesLoading);
  const isToggling = useSelector(selectCategoryToggling);
  const error = useSelector(selectCategoriesError);
  const message = useSelector(selectCategoriesMessage);
  const [search, setSearch] = useState('');
  const [isActive, setIsActive] = useState('');
  const [pendingToggle, setPendingToggle] = useState(null);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    dispatch(fetchCategories({ search: debouncedSearch, isActive, limit: 20 }));
  }, [debouncedSearch, dispatch, isActive]);

  useEffect(() => {
    if (!message) return;
    toast.success(message);
    dispatch(clearCategoriesMessage());
  }, [dispatch, message]);

  const handleToggle = () => {
    dispatch(toggleCategory(pendingToggle.id))
      .unwrap()
      .catch((toggleError) => toast.error(toggleError.message))
      .finally(() => setPendingToggle(null));
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Categories"
        description="Organize products into searchable groups for catalog and reports."
      />
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Category filters</h2>
            <p className="mt-1 text-sm text-slate-500">Search by name and status.</p>
          </div>
          <Link to="/categories/new">
            <Button leftIcon={<FiPlus />}>Add Category</Button>
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input
            label="Search"
            placeholder="Search categories"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select
            label="Status"
            value={isActive}
            onChange={(event) => setIsActive(event.target.value)}
          >
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
        </div>
      </Card>
      <Card>
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <CategoriesTable
          categories={categories}
          isLoading={isLoading}
          isToggling={isToggling}
          onToggle={setPendingToggle}
        />
      </Card>
      <ConfirmDialog
        open={Boolean(pendingToggle)}
        title={`${pendingToggle?.isActive ? 'Disable' : 'Enable'} category?`}
        description="This changes whether the category is available for product assignment and filtering."
        confirmLabel={pendingToggle?.isActive ? 'Disable category' : 'Enable category'}
        loadingLabel="Updating..."
        variant={pendingToggle?.isActive ? 'danger' : 'primary'}
        loading={isToggling}
        onCancel={() => setPendingToggle(null)}
        onConfirm={handleToggle}
      />
    </div>
  );
};

export default CategoriesPage;
