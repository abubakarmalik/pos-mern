const reportsService = require('../services/reports.service');
const { sendSuccess } = require('../utils/response');

const getSummary = async (req, res, next) => {
  try {
    const summary = await reportsService.getSummary(req.validated.query);
    return sendSuccess(res, summary, 'Sales summary fetched');
  } catch (error) {
    return next(error);
  }
};

const getTopProducts = async (req, res, next) => {
  try {
    const topProducts = await reportsService.getTopProducts(req.validated.query);
    return sendSuccess(res, topProducts, 'Top products report fetched');
  } catch (error) {
    return next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await reportsService.getDashboard(req.validated.query);
    return sendSuccess(res, dashboard, 'Dashboard report fetched');
  } catch (error) {
    return next(error);
  }
};

const getSalesByDate = async (req, res, next) => {
  try {
    const salesByDate = await reportsService.getSalesByDate(req.validated.query);
    return sendSuccess(res, salesByDate, 'Sales by date report fetched');
  } catch (error) {
    return next(error);
  }
};

const getSalesByPaymentMethod = async (req, res, next) => {
  try {
    const salesByPaymentMethod =
      await reportsService.getSalesByPaymentMethod(req.validated.query);
    return sendSuccess(
      res,
      salesByPaymentMethod,
      'Sales by payment method report fetched',
    );
  } catch (error) {
    return next(error);
  }
};

const getCashierPerformance = async (req, res, next) => {
  try {
    const cashierPerformance =
      await reportsService.getCashierPerformance(req.validated.query);
    return sendSuccess(res, cashierPerformance, 'Cashier performance report fetched');
  } catch (error) {
    return next(error);
  }
};

const getInventoryMovementSummary = async (req, res, next) => {
  try {
    const inventoryMovement =
      await reportsService.getInventoryMovementSummary(req.validated.query);
    return sendSuccess(
      res,
      inventoryMovement,
      'Inventory movement summary fetched',
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getCashierPerformance,
  getDashboard,
  getInventoryMovementSummary,
  getSalesByDate,
  getSalesByPaymentMethod,
  getSummary,
  getTopProducts,
};
