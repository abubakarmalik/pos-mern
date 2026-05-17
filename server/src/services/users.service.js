const bcrypt = require('bcrypt');
const usersRepository = require('../repositories/users.repository');
const { mapUser } = require('../utils/userMapper');

const normalizeUsername = (username) => username.trim().toLowerCase();

const createServiceError = (message, errorCode, status, details = null) =>
  Object.assign(new Error(message), { status, errorCode, details });

const createUser = async ({ name, username, password, role }) => {
  const normalizedUsername = normalizeUsername(username);
  const existing = await usersRepository.findByUsername(normalizedUsername);

  if (existing) {
    throw createServiceError('Username already in use', 'DUPLICATE_USERNAME', 409, {
      username: normalizedUsername,
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await usersRepository.create({
    name,
    username: normalizedUsername,
    password_hash: passwordHash,
    role,
  });

  return mapUser(user);
};

const listUsers = async () => {
  const users = await usersRepository.findMany();
  return users.map(mapUser);
};

const toggleUser = async (id) => {
  const user = await usersRepository.findById(id);

  if (!user) {
    throw createServiceError('User not found', 'USER_NOT_FOUND', 404, { id });
  }

  const updatedUser = await usersRepository.update(id, {
    is_active: !user.is_active,
  });

  return {
    id: updatedUser.id,
    isActive: updatedUser.is_active,
  };
};

module.exports = { createUser, listUsers, toggleUser };
