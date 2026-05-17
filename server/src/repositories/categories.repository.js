const { prisma } = require('../../config/prisma');
const { getPaginationParams } = require('../utils/pagination');

const buildWhere = ({ search, isActive } = {}) => {
  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (isActive !== undefined) {
    where.is_active = isActive;
  }

  return where;
};

const findManyPaginated = async (query = {}) => {
  const { page, limit, skip } = getPaginationParams(query);
  const where = buildWhere(query);
  const [items, total] = await prisma.$transaction([
    prisma.categories.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip,
      take: limit,
    }),
    prisma.categories.count({ where }),
  ]);

  return { items, page, limit, total };
};

const findById = (id) => prisma.categories.findUnique({ where: { id } });

const findByNameInsensitive = (name) =>
  prisma.categories.findFirst({
    where: { name: { equals: name.trim(), mode: 'insensitive' } },
  });

const create = (data) => prisma.categories.create({ data });

const update = (id, data) =>
  prisma.categories.update({
    where: { id },
    data,
  });

module.exports = {
  create,
  findById,
  findByNameInsensitive,
  findManyPaginated,
  update,
};
