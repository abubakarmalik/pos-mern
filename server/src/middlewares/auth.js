const { sendError } = require('../utils/response');
const { mapUser } = require('../utils/userMapper');
const {
  findActiveUserById,
  signToken,
  verifyToken,
} = require('../services/auth.service');

const extractToken = (req) => {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  if (!/^Bearer$/i.test(scheme)) return null;
  return token;
};

const requireAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token)
      return sendError(res, 401, 'Authentication token is required', {
        code: 'AUTH_TOKEN_MISSING',
        details: null,
      });

    const payload = verifyToken(token);
    const user = await findActiveUserById(payload.id);
    if (!user)
      return sendError(res, 401, 'User is not authorized', {
        code: 'UNAUTHORIZED',
        details: null,
      });

    req.user = mapUser(user);
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
