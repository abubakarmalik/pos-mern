const reportsRepository = require('../repositories/reports.repository');
const { mapProduct } = require('../utils/productMapper');

const toNumber = (value) => (value == null ? 0 : Number(value));

const mapSummary = ({ sales, refunds }) => {
  const netTotal = toNumber(sales._sum.total);
  const totalRefunds = toNumber(refunds._sum.refund_amount);

  return {
    salesCount: sales._count.id || 0,
    orderCount: sales._count.id || 0,
    refundCount: refunds._count.id || 0,
    grossSubtotal: toNumber(sales._sum.subtotal),
    lineDiscount: toNumber(sales._sum.line_discount_total),
    cartDiscount: toNumber(sales._sum.cart_discount),
    discountTotal: toNumber(sales._sum.discount_total),
    taxTotal: toNumber(sales._sum.tax_total),
    netTotal,
    totalSales: netTotal,
    totalRefunds,
    netSales: netTotal - totalRefunds,
  };
};

const mapTopProduct = (item) => ({
  productId: item.productId,
  id: item.productId,
  name: item.name,
  sku: item.sku,
  categoryName: item.categoryName,
  qtySold: toNumber(item.qtySold),
  revenue: toNumber(item.revenue),
});

const mapSalesByDate = (item) => ({
  date: item.date,
  salesCount: Number(item.salesCount || 0),
  total: toNumber(item.total),
});

const mapPaymentMethod = (item) => ({
  paymentMethod: item.payment_method,
  salesCount: item._count.id || 0,
  total: toNumber(item._sum.total),
});

const mapCashierPerformance = (item) => ({
  cashierId: item.cashierId,
  cashierName: item.cashierName,
  username: item.username,
  salesCount: Number(item.salesCount || 0),
  total: toNumber(item.total),
});

const mapInventoryMovement = (item) => ({
  type: item.type,
  count: item._count.id || 0,
  qtyChange: toNumber(item._sum.qty_change),
});

const getSummary = async (filters = {}) =>
  mapSummary(await reportsRepository.getSalesSummary(filters));

const getTopProducts = async (filters = {}) => {
  const products = await reportsRepository.getTopProducts(filters);
  return products.map(mapTopProduct);
};

const getDashboard = async (filters = {}) => {
  const [summary, lowStockProducts, topProducts, salesByDate, salesByPaymentMethod] =
    await Promise.all([
      getSummary(filters),
      reportsRepository.getLowStockProducts(10),
      getTopProducts(filters),
      reportsRepository.getSalesByDate(filters),
      reportsRepository.getSalesByPaymentMethod(filters),
    ]);

  return {
    summary,
    lowStockProducts: lowStockProducts.map(mapProduct),
    topProducts,
    salesByDate: salesByDate.map(mapSalesByDate),
    salesByPaymentMethod: salesByPaymentMethod.map(mapPaymentMethod),
  };
};

const getSalesByDate = async (filters = {}) => {
  const rows = await reportsRepository.getSalesByDate(filters);
  return rows.map(mapSalesByDate);
};

const getSalesByPaymentMethod = async (filters = {}) => {
  const rows = await reportsRepository.getSalesByPaymentMethod(filters);
  return rows.map(mapPaymentMethod);
};

const getCashierPerformance = async (filters = {}) => {
  const rows = await reportsRepository.getCashierPerformance(filters);
  return rows.map(mapCashierPerformance);
};

const getInventoryMovementSummary = async (filters = {}) => {
  const rows = await reportsRepository.getInventoryMovementSummary(filters);
  return rows.map(mapInventoryMovement);
};

module.exports = {
  getCashierPerformance,
  getDashboard,
  getInventoryMovementSummary,
  getSalesByDate,
  getSalesByPaymentMethod,
  getSummary,
  getTopProducts,
};
