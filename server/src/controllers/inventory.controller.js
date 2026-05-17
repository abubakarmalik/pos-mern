const { sendSuccess, sendError } = require('../utils/response');
const inventoryService = require('../services/inventory.service');

const handleServiceError = (res, error) =>
  sendError(res, error.status, error.message, {
    code: error.errorCode,
    details: error.details,
  });

const adjustStock = async (req, res, next) => {
  try {
    const { productId, qtyChange, note } = req.validated.body;
    const adjustment = await inventoryService.adjustStock({
      productId,
      qtyChange,
      note,
      createdBy: req.user.id,
    });
    return sendSuccess(res, adjustment, 'Stock adjusted');
  } catch (error) {
    if (error.errorCode) return handleServiceError(res, error);
    return next(error);
  }
};

const listLedger = async (req, res, next) => {
  try {
    const ledger = await inventoryService.listLedger(req.validated.query);
    return sendSuccess(res, ledger, 'Stock ledger fetched');
  } catch (error) {
    return next(error);
  }
};

module.exports = { adjustStock, listLedger };
