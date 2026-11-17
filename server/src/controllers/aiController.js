const { analyzeGrievanceText } = require('../services/aiService');

async function analyzeGrievance(req, res) {
  try {
    const { subject = '', description = '', district = '' } = req.body;

    if (!description && !subject) {
      return res.status(400).json({
        success: false,
        error: 'Please provide either a subject or a detailed complaint description for AI analysis.'
      });
    }

    const analysis = await analyzeGrievanceText(subject, description, district);

    res.json({
      success: true,
      analysis
    });
  } catch (err) {
    console.error('AI analysis controller error:', err);
    res.status(500).json({
      success: false,
      error: 'AI analysis encountered an error. You may still submit the grievance manually.'
    });
  }
}

module.exports = {
  analyzeGrievance
};
