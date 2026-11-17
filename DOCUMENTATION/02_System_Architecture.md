# 02. System Architecture

## Architecture Overview
The CM Kerala Public Grievance Redressal Portal is architected following the **Three-Tier Enterprise Web Application Pattern** with an asynchronous **AI Cognitive Layer**:

```mermaid
flowchart TD
    subgraph ClientLayer["Frontend Client Layer (React.js + Tailwind CSS + Vite)"]
        PublicWeb["Public Portal\nHome, About, Depts, Tracking, FAQ"]
        CitizenPortal["Citizen Portal\nSubmit Grievance, AI Assistant, Dashboard"]
        CMODash["CMO Admin Dashboard\nKPIs, Analytics Charts, Master Routing"]
        OfficerDash["Officer Dashboard\nInvestigation, Action Taken Reports (ATR)"]
    end

    subgraph APILayer["Backend API Gateway & Business Logic (Node.js + Express)"]
        Router["Express Router (/api)"]
        AuthMiddleware["JWT Auth & Role Guard\n(citizen | cmo_admin | department_officer)"]
        MulterMiddleware["Multer Storage Engine\n(Image & PDF attachments)"]
        
        subgraph Controllers["Modular Controllers"]
            AuthController["authController"]
            GrievanceController["grievanceController"]
            CMOController["cmoController"]
            OfficerController["officerController"]
            DeptController["departmentController"]
            ContactController["contactController"]
            AIController["aiController"]
        end
    end

    subgraph AILayer["AI Cognitive Service Layer"]
        GeminiAPI["Google Gemini 1.5 Flash\nLLM Reasoning & Categorization"]
        FallbackNLP["KeralaGov Contextual NLP Engine\nHeuristic Taxonomy Classifier"]
        DuplicateDetector["Semantic Similarity Engine\nJaccard Token Matching & District Cross-Check"]
    end

    subgraph DataLayer["Persistence Layer (SQLite / PostgreSQL)"]
        SQLiteEngine["node:sqlite Engine\n(grievance_portal.db with Foreign Keys & Indices)"]
        UploadStorage["Static File Storage\n(/uploads for evidence & ATR files)"]
    end

    ClientLayer -->|REST HTTPS Requests / JWT| APILayer
    Router --> AuthMiddleware
    Router --> MulterMiddleware
    AuthMiddleware --> Controllers
    MulterMiddleware --> Controllers
    
    Controllers -->|Async Text Classification| AILayer
    GeminiAPI -.->|Graceful Fallback| FallbackNLP
    AILayer --> DuplicateDetector
    
    Controllers -->|SQL Transactions & Prepared Queries| DataLayer
    MulterMiddleware -->|Disk Write| UploadStorage
```

---

## 1. Technology Stack Breakdown

| Tier | Technology | Specification / Version | Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend** | React.js | v18.3.1 + Vite 5.4 | High-performance Single Page Application with instantaneous reactive re-rendering. |
| **Styling** | Tailwind CSS | v3.4 | Consistent Government of Kerala design system with royal emerald, gold, and accessible slate palettes. |
| **Charts** | Recharts | v2.12 | Responsive vector SVG charts for district-wise, department-wise, and status distributions. |
| **Icons** | Lucide React | v0.441 | Lightweight, accessible SVG iconography. |
| **Backend** | Node.js + Express | Node v24.17 + Express 4.21 | Asynchronous non-blocking I/O event loop, enterprise modular routing and middleware pipelining. |
| **Database** | SQLite via `node:sqlite` | Built-in Node 24 Native SQLite | Zero external native compilation overhead, synchronous prepared statements, acid transactions, foreign key enforcement, and instant portability across environments. Compatible with PostgreSQL via Prisma/Sequelize. |
| **Auth** | JWT + BCrypt | `jsonwebtoken` + `bcryptjs` | Stateless cryptographic bearer token authentication with role-based authorization (RBAC) and 10-round salted password hashing. |
| **File Handling** | Multer | v1.4.5-lts | Multipart form file streaming with mime-type validation (JPG, PNG, WEBP, PDF, DOCX up to 10MB). |
| **AI Integration** | Google Gemini + Heuristic NLP | Gemini 1.5 Flash + Contextual Heuristic Classifier | Dual-engine design: Calls cloud LLM when API key is provided, with a zero-dependency contextual NLP fallback engine ensuring 100% offline uptime. |

---

## 2. Security Architecture

1. **Role-Based Access Control (RBAC)**:
   - `citizen`: Can submit petitions, view own grievances, rate resolved petitions, and reopen them.
   - `cmo_admin`: Full executive oversight; can view all 14 districts, assign line departments, escalate delayed petitions, and approve resolutions.
   - `department_officer`: Strictly scoped to petitions forwarded to their specific department ID (e.g. PWD officer cannot access Health grievances).
2. **Stateless Authentication**:
   - Access tokens are cryptographically signed with HS256 algorithm and a configurable `JWT_SECRET`. Tokens expire after 7 days.
3. **Audit Trail Logging**:
   - Every status transition is written to `grievance_history` inside atomic database transactions, capturing `from_status`, `to_status`, `action`, `performed_by_id`, `performed_by_name`, `performed_by_role`, and `timestamp`.
4. **Input Sanitization & Injection Prevention**:
   - All database interactions use prepared statements (`stmt.run(?, ?)`, `stmt.all(...)`), eliminating SQL injection vulnerabilities.
   - File uploads are validated by MIME type, sanitized to alphanumeric filenames, and served via controlled static routes.

---

## 3. End-to-End Workflow Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor Citizen as Citizen Petitioner
    participant Client as Frontend SPA
    participant AI as AI Grievance Assistant
    participant API as Express API Server
    participant DB as Database (SQLite)
    actor CMO as CMO Administrator
    actor Officer as Department Officer

    Citizen->>Client: Enters complaint description & district
    Client->>AI: POST /api/ai/analyze (Subject, Description, District)
    AI-->>Client: Returns suggested department, category, priority, summary & duplicate check
    Citizen->>Client: Reviews/Accepts AI suggestions & attaches photo
    Client->>API: POST /api/grievances/submit (FormData + JWT)
    API->>DB: INSERT into grievances & grievance_history
    DB-->>API: Unique Reference: KL-CMO-2026-XXXXX
    API-->>Client: Returns 201 Created & Reference ID

    CMO->>Client: Opens CMO Administrative Console
    Client->>API: GET /api/cmo/grievances (Filters: District, Status, Overdue)
    API->>DB: Query filtered caseload
    DB-->>API: Grievances array
    API-->>Client: Renders master table & KPIs

    CMO->>Client: Selects petition & clicks "Forward to Department"
    Client->>API: POST /api/cmo/grievances/:id/assign (dept_id, instructions, target_date)
    API->>DB: UPDATE status = 'In Progress', INSERT department_assignments, INSERT grievance_history
    API-->>Client: 200 OK

    Officer->>Client: Officer logs in (PWD / Health / KWA)
    Client->>API: GET /api/officer/grievances
    API->>DB: SELECT WHERE department_id = user.dept_id
    DB-->>API: Department queue
    Officer->>Client: Enters Action-Taken Report (ATR) + inspection photo
    Client->>API: POST /api/officer/grievances/:id/action-report
    API->>DB: UPDATE officer_action_report, status = 'Resolved', INSERT grievance_history
    API-->>Client: 200 OK

    Citizen->>Client: Tracks petition KL-CMO-2026-XXXXX
    Client->>API: GET /api/grievances/track/:ref
    API-->>Client: Returns resolved state, officer ATR, and chronological timeline
    Citizen->>Client: Rates satisfaction (5 Stars)
    Client->>API: POST /api/grievances/:id/feedback
    API->>DB: INSERT into citizen_feedback
    API-->>Client: 200 OK (Cycle completed)
```
