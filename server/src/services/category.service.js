const categoriesRepository = require('../repositories/categories.repository');
const { buildPagination } = require('../utils/pagination');
const { mapCategory } = require('../utils/productMapper');

const createServiceError = (message, errorCode, status, details = null) =>
  Object.assign(new Error(message), { status, errorCode, details });

const normalizeName = (name) => name.trim();

const listCategories = async (query = {}) => {
  const { items, page, limit, total } =
    await categoriesRepository.findManyPaginated(query);

  return {
    items: items.map(mapCategory),
    pagination: buildPagination({ page, limit, total }),
  };
};

const getCategory = async (id) => {
  const category = await categoriesRepository.findById(id);
  if (!category) {
    throw createServiceError('Category not found', 'NOT_FOUND', 404, { id });
  }
  return mapCategory(category);
};

const createCategory = async ({ name, description, isActive }) => {
  try {
    const category = await categoriesRepository.create({
      name: normalizeName(name),
      description: description || null,
      is_active: isActive ?? true,
    });
    return mapCategory(category);
  } catch (error) {
    if (error.code === 'P2002') {
      throw createServiceError(
        'Category name already exists',
        'CONFLICT',
        409,
        { fields: error.meta?.target || ['name'] },
      );
    }
    throw error;
  }
};

const updateCategory = async (id, payload) => {
  await getCategory(id);

  const data = {};
  if (payload.name !== undefined) data.name = normalizeName(payload.name);
  if (payload.description !== undefined) {
    data.description = payload.description || null;
  }
  if (payload.isActive !== undefined) data.is_active = payload.isActive;

  try {
    const category = await categoriesRepository.update(id, data);
    return mapCategory(category);
  } catch (error) {
    if (error.code === 'P2002') {
      throw createServiceError(
        'Category name already exists',
        'CONFLICT',
        409,
        { fields: error.meta?.target || ['name'] },
      );
    }
    throw error;
  }
};

const toggleCategory = async (id) => {
  const existing = await categoriesRepository.findById(id);
  if (!existing) {
    throw createServiceError('Category not found', 'NOT_FOUND', 404, { id });
  }

  const category = await categoriesRepository.update(id, {
    is_active: !existing.is_active,
  });

  return mapCategory(category);
};

module.exports = {
  createCategory,
  getCategory,
  listCategories,
  toggleCategory,
  updateCategory,
};
