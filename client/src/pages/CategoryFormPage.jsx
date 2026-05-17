import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import CategoryForm from '../components/categories/CategoryForm';
import {
  clearCurrentCategory,
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

  useEffect(() => {
    if (!id) {
      dispatch(clearCurrentCategory());
      setForm(defaultForm);
      return;
    }

    dispatch(fetchCategory(id))
      .unwrap()
      .catch((error) => toast.error(error.message));
  }, [dispatch, id]);

  useEffect(() => {
    if (!category) return;
    setForm({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive,
    });
  }, [category]);

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
        navigate('/categories');
      })
      .catch((error) => toast.error(error.message));
  };

  if (id && isLoading) return <div>Loading...</div>;

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
