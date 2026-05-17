import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import ProductForm from '../components/products/ProductForm';
import { fetchCategories } from '../features/categories/categoriesSlice';
import { selectCategories } from '../features/categories/selectors';
import {
  clearCurrentProduct,
  createProduct,
  fetchProduct,
  updateProduct,
} from '../features/products/productsSlice';
import {
  selectCurrentProduct,
  selectCurrentProductLoading,
  selectProductSaving,
} from '../features/products/selectors';

const defaultForm = {
  name: '',
  sku: '',
  category: '',
  categoryId: '',
  costPrice: 0,
  salePrice: 0,
  taxRate: 0,
  unit: 'pcs',
  minStock: '',
  stockOnHand: 0,
  isActive: true,
};

const ProductFormPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector(selectCurrentProduct);
  const categories = useSelector(selectCategories);
  const isLoading = useSelector(selectCurrentProductLoading);
  const isSaving = useSelector(selectProductSaving);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!id) {
      dispatch(clearCurrentProduct());
      setForm(defaultForm);
      return;
    }

    dispatch(fetchProduct(id))
      .unwrap()
      .catch((error) => toast.error(error.message));
  }, [dispatch, id]);

  useEffect(() => {
    if (!product) return;

    setForm({
      name: product.name,
      sku: product.sku || '',
      category: product.category || '',
      categoryId: product.categoryId || '',
      costPrice: product.costPrice,
      salePrice: product.salePrice,
      taxRate: product.taxRate,
      unit: product.unit,
      minStock: product.minStock ?? '',
      stockOnHand: product.stockOnHand,
      isActive: product.isActive,
    });
  }, [product]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      categoryId: form.categoryId || undefined,
      categoryName: form.categoryId ? undefined : form.category || undefined,
      minStock: form.minStock === '' ? null : Number(form.minStock),
      costPrice: Number(form.costPrice),
      salePrice: Number(form.salePrice),
      taxRate: Number(form.taxRate),
      stockOnHand: Number(form.stockOnHand),
    };

    const request = id
      ? updateProduct({ id, payload })
      : createProduct(payload);

    dispatch(request)
      .unwrap()
      .then(() => {
        toast.success(id ? 'Product updated' : 'Product created');
        navigate('/products');
      })
      .catch((error) => toast.error(error.message));
  };

  if (id && isLoading) return <div>Loading...</div>;

  return (
    <ProductForm
      form={form}
      categories={categories}
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

export default ProductFormPage;
