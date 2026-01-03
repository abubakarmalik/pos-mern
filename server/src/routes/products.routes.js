const express = require('express');
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  toggleProduct,
} = require('../controllers/products.controller');
const { requireAuth, requireRole } = require('../middlewares/auth');
const validateRequest = require('../middlewares/validateRequest');
const {
  createProductSchema,
  updateProductSchema,
  toggleProductSchema,
} = require('../schemas/product.schemas');

const router = express.Router();

router.use(requireAuth);

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', requireRole('ADMIN'), validateRequest(createProductSchema), createProduct);
router.patch('/:id', requireRole('ADMIN'), validateRequest(updateProductSchema), updateProduct);
router.patch('/:id/toggle', requireRole('ADMIN'), validateRequest(toggleProductSchema), toggleProduct);

module.exports = router;
