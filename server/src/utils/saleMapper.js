const toNumber = (value) => (value == null ? value : Number(value));

const mapSaleItem = (item) => ({
  id: item.id,
  productId: item.product_id,
  nameSnapshot: item.name_snapshot,
  skuSnapshot: item.sku_snapshot,
  unitSnapshot: item.unit_snapshot,
  qty: toNumber(item.qty),
  costPriceSnapshot: toNumber(item.cost_price_snapshot),
  salePriceSnapshot: toNumber(item.sale_price_snapshot),
  taxRateSnapshot: toNumber(item.tax_rate_snapshot),
  lineDiscount: toNumber(item.line_discount),
  lineSubtotal: toNumber(item.line_subtotal),
  tax: toNumber(item.tax),
  lineTotal: toNumber(item.line_total),
  createdAt: item.created_at,
});

const mapSale = (sale) => {
  if (!sale) return null;

  return {
    id: sale.id,
    _id: sale.id,
    invoiceNo: sale.invoice_no,
    cashierId: sale.cashier_id,
    cashier: sale.users
      ? {
          id: sale.users.id,
          name: sale.users.name,
          username: sale.users.username,
          role: sale.users.role,
        }
      : null,
    items: (sale.sale_items || []).map(mapSaleItem),
    subtotal: toNumber(sale.subtotal),
    lineDiscountTotal: toNumber(sale.line_discount_total),
    cartDiscount: toNumber(sale.cart_discount),
    discountTotal: toNumber(sale.discount_total),
    taxTotal: toNumber(sale.tax_total),
    total: toNumber(sale.total),
    paymentMethod: sale.payment_method,
    cashReceived: toNumber(sale.cash_received),
    changeDue: toNumber(sale.change_due),
    status: sale.status,
    createdAt: sale.created_at,
    updatedAt: sale.updated_at,
  };
};

module.exports = { mapSale, mapSaleItem };
