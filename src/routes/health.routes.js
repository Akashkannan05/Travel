const express = require('express');
const { checkHealth } = require('../controllers/health.controller');

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 */
router.get('/health', checkHealth);

module.exports = router;
