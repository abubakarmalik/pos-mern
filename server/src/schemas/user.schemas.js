const { z } = require('zod');

const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    username: z.string().min(1),
    password: z.string().min(6),
    role: z.enum(['ADMIN', 'CASHIER']),
  }),
});

const toggleUserSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

module.exports = { createUserSchema, toggleUserSchema };
