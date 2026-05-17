const toNumber = (value) => (value == null ? value : Number(value));

const mapStockLedger = (entry) => {
  if (!entry) return null;

  return {
    id: entry.id,
    productId: entry.product_id,
    product: entry.products
      ? {
          id: entry.products.id,
          name: entry.products.name,
          sku: entry.products.sku,
        }
      : null,
    type: entry.type,
    qtyChange: toNumber(entry.qty_change),
    balanceAfter: toNumber(entry.balance_after),
    refType: entry.ref_type,
    refId: entry.ref_id,
    note: entry.note,
    createdBy: entry.created_by,
    createdByUser: entry.users
      ? {
          id: entry.users.id,
          name: entry.users.name,
          username: entry.users.username,
          role: entry.users.role,
        }
      : null,
    createdAt: entry.created_at,
  };
};

module.exports = { mapStockLedger };
