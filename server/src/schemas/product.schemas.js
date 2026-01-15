const { z } = require('zod');

const productBody = z.object({
  name: z.string().min(1),
  sku: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  costPrice: z.number().min(0),
  salePrice: z.number().min(0),
  taxRate: z.number().min(0).default(0),
  unit: z.string().optional().default('pcs'),
  minStock: z.number().int().min(0).optional().nullable(),
  stockOnHand: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

const createProductSchema = z.object({ body: productBody });

const updateProductSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: productBody.partial(),
});

const toggleProductSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

module.exports = { createProductSchema, updateProductSchema, toggleProductSchema };
