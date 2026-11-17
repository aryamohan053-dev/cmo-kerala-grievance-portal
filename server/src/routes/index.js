const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const grievanceRoutes = require('./grievanceRoutes');
const cmoRoutes = require('./cmoRoutes');
const officerRoutes = require('./officerRoutes');
const departmentRoutes = require('./departmentRoutes');
const contactRoutes = require('./contactRoutes');
const aiRoutes = require('./aiRoutes');

router.use('/auth', authRoutes);
router.use('/grievances', grievanceRoutes);
router.use('/cmo', cmoRoutes);
router.use('/officer', officerRoutes);
router.use('/departments', departmentRoutes);
router.use('/contact', contactRoutes);
router.use('/ai', aiRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'CM Kerala Public Grievance Redressal Portal API',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
