const prisma = require('../../config/prisma');
const logger = require('../../utils/logger');
const { formatDatesInObject } = require('../../utils/dateFormatter');

/**
 * @desc    Get all vehicles with optional filters
 * @route   GET /api/v1/admin/vehicles
 * @access  Private (Admin)
 */
exports.getAllVehicles = async (req, res, next) => {
  try {
    const { name, vehicleNumber } = req.query;

    const where = {};

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (vehicleNumber) {
      where.vehicleNumber = { contains: vehicleNumber, mode: 'insensitive' };
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      select: {
        id: true,
        name: true,
        vehicleNumber: true,
        createdAt: true,
        updatedAt: true
        // status is excluded here
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: formatDatesInObject(vehicles)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new vehicle
 * @route   POST /api/v1/admin/vehicles
 * @access  Private (Admin)
 */
exports.createVehicle = async (req, res, next) => {
  try {
    const { name, vehicleNumber } = req.body;

    if (!name || !vehicleNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide vehicle name and vehicle number'
      });
    }

    const existingVehicle = await prisma.vehicle.findUnique({ where: { vehicleNumber } });
    if (existingVehicle) {
      return res.status(400).json({
        success: false,
        message: 'A vehicle with this vehicle number already exists'
      });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        name,
        vehicleNumber,
        status: 'WORKING'
      }
    });

    res.status(201).json({
      success: true,
      data: formatDatesInObject(vehicle)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update vehicle fields
 * @route   PATCH /api/v1/admin/vehicles/:id
 * @access  Private (Admin)
 */
exports.updateVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const vehicle = await prisma.vehicle.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.status(200).json({
      success: true,
      data: formatDatesInObject(vehicle)
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    next(error);
  }
};

/**
 * @desc    Deactivate vehicle (soft delete)
 * @route   DELETE /api/v1/admin/vehicles/:id
 * @access  Private (Admin)
 */
exports.deactivateVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vehicle = await prisma.vehicle.update({
      where: { id: parseInt(id) },
      data: { status: 'NOT_WORKING' }
    });

    res.status(200).json({
      success: true,
      message: `Vehicle ${vehicle.vehicleNumber} status set to NOT_WORKING`,
      data: { id: vehicle.id, status: vehicle.status }
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    next(error);
  }
};
