const express = require('express');
const staffController = require('../../controllers/admin/staff.controller');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Protect all routes under this router and restrict to Admin
router.use(protect);
router.use(restrictTo('Admin'));

/**
 * @swagger
 * components:
 *   schemas:
 *     Staff:
 *       type: object
 *       required:
 *         - staffId
 *         - name
 *         - assignedLocationId
 *       properties:
 *         id:
 *           type: integer
 *         staffId:
 *           type: string
 *           description: Unique identifier for staff
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         assignedLocationId:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, SUSPENDED]
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Admin Staff
 *   description: Staff management for administrators
 */

/**
 * @swagger
 * /admin/staff:
 *   get:
 *     summary: Get all staff
 *     tags: [Admin Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: staffId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, SUSPENDED]
 *     responses:
 *       200:
 *         description: List of staff
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Staff'
 * 
 *   post:
 *     summary: Create a new staff member (Signup for staff)
 *     tags: [Admin Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - staffId
 *               - name
 *               - assignedLocationId
 *               - password
 *             properties:
 *               staffId:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               assignedLocationId:
 *                 type: integer
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Staff created successfully
 */
router
  .route('/')
  .get(staffController.getAllStaff)
  .post(staffController.createStaff);

/**
 * @swagger
 * /admin/staff/{id}:
 *   patch:
 *     summary: Update staff details
 *     tags: [Admin Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Staff'
 *     responses:
 *       200:
 *         description: Staff updated successfully
 * 
 *   delete:
 *     summary: Suspend a staff member
 *     tags: [Admin Staff]
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
 *         description: Staff suspended successfully
 */
router
  .route('/:id')
  .patch(staffController.updateStaff)
  .delete(staffController.suspendStaff);

module.exports = router;
