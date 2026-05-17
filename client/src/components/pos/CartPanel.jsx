import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Table from '../ui/Table';
import { formatCurrency } from '../../utils/format';

const CartPanel = ({
  cart,
  cartDiscount,
  changeDue,
  currencySymbol,
  isCreatingSale,
  onCartDiscountChange,
  onCashReceivedChange,
  onCheckout,
  onLineDiscountChange,
  onPaymentMethodChange,
  onQtyChange,
  paymentMethod,
  cashReceived,
  totals,
}) => {
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
            onQtyChange(row.product.id, Number(event.target.value))
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
          value={row.lineDiscount}
          onChange={(event) =>
            onLineDiscountChange(row.product.id, event.target.value)
          }
          className="w-28"
        />
      ),
    },
    {
      key: 'total',
      label: 'Line Total',
      render: (row) => {
        const lineTotal = row.product.salePrice * row.qty - row.lineDiscount;
        return formatCurrency(lineTotal, currencySymbol);
      },
    },
  ];

  return (
    <Card>
      <h2 className="text-base font-semibold text-slate-900">Cart</h2>
      <div className="mt-4">
        <Table
          columns={cartColumns}
          data={cart}
          emptyTitle="Cart is empty"
          emptyDescription="Select products from the catalog to begin checkout."
          minWidth="min-w-[620px]"
        />
      </div>
      <div className="mt-4 space-y-2">
        <Input
          label="Cart Discount"
          type="number"
          min="0"
          step="0.01"
          value={cartDiscount}
          onChange={(event) => onCartDiscountChange(event.target.value)}
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
                totals.lineDiscountTotal + totals.cartDiscountAmount,
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
          onChange={(event) => onPaymentMethodChange(event.target.value)}
        >
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
          <option value="BANK">Bank</option>
          <option value="JAZZCASH">JazzCash</option>
          <option value="EASYPAISA">EasyPaisa</option>
        </Select>
        {paymentMethod === 'CASH' && (
          <div className="space-y-2">
            <Input
              label="Cash Received"
              type="number"
              min="0"
              step="0.01"
              value={cashReceived}
              onChange={(event) => onCashReceivedChange(event.target.value)}
            />
            <p className="text-sm text-slate-600">
              Change Due: {formatCurrency(changeDue, currencySymbol)}
            </p>
          </div>
        )}
        <Button
          className="w-full"
          onClick={onCheckout}
          loading={isCreatingSale}
        >
          {isCreatingSale ? 'Processing...' : 'Complete Sale'}
        </Button>
      </div>
    </Card>
  );
};

export default CartPanel;
