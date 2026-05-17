const { prisma } = require('../../config/prisma');
const { getPaginationParams } = require('../utils/pagination');

const includeRelations = {
  sales: {
    select: {
      id: true,
      invoice_no: true,
      total: true,
      status: true,
      created_at: true,
    },
  },
  users: {
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
    },
  },
};

const buildWhere = ({
  search,
  saleId,
  dateFrom,
  dateTo,
  from,
  to,
} = {}) => {
  const where = {};
  const startDate = dateFrom || from;
  const endDate = dateTo || to;

  if (saleId) where.sale_id = saleId;
  if (startDate || endDate) {
    where.created_at = {};
    if (startDate) where.created_at.gte = new Date(startDate);
    if (endDate) where.created_at.lte = new Date(endDate);
  }
  if (search) {
    where.OR = [
      { reason: { contains: search, mode: 'insensitive' } },
      { sales: { invoice_no: { contains: search, mode: 'insensitive' } } },
      { users: { name: { contains: search, mode: 'insensitive' } } },
      { users: { username: { contains: search, mode: 'insensitive' } } },
    ];
  }

  return where;
};

const create = (data, db = prisma) =>
  db.refunds.create({
    data,
    include: includeRelations,
  });

const findById = (id, db = prisma) =>
  db.refunds.findUnique({
    where: { id },
    include: includeRelations,
  });

const findManyPaginated = async (query = {}) => {
  const { page, limit, skip } = getPaginationParams(query);
  const where = buildWhere(query);
  const [items, total] = await prisma.$transaction([
    prisma.refunds.findMany({
      where,
      include: includeRelations,
      orderBy: { created_at: 'desc' },
      skip,
      take: limit,
    }),
    prisma.refunds.count({ where }),
  ]);

  return { items, page, limit, total };
};

module.exports = {
  create,
  findById,
  findManyPaginated,
};
