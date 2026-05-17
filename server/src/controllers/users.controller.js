const bcrypt = require('bcrypt');
const { prisma } = require('../../config/prisma');
const { sendSuccess, sendError } = require('../utils/response');
const { mapUser } = require('../utils/userMapper');

const createUser = async (req, res, next) => {
  try {
    const { name, username, password, role } = req.validated.body;
    const normalizedUsername = username.trim().toLowerCase();
    const existing = await prisma.users.findUnique({
      where: { username: normalizedUsername },
    });
    if (existing)
      return sendError(res, 409, 'Username already in use', {
        code: 'DUPLICATE_USERNAME',
        details: { username: normalizedUsername },
      });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        name,
        username: normalizedUsername,
        password_hash: passwordHash,
        role,
      },
    });
    return sendSuccess(res, mapUser(user), 'User created', 201);
  } catch (error) {
    if (error.code === 'P2002')
      return sendError(res, 409, 'Username already in use', {
        code: 'DUPLICATE_USERNAME',
        details: { fields: error.meta?.target || ['username'] },
      });
    return next(error);
  }
};

const listUsers = async (_req, res, next) => {
  try {
    const users = await prisma.users.findMany({
      orderBy: { created_at: 'desc' },
    });
    return sendSuccess(res, users.map(mapUser), 'Users fetched');
  } catch (error) {
    return next(error);
  }
};

const toggleUser = async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const user = await prisma.users.findUnique({
      where: { id },
    });
    if (!user)
      return sendError(res, 404, 'User not found', {
        code: 'USER_NOT_FOUND',
        details: { id },
      });
    const updatedUser = await prisma.users.update({
      where: { id },
      data: { is_active: !user.is_active },
    });
    return sendSuccess(
      res,
      {
        id: updatedUser.id,
        isActive: updatedUser.is_active,
      },
      updatedUser.is_active ? 'User enabled' : 'User disabled',
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = { createUser, listUsers, toggleUser };
