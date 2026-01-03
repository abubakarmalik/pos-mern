const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./users.routes');
const productRoutes = require('./products.routes');
const inventoryRoutes = require('./inventory.routes');
const salesRoutes = require('./sales.routes');
const refundRoutes = require('./refunds.routes');
const reportRoutes = require('./reports.routes');
const settingRoutes = require('./settings.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/sales', salesRoutes);
router.use('/refunds', refundRoutes);
router.use('/reports', reportRoutes);
router.use('/settings', settingRoutes);

module.exports = router;
