const { z } = require('zod');

const dateString = z
  .string()
  .refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: 'Invalid date',
  });

const reportQuerySchema = z
  .object({
    query: z.object({
      from: dateString.optional(),
      to: dateString.optional(),
      dateFrom: dateString.optional(),
      dateTo: dateString.optional(),
      cashierId: z.string().uuid().optional(),
      paymentMethod: z.enum(['CASH', 'CARD', 'BANK', 'JAZZCASH', 'EASYPAISA']).optional(),
      categoryId: z.string().uuid().optional(),
    }),
  })
  .superRefine(({ query }, ctx) => {
    const from = query.dateFrom || query.from;
    const to = query.dateTo || query.to;
    if (from && to && new Date(from) > new Date(to)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['query', 'dateTo'],
        message: 'dateTo must be after dateFrom',
      });
    }
  });

module.exports = { reportQuerySchema };
