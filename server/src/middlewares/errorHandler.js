const { sendError } = require('../utils/response');

const errorHandler = (err, _req, res, _next) => {
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let code = err.errorCode;
  let details = err.details || err.errors || null;

  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation failed';
    code = 'VALIDATION_ERROR';
    details = Object.values(err.errors || {}).map((error) => ({
      path: error.path,
      message: error.message,
    }));
  }

  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid identifier';
    code = 'INVALID_ID';
    details = { path: err.path, value: err.value };
  }

  if (err.code === 11000) {
    status = 409;
    message = 'Duplicate value';
    code = 'DUPLICATE_VALUE';
    details = { fields: Object.keys(err.keyValue || {}) };
  }

  if (status >= 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal server error';
    details = null;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  return sendError(res, status, message, { code, details });
};

module.exports = errorHandler;
