const express = require('express');
const courierController = require('../../controllers/staff/courier.controller');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');

const router = express.Router();

// All routes here require login and staff role
router.use(protect);
router.use(restrictTo('Staff'));

router.get('/locations', courierController.getLocations);

/**
 * @swagger
 * components:
 *   schemas:
 *     Courier:
 *       type: object
 *       required:
 *         - destination
 *         - customerName
 *         - phoneNumber
 *         - productDescription
 *         - weight
 *         - paymentMethod
 *         - deadlineDate
 *         - cashMethod
 *         - totalAmount
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         staffId:
 *           type: integer
 *           description: ID of the staff who created the courier
 *         origin:
 *           type: string
 *           description: Origin location (filled from staff location)
 *         destination:
 *           type: string
 *           description: Destination location
 *         customerName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phoneNumber:
 *           type: string
 *         productDescription:
 *           type: string
 *         isFragile:
 *           type: boolean
 *         weight:
 *           type: number
 *         status:
 *           type: string
 *           enum: [PENDING, INPLACE, SHIPPING, DELIVERED]
 *         paymentMethod:
 *           type: string
 *           enum: [PRE_PAYMENT, POST_PAYMENT, HALF_PAYMENT]
 *         deadlineDate:
 *           type: string
 *           format: date
 *           description: Expected deadline date (YYYY-MM-DD)
 *         cashMethod:
 *           type: string
 *           enum: [CASH, ONLINE]
 *         totalAmount:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Couriers
 *   description: Courier management for staff
 */

/**
 * @swagger
 * /staff/couriers:
 *   post:
 *     summary: Create a new courier
 *     tags: [Couriers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - destination
 *               - customerName
 *               - phoneNumber
 *               - productDescription
 *               - weight
 *               - paymentMethod
 *               - deadlineDate
 *               - cashMethod
 *               - totalAmount
 *             properties:
 *               destination:
 *                 type: string
 *               customerName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               productDescription:
 *                 type: string
 *               weight:
 *                 type: number
 *               isFragile:
 *                 type: boolean
 *               paymentMethod:
 *                 type: string
 *                 enum: [PRE_PAYMENT, POST_PAYMENT, HALF_PAYMENT]
 *               deadlineDate:
 *                 type: string
 *                 format: date
 *               cashMethod:
 *                 type: string
 *                 enum: [CASH, ONLINE]
 *               totalAmount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Courier created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Courier'
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 */
router.post('/', courierController.createCourier);

/**
 * @swagger
 * /staff/couriers:
 *   get:
 *     summary: Get all couriers for the logged in staff (Manage Bookings)
 *     tags: [Couriers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, In place, Shipping, Sent, Incoming, Received]
 *         description: Filter by status category
 *     responses:
 *       200:
 *         description: List of couriers based on filters and staff location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Courier'
 */
router.get('/', courierController.getCouriers);

/**
 * @swagger
 * /staff/couriers/{id}/ship:
 *   patch:
 *     summary: Ship a courier (Move to SHIPPING status)
 *     tags: [Couriers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Courier ID
 *     responses:
 *       200:
 *         description: Courier shipped successfully
 *       400:
 *         description: Invalid status for shipping (must be INPLACE/PENDING)
 *       403:
 *         description: Location mismatch (must originate from staff location)
 *       404:
 *         description: Courier not found
 */
router.patch('/:id/ship', courierController.shipCourier);

/**
 * @swagger
 * /staff/couriers/{id}/receive:
 *   patch:
 *     summary: Receive a courier (Move to DELIVERED status)
 *     tags: [Couriers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Courier ID
 *     responses:
 *       200:
 *         description: Courier received successfully
 *       400:
 *         description: Invalid status for receiving (must be SHIPPING)
 *       403:
 *         description: Destination mismatch (must be destined for staff location)
 *       404:
 *         description: Courier not found
 */
router.patch('/:id/receive', courierController.receiveCourier);

module.exports = router;
