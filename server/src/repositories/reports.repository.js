const { Prisma } = require('@prisma/client');
const { prisma } = require('../../config/prisma');

const toDate = (value, endOfDay = false) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  if (endOfDay && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    date.setHours(23, 59, 59, 999);
  }
  return date;
};

const getDateRange = ({ dateFrom, dateTo, from, to } = {}) => ({
  startDate: toDate(dateFrom || from),
  endDate: toDate(dateTo || to, true),
});

const buildSalesWhere = (filters = {}) => {
  const { cashierId, paymentMethod } = filters;
  const { startDate, endDate } = getDateRange(filters);
  const where = { status: 'COMPLETED' };

  if (cashierId) where.cashier_id = cashierId;
  if (paymentMethod) where.payment_method = paymentMethod;
  if (startDate || endDate) {
    where.created_at = {};
    if (startDate) where.created_at.gte = startDate;
    if (endDate) where.created_at.lte = endDate;
  }

  return where;
};

const buildRefundWhere = (filters = {}) => {
  const { cashierId, paymentMethod } = filters;
  const { startDate, endDate } = getDateRange(filters);
  const where = {};

  if (startDate || endDate) {
    where.created_at = {};
    if (startDate) where.created_at.gte = startDate;
    if (endDate) where.created_at.lte = endDate;
  }
  if (cashierId || paymentMethod) {
    where.sales = {};
    if (cashierId) where.sales.cashier_id = cashierId;
    if (paymentMethod) where.sales.payment_method = paymentMethod;
  }

  return where;
};

const rawDateConditions = ({ alias = 's', filters = {}, includeCategory = false } = {}) => {
  const { startDate, endDate } = getDateRange(filters);
  const clauses = [Prisma.sql`${Prisma.raw(alias)}.status = 'COMPLETED'`];

  if (startDate) clauses.push(Prisma.sql`${Prisma.raw(alias)}.created_at >= ${startDate}`);
  if (endDate) clauses.push(Prisma.sql`${Prisma.raw(alias)}.created_at <= ${endDate}`);
  if (filters.cashierId) clauses.push(Prisma.sql`${Prisma.raw(alias)}.cashier_id = ${filters.cashierId}::uuid`);
  if (filters.paymentMethod) clauses.push(Prisma.sql`${Prisma.raw(alias)}.payment_method = ${filters.paymentMethod}::payment_method`);
  if (includeCategory && filters.categoryId) {
    clauses.push(Prisma.sql`p.category_id = ${filters.categoryId}::uuid`);
  }

  return Prisma.join(clauses, ' AND ');
};

const getSalesSummary = async (filters = {}) => {
  const [sales, refunds] = await prisma.$transaction([
    prisma.sales.aggregate({
      where: buildSalesWhere(filters),
      _count: { id: true },
      _sum: {
        subtotal: true,
        line_discount_total: true,
        cart_discount: true,
        discount_total: true,
        tax_total: true,
        total: true,
      },
    }),
    prisma.refunds.aggregate({
      where: buildRefundWhere(filters),
      _count: { id: true },
      _sum: { refund_amount: true },
    }),
  ]);

  return { sales, refunds };
};

const getLowStockProducts = (limit = 10) =>
  prisma.products.findMany({
    where: {
      is_active: true,
      stock_on_hand: { lte: prisma.products.fields.min_stock },
    },
    include: { categories: true },
    orderBy: [{ stock_on_hand: 'asc' }, { name: 'asc' }],
    take: limit,
  });

const getTopProducts = (filters = {}, limit = 10) =>
  prisma.$queryRaw`
    SELECT
      si.product_id AS "productId",
      COALESCE(p.name, si.name_snapshot) AS name,
      COALESCE(p.sku, si.sku_snapshot) AS sku,
      COALESCE(c.name, '') AS "categoryName",
      SUM(si.qty)::numeric AS "qtySold",
      SUM(si.line_total)::numeric AS revenue
    FROM sale_items si
    JOIN sales s ON s.id = si.sale_id
    LEFT JOIN products p ON p.id = si.product_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE ${rawDateConditions({ filters, includeCategory: true })}
    GROUP BY si.product_id, COALESCE(p.name, si.name_snapshot), COALESCE(p.sku, si.sku_snapshot), COALESCE(c.name, '')
    ORDER BY SUM(si.qty) DESC
    LIMIT ${limit}
  `;

const getSalesByDate = (filters = {}) =>
  prisma.$queryRaw`
    SELECT
      DATE(s.created_at) AS date,
      COUNT(s.id)::int AS "salesCount",
      COALESCE(SUM(s.total), 0)::numeric AS total
    FROM sales s
    WHERE ${rawDateConditions({ filters })}
    GROUP BY DATE(s.created_at)
    ORDER BY DATE(s.created_at) ASC
  `;

const getSalesByPaymentMethod = (filters = {}) =>
  prisma.sales.groupBy({
    by: ['payment_method'],
    where: buildSalesWhere(filters),
    _count: { id: true },
    _sum: { total: true },
    orderBy: { payment_method: 'asc' },
  });

const getCashierPerformance = (filters = {}) =>
  prisma.$queryRaw`
    SELECT
      u.id AS "cashierId",
      u.name AS "cashierName",
      u.username,
      COUNT(s.id)::int AS "salesCount",
      COALESCE(SUM(s.total), 0)::numeric AS total
    FROM sales s
    JOIN users u ON u.id = s.cashier_id
    WHERE ${rawDateConditions({ filters })}
    GROUP BY u.id, u.name, u.username
    ORDER BY COALESCE(SUM(s.total), 0) DESC
  `;

const getInventoryMovementSummary = (filters = {}) => {
  const { startDate, endDate } = getDateRange(filters);
  const where = {};

  if (startDate || endDate) {
    where.created_at = {};
    if (startDate) where.created_at.gte = startDate;
    if (endDate) where.created_at.lte = endDate;
  }
  if (filters.categoryId) {
    where.products = { category_id: filters.categoryId };
  }

  return prisma.stock_ledger.groupBy({
    by: ['type'],
    where,
    _count: { id: true },
    _sum: { qty_change: true },
    orderBy: { type: 'asc' },
  });
};

module.exports = {
  getCashierPerformance,
  getInventoryMovementSummary,
  getLowStockProducts,
  getSalesByDate,
  getSalesByPaymentMethod,
  getSalesSummary,
  getTopProducts,
};
