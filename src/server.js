const app = require('./app');
const config = require('./config/env');
const logger = require('./utils/logger');

const startServer = async () => {
  try {
    app.listen(config.PORT, () => {
      logger.info(`Server is running in ${config.NODE_ENV} mode on port ${config.PORT}`);
      logger.info(`Health api is running at http://localhost:${config.PORT}/api/v1/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
