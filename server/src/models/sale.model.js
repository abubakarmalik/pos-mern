const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    nameSnapshot: String,
    skuSnapshot: String,
    unitSnapshot: String,
    qty: Number,
    costPriceCentsSnapshot: Number,
    salePriceCentsSnapshot: Number,
    taxRateSnapshot: Number,
    lineDiscountCents: { type: Number, default: 0 },
    lineSubtotalCents: Number,
    taxCents: Number,
    lineTotalCents: Number,
  },
  { _id: false },
);

const saleSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, unique: true },
    cashierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [saleItemSchema],
    subtotalCents: Number,
    lineDiscountTotalCents: Number,
    cartDiscountCents: { type: Number, default: 0 },
    discountTotalCents: Number,
    taxTotalCents: Number,
    totalCents: Number,
    paymentMethod: { type: String, enum: ['CASH', 'CARD'] },
    cashReceivedCents: { type: Number },
    changeDueCents: { type: Number },
    status: { type: String, enum: ['COMPLETED', 'REFUNDED'], default: 'COMPLETED' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Sale', saleSchema);
