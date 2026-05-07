const express = require('express');
const authController = require('../../controllers/staff/auth.controller');
const { loginLimiter } = require('../../middlewares/rateLimit.middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Staff Auth
 *   description: Authentication for staff members
 */

/**
 * @swagger
 * /staff/auth/login:
 *   post:
 *     summary: Login for staff members
 *     tags: [Staff Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - staffId
 *               - password
 *             properties:
 *               staffId:
 *                 type: string
 *                 example: STF001
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         staffId:
 *                           type: string
 *                         role:
 *                           type: string
 */
router.post('/login', loginLimiter, authController.login);

/**
 * @swagger
 * /staff/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Staff Auth]
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
