const express = require('express');
const vehicleController = require('../../controllers/admin/vehicle.controller');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(restrictTo('Admin'));

/**
 * @swagger
 * tags:
 *   name: Admin Vehicles
 *   description: Vehicle management for administrators
 */

/**
 * @swagger
 * /admin/vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Admin Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vehicles
 *   post:
 *     summary: Create a new vehicle
 *     tags: [Admin Vehicles]
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
 *               - vehicleNumber
 *             properties:
 *               name:
 *                 type: string
 *               vehicleNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 */
router
  .route('/')
  .get(vehicleController.getAllVehicles)
  .post(vehicleController.createVehicle);

/**
 * @swagger
 * /admin/vehicles/{id}:
 *   patch:
 *     summary: Update vehicle details
 *     tags: [Admin Vehicles]
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
 *         description: Vehicle updated successfully
 *   delete:
 *     summary: Deactivate a vehicle
 *     tags: [Admin Vehicles]
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
 *         description: Vehicle deactivated successfully
 */
router
  .route('/:id')
  .patch(vehicleController.updateVehicle)
  .delete(vehicleController.deactivateVehicle);

module.exports = router;
