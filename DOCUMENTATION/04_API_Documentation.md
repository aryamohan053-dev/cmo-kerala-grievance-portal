# 04. REST API Documentation

## API Overview & Conventions
- **Base URL**: `http://localhost:5000/api`
- **Format**: All payloads are sent and received as `application/json` (except file uploads which use `multipart/form-data`).
- **Authentication**: Bearer Token in `Authorization` header (`Authorization: Bearer <JWT>`).
- **Standard Response Shape**:
  ```json
  {
    "success": true,
    "message": "Optional status message",
    "data": {}
  }
  ```

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Citizen Registration
- **Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "K. Narayanan",
    "email": "citizen.narayanan@gmail.com",
    "password": "Kerala@2026",
    "phone": "+91 98460 11223",
    "district": "Ernakulam"
  }
  ```
- **Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Citizen registration successful. Welcome to CM Kerala Grievance Portal.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 7,
      "name": "K. Narayanan",
      "email": "citizen.narayanan@gmail.com",
      "role": "citizen",
      "district": "Ernakulam"
    }
  }
  ```

### 1.2 User Login
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Access**: Public (Role dynamically authenticated based on credentials)
- **Request Body**:
  ```json
  {
    "email": "cmo.admin@kerala.gov.in",
    "password": "Kerala@2026"
  }
  ```
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Smt. Lakshmi Nair, IAS",
      "email": "cmo.admin@kerala.gov.in",
      "role": "cmo_admin",
      "designation": "Principal Secretary to the Chief Minister"
    }
  }
  ```

### 1.3 Verify Current Session Profile
- **Method**: `GET`
- **Endpoint**: `/api/auth/me`
- **Access**: Authenticated (`Authorization: Bearer <JWT>`)

---

## 2. Public Tracking & Information Endpoints

### 2.1 Public Grievance Tracking by Reference ID
- **Method**: `GET`
- **Endpoint**: `/api/grievances/track/:ref`
- **Access**: Public (No login required)
- **URL Parameter**: `ref` = Reference Number (e.g. `KL-CMO-2026-00101`)
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "grievance": {
      "id": 1,
      "reference_no": "KL-CMO-2026-00101",
      "citizen_name": "K***i",
      "district": "Ernakulam",
      "category": "Road Infrastructure",
      "subject": "Severe craters on Aluva-Perumbavoor Road",
      "description": "The 2km stretch has developed deep potholes...",
      "priority": "High",
      "status": "Resolved",
      "department_name": "Public Works Department (PWD)",
      "department_code": "PWD",
      "officer_name": "Er. Suresh Kumar",
      "officer_action_report": "[Action Taken]: Bituminous resurfacing completed...",
      "resolved_at": "2026-11-15 14:30:00"
    },
    "history": [
      {
        "id": 1,
        "from_status": null,
        "to_status": "Submitted",
        "action": "Citizen Submitted",
        "remarks": "Grievance submitted by citizen with photographic evidence.",
        "performed_by_name": "K. Narayanan Namboothiri",
        "performed_by_role": "citizen",
        "created_at": "2026-11-05 09:15:00"
      },
      {
        "id": 6,
        "from_status": "In Progress",
        "to_status": "Resolved",
        "action": "Resolution Approved by CMO",
        "remarks": "Resurfacing completed by PWD. CMO reviewed ATR and verified completion.",
        "performed_by_name": "Smt. Lakshmi Nair, IAS",
        "performed_by_role": "cmo_admin",
        "created_at": "2026-11-15 14:30:00"
      }
    ],
    "attachments": [
      {
        "id": 1,
        "attachment_type": "citizen_evidence",
        "file_name": "pothole_marampally_hazard.jpg",
        "file_path": "/uploads/samples/pothole_marampally.jpg",
        "mime_type": "image/jpeg",
        "file_size": 245000
      }
    ],
    "feedback": {
      "rating": 5,
      "feedback_text": "Remarkable promptness! Road was resurfaced in 9 days.",
      "is_satisfied": 1
    }
  }
  ```

### 2.2 List Government Departments Directory
- **Method**: `GET`
- **Endpoint**: `/api/departments`
- **Access**: Public
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "departments": [
      {
        "id": 1,
        "code": "PWD",
        "name": "Public Works Department (PWD)",
        "description": "State roads, bridges, public buildings construction...",
        "nodal_email": "pwd.cmo@kerala.gov.in",
        "phone": "0471-2322301",
        "sla_days": 14,
        "total_grievances": 2,
        "resolved_grievances": 2,
        "pending_grievances": 0
      }
    ]
  }
  ```

### 2.3 Submit Public Contact Enquiry
- **Method**: `POST`
- **Endpoint**: `/api/contact`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "Adv. Rajesh Menon",
    "email": "rajesh.menon@example.com",
    "subject": "Community petition inquiry",
    "message": "Can a collective petition with 50 signatures be submitted?"
  }
  ```

---

## 3. Citizen Portal Endpoints (`/api/grievances`)

### 3.1 Submit Grievance
- **Method**: `POST`
- **Endpoint**: `/api/grievances/submit`
- **Access**: Authenticated (`citizen`)
- **Content-Type**: `multipart/form-data`
- **Body Fields**:
  - `district` (string, required): e.g. "Kottayam"
  - `category` (string, required): e.g. "Public Healthcare"
  - `subject` (string, required): e.g. "Shortage of insulin at Pala Hospital"
  - `description` (string, required): Full narrative
  - `priority` (string, optional): "Low" | "Medium" | "High" | "Urgent"
  - `ai_summary` (string, optional): Pre-computed AI summary
  - `attachment` (file, optional): Binary file (image or PDF up to 10MB)
- **Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Grievance registered successfully. Your petition has been forwarded to the Chief Minister's Office.",
    "reference_no": "KL-CMO-2026-78421",
    "grievance": {
      "id": 8,
      "reference_no": "KL-CMO-2026-78421",
      "status": "Submitted"
    }
  }
  ```

### 3.2 List Citizen's Own Grievances
- **Method**: `GET`
- **Endpoint**: `/api/grievances/my`
- **Access**: Authenticated (`citizen`)
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "stats": {
      "total": 3,
      "submitted": 1,
      "inProgress": 1,
      "resolved": 1,
      "reopened": 0
    },
    "grievances": [...]
  }
  ```

### 3.3 Submit Citizen Feedback
- **Method**: `POST`
- **Endpoint**: `/api/grievances/:id/feedback`
- **Access**: Authenticated (`citizen` petition owner only)
- **Request Body**:
  ```json
  {
    "rating": 5,
    "feedback_text": "Excellent action by the executive engineer.",
    "is_satisfied": 1
  }
  ```

### 3.4 Reopen Grievance
- **Method**: `POST`
- **Endpoint**: `/api/grievances/:id/reopen`
- **Access**: Authenticated (`citizen` petition owner only)
- **Request Body**:
  ```json
  {
    "remarks": "The drainage culvert was not cleared completely, water still stagnant."
  }
  ```

---

## 4. AI Grievance Assistant Endpoints (`/api/ai`)

### 4.1 Analyze Grievance Text
- **Method**: `POST`
- **Endpoint**: `/api/ai/analyze`
- **Access**: Public / Authenticated
- **Request Body**:
  ```json
  {
    "subject": "11KV tilted pole with hanging wires near market",
    "description": "An 11KV electrical pole is severely tilted towards the crowded Chalakudy fish market. Live loose wires are hanging within 7 feet of the ground posing grave danger of electrocution.",
    "district": "Thrissur"
  }
  ```
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "analysis": {
      "suggestedDepartment": "Kerala State Electricity Board (KSEB)",
      "suggestedDepartmentCode": "KSEB",
      "suggestedCategory": "Electricity & Power",
      "suggestedPriority": "Urgent",
      "summary": "[Grievance Summary]: An 11KV electrical pole is severely tilted towards the crowded Chalakudy fish market with live loose overhead wires posing electrocution danger.",
      "isFallback": true,
      "engine": "KeralaGov Contextual NLP Classifier v2.4 (On-premise Heuristic Engine)",
      "duplicateCheck": {
        "isDuplicate": false,
        "similarityScore": 12
      }
    }
  }
  ```

---

## 5. CMO Administration Endpoints (`/api/cmo`)

### 5.1 Executive KPI Statistics
- **Method**: `GET`
- **Endpoint**: `/api/cmo/stats`
- **Access**: Authenticated (`cmo_admin` only)
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "stats": {
      "total": 7,
      "pending": 2,
      "submitted": 1,
      "underReview": 1,
      "inProgress": 2,
      "resolved": 2,
      "reopened": 1,
      "overdue": 1,
      "resolutionRate": 29,
      "averageDays": 8.4,
      "satisfactionRate": 100,
      "averageRating": 5.0
    }
  }
  ```

### 5.2 Analytics Breakdown Data
- **Method**: `GET`
- **Endpoint**: `/api/cmo/analytics`
- **Access**: Authenticated (`cmo_admin` only)
- **Response (`200 OK`)**: Contains `districtStats` (for all 14 districts), `departmentStats`, `statusDistribution`, `priorityDistribution`.

### 5.3 Filter Master Grievances Table
- **Method**: `GET`
- **Endpoint**: `/api/cmo/grievances`
- **Access**: Authenticated (`cmo_admin` only)
- **Query Parameters**:
  - `district` (string): e.g. "Ernakulam"
  - `department_id` (integer)
  - `status` (string): "Submitted" | "Under Review" | "In Progress" | "Resolved" | "Reopened"
  - `priority` (string): "Low" | "Medium" | "High" | "Urgent"
  - `is_overdue` (boolean): `true` to filter cases > 14 days without resolution
  - `search` (string): Matches reference number, subject, or citizen name

### 5.4 Forward / Assign Grievance to Department
- **Method**: `POST`
- **Endpoint**: `/api/cmo/grievances/:id/assign`
- **Access**: Authenticated (`cmo_admin` only)
- **Request Body**:
  ```json
  {
    "department_id": 1,
    "instructions": "Direct macadam resurfacing and submit completion report within 7 days.",
    "priority": "High",
    "target_resolution_date": "2026-11-25"
  }
  ```

### 5.5 Update Status & Internal Administrative Remarks
- **Method**: `PATCH`
- **Endpoint**: `/api/cmo/grievances/:id/status`
- **Access**: Authenticated (`cmo_admin` only)
- **Request Body**:
  ```json
  {
    "status": "Resolved",
    "remarks": "Action taken report reviewed and approved by CMO."
  }
  ```

### 5.6 Escalate Delayed Grievance
- **Method**: `POST`
- **Endpoint**: `/api/cmo/grievances/:id/escalate`
- **Access**: Authenticated (`cmo_admin` only)
- **Request Body**:
  ```json
  {
    "reason": "SLA exceeded. District Collector instructed to expedite within 48 hours."
  }
  ```

---

## 6. Department Officer Endpoints (`/api/officer`)

### 6.1 View Department Queue
- **Method**: `GET`
- **Endpoint**: `/api/officer/grievances`
- **Access**: Authenticated (`department_officer` only)

### 6.2 Update Field Investigation Progress
- **Method**: `PATCH`
- **Endpoint**: `/api/officer/grievances/:id/investigate`
- **Access**: Authenticated (`department_officer` only)
- **Request Body**:
  ```json
  {
    "remarks": "Assistant Executive Engineer inspected site on 12-Nov. Contractor deployed.",
    "status": "In Progress"
  }
  ```

### 6.3 Submit Action-Taken Report (ATR)
- **Method**: `POST`
- **Endpoint**: `/api/officer/grievances/:id/action-report`
- **Access**: Authenticated (`department_officer` only)
- **Content-Type**: `multipart/form-data`
- **Body Fields**:
  - `action_taken` (string, required): Detailed physical repair or administrative remedy
  - `resolution_summary` (string, optional): Short summary
  - `mark_resolved` (boolean, default: true)
  - `report_attachment` (file, optional): Completion certificate or inspection photo proof
