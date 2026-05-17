const { z } = require('zod');

const booleanQuery = z
  .enum(['true', 'false'])
  .optional()
  .transform((value) => {
    if (value === undefined) return undefined;
    return value === 'true';
  });

const paginationQuery = {
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
};

const categoryQuerySchema = z.object({
  query: z.object({
    ...paginationQuery,
    search: z.string().optional(),
    isActive: booleanQuery,
  }),
});

const categoryParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

const categoryBody = z.object({
  name: z.string().trim().min(1),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

const createCategorySchema = z.object({ body: categoryBody });

const updateCategorySchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: categoryBody.partial(),
});

const toggleCategorySchema = categoryParamSchema;

module.exports = {
  categoryParamSchema,
  categoryQuerySchema,
  createCategorySchema,
  toggleCategorySchema,
  updateCategorySchema,
};
