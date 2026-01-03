const { z } = require('zod');

const reportQuerySchema = z.object({
  query: z.object({
    from: z.string().optional(),
    to: z.string().optional(),
  }),
});

module.exports = { reportQuerySchema };
