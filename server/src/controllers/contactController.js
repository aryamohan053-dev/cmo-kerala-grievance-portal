const { query, run } = require('../database/db');

async function submitContact(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: 'All fields (name, email, subject, message) are required.' });
    }

    const result = run(`
      INSERT INTO contact_enquiries (name, email, subject, message, status)
      VALUES (?, ?, ?, ?, 'Pending')
    `, [name.trim(), email.trim().toLowerCase(), subject.trim(), message.trim()]);

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting the Chief Minister\'s Office. Your enquiry has been recorded with reference #ENQ-' + result.lastInsertRowid + '.'
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}

async function getContactEnquiries(req, res) {
  try {
    const enquiries = query(`
      SELECT * FROM contact_enquiries
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      enquiries
    });
  } catch (err) {
    console.error('Get enquiries error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}

module.exports = {
  submitContact,
  getContactEnquiries
};
