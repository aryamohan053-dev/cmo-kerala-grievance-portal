const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// AI grievance assistant analysis endpoint
router.post('/analyze', aiController.analyzeGrievance);

module.exports = router;
