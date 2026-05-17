const bcrypt = require('bcrypt');
const { prisma } = require('../../config/prisma');
const { mapUser } = require('../utils/userMapper');

const normalizeUsername = (username) => username.trim().toLowerCase();

const createServiceError = (message, errorCode, status, details = null) =>
  Object.assign(new Error(message), { status, errorCode, details });

const createUser = async ({ name, username, password, role }) => {
  const normalizedUsername = normalizeUsername(username);
  const existing = await prisma.users.findUnique({
    where: { username: normalizedUsername },
  });

  if (existing) {
    throw createServiceError('Username already in use', 'DUPLICATE_USERNAME', 409, {
      username: normalizedUsername,
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.users.create({
    data: {
      name,
      username: normalizedUsername,
      password_hash: passwordHash,
      role,
    },
  });

  return mapUser(user);
};

const listUsers = async () => {
  const users = await prisma.users.findMany({
    orderBy: { created_at: 'desc' },
  });
  return users.map(mapUser);
};

const toggleUser = async (id) => {
  const user = await prisma.users.findUnique({
    where: { id },
  });

  if (!user) {
    throw createServiceError('User not found', 'USER_NOT_FOUND', 404, { id });
  }

  const updatedUser = await prisma.users.update({
    where: { id },
    data: { is_active: !user.is_active },
  });

  return {
    id: updatedUser.id,
    isActive: updatedUser.is_active,
  };
};

module.exports = { createUser, listUsers, toggleUser };
