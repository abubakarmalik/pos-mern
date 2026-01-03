const { sendError } = require('../utils/response');

const errorHandler = (err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  const errors = err.errors || undefined;
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }
  return sendError(res, status, message, errors);
};

module.exports = errorHandler;
