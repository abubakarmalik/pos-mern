const mongoose = require('mongoose');
const env = require('../config/env');

const divideByHundred = (value) => {
  if (value == null) return value;
  return Number(value) / 100;
};

const migrate = async () => {
  if (!env.MONGODB_URL) throw new Error('MONGODB_URL is missing');

  await mongoose.connect(env.MONGODB_URL);

  const db = mongoose.connection.db;
  const productsCollection = db.collection('products');
  const salesCollection = db.collection('sales');

  let productsUpdated = 0;
  let salesUpdated = 0;

  const productsCursor = productsCollection.find({
    $or: [
      { costPriceCents: { $exists: true } },
      { salePriceCents: { $exists: true } },
    ],
  });

  while (await productsCursor.hasNext()) {
    const product = await productsCursor.next();
    const setFields = {};
    const unsetFields = {};

    if (product.costPrice == null && product.costPriceCents != null) {
      setFields.costPrice = divideByHundred(product.costPriceCents);
    }
    if (product.salePrice == null && product.salePriceCents != null) {
      setFields.salePrice = divideByHundred(product.salePriceCents);
    }

    if (product.costPriceCents != null) unsetFields.costPriceCents = '';
    if (product.salePriceCents != null) unsetFields.salePriceCents = '';

    if (Object.keys(setFields).length || Object.keys(unsetFields).length) {
      await productsCollection.updateOne(
        { _id: product._id },
        {
          ...(Object.keys(setFields).length ? { $set: setFields } : {}),
          ...(Object.keys(unsetFields).length ? { $unset: unsetFields } : {}),
        },
      );
      productsUpdated += 1;
    }
  }

  const salesCursor = salesCollection.find({
    $or: [
      { subtotalCents: { $exists: true } },
      { totalCents: { $exists: true } },
      { 'items.lineTotalCents': { $exists: true } },
    ],
  });

  while (await salesCursor.hasNext()) {
    const sale = await salesCursor.next();
    const setFields = {};
    const unsetFields = {};

    if (sale.subtotal == null && sale.subtotalCents != null) {
      setFields.subtotal = divideByHundred(sale.subtotalCents);
    }
    if (sale.lineDiscountTotal == null && sale.lineDiscountTotalCents != null) {
      setFields.lineDiscountTotal = divideByHundred(sale.lineDiscountTotalCents);
    }
    if (sale.cartDiscount == null && sale.cartDiscountCents != null) {
      setFields.cartDiscount = divideByHundred(sale.cartDiscountCents);
    }
    if (sale.discountTotal == null && sale.discountTotalCents != null) {
      setFields.discountTotal = divideByHundred(sale.discountTotalCents);
    }
    if (sale.taxTotal == null && sale.taxTotalCents != null) {
      setFields.taxTotal = divideByHundred(sale.taxTotalCents);
    }
    if (sale.total == null && sale.totalCents != null) {
      setFields.total = divideByHundred(sale.totalCents);
    }
    if (sale.cashReceived == null && sale.cashReceivedCents != null) {
      setFields.cashReceived = divideByHundred(sale.cashReceivedCents);
    }
    if (sale.changeDue == null && sale.changeDueCents != null) {
      setFields.changeDue = divideByHundred(sale.changeDueCents);
    }

    const shouldUpdateItems =
      Array.isArray(sale.items) &&
      sale.items.some(
        (item) =>
          item.costPriceCentsSnapshot != null ||
          item.salePriceCentsSnapshot != null ||
          item.lineDiscountCents != null ||
          item.lineSubtotalCents != null ||
          item.taxCents != null ||
          item.lineTotalCents != null,
      );

    if (shouldUpdateItems) {
      setFields.items = sale.items.map((item) => ({
        productId: item.productId,
        nameSnapshot: item.nameSnapshot,
        skuSnapshot: item.skuSnapshot,
        unitSnapshot: item.unitSnapshot,
        qty: item.qty,
        costPriceSnapshot:
          item.costPriceSnapshot ??
          divideByHundred(item.costPriceCentsSnapshot),
        salePriceSnapshot:
          item.salePriceSnapshot ??
          divideByHundred(item.salePriceCentsSnapshot),
        taxRateSnapshot: item.taxRateSnapshot,
        lineDiscount: item.lineDiscount ?? divideByHundred(item.lineDiscountCents),
        lineSubtotal: item.lineSubtotal ?? divideByHundred(item.lineSubtotalCents),
        tax: item.tax ?? divideByHundred(item.taxCents),
        lineTotal: item.lineTotal ?? divideByHundred(item.lineTotalCents),
      }));
    }

    if (sale.subtotalCents != null) unsetFields.subtotalCents = '';
    if (sale.lineDiscountTotalCents != null) unsetFields.lineDiscountTotalCents = '';
    if (sale.cartDiscountCents != null) unsetFields.cartDiscountCents = '';
    if (sale.discountTotalCents != null) unsetFields.discountTotalCents = '';
    if (sale.taxTotalCents != null) unsetFields.taxTotalCents = '';
    if (sale.totalCents != null) unsetFields.totalCents = '';
    if (sale.cashReceivedCents != null) unsetFields.cashReceivedCents = '';
    if (sale.changeDueCents != null) unsetFields.changeDueCents = '';

    if (Object.keys(setFields).length || Object.keys(unsetFields).length) {
      await salesCollection.updateOne(
        { _id: sale._id },
        {
          ...(Object.keys(setFields).length ? { $set: setFields } : {}),
          ...(Object.keys(unsetFields).length ? { $unset: unsetFields } : {}),
        },
      );
      salesUpdated += 1;
    }
  }

  console.log(`✅ Migration complete. Products updated: ${productsUpdated}. Sales updated: ${salesUpdated}.`);

  await mongoose.disconnect();
};

migrate().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
