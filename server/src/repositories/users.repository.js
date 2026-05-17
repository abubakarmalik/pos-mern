const { prisma } = require('../../config/prisma');

const findById = (id) => prisma.users.findUnique({ where: { id } });

const findByUsername = (username) =>
  prisma.users.findUnique({ where: { username } });

const create = (data) => prisma.users.create({ data });

const findMany = () =>
  prisma.users.findMany({
    orderBy: { created_at: 'desc' },
  });

const update = (id, data) =>
  prisma.users.update({
    where: { id },
    data,
  });

module.exports = {
  create,
  findById,
  findByUsername,
  findMany,
  update,
};
