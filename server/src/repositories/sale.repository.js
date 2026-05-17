const { prisma } = require('../../config/prisma');
const { getPaginationParams } = require('../utils/pagination');

const includeSaleRelations = {
  users: true,
  sale_items: {
    orderBy: { created_at: 'asc' },
  },
};

const buildWhere = ({
  search,
  cashierId,
  paymentMethod,
  status,
  dateFrom,
  dateTo,
  from,
  to,
} = {}) => {
  const where = {};
  const startDate = dateFrom || from;
  const endDate = dateTo || to;

  if (cashierId) where.cashier_id = cashierId;
  if (paymentMethod) where.payment_method = paymentMethod;
  if (status) where.status = status;
  if (startDate || endDate) {
    where.created_at = {};
    if (startDate) where.created_at.gte = new Date(startDate);
    if (endDate) where.created_at.lte = new Date(endDate);
  }
  if (search) {
    where.OR = [
      { invoice_no: { contains: search, mode: 'insensitive' } },
      { users: { name: { contains: search, mode: 'insensitive' } } },
      { users: { username: { contains: search, mode: 'insensitive' } } },
    ];
  }

  return where;
};

const transaction = (callback) => prisma.$transaction(callback);

const countByInvoiceDate = (dateKey, db = prisma) =>
  db.sales.count({
    where: { invoice_no: { startsWith: `POS-${dateKey}-` } },
  });

const create = (data, db = prisma) =>
  db.sales.create({
    data,
    include: includeSaleRelations,
  });

const findById = (id, db = prisma) =>
  db.sales.findUnique({
    where: { id },
    include: includeSaleRelations,
  });

const findManyPaginated = async (query = {}) => {
  const { page, limit, skip } = getPaginationParams(query);
  const where = buildWhere(query);
  const [items, total] = await prisma.$transaction([
    prisma.sales.findMany({
      where,
      include: includeSaleRelations,
      orderBy: { created_at: 'desc' },
      skip,
      take: limit,
    }),
    prisma.sales.count({ where }),
  ]);

  return { items, page, limit, total };
};

const updateStatus = (id, status, db = prisma) =>
  db.sales.update({
    where: { id },
    data: { status },
    include: includeSaleRelations,
  });

module.exports = {
  countByInvoiceDate,
  create,
  findById,
  findManyPaginated,
  transaction,
  updateStatus,
};
