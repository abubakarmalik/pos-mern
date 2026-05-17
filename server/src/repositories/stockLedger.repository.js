const { prisma } = require('../../config/prisma');
const { getPaginationParams } = require('../utils/pagination');

const includeRelations = {
  products: true,
  users: true,
};

const buildWhere = ({
  productId,
  type,
  dateFrom,
  dateTo,
  from,
  to,
  search,
} = {}) => {
  const where = {};
  const startDate = dateFrom || from;
  const endDate = dateTo || to;

  if (productId) where.product_id = productId;
  if (type) where.type = type;
  if (startDate || endDate) {
    where.created_at = {};
    if (startDate) where.created_at.gte = new Date(startDate);
    if (endDate) where.created_at.lte = new Date(endDate);
  }
  if (search) {
    where.OR = [
      { note: { contains: search, mode: 'insensitive' } },
      { ref_type: { contains: search, mode: 'insensitive' } },
      { products: { name: { contains: search, mode: 'insensitive' } } },
      { products: { sku: { contains: search, mode: 'insensitive' } } },
    ];
  }

  return where;
};

const transaction = (callback) => prisma.$transaction(callback);

const create = (data, db = prisma) =>
  db.stock_ledger.create({
    data,
    include: includeRelations,
  });

const findManyPaginated = async (query = {}) => {
  const { page, limit, skip } = getPaginationParams(query);
  const where = buildWhere(query);
  const [items, total] = await prisma.$transaction([
    prisma.stock_ledger.findMany({
      where,
      include: includeRelations,
      orderBy: { created_at: 'desc' },
      skip,
      take: limit,
    }),
    prisma.stock_ledger.count({ where }),
  ]);

  return { items, page, limit, total };
};

module.exports = {
  create,
  findManyPaginated,
  transaction,
};
