const { z } = require('zod');

const adjustInventorySchema = z.object({
  body: z.object({
    productId: z.string().min(1),
    qtyChange: z.number().int(),
    note: z.string().optional().nullable(),
  }),
});

const ledgerQuerySchema = z.object({
  query: z.object({
    productId: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
  }),
});

module.exports = { adjustInventorySchema, ledgerQuerySchema };
