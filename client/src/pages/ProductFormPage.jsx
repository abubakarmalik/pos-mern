import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import ProductForm from '../components/products/ProductForm';
import Card from '../components/ui/Card';
import { PageLoader } from '../components/ui/Loader';
import { fetchCategories } from '../features/categories/categoriesSlice';
import { selectCategories } from '../features/categories/selectors';
import {
  clearCurrentProduct,
  clearProductsMessage,
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
  barcode: '',
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
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!id) {
      dispatch(clearCurrentProduct());
      setForm(defaultForm);
      setLoadError('');
      return;
    }

    setLoadError('');
    dispatch(fetchProduct(id))
      .unwrap()
      .catch((error) => setLoadError(error.message));
  }, [dispatch, id]);

  useEffect(() => {
    if (!id) return;
    if (!product) return;

    setForm({
      name: product.name,
      sku: product.sku || '',
      barcode: product.barcode || '',
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
  }, [id, product]);

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
      barcode: form.barcode?.trim() || null,
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
        dispatch(clearProductsMessage());
        navigate('/products');
      })
      .catch((error) => toast.error(error.message));
  };

  if (id && isLoading) return <PageLoader label="Loading product" />;
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
