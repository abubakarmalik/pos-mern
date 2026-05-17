const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const { prisma } = require('../../config/prisma');
const { mapUser } = require('../utils/userMapper');

const normalizeUsername = (username) => username.trim().toLowerCase();

const getUserId = (user) => user.id || user._id?.toString();

const signToken = (user) =>
  jwt.sign(
    { id: getUserId(user), role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN || '7d' },
  );

const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET);

const createAuthError = (message, errorCode, status = 401, details = null) =>
  Object.assign(new Error(message), { status, errorCode, details });

const findActiveUserById = async (id) => {
  const user = await prisma.users.findUnique({ where: { id } });
  if (!user || !user.is_active) return null;
  return user;
};

const loginUser = async ({ username, password }) => {
  const user = await prisma.users.findUnique({
    where: { username: normalizeUsername(username) },
  });

  if (!user || !user.is_active) {
    throw createAuthError(
      'Invalid username or password',
      'INVALID_CREDENTIALS',
    );
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw createAuthError(
      'Invalid username or password',
      'INVALID_CREDENTIALS',
    );
  }

  return {
    token: signToken(user),
    user: mapUser(user),
  };
};

module.exports = {
  findActiveUserById,
  loginUser,
  signToken,
  verifyToken,
};
