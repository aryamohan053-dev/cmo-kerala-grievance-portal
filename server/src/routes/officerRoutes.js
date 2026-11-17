const express = require('express');
const router = express.Router();
const officerController = require('../controllers/officerController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All officer routes require department_officer role
router.use(authenticateToken, requireRole('department_officer'));

router.get('/grievances', officerController.getDepartmentGrievances);
router.patch('/grievances/:id/investigate', officerController.updateInvestigation);
router.post('/grievances/:id/action-report', upload.single('report_attachment'), officerController.submitActionTakenReport);

module.exports = router;
