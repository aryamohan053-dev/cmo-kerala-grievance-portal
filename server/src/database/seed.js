const bcrypt = require('bcryptjs');
const { db, query, get, run, transaction } = require('./db.js');

async function seed() {
  console.log('Seeding CMO Kerala Grievance Redressal Portal Database...');

  // Do not overwrite an existing database
  const existingUsers = get('SELECT COUNT(*) AS count FROM users');

  if (existingUsers.count > 0) {
    console.log('Database already contains users. Skipping seed.');
    return;
  }

 
  // Clear existing data safely
  db.exec(`
    DELETE FROM citizen_feedback;
    DELETE FROM attachments;
    DELETE FROM department_assignments;
    DELETE FROM grievance_history;
    DELETE FROM grievances;
    DELETE FROM contact_enquiries;
    DELETE FROM users;
    DELETE FROM departments;
  `);

  // 1. Insert Departments
  const departments = [
    {
      code: 'PWD',
      name: 'Public Works Department (PWD)',
      description: 'State roads, bridges, public buildings construction and infrastructure maintenance.',
      nodal_email: 'pwd.cmo@kerala.gov.in',
      phone: '0471-2322301',
      sla_days: 14
    },
    {
      code: 'HEALTH',
      name: 'Health & Family Welfare Department',
      description: 'Government medical colleges, taluk hospitals, primary health centres, medical supplies and public health surveillance.',
      nodal_email: 'health.cmo@kerala.gov.in',
      phone: '0471-2518280',
      sla_days: 7
    },
    {
      code: 'LSGD',
      name: 'Local Self Government Department (LSGD)',
      description: 'Panchayats, municipalities, municipal corporations, solid waste management, local roads, and civic amenities.',
      nodal_email: 'lsgd.cmo@kerala.gov.in',
      phone: '0471-2324950',
      sla_days: 10
    },
    {
      code: 'KSEB',
      name: 'Kerala State Electricity Board (KSEB)',
      description: 'Power generation, high-tension lines, local transformer maintenance, uninterrupted power supply, and consumer billing.',
      nodal_email: 'kseb.cmo@kerala.gov.in',
      phone: '1912',
      sla_days: 5
    },
    {
      code: 'KWA',
      name: 'Kerala Water Authority (KWA)',
      description: 'Potable piped water distribution, Jal Jeevan Mission connections, pipeline repair, and municipal sewage lines.',
      nodal_email: 'kwa.cmo@kerala.gov.in',
      phone: '1916',
      sla_days: 7
    },
    {
      code: 'REVENUE',
      name: 'Revenue & Land Records Department',
      description: 'Land mutation (pokkuvaravu), survey boundaries, certificate issuance, taluk administration, and disaster compensation.',
      nodal_email: 'revenue.cmo@kerala.gov.in',
      phone: '0471-2328221',
      sla_days: 21
    },
    {
      code: 'CIVIL_SUPPLIES',
      name: 'Food & Civil Supplies Department',
      description: 'Public Distribution System (PDS), ration cards, Supplyco stores, price stabilization, and fair market monitoring.',
      nodal_email: 'civilsupplies.cmo@kerala.gov.in',
      phone: '1967',
      sla_days: 10
    },
    {
      code: 'EDUCATION',
      name: 'General & Higher Education Department',
      description: 'Government schools, higher secondary institutes, mid-day meal scheme, teacher affairs, and academic facilities.',
      nodal_email: 'education.cmo@kerala.gov.in',
      phone: '0471-2325320',
      sla_days: 15
    },
    {
      code: 'POLICE',
      name: 'Kerala Police & Public Safety',
      description: 'Law enforcement, traffic regulation, citizen safety, public petition inquiries, cyber security, and anti-corruption cell.',
      nodal_email: 'police.cmo@kerala.gov.in',
      phone: '112',
      sla_days: 7
    }
  ];

  const insertDept = db.prepare(`
    INSERT INTO departments (code, name, description, nodal_email, phone, sla_days)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const deptMap = {};
  for (const dept of departments) {
    const res = insertDept.run(dept.code, dept.name, dept.description, dept.nodal_email, dept.phone, dept.sla_days);
    deptMap[dept.code] = res.lastInsertRowid;
  }
  console.log(`Inserted ${departments.length} departments.`);

  // 2. Insert Users
  const passwordHash = await bcrypt.hash('Kerala@2026', 10);

  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, phone, district, department_id, designation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // CMO Admin
  const cmoAdminRes = insertUser.run(
    'Smt. Lakshmi Nair, IAS',
    'cmo.admin@kerala.gov.in',
    passwordHash,
    'cmo_admin',
    '+91 94470 12345',
    'Thiruvananthapuram',
    null,
    'Principal Secretary to the Chief Minister'
  );
  const cmoAdminId = cmoAdminRes.lastInsertRowid;

  // Department Officers
  const pwdOfficerRes = insertUser.run(
    'Er. Suresh Kumar',
    'pwd.officer@kerala.gov.in',
    passwordHash,
    'department_officer',
    '+91 94471 23456',
    'Ernakulam',
    deptMap['PWD'],
    'Executive Engineer (Roads Division, PWD)'
  );
  const pwdOfficerId = pwdOfficerRes.lastInsertRowid;

  const healthOfficerRes = insertUser.run(
    'Dr. Radhika Menon',
    'health.officer@kerala.gov.in',
    passwordHash,
    'department_officer',
    '+91 94472 34567',
    'Kozhikode',
    deptMap['HEALTH'],
    'District Medical Officer (Health & Family Welfare)'
  );
  const healthOfficerId = healthOfficerRes.lastInsertRowid;

  const kwaOfficerRes = insertUser.run(
    'Er. George Mathew',
    'kwa.officer@kerala.gov.in',
    passwordHash,
    'department_officer',
    '+91 94473 45678',
    'Thiruvananthapuram',
    deptMap['KWA'],
    'Assistant Executive Engineer (KWA Distribution)'
  );
  const kwaOfficerId = kwaOfficerRes.lastInsertRowid;

  const ksebOfficerRes = insertUser.run(
    'Er. Anjali Pillai',
    'kseb.officer@kerala.gov.in',
    passwordHash,
    'department_officer',
    '+91 94474 56789',
    'Thrissur',
    deptMap['KSEB'],
    'Assistant Engineer (Electrical Section, KSEB)'
  );
  const ksebOfficerId = ksebOfficerRes.lastInsertRowid;

  const lsgdOfficerRes = insertUser.run(
    'Shri. Manoj Varma',
    'lsgd.officer@kerala.gov.in',
    passwordHash,
    'department_officer',
    '+91 94475 67890',
    'Alappuzha',
    deptMap['LSGD'],
    'Municipal Secretary (LSGD Local Governance)'
  );
  const lsgdOfficerId = lsgdOfficerRes.lastInsertRowid;

  // Citizens
  const citizen1Res = insertUser.run(
    'K. Narayanan Namboothiri',
    'citizen.narayanan@gmail.com',
    passwordHash,
    'citizen',
    '+91 98460 11223',
    'Ernakulam',
    null,
    'Resident & Teacher'
  );
  const citizen1Id = citizen1Res.lastInsertRowid;

  const citizen2Res = insertUser.run(
    'Fathima Beevi',
    'citizen.fathima@gmail.com',
    passwordHash,
    'citizen',
    '+91 98460 22334',
    'Malappuram',
    null,
    'Homemaker & Social Worker'
  );
  const citizen2Id = citizen2Res.lastInsertRowid;

  const citizen3Res = insertUser.run(
    'Thomas Joseph',
    'citizen.thomas@gmail.com',
    passwordHash,
    'citizen',
    '+91 98460 33445',
    'Kottayam',
    null,
    'Rubber Planter'
  );
  const citizen3Id = citizen3Res.lastInsertRowid;

  console.log('Inserted default users (CMO Admin, 5 Dept Officers, 3 Citizens).');

  // 3. Insert Grievances
  const insertGrievance = db.prepare(`
    INSERT INTO grievances (
      reference_no, citizen_id, district, department_id, category, subject, description,
      priority, status, assigned_officer_id, ai_summary, ai_suggested_dept, ai_suggested_priority,
      ai_duplicate_flag, ai_duplicate_ref, cmo_remarks, officer_action_report, resolved_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertHistory = db.prepare(`
    INSERT INTO grievance_history (
      grievance_id, from_status, to_status, action, remarks, performed_by_id, performed_by_name, performed_by_role, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertAssignment = db.prepare(`
    INSERT INTO department_assignments (
      grievance_id, department_id, assigned_by_id, instructions, target_resolution_date, assigned_at
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertFeedback = db.prepare(`
    INSERT INTO citizen_feedback (
      grievance_id, citizen_id, rating, feedback_text, is_satisfied, created_at
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertAttachment = db.prepare(`
    INSERT INTO attachments (
      grievance_id, uploaded_by_id, attachment_type, file_name, file_path, mime_type, file_size, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Sample Grievance 1: Resolved PWD Road Issue
  const g1 = insertGrievance.run(
    'KL-CMO-2026-00101',
    citizen1Id,
    'Ernakulam',
    deptMap['PWD'],
    'Road Infrastructure',
    'Severe craters and damaged culvert on Aluva-Perumbavoor Road near Marampally',
    'The 2km stretch on Aluva-Perumbavoor road near Marampally junction has developed dangerous 1.5-foot deep potholes following the monsoon showers. Two two-wheeler accidents have occurred this week alone. School buses are unable to navigate safely. Request urgent intervention before school reopenings.',
    'High',
    'Resolved',
    pwdOfficerId,
    'Dangerous potholes and culvert degradation on Aluva-Perumbavoor PWD road causing traffic hazards and two-wheeler accidents. High priority repair required.',
    'Public Works Department (PWD)',
    'High',
    0,
    null,
    'Expedite immediate blacktopping and culvert reinforcement under emergency repair fund.',
    'Inspected site on 12-Nov-2026. Patchwork and wet-mix macadam base laid followed by 40mm bituminous concrete resurfacing. Guard rails near culvert restored. Road is fully motorable and traffic opened.',
    '2026-11-15 14:30:00',
    '2026-11-05 09:15:00',
    '2026-11-15 14:30:00'
  );
  const g1Id = g1.lastInsertRowid;

  // G1 History
  insertHistory.run(g1Id, null, 'Submitted', 'Citizen Submitted', 'Grievance submitted by citizen with photographic evidence.', citizen1Id, 'K. Narayanan Namboothiri', 'citizen', '2026-11-05 09:15:00');
  insertHistory.run(g1Id, 'Submitted', 'Under Review', 'CMO Review', 'CMO screened grievance and verified high hazard rating.', cmoAdminId, 'Smt. Lakshmi Nair, IAS', 'cmo_admin', '2026-11-06 10:30:00');
  insertHistory.run(g1Id, 'Under Review', 'In Progress', 'Assigned to PWD', 'Forwarded to Executive Engineer PWD Ernakulam with 7-day SLA.', cmoAdminId, 'Smt. Lakshmi Nair, IAS', 'cmo_admin', '2026-11-06 11:00:00');
  insertAssignment.run(g1Id, deptMap['PWD'], cmoAdminId, 'Direct urgent macadam resurfacing and submit completion report with geo-tagged photos.', '2026-11-13', '2026-11-06 11:00:00');
  insertHistory.run(g1Id, 'In Progress', 'In Progress', 'Officer Site Inspection', 'PWD engineering team visited site and mobilized contractor machinery.', pwdOfficerId, 'Er. Suresh Kumar', 'department_officer', '2026-11-08 15:00:00');
  insertHistory.run(g1Id, 'In Progress', 'Resolved', 'Resolution Approved by CMO', 'Resurfacing completed by PWD. CMO reviewed ATR and verified completion.', cmoAdminId, 'Smt. Lakshmi Nair, IAS', 'cmo_admin', '2026-11-15 14:30:00');

  // G1 Feedback
  insertFeedback.run(g1Id, citizen1Id, 5, 'Remarkable promptness! The entire road was resurfaced within 9 days of submission to CMO. Thank you Honorable CM and PWD team.', 1, '2026-11-16 11:00:00');

  // G1 Attachments
  insertAttachment.run(g1Id, citizen1Id, 'citizen_evidence', 'pothole_marampally_hazard.jpg', '/uploads/samples/pothole_marampally.jpg', 'image/jpeg', 245000, '2026-11-05 09:15:00');
  insertAttachment.run(g1Id, pwdOfficerId, 'officer_report', 'pwd_completion_report_aluva.pdf', '/uploads/samples/pwd_completion_aluva.pdf', 'application/pdf', 580000, '2026-11-14 17:00:00');

  // Sample Grievance 2: In Progress KWA Drinking Water Pipeline
  const g2 = insertGrievance.run(
    'KL-CMO-2026-00102',
    citizen2Id,
    'Malappuram',
    deptMap['KWA'],
    'Drinking Water Supply',
    'Acute drinking water contamination and major main burst in Nilambur ward 4',
    'Main distribution line from Chaliyar water treatment plant has ruptured near Nilambur town bypass. Muddy discolored water is flowing into over 120 residential tap connections. Residents, including infants and senior citizens, have no potable water for the past 5 days.',
    'High',
    'In Progress',
    kwaOfficerId,
    'Broken main pipeline causing severe tap water contamination and supply disruption to 120+ households in Nilambur ward 4.',
    'Kerala Water Authority (KWA)',
    'High',
    0,
    null,
    'Arrange emergency water tankers immediately and replace damaged 250mm DI pipes.',
    'Emergency drinking water supply deployed via two 6000L KWA tankers daily. Excavation started today to replace 15 meters of cracked DI pipe. Pressure testing scheduled for tomorrow.',
    null,
    '2026-11-10 11:20:00',
    '2026-11-14 16:45:00'
  );
  const g2Id = g2.lastInsertRowid;

  insertHistory.run(g2Id, null, 'Submitted', 'Citizen Submitted', 'Grievance submitted by citizen with water sample photo.', citizen2Id, 'Fathima Beevi', 'citizen', '2026-11-10 11:20:00');
  insertHistory.run(g2Id, 'Submitted', 'Under Review', 'CMO Review', 'CMO expedited due to public health concern.', cmoAdminId, 'Smt. Lakshmi Nair, IAS', 'cmo_admin', '2026-11-10 14:00:00');
  insertHistory.run(g2Id, 'Under Review', 'In Progress', 'Assigned to KWA', 'Forwarded to KWA Assistant Executive Engineer.', cmoAdminId, 'Smt. Lakshmi Nair, IAS', 'cmo_admin', '2026-11-10 14:30:00');
  insertAssignment.run(g2Id, deptMap['KWA'], cmoAdminId, 'Provide tanker supply immediately and repair rupture within 48 hours.', '2026-11-13', '2026-11-10 14:30:00');
  insertHistory.run(g2Id, 'In Progress', 'In Progress', 'Interim Tanker Relief', 'Two relief water tankers dispatched; pipe replacement work underway.', kwaOfficerId, 'Er. George Mathew', 'department_officer', '2026-11-12 10:15:00');

  // Sample Grievance 3: Under Review Health Department Medicine Shortage
  const g3 = insertGrievance.run(
    'KL-CMO-2026-00103',
    citizen3Id,
    'Kottayam',
    deptMap['HEALTH'],
    'Public Healthcare',
    'Non-availability of essential insulin and dialysis consumables at Taluk Hospital Pala',
    'My elderly father and several chronic kidney/diabetes patients visiting Pala Taluk Hospital have been turned away for the last three weeks due to zero stock of insulin vials and dialyzer cartridges. Patients from poor families cannot afford private pharmacy prices.',
    'Urgent',
    'Under Review',
    healthOfficerId,
    'Critical shortage of life-saving insulin and dialysis consumables at Pala Taluk Hospital affecting poor chronic patients.',
    'Health & Family Welfare Department',
    'Urgent',
    0,
    null,
    'Director of Health Services (DHS) and KMSCL notified for urgent central stock diversion.',
    null,
    null,
    '2026-11-16 08:30:00',
    '2026-11-16 11:00:00'
  );
  const g3Id = g3.lastInsertRowid;

  insertHistory.run(g3Id, null, 'Submitted', 'Citizen Submitted', 'Submitted via citizen portal.', citizen3Id, 'Thomas Joseph', 'citizen', '2026-11-16 08:30:00');
  insertHistory.run(g3Id, 'Submitted', 'Under Review', 'CMO Review', 'CMO tagged as Urgent priority; medical review initiated.', cmoAdminId, 'Smt. Lakshmi Nair, IAS', 'cmo_admin', '2026-11-16 11:00:00');

  // Sample Grievance 4: Submitted (Pending CMO Initial Review) KSEB High Voltage Danger
  const g4 = insertGrievance.run(
    'KL-CMO-2026-00104',
    citizen1Id,
    'Thrissur',
    deptMap['KSEB'],
    'Electricity & Power',
    'Leaning 11KV electrical pole and loose dangling wires near Chalakudy Market',
    'An 11KV electrical pole is severely tilted towards the crowded Chalakudy fish market following heavy winds. Loose wires are hanging within 7 feet of the ground. Pedestrians and delivery vehicles are in grave danger of electrocution.',
    'Urgent',
    'Submitted',
    null,
    'Critically tilted 11KV electricity pole with sagging overhead live wires near high-footfall Chalakudy market area.',
    'Kerala State Electricity Board (KSEB)',
    'Urgent',
    0,
    null,
    null,
    null,
    null,
    '2026-11-17 10:15:00',
    '2026-11-17 10:15:00'
  );
  const g4Id = g4.lastInsertRowid;
  insertHistory.run(g4Id, null, 'Submitted', 'Citizen Submitted', 'Grievance submitted with AI priority recommendation: Urgent.', citizen1Id, 'K. Narayanan Namboothiri', 'citizen', '2026-11-17 10:15:00');

  // Sample Grievance 5: Reopened Grievance (Citizen unsatisfied with incomplete drainage work)
  const g5 = insertGrievance.run(
    'KL-CMO-2026-00105',
    citizen2Id,
    'Alappuzha',
    deptMap['LSGD'],
    'Sanitation & Drainage',
    'Overflowing sewage stormwater drain in Kayamkulam Municipal Ward 12',
    'Drainage was only partially de-silted. Heavy rainfall yesterday caused dirty sewage water to back up directly into residential courtyards again. The contractor left concrete debris blocking the main canal exit.',
    'Medium',
    'Reopened',
    lsgdOfficerId,
    'Sanitation issue: Partially cleared storm drain causing sewage backup into residential courtyards in Kayamkulam.',
    'Local Self Government Department (LSGD)',
    'Medium',
    0,
    null,
    'Reopened petition. Municipal Secretary must physically verify culvert outlet and penalize negligent contractor.',
    'Previously reported as cleaned on 30-Oct. Following citizen objection, joint re-inspection conducted. JCB mobilized to break concrete blockage at outlet.',
    null,
    '2026-10-25 10:00:00',
    '2026-11-16 15:20:00'
  );
  const g5Id = g5.lastInsertRowid;

  insertHistory.run(g5Id, null, 'Submitted', 'Citizen Submitted', 'Initial complaint submitted.', citizen2Id, 'Fathima Beevi', 'citizen', '2026-10-25 10:00:00');
  insertHistory.run(g5Id, 'Submitted', 'In Progress', 'Assigned to LSGD', 'Forwarded to Kayamkulam Municipality.', cmoAdminId, 'Smt. Lakshmi Nair, IAS', 'cmo_admin', '2026-10-26 11:30:00');
  insertHistory.run(g5Id, 'In Progress', 'Resolved', 'Marked Resolved by Dept', 'Contractor completed desilting report submitted.', lsgdOfficerId, 'Shri. Manoj Varma', 'department_officer', '2026-10-30 16:00:00');
  insertHistory.run(g5Id, 'Resolved', 'Reopened', 'Citizen Reopened', 'Citizen flagged that debris still blocked the main outlet causing flooding.', citizen2Id, 'Fathima Beevi', 'citizen', '2026-11-16 15:20:00');

  // Sample Grievance 6: Duplicate detection sample
  const g6 = insertGrievance.run(
    'KL-CMO-2026-00106',
    citizen3Id,
    'Ernakulam',
    deptMap['PWD'],
    'Road Infrastructure',
    'Big potholes on Aluva Perumbavoor road near Marampally bridge',
    'The road from Aluva to Perumbavoor near Marampally has huge potholes and is very dangerous for motorbikes.',
    'High',
    'Resolved',
    pwdOfficerId,
    'Potholes on Aluva-Perumbavoor road near Marampally. Flagged by AI as identical issue to KL-CMO-2026-00101.',
    'Public Works Department (PWD)',
    'High',
    1,
    'KL-CMO-2026-00101',
    'Linked as duplicate of petition KL-CMO-2026-00101. Handled under the same road repair work order.',
    'Action completed under master petition KL-CMO-2026-00101.',
    '2026-11-15 14:30:00',
    '2026-11-06 14:00:00',
    '2026-11-15 14:30:00'
  );
  const g6Id = g6.lastInsertRowid;
  insertHistory.run(g6Id, null, 'Submitted', 'Citizen Submitted', 'Submitted with AI duplicate warning detected.', citizen3Id, 'Thomas Joseph', 'citizen', '2026-11-06 14:00:00');
  insertHistory.run(g6Id, 'Submitted', 'Resolved', 'Merged & Resolved', 'Merged with KL-CMO-2026-00101 by CMO Admin.', cmoAdminId, 'Smt. Lakshmi Nair, IAS', 'cmo_admin', '2026-11-15 14:30:00');

  // Sample Grievance 7: Overdue / Delayed Grievance (Submitted > 20 days ago, in progress)
  const g7 = insertGrievance.run(
    'KL-CMO-2026-00107',
    citizen1Id,
    'Palakkad',
    deptMap['REVENUE'],
    'Land & Revenue',
    'Delay exceeding 10 months in land mutation (Pokkuvaravu) at Chittur Taluk',
    'Inheritance title deed submitted in January 2026 with all legal heir certificates and tax receipts. Village officer and tahsildar have conducted three inspections but file is intentionally stalled without any official objection.',
    'Medium',
    'In Progress',
    null,
    'Inordinate administrative delay in land mutation (Pokkuvaravu) at Chittur Taluk despite complete valid legal documentation.',
    'Revenue & Land Records Department',
    'Medium',
    0,
    null,
    'ESCALATED: Exceeded statutory 21-day SLA. District Collector Palakkad directed to initiate vigilance inquiry if not cleared in 3 days.',
    'Tahsildar Chittur requested 48 hours to complete final boundary cross-verification with resurvey maps.',
    null,
    '2026-10-15 11:00:00',
    '2026-11-12 16:30:00'
  );
  const g7Id = g7.lastInsertRowid;
  insertHistory.run(g7Id, null, 'Submitted', 'Citizen Submitted', 'Citizen submitted formal petition.', citizen1Id, 'K. Narayanan Namboothiri', 'citizen', '2026-10-15 11:00:00');
  insertHistory.run(g7Id, 'Submitted', 'In Progress', 'Assigned & Escalated', 'CMO escalated directly to District Revenue authorities.', cmoAdminId, 'Smt. Lakshmi Nair, IAS', 'cmo_admin', '2026-10-17 14:00:00');

  // 4. Insert Contact Enquiries
  const insertEnquiry = db.prepare(`
    INSERT INTO contact_enquiries (name, email, subject, message, status, response, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertEnquiry.run(
    'Adv. Jayashankar Menon',
    'j.menon.law@gmail.com',
    'Query regarding filing collective public interest petitions',
    'Can a resident association submit a collective grievance signed by 50 residents with supporting geotagged drone footage?',
    'Answered',
    'Yes, resident associations can submit through our portal attaching the signed resolution as a PDF document. Please choose the LSGD or relevant department.',
    '2026-11-10 14:00:00'
  );

  insertEnquiry.run(
    'Smt. Deepa Nair',
    'deepanair88@yahoo.co.in',
    'Tracking previous physical petitions submitted during CM Mass Contact program',
    'Is it possible to digitize and track petitions submitted during the physical Janasandarsanam program?',
    'Pending',
    null,
    '2026-11-16 16:45:00'
  );

  console.log('Seeded 7 grievances with rich lifecycle data, status histories, attachments, and feedback.');
  console.log('Database seeding successfully completed!');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
