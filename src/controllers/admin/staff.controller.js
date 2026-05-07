const bcrypt = require('bcryptjs');
const prisma = require('../../config/prisma');
const logger = require('../../utils/logger');
const { formatDatesInObject } = require('../../utils/dateFormatter');

/**
 * @desc    Get all staff with optional filters
 * @route   GET /api/v1/admin/staff
 * @access  Private (Admin)
 */
exports.getAllStaff = async (req, res, next) => {
  try {
    const { staffId, name, email, assignedLocationId, status } = req.query;

    const where = {};

    if (staffId) {
      where.staffId = { contains: staffId, mode: 'insensitive' };
    }
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (email) {
      where.email = { contains: email, mode: 'insensitive' };
    }
    if (assignedLocationId) {
      where.assignedLocationId = parseInt(assignedLocationId);
    }
    if (status) {
      where.status = status;
    }

    const staff = await prisma.staff.findMany({
      where,
      include: {
        assignedLocation: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      count: staff.length,
      data: formatDatesInObject(staff)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new staff member
 * @route   POST /api/v1/admin/staff
 * @access  Private (Admin)
 */
exports.createStaff = async (req, res, next) => {
  try {
    const { staffId, name, email, assignedLocationId, password } = req.body;

    // Basic validation
    if (!staffId || !name || !assignedLocationId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide staffId, name, assignedLocationId and password'
      });
    }

    // Check if staffId already exists
    const existingStaff = await prisma.staff.findUnique({ where: { staffId } });
    if (existingStaff) {
      return res.status(400).json({
        success: false,
        message: 'A staff member with this Staff ID already exists'
      });
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await prisma.staff.findUnique({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'A staff member with this email already exists'
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const staff = await prisma.staff.create({
      data: {
        staffId,
        name,
        email,
        assignedLocationId: parseInt(assignedLocationId),
        passwordHash,
        status: 'ACTIVE'
      },
      include: {
        assignedLocation: true
      }
    });

    // Remove passwordHash from response
    delete staff.passwordHash;

    res.status(201).json({
      success: true,
      data: formatDatesInObject(staff)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update staff fields
 * @route   PATCH /api/v1/admin/staff/:id
 * @access  Private (Admin)
 */
exports.updateStaff = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If password is being updated, hash it
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(updateData.password, salt);
      delete updateData.password;
    }

    const staff = await prisma.staff.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        assignedLocation: true
      }
    });

    delete staff.passwordHash;

    res.status(200).json({
      success: true,
      data: formatDatesInObject(staff)
    });
  } catch (error) {
    // Handle Prisma record not found error or unique constraint
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }
    next(error);
  }
};

/**
 * @desc    Suspend staff (soft delete)
 * @route   DELETE /api/v1/admin/staff/:id
 * @access  Private (Admin)
 */
exports.suspendStaff = async (req, res, next) => {
  try {
    const { id } = req.params;

    const staff = await prisma.staff.update({
      where: { id: parseInt(id) },
      data: { status: 'SUSPENDED' }
    });

    res.status(200).json({
      success: true,
      message: `Staff member ${staff.staffId} has been suspended`,
      data: { id: staff.id, status: staff.status }
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }
    next(error);
  }
};
