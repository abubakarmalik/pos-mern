const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { sendError, sendSuccess } = require('./utils/response');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) =>
  sendSuccess(res, { ok: true }, 'Server is healthy'),
);
app.use('/api', routes);

app.use((_req, res) =>
  sendError(res, 404, 'Route not found', {
    code: 'NOT_FOUND',
    details: null,
  }),
);
app.use(errorHandler);

module.exports = app;
