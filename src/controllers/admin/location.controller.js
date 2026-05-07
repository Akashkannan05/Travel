const prisma = require('../../config/prisma');
const logger = require('../../utils/logger');

/**
 * @desc    Get all locations with optional filtering
 * @route   GET /api/v1/admin/locations
 * @access  Private (Admin)
 */
exports.getAllLocations = async (req, res, next) => {
  try {
    const { search } = req.query;

    const where = {};

    if (search) {
      where.location = { contains: search, mode: 'insensitive' };
    }

    const locations = await prisma.location.findMany({
      where,
      orderBy: { location: 'asc' }
    });

    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    logger.error(`Error in getAllLocations: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Add a new location
 * @route   POST /api/v1/admin/locations
 * @access  Private (Admin)
 */
exports.addLocation = async (req, res, next) => {
  try {
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a location name'
      });
    }

    // Check if location already exists
    const existingLocation = await prisma.location.findUnique({
      where: { location }
    });

    if (existingLocation) {
      return res.status(400).json({
        success: false,
        message: 'This location already exists'
      });
    }

    const newLocation = await prisma.location.create({
      data: { location }
    });

    res.status(201).json({
      success: true,
      data: newLocation
    });
  } catch (error) {
    logger.error(`Error in addLocation: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Remove a location
 * @route   DELETE /api/v1/admin/locations/:id
 * @access  Private (Admin)
 */
exports.removeLocation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const locationId = parseInt(id);
    if (isNaN(locationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location ID'
      });
    }

    await prisma.location.delete({
      where: { id: locationId }
    });

    res.status(200).json({
      success: true,
      message: 'Location removed successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }
    logger.error(`Error in removeLocation: ${error.message}`);
    next(error);
  }
};
