const Product = require('../models/product.model');
const StockLedger = require('../models/stockLedger.model');
const Setting = require('../models/setting.model');
const { sendSuccess, sendError } = require('../utils/response');

const adjustStock = async (req, res, next) => {
  try {
    const { productId, qtyChange, note } = req.validated.body;
    const product = await Product.findById(productId);
    if (!product) return sendError(res, 404, 'Product not found');

    const setting = await Setting.findOne();
    const allowNegativeStock = setting?.allowNegativeStock ?? false;
    const newStock = product.stockOnHand + qtyChange;
    if (!allowNegativeStock && newStock < 0)
      return sendError(res, 400, 'Stock cannot be negative');

    product.stockOnHand = newStock;
    await product.save();

    const ledger = await StockLedger.create({
      productId,
      type: 'ADJUSTMENT',
      qtyChange,
      refType: 'ADJUSTMENT',
      refId: productId,
      note,
      createdBy: req.user.id,
    });

    return sendSuccess(res, { product, ledger });
  } catch (error) {
    return next(error);
  }
};

const listLedger = async (req, res, next) => {
  try {
    const { productId, from, to } = req.validated.query;
    const query = {};
    if (productId) query.productId = productId;
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }
    const ledger = await StockLedger.find(query).sort({ createdAt: -1 });
    return sendSuccess(res, ledger);
  } catch (error) {
    return next(error);
  }
};

module.exports = { adjustStock, listLedger };
