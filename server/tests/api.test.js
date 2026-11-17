const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

let server;
const PORT = 5098;
const BASE_URL = `http://127.0.0.1:${PORT}/api`;

let citizenToken = '';
let cmoToken = '';
let officerToken = '';
let createdGrievanceRef = '';
let createdGrievanceId = null;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(PORT, '127.0.0.1', resolve);
  });
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('1. System Health Check', async () => {
  const res = await fetch(`${BASE_URL}/health`);
  const data = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(data.status, 'healthy');
  assert.ok(data.system.includes('CM Kerala'));
});

test('2. Public Departments Directory', async () => {
  const res = await fetch(`${BASE_URL}/departments`);
  const data = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(data.success, true);
  assert.ok(Array.isArray(data.departments));
  assert.ok(data.departments.length >= 8);
  const pwd = data.departments.find(d => d.code === 'PWD');
  assert.ok(pwd, 'PWD department exists');
  assert.ok(pwd.sla_days > 0);
});

test('3. Authentication & RBAC', async (t) => {
  await t.test('CMO Admin Login', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'cmo.admin@kerala.gov.in',
        password: 'Kerala@2026'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.role, 'cmo_admin');
    assert.ok(data.token);
    cmoToken = data.token;
  });

  await t.test('Department Officer Login', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'pwd.officer@kerala.gov.in',
        password: 'Kerala@2026'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.role, 'department_officer');
    assert.ok(data.token);
    officerToken = data.token;
  });

  await t.test('Citizen Login', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'citizen.narayanan@gmail.com',
        password: 'Kerala@2026'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.role, 'citizen');
    assert.ok(data.token);
    citizenToken = data.token;
  });

  await t.test('Citizen Registration', async () => {
    const testEmail = `citizen.test.${Date.now()}@example.com`;
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Arun Varma',
        email: testEmail,
        password: 'SecurePassword@123',
        phone: '+91 94471 99887',
        district: 'Kozhikode'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(data.success, true);
    assert.ok(data.token);
  });
});

test('4. AI Grievance Assistant API', async (t) => {
  await t.test('Classifies road hazard and suggests PWD + High priority', async () => {
    const res = await fetch(`${BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: 'Deep dangerous potholes on MC Road near Kottayam bypass',
        description: 'Severe potholes and asphalt erosion causing serious accidents to two-wheelers and pedestrians every day.',
        district: 'Kottayam'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.analysis.suggestedDepartment.includes('Public Works') || data.analysis.suggestedDepartmentCode === 'PWD');
    assert.ok(['High', 'Urgent'].includes(data.analysis.suggestedPriority));
    assert.ok(data.analysis.summary.length > 10);
  });

  await t.test('Duplicate Grievance Detection', async () => {
    const res = await fetch(`${BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: 'Potholes on Aluva Perumbavoor road near Marampally bridge',
        description: 'Road from Aluva to Perumbavoor near Marampally has deep potholes causing accidents for bikes.',
        district: 'Ernakulam'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.analysis.duplicateCheck.isDuplicate, true);
    assert.ok(data.analysis.duplicateCheck.matchedRef);
  });
});

test('5. End-to-End Mandatory Grievance Lifecycle Workflow', async (t) => {
  await t.test('Step 1: Citizen Submits Grievance', async () => {
    const res = await fetch(`${BASE_URL}/grievances/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${citizenToken}`
      },
      body: JSON.stringify({
        district: 'Kozhikode',
        category: 'Public Healthcare',
        subject: 'Shortage of snake venom antiserum at Taluk Hospital Koyilandy',
        description: 'Urgent intervention needed. Two farmers from coastal ward were admitted with viper bites yesterday and had to be shifted to medical college due to lack of antiserum vials.',
        priority: 'Urgent'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(data.success, true);
    assert.ok(data.reference_no.startsWith('KL-CMO-2026-'));
    createdGrievanceRef = data.reference_no;
    createdGrievanceId = data.grievance.id;
  });

  await t.test('Step 2: Public Tracking by Reference Number', async () => {
    const res = await fetch(`${BASE_URL}/grievances/track/${createdGrievanceRef}`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.grievance.reference_no, createdGrievanceRef);
    assert.strictEqual(data.grievance.status, 'Submitted');
    assert.ok(data.history.length >= 1);
  });

  await t.test('Step 3: CMO Admin Reviews and Forwards to Department', async () => {
    const res = await fetch(`${BASE_URL}/cmo/grievances/${createdGrievanceId}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cmoToken}`
      },
      body: JSON.stringify({
        department_id: 2, // HEALTH
        instructions: 'Urgent dispatch of 50 polyvalent antiserum vials from KMSCL Kozhikode warehouse.',
        priority: 'Urgent'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
  });

  await t.test('Step 4: Department Officer Updates Investigation', async () => {
    // Login as health officer
    const officerLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'health.officer@kerala.gov.in',
        password: 'Kerala@2026'
      })
    });
    const { token: healthOfficerToken } = await officerLogin.json();

    const res = await fetch(`${BASE_URL}/officer/grievances/${createdGrievanceId}/investigate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${healthOfficerToken}`
      },
      body: JSON.stringify({
        remarks: 'Emergency requisition raised to KMSCL. Batch #AV-408 allocated.',
        status: 'In Progress'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
  });

  await t.test('Step 5: Department Submits Action-Taken Report & Resolves', async () => {
    const officerLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'health.officer@kerala.gov.in',
        password: 'Kerala@2026'
      })
    });
    const { token: healthOfficerToken } = await officerLogin.json();

    const res = await fetch(`${BASE_URL}/officer/grievances/${createdGrievanceId}/action-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${healthOfficerToken}`
      },
      body: JSON.stringify({
        action_taken: '60 vials of lyophilized anti-snake venom delivered to Koyilandy Taluk Hospital casualty cold storage at 09:30 AM.',
        resolution_summary: 'Sufficient buffer stock restored. Emergency duty doctors briefed on anaphylaxis protocol.',
        mark_resolved: true
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
  });

  await t.test('Step 6: Citizen Submits Feedback & Rating', async () => {
    const res = await fetch(`${BASE_URL}/grievances/${createdGrievanceId}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${citizenToken}`
      },
      body: JSON.stringify({
        rating: 5,
        feedback_text: 'Life-saving response! Antiserum reached within 24 hours. Excellent governance by CMO.',
        is_satisfied: 1
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
  });
});

test('6. Security & Authorization Enforcement', async (t) => {
  await t.test('Citizen cannot access CMO Admin stats (Returns 403)', async () => {
    const res = await fetch(`${BASE_URL}/cmo/stats`, {
      headers: { 'Authorization': `Bearer ${citizenToken}` }
    });
    assert.strictEqual(res.status, 403);
  });

  await t.test('Unauthenticated request to submit grievance (Returns 401)', async () => {
    const res = await fetch(`${BASE_URL}/grievances/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: 'Test' })
    });
    assert.strictEqual(res.status, 401);
  });
});
