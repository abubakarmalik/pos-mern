const express = require('express');
const { createRefund, getRefund, listRefunds } = require('../controllers/refunds.controller');
const { requireAuth, requireRole } = require('../middlewares/auth');
const validateRequest = require('../middlewares/validateRequest');
const {
  createRefundSchema,
  refundParamSchema,
  refundsQuerySchema,
} = require('../schemas/refund.schemas');

const router = express.Router();

router.use(requireAuth, requireRole('ADMIN'));

router.get('/', validateRequest(refundsQuerySchema), listRefunds);
router.get('/:id', validateRequest(refundParamSchema), getRefund);
router.post('/', validateRequest(createRefundSchema), createRefund);

module.exports = router;
