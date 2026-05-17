const productsRepository = require('../repositories/products.repository');
const saleRepository = require('../repositories/sale.repository');
const saleItemRepository = require('../repositories/saleItem.repository');
const settingsRepository = require('../repositories/settings.repository');
const stockLedgerRepository = require('../repositories/stockLedger.repository');
const { buildPagination } = require('../utils/pagination');
const { mapSale } = require('../utils/saleMapper');

const createServiceError = (message, errorCode, status, details = null) =>
  Object.assign(new Error(message), { status, errorCode, details });

const SALE_TRANSACTION_OPTIONS = {
  maxWait: 10000,
  timeout: 20000,
};

const formatInvoiceNo = (dateKey, seq) =>
  `POS-${dateKey}-${String(seq).padStart(4, '0')}`;

const getDateKey = (date = new Date()) =>
  date.toISOString().slice(0, 10).replace(/-/g, '');

const getNextInvoiceNo = async (tx, date = new Date()) => {
  const dateKey = getDateKey(date);
  const count = await saleRepository.countByInvoiceDate(dateKey, tx);
  return formatInvoiceNo(dateKey, count + 1);
};

const validatePayment = ({ paymentMethod, cashReceived, total }) => {
  if (paymentMethod !== 'CASH') {
    return { cashReceived: null, changeDue: null };
  }
  if (cashReceived == null) {
    throw createServiceError('Cash received is required', 'BAD_REQUEST', 400);
  }
  if (cashReceived < total) {
    throw createServiceError(
      'Cash received is less than total',
      'BAD_REQUEST',
      400,
      { cashReceived, total },
    );
  }
  return { cashReceived, changeDue: cashReceived - total };
};

const createSale = async ({ payload, cashierId }) =>
  saleRepository.transaction(async (tx) => {
    const { items, cartDiscount = 0, paymentMethod, cashReceived } = payload;
    const productIds = [...new Set(items.map((item) => item.productId))];
    const products = await Promise.all(
      productIds.map((id) => productsRepository.findRawById(id, tx)),
    );
    const productMap = new Map(
      products.filter(Boolean).map((product) => [product.id, product]),
    );
    const settings = await settingsRepository.find(tx);
    const allowNegativeStock = settings?.allow_negative_stock ?? false;

    const requestedQtyByProduct = new Map();
    items.forEach((item) => {
      if (item.qty <= 0) {
        throw createServiceError('Quantity must be greater than zero', 'BAD_REQUEST', 400, {
          productId: item.productId,
        });
      }
      requestedQtyByProduct.set(
        item.productId,
        (requestedQtyByProduct.get(item.productId) || 0) + item.qty,
      );
    });

    productIds.forEach((productId) => {
      const product = productMap.get(productId);
      if (!product) {
        throw createServiceError('Product not found', 'NOT_FOUND', 404, {
          productId,
        });
      }
      if (!product.is_active) {
        throw createServiceError('Product is inactive', 'BAD_REQUEST', 400, {
          productId,
        });
      }
      const stockOnHand = Number(product.stock_on_hand || 0);
      const requestedQty = requestedQtyByProduct.get(productId) || 0;
      if (!allowNegativeStock && stockOnHand < requestedQty) {
        throw createServiceError('Insufficient stock', 'BAD_REQUEST', 400, {
          productId,
          stockOnHand,
          requestedQty,
        });
      }
    });

    let subtotal = 0;
    let lineDiscountTotal = 0;
    let taxTotal = 0;
    const saleItems = [];
    const productBalances = new Map(
      products
        .filter(Boolean)
        .map((product) => [product.id, Number(product.stock_on_hand || 0)]),
    );

    for (const item of items) {
      const product = productMap.get(item.productId);
      const linePrice = Number(product.sale_price) * item.qty;
      if (item.lineDiscount > linePrice) {
        throw createServiceError('Line discount exceeds line total', 'BAD_REQUEST', 400, {
          productId: item.productId,
          lineDiscount: item.lineDiscount,
          lineTotal: linePrice,
        });
      }

      const lineSubtotal = linePrice - item.lineDiscount;
      const tax = Math.round((lineSubtotal * Number(product.tax_rate || 0)) / 100);
      const lineTotal = lineSubtotal + tax;

      subtotal += lineSubtotal;
      lineDiscountTotal += item.lineDiscount;
      taxTotal += tax;

      saleItems.push({
        product_id: product.id,
        name_snapshot: product.name,
        sku_snapshot: product.sku || '',
        unit_snapshot: product.unit,
        qty: item.qty,
        cost_price_snapshot: product.cost_price,
        sale_price_snapshot: product.sale_price,
        tax_rate_snapshot: product.tax_rate,
        line_discount: item.lineDiscount,
        line_subtotal: lineSubtotal,
        tax,
        line_total: lineTotal,
      });
    }

    const discountTotal = lineDiscountTotal + cartDiscount;
    const total = Math.max(subtotal + taxTotal - cartDiscount, 0);
    const payment = validatePayment({ paymentMethod, cashReceived, total });
    const invoiceNo = await getNextInvoiceNo(tx);
    const sale = await saleRepository.create(
      {
        invoice_no: invoiceNo,
        cashier_id: cashierId,
        subtotal,
        line_discount_total: lineDiscountTotal,
        cart_discount: cartDiscount,
        discount_total: discountTotal,
        tax_total: taxTotal,
        total,
        payment_method: paymentMethod,
        cash_received: payment.cashReceived,
        change_due: payment.changeDue,
      },
      tx,
    );

    await saleItemRepository.createMany(
      saleItems.map((item) => ({ ...item, sale_id: sale.id })),
      tx,
    );

    const ledgerEntries = [];
    for (const item of items) {
      const currentBalance = productBalances.get(item.productId);
      const balanceAfter = currentBalance - item.qty;
      productBalances.set(item.productId, balanceAfter);
      await productsRepository.updateStock(item.productId, balanceAfter, tx);
      const product = productMap.get(item.productId);
      ledgerEntries.push({
        product_id: item.productId,
        type: 'SALE',
        qty_change: -item.qty,
        balance_after: balanceAfter,
        ref_type: 'SALE',
        ref_id: sale.id,
        note: `Sale for ${product.name}`,
        created_by: cashierId,
      });
    }

    await stockLedgerRepository.createMany(ledgerEntries, tx);

    const createdSale = await saleRepository.findById(sale.id, tx);
    return mapSale(createdSale);
  }, SALE_TRANSACTION_OPTIONS);

const listSales = async (query = {}) => {
  const { items, page, limit, total } =
    await saleRepository.findManyPaginated(query);
  return {
    items: items.map(mapSale),
    pagination: buildPagination({ page, limit, total }),
  };
};

const getSale = async (id) => {
  const sale = await saleRepository.findById(id);
  if (!sale) {
    throw createServiceError('Sale not found', 'NOT_FOUND', 404, { id });
  }
  return mapSale(sale);
};

module.exports = { createSale, getSale, listSales };
