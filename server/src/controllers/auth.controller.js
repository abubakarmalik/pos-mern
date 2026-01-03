const User = require('../models/user.model');
const { signToken } = require('../middlewares/auth');
const { sendSuccess, sendError } = require('../utils/response');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.validated.body;
    const user = await User.findOne({ email: email.toLowerCase(), isActive: true });
    if (!user) return sendError(res, 401, 'Invalid credentials');

    const isValid = await user.comparePassword(password);
    if (!isValid) return sendError(res, 401, 'Invalid credentials');

    const token = signToken(user);
    return sendSuccess(res, {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res) => {
  return sendSuccess(res, { user: req.user });
};

module.exports = { login, me };
