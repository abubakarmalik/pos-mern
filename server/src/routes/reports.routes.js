const express = require('express');
const {
  getCashierPerformance,
  getDashboard,
  getInventoryMovementSummary,
  getSalesByDate,
  getSalesByPaymentMethod,
  getSummary,
  getTopProducts,
} = require('../controllers/reports.controller');
const { requireAuth } = require('../middlewares/auth');
const validateRequest = require('../middlewares/validateRequest');
const { reportQuerySchema } = require('../schemas/report.schemas');

const router = express.Router();

router.use(requireAuth);

router.get('/dashboard', validateRequest(reportQuerySchema), getDashboard);
router.get('/summary', validateRequest(reportQuerySchema), getSummary);
router.get('/top-products', validateRequest(reportQuerySchema), getTopProducts);
router.get('/sales-by-date', validateRequest(reportQuerySchema), getSalesByDate);
router.get('/payment-methods', validateRequest(reportQuerySchema), getSalesByPaymentMethod);
router.get('/cashier-performance', validateRequest(reportQuerySchema), getCashierPerformance);
router.get('/inventory-movement', validateRequest(reportQuerySchema), getInventoryMovementSummary);

module.exports = router;
