const { z } = require('zod');

const refundSchema = z.object({
  body: z.object({
    saleId: z.string().min(1),
    reason: z.string().min(1),
  }),
});

module.exports = { refundSchema };
