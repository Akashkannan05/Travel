const rateLimit = require('express-rate-limit');

// Rate limiting middleware specifically for login to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per `window` (here, per 1 minute)
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 1 minute',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = {
  loginLimiter,
};
