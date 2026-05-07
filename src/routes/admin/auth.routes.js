const express = require('express');
const authController = require('../../controllers/admin/auth.controller');
const { loginLimiter } = require('../../middlewares/rateLimit.middleware');

const router = express.Router();

/**
 * @swagger
 * /admin/auth/login:
 *   post:
 *     summary: Login for admin staff
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', loginLimiter, authController.login);
/**
 * @swagger
 * /admin/auth/refresh:
 *   post:
 *     summary: Refresh access token for admin
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */
router.post('/refresh', authController.refreshToken);

module.exports = router;
