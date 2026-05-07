const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
