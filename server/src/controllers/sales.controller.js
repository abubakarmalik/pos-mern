const { sendSuccess, sendError } = require('../utils/response');
const salesService = require('../services/sales.service');

const handleServiceError = (res, error) =>
  sendError(res, error.status, error.message, {
    code: error.errorCode,
    details: error.details,
  });

const createSale = async (req, res, next) => {
  try {
    const sale = await salesService.createSale({
      payload: req.validated.body,
      cashierId: req.user.id,
    });
    return sendSuccess(res, sale, 'Sale completed', 201);
  } catch (error) {
    if (error.errorCode) return handleServiceError(res, error);
    return next(error);
  }
};

const listSales = async (req, res, next) => {
  try {
    const sales = await salesService.listSales(req.validated.query);
    return sendSuccess(res, sales, 'Sales fetched');
  } catch (error) {
    return next(error);
  }
};

const getSale = async (req, res, next) => {
  try {
    const sale = await salesService.getSale(req.validated.params.id);
    return sendSuccess(res, sale, 'Sale fetched');
  } catch (error) {
    if (error.errorCode) return handleServiceError(res, error);
    return next(error);
  }
};

module.exports = { createSale, listSales, getSale };
