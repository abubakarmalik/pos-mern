const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settings.controller');
const { requireAuth, requireRole } = require('../middlewares/auth');
const validateRequest = require('../middlewares/validateRequest');
const { updateSettingSchema } = require('../schemas/setting.schemas');

const router = express.Router();

router.use(requireAuth);

router.get('/', getSettings);
router.patch('/', requireRole('ADMIN'), validateRequest(updateSettingSchema), updateSettings);

module.exports = router;
