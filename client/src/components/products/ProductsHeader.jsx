import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ProductsHeader = ({ onSearchChange, search, user }) => (
  <div className="rounded-xl bg-white p-4 shadow">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-slate-800">Products</h2>
      {user?.role === 'ADMIN' && (
        <Link to="/products/new">
          <Button>Add Product</Button>
        </Link>
      )}
    </div>
    <div className="mt-4">
      <Input
        placeholder="Search by name, SKU, category"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </div>
  </div>
);

export default ProductsHeader;
