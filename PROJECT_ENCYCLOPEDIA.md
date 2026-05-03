# 📘 HireX — AI-Powered Hiring Platform: Complete Project Encyclopedia

> **Document Version:** 2.0 | **Last Updated:** April 2026 | **Status:** Comprehensive Reference

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Objectives](#2-objectives)
3. [System Features](#3-system-features)
4. [System Modules](#4-system-modules)
5. [System Architecture](#5-system-architecture)
6. [Tech Stack](#6-tech-stack)
7. [Workflow & Data Flow](#7-workflow--data-flow)
8. [AI / Intelligence Components](#8-ai--intelligence-components)
9. [Current Implementation Status](#9-current-implementation-status)
10. [UI/UX Structure](#10-uiux-structure)
11. [Database Design](#11-database-design)
12. [Challenges Faced](#12-challenges-faced)
13. [Future Enhancements](#13-future-enhancements)
14. [Conclusion](#14-conclusion)

---

## 1. PROJECT OVERVIEW

### 1.1 Project Title

**HireX — AI-Powered End-to-End Hiring Platform**

### 1.2 Problem It Solves

Traditional recruitment is broken at multiple levels:

- **For Job Seekers:** Applications disappear into a black box. Candidates receive no feedback, cannot track status, and must manually tailor every resume to every job posting — a process that is tedious and error-prone.
- **For Recruiters:** Manually reviewing hundreds of resumes to find the right fit wastes significant time. Scheduling interviews, creating tests, and coordinating multiple candidates requires separate tools and manual effort.
- **For the Industry:** There is no unified platform that handles the full hiring lifecycle — from job posting through AI matching, skill testing, live video interviews, and final hiring decisions — in one integrated system.

HireX addresses all of these pain points simultaneously by providing an intelligent, end-to-end hiring platform powered by multiple AI models and a modern full-stack architecture.

### 1.3 Motivation Behind the Project

The project was motivated by the following real-world observations:

1. **Resume-to-ATS mismatch:** Most Applicant Tracking Systems reject qualified candidates based on keyword mismatches, not actual skill gaps. HireX uses Groq Llama 3 to genuinely analyze and optimize resumes against job descriptions.
2. **Fragmented tools:** Recruiters use separate tools for job posting (LinkedIn), testing (HackerRank), scheduling (Calendly), and video interviews (Zoom). HireX unifies all these workflows in one platform.
3. **No AI shortlisting in SMEs:** Small and Medium Enterprises cannot afford enterprise ATS solutions. HireX provides AI-powered shortlisting using a multi-dimensional scoring algorithm accessible to any recruiter.
4. **Career guidance gap:** Job seekers rarely know what skills they are missing or how to bridge gaps. HireX offers AI-generated career roadmaps and gap-bridging recommendations.

### 1.4 Target Users

| User Role | Description |
|---|---|
| **Job Seeker (Candidate)** | Individuals actively looking for employment. They build profiles, upload resumes, apply for jobs, take skill tests, and attend video interviews. |
| **Recruiter (Provider)** | HR professionals or hiring managers at companies. They post jobs, review applications, run AI shortlisting, create tests, schedule interviews, and make hiring decisions. |
| **Admin** | Platform super-users who oversee the entire ecosystem — managing all users, jobs, and applications system-wide. |

### 1.5 Real-World Relevance

- India's hiring market processes millions of applications annually; automation at scale is a necessity.
- AI-driven hiring reduces bias by scoring candidates on objective, multi-dimensional criteria.
- The platform integrates with **Adzuna** and **Jooble** APIs to surface real live job listings from the Indian market, making it immediately useful beyond internal postings.
- The live coding test environment powered by the **Piston API** replicates the experience of platforms like HackerRank at zero per-user cost.

---

## 2. OBJECTIVES

### 2.1 Primary Objectives

1. Build a full-stack, role-based hiring platform that supports all three user types (candidate, recruiter, admin) with strict data isolation.
2. Implement an AI-powered candidate shortlisting system that scores applicants on five weighted dimensions: skills, experience, seniority, education, and TF-IDF textual relevance.
3. Deliver an integrated live coding assessment environment where candidates write, execute, and submit code that is evaluated against hidden test cases in real time.
4. Integrate a live video interview system (Agora WebRTC) that generates unique tokens and video channels per interview, accessible directly from the platform.
5. Provide AI-driven career growth tools: resume optimization, cover letter generation, career roadmap generation, and skill-gap analysis — all integrated into the candidate dashboard.

### 2.2 Secondary Objectives

1. Implement Redis caching with a session-warmup strategy to deliver near-instant API response times after login.
2. Integrate with live external job boards (Adzuna, Jooble) by aggregating, deduplicating, and presenting real job listings to candidates.
3. Support Google OAuth 2.0 as an alternative login mechanism alongside email/password authentication.
4. Implement an automated interview scheduler using a Break-Aware Round-Robin algorithm that distributes interviews fairly among multiple interviewers.
5. Send automated email notifications (interview invitations) via Nodemailer when interviews are scheduled.
6. Build a fully themeable UI system where recruiters can select and save custom color themes for their experience.

### 2.3 Expected Outcomes

- A production-ready hiring platform capable of handling the complete lifecycle of a job application.
- Demonstrable reduction in recruiter time-on-task through AI shortlisting and automated scheduling.
- Measurable improvement in candidate experience through transparent status tracking, AI résumé tools, and real-time feedback on coding tests.

---

## 3. SYSTEM FEATURES

### 3.1 Authentication System

**Description:** A dual-method authentication system supporting email/password and Google OAuth 2.0.

**Purpose:** Securely identify users and route them to the correct role-specific dashboard.

**How It Works:**
- **Email Registration:** User submits `{ name, email, password, intent }`. The `intent` field ("job" or "employee") maps to the platform role (`job_seeker` or `recruiter`). The password is hashed using `bcryptjs` (salt rounds: 10). A JWT token (7-day expiry) is returned on success.
- **Email Login:** Credentials are verified against the `credentials` table using `bcrypt.compare()`. A JWT is signed with `{ userId, email, role }`.
- **Google OAuth:** Implemented via `passport-google-oauth20`. On successful Google authentication, a JWT is minted and the user is redirected to `/oauth-success?token=<JWT>` on the frontend.
- **Token Validation:** All protected routes use a custom `auth` middleware that verifies the JWT from the `Authorization: Bearer <token>` header. The decoded payload is attached to `req.user`.
- **Session Cache Warmup:** Immediately after login (fire-and-forget), all user-relevant data (profile, company, jobs, applications) is preloaded into Redis so subsequent API calls are served from cache at ~5ms.

---

### 3.2 User Roles and Permissions

**Description:** A strict three-tier role-based access control (RBAC) system.

**Purpose:** Ensure users can only access the data and actions relevant to their role.

**How It Works:**
A `roleGuard(role)` middleware is applied to all protected endpoints. It reads `req.user.role` from the decoded JWT and compares it against the required role. If mismatched, a `403 Forbidden` response is returned.

| Role | Access Level |
|---|---|
| `job_seeker` | Own profile, own applications, own test results, own interviews, AI tools |
| `recruiter` | Own company, own job postings, applicants to own jobs, own tests, own interviews |
| `admin` | All users, all jobs, all applications across the platform |

Data ownership is further enforced at the SQL level — recruiter queries always join against `companies WHERE created_by = $userId` to prevent cross-recruiter data leaks.

---

### 3.3 Resume Upload and Parsing

**Description:** Candidates upload PDF or DOCX resumes which are stored in the database and parsed by AI.

**Purpose:** Enable AI shortlisting engines to read and analyze resume content.

**How It Works:**
- Resumes are uploaded via `multer` middleware and stored in the `uploads/` directory.
- The `pdfService.js` uses `pdf-parse` to extract raw text from PDF files.
- The `groqService.js` `parseResumeWithGroq()` function sends the extracted text to the **Groq Llama 3.3-70b** model which returns a fully structured JSON containing personal info, skills, experience, education, projects, and achievements.
- Parsed data is used to auto-fill the candidate's profile, saving manual data entry.
- The `candidate_resumes` table stores resume metadata (name, upload date, file reference).

---

### 3.4 Job Posting

**Description:** Recruiters create detailed job postings with requirements, screening questions, and expectations.

**Purpose:** Define open positions that candidates can discover and apply for.

**How It Works:**
- Recruiter submits a rich job payload including: `job_title`, `department`, `job_type`, `experience_level`, `location`, `salary_min/max`, `job_description`, `required_skills`, `required_education`, plus arrays of `requirements[]` and `questions[]`.
- A database transaction (`BEGIN/COMMIT`) simultaneously inserts into `job_postings`, `job_requirements`, `job_questions`, and `job_expectations` tables.
- Each question can have an `expected_answer` field, visible only to the recruiter during evaluation.
- Jobs have a `status` lifecycle: `Open → Closed → Deleted` (soft delete only — preserves application history).
- After posting, the recruiter's Redis cache is invalidated to ensure the new job appears immediately.

---

### 3.5 Matching System (AI Shortlisting)

**Description:** An AI-powered multi-dimensional scoring engine that ranks candidates for a given job.

**Purpose:** Replace manual resume screening with an objective, weighted scoring algorithm.

**How It Works — Five-Dimension Composite Score:**

| Dimension | Weight | Logic |
|---|---|---|
| **Skill Score** | 40% | Checks required skills against candidate profile array, resume text, and education fields using skill alias normalization |
| **Experience Score** | 20% | Extracts years-of-experience from resume via regex and compares to job requirement |
| **Seniority Score** | 15% | Detects seniority level keywords (junior/mid/senior/executive) in both job and resume |
| **Education Score** | 10% | Maps degree names to a 4-level hierarchy (Certificate → Diploma → Bachelor → Master → PhD) |
| **TF-IDF Score** | 15% | Computes cosine similarity between job description and resume text using the `natural` NLP library |

After scoring, Google Gemini 1.5 Flash generates a 2-sentence AI narrative explaining why the candidate scored that percentage. The final ranked list is returned to the recruiter's **Auto-Shortlist** panel.

---

### 3.6 Assessment Module — MCQ Tests

**Description:** Recruiters create multi-choice question tests and assign them to candidates.

**Purpose:** Evaluate candidate domain knowledge before the interview stage.

**How It Works:**
- Recruiter creates a test with multiple questions (MCQ, True/False, Short Answer types).
- Each question has a `theme/topic` for categorization.
- Tests are assigned to specific applicants via the `test_assignments` table.
- Candidates see assigned tests in their "My Tests" dashboard. They attempt the test within a time limit.
- Submissions are auto-graded server-side by comparing answers against the stored `correct_answer`.
- Results are stored in `test_attempts`. Recruiters can view per-candidate scores.

---

### 3.7 Assessment Module — Live Coding Tests

**Description:** Recruiters create algorithmic coding challenges with test cases. Candidates write and execute code in a browser-based IDE.

**Purpose:** Evaluate practical programming skills with automated, objective grading.

**How It Works:**
- Recruiter creates a `coding_test` with one or more `coding_questions`. Each question has visible and hidden `test_cases`.
- Published tests become available to all candidates who have applied to the linked job.
- Candidates use a Monaco Editor (VS Code engine) in the browser to write code in Python 3, C++, JavaScript (Node.js), or Java.
- On "Run", code is sent to the **Piston API** (`emkc.org/api/v2/piston`) which executes it in a sandboxed environment and returns `stdout`/`stderr`.
- On "Submit", code is evaluated against **all** test cases (including hidden ones). Scores are calculated per question. Results can be published by the recruiter.
- Concurrency is limited to 3 parallel Piston API calls via `p-limit` to respect rate limits.

---

### 3.8 Interview Scheduling

**Description:** Recruiters schedule video interviews for shortlisted candidates, supporting both manual and AI-automated scheduling.

**Purpose:** Streamline the interview coordination process for both parties.

**How It Works:**
- **Manual:** Recruiter selects a candidate, picks a date/time, and the system creates an `interviews` record with a unique `channel_name`. A meeting link (`/interview/<channel_name>`) is generated.
- **Auto-Schedule:** Recruiter provides a list of interviewers, a date, start time, slot duration, and break frequency. The **Break-Aware Round-Robin algorithm** (Fisher-Yates shuffle + modulo round-robin) distributes all eligible AI-shortlisted candidates among interviewers with automatic break insertion.
- **Email Notification:** After scheduling, the recruiter can send an interview invitation email to the candidate via Nodemailer (SMTP).
- **Agora Video Call:** On the interview day, both recruiter and candidate click "Join Interview" which calls the `/api/interviews/join` endpoint. This generates an **Agora RTC token** (valid for the channel). Both parties enter an `InterviewRoom.jsx` page powered by `agora-rtc-sdk-ng`.

---

### 3.9 AI Tools Suite

**Description:** A collection of AI-powered utilities available to candidates for career development.

**Purpose:** Help candidates stand out and close skill gaps using generative AI.

| Tool | AI Model | Output |
|---|---|---|
| **Resume Optimizer** | Groq Llama 3.3-70b | Match score, missing skills, ATS-optimized rewrite |
| **Match Analyzer** | Groq Llama 3.3-70b | Match %, skill gap analysis, gap-bridging project recommendations, learning resources |
| **Cover Letter Generator** | Google Gemini Flash | Personalized 350-word cover letter + downloadable PDF |
| **Career Roadmap Generator** | Groq Llama 3.3-70b | React Flow graph with 6–10 milestone nodes, learning resources, estimated time per node |
| **Recommended Jobs** | Adzuna + Jooble APIs | Up to 30 jobs matched to candidate's top 5 skills |
| **AI Chatbot** | Groq Llama 3 | General career and platform Q&A assistant |

---

### 3.10 External Job Discovery

**Description:** Aggregates real live job listings from Adzuna and Jooble APIs.

**Purpose:** Show candidates real-world job opportunities beyond internal postings.

**How It Works:**
- Candidate visits "Jobs in India" page and searches by location, role, type, and experience.
- Backend makes parallel API calls to Adzuna (REST) and Jooble (POST with JSON body).
- Results are merged and deduplicated using a `title_company_location` signature.
- Adzuna results take priority in deduplication. Final unified list is returned with source attribution.

---

### 3.11 Dashboards

**Description:** Role-specific dashboards providing a summary of all relevant data at a glance.

**Candidate Dashboard:** Application history with status tracking, upcoming interviews, assigned tests, AI tools shortcuts, recommended jobs feed.

**Recruiter Dashboard:** Active job count, total applications, interview pipeline summary, recent applicant activity, per-job analytics.

**Admin Dashboard:** Platform-wide user counts, total jobs, application statistics, direct management panels for users, jobs, and applications.

---

### 3.12 Company Profiles

**Description:** Recruiters create and manage a company profile before they can post jobs.

**Purpose:** Associate all job postings and applications with a verified company entity.

**How It Works:** Company data (name, description, logo, location, website) is stored in the `companies` table. The company logo is stored as binary in PostgreSQL and served as a base64-encoded data URL. Company creation gates job posting — a recruiter without a company profile cannot post jobs.

---

### 3.13 Theme System

**Description:** A fully customizable UI theme engine for recruiters.

**Purpose:** Allow recruiters to personalize their dashboard appearance.

**How It Works:** Predefined themes (color palettes, gradients) are stored in the `ui_themes` table. Recruiters select their preferred theme from a gallery on the `ThemesSettings.jsx` page. The selected theme is persisted to the backend via `/api/themes` and applied globally via CSS custom properties on subsequent logins.

---

## 4. SYSTEM MODULES

### 4.1 User Management Module

**Responsibilities:** Registration, login, JWT issuance, Google OAuth, user profile retrieval, Redis session caching.

**Inputs:** User credentials, Google OAuth token, JWT in Authorization header.

**Outputs:** JWT token, user object (role, email, name), 401/403 errors.

**Internal Workflow:**
1. Client sends credentials → `auth.js` validates format → queries `credentials` table → bcrypt verify → JWT sign → return token.
2. On any protected route: `auth` middleware extracts JWT from header → `jwt.verify()` → attach `req.user` → proceed to route handler.
3. Post-login: `warmupSessionCache()` fires asynchronously, preloading user/company/jobs/applications into Redis.

---

### 4.2 Job Management Module

**Responsibilities:** Create, read, update, delete (soft) job postings. Handle requirements, questions, and expectations as related data.

**Inputs:** Recruiter JWT, job payload (title, skills, description, requirements array, questions array).

**Outputs:** Created job ID, job list, job detail with joined company/requirements/questions data.

**Internal Workflow:**
1. POST `/api/jobs` → verify recruiter role → resolve company ID → BEGIN transaction → insert job_postings + job_requirements + job_questions + job_expectations → COMMIT → invalidate Redis cache.
2. GET `/api/jobs/recruiter` → check Redis cache → on miss, query PostgreSQL with company JOIN → store in Redis → return.
3. Soft delete: sets `status = 'deleted'`, never removes rows, preserving referential integrity for existing applications.

---

### 4.3 Application Management Module

**Responsibilities:** Handle job applications, track status transitions, store resume references, expose data to recruiter for review.

**Inputs:** Candidate JWT, job ID, resume upload, application question answers.

**Outputs:** Application confirmation, application list with candidate details, status update confirmations.

**Internal Workflow:**
1. Candidate submits application → `multer` processes resume → resume stored in `candidate_resumes` → `job_applications` row inserted with `status = 'pending'`.
2. Application status lifecycle: `pending → reviewed → shortlisted_for_test → interview → hired / rejected`.
3. Recruiter fetches applicants per job → gets candidate details via JOIN across `job_applications`, `candidates`, `candidate_resumes`, `companies`.

---

### 4.4 AI Shortlisting Engine (Auto-Shortlist Module)

**Responsibilities:** Score and rank all applicants for a job posting using a five-dimension weighted algorithm + Gemini AI narrative.

**Inputs:** Job ID (recruiter-owned), applications with resume data, job metadata (skills, education, description).

**Outputs:** Ranked list of `{ application_id, match_score, explanation: { breakdown, aiNarrative, matchedSkills, missingSkills } }`.

**Internal Workflow:**
1. Recruiter triggers shortlisting for a job → backend fetches all non-rejected applications with resume data.
2. For each application: parse resume PDF → normalize skills → compute 5 dimension scores → weighted sum → call Gemini for narrative.
3. Results sorted descending by `match_score` → returned to recruiter → recruiter can bulk-approve top N candidates.
4. Approved candidates have `shortlisted_by_ai = true` set, making them eligible for auto-interview scheduling.

---

### 4.5 Assessment Module

**Responsibilities:** Create/manage quiz-style MCQ tests (testRoutes.js) and live coding tests (codingRoutes.js), handle assignment, attempt, submission, and result publishing.

**Inputs:** Recruiter JWT (create/publish), candidate JWT (attempt/submit), test ID, question responses, source code + language.

**Outputs:** Test details, attempt records, scores, pass/fail per test case, published results.

**Internal Workflow (Coding):**
1. Recruiter creates coding test with questions and test cases → status `draft`.
2. Recruiter publishes test → status `published` → visible to eligible candidates.
3. Candidate fetches test → sees questions + visible sample test cases.
4. Candidate submits code → backend calls Piston API per test case (sequential, 300ms delay) → compare normalized output → calculate score → store in `coding_submissions`.
5. Recruiter publishes results → candidate can view score breakdown.

---

### 4.6 Interview Module

**Responsibilities:** Create interview records, schedule them (manual or auto), send email notifications, generate Agora video tokens, manage interview status.

**Inputs:** Recruiter JWT, job ID, candidate ID, date/time, interviewer list (for auto-schedule); candidate JWT for joining.

**Outputs:** Interview record with `channel_name`, `meeting_link`, Agora RTC token for joining.

**Internal Workflow:**
1. Recruiter selects candidate for interview → `interviews` record created with `status = 'pending'`.
2. Manual scheduling: recruiter sets date/time → `status = 'scheduled'` → meeting link generated.
3. Auto-scheduling: Round-Robin algorithm assigns time slots → bulk DB update → all application statuses updated to `'interview'`.
4. Email: Nodemailer sends HTML email with interview details + meeting link.
5. Joining: Both parties request Agora token → `agora-access-token` SDK generates RTC token with channel → passed to frontend `agora-rtc-sdk-ng`.

---

### 4.7 Admin Module

**Responsibilities:** Platform-wide oversight, user management (suspend/activate), job oversight, application overview.

**Inputs:** Admin JWT.

**Outputs:** Aggregate statistics, full user list, all jobs, all applications across all recruiters.

**Internal Workflow:**
All admin routes are guarded by `roleGuard('admin')`. Queries do not filter by `company_id` or `user_id`, giving full visibility. Admin can change user status, view any job, and inspect any application.

---

### 4.8 External Job Aggregation Module

**Responsibilities:** Fetch, merge, deduplicate, and serve live job listings from Adzuna and Jooble.

**Inputs:** Search parameters (location, role, page), candidate skills (for recommended jobs).

**Outputs:** Unified job list with source attribution, total count, pagination info.

**Internal Workflow:**
- `jobs.js /india` endpoint: parallel `Promise.all([fetchAdzunaJobs, fetchJoobleJobs])` → merge → deduplicate by signature → return.
- `recommendedJobsService.js`: fetches candidate profile → uses top 5 skills as individual search terms → parallel fetch per skill per API → flatten → deduplicate → return top 30.

---

## 5. SYSTEM ARCHITECTURE

### 5.1 Overall Architecture

HireX follows a **decoupled client-server architecture** with a clear separation between the React SPA frontend and the Express.js REST API backend. Both are independently deployable.

```
┌─────────────────────────────────────────────┐
│              CLIENT (Browser)               │
│   React 18 + Vite + TailwindCSS + Framer   │
│          SPA — Role-Based Routing           │
└───────────────────┬─────────────────────────┘
                    │ HTTPS REST API
                    │ JWT Bearer Token
┌───────────────────▼─────────────────────────┐
│           BACKEND (Node.js / Express)        │
│    19 Route Modules + 15 Service Modules    │
│     JWT Auth + RBAC + Redis Cache Layer     │
└──────┬───────────────┬────────────────┬─────┘
       │               │                │
┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
│  PostgreSQL │ │    Redis    │ │ External    │
│  (NeonDB)   │ │  (Cache)    │ │ APIs        │
│  Primary DB │ │  Session/   │ │ Groq/Gemini │
│             │ │  Data Cache │ │ Adzuna/Jooble│
└─────────────┘ └─────────────┘ │ Piston/Agora│
                                 └─────────────┘
```

### 5.2 Frontend Architecture

- **Framework:** React 18 (Vite build tool)
- **Routing:** React Router v6 with nested routes and layout components per role
- **State:** React Context API (`AuthContext`) for global auth state
- **Styling:** TailwindCSS 3 + custom CSS variables + framer-motion animations
- **Code Editor:** Monaco Editor (`@monaco-editor/react`) for coding tests
- **3D/Particles:** Three.js (`@react-three/fiber`) + tsParticles for landing page
- **Charts:** Recharts for dashboard analytics
- **Drag & Drop:** `@dnd-kit/core` for UI interactions
- **Video Graph:** React Flow (`reactflow`) for career roadmap visualization

**Route Structure:**
```
/                    → Landing.jsx
/login               → AuthForm
/register            → AuthForm
/user/*              → UserLayout (job_seeker routes)
/provider/*          → ProviderLayout (recruiter routes)
/admin/*             → AdminLayout (admin routes)
/interview/:channel  → InterviewRoom.jsx
/themes              → ThemesSettings.jsx
```

### 5.3 Backend Architecture

- **Framework:** Express.js 4 (ESM modules, `"type": "module"`)
- **Entry Point:** `server.js` — mounts all 19 route modules, configures CORS, body parsing, Passport initialization, and static file serving.
- **Middleware Layer:** `auth.js` (JWT verify), `roleGuard.js` (RBAC), Express rate limiter
- **Service Layer:** 15 service modules encapsulating all business logic (AI, external APIs, algorithms, email)
- **Config Layer:** `db.js` (Neon PostgreSQL pool), `redis.js` (Redis client), `passport.js` (Google OAuth strategy)

### 5.4 API Structure

All API endpoints follow the pattern `/api/<resource>/<action>`.

| Prefix | Module | Description |
|---|---|---|
| `/api/auth` | auth.js | Register, login, /me, Google OAuth |
| `/api/jobs` | jobs.js | CRUD for job postings + external jobs |
| `/api/candidates` | candidates.js | Candidate profile CRUD |
| `/api/` | applications.js | Apply, track, manage applications |
| `/api/dashboard` | dashboard.js | Role-specific dashboard stats |
| `/api/ai` | ai.js, aiToolsRoutes.js | Resume scoring, gap analysis |
| `/api/ai/resume` | aiResumeRoutes.js | Resume optimize + match analyze |
| `/api/ai/cover-letter` | aiCoverLetterRoutes.js | Cover letter generation |
| `/api/ai/recommended-jobs` | recommendedJobsRoutes.js | Skill-based job recommendations |
| `/api/career-roadmap` | careerRoadmapRoutes.js | Roadmap generation |
| `/api/chatbot` | chatbotRoutes.js | AI Q&A assistant |
| `/api/companies` | companies.js | Company profile CRUD |
| `/api/interviews` | interviewRoutes.js | Full interview lifecycle |
| `/api/tests` | testRoutes.js | MCQ test CRUD + assignments |
| `/api/coding` | codingRoutes.js | Coding tests + Piston execution |
| `/api/profile-image` | profileImage.js | Profile photo upload |
| `/api/admin` | adminRoutes.js | Admin CRUD operations |
| `/api/themes` | themeRoutes.js | UI theme management |

### 5.5 Caching Strategy (Redis)

Redis is used as a read-through cache layer with explicit TTL values:

| Cache Key Pattern | TTL | Data Cached |
|---|---|---|
| `user:<id>` | 30 min | User profile row |
| `company:<userId>` | 60 min | Company profile |
| `recruiter_jobs:<userId>` | 15 min | Job list for recruiter |
| `recruiter_applications:<userId>` | 10 min | Full application list |
| `provider_dashboard:<userId>` | 10 min | Dashboard stats |

Cache is invalidated on mutations (new job, status update, etc.) using `deleteCache()`.

---

## 6. TECH STACK

### 6.1 Frontend Technologies

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | Core UI framework |
| Vite | 6.0.1 | Build tool and dev server |
| React Router DOM | 6.28.0 | Client-side routing |
| TailwindCSS | 3.4.15 | Utility-first CSS framework |
| Framer Motion | 12.35.0 | Animations and transitions |
| Monaco Editor | 4.7.0 | In-browser code editor (VS Code engine) |
| Recharts | 3.8.0 | Dashboard charts and analytics |
| React Flow | 11.11.4 | Career roadmap graph visualization |
| Three.js / R3F | 0.183.2 | 3D landing page effects |
| tsParticles | 3.9.1 | Particle effects |
| Agora RTC SDK | 4.24.2 | WebRTC video calling |
| Axios | 1.13.2 | HTTP client |
| Lucide React | 0.468.0 | Icon library |
| DnD Kit | 6.3.1 | Drag-and-drop interactions |

### 6.2 Backend Technologies

| Technology | Version | Purpose |
|---|---|---|
| Node.js | v20+ | Runtime environment |
| Express.js | 4.18.2 | Web framework |
| PostgreSQL (`pg`) | 8.18.0 | Primary relational database |
| `@neondatabase/serverless` | 1.0.2 | NeonDB serverless PostgreSQL driver |
| Redis | 5.11.0 | In-memory cache layer |
| JWT (`jsonwebtoken`) | 9.0.2 | Stateless authentication tokens |
| bcryptjs | 2.4.3 | Password hashing |
| Passport.js + Google OAuth | 0.7.0 | OAuth 2.0 authentication |
| Multer | 2.0.2 | Multipart file upload handling |
| Nodemailer | 8.0.1 | Email delivery (SMTP) |
| pdf-parse | 1.1.1 | PDF text extraction |
| mammoth | 1.11.0 | DOCX text extraction |
| pdf-lib / pdfkit | 1.17.1 / 0.17.2 | PDF generation |
| natural | 8.1.0 | NLP (TF-IDF, tokenization) |
| axios | 1.13.3 | External API calls |
| p-limit | 7.3.0 | Concurrency limiting |
| ws | 8.20.0 | WebSocket support |
| agora-access-token | 2.0.4 | Agora video token generation |
| nodemon | 3.0.2 | Auto-restart in development |

### 6.3 AI / ML Tools

| Service | Model | Usage |
|---|---|---|
| **Groq API** | Llama 3.3-70b-versatile | Resume optimization, match analysis, resume parsing, career roadmap, chatbot |
| **Google Gemini** | gemini-1.5-flash / gemini-flash-latest | AI shortlisting narrative, cover letter generation |
| **Natural (NLP)** | TF-IDF, WordTokenizer | Cosine similarity scoring for candidate-job matching |

### 6.4 External APIs

| API | Purpose |
|---|---|
| **Adzuna Jobs API** | Real job listings for India |
| **Jooble API** | Additional real job listings |
| **Piston API** (emkc.org) | Sandboxed code execution for coding tests |
| **Agora RTC** | Live video interview channels and token generation |
| **Google OAuth 2.0** | Social login |

### 6.5 Database

- **Primary:** PostgreSQL hosted on **NeonDB** (serverless, auto-suspend on free tier)
- **Cache:** Redis (configured via `REDIS_URL` environment variable)

### 6.6 Dev Tools

- `nodemon` — hot reload for backend development
- ESLint — frontend code linting
- PostCSS + Autoprefixer — CSS processing
- Vite `--host` flag — LAN access during development

---

## 7. WORKFLOW & DATA FLOW

### 7.1 Job Seeker Journey

```
1. REGISTER
   └─ Visit /register → Select "I'm looking for a job" (intent: "job")
   └─ Backend creates credentials row with role = "job_seeker"
   └─ JWT issued → Redirected to /user/dashboard

2. COMPLETE PROFILE
   └─ Visit /user/profile → Fill name, location, skills, experience, education
   └─ Upload resume PDF → AI parses and auto-fills fields
   └─ Profile saved to candidates table

3. DISCOVER JOBS
   └─ /user/jobs → Browse internal platform jobs (job_postings table)
   └─ /user/jobs-in-india → Search Adzuna + Jooble live results
   └─ /user/recommended → AI-matched jobs based on profile skills

4. APPLY
   └─ Click "Apply" on job → Upload resume → Answer screening questions
   └─ job_applications row created, status = "pending"

5. TRACK APPLICATION
   └─ /user/applications → See all applications with current status
   └─ Statuses: Pending → Reviewed → Test Assigned → Interview → Hired/Rejected

6. TAKE ASSESSMENT
   └─ /user/my-tests → Lists MCQ tests assigned by recruiter
   └─ /user/coding → Lists coding tests for applied jobs
   └─ Write code in Monaco Editor → Run against sample cases → Submit → Evaluated via Piston

7. ATTEND INTERVIEW
   └─ /user/interviews → See scheduled interviews with date/time/link
   └─ Click "Join" → Agora token generated → Enter InterviewRoom
   └─ Video call with recruiter via WebRTC

8. USE AI TOOLS
   └─ /user/ai-actions → Resume Optimizer, Match Analyzer, Cover Letter, Career Roadmap, Chatbot
```

### 7.2 Recruiter Journey

```
1. REGISTER & SETUP
   └─ Register with intent "employee" → role = "recruiter"
   └─ Create company profile (name, logo, location) — required to post jobs

2. POST JOB
   └─ /provider/jobs → Create job with full details, requirements, screening questions
   └─ Transaction inserts job_postings + job_requirements + job_questions

3. REVIEW APPLICATIONS
   └─ /provider/applicants → View all applicants per job with AI match scores
   └─ Filter by status, view resumes, read answers to screening questions

4. AI SHORTLISTING
   └─ /provider/auto-shortlist → Select job → Run AI scoring
   └─ All resumes scored on 5 dimensions → Ranked list returned
   └─ Recruiter approves top candidates → shortlisted_by_ai = true

5. CREATE & ASSIGN TESTS
   └─ /provider/tests → Create MCQ tests and assign to applicants
   └─ /provider/coding → Create coding tests, publish, view results
   └─ View per-candidate scores and code submissions

6. SCHEDULE INTERVIEWS
   └─ /provider/interview-scheduler → Manual: pick candidate + date/time
   └─ Auto-schedule: enter interviewers + config → Round-Robin algorithm runs
   └─ Send email invitations with Nodemailer

7. CONDUCT INTERVIEW
   └─ /provider/interviews → List with Join button
   └─ Click Join → Agora token → InterviewRoom video call

8. MAKE DECISION
   └─ Update application status to "hired" or "rejected"
   └─ Hired candidates move out of active pipeline
```

### 7.3 System Data Flow

```
Client Request
     │
     ▼
Express Router (server.js)
     │
     ▼
auth Middleware (JWT verify)
     │
     ▼
roleGuard Middleware (RBAC check)
     │
     ▼
Route Handler
     │
     ├─► Redis Cache? ──YES──► Return cached response
     │        │NO
     │        ▼
     │   PostgreSQL Query (Neon)
     │        │
     │        ▼
     │   Store in Redis (TTL)
     │        │
     ▼        ▼
     Response to Client
```

---

## 8. AI / INTELLIGENCE COMPONENTS

### 8.1 Groq Llama 3.3-70b (Primary AI — groqService.js)

**Model:** `llama-3.3-70b-versatile` via Groq Cloud API

**Three primary functions:**

**A) `optimizeResumeWithGroq(resumeText, jobData)`**
- System role: ATS resume optimization engine
- Analyzes resume against job description, identifies skill/education gaps
- Returns structured JSON: `match_score`, `missing_required_skills`, `missing_preferred_skills`, `experience_gap`, `suggestions`, and a fully `optimized_resume` object
- Temperature: 0.2 (deterministic, structured output)

**B) `analyzeMatchWithGroq(resumeText, jobData)`**
- System role: Career Coach and Technical Recruiter
- Returns: `match_percentage`, `skill_analysis` (matching + missing), `culture_fit_analysis`, `gap_bridging` (per missing skill: recommended project + learning resources), `overall_reasoning`
- Temperature: 0.3

**C) `parseResumeWithGroq(resumeText)`**
- Uses a dedicated API key (`GROQ_API_KEY_RESUME`) to avoid rate limits
- Extracts: `personal_info`, `skills[]`, `experience[]`, `education[]`, `projects[]`, `achievements[]`
- Temperature: 0.1 (maximum structure fidelity)
- All three use `response_format: { type: 'json_object' }` for guaranteed JSON output

### 8.2 Google Gemini (AI Shortlisting Narrative — aiShortlistService.js)

**Model:** `gemini-1.5-flash` via `@google/generative-ai` SDK

**Function:** `generateAiNarrative(jobTitle, score, breakdown)`
- After the 5-dimension score is computed, Gemini generates a 2-sentence professional narrative explaining the candidate's suitability
- Prompt includes all dimension scores as context
- Has graceful fallback to a static message if the API key is missing or the call fails

### 8.3 Gemini Flash for Cover Letter (aiCoverLetterService.js)

**Model:** `gemini-flash-latest`

**Function:** `generateCoverLetter(candidateId, jobId, tone)`
- Fetches candidate profile and job data from PostgreSQL
- Computes skill match analysis (matched/missing skills, match %)
- Constructs a detailed prompt with candidate data, job data, and match analysis
- Gemini generates a ≤350-word, professional cover letter body
- Validates output (rejects if <100 chars or contains placeholder text)
- Falls back to a template-based cover letter if AI fails
- Saves to `generated_cover_letters` table + generates PDF via `pdfService.js`

### 8.4 Multi-Dimensional Scoring Algorithm (aiShortlistService.js)

**Core Logic — Five Dimension Calculations:**

```
Final Score = (SkillScore × 0.40) + (ExperienceScore × 0.20)
            + (SeniorityScore × 0.15) + (EducationScore × 0.10)
            + (TF-IDF Score × 0.15)
```

**Skill Score:** Normalizes skills using an alias dictionary (e.g., "js" → "javascript", "k8s" → "kubernetes"). Checks candidate profile array (weight 1.0), then resume text (weight 0.6). Outputs 0–100.

**TF-IDF Score:** Uses `natural.TfIdf` to build term-frequency vectors for the job description (with required skills repeated 3× for boost) and the candidate résumé. Computes cosine similarity.

**Education Score:** Maps degree names to a 4-level numeric hierarchy. Compares candidate degree level to required level. Partial credit given for one level below requirement.

**Seniority Score:** Keyword matching (e.g., "senior", "lead", "5+ years") to assign a level. Scored 100/60/20 based on level distance.

### 8.5 Career Roadmap AI (careerRoadmapService.js)

**Model:** `llama-3.3-70b-versatile` (via a dedicated `GROQ_API_KEY_CAREER` key)

**Output Format:** React Flow-compatible JSON `{ nodes[], edges[] }` where each node has `id`, `data.label`, `data.description`, `data.resources[]`, `data.estimated_time`, and `position { x, y }`. The AI is instructed to arrange nodes as a "Metro Map" style progression.

### 8.6 Limitations

- Groq API has rate limits (tokens per minute). Separate API keys are used per use-case (main, resume parsing, career roadmap) to distribute load.
- Piston API limits concurrent executions; `p-limit(3)` and 300ms sequential delays mitigate this.
- Gemini narrative generation adds latency (~1–2s per candidate) during bulk AI shortlisting.
- PDF parsing can fail for image-based PDFs (scanned documents). The system falls back to raw buffer string conversion.
- The TF-IDF score alone is unreliable for short resumes; the weighted composite mitigates this.

---

## 9. CURRENT IMPLEMENTATION STATUS

### 9.1 Completed Features ✅

| Feature | Status |
|---|---|
| Email/Password Authentication | ✅ Complete |
| Google OAuth 2.0 Login | ✅ Complete |
| JWT + Role-Based Access Control | ✅ Complete |
| Redis Session Caching + Warmup | ✅ Complete |
| Candidate Profile (CRUD + Resume Upload) | ✅ Complete |
| Job Posting (Full CRUD + Requirements + Questions) | ✅ Complete |
| Job Application Flow | ✅ Complete |
| Application Status Tracking (Candidate View) | ✅ Complete |
| Applicant Management (Recruiter View) | ✅ Complete |
| AI Shortlisting (5-Dimension Scoring + Gemini Narrative) | ✅ Complete |
| Groq Resume Optimization | ✅ Complete |
| Groq Resume Match Analyzer + Gap Bridging | ✅ Complete |
| Gemini Cover Letter Generator + PDF Export | ✅ Complete |
| Groq Career Roadmap (React Flow) | ✅ Complete |
| AI Chatbot | ✅ Complete |
| MCQ Test Creation + Assignment + Attempt + Grading | ✅ Complete |
| Live Coding Tests (Monaco + Piston API) | ✅ Complete |
| Coding Test Results + Publishing | ✅ Complete |
| Interview Scheduling (Manual + Auto Round-Robin) | ✅ Complete |
| Interview Email Notifications (Nodemailer) | ✅ Complete |
| Agora WebRTC Video Interview Room | ✅ Complete |
| External Job Discovery (Adzuna + Jooble + Dedup) | ✅ Complete |
| AI Recommended Jobs (Skill-based) | ✅ Complete |
| Company Profile (+Logo Upload) | ✅ Complete |
| Profile Image Upload | ✅ Complete |
| Admin Dashboard (Users/Jobs/Applications) | ✅ Complete |
| Theme System (UI Customization) | ✅ Complete |
| NeonDB PostgreSQL Integration | ✅ Complete |
| Candidate Resume Parsing (AI Auto-fill) | ✅ Complete |

### 9.2 Partially Implemented 🔄

| Feature | Status |
|---|---|
| Real-time Notifications | 🔄 Backend table exists; frontend polling partially wired |
| WebSocket Integration | 🔄 `ws` dependency installed; WebSocket for real-time features not fully deployed |
| Resume Scoring Service | 🔄 Service file complete; not all frontend UI paths use it |

### 9.3 Planned / Future Work 📋

| Feature | Status |
|---|---|
| Full real-time notification system (WebSockets) | 📋 Planned |
| Interview feedback forms post-call | 📋 Planned |
| Resume version history and comparison | 📋 Planned |
| Bulk CSV export of candidate data for recruiters | 📋 Planned |
| Advanced analytics (hiring funnel, time-to-hire) | 📋 Planned |
| Mobile-responsive app (React Native) | 📋 Planned |
| Multi-language support (i18n) | 📋 Planned |

---

## 10. UI/UX STRUCTURE

### 10.1 Landing Page (`Landing.jsx`)

A visually rich, animated marketing page featuring:
- Three.js 3D particle effects and tsParticles animations
- Hero section with platform value proposition
- Feature highlights with animated cards
- Registration CTA with role selection

### 10.2 Authentication Pages

- `/login` — Email/password login + "Continue with Google" button
- `/register` — Name, email, password, role intent selector (Job Seeker / Recruiter)
- `/oauth-success` — Token receiver for Google OAuth callback

### 10.3 Job Seeker Pages (`/user/*`)

| Route | Component | Purpose |
|---|---|---|
| `/user/dashboard` | UserDashboard.jsx | Application stats, upcoming interviews, recent activity |
| `/user/profile` | Profile.jsx | Full profile editor with AI resume import |
| `/user/jobs` | JobDiscovery.jsx | Browse and filter internal platform jobs |
| `/user/jobs-in-india` | JobsInIndia.jsx | Search Adzuna + Jooble live jobs |
| `/user/recommended` | RecommendedJobs.jsx | AI-matched jobs by skills |
| `/user/applications` | ApplicationTracker.jsx | Full application history + status |
| `/user/interviews` | InterviewsPage.jsx | Scheduled interviews with Join button |
| `/user/my-tests` | MyTestsPage.jsx | Assigned MCQ tests |
| `/user/test/:id` | TestAttemptPage.jsx | Test taking interface |
| `/user/test-result/:id` | TestResultPage.jsx | Post-test score breakdown |
| `/user/coding` | CandidateCodingDashboard.jsx | Assigned coding tests |
| `/user/coding/:id` | CodingTestAttempt.jsx | Monaco Editor + test execution |
| `/user/coding-result/:id` | CodingResultPage.jsx | Per-question score breakdown |
| `/user/ai-actions` | AIActions.jsx | Full AI tools suite |

### 10.4 Recruiter Pages (`/provider/*`)

| Route | Component | Purpose |
|---|---|---|
| `/provider/dashboard` | ProviderDashboard.jsx | KPIs, pipeline overview, activity |
| `/provider/company` | CompanyProfile.jsx | Company info + logo |
| `/provider/jobs` | JobPosting.jsx | Create/edit/manage job listings |
| `/provider/applicants` | ApplicantManagement.jsx | Per-job applicant review |
| `/provider/auto-shortlist` | AutoShortlist.jsx | AI scoring + shortlisting panel |
| `/provider/interview-scheduler` | InterviewScheduler.jsx | Manual + auto-schedule interviews |
| `/provider/interviews` | InterviewsPage.jsx | All interviews with status + join |
| `/provider/tests` | TestsPage.jsx | MCQ test creation + management |
| `/provider/coding` | CodingTestsPage.jsx | Coding test creation + results |
| `/provider/ai-tools` | AITools.jsx | Resume scoring + shortlisting tools |

### 10.5 Admin Pages (`/admin/*`)

| Route | Component | Purpose |
|---|---|---|
| `/admin/dashboard` | AdminDashboard.jsx | Platform-wide statistics |
| `/admin/users` | UserManagement.jsx | View/manage all users |
| `/admin/jobs` | JobManagement.jsx | View/manage all jobs |
| `/admin/applications` | ApplicationManagement.jsx | View all applications |

### 10.6 Shared Pages

| Route | Component | Purpose |
|---|---|---|
| `/interview/:channel` | InterviewRoom.jsx | Agora video call room |
| `/themes` | ThemesSettings.jsx | UI theme gallery + selection |

### 10.7 Key UX Interactions

- **Real-time code execution** in Monaco Editor with visible test case pass/fail feedback
- **Drag-and-drop** interview scheduling calendar interface
- **AI score visualization** — animated progress bars per scoring dimension
- **Smooth page transitions** via Framer Motion
- **Glassmorphism cards** on dashboard for modern premium look
- **Responsive design** across desktop breakpoints

---

## 11. DATABASE DESIGN

### 11.1 Core Tables

| Table | Primary Key | Description |
|---|---|---|
| `credentials` | UUID | Auth users (email, password_hash, role, google_id) |
| `candidates` | UUID | Job seeker profiles (skills, experience, education) |
| `companies` | UUID | Recruiter company profiles |
| `job_postings` | BIGINT (SERIAL) | Job listings with all metadata |
| `job_requirements` | UUID | Per-job requirement bullets |
| `job_questions` | UUID | Per-job screening questions |
| `job_expectations` | UUID | Expected experience/education per job |
| `job_applications` | UUID | Application records linking candidate ↔ job |
| `candidate_resumes` | UUID | Resume file references per candidate |

### 11.2 Assessment Tables

| Table | Primary Key | Description |
|---|---|---|
| `test_definitions` | UUID | MCQ test metadata |
| `test_questions` | UUID | MCQ questions with options |
| `test_assignments` | UUID | Recruiter → Candidate test assignments |
| `test_attempts` | UUID | Candidate attempt + answers + score |
| `coding_tests` | UUID | Coding test metadata (time limit, marks) |
| `coding_questions` | UUID | Problem statements + formats + constraints |
| `test_cases` | UUID | Input/expected_output per coding question |
| `coding_submissions` | UUID | Candidate source code + score + test case results |

### 11.3 Interview Tables

| Table | Primary Key | Description |
|---|---|---|
| `interviews` | UUID | Interview records (date, time, channel_name, status) |
| `notifications` | UUID | In-app notification messages per user |

### 11.4 Supporting Tables

| Table | Primary Key | Description |
|---|---|---|
| `generated_cover_letters` | UUID | AI-generated cover letter content + PDF URL |
| `ui_themes` | UUID | Color theme definitions |
| `user_theme_preferences` | UUID | User → selected theme mapping |

### 11.5 Key Relationships

```
credentials (1) ──────────── (1) candidates
credentials (1) ──────────── (1) companies (via created_by)
companies (1) ─────────────── (N) job_postings
job_postings (1) ───────────── (N) job_applications
job_applications (N) ──── (1) candidates
job_applications (1) ──── (1) interviews
coding_tests (1) ─────────── (N) coding_questions
coding_questions (1) ────── (N) test_cases
coding_submissions (N) ── (1) candidates
coding_submissions (N) ── (1) coding_questions
```

---

## 12. CHALLENGES FACED

### 12.1 NeonDB Auto-Suspend Latency

**Problem:** NeonDB free-tier databases auto-suspend after ~5 minutes of inactivity. The first query after suspension has a cold-start latency of 3–8 seconds.

**Solution:** On server startup, `testConnection(5, 3000)` retries the DB connection up to 5 times with 3-second intervals. An `unhandledRejection` global handler prevents server crashes during transient DB drops. Redis caching reduces DB dependency to near-zero for repeat requests.

### 12.2 IPv6/IPv4 Network Resolution Delays

**Problem:** Node.js on some networks defaults to IPv6 DNS resolution, causing connection timeouts to NeonDB and external APIs (`ECONNREFUSED` or extreme latency).

**Solution:** `dns.setDefaultResultOrder('ipv4first')` added at the very top of `server.js`. The `--dns-result-order=ipv4first` flag also added to all `npm` scripts.

### 12.3 PDF Parsing Failures for Image-Based PDFs

**Problem:** `pdf-parse` throws `InvalidPDFException` for scanned/image-only PDF resumes, causing the AI shortlisting service to receive empty resume text and marking all skills as "missing".

**Solution:** The `parseResume()` function in `aiShortlistService.js` wraps PDF parsing in a try-catch and falls back to `buffer.toString('utf-8')`. The skill matching logic was also upgraded to check THREE sources: profile skills array (highest priority), resume text, and education fields — ensuring correctly profiled candidates are never penalized for PDF parsing failures.

### 12.4 Piston API Rate Limiting

**Problem:** The public Piston API (`emkc.org`) enforces a 1 request per 200ms rate limit. Parallel code execution for multiple test cases triggered `429 Too Many Requests` errors.

**Solution:** Switched from parallel to sequential execution per test case with a 300ms artificial delay between calls (`Thread.sleep` equivalent using `setTimeout`). `p-limit(3)` is also maintained as a concurrency guard for any remaining parallel pathways.

### 12.5 Redis Connection in Serverless Environment

**Problem:** Neon serverless driver and Redis client both use connection pooling strategies incompatible with repeated module re-initialization. Environment variable loading order caused Redis to initialize before `.env` was parsed.

**Solution:** Used `import 'dotenv/config'` as the **first import** in `server.js` (before any other imports), leveraging ES module hoisting behavior. The Redis client is initialized once in `config/redis.js` and imported as a singleton.

### 12.6 Application Question FK Constraints

**Problem:** When recruiters edited job questions that had already been answered by candidates, `DELETE FROM job_questions WHERE job_id = $1` failed due to foreign key constraint violations from the `application_question_responses` table.

**Solution:** Implemented a "Smart Sync" strategy for question updates: existing question IDs are compared against incoming IDs. Only unmatched questions are targeted for deletion; matched ones are UPDATEd in-place. Deletion failures due to FK constraints are silently caught and logged rather than rolling back the entire transaction.

### 12.7 Google OAuth Token Delivery

**Problem:** After the Google OAuth callback, the backend needed to deliver a JWT to the frontend SPA without a shared session store.

**Solution:** The OAuth callback redirects to `${FRONTEND_URL}/oauth-success?token=${jwt}`. The frontend `/oauth-success` page reads the URL query parameter, stores the JWT in `localStorage`, and redirects to the appropriate dashboard based on the decoded role — completing the handoff without any server-side session.

---

## 13. FUTURE ENHANCEMENTS

### 13.1 Real-Time Notifications

Implement a WebSocket-based notification system (the `ws` package is already installed) to push events (new application received, interview scheduled, test result published) directly to connected clients without polling.

### 13.2 AI Interview Evaluation

Post-interview, use AI transcription (Whisper API) and Groq analysis to automatically evaluate candidate responses, generate an interview score, and summarize key observations — reducing recruiter note-taking burden.

### 13.3 Advanced Analytics Dashboard

Build a hiring funnel analytics system for recruiters: time-to-shortlist, interview-to-offer ratio, source-of-hire (Adzuna vs. Jooble vs. direct), and skill demand heatmaps across all posted jobs.

### 13.4 Bias Detection Layer

Add an AI layer to the shortlisting pipeline that flags potentially biased patterns in scoring (e.g., if candidates from certain institutions consistently score lower not due to skills but due to name/location proximity in resume text).

### 13.5 Resume Version History

Allow candidates to maintain multiple resume versions, compare AI scores across versions, and set a default version per job application.

### 13.6 Multi-Round Interview Support

Extend the interview module to support multi-round pipelines (Technical Round 1 → Technical Round 2 → HR Round) with separate scheduling, status tracking, and feedback per round.

### 13.7 Mobile Application

Develop a React Native (Expo) companion app providing candidates with push notifications for application status changes, interview reminders, and test availability alerts.

### 13.8 Scalability Architecture

- Migrate from a monolithic Express server to a microservices architecture separating: Auth Service, Job Service, AI Service, Assessment Service, Interview Service.
- Deploy each service independently on containerized infrastructure (Docker + Kubernetes).
- Use a message queue (RabbitMQ or Kafka) for AI processing jobs to prevent HTTP timeout issues on long-running LLM calls.
- Add a CDN layer for static asset delivery and resume storage (AWS S3 / Cloudflare R2 instead of local `uploads/`).

### 13.9 Recruiter Collaboration

Add multi-recruiter support within the same company, allowing multiple team members to share job posts, split applicant review, and collaborate with inline comments on candidate profiles.

### 13.10 Candidate Reputation System

Introduce a portable candidate reputation score based on test performance history (with consent), shareable between different company applications — similar to a professional certification badge system.

---

## 14. CONCLUSION

### 14.1 Summary of System

HireX is a comprehensive, AI-powered hiring platform that unifies the entire recruitment lifecycle — from job posting and application tracking, through multi-dimensional AI shortlisting, algorithmic interview scheduling, live code assessment, and WebRTC video interviews — into a single cohesive system. 

The platform serves three distinct user roles (Job Seeker, Recruiter, Admin) each with isolated dashboards, strict data ownership enforcement at both middleware and SQL levels, and role-specific feature sets. It integrates four major AI systems (Groq Llama 3.3-70b, Google Gemini 1.5 Flash, Natural NLP, and the Piston code execution engine) and two live external job APIs (Adzuna and Jooble) to provide real, actionable intelligence to both candidates and recruiters.

The technical stack reflects production-grade engineering choices: PostgreSQL on NeonDB for relational data integrity, Redis for near-zero-latency caching, JWT for stateless authentication, Agora for WebRTC video, and a React 18 + Vite frontend with Monaco Editor, React Flow, and Framer Motion for a premium interactive UX.

### 14.2 Impact of the Project

- **For Candidates:** HireX democratizes access to high-quality career tools (resume optimization, gap analysis, roadmaps) previously available only through expensive career coaches. Real-time application tracking eliminates the anxiety of the "black box" application process.

- **For Recruiters:** The AI shortlisting engine can process hundreds of applications in minutes with objective, explainable scoring — dramatically reducing time-to-shortlist. The integrated coding test and video interview system eliminates the need for 3–4 separate third-party tools.

- **For the Industry:** HireX demonstrates that a single engineering team can deliver enterprise-grade hiring automation using open-source technologies and API-based AI models at minimal cost — making sophisticated hiring technology accessible to startups and SMEs alongside large enterprises.

- **As a Technical Achievement:** The platform is a production-quality demonstration of modern full-stack architecture integrating REST APIs, WebSockets, WebRTC, multiple LLM providers, NLP algorithms, real-time code execution, and OAuth — all coordinated within a clean, layered codebase with explicit concerns separation.

---

*End of Document — HireX Project Encyclopedia v2.0*
