const express = require('express');
const { adjustStock, listLedger } = require('../controllers/inventory.controller');
const { requireAuth, requireRole } = require('../middlewares/auth');
const validateRequest = require('../middlewares/validateRequest');
const { adjustInventorySchema, ledgerQuerySchema } = require('../schemas/inventory.schemas');

const router = express.Router();

router.use(requireAuth);

router.post('/adjust', requireRole('ADMIN'), validateRequest(adjustInventorySchema), adjustStock);
router.get('/ledger', requireRole('ADMIN'), validateRequest(ledgerQuerySchema), listLedger);

module.exports = router;
