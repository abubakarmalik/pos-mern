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
          grossSubtotalCents: { $sum: '$subtotalCents' },
          lineDiscountCents: { $sum: '$lineDiscountTotalCents' },
          cartDiscountCents: { $sum: '$cartDiscountCents' },
          discountCents: { $sum: '$discountTotalCents' },
          taxCents: { $sum: '$taxTotalCents' },
          netTotalCents: { $sum: '$totalCents' },
        },
      },
    ]);

    return sendSuccess(res, {
      salesCount: summary?.salesCount || 0,
      grossSubtotalCents: summary?.grossSubtotalCents || 0,
      lineDiscountCents: summary?.lineDiscountCents || 0,
      cartDiscountCents: summary?.cartDiscountCents || 0,
      discountCents: summary?.discountCents || 0,
      taxCents: summary?.taxCents || 0,
      netTotalCents: summary?.netTotalCents || 0,
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
          revenueCents: { $sum: '$items.lineTotalCents' },
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
