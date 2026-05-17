import Input from '../ui/Input';
import { formatCurrency } from '../../utils/format';

const ProductPicker = ({
  currencySymbol,
  isLoading,
  onAddToCart,
  onSearchChange,
  products,
  search,
}) => (
  <div className="rounded-xl bg-white p-4 shadow">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-slate-800">Products</h2>
    </div>
    <div className="mt-4">
      <Input
        placeholder="Search products"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </div>
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      {isLoading && <p className="text-sm text-slate-500">Loading...</p>}
      {!isLoading && products.length === 0 && (
        <p className="text-sm text-slate-500">No products found.</p>
      )}
      {products.map((product) => (
        <button
          key={product.id}
          type="button"
          onClick={() => onAddToCart(product)}
          className="rounded-lg border border-slate-200 p-3 text-left hover:border-blue-500"
        >
          <p className="font-medium text-slate-800">{product.name}</p>
          <p className="text-xs text-slate-500">{product.sku || 'No SKU'}</p>
          <p className="mt-2 text-sm font-semibold text-blue-600">
            {formatCurrency(product.salePrice, currencySymbol)}
          </p>
        </button>
      ))}
    </div>
  </div>
);

export default ProductPicker;
