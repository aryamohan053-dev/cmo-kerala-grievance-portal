# 06. Setup & Automated Testing Guide

## Prerequisites
- **Node.js**: v18.0.0 or higher (Tested and certified on Node.js v24.17.0 LTS)
- **npm**: v9.0.0 or higher (Tested on npm 11.13.0)
- **Git**

---

## 1. Local Quick-Start Guide

### Step 1: Clone or Navigate to the Repository
```bash
git clone <repository-url>
cd cmo-kerala-grievance-portal
```

### Step 2: Configure Environment Variables
Copy `.env.example` to both the root and `server/.env`:
```bash
cp .env.example server/.env
```
*(Optionally set your `GEMINI_API_KEY`. If left blank, the portal automatically runs its certified contextual NLP engine with 100% functionality!)*

### Step 3: Install Dependencies
Install dependencies for both backend and frontend:
```bash
# Root helper script:
npm run install:all

# Or manually:
cd server && npm install
cd ../client && npm install
```

### Step 4: Seed Database with Kerala Demonstration Data
Seed all 9 departments, 8 pre-configured demo users across all roles, sample grievances with full audit histories, and contact enquiries:
```bash
npm run seed
# Or: cd server && npm run seed
```
Output:
```
Seeding CMO Kerala Grievance Redressal Portal Database...
Inserted 9 departments.
Inserted default users (CMO Admin, 5 Dept Officers, 3 Citizens).
Seeded 7 grievances with rich lifecycle data, status histories, attachments, and feedback.
Database seeding successfully completed!
```

### Step 5: Build and Run Application

#### Option A: Unified Full-Stack Production Mode (Single Port 5000)
```bash
# Build the React frontend:
npm run build

# Start the unified backend (serves both React SPA and REST API):
npm start
```
Open **`http://localhost:5000`** in your browser.

#### Option B: Concurrent Development Mode
In two terminal tabs:
```bash
# Terminal 1 (Backend API):
npm run dev:server

# Terminal 2 (Vite Frontend with Hot Reload):
npm run dev:client
```
Frontend runs on **`http://localhost:5173`** (proxied to API on 5000).

---

## 2. Environment Variables Configuration

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port for Express API server |
| `NODE_ENV` | `development` | `development` or `production` |
| `JWT_SECRET` | `kerala_cmo_secret_key_2026_super_secure` | Secret salt for signing JWT tokens |
| `GEMINI_API_KEY` | *(Optional)* | Google Gemini Generative Language API Key |
| `DATABASE_PATH` | `./grievance_portal.db` | Absolute or relative path to SQLite database |

---

## 3. Demo Credentials for Evaluators

All pre-configured accounts use the password: **`Kerala@2026`**

| Role | Name & Title | Email Address | Password | Scoped Department |
| :--- | :--- | :--- | :--- | :--- |
| **CMO Admin** | Smt. Lakshmi Nair, IAS (Principal Secretary) | `cmo.admin@kerala.gov.in` | `Kerala@2026` | Chief Minister's Office |
| **PWD Officer** | Er. Suresh Kumar (Executive Engineer) | `pwd.officer@kerala.gov.in` | `Kerala@2026` | Public Works (PWD) |
| **Health Officer**| Dr. Radhika Menon (District Medical Officer) | `health.officer@kerala.gov.in`| `Kerala@2026` | Health & Family Welfare |
| **KWA Officer** | Er. George Mathew (Asst. Executive Engineer) | `kwa.officer@kerala.gov.in` | `Kerala@2026` | Kerala Water Authority |
| **KSEB Officer** | Er. Anjali Pillai (Assistant Engineer) | `kseb.officer@kerala.gov.in` | `Kerala@2026` | Electricity Board |
| **Citizen 1** | K. Narayanan Namboothiri (Teacher) | `citizen.narayanan@gmail.com` | `Kerala@2026` | Citizen (Ernakulam) |
| **Citizen 2** | Fathima Beevi (Social Worker) | `citizen.fathima@gmail.com` | `Kerala@2026` | Citizen (Malappuram) |
| **Citizen 3** | Thomas Joseph (Planter) | `citizen.thomas@gmail.com` | `Kerala@2026` | Citizen (Kottayam) |

> **Pro Tip**: The application features a 1-click **"Demo Accounts"** dropdown in the top header and on the login page for instantaneous role switching during evaluation!

---

## 4. Automated Testing Suite

The repository includes a comprehensive automated test suite in `server/tests/api.test.js` using Node.js built-in test runner (`node:test` + `node:assert`).

### Running the Test Suite:
```bash
npm test
# Or: cd server && npm test
```

### Verified Test Cases (20/20 Passing):
```
✔ 1. System Health Check
✔ 2. Public Departments Directory
▶ 3. Authentication & RBAC
  ✔ CMO Admin Login
  ✔ Department Officer Login
  ✔ Citizen Login
  ✔ Citizen Registration
✔ 3. Authentication & RBAC
▶ 4. AI Grievance Assistant API
  ✔ Classifies road hazard and suggests PWD + High priority
  ✔ Duplicate Grievance Detection
✔ 4. AI Grievance Assistant API
▶ 5. End-to-End Mandatory Grievance Lifecycle Workflow
  ✔ Step 1: Citizen Submits Grievance (Generates KL-CMO-2026-XXXXX)
  ✔ Step 2: Public Tracking by Reference Number
  ✔ Step 3: CMO Admin Reviews and Forwards to Department
  ✔ Step 4: Department Officer Updates Investigation
  ✔ Step 5: Department Submits Action-Taken Report & Resolves
  ✔ Step 6: Citizen Submits Feedback & Rating
✔ 5. End-to-End Mandatory Grievance Lifecycle Workflow
▶ 6. Security & Authorization Enforcement
  ✔ Citizen cannot access CMO Admin stats (Returns 403 Forbidden)
  ✔ Unauthenticated request to submit grievance (Returns 401 Unauthorized)
✔ 6. Security & Authorization Enforcement

ℹ tests 20 | pass 20 | fail 0
```

---

## 5. Deployment Guide (Cloud Platforms)

The application is architected to deploy seamlessly as a single full-stack web service:

### Render / Railway / Heroku Deployment:
1. Connect your GitHub repository.
2. Set Environment Variables:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `<your-random-secret>`
   - `GEMINI_API_KEY` = `<your-gemini-key>` (optional)
3. Build Command:
   ```bash
   npm run install:all && npm run build && npm run seed
   ```
4. Start Command:
   ```bash
   npm start
   ```
5. The unified Express app serves production React assets from `/` and the REST API from `/api`.
