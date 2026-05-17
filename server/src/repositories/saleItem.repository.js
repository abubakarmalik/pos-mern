const { prisma } = require('../../config/prisma');

const createMany = (data, db = prisma) => db.sale_items.createMany({ data });

module.exports = { createMany };
