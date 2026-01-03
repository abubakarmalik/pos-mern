const dotenv = require('dotenv');

dotenv.config();

const env = {
  PORT: process.env.PORT || 8080,
  MONGODB_URL: process.env.MONGODB_URL || process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};

module.exports = env;
