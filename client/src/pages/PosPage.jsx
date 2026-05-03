import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CartPanel from '../components/pos/CartPanel';
import ProductPicker from '../components/pos/ProductPicker';
import { fetchProducts } from '../features/products/productsSlice';
import {
  selectProducts,
  selectProductsLoading,
} from '../features/products/selectors';
import { clearCreatedSale, createSale } from '../features/sales/salesSlice';
import {
  selectLastCreatedSale,
  selectSaleCreating,
} from '../features/sales/selectors';
import { fetchSettings } from '../features/settings/settingsSlice';
import { selectCurrencySymbol } from '../features/settings/selectors';

const PosPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [cartDiscount, setCartDiscount] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [cashReceived, setCashReceived] = useState('');
  const products = useSelector(selectProducts);
  const isLoadingProducts = useSelector(selectProductsLoading);
  const isCreatingSale = useSelector(selectSaleCreating);
  const lastCreatedSale = useSelector(selectLastCreatedSale);
  const currencySymbol = useSelector(selectCurrencySymbol);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts(search));
  }, [dispatch, search]);

  useEffect(() => {
    if (!lastCreatedSale?._id) return;

    setCart([]);
    setCartDiscount('0');
    setCashReceived('');
    navigate(`/invoice/${lastCreatedSale._id}`);
    dispatch(clearCreatedSale());
  }, [dispatch, lastCreatedSale, navigate]);

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
      return [...prev, { product, qty: 1, lineDiscount: 0 }];
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
    const parsed = Number(value);
    const amount = Number.isNaN(parsed) ? 0 : parsed;
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === id
          ? { ...item, lineDiscount: amount }
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
      const lineSubtotal = linePrice - item.lineDiscount;
      const lineTax = Math.round(
        (lineSubtotal * (item.product.taxRate || 0)) / 100,
      );
      subtotal += lineSubtotal;
      tax += lineTax;
      lineDiscountTotal += item.lineDiscount;
    });

    const cartDiscountAmount = Number(cartDiscount) || 0;
    const total = Math.max(subtotal + tax - cartDiscountAmount, 0);

    return { subtotal, tax, lineDiscountTotal, cartDiscountAmount, total };
  }, [cart, cartDiscount]);

  const changeDue = useMemo(() => {
    if (paymentMethod !== 'CASH') return 0;
    const received = Number(cashReceived) || 0;
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
        lineDiscount: item.lineDiscount,
      })),
      cartDiscount: totals.cartDiscountAmount,
      paymentMethod,
      cashReceived: paymentMethod === 'CASH' ? Number(cashReceived) || 0 : null,
    };

    dispatch(createSale(payload))
      .unwrap()
      .then(() => {
        toast.success('Sale completed');
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <ProductPicker
          currencySymbol={currencySymbol}
          isLoading={isLoadingProducts}
          onAddToCart={addToCart}
          onSearchChange={setSearch}
          products={products}
          search={search}
        />
      </div>

      <div className="space-y-4">
        <CartPanel
          cart={cart}
          cartDiscount={cartDiscount}
          cashReceived={cashReceived}
          changeDue={changeDue}
          currencySymbol={currencySymbol}
          isCreatingSale={isCreatingSale}
          onCartDiscountChange={setCartDiscount}
          onCashReceivedChange={setCashReceived}
          onCheckout={handleCheckout}
          onLineDiscountChange={updateLineDiscount}
          onPaymentMethodChange={setPaymentMethod}
          onQtyChange={updateQty}
          paymentMethod={paymentMethod}
          totals={totals}
        />
      </div>
    </div>
  );
};

export default PosPage;
