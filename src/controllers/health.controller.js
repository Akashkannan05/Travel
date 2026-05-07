const logger = require('../utils/logger');
const { formatDate } = require('../utils/dateFormatter');

const checkHealth = (req, res) => {
  logger.info('Health check endpoint hit');
  return res.status(200).json({
    status: 'success',
    message: 'Travel Agency API is running smoothly.',
    timestamp: formatDate(new Date())
  });
};

module.exports = { checkHealth };
