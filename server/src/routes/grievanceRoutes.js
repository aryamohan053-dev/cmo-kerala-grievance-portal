const express = require('express');
const router = express.Router();
const grievanceController = require('../controllers/grievanceController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public tracking by reference number (No login required)
router.get('/track/:ref', grievanceController.getPublicTrack);

// Citizen endpoints
router.post('/submit', authenticateToken, requireRole('citizen'), upload.single('attachment'), grievanceController.submitGrievance);
router.get('/my', authenticateToken, requireRole('citizen'), grievanceController.getCitizenGrievances);
router.post('/:id/feedback', authenticateToken, requireRole('citizen'), grievanceController.submitFeedback);
router.post('/:id/reopen', authenticateToken, requireRole('citizen'), grievanceController.reopenGrievance);

// Grievance detail by ID (Authorized roles: citizen owner, cmo_admin, assigned department_officer)
router.get('/:id', authenticateToken, grievanceController.getGrievanceById);

module.exports = router;
