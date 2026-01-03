const sendSuccess = (res, data, message) =>
  res.json({ success: true, data, message });

const sendError = (res, statusCode, message, errors) =>
  res.status(statusCode).json({ success: false, message, errors });

module.exports = { sendSuccess, sendError };
