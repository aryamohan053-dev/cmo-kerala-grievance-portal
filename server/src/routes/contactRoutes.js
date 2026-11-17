const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.post('/', contactController.submitContact);
router.get('/', authenticateToken, requireRole('cmo_admin'), contactController.getContactEnquiries);

module.exports = router;
