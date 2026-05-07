const express = require('express');
const driverController = require('../../controllers/admin/driver.controller');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(restrictTo('Admin'));

/**
 * @swagger
 * tags:
 *   name: Admin Drivers
 *   description: Driver management for administrators
 */

/**
 * @swagger
 * /admin/drivers:
 *   get:
 *     summary: Get all drivers
 *     tags: [Admin Drivers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of drivers
 *   post:
 *     summary: Create a new driver
 *     tags: [Admin Drivers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phoneNumber
 *             properties:
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Driver created successfully
 */
router
  .route('/')
  .get(driverController.getAllDrivers)
  .post(driverController.createDriver);

/**
 * @swagger
 * /admin/drivers/{id}:
 *   patch:
 *     summary: Update driver details
 *     tags: [Admin Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Driver updated successfully
 *   delete:
 *     summary: Suspend a driver
 *     tags: [Admin Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Driver suspended successfully
 */
router
  .route('/:id')
  .patch(driverController.updateDriver)
  .delete(driverController.suspendDriver);

module.exports = router;
