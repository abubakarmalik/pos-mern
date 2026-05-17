const toNumber = (value) => (value == null ? value : Number(value));

const mapCategory = (category) => {
  if (!category) return null;

  return {
    id: category.id,
    name: category.name,
    description: category.description,
    isActive: category.is_active,
    createdAt: category.created_at,
    updatedAt: category.updated_at,
  };
};

const mapProduct = (product) => {
  if (!product) return null;

  const category = mapCategory(product.categories);

  return {
    id: product.id,
    _id: product.id,
    name: product.name,
    sku: product.sku,
    barcode: product.barcode,
    categoryId: product.category_id,
    category: category?.name || null,
    categoryName: category?.name || null,
    categoryData: category,
    unit: product.unit,
    costPrice: toNumber(product.cost_price),
    salePrice: toNumber(product.sale_price),
    taxRate: toNumber(product.tax_rate),
    stockOnHand: toNumber(product.stock_on_hand),
    minStock: toNumber(product.min_stock),
    isActive: product.is_active,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  };
};

module.exports = { mapCategory, mapProduct };
