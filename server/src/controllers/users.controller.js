const { sendSuccess, sendError } = require('../utils/response');
const usersService = require('../services/users.service');

const handleServiceError = (res, error) =>
  sendError(res, error.status, error.message, {
    code: error.errorCode,
    details: error.details,
  });

const createUser = async (req, res, next) => {
  try {
    const user = await usersService.createUser(req.validated.body);
    return sendSuccess(res, user, 'User created', 201);
  } catch (error) {
    if (error.code === 'P2002')
      return sendError(res, 409, 'Username already in use', {
        code: 'DUPLICATE_USERNAME',
        details: { fields: error.meta?.target || ['username'] },
      });
    if (error.errorCode) return handleServiceError(res, error);
    return next(error);
  }
};

const listUsers = async (_req, res, next) => {
  try {
    const users = await usersService.listUsers();
    return sendSuccess(res, users, 'Users fetched');
  } catch (error) {
    return next(error);
  }
};

const toggleUser = async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const user = await usersService.toggleUser(id);
    return sendSuccess(
      res,
      user,
      user.isActive ? 'User enabled' : 'User disabled',
    );
  } catch (error) {
    if (error.errorCode) return handleServiceError(res, error);
    return next(error);
  }
};

module.exports = { createUser, listUsers, toggleUser };
