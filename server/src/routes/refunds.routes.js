const express = require('express');
const { createRefund } = require('../controllers/refunds.controller');
const { requireAuth, requireRole } = require('../middlewares/auth');
const validateRequest = require('../middlewares/validateRequest');
const { refundSchema } = require('../schemas/refund.schemas');

const router = express.Router();

router.use(requireAuth, requireRole('ADMIN'));

router.post('/', validateRequest(refundSchema), createRefund);

module.exports = router;
