const { query } = require('../database/db');

async function getDepartments(req, res) {
  try {
    const departments = query(`
      SELECT d.*,
             (SELECT COUNT(*) FROM grievances WHERE department_id = d.id) as total_grievances,
             (SELECT COUNT(*) FROM grievances WHERE department_id = d.id AND status = 'Resolved') as resolved_grievances,
             (SELECT COUNT(*) FROM grievances WHERE department_id = d.id AND status NOT IN ('Resolved')) as pending_grievances,
             (SELECT name FROM users WHERE department_id = d.id AND role = 'department_officer' LIMIT 1) as officer_name,
             (SELECT designation FROM users WHERE department_id = d.id AND role = 'department_officer' LIMIT 1) as officer_designation
      FROM departments d
      ORDER BY d.id ASC
    `);

    res.json({
      success: true,
      departments
    });
  } catch (err) {
    console.error('Get departments error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}

module.exports = {
  getDepartments
};
