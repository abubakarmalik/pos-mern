const { z } = require('zod');

const saleItemSchema = z.object({
  productId: z.string().min(1),
  qty: z.number().int().min(1),
  lineDiscountCents: z.number().int().min(0).optional().default(0),
});

const createSaleSchema = z.object({
  body: z.object({
    items: z.array(saleItemSchema).min(1),
    cartDiscountCents: z.number().int().min(0).optional().default(0),
    paymentMethod: z.enum(['CASH', 'CARD']),
    cashReceivedCents: z.number().int().min(0).optional().nullable(),
  }),
});

const salesQuerySchema = z.object({
  query: z.object({
    from: z.string().optional(),
    to: z.string().optional(),
    cashierId: z.string().optional(),
  }),
});

const saleParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

module.exports = { createSaleSchema, salesQuerySchema, saleParamSchema };
