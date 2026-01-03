const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    shopName: { type: String, default: 'My Shop' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    currencySymbol: { type: String, default: '$' },
    allowNegativeStock: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Setting', settingSchema);
