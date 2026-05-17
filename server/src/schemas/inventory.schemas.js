const { z } = require('zod');

const adjustInventorySchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
    qtyChange: z.number(),
    note: z.string().optional().nullable(),
  }),
});

const ledgerQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    productId: z.string().uuid().optional(),
    type: z.enum(['SALE', 'PURCHASE', 'REFUND', 'ADJUSTMENT']).optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    search: z.string().optional(),
  }),
});

module.exports = { adjustInventorySchema, ledgerQuerySchema };
