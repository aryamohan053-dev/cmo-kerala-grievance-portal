-- CMO Kerala Public Grievance Redressal Portal Database Schema

PRAGMA foreign_keys = ON;

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    nodal_email TEXT,
    phone TEXT,
    sla_days INTEGER DEFAULT 14,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table (Citizens, CMO Admins, Department Officers)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('citizen', 'cmo_admin', 'department_officer')),
    phone TEXT,
    district TEXT,
    department_id INTEGER REFERENCES departments(id),
    designation TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Grievances Table
CREATE TABLE IF NOT EXISTS grievances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference_no TEXT UNIQUE NOT NULL,
    citizen_id INTEGER NOT NULL REFERENCES users(id),
    district TEXT NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    category TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK(priority IN ('Low', 'Medium', 'High', 'Urgent')),
    status TEXT NOT NULL DEFAULT 'Submitted' CHECK(status IN ('Submitted', 'Under Review', 'In Progress', 'Resolved', 'Reopened')),
    assigned_officer_id INTEGER REFERENCES users(id),
    ai_summary TEXT,
    ai_suggested_dept TEXT,
    ai_suggested_priority TEXT,
    ai_duplicate_flag INTEGER DEFAULT 0,
    ai_duplicate_ref TEXT,
    cmo_remarks TEXT,
    officer_action_report TEXT,
    resolved_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Grievance Status History Table (Full Audit Trail)
CREATE TABLE IF NOT EXISTS grievance_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    grievance_id INTEGER NOT NULL REFERENCES grievances(id) ON DELETE CASCADE,
    from_status TEXT,
    to_status TEXT NOT NULL,
    action TEXT NOT NULL,
    remarks TEXT,
    performed_by_id INTEGER REFERENCES users(id),
    performed_by_name TEXT,
    performed_by_role TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Department Assignments Table
CREATE TABLE IF NOT EXISTS department_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    grievance_id INTEGER NOT NULL REFERENCES grievances(id) ON DELETE CASCADE,
    department_id INTEGER NOT NULL REFERENCES departments(id),
    assigned_by_id INTEGER NOT NULL REFERENCES users(id),
    instructions TEXT,
    target_resolution_date DATE,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Attachments Table
CREATE TABLE IF NOT EXISTS attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    grievance_id INTEGER REFERENCES grievances(id) ON DELETE CASCADE,
    uploaded_by_id INTEGER REFERENCES users(id),
    attachment_type TEXT DEFAULT 'citizen_evidence' CHECK(attachment_type IN ('citizen_evidence', 'officer_report', 'cmo_attachment')),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    mime_type TEXT,
    file_size INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Citizen Feedback Table
CREATE TABLE IF NOT EXISTS citizen_feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    grievance_id INTEGER UNIQUE NOT NULL REFERENCES grievances(id) ON DELETE CASCADE,
    citizen_id INTEGER NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
    feedback_text TEXT,
    is_satisfied INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Contact Enquiries Table
CREATE TABLE IF NOT EXISTS contact_enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'Answered', 'Archived')),
    response TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_grievances_ref ON grievances(reference_no);
CREATE INDEX IF NOT EXISTS idx_grievances_citizen ON grievances(citizen_id);
CREATE INDEX IF NOT EXISTS idx_grievances_dept ON grievances(department_id);
CREATE INDEX IF NOT EXISTS idx_grievances_status ON grievances(status);
CREATE INDEX IF NOT EXISTS idx_grievances_district ON grievances(district);
CREATE INDEX IF NOT EXISTS idx_history_grievance ON grievance_history(grievance_id);
