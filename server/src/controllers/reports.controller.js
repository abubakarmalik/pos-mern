const Sale = require('../models/sale.model');
const { sendSuccess } = require('../utils/response');

const parseDateRange = (from, to) => {
  const range = {};
  if (from) range.$gte = new Date(from);
  if (to) range.$lte = new Date(to);
  return range;
};

const getSummary = async (req, res, next) => {
  try {
    const { from, to } = req.validated.query;
    const match = { status: 'COMPLETED' };
    if (from || to) match.createdAt = parseDateRange(from, to);

    const [summary] = await Sale.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          salesCount: { $sum: 1 },
          grossSubtotal: { $sum: '$subtotal' },
          lineDiscount: { $sum: '$lineDiscountTotal' },
          cartDiscount: { $sum: '$cartDiscount' },
          discountTotal: { $sum: '$discountTotal' },
          taxTotal: { $sum: '$taxTotal' },
          netTotal: { $sum: '$total' },
        },
      },
    ]);

    return sendSuccess(res, {
      salesCount: summary?.salesCount || 0,
      grossSubtotal: summary?.grossSubtotal || 0,
      lineDiscount: summary?.lineDiscount || 0,
      cartDiscount: summary?.cartDiscount || 0,
      discountTotal: summary?.discountTotal || 0,
      taxTotal: summary?.taxTotal || 0,
      netTotal: summary?.netTotal || 0,
    });
  } catch (error) {
    return next(error);
  }
};

const getTopProducts = async (req, res, next) => {
  try {
    const { from, to } = req.validated.query;
    const match = { status: 'COMPLETED' };
    if (from || to) match.createdAt = parseDateRange(from, to);

    const topProducts = await Sale.aggregate([
      { $match: match },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          name: { $first: '$items.nameSnapshot' },
          sku: { $first: '$items.skuSnapshot' },
          qtySold: { $sum: '$items.qty' },
          revenue: { $sum: '$items.lineTotal' },
        },
      },
      { $sort: { qtySold: -1 } },
      { $limit: 10 },
    ]);

    return sendSuccess(res, topProducts);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getSummary, getTopProducts };
