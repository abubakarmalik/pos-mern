const { z } = require('zod');

const loginSchema = z.object({
  body: z.object({
    username: z.string().min(1),
    password: z.string().min(6),
  }),
});

module.exports = { loginSchema };
