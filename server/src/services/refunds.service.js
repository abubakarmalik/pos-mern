const productsRepository = require('../repositories/products.repository');
const refundRepository = require('../repositories/refund.repository');
const saleRepository = require('../repositories/sale.repository');
const stockLedgerRepository = require('../repositories/stockLedger.repository');
const { buildPagination } = require('../utils/pagination');
const { mapRefund } = require('../utils/refundMapper');

const createServiceError = (message, errorCode, status, details = null) =>
  Object.assign(new Error(message), { status, errorCode, details });

const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const toNumber = (value) => Number(value || 0);

const getSaleItemProductId = (item) => item.product_id || item.productId;

const buildSoldSummary = (saleItems) => {
  const summary = new Map();

  saleItems.forEach((item) => {
    const productId = getSaleItemProductId(item);
    if (!productId) return;

    const current = summary.get(productId) || {
      productId,
      qty: 0,
      lineTotal: 0,
      name: item.name_snapshot,
    };

    current.qty += toNumber(item.qty);
    current.lineTotal += toNumber(item.line_total);
    summary.set(productId, current);
  });

  return summary;
};

const buildRequestedByProduct = ({ requestedItems, soldSummary, refundedByProduct }) => {
  const requested = new Map();

  if (!requestedItems?.length) {
    soldSummary.forEach((sold, productId) => {
      const refundedQty = refundedByProduct.get(productId) || 0;
      const remainingQty = sold.qty - refundedQty;
      if (remainingQty > 0) requested.set(productId, remainingQty);
    });
    return requested;
  }

  requestedItems.forEach((item) => {
    const productId = item.productId;
    if (!productId || item.qty <= 0) {
      throw createServiceError('Invalid refund quantity', 'BAD_REQUEST', 400, item);
    }
    requested.set(productId, (requested.get(productId) || 0) + item.qty);
  });

  return requested;
};

const calculateRefundAmount = ({ sale, soldSummary, requestedByProduct }) => {
  const saleItemsTotal = [...soldSummary.values()].reduce(
    (sum, item) => sum + item.lineTotal,
    0,
  );
  const grossRefundAmount = [...requestedByProduct.entries()].reduce(
    (sum, [productId, qty]) => {
      const sold = soldSummary.get(productId);
      if (!sold || sold.qty <= 0) return sum;
      return sum + (sold.lineTotal / sold.qty) * qty;
    },
    0,
  );

  if (saleItemsTotal <= 0) return 0;
  const saleTotal = toNumber(sale.total);
  return roundMoney((grossRefundAmount / saleItemsTotal) * saleTotal);
};

const normalizeRequestedItems = ({ items, saleItems }) => {
  if (!items?.length) return [];

  const saleItemById = new Map(saleItems.map((item) => [item.id, item]));
  return items.map((item) => {
    if (item.saleItemId) {
      const saleItem = saleItemById.get(item.saleItemId);
      if (!saleItem) {
        throw createServiceError('Invalid refund item', 'BAD_REQUEST', 400, {
          saleItemId: item.saleItemId,
        });
      }
      return { productId: getSaleItemProductId(saleItem), qty: item.qty };
    }

    return { productId: item.productId, qty: item.qty };
  });
};

const isFullyRefunded = ({ soldSummary, refundedByProduct, requestedByProduct }) =>
  [...soldSummary.entries()].every(([productId, sold]) => {
    const refundedQty = refundedByProduct.get(productId) || 0;
    const requestedQty = requestedByProduct.get(productId) || 0;
    return refundedQty + requestedQty >= sold.qty;
  });

const validateRefundQuantities = ({ soldSummary, refundedByProduct, requestedByProduct }) => {
  if (!requestedByProduct.size) {
    throw createServiceError('Sale already refunded', 'SALE_ALREADY_REFUNDED', 400);
  }

  requestedByProduct.forEach((requestedQty, productId) => {
    const sold = soldSummary.get(productId);
    if (!sold) {
      throw createServiceError('Invalid refund item', 'BAD_REQUEST', 400, { productId });
    }
    if (requestedQty <= 0) {
      throw createServiceError('Invalid refund quantity', 'BAD_REQUEST', 400, {
        productId,
        requestedQty,
      });
    }

    const refundedQty = refundedByProduct.get(productId) || 0;
    const refundableQty = sold.qty - refundedQty;
    if (requestedQty > refundableQty) {
      throw createServiceError('Refund quantity exceeds sold quantity', 'BAD_REQUEST', 400, {
        productId,
        soldQty: sold.qty,
        refundedQty,
        requestedQty,
        refundableQty,
      });
    }
  });
};

const createRefund = async ({ payload, createdBy }) =>
  saleRepository.transaction(async (tx) => {
    const { saleId, reason, items } = payload;
    const sale = await saleRepository.findById(saleId, tx);
    if (!sale) {
      throw createServiceError('Sale not found', 'NOT_FOUND', 404, { saleId });
    }
    if (sale.status === 'REFUNDED') {
      throw createServiceError('Sale already refunded', 'SALE_ALREADY_REFUNDED', 400, {
        saleId,
      });
    }
    if (!sale.sale_items?.length) {
      throw createServiceError('Sale has no items to refund', 'BAD_REQUEST', 400, {
        saleId,
      });
    }

    const soldSummary = buildSoldSummary(sale.sale_items);
    const refundedRows = await stockLedgerRepository.getRefundedQtyBySaleId(saleId, tx);
    const refundedByProduct = new Map(
      refundedRows.map((row) => [row.productId, row.qty]),
    );
    const requestedItems = normalizeRequestedItems({ items, saleItems: sale.sale_items });
    const requestedByProduct = buildRequestedByProduct({
      requestedItems,
      soldSummary,
      refundedByProduct,
    });

    validateRefundQuantities({ soldSummary, refundedByProduct, requestedByProduct });

    const refundAmount = calculateRefundAmount({
      sale,
      soldSummary,
      requestedByProduct,
    });
    const refund = await refundRepository.create(
      {
        sale_id: sale.id,
        reason,
        refund_amount: refundAmount,
        created_by: createdBy,
      },
      tx,
    );

    const ledgerEntries = [];
    for (const [productId, qty] of requestedByProduct.entries()) {
      const product = await productsRepository.findRawById(productId, tx);
      if (!product) {
        throw createServiceError('Product not found', 'NOT_FOUND', 404, { productId });
      }

      const balanceAfter = toNumber(product.stock_on_hand) + qty;
      await productsRepository.updateStock(productId, balanceAfter, tx);

      const sold = soldSummary.get(productId);
      ledgerEntries.push({
        product_id: productId,
        type: 'REFUND',
        qty_change: qty,
        balance_after: balanceAfter,
        ref_type: 'REFUND',
        ref_id: sale.id,
        note: `Refund for ${sale.invoice_no} - ${sold.name || product.name}`,
        created_by: createdBy,
      });
    }

    await Promise.all(
      ledgerEntries.map((entry) => stockLedgerRepository.create(entry, tx)),
    );

    if (isFullyRefunded({ soldSummary, refundedByProduct, requestedByProduct })) {
      await saleRepository.updateStatus(sale.id, 'REFUNDED', tx);
    }

    const createdRefund = await refundRepository.findById(refund.id, tx);
    return mapRefund(createdRefund);
  });

const listRefunds = async (query = {}) => {
  const { items, page, limit, total } =
    await refundRepository.findManyPaginated(query);
  return {
    items: items.map(mapRefund),
    pagination: buildPagination({ page, limit, total }),
  };
};

const getRefund = async (id) => {
  const refund = await refundRepository.findById(id);
  if (!refund) {
    throw createServiceError('Refund not found', 'NOT_FOUND', 404, { id });
  }
  return mapRefund(refund);
};

module.exports = { createRefund, getRefund, listRefunds };
