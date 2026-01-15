const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    nameSnapshot: String,
    skuSnapshot: String,
    unitSnapshot: String,
    qty: Number,
    costPriceSnapshot: Number,
    salePriceSnapshot: Number,
    taxRateSnapshot: Number,
    lineDiscount: { type: Number, default: 0 },
    lineSubtotal: Number,
    tax: Number,
    lineTotal: Number,
  },
  { _id: false },
);

const saleSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, unique: true },
    cashierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [saleItemSchema],
    subtotal: Number,
    lineDiscountTotal: Number,
    cartDiscount: { type: Number, default: 0 },
    discountTotal: Number,
    taxTotal: Number,
    total: Number,
    paymentMethod: { type: String, enum: ['CASH', 'CARD'] },
    cashReceived: { type: Number },
    changeDue: { type: Number },
    status: { type: String, enum: ['COMPLETED', 'REFUNDED'], default: 'COMPLETED' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Sale', saleSchema);
