const jwt = require('jsonwebtoken');
const config = require('../config/env');
const prisma = require('../config/prisma');
const logger = require('../utils/logger');

/**
 * Middleware to protect routes and ensure user is authenticated
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1) Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'You are not logged in. Please provide a token.'
      });
    }

    // 2) Verify token
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET || 'fallback_secret_key');

      // 3) Check if user still exists (Optional but recommended)
      let user;
      if (decoded.role === 'Admin') {
        user = await prisma.admin.findUnique({ where: { id: decoded.id } });
      } else if (decoded.role === 'Staff') {
        user = await prisma.staff.findUnique({ where: { id: decoded.id } });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'The user belonging to this token no longer exists.'
        });
      }

      // 4) Grant access to protected route
      req.user = user;
      req.user.role = decoded.role; // Store role for restriction middleware
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to restrict access based on roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action.'
      });
    }
    next();
  };
};

module.exports = {
  protect,
  restrictTo
};
