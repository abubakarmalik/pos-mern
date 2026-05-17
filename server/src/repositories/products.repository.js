const { prisma } = require('../../config/prisma');
const { getPaginationParams } = require('../utils/pagination');

const includeCategory = { categories: true };

const buildWhere = ({
  search,
  categoryId,
  categoryName,
  isActive,
  lowStock,
} = {}) => {
  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { barcode: { contains: search, mode: 'insensitive' } },
      { categories: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }

  if (categoryId) where.category_id = categoryId;
  if (categoryName) {
    where.categories = {
      name: { equals: categoryName, mode: 'insensitive' },
    };
  }
  if (isActive !== undefined) where.is_active = isActive;
  if (lowStock) {
    where.stock_on_hand = { lte: prisma.products.fields.min_stock };
  }

  return where;
};

const findManyPaginated = async (query = {}) => {
  const { page, limit, skip } = getPaginationParams(query);
  const where = buildWhere(query);
  const [items, total] = await prisma.$transaction([
    prisma.products.findMany({
      where,
      include: includeCategory,
      orderBy: { created_at: 'desc' },
      skip,
      take: limit,
    }),
    prisma.products.count({ where }),
  ]);

  return { items, page, limit, total };
};

const findById = (id, db = prisma) =>
  db.products.findUnique({
    where: { id },
    include: includeCategory,
  });

const findRawById = (id, db = prisma) =>
  db.products.findUnique({ where: { id } });

const create = (data) =>
  prisma.products.create({
    data,
    include: includeCategory,
  });

const update = (id, data, db = prisma) =>
  db.products.update({
    where: { id },
    data,
    include: includeCategory,
  });

const updateStock = (id, stockOnHand, db = prisma) =>
  db.products.update({
    where: { id },
    data: { stock_on_hand: stockOnHand },
    include: includeCategory,
  });

module.exports = {
  create,
  findById,
  findManyPaginated,
  findRawById,
  update,
  updateStock,
};
