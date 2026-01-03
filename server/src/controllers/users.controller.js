const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { sendSuccess, sendError } = require('../utils/response');

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.validated.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return sendError(res, 400, 'Email already in use');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
    });
    return sendSuccess(res, {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
  } catch (error) {
    return next(error);
  }
};

const listUsers = async (_req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return sendSuccess(
      res,
      users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      })),
    );
  } catch (error) {
    return next(error);
  }
};

const toggleUser = async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const user = await User.findById(id);
    if (!user) return sendError(res, 404, 'User not found');
    user.isActive = !user.isActive;
    await user.save();
    return sendSuccess(res, {
      id: user._id.toString(),
      isActive: user.isActive,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createUser, listUsers, toggleUser };
