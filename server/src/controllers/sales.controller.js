const mongoose = require('mongoose');
const Product = require('../models/product.model');
const Sale = require('../models/sale.model');
const StockLedger = require('../models/stockLedger.model');
const Setting = require('../models/setting.model');
const { getNextInvoiceNo } = require('../utils/invoice');
const { sendSuccess, sendError } = require('../utils/response');

const createSale = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { items, cartDiscount, paymentMethod, cashReceived } =
      req.validated.body;

    const setting = await Setting.findOne().session(session);
    const allowNegativeStock = setting?.allowNegativeStock ?? false;

    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).session(
      session,
    );
    const productMap = new Map(
      products.map((product) => [product._id.toString(), product]),
    );

    let subtotal = 0;
    let lineDiscountTotal = 0;
    let taxTotal = 0;

    const saleItems = [];
    const ledgerEntries = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) throw Object.assign(new Error('Product not found'), { status: 404 });
      if (!product.isActive)
        throw Object.assign(new Error('Product is inactive'), { status: 400 });

      const linePrice = product.salePrice * item.qty;
      if (item.lineDiscount > linePrice)
        throw Object.assign(new Error('Line discount exceeds line total'), {
          status: 400,
        });

      if (!allowNegativeStock && product.stockOnHand < item.qty)
        throw Object.assign(new Error('Insufficient stock'), { status: 400 });

      const lineSubtotal = linePrice - item.lineDiscount;
      const tax = Math.round(
        (lineSubtotal * (product.taxRate || 0)) / 100,
      );
      const lineTotal = lineSubtotal + tax;

      subtotal += lineSubtotal;
      lineDiscountTotal += item.lineDiscount;
      taxTotal += tax;

      saleItems.push({
        productId: product._id,
        nameSnapshot: product.name,
        skuSnapshot: product.sku || '',
        unitSnapshot: product.unit,
        qty: item.qty,
        costPriceSnapshot: product.costPrice,
        salePriceSnapshot: product.salePrice,
        taxRateSnapshot: product.taxRate,
        lineDiscount: item.lineDiscount,
        lineSubtotal,
        tax,
        lineTotal,
      });

      product.stockOnHand -= item.qty;
      await product.save({ session });

      ledgerEntries.push({
        productId: product._id,
        type: 'SALE',
        qtyChange: -item.qty,
        refType: 'SALE',
        refId: null,
        note: `Sale for ${product.name}`,
        createdBy: req.user.id,
      });
    }

    const discountTotal = lineDiscountTotal + cartDiscount;
    const total = Math.max(
      subtotal + taxTotal - cartDiscount,
      0,
    );

    let changeDue = null;
    if (paymentMethod === 'CASH') {
      if (cashReceived == null)
        throw Object.assign(new Error('Cash received required'), { status: 400 });
      if (cashReceived < total)
        throw Object.assign(new Error('Cash received is less than total'), {
          status: 400,
        });
      changeDue = cashReceived - total;
    }

    const invoiceNo = await getNextInvoiceNo(session);

    const sale = await Sale.create(
      [
        {
          invoiceNo,
          cashierId: req.user.id,
          items: saleItems,
          subtotal,
          lineDiscountTotal,
          cartDiscount,
          discountTotal,
          taxTotal,
          total,
          paymentMethod,
          cashReceived: paymentMethod === 'CASH' ? cashReceived : null,
          changeDue: paymentMethod === 'CASH' ? changeDue : null,
        },
      ],
      { session },
    );

    const saleId = sale[0]._id;
    const ledgerWithRef = ledgerEntries.map((entry) => ({
      ...entry,
      refId: saleId,
    }));
    await StockLedger.insertMany(ledgerWithRef, { session });

    await session.commitTransaction();
    session.endSession();

    return sendSuccess(res, sale[0]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(error);
  }
};

const listSales = async (req, res, next) => {
  try {
    const { from, to, cashierId } = req.validated.query;
    const query = {};
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }
    if (cashierId) query.cashierId = cashierId;
    const sales = await Sale.find(query).sort({ createdAt: -1 });
    return sendSuccess(res, sales);
  } catch (error) {
    return next(error);
  }
};

const getSale = async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.id).populate(
      'cashierId',
      'name email role',
    );
    if (!sale) return sendError(res, 404, 'Sale not found');
    return sendSuccess(res, sale);
  } catch (error) {
    return next(error);
  }
};

module.exports = { createSale, listSales, getSale };
