const { z } = require('zod');

const booleanQuery = z
  .enum(['true', 'false'])
  .optional()
  .transform((value) => {
    if (value === undefined) return undefined;
    return value === 'true';
  });

const productQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    search: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    categoryName: z.string().optional(),
    isActive: booleanQuery,
    lowStock: booleanQuery,
  }),
});

const productParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

const productBody = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  barcode: z.string().trim().max(128).optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
  categoryName: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  costPrice: z.number().min(0),
  salePrice: z.number().min(0),
  taxRate: z.number().min(0).default(0),
  unit: z.string().optional().default('pcs'),
  minStock: z.number().min(0).optional().nullable(),
  stockOnHand: z.number().optional(),
  isActive: z.boolean().optional(),
});

const createProductSchema = z.object({ body: productBody });

const updateProductSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: productBody.partial(),
});

const toggleProductSchema = productParamSchema;

module.exports = {
  createProductSchema,
  productParamSchema,
  productQuerySchema,
  updateProductSchema,
  toggleProductSchema,
};
