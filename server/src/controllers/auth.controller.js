const { sendSuccess } = require('../utils/response');
const { loginUser } = require('../services/auth.service');

const login = async (req, res, next) => {
  try {
    const authData = await loginUser(req.validated.body);
    return sendSuccess(
      res,
      authData,
      'Login successful',
    );
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res) => {
  return sendSuccess(res, { user: req.user }, 'Current user fetched');
};

const logout = async (_req, res) => {
  return sendSuccess(res, null, 'Logout successful');
};

module.exports = { login, logout, me };
