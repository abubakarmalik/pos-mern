import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Table from '../components/ui/Table';
import { formatCurrency, toCents } from '../utils/format';

const PosPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [cartDiscount, setCartDiscount] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [cashReceived, setCashReceived] = useState('');

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: () => apiFetch('/settings'),
  });

  const currencySymbol = settingsData?.data?.currencySymbol || 'PKR';

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', search],
    queryFn: () => apiFetch(`/products?search=${encodeURIComponent(search)}`),
  });

  const createSaleMutation = useMutation({
    mutationFn: (payload) =>
      apiFetch('/sales', { method: 'POST', body: payload }),
    onSuccess: (response) => {
      toast.success('Sale completed');
      setCart([]);
      setCartDiscount('0');
      setCashReceived('');
      navigate(`/invoice/${response.data._id}`);
    },
    onError: (error) => toast.error(error.message),
  });

  const products = productsData?.data || [];

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item,
        );
      }
      return [...prev, { product, qty: 1, lineDiscountCents: 0 }];
    });
  };

  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev
        .map((item) => (item.product._id === id ? { ...item, qty } : item))
        .filter((item) => item.qty > 0),
    );
  };

  const updateLineDiscount = (id, value) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === id
          ? { ...item, lineDiscountCents: toCents(value) }
          : item,
      ),
    );
  };

  const totals = useMemo(() => {
    let subtotal = 0;
    let tax = 0;
    let lineDiscountTotal = 0;

    cart.forEach((item) => {
      const linePrice = item.product.salePrice * item.qty;
      const lineSubtotal = linePrice - item.lineDiscountCents;
      const lineTax = Math.round(
        (lineSubtotal * (item.product.taxRate || 0)) / 100,
      );
      subtotal += lineSubtotal;
      tax += lineTax;
      lineDiscountTotal += item.lineDiscountCents;
    });

    const cartDiscountCents = toCents(cartDiscount);
    const total = Math.max(subtotal + tax - cartDiscountCents, 0);

    return { subtotal, tax, lineDiscountTotal, cartDiscountCents, total };
  }, [cart, cartDiscount]);

  const changeDue = useMemo(() => {
    if (paymentMethod !== 'CASH') return 0;
    const received = toCents(cashReceived);
    return Math.max(received - totals.total, 0);
  }, [cashReceived, paymentMethod, totals.total]);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Add items to cart');
      return;
    }

    const payload = {
      items: cart.map((item) => ({
        productId: item.product._id,
        qty: item.qty,
        lineDiscountCents: item.lineDiscountCents,
      })),
      cartDiscountCents: totals.cartDiscountCents,
      paymentMethod,
      cashReceivedCents:
        paymentMethod === 'CASH' ? toCents(cashReceived) : null,
    };

    createSaleMutation.mutate(payload);
  };

  const cartColumns = [
    {
      key: 'name',
      label: 'Product',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800">{row.product.name}</p>
          <p className="text-xs text-slate-500">{row.product.sku}</p>
        </div>
      ),
    },
    {
      key: 'qty',
      label: 'Qty',
      render: (row) => (
        <Input
          type="number"
          min="0"
          value={row.qty}
          onChange={(event) =>
            updateQty(row.product._id, Number(event.target.value))
          }
          className="w-20"
        />
      ),
    },
    {
      key: 'price',
      label: 'Price',
      render: (row) =>
        formatCurrency(row.product.salePrice, currencySymbol),
    },
    {
      key: 'discount',
      label: 'Line Discount',
      render: (row) => (
        <Input
          type="number"
          min="0"
          step="0.01"
          value={(row.lineDiscountCents / 100).toFixed(2)}
          onChange={(event) =>
            updateLineDiscount(row.product._id, event.target.value)
          }
          className="w-28"
        />
      ),
    },
    {
      key: 'total',
      label: 'Line Total',
      render: (row) => {
        const lineTotal =
          row.product.salePrice * row.qty - row.lineDiscountCents;
        return formatCurrency(lineTotal, currencySymbol);
      },
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <div className="rounded-xl bg-white p-4 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Products</h2>
          </div>
          <div className="mt-4">
            <Input
              placeholder="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {isLoading && <p className="text-sm text-slate-500">Loading...</p>}
            {!isLoading && products.length === 0 && (
              <p className="text-sm text-slate-500">No products found.</p>
            )}
            {products.map((product) => (
              <button
                key={product._id}
                type="button"
                onClick={() => addToCart(product)}
                className="rounded-lg border border-slate-200 p-3 text-left hover:border-blue-500"
              >
                <p className="font-medium text-slate-800">{product.name}</p>
                <p className="text-xs text-slate-500">
                  {product.sku || 'No SKU'}
                </p>
                <p className="mt-2 text-sm font-semibold text-blue-600">
                  {formatCurrency(product.salePrice, currencySymbol)}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl bg-white p-4 shadow">
          <h2 className="text-lg font-semibold text-slate-800">Cart</h2>
          <div className="mt-4">
            <Table columns={cartColumns} data={cart} />
          </div>
          <div className="mt-4 space-y-2">
            <Input
              label="Cart Discount"
              type="number"
              min="0"
              step="0.01"
              value={cartDiscount}
              onChange={(event) => setCartDiscount(event.target.value)}
            />
            <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal, currencySymbol)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(totals.tax, currencySymbol)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discounts</span>
                <span>
                  {formatCurrency(
                    totals.lineDiscountTotal + totals.cartDiscountCents,
                    currencySymbol,
                  )}
                </span>
              </div>
              <div className="mt-2 flex justify-between text-base font-semibold text-slate-800">
                <span>Total</span>
                <span>{formatCurrency(totals.total, currencySymbol)}</span>
              </div>
            </div>
            <Select
              label="Payment Method"
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
            >
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
            </Select>
            {paymentMethod === 'CASH' && (
              <div className="space-y-2">
                <Input
                  label="Cash Received"
                  type="number"
                  min="0"
                  step="0.01"
                  value={cashReceived}
                  onChange={(event) => setCashReceived(event.target.value)}
                />
                <p className="text-sm text-slate-600">
                  Change Due: {formatCurrency(changeDue, currencySymbol)}
                </p>
              </div>
            )}
            <Button
              className="w-full"
              onClick={handleCheckout}
              disabled={createSaleMutation.isLoading}
            >
              {createSaleMutation.isLoading ? 'Processing...' : 'Complete Sale'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosPage;
