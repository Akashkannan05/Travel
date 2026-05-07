const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config/env');
const prisma = require('../../config/prisma');

const signAccessToken = (payload) => {
  return jwt.sign(payload, config.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '1d', // Short-lived access token
  });
};

const signRefreshToken = (payload) => {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET || 'fallback_refresh_key', {
    expiresIn: '7d', // Long-lived refresh token
  });
};

exports.login = async (req, res, next) => {
  try {
    const { staffId, password } = req.body;

    if (!staffId || !password) {
      return res.status(400).json({ success: false, message: 'Staff ID and password are required' });
    }

    // Fetch Staff from Database
    const staff = await prisma.staff.findUnique({ where: { staffId } });

    if (!staff) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check account status
    if (staff.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact the administrator.'
      });
    }

    if (staff.status === 'INACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Your account is currently inactive. Please contact the administrator.'
      });
    }

    // Validate password using bcrypt
    const isMatch = await bcrypt.compare(password, staff.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Issue JWT tokens upon success
    const accessToken = signAccessToken({ id: staff.id, role: 'Staff' });
    const refreshToken = signRefreshToken({ id: staff.id, role: 'Staff' });

    res.status(200).json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: { id: staff.id, staffId: staff.staffId, role: 'Staff' },
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    jwt.verify(
      refreshToken, 
      config.JWT_REFRESH_SECRET || 'fallback_refresh_key', 
      (err, decoded) => {
        if (err || decoded.role !== 'Staff') {
          return res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
        }

        // Generate a new access token
        const accessToken = signAccessToken({ id: decoded.id, role: decoded.role });
        
        res.status(200).json({
          success: true,
          data: {
             accessToken
          }
        });
      }
    );
  } catch (error) {
    next(error);
  }
};
