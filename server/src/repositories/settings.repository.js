const { prisma } = require('../../config/prisma');

const SETTINGS_ID = 1;

const find = (db = prisma) =>
  db.settings.findUnique({
    where: { id: SETTINGS_ID },
  });

const create = (data) =>
  prisma.settings.create({
    data: {
      id: SETTINGS_ID,
      ...data,
    },
  });

const update = (data) =>
  prisma.settings.update({
    where: { id: SETTINGS_ID },
    data,
  });

module.exports = { SETTINGS_ID, create, find, update };
