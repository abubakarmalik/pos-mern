import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiFetch } from '../api/client';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const defaultForm = {
  name: '',
  sku: '',
  category: '',
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
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);

  const { data: productData } = useQuery({
    queryKey: ['products', id],
    queryFn: () => apiFetch(`/products/${id}`),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (productData?.data) {
      const product = productData.data;
      setForm({
        name: product.name,
        sku: product.sku || '',
        category: product.category || '',
        costPrice: product.costPrice,
        salePrice: product.salePrice,
        taxRate: product.taxRate,
        unit: product.unit,
        minStock: product.minStock ?? '',
        stockOnHand: product.stockOnHand,
        isActive: product.isActive,
      });
    }
  }, [productData]);

  const mutation = useMutation({
    mutationFn: (payload) => {
      const method = id ? 'PATCH' : 'POST';
      const path = id ? `/products/${id}` : '/products';
      return apiFetch(path, { method, body: payload });
    },
    onSuccess: () => {
      toast.success(id ? 'Product updated' : 'Product created');
      navigate('/products');
    },
    onError: (error) => toast.error(error.message),
  });

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
      minStock: form.minStock === '' ? null : Number(form.minStock),
      costPrice: Number(form.costPrice),
      salePrice: Number(form.salePrice),
      taxRate: Number(form.taxRate),
      stockOnHand: Number(form.stockOnHand),
    };
    mutation.mutate(payload);
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="text-lg font-semibold text-slate-800">
        {id ? 'Edit Product' : 'New Product'}
      </h2>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
        <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
        <Input label="SKU" name="sku" value={form.sku} onChange={handleChange} />
        <Input label="Category" name="category" value={form.category} onChange={handleChange} />
        <Input label="Unit" name="unit" value={form.unit} onChange={handleChange} />
        <Input label="Cost Price (PKR)" name="costPrice" type="number" min="0" step="0.01" value={form.costPrice} onChange={handleChange} />
        <Input label="Sale Price (PKR)" name="salePrice" type="number" min="0" step="0.01" value={form.salePrice} onChange={handleChange} />
        <Input label="Tax Rate (%)" name="taxRate" type="number" min="0" value={form.taxRate} onChange={handleChange} />
        <Input label="Min Stock" name="minStock" type="number" min="0" value={form.minStock} onChange={handleChange} />
        <Input label="Stock On Hand" name="stockOnHand" type="number" value={form.stockOnHand} onChange={handleChange} />
        <Select label="Status" name="isActive" value={form.isActive ? 'true' : 'false'} onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.value === 'true' }))}>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </Select>
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
