const prisma = require('../../config/prisma');
const logger = require('../../utils/logger');
const { formatDatesInObject } = require('../../utils/dateFormatter');

/**
 * @desc    Create a new courier
 * @route   POST /api/v1/staff/couriers
 * @access  Private (Staff)
 */
exports.createCourier = async (req, res, next) => {
  try {
    const {
      destination,
      customerName,
      email,
      phoneNumber,
      productDescription,
      isFragile,
      weight,
      paymentMethod,
      deadlineDate,
      cashMethod,
      totalAmount
    } = req.body;

    // Basic validation for required fields
    if (!destination || !customerName || !phoneNumber || !productDescription || weight === undefined || !paymentMethod || !deadlineDate || !cashMethod || totalAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: destination, customerName, phoneNumber, productDescription, weight, paymentMethod, deadlineDate, cashMethod, totalAmount'
      });
    }

    // 1) Get logged in staff details
    // req.user is set by the protect middleware
    const staff = await prisma.staff.findUnique({
      where: { id: req.user.id },
      include: { assignedLocation: true }
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    // 2) Fill staff details and origin
    const staffId = staff.id; // Int id for the relation
    const origin = staff.assignedLocation.location;

    // 3) Create Courier
    const courier = await prisma.courier.create({
      data: {
        staffId,
        origin,
        destination,
        customerName,
        email,
        phoneNumber,
        productDescription,
        isFragile: isFragile || false,
        weight: parseFloat(weight),
        status: 'INPLACE', // Default status
        paymentMethod,
        deadlineDate: new Date(deadlineDate),
        cashMethod,
        totalAmount: parseFloat(totalAmount)
      },
      include: {
        staff: {
          select: {
            staffId: true,
            name: true,
            email: true,
            assignedLocation: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: formatDatesInObject(courier)
    });
  } catch (error) {
    logger.error(`Error creating courier: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get all couriers for the logged in staff with optional status filter
 * @route   GET /api/v1/staff/couriers
 * @access  Private (Staff)
 */
exports.getCouriers = async (req, res, next) => {
  try {
    const { status } = req.query;
    const staffId = req.user.id;

    // 1) Fetch staff assigned location
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      include: { assignedLocation: true }
    });

    if (!staff || !staff.assignedLocation) {
      return res.status(404).json({
        success: false,
        message: 'Staff or assigned location not found'
      });
    }

    const locationString = staff.assignedLocation.location;
    let where = {};

    // 2) Build where clause based on filters
    const filter = status ? status.toUpperCase().replace(/\s/g, '') : 'ALL';

    switch (filter) {
      case 'INPLACE':
        where = {
          status: 'INPLACE',
          origin: locationString
        };
        break;
      case 'SHIPPING':
        where = {
          status: 'SHIPPING',
          origin: locationString
        };
        break;
      case 'INCOMING':
        where = {
          status: { in: ['SHIPPING', 'INPLACE'] },
          destination: locationString
        };
        break;
      case 'RECEIVED':
        where = {
          status: 'DELIVERED',
          destination: locationString
        };
        break;
      case 'SENT':
        where = {
          status: 'DELIVERED',
          origin: locationString
        };
        break;
      case 'ALL':
      default:
        where = {
          OR: [
            { origin: locationString },
            { destination: locationString }
          ]
        };
        break;
    }

    const couriers = await prisma.courier.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        staff: {
          select: {
            name: true,
            staffId: true,
            assignedLocation: {
              select: {
                location: true
              }
            }
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      count: couriers.length,
      data: formatDatesInObject(couriers)
    });
  } catch (error) {
    logger.error(`Error fetching couriers: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Ship a courier (Change status from INPLACE/PENDING to SHIPPING)
 * @route   PATCH /api/v1/staff/couriers/:id/ship
 * @access  Private (Staff)
 */
exports.shipCourier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const staffId = req.user.id;

    // 1) Get staff assigned location
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      include: { assignedLocation: true }
    });

    if (!staff || !staff.assignedLocation) {
      return res.status(404).json({ success: false, message: 'Staff or assigned location not found' });
    }

    const staffLocation = staff.assignedLocation.location;

    // 2) Find the courier
    const courier = await prisma.courier.findUnique({
      where: { id: parseInt(id) }
    });

    if (!courier) {
      return res.status(404).json({ success: false, message: 'Courier not found' });
    }

    // 3) Verify origin matches staff assigned location
    if (courier.origin !== staffLocation) {
      return res.status(403).json({
        success: false,
        message: 'You can only ship couriers that originate from your assigned location'
      });
    }

    // 4) Verify current status is INPLACE or PENDING
    if (!['INPLACE', 'PENDING'].includes(courier.status)) {
      return res.status(400).json({
        success: false,
        message: `Courier status must be INPLACE or PENDING to be shipped. Current status: ${courier.status}`
      });
    }

    // 5) Update status to SHIPPING
    const updatedCourier = await prisma.courier.update({
      where: { id: parseInt(id) },
      data: { status: 'SHIPPING' }
    });

    res.status(200).json({
      success: true,
      message: 'Courier is now in shipping',
      data: formatDatesInObject(updatedCourier)
    });
  } catch (error) {
    logger.error(`Error shipping courier: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Receive a courier (Change status from SHIPPING to DELIVERED)
 * @route   PATCH /api/v1/staff/couriers/:id/receive
 * @access  Private (Staff)
 */
exports.receiveCourier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const staffId = req.user.id;

    // 1) Get staff assigned location
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      include: { assignedLocation: true }
    });

    if (!staff || !staff.assignedLocation) {
      return res.status(404).json({ success: false, message: 'Staff or assigned location not found' });
    }

    const staffLocation = staff.assignedLocation.location;

    // 2) Find the courier
    const courier = await prisma.courier.findUnique({
      where: { id: parseInt(id) }
    });

    if (!courier) {
      return res.status(404).json({ success: false, message: 'Courier not found' });
    }

    // 3) Verify destination matches staff assigned location
    if (courier.destination !== staffLocation) {
      return res.status(403).json({
        success: false,
        message: 'You can only receive couriers that are destined for your assigned location'
      });
    }

    // 4) Verify current status is SHIPPING
    if (courier.status !== 'SHIPPING') {
      return res.status(400).json({
        success: false,
        message: `Courier status must be SHIPPING to be delivered. Current status: ${courier.status}`
      });
    }

    // 5) Update status to DELIVERED
    const updatedCourier = await prisma.courier.update({
      where: { id: parseInt(id) },
      data: { status: 'DELIVERED' }
    });

    res.status(200).json({
      success: true,
      message: 'Courier has been delivered successfully',
      data: formatDatesInObject(updatedCourier)
    });
  } catch (error) {
    logger.error(`Error receiving courier: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get all locations for courier booking
 * @route   GET /api/v1/staff/couriers/locations
 * @access  Private (Staff)
 */
exports.getLocations = async (req, res, next) => {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { location: 'asc' }
    });

    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    logger.error(`Error fetching locations for staff: ${error.message}`);
    next(error);
  }
};
