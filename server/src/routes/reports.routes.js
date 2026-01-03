const express = require('express');
const { getSummary, getTopProducts } = require('../controllers/reports.controller');
const { requireAuth } = require('../middlewares/auth');
const validateRequest = require('../middlewares/validateRequest');
const { reportQuerySchema } = require('../schemas/report.schemas');

const router = express.Router();

router.use(requireAuth);

router.get('/summary', validateRequest(reportQuerySchema), getSummary);
router.get('/top-products', validateRequest(reportQuerySchema), getTopProducts);

module.exports = router;
