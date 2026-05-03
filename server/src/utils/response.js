const DEFAULT_ERROR_CODES = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'VALIDATION_ERROR',
  500: 'INTERNAL_SERVER_ERROR',
};

const getDefaultErrorCode = (statusCode) =>
  DEFAULT_ERROR_CODES[statusCode] || 'REQUEST_FAILED';

const normalizeError = (statusCode, error) => {
  if (error && typeof error === 'object' && !Array.isArray(error)) {
    return {
      code: error.code || getDefaultErrorCode(statusCode),
      details: error.details ?? null,
    };
  }

  return {
    code: getDefaultErrorCode(statusCode),
    details: error ?? null,
  };
};

const sendSuccess = (
  res,
  data = null,
  message = 'Request completed successfully',
  statusCode = 200,
) =>
  res.status(statusCode).json({
    success: true,
    data: data ?? null,
    message,
    error: null,
  });

const sendError = (
  res,
  statusCode = 500,
  message = 'Request failed',
  error = null,
) =>
  res.status(statusCode).json({
    success: false,
    data: null,
    message,
    error: normalizeError(statusCode, error),
  });

module.exports = { sendSuccess, sendError };
