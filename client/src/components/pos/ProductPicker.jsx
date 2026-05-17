import Input from '../ui/Input';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import Skeleton from '../ui/Skeleton';
import { formatCurrency } from '../../utils/format';

const ProductPicker = ({
  currencySymbol,
  isLoading,
  onAddToCart,
  onSearchChange,
  products,
  search,
}) => (
  <Card>
    <div className="flex items-center justify-between">
      <h2 className="text-base font-semibold text-slate-900">Products</h2>
    </div>
    <div className="mt-4">
      <Input
        label="Search catalog"
        placeholder="Search products"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </div>
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      {isLoading &&
        Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-28" />
        ))}
      {!isLoading && products.length === 0 && (
        <div className="sm:col-span-2">
          <EmptyState
            title="No products found"
            description="Try another search term or check product status."
          />
        </div>
      )}
      {products.map((product) => (
        <button
          key={product.id}
          type="button"
          onClick={() => onAddToCart(product)}
          className="rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-cyan-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <p className="font-medium text-slate-800">{product.name}</p>
          <p className="text-xs text-slate-500">{product.sku || 'No SKU'}</p>
          <p className="mt-2 text-sm font-semibold text-cyan-700">
            {formatCurrency(product.salePrice, currencySymbol)}
          </p>
        </button>
      ))}
    </div>
  </Card>
);

export default ProductPicker;
