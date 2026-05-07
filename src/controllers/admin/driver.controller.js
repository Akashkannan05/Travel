const prisma = require('../../config/prisma');
const logger = require('../../utils/logger');
const { formatDatesInObject } = require('../../utils/dateFormatter');

/**
 * @desc    Get all drivers with optional filters
 * @route   GET /api/v1/admin/drivers
 * @access  Private (Admin)
 */
exports.getAllDrivers = async (req, res, next) => {
  try {
    const { name, phoneNumber } = req.query;

    const where = {};

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (phoneNumber) {
      where.phoneNumber = { contains: phoneNumber, mode: 'insensitive' };
    }

    const drivers = await prisma.driver.findMany({
      where,
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true
        // status is excluded here
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      count: drivers.length,
      data: formatDatesInObject(drivers)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new driver
 * @route   POST /api/v1/admin/drivers
 * @access  Private (Admin)
 */
exports.createDriver = async (req, res, next) => {
  try {
    const { name, phoneNumber } = req.body;

    if (!name || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide driver name and phone number'
      });
    }

    const existingDriver = await prisma.driver.findUnique({ where: { phoneNumber } });
    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: 'A driver with this phone number already exists'
      });
    }

    const driver = await prisma.driver.create({
      data: {
        name,
        phoneNumber,
        status: 'ACTIVE'
      }
    });

    res.status(201).json({
      success: true,
      data: formatDatesInObject(driver)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update driver fields
 * @route   PATCH /api/v1/admin/drivers/:id
 * @access  Private (Admin)
 */
exports.updateDriver = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const driver = await prisma.driver.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.status(200).json({
      success: true,
      data: formatDatesInObject(driver)
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    next(error);
  }
};

/**
 * @desc    Suspend driver (soft delete)
 * @route   DELETE /api/v1/admin/drivers/:id
 * @access  Private (Admin)
 */
exports.suspendDriver = async (req, res, next) => {
  try {
    const { id } = req.params;

    const driver = await prisma.driver.update({
      where: { id: parseInt(id) },
      data: { status: 'SUSPENDED' }
    });

    res.status(200).json({
      success: true,
      message: `Driver ${driver.name} has been suspended`,
      data: { id: driver.id, status: driver.status }
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    next(error);
  }
};
