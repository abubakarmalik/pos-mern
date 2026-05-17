const { sendSuccess } = require('../utils/response');
const settingsService = require('../services/settings.service');

const getSettings = async (_req, res, next) => {
  try {
    const settings = await settingsService.getSettings();
    return sendSuccess(res, settings, 'Settings fetched');
  } catch (error) {
    return next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const settings = await settingsService.updateSettings(req.validated.body);
    return sendSuccess(res, settings, 'Settings updated');
  } catch (error) {
    return next(error);
  }
};

module.exports = { getSettings, updateSettings };
