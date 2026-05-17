const refundsService = require('../services/refunds.service');
const { sendSuccess, sendError } = require('../utils/response');

const handleServiceError = (res, error) =>
  sendError(res, error.status, error.message, {
    code: error.errorCode,
    details: error.details,
  });

const createRefund = async (req, res, next) => {
  try {
    const refund = await refundsService.createRefund({
      payload: req.validated.body,
      createdBy: req.user.id,
    });
    return sendSuccess(res, refund, 'Refund processed', 201);
  } catch (error) {
    if (error.errorCode) return handleServiceError(res, error);
    return next(error);
  }
};

const listRefunds = async (req, res, next) => {
  try {
    const refunds = await refundsService.listRefunds(req.validated.query);
    return sendSuccess(res, refunds, 'Refunds fetched');
  } catch (error) {
    return next(error);
  }
};

const getRefund = async (req, res, next) => {
  try {
    const refund = await refundsService.getRefund(req.validated.params.id);
    return sendSuccess(res, refund, 'Refund fetched');
  } catch (error) {
    if (error.errorCode) return handleServiceError(res, error);
    return next(error);
  }
};

module.exports = { createRefund, getRefund, listRefunds };
