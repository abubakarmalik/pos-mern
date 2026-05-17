const clampPositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const getPaginationParams = (query = {}) => {
  const page = clampPositiveInt(query.page, 1);
  const limit = Math.min(clampPositiveInt(query.limit, 20), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const buildPagination = ({ page, limit, total }) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

module.exports = { buildPagination, getPaginationParams };
