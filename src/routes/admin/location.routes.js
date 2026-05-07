const express = require('express');
const locationController = require('../../controllers/admin/location.controller');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin Locations
 *   description: Location management for administrators
 */

/**
 * @swagger
 * /admin/locations:
 *   get:
 *     summary: Get all locations (Public)
 *     tags: [Admin Locations]
 *     responses:
 *       200:
 *         description: List of locations
 */
router.get('/', locationController.getAllLocations);

// Protect following routes and restrict to Admin
router.use(protect);
router.use(restrictTo('Admin'));

/**
 * @swagger
 * /admin/locations:
 *   post:
 *     summary: Add a new location
 *     tags: [Admin Locations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *             properties:
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Location added successfully
 */
router.post('/', locationController.addLocation);

/**
 * @swagger
 * /admin/locations/{id}:
 *   delete:
 *     summary: Remove a location
 *     tags: [Admin Locations]
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
 *         description: Location removed successfully
 */
router.delete('/:id', locationController.removeLocation);

module.exports = router;
