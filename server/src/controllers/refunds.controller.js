const mongoose = require('mongoose');
const Product = require('../models/product.model');
const Sale = require('../models/sale.model');
const Refund = require('../models/refund.model');
const StockLedger = require('../models/stockLedger.model');
const { sendSuccess } = require('../utils/response');

const createRefund = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { saleId, reason } = req.validated.body;
    const sale = await Sale.findById(saleId).session(session);
    if (!sale)
      throw Object.assign(new Error('Sale not found'), {
        status: 404,
        errorCode: 'SALE_NOT_FOUND',
        details: { saleId },
      });
    if (sale.status === 'REFUNDED')
      throw Object.assign(new Error('Sale already refunded'), {
        status: 400,
        errorCode: 'SALE_ALREADY_REFUNDED',
        details: { saleId },
      });

    const ledgerEntries = [];
    for (const item of sale.items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product)
        throw Object.assign(new Error('Product not found'), {
          status: 404,
          errorCode: 'PRODUCT_NOT_FOUND',
          details: { productId: item.productId },
        });

      product.stockOnHand += item.qty;
      await product.save({ session });

      ledgerEntries.push({
        productId: product._id,
        type: 'REFUND',
        qtyChange: item.qty,
        refType: 'REFUND',
        refId: sale._id,
        note: `Refund for ${sale.invoiceNo}`,
        createdBy: req.user.id,
      });
    }

    const refund = await Refund.create(
      [
        {
          saleId: sale._id,
          reason,
          createdBy: req.user.id,
        },
      ],
      { session },
    );

    sale.status = 'REFUNDED';
    await sale.save({ session });

    await StockLedger.insertMany(ledgerEntries, { session });

    await session.commitTransaction();
    session.endSession();

    return sendSuccess(res, refund[0], 'Refund processed', 201);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(error);
  }
};

module.exports = { createRefund };
