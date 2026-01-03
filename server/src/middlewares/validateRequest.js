const { ZodError } = require('zod');
const { sendError } = require('../utils/response');

const validateRequest = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    req.validated = parsed;
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      const details = error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      return sendError(res, 400, 'Validation failed', details);
    }
    return next(error);
  }
};

module.exports = validateRequest;
