const { z } = require('zod');

const refundItemSchema = z
  .object({
    saleItemId: z.string().uuid().optional(),
    productId: z.string().uuid().optional(),
    qty: z.number().positive(),
  })
  .refine((item) => item.saleItemId || item.productId, {
    message: 'saleItemId or productId is required',
    path: ['productId'],
  });

const createRefundSchema = z.object({
  body: z.object({
    saleId: z.string().uuid(),
    reason: z.string().min(1),
    items: z.array(refundItemSchema).min(1).optional(),
  }),
});

const refundsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    search: z.string().optional(),
    saleId: z.string().uuid().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  }),
});

const refundParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

module.exports = {
  createRefundSchema,
  refundParamSchema,
  refundsQuerySchema,
  refundSchema: createRefundSchema,
};
