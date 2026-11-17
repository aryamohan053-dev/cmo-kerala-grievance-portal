const { query, get, run } = require('../database/db');

async function getDepartmentGrievances(req, res) {
  try {
    const departmentId = req.user.department_id;
    if (!departmentId) {
      return res.status(403).json({ success: false, error: 'Officer is not associated with any department.' });
    }

    const { status, priority, search } = req.query;

    let sql = `
      SELECT g.*, 
             u.name as citizen_name, u.phone as citizen_phone, u.district as citizen_district,
             d.name as department_name, d.code as department_code,
             da.instructions as cmo_instructions, da.target_resolution_date,
             (SELECT COUNT(*) FROM attachments WHERE grievance_id = g.id) as attachment_count
      FROM grievances g
      JOIN users u ON g.citizen_id = u.id
      JOIN departments d ON g.department_id = d.id
      LEFT JOIN department_assignments da ON g.id = da.grievance_id
      WHERE g.department_id = ?
    `;
    const params = [departmentId];

    if (status) {
      sql += ' AND g.status = ?';
      params.push(status);
    }
    if (priority) {
      sql += ' AND g.priority = ?';
      params.push(priority);
    }
    if (search) {
      sql += ' AND (g.reference_no LIKE ? OR g.subject LIKE ? OR g.description LIKE ? OR u.name LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY g.created_at DESC';

    const grievances = query(sql, params);

    // Compute department stats
    const stats = {
      totalAssigned: grievances.length,
      inProgress: grievances.filter(g => g.status === 'In Progress').length,
      underReview: grievances.filter(g => g.status === 'Under Review').length,
      resolved: grievances.filter(g => g.status === 'Resolved').length,
      reopened: grievances.filter(g => g.status === 'Reopened').length,
      urgent: grievances.filter(g => g.priority === 'Urgent').length
    };

    res.json({
      success: true,
      stats,
      grievances
    });
  } catch (err) {
    console.error('Officer grievances error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}

async function updateInvestigation(req, res) {
  try {
    const { id } = req.params;
    const { remarks, status } = req.body;

    const grievance = get('SELECT * FROM grievances WHERE id = ?', [id]);
    if (!grievance) {
      return res.status(404).json({ success: false, error: 'Grievance not found.' });
    }

    if (grievance.department_id !== req.user.department_id) {
      return res.status(403).json({ success: false, error: 'Grievance does not belong to your department.' });
    }

    const nextStatus = status || grievance.status;

    run(`
      UPDATE grievances
      SET status = ?,
          assigned_officer_id = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [nextStatus, req.user.id, id]);

    run(`
      INSERT INTO grievance_history (
        grievance_id, from_status, to_status, action, remarks, performed_by_id, performed_by_name, performed_by_role
      ) VALUES (?, ?, ?, 'Officer Investigation Update', ?, ?, ?, 'department_officer')
    `, [id, grievance.status, nextStatus, remarks || 'Officer updated investigation progress.', req.user.id, req.user.name]);

    res.json({
      success: true,
      message: 'Investigation progress updated successfully.'
    });
  } catch (err) {
    console.error('Update investigation error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}

async function submitActionTakenReport(req, res) {
  try {
    const { id } = req.params;
    const { action_taken, resolution_summary, mark_resolved = true } = req.body;

    if (!action_taken && !resolution_summary) {
      return res.status(400).json({ success: false, error: 'Action-Taken Report details are required.' });
    }

    const grievance = get('SELECT * FROM grievances WHERE id = ?', [id]);
    if (!grievance) {
      return res.status(404).json({ success: false, error: 'Grievance not found.' });
    }

    if (grievance.department_id !== req.user.department_id) {
      return res.status(403).json({ success: false, error: 'Grievance does not belong to your department.' });
    }

    const combinedReport = `[Action Taken]: ${action_taken}\n[Resolution]: ${resolution_summary || 'Action completed as per standard operating protocol.'}`;
    const targetStatus = mark_resolved === true || mark_resolved === 'true' ? 'Resolved' : 'In Progress';

    run(`
      UPDATE grievances
      SET officer_action_report = ?,
          status = ?,
          assigned_officer_id = ?,
          resolved_at = ${targetStatus === 'Resolved' ? 'CURRENT_TIMESTAMP' : 'NULL'},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [combinedReport, targetStatus, req.user.id, id]);

    // Handle file upload if attached
    if (req.file) {
      run(`
        INSERT INTO attachments (
          grievance_id, uploaded_by_id, attachment_type, file_name, file_path, mime_type, file_size
        ) VALUES (?, ?, 'officer_report', ?, ?, ?, ?)
      `, [
        id,
        req.user.id,
        req.file.originalname,
        `/uploads/${req.file.filename}`,
        req.file.mimetype,
        req.file.size
      ]);
    }

    run(`
      INSERT INTO grievance_history (
        grievance_id, from_status, to_status, action, remarks, performed_by_id, performed_by_name, performed_by_role
      ) VALUES (?, ?, ?, 'Action Taken Report (ATR) Submitted', ?, ?, ?, 'department_officer')
    `, [
      id,
      grievance.status,
      targetStatus,
      `Action-Taken Report submitted by ${req.user.name}. ${targetStatus === 'Resolved' ? 'Petition resolved.' : 'Interim report submitted.'}`,
      req.user.id,
      req.user.name
    ]);

    res.json({
      success: true,
      message: `Action-Taken Report submitted successfully. Status is now ${targetStatus}.`
    });
  } catch (err) {
    console.error('Submit ATR error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}

module.exports = {
  getDepartmentGrievances,
  updateInvestigation,
  submitActionTakenReport
};
