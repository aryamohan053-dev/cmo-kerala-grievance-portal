# 01. Project Overview

## CM Kerala – Chief Minister's Public Grievance Redressal Portal
**Government of Kerala – Chief Minister's Office (CMO)**  
*Recruitment Assessment Submission for AI Full Stack Engineer | WhiteMatrix Software Solutions*

---

## 1. Problem Statement
Across the 14 districts of Kerala, citizens encounter a wide spectrum of civic and public governance challenges—spanning damaged road infrastructure and bridges, erratic drinking water supply, electrical hazards, primary hospital medicine shortages, revenue land record delays, and local municipal sanitation bottlenecks.

Historically, citizens had to travel physically to the Government Secretariat in Thiruvananthapuram or District Collectorates to petition the administration. Manual petitions faced:
- **Lack of Transparency**: Citizens could not track the status or current desk of their complaint.
- **Administrative Delays**: Lack of binding inter-departmental Service Level Agreements (SLAs).
- **Misclassification**: Grievances were routed manually to the wrong departments, leading to months of procedural redirection.
- **No Feedback Mechanism**: Petitioners were rarely informed of the actual field resolution, nor could they object if corrective works were inadequate.

## 2. Solution Objectives
The **Chief Minister's Public Grievance Redressal Portal** provides a state-of-the-art, secure digital bridge directly connecting citizens to the Chief Minister's Office:
1. **Direct Access to the CMO**: Citizens can submit petitions 24/7 from any device across all 14 districts without bureaucratic intermediaries.
2. **AI-Powered Grievance Assistant**: Employs Natural Language Processing (NLP) and Large Language Model (LLM) capabilities to automatically classify departments, determine priority levels, extract concise executive summaries for the CMO, and flag duplicate petitions.
3. **Traceable 5-Stage Lifecycle**: Enforces mandatory workflow progression (`Submitted` &rarr; `Under Review` &rarr; `In Progress` &rarr; `Resolved` &rarr; `Reopened`), logging every state transition with responsible actors and timestamps into an immutable audit trail.
4. **Action-Taken Report (ATR) Compliance**: Requires departmental executive officers to upload verified Action-Taken Reports with photographic or documentary evidence before resolution.
5. **Human-in-the-Loop & Citizen Feedback**: Citizens rate resolution satisfaction (1 to 5 stars) or reopen the grievance if field action was incomplete.

---

## 3. Scope of the System

| Module | Target Users | Primary Capabilities |
| :--- | :--- | :--- |
| **Public Portal** | Any resident / visitor | Home hero, live stats ticker, workflow breakdown, 9-department directory, public petition tracking by reference number, contact enquiries form, and searchable FAQs. |
| **Citizen Portal** | Registered citizens | Profile management, grievance submission with file uploads, live AI analysis assistant, citizen dashboard with status counters, resolution feedback rating, and reopening option. |
| **CMO Dashboard** | CMO Administrators (IAS officers / Secretariat) | Executive KPI dashboard, district-wise and department-wise charts, multi-parameter grievance filtering, department forwarding, SLA monitoring, escalation triggers, and final resolution review. |
| **Department Officer Dashboard** | Field Executive Officers (PWD, Health, KSEB, KWA, etc.) | Department-scoped petition queue, ground investigation progress updates, Action-Taken Report (ATR) filing, completion photo upload, and submission back to CMO. |

---

## 4. Key Functional Features

### 4.1 Unique Reference ID Generation
Upon submission, every petition receives a human-readable, unique identifier formatted as:
`KL-CMO-2026-XXXXX` (e.g., `KL-CMO-2026-00101`). This reference is searchable publicly without requiring credentials.

### 4.2 Mandatory AI Grievance Assistant
- **Department Taxonomy Matching**: Classifies incoming complaints into 9 major Kerala departments (PWD, Health, LSGD, KSEB, KWA, Revenue, Civil Supplies, Education, Police).
- **Urgency & Priority Recommendation**: Automatically evaluates risk to life, health hazards, public disruption, and backlog duration (`Low`, `Medium`, `High`, `Urgent`).
- **CMO Executive Summary**: Compresses detailed narrative text into an actionable 1-2 sentence briefing for administrators.
- **Duplicate Grievance Detection**: Computes semantic Jaccard and token similarity against recent petitions within the same district to flag potential duplicate petitions for human review.
- **Human-in-the-Loop Safeguard**: AI suggestions are reviewable and editable by the citizen before submission and validated by CMO administrators.

### 4.3 Integrated Kerala Line Departments
1. **Public Works Department (PWD)** – State roads, bridges, culverts, public buildings (14-day SLA).
2. **Health & Family Welfare** – Hospitals, medicines, doctors, emergency supplies (7-day SLA).
3. **Local Self Government (LSGD)** – Panchayats, municipalities, waste management, drainage, streetlights (10-day SLA).
4. **Kerala State Electricity Board (KSEB)** – Power cuts, leaning poles, dangling live wires, transformers (5-day SLA / 24h urgent).
5. **Kerala Water Authority (KWA)** – Pipe bursts, contamination, drinking water supply (7-day SLA).
6. **Revenue & Land Records** – Land mutation (pokkuvaravu), survey boundaries, certificates (21-day SLA).
7. **Food & Civil Supplies** – Ration cards, Supplyco stores, PDS distribution (10-day SLA).
8. **General & Higher Education** – Schools, teachers, mid-day meals, exam infrastructure (15-day SLA).
9. **Kerala Police & Public Safety** – Law and order, traffic safety, vigilance petitions (7-day SLA).

---

## 5. Prototype Compliance Notice
This application is developed strictly as a recruitment assessment submission for WhiteMatrix Software Solutions. All sample grievances, citizen names, and official credentials are fictional demonstration data. It does not imply endorsement by the Government of Kerala.
