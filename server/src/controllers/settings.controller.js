const Setting = require('../models/setting.model');
const { sendSuccess } = require('../utils/response');

const getSettings = async (_req, res, next) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({});
    }
    return sendSuccess(res, setting);
  } catch (error) {
    return next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) setting = await Setting.create({});

    Object.assign(setting, req.validated.body);
    await setting.save();

    return sendSuccess(res, setting);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getSettings, updateSettings };
