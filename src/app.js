const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const healthRoutes = require('./routes/health.routes');
const adminAuthRoutes = require('./routes/admin/auth.routes');
const adminStaffRoutes = require('./routes/admin/staff.routes');
const adminDriverRoutes = require('./routes/admin/driver.routes');
const adminVehicleRoutes = require('./routes/admin/vehicle.routes');
const adminLocationRoutes = require('./routes/admin/location.routes');
const staffAuthRoutes = require('./routes/staff/auth.routes');
const staffCourierRoutes = require('./routes/staff/courier.routes');
const setupSwagger = require('./config/swagger');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  hsts: false,
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/', healthRoutes);
app.use('/api/v1/admin/auth', adminAuthRoutes);
app.use('/api/v1/admin/staff', adminStaffRoutes);
app.use('/api/v1/admin/drivers', adminDriverRoutes);
app.use('/api/v1/admin/vehicles', adminVehicleRoutes);
app.use('/api/v1/admin/locations', adminLocationRoutes);
app.use('/api/v1/staff/auth', staffAuthRoutes);
app.use('/api/v1/staff/couriers', staffCourierRoutes);

// Swagger Documentation
setupSwagger(app);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
