const { query, get, run, transaction } = require('../database/db');
const { analyzeGrievanceText } = require('../services/aiService');

// Generate unique Kerala CMO reference ID
function generateReferenceNo() {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `KL-CMO-2026-${randomSuffix}`;
}

async function submitGrievance(req, res) {
  try {
    const {
      district,
      department_id,
      category,
      subject,
      description,
      priority = 'Medium',
      ai_summary,
      ai_suggested_dept,
      ai_suggested_priority,
      ai_duplicate_flag = 0,
      ai_duplicate_ref = null
    } = req.body;

    if (!district || !category || !subject || !description) {
      return res.status(400).json({
        success: false,
        error: 'District, category, subject, and detailed description are required.'
      });
    }

    const citizenId = req.user.id;
    let finalSummary = ai_summary;
    let finalDept = ai_suggested_dept;
    let finalPriority = priority;
    let duplicateFlag = parseInt(ai_duplicate_flag) || 0;
    let duplicateRef = ai_duplicate_ref;

    // If AI analysis was not pre-calculated on frontend, analyze now
    if (!finalSummary) {
      const aiResult = await analyzeGrievanceText(subject, description, district);
      finalSummary = aiResult.summary;
      finalDept = aiResult.suggestedDepartment;
      if (aiResult.duplicateCheck?.isDuplicate) {
        duplicateFlag = 1;
        duplicateRef = aiResult.duplicateCheck.matchedRef;
      }
    }

    // Generate unique reference number
    let referenceNo = generateReferenceNo();
    while (get('SELECT id FROM grievances WHERE reference_no = ?', [referenceNo])) {
      referenceNo = generateReferenceNo();
    }

    let parsedDeptId = department_id ? parseInt(department_id) : null;
    if (!parsedDeptId && finalDept) {
      // Find matching department by name or keyword
      const matchedDept = get('SELECT id FROM departments WHERE name LIKE ? OR code LIKE ?', [`%${finalDept}%`, `%${finalDept}%`]);
      if (matchedDept) {
        parsedDeptId = matchedDept.id;
      }
    }

    const result = run(`
      INSERT INTO grievances (
        reference_no, citizen_id, district, department_id, category, subject, description,
        priority, status, ai_summary, ai_suggested_dept, ai_suggested_priority,
        ai_duplicate_flag, ai_duplicate_ref
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', ?, ?, ?, ?, ?)
    `, [
      referenceNo,
      citizenId,
      district,
      parsedDeptId,
      category,
      subject.trim(),
      description.trim(),
      finalPriority,
      finalSummary || null,
      finalDept || null,
      ai_suggested_priority || finalPriority,
      duplicateFlag,
      duplicateRef
    ]);

    const grievanceId = result.lastInsertRowid;

    // Add initial status history
    run(`
      INSERT INTO grievance_history (
        grievance_id, from_status, to_status, action, remarks, performed_by_id, performed_by_name, performed_by_role
      ) VALUES (?, NULL, 'Submitted', 'Citizen Submitted', 'Grievance submitted successfully via CM Public Grievance Portal.', ?, ?, 'citizen')
    `, [grievanceId, req.user.id, req.user.name]);

    // Handle file upload if attached
    if (req.file) {
      run(`
        INSERT INTO attachments (
          grievance_id, uploaded_by_id, attachment_type, file_name, file_path, mime_type, file_size
        ) VALUES (?, ?, 'citizen_evidence', ?, ?, ?, ?)
      `, [
        grievanceId,
        citizenId,
        req.file.originalname,
        `/uploads/${req.file.filename}`,
        req.file.mimetype,
        req.file.size
      ]);
    }

    const createdGrievance = get(`
      SELECT g.*, d.name as department_name, d.code as department_code
      FROM grievances g
      LEFT JOIN departments d ON g.department_id = d.id
      WHERE g.id = ?
    `, [grievanceId]);

    res.status(201).json({
      success: true,
      message: 'Grievance registered successfully. Your petition has been forwarded to the Chief Minister\'s Office.',
      reference_no: referenceNo,
      grievance: createdGrievance
    });
  } catch (err) {
    console.error('Submit grievance error:', err);
    res.status(500).json({ success: false, error: 'Internal server error while registering grievance.' });
  }
}

async function getPublicTrack(req, res) {
  try {
    const { ref } = req.params;
    if (!ref) {
      return res.status(400).json({ success: false, error: 'Reference number is required.' });
    }

    const grievance = get(`
      SELECT g.*, 
             u.name as citizen_name, u.district as citizen_district,
             d.name as department_name, d.code as department_code, d.sla_days,
             o.name as officer_name, o.designation as officer_designation
      FROM grievances g
      JOIN users u ON g.citizen_id = u.id
      LEFT JOIN departments d ON g.department_id = d.id
      LEFT JOIN users o ON g.assigned_officer_id = o.id
      WHERE LOWER(g.reference_no) = ?
    `, [ref.toLowerCase().trim()]);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        error: `No grievance found with reference number "${ref}". Please verify the number and try again.`
      });
    }

    // Mask citizen details for public privacy
    grievance.citizen_name = grievance.citizen_name.replace(/^(.)(.*)(.)$/, '$1***$3');

    // Get audit trail history
    const history = query(`
      SELECT * FROM grievance_history
      WHERE grievance_id = ?
      ORDER BY created_at ASC, id ASC
    `, [grievance.id]);

    // Get attachments
    const attachments = query(`
      SELECT id, attachment_type, file_name, file_path, mime_type, file_size, created_at
      FROM attachments
      WHERE grievance_id = ?
    `, [grievance.id]);

    // Get feedback if any
    const feedback = get(`
      SELECT rating, feedback_text, is_satisfied, created_at
      FROM citizen_feedback
      WHERE grievance_id = ?
    `, [grievance.id]);

    res.json({
      success: true,
      grievance,
      history,
      attachments,
      feedback
    });
  } catch (err) {
    console.error('Public track error:', err);
    res.status(500).json({ success: false, error: 'Internal server error while tracking grievance.' });
  }
}

async function getCitizenGrievances(req, res) {
  try {
    const citizenId = req.user.id;

    const grievances = query(`
      SELECT g.*, d.name as department_name, d.code as department_code,
             (SELECT COUNT(*) FROM attachments WHERE grievance_id = g.id) as attachment_count,
             (SELECT rating FROM citizen_feedback WHERE grievance_id = g.id) as feedback_rating
      FROM grievances g
      LEFT JOIN departments d ON g.department_id = d.id
      WHERE g.citizen_id = ?
      ORDER BY g.created_at DESC
    `, [citizenId]);

    // Compute stats
    const stats = {
      total: grievances.length,
      submitted: grievances.filter(g => g.status === 'Submitted').length,
      underReview: grievances.filter(g => g.status === 'Under Review').length,
      inProgress: grievances.filter(g => g.status === 'In Progress').length,
      resolved: grievances.filter(g => g.status === 'Resolved').length,
      reopened: grievances.filter(g => g.status === 'Reopened').length
    };

    res.json({
      success: true,
      stats,
      grievances
    });
  } catch (err) {
    console.error('Get citizen grievances error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}

async function getGrievanceById(req, res) {
  try {
    const { id } = req.params;

    const grievance = get(`
      SELECT g.*, 
             u.name as citizen_name, u.email as citizen_email, u.phone as citizen_phone, u.district as citizen_district,
             d.name as department_name, d.code as department_code, d.sla_days, d.nodal_email as department_email,
             o.name as officer_name, o.designation as officer_designation, o.email as officer_email, o.phone as officer_phone
      FROM grievances g
      JOIN users u ON g.citizen_id = u.id
      LEFT JOIN departments d ON g.department_id = d.id
      LEFT JOIN users o ON g.assigned_officer_id = o.id
      WHERE g.id = ?
    `, [id]);

    if (!grievance) {
      return res.status(404).json({ success: false, error: 'Grievance not found.' });
    }

    // Role check: Citizen can only view own grievances
    if (req.user.role === 'citizen' && grievance.citizen_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized to view this grievance.' });
    }

    // Department officer can only view grievances assigned to their department
    if (req.user.role === 'department_officer' && grievance.department_id !== req.user.department_id) {
      return res.status(403).json({ success: false, error: 'Unauthorized. Grievance belongs to a different department.' });
    }

    const history = query(`
      SELECT * FROM grievance_history
      WHERE grievance_id = ?
      ORDER BY created_at ASC, id ASC
    `, [id]);

    const assignments = query(`
      SELECT da.*, d.name as department_name, u.name as assigned_by_name
      FROM department_assignments da
      JOIN departments d ON da.department_id = d.id
      JOIN users u ON da.assigned_by_id = u.id
      WHERE da.grievance_id = ?
      ORDER BY da.assigned_at DESC
    `, [id]);

    const attachments = query(`
      SELECT a.*, u.name as uploader_name
      FROM attachments a
      LEFT JOIN users u ON a.uploaded_by_id = u.id
      WHERE a.grievance_id = ?
      ORDER BY a.created_at ASC
    `, [id]);

    const feedback = get(`
      SELECT * FROM citizen_feedback
      WHERE grievance_id = ?
    `, [id]);

    res.json({
      success: true,
      grievance,
      history,
      assignments,
      attachments,
      feedback
    });
  } catch (err) {
    console.error('Get grievance by ID error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}

async function submitFeedback(req, res) {
  try {
    const { id } = req.params;
    const { rating, feedback_text, is_satisfied = 1 } = req.body;

    const grievance = get('SELECT id, citizen_id, status FROM grievances WHERE id = ?', [id]);
    if (!grievance) {
      return res.status(404).json({ success: false, error: 'Grievance not found.' });
    }

    if (grievance.citizen_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Only the petition owner can submit feedback.' });
    }

    if (grievance.status !== 'Resolved') {
      return res.status(400).json({ success: false, error: 'Feedback can only be submitted for resolved grievances.' });
    }

    const numericRating = parseInt(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be an integer between 1 and 5.' });
    }

    // Check if feedback already submitted
    const existing = get('SELECT id FROM citizen_feedback WHERE grievance_id = ?', [id]);
    if (existing) {
      run(`
        UPDATE citizen_feedback
        SET rating = ?, feedback_text = ?, is_satisfied = ?, created_at = CURRENT_TIMESTAMP
        WHERE grievance_id = ?
      `, [numericRating, feedback_text || '', is_satisfied ? 1 : 0, id]);
    } else {
      run(`
        INSERT INTO citizen_feedback (grievance_id, citizen_id, rating, feedback_text, is_satisfied)
        VALUES (?, ?, ?, ?, ?)
      `, [id, req.user.id, numericRating, feedback_text || '', is_satisfied ? 1 : 0]);
    }

    // Record in history
    run(`
      INSERT INTO grievance_history (
        grievance_id, from_status, to_status, action, remarks, performed_by_id, performed_by_name, performed_by_role
      ) VALUES (?, 'Resolved', 'Resolved', 'Citizen Feedback Submitted', ?, ?, ?, 'citizen')
    `, [id, `Citizen provided ${numericRating}/5 star rating. Note: ${feedback_text || 'No additional comment'}`, req.user.id, req.user.name]);

    res.json({
      success: true,
      message: 'Thank you for your valuable feedback. Your rating has been recorded.'
    });
  } catch (err) {
    console.error('Submit feedback error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}

async function reopenGrievance(req, res) {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    const grievance = get('SELECT id, citizen_id, status FROM grievances WHERE id = ?', [id]);
    if (!grievance) {
      return res.status(404).json({ success: false, error: 'Grievance not found.' });
    }

    if (grievance.citizen_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Only the petitioner can reopen this grievance.' });
    }

    if (grievance.status !== 'Resolved') {
      return res.status(400).json({ success: false, error: 'Only resolved grievances can be reopened.' });
    }

    run(`
      UPDATE grievances
      SET status = 'Reopened', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [id]);

    run(`
      INSERT INTO grievance_history (
        grievance_id, from_status, to_status, action, remarks, performed_by_id, performed_by_name, performed_by_role
      ) VALUES (?, 'Resolved', 'Reopened', 'Citizen Reopened Grievance', ?, ?, ?, 'citizen')
    `, [id, remarks || 'Citizen unsatisfied with resolution. Reopened for CMO re-investigation.', req.user.id, req.user.name]);

    res.json({
      success: true,
      message: 'Grievance has been successfully reopened and returned to CMO review.'
    });
  } catch (err) {
    console.error('Reopen grievance error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}

module.exports = {
  submitGrievance,
  getPublicTrack,
  getCitizenGrievances,
  getGrievanceById,
  submitFeedback,
  reopenGrievance
};
