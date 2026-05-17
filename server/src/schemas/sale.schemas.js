const { z } = require('zod');

const saleItemSchema = z.object({
  productId: z.string().uuid(),
  qty: z.number().positive(),
  lineDiscount: z.number().min(0).optional().default(0),
});

const createSaleSchema = z.object({
  body: z.object({
    items: z.array(saleItemSchema).min(1),
    cartDiscount: z.number().min(0).optional().default(0),
    paymentMethod: z.enum(['CASH', 'CARD', 'BANK', 'JAZZCASH', 'EASYPAISA']),
    cashReceived: z.number().min(0).optional().nullable(),
  }),
});

const salesQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    search: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    cashierId: z.string().uuid().optional(),
    paymentMethod: z.enum(['CASH', 'CARD', 'BANK', 'JAZZCASH', 'EASYPAISA']).optional(),
    status: z.enum(['COMPLETED', 'REFUNDED', 'VOID']).optional(),
  }),
});

const saleParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

module.exports = { createSaleSchema, salesQuerySchema, saleParamSchema };
