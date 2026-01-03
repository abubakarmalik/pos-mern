const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema(
  {
    dateKey: { type: String, unique: true },
    seq: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Counter', counterSchema);
