# 07. User Guide & Role Operations Manual

## Overview
This guide provides step-by-step instructions for all three authenticated user roles (Citizen, CMO Administrator, Department Officer) as well as unauthenticated public visitors.

---

## 1. Public Visitor Walkthrough

### 1.1 Navigating the Public Website
- **Portal Home (`/`)**: View live redressed petition statistics, read the Chief Minister's governance message, and explore integrated line departments.
- **Departments Directory (`/departments`)**: Search across all 9 integrated Kerala Government departments to find nodal authority contacts, statutory SLA timelines, and active caseloads.
- **Workflow & Citizens' Charter (`/how-it-works`)**: Review the 5-stage grievance lifecycle, status definitions, and department SLA matrices.
- **Contact Us (`/contact`)**: Submit direct administrative queries or request assistance from the Secretariat Helpdesk.
- **FAQ (`/faq`)**: Search answers regarding filing procedures, photo evidence requirements, and confidentiality.

### 1.2 Tracking an Existing Petition (No Login Required)
1. Navigate to **Track Grievance** in the top navigation bar (or use the inline search bar on the Home page).
2. Enter your unique petition reference ID (e.g. `KL-CMO-2026-00101`).
3. Click **Track Petition**.
4. The system presents:
   - Current status badge (`Submitted`, `Under Review`, `In Progress`, `Resolved`, `Reopened`).
   - Assigned department, designated nodal officer, and target SLA date.
   - Chief Minister's Office (CMO) directives.
   - Official Action-Taken Report (ATR) upon completion.
   - Chronological audit trail stepper with timestamps and action logs.

---

## 2. Citizen User Guide

### 2.1 Citizen Registration & Sign In
1. Click **Register** on the top right.
2. Enter your Full Legal Name, Email, Mobile Number, District, and Password.
3. Upon registration, you are automatically signed in and redirected to your **Citizen Dashboard**.

### 2.2 Submitting a New Grievance with AI Assistance
1. Click **Submit Grievance** in the navigation bar.
2. Select the **District of Incident** and **Category**.
3. Type a concise **Subject** and detailed narrative **Description**.
4. Click the **"Analyze with AI Assistant"** button:
   - The AI assistant evaluates your text in real-time.
   - It checks for potential duplicate complaints in your district.
   - It recommends the appropriate Department and Priority level (`Low`, `Medium`, `High`, `Urgent`).
   - It generates a short executive summary for the Chief Minister's Office.
5. Click **"Apply AI Suggestions"** to accept recommendations, or adjust fields manually.
6. (Optional) Attach a supporting photograph (JPEG/PNG) or document (PDF) illustrating the issue.
7. Click **"Submit Grievance to CMO"**.
8. Save your generated **Reference ID** (e.g. `KL-CMO-2026-78421`).

### 2.3 Managing Your Grievances in Citizen Dashboard
1. Navigate to **Citizen Dashboard (`/citizen/dashboard`)**.
2. View KPI cards for your total, submitted, in-progress, resolved, and reopened petitions.
3. Filter by status or search by subject keywords.
4. Click **"View Complete Audit Trail"** on any petition to inspect departmental notes.

### 2.4 Submitting Satisfaction Feedback
1. Once a petition is marked **Resolved**, a **"Rate Resolution"** button appears.
2. Click the button to select a 1 to 5 star rating and enter optional qualitative comments.
3. Click **Submit Feedback**.

### 2.5 Reopening an Unsatisfactory Grievance
1. If field execution was incomplete, click **"Reopen Petition"** on any resolved grievance.
2. Enter an explanation detailing why the issue remains unresolved.
3. Click **Confirm Reopen**.
4. Status transitions immediately to `Reopened`, returning the case to the CMO priority queue.

---

## 3. Chief Minister's Office (CMO) Administrator Guide

### 3.1 Accessing the Central Administrative Console
1. Log in with CMO Admin credentials (`cmo.admin@kerala.gov.in` / `Kerala@2026`).
2. Navigate to **CMO Admin Console (`/cmo/dashboard`)**.

### 3.2 Reviewing Executive KPIs & State Analytics
- **KPI Metrics Strip**: Monitor live total received, pending review, active field work, verified resolutions, and overdue petitions exceeding 14 days.
- **District Caseload Bar Chart**: Inspect grievance volumes and resolution ratios across all 14 Kerala districts.
- **Department Distribution Donut**: Identify departments with high petition influxes.

### 3.3 Filtering & Triaging Grievances
1. Use the Master Filter Bar to isolate petitions by:
   - District (e.g. Ernakulam, Malappuram, Kozhikode)
   - Department (PWD, KWA, KSEB, Health, etc.)
   - Status (`Submitted`, `Under Review`, `In Progress`, `Resolved`, `Reopened`)
   - Priority (`Urgent`, `High`, `Medium`, `Low`)
   - **Overdue Only (>14d)** toggle
2. Click **"Manage"** on any petition to open the administrative dossier.

### 3.4 Forwarding Grievance to Line Department
1. Inside the Manage Modal, select the **Target Department** and **Priority**.
2. Enter specific secretarial instructions (e.g., *"Direct macadam resurfacing within 7-day emergency fund"*).
3. Click **"Forward & Assign Department"**.
4. Status automatically updates to `In Progress`, and an audit trail entry is created.

### 3.5 Escalating Delayed Petitions
1. If an assigned petition exceeds statutory SLA, click **"🚨 Escalate to Highest Priority"**.
2. Enter the escalation order.
3. The grievance priority is upgraded to `Urgent` with a CMO Escalation tag.

### 3.6 Final Resolution Review & Sign-Off
1. Review the Action-Taken Report (ATR) and photo proof submitted by the department officer.
2. Select status **Resolved (Final Approval)**.
3. Click **Save Status & Remarks** to officially close the case and notify the citizen.

---

## 4. Department Officer Guide

### 4.1 Departmental Sign In
1. Log in with officer credentials (e.g., PWD Officer `pwd.officer@kerala.gov.in` / `Kerala@2026`).
2. Navigate to **Officer Console (`/officer/dashboard`)**.

### 4.2 Managing Department Queue
- The console displays **only** grievances forwarded by the CMO to your department.
- Review CMO instructions, target SLA completion dates, and citizen photographs.

### 4.3 Updating Investigation Progress
1. Click **"Investigate & Submit ATR"** on an active petition.
2. Under *Add Field Investigation Progress Note*, type interim inspection notes (e.g., *"Site inspected on 12-Nov; contractor machinery mobilized"*).
3. Click **Update Progress Log**.

### 4.4 Submitting Official Action-Taken Report (ATR)
1. Once physical repairs or administrative remedies are finalized on the ground:
2. Fill in the **Physical Action Taken** text (e.g. *"Bituminous resurfacing completed and guard rails restored"*).
3. Upload an inspection photograph or completion certificate (PDF/JPEG).
4. Ensure the **"Mark Grievance as Resolved"** checkbox is checked.
5. Click **"Submit Action Taken Report to CMO"**.
6. The petition status updates to `Resolved`, timestamping your completion in the official audit record.
