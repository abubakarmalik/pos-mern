import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

const ProductForm = ({
  form,
  isEdit,
  isSaving,
  onChange,
  onStatusChange,
  onSubmit,
}) => (
  <div className="rounded-xl bg-white p-6 shadow">
    <h2 className="text-lg font-semibold text-slate-800">
      {isEdit ? 'Edit Product' : 'New Product'}
    </h2>
    <form onSubmit={onSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
      <Input
        label="Name"
        name="name"
        value={form.name}
        onChange={onChange}
        required
      />
      <Input label="SKU" name="sku" value={form.sku} onChange={onChange} />
      <Input
        label="Category"
        name="category"
        value={form.category}
        onChange={onChange}
      />
      <Input label="Unit" name="unit" value={form.unit} onChange={onChange} />
      <Input
        label="Cost Price (PKR)"
        name="costPrice"
        type="number"
        min="0"
        step="0.01"
        value={form.costPrice}
        onChange={onChange}
      />
      <Input
        label="Sale Price (PKR)"
        name="salePrice"
        type="number"
        min="0"
        step="0.01"
        value={form.salePrice}
        onChange={onChange}
      />
      <Input
        label="Tax Rate (%)"
        name="taxRate"
        type="number"
        min="0"
        value={form.taxRate}
        onChange={onChange}
      />
      <Input
        label="Min Stock"
        name="minStock"
        type="number"
        min="0"
        value={form.minStock}
        onChange={onChange}
      />
      <Input
        label="Stock On Hand"
        name="stockOnHand"
        type="number"
        value={form.stockOnHand}
        onChange={onChange}
      />
      <Select
        label="Status"
        name="isActive"
        value={form.isActive ? 'true' : 'false'}
        onChange={(event) => onStatusChange(event.target.value === 'true')}
      >
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </Select>
      <div className="md:col-span-2 flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
    </form>
  </div>
);

export default ProductForm;
