const morgan = require('morgan');

const Logger = require('./logging');

const stream = {
  write: (message) => Logger.http(message),
};

const morganMiddleware = morgan(':method - URL: :url - STATUS: :status - Response time: :response-time ms', { stream });

module.exports = morganMiddleware;
