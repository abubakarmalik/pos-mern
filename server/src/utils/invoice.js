const Counter = require('../models/counter.model');

const formatInvoiceNo = (dateKey, seq) =>
  `POS-${dateKey}-${String(seq).padStart(4, '0')}`;

const getNextInvoiceNo = async (session, date = new Date()) => {
  const dateKey = date.toISOString().slice(0, 10).replace(/-/g, '');
  const counter = await Counter.findOneAndUpdate(
    { dateKey },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, session },
  );
  return formatInvoiceNo(dateKey, counter.seq);
};

module.exports = { getNextInvoiceNo, formatInvoiceNo };
