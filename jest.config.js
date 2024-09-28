const path = require('path');

module.exports = {
  setupFiles: [
    path.resolve(__dirname, process.env.NODE_ENV === 'production' ? '.env.production' : '.env'),
  ],
  testEnvironment: 'node',
};