const express = require('express');
const { createSale, listSales, getSale } = require('../controllers/sales.controller');
const { requireAuth, requireRole } = require('../middlewares/auth');
const validateRequest = require('../middlewares/validateRequest');
const { createSaleSchema, salesQuerySchema, saleParamSchema } = require('../schemas/sale.schemas');

const router = express.Router();

router.use(requireAuth);

router.post('/', requireRole(['ADMIN', 'CASHIER']), validateRequest(createSaleSchema), createSale);
router.get('/', validateRequest(salesQuerySchema), listSales);
router.get('/:id', validateRequest(saleParamSchema), getSale);

module.exports = router;
