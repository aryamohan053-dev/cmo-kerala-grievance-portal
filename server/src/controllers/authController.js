const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, get, run } = require('../database/db');
const { JWT_SECRET } = require('../middleware/auth');

async function register(req, res) {
  try {
    const { name, email, password, phone, district } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
    }

    // Check existing
    const existing = get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing) {
      return res.status(409).json({ success: false, error: 'An account with this email address already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = run(`
      INSERT INTO users (name, email, password_hash, role, phone, district)
      VALUES (?, ?, ?, 'citizen', ?, ?)
    `, [name.trim(), email.toLowerCase().trim(), passwordHash, phone || null, district || 'Thiruvananthapuram']);

    const user = get('SELECT id, name, email, role, phone, district, created_at FROM users WHERE id = ?', [result.lastInsertRowid]);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Citizen registration successful. Welcome to CM Kerala Grievance Portal.',
      token,
      user
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, error: 'Internal server error during registration.' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const user = get(`
      SELECT u.id, u.name, u.email, u.password_hash, u.role, u.phone, u.district, u.department_id, u.designation,
             d.code as department_code, d.name as department_name
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE LOWER(u.email) = ?
    `, [email.toLowerCase().trim()]);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials. Password incorrect.' });
    }

    delete user.password_hash;

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        department_id: user.department_id,
        department_code: user.department_code
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Internal server error during login.' });
  }
}

async function me(req, res) {
  try {
    const user = get(`
      SELECT u.id, u.name, u.email, u.role, u.phone, u.district, u.department_id, u.designation,
             d.code as department_code, d.name as department_name
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE u.id = ?
    `, [req.user.id]);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found.' });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error('Me endpoint error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}

module.exports = {
  register,
  login,
  me
};
