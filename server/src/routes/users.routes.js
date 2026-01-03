const express = require('express');
const { createUser, listUsers, toggleUser } = require('../controllers/users.controller');
const { requireAuth, requireRole } = require('../middlewares/auth');
const validateRequest = require('../middlewares/validateRequest');
const { createUserSchema, toggleUserSchema } = require('../schemas/user.schemas');

const router = express.Router();

router.use(requireAuth, requireRole('ADMIN'));

router.post('/', validateRequest(createUserSchema), createUser);
router.get('/', listUsers);
router.patch('/:id/toggle', validateRequest(toggleUserSchema), toggleUser);

module.exports = router;
