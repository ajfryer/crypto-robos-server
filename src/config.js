// environment variables from /.env
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL,
  AV_API_KEY: process.env.AV_API_KEY || null,
  SYMBOLS: ['BTC', 'ETH', 'LTC', 'XRP', 'XTZ', 'LINK', 'XMR'],
};
