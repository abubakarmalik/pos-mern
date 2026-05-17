const productsRepository = require('../repositories/products.repository');
const settingsRepository = require('../repositories/settings.repository');
const stockLedgerRepository = require('../repositories/stockLedger.repository');
const { buildPagination } = require('../utils/pagination');
const { mapProduct } = require('../utils/productMapper');
const { mapStockLedger } = require('../utils/stockLedgerMapper');

const createServiceError = (message, errorCode, status, details = null) =>
  Object.assign(new Error(message), { status, errorCode, details });

const INVENTORY_TRANSACTION_OPTIONS = {
  maxWait: 10000,
  timeout: 20000,
};

const adjustStock = async ({ productId, qtyChange, note, createdBy }) =>
  stockLedgerRepository.transaction(async (tx) => {
    const product = await productsRepository.findRawById(productId, tx);
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

    const settings = await settingsRepository.find(tx);
    const allowNegativeStock = settings?.allow_negative_stock ?? false;
    const currentStock = Number(product.stock_on_hand || 0);
    const finalStock = currentStock + qtyChange;

    if (!allowNegativeStock && finalStock < 0) {
      throw createServiceError('Stock cannot be negative', 'BAD_REQUEST', 400, {
        productId,
        stockOnHand: currentStock,
        qtyChange,
      });
    }

    const updatedProduct = await productsRepository.updateStock(
      productId,
      finalStock,
      tx,
    );
    const ledger = await stockLedgerRepository.create(
      {
        product_id: productId,
        type: 'ADJUSTMENT',
        qty_change: qtyChange,
        balance_after: finalStock,
        ref_type: 'ADJUSTMENT',
        ref_id: productId,
        note: note || null,
        created_by: createdBy,
      },
      tx,
    );

    return {
      product: mapProduct(updatedProduct),
      ledger: mapStockLedger(ledger),
    };
  }, INVENTORY_TRANSACTION_OPTIONS);

const listLedger = async (query = {}) => {
  const { items, page, limit, total } =
    await stockLedgerRepository.findManyPaginated(query);

  return {
    items: items.map(mapStockLedger),
    pagination: buildPagination({ page, limit, total }),
  };
};

module.exports = { adjustStock, listLedger };
