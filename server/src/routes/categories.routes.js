const express = require('express');
const {
  createCategory,
  getCategory,
  listCategories,
  toggleCategory,
  updateCategory,
} = require('../controllers/categories.controller');
const { requireAuth, requireRole } = require('../middlewares/auth');
const validateRequest = require('../middlewares/validateRequest');
const {
  categoryParamSchema,
  categoryQuerySchema,
  createCategorySchema,
  toggleCategorySchema,
  updateCategorySchema,
} = require('../schemas/category.schemas');

const router = express.Router();

router.use(requireAuth);

router.get('/', validateRequest(categoryQuerySchema), listCategories);
router.get('/:id', validateRequest(categoryParamSchema), getCategory);
router.post('/', requireRole('ADMIN'), validateRequest(createCategorySchema), createCategory);
router.patch('/:id', requireRole('ADMIN'), validateRequest(updateCategorySchema), updateCategory);
router.patch('/:id/toggle', requireRole('ADMIN'), validateRequest(toggleCategorySchema), toggleCategory);

module.exports = router;
