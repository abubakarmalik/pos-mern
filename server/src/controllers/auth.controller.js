const bcrypt = require('bcrypt');
const { prisma } = require('../../config/prisma');
const { signToken } = require('../middlewares/auth');
const { sendSuccess, sendError } = require('../utils/response');
const { mapUser } = require('../utils/userMapper');

const login = async (req, res, next) => {
  try {
    const { username, password } = req.validated.body;
    const normalizedUsername = username.trim().toLowerCase();
    const user = await prisma.users.findUnique({
      where: { username: normalizedUsername },
    });
    if (!user)
      return sendError(res, 401, 'Invalid username or password', {
        code: 'INVALID_CREDENTIALS',
        details: null,
      });

    if (!user.is_active)
      return sendError(res, 401, 'Invalid username or password', {
        code: 'INVALID_CREDENTIALS',
        details: null,
      });

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid)
      return sendError(res, 401, 'Invalid username or password', {
        code: 'INVALID_CREDENTIALS',
        details: null,
      });

    const token = signToken(user);
    return sendSuccess(
      res,
      {
        token,
        user: mapUser(user),
      },
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
