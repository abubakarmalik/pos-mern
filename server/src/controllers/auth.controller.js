const User = require('../models/user.model');
const { signToken } = require('../middlewares/auth');
const { sendSuccess, sendError } = require('../utils/response');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.validated.body;
    const user = await User.findOne({ email: email.toLowerCase(), isActive: true });
    if (!user)
      return sendError(res, 401, 'Invalid email or password', {
        code: 'INVALID_CREDENTIALS',
        details: null,
      });

    const isValid = await user.comparePassword(password);
    if (!isValid)
      return sendError(res, 401, 'Invalid email or password', {
        code: 'INVALID_CREDENTIALS',
        details: null,
      });

    const token = signToken(user);
    return sendSuccess(
      res,
      {
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
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
