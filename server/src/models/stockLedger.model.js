const mongoose = require('mongoose');

const stockLedgerSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { type: String, enum: ['ADJUSTMENT', 'SALE', 'REFUND'], required: true },
    qtyChange: { type: Number, required: true },
    refType: { type: String, enum: ['ADJUSTMENT', 'SALE', 'REFUND'], required: true },
    refId: { type: mongoose.Schema.Types.ObjectId, required: true },
    note: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('StockLedger', stockLedgerSchema);
