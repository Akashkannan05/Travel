const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger'); // assumes you have this logger

const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

prisma.$connect()
  .then(() => {
    logger.info('Connected to PostgreSQL Database via Prisma successfully.');
  })
  .catch((err) => {
    logger.error('Failed to connect to the Database:', err);
  });

module.exports = prisma;
