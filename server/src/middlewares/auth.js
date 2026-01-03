const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const User = require('../models/user.model');
const { sendError } = require('../utils/response');

const extractToken = (req) => {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  if (!/^Bearer$/i.test(scheme)) return null;
  return token;
};

const signToken = (user) =>
  jwt.sign(
    { id: user._id.toString(), role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN || '7d' },
  );

const requireAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return sendError(res, 401, 'Unauthorized');

    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user || !user.isActive)
      return sendError(res, 401, 'Unauthorized');

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return next();
  } catch (error) {
    return sendError(res, 401, 'Unauthorized', error.message);
  }
};

const requireRole = (roles) => (req, res, next) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!req.user) return sendError(res, 401, 'Unauthorized');
  if (!allowed.includes(req.user.role))
    return sendError(res, 403, 'Forbidden');
  return next();
};

module.exports = { requireAuth, requireRole, signToken };
