const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['ADMIN', 'CASHIER'],
      default: 'CASHIER',
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
