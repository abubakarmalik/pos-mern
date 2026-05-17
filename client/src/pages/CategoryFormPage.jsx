import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import CategoryForm from '../components/categories/CategoryForm';
import Card from '../components/ui/Card';
import { PageLoader } from '../components/ui/Loader';
import {
  clearCurrentCategory,
  clearCategoriesMessage,
  createCategory,
  fetchCategory,
  updateCategory,
} from '../features/categories/categoriesSlice';
import {
  selectCategorySaving,
  selectCurrentCategory,
  selectCurrentCategoryLoading,
} from '../features/categories/selectors';

const defaultForm = {
  name: '',
  description: '',
  isActive: true,
};

const CategoryFormPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const category = useSelector(selectCurrentCategory);
  const isLoading = useSelector(selectCurrentCategoryLoading);
  const isSaving = useSelector(selectCategorySaving);
  const [form, setForm] = useState(defaultForm);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!id) {
      dispatch(clearCurrentCategory());
      setForm(defaultForm);
      setLoadError('');
      return;
    }

    setLoadError('');
    dispatch(fetchCategory(id))
      .unwrap()
      .catch((error) => setLoadError(error.message));
  }, [dispatch, id]);

  useEffect(() => {
    if (!id) return;
    if (!category) return;
    setForm({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive,
    });
  }, [category, id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      description: form.description || null,
    };
    const request = id
      ? updateCategory({ id, payload })
      : createCategory(payload);

    dispatch(request)
      .unwrap()
      .then(() => {
        toast.success(id ? 'Category updated' : 'Category created');
        dispatch(clearCategoriesMessage());
        navigate('/categories');
      })
      .catch((error) => toast.error(error.message));
  };

  if (id && isLoading) return <PageLoader label="Loading category" />;
  if (loadError) {
    return (
      <Card>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      </Card>
    );
  }

  return (
    <CategoryForm
      form={form}
      isEdit={Boolean(id)}
      isSaving={isSaving}
      onChange={handleChange}
      onStatusChange={(isActive) =>
        setForm((prev) => ({ ...prev, isActive }))
      }
      onSubmit={handleSubmit}
    />
  );
};

export default CategoryFormPage;
