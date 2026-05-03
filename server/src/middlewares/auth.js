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
    if (!token)
      return sendError(res, 401, 'Authentication token is required', {
        code: 'AUTH_TOKEN_MISSING',
        details: null,
      });

    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user || !user.isActive)
      return sendError(res, 401, 'User is not authorized', {
        code: 'UNAUTHORIZED',
        details: null,
      });

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return next();
  } catch (error) {
    return sendError(res, 401, 'Invalid or expired token', {
      code: 'INVALID_TOKEN',
      details: error.message,
    });
  }
};

const requireRole = (roles) => (req, res, next) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!req.user)
    return sendError(res, 401, 'Authentication is required', {
      code: 'UNAUTHORIZED',
      details: null,
    });
  if (!allowed.includes(req.user.role))
    return sendError(res, 403, 'You do not have permission for this action', {
      code: 'FORBIDDEN',
      details: { allowedRoles: allowed, currentRole: req.user.role },
    });
  return next();
};

module.exports = { requireAuth, requireRole, signToken };
