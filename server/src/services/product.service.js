const categoriesRepository = require('../repositories/categories.repository');
const productsRepository = require('../repositories/products.repository');
const { buildPagination } = require('../utils/pagination');
const { mapProduct } = require('../utils/productMapper');

const createServiceError = (message, errorCode, status, details = null) =>
  Object.assign(new Error(message), { status, errorCode, details });

const resolveCategoryId = async ({ categoryId, categoryName }) => {
  if (categoryId) {
    const category = await categoriesRepository.findById(categoryId);
    if (!category) {
      throw createServiceError('Category not found', 'NOT_FOUND', 404, {
        categoryId,
      });
    }
    return category.id;
  }

  if (!categoryName) return null;

  const category =
    await categoriesRepository.findByNameInsensitive(categoryName);
  if (!category) {
    throw createServiceError('Category not found', 'NOT_FOUND', 404, {
      categoryName,
    });
  }
  return category.id;
};

const toProductData = async (payload, { partial = false } = {}) => {
  const data = {};

  if (payload.name !== undefined) data.name = payload.name;
  if (payload.sku !== undefined) data.sku = payload.sku;
  if (payload.barcode !== undefined) data.barcode = payload.barcode || null;
  if (payload.unit !== undefined) data.unit = payload.unit || 'pcs';
  if (payload.costPrice !== undefined) data.cost_price = payload.costPrice;
  if (payload.salePrice !== undefined) data.sale_price = payload.salePrice;
  if (payload.taxRate !== undefined) data.tax_rate = payload.taxRate;
  if (payload.stockOnHand !== undefined) data.stock_on_hand = payload.stockOnHand;
  if (payload.minStock !== undefined) data.min_stock = payload.minStock;
  if (payload.isActive !== undefined) data.is_active = payload.isActive;

  const hasCategoryInput =
    payload.categoryId !== undefined ||
    payload.categoryName !== undefined ||
    payload.category !== undefined;

  if (hasCategoryInput) {
    data.category_id = await resolveCategoryId({
      categoryId: payload.categoryId,
      categoryName: payload.categoryName || payload.category,
    });
  } else if (!partial) {
    data.category_id = null;
  }

  return data;
};

const listProducts = async (query = {}) => {
  const { items, page, limit, total } =
    await productsRepository.findManyPaginated(query);

  return {
    items: items.map(mapProduct),
    pagination: buildPagination({ page, limit, total }),
  };
};

const getProduct = async (id) => {
  const product = await productsRepository.findById(id);
  if (!product) {
    throw createServiceError('Product not found', 'NOT_FOUND', 404, { id });
  }
  return mapProduct(product);
};

const createProduct = async (payload) => {
  try {
    const product = await productsRepository.create(await toProductData(payload));
    return mapProduct(product);
  } catch (error) {
    if (error.code === 'P2002') {
      throw createServiceError('SKU already exists', 'CONFLICT', 409, {
        fields: error.meta?.target || ['sku'],
      });
    }
    throw error;
  }
};

const updateProduct = async (id, payload) => {
  await getProduct(id);

  try {
    const product = await productsRepository.update(
      id,
      await toProductData(payload, { partial: true }),
    );
    return mapProduct(product);
  } catch (error) {
    if (error.code === 'P2002') {
      throw createServiceError('SKU already exists', 'CONFLICT', 409, {
        fields: error.meta?.target || ['sku'],
      });
    }
    throw error;
  }
};

const toggleProduct = async (id) => {
  const existing = await productsRepository.findRawById(id);
  if (!existing) {
    throw createServiceError('Product not found', 'NOT_FOUND', 404, { id });
  }

  const product = await productsRepository.update(id, {
    is_active: !existing.is_active,
  });
  return mapProduct(product);
};

module.exports = {
  createProduct,
  getProduct,
  listProducts,
  toggleProduct,
  updateProduct,
};
