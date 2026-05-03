const express = require('express');
const { login, logout, me } = require('../controllers/auth.controller');
const validateRequest = require('../middlewares/validateRequest');
const { loginSchema } = require('../schemas/auth.schemas');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

router.post('/login', validateRequest(loginSchema), login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);

module.exports = router;
