import Button from '../ui/Button';
import FormSection from '../ui/FormSection';
import Input from '../ui/Input';
import Select from '../ui/Select';

const ProductForm = ({
  categories,
  form,
  isEdit,
  isSaving,
  onChange,
  onStatusChange,
  onSubmit,
}) => (
  <FormSection
    title={isEdit ? 'Edit Product' : 'New Product'}
    description="Keep product details accurate for checkout, inventory, and reports."
  >
    <form onSubmit={onSubmit} className="mt-4 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">Product identity</h3>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <Input label="Name" name="name" value={form.name} onChange={onChange} required />
          <Input label="SKU" name="sku" value={form.sku} onChange={onChange} required />
          <Input
            label="Barcode"
            name="barcode"
            value={form.barcode}
            onChange={onChange}
            helperText="Optional scanner code or printed barcode."
          />
          <Select label="Category" name="categoryId" value={form.categoryId} onChange={onChange}>
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Input label="Unit" name="unit" value={form.unit} onChange={onChange} />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900">Pricing and stock</h3>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <Input label="Cost Price (PKR)" name="costPrice" type="number" min="0" step="0.01" value={form.costPrice} onChange={onChange} />
          <Input label="Sale Price (PKR)" name="salePrice" type="number" min="0" step="0.01" value={form.salePrice} onChange={onChange} />
          <Input label="Tax Rate (%)" name="taxRate" type="number" min="0" value={form.taxRate} onChange={onChange} />
          <Input label="Min Stock" name="minStock" type="number" min="0" value={form.minStock} onChange={onChange} helperText="Used for low-stock alerts." />
          <Input label="Stock On Hand" name="stockOnHand" type="number" value={form.stockOnHand} onChange={onChange} />
          <Select label="Status" name="isActive" value={form.isActive ? 'true' : 'false'} onChange={(event) => onStatusChange(event.target.value === 'true')}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
        </div>
      </div>
      <div className="flex justify-end border-t border-slate-200 pt-4">
        <Button type="submit" loading={isSaving}>
          {isSaving ? (isEdit ? 'Updating...' : 'Creating...') : 'Save Product'}
        </Button>
      </div>
    </form>
  </FormSection>
);

export default ProductForm;
