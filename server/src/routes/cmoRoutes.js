const express = require('express');
const router = express.Router();
const cmoController = require('../controllers/cmoController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// All CMO routes require cmo_admin role
router.use(authenticateToken, requireRole('cmo_admin'));

router.get('/stats', cmoController.getDashboardStats);
router.get('/analytics', cmoController.getAnalytics);
router.get('/grievances', cmoController.listGrievances);
router.post('/grievances/:id/assign', cmoController.forwardToDepartment);
router.patch('/grievances/:id/status', cmoController.updateGrievanceStatus);
router.post('/grievances/:id/escalate', cmoController.escalateGrievance);

module.exports = router;
