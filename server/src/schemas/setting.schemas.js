const { z } = require('zod');

const updateSettingSchema = z.object({
  body: z.object({
    shopName: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    currencySymbol: z.string().optional(),
    allowNegativeStock: z.boolean().optional(),
  }),
});

module.exports = { updateSettingSchema };
