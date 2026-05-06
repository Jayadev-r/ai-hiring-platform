# 📘 HireX: Master Project Forensic Analysis & Technical Guide

> **Document Status:** Comprehensive System Reference
> **Version:** 1.0 | **Last Updated:** May 2026

---

## 1. PROJECT OVERVIEW

### 1.1 Project Name & Purpose
**HireX — AI-Powered End-to-End Hiring Platform**
HireX is a comprehensive SaaS platform designed to revolutionize the recruitment lifecycle. By unifying job discovery, candidate application, AI-driven shortlisting, algorithmic coding assessments, and live video interviewing into a single platform, HireX eliminates the need for fragmented third-party tools.

### 1.2 Problem Being Solved
The traditional hiring process is highly fragmented and inefficient. Recruiters waste countless hours manually screening resumes, managing multiple scheduling tools (Calendly, Zoom), and conducting assessments on external platforms (HackerRank). Candidates face a "black box" experience with poor feedback and tedious application processes.

### 1.3 Target Users
- **Job Seekers (Candidates):** Build profiles, upload resumes, receive AI gap analysis, apply for jobs, take tests, and track status.
- **Recruiters (Providers):** Create job postings, utilize AI to automatically shortlist candidates, schedule interviews, and conduct live coding/video assessments.
- **Administrators:** Oversee platform analytics, manage user roles, and maintain system health.

### 1.4 High-Level Architecture Summary
HireX utilizes a decoupled Client-Server architecture. The frontend is a modern SPA built with React 18, Vite, and TailwindCSS. The backend is a robust Node.js/Express REST API communicating with a serverless PostgreSQL database (NeonDB) and Redis for high-performance session caching.

---

## 2. COMPLETE TECH STACK ANALYSIS

### 2.1 Frontend
- **Framework:** React 18
- **Build Tool:** Vite 6
- **Routing:** React Router v6
- **State Management:** React Context API + Custom Hooks
- **Styling:** TailwindCSS 3 + Framer Motion (Animations)
- **UI Libraries:** Lucide React (Icons), DnD Kit (Drag-and-Drop)
- **Editor:** Monaco Editor (In-browser code execution)
- **Visuals:** Three.js / React Three Fiber (3D elements), Recharts (Analytics)
- **Video Calling:** Agora RTC SDK (WebRTC)
- **API Communication:** Axios

### 2.2 Backend
- **Runtime:** Node.js (v20+)
- **Framework:** Express.js 4 (ESM modules)
- **Authentication:** JWT (JSON Web Tokens), Passport.js (Google OAuth)
- **File Handling:** Multer (Multipart uploads)
- **Document Parsing:** pdf-parse, mammoth (DOCX)
- **Email:** Nodemailer (SMTP)
- **Concurrency:** p-limit (API rate limiting)
- **Security:** bcryptjs (Password hashing)

### 2.3 Database
- **Primary Database:** PostgreSQL (hosted on NeonDB)
- **Caching Layer:** Redis (Session caching, read-through cache)
- **Driver:** `@neondatabase/serverless` / `pg`
- **Schema Design:** Relational with strict foreign key constraints and normalization.

### 2.4 AI/ML Stack
- **Primary AI (Logic & Parsing):** Groq Llama 3.3-70b-versatile
- **Secondary AI (Generative Text):** Google Gemini 1.5 Flash
- **NLP System:** `natural` library (TF-IDF vectorization, cosine similarity)
- **AI Pipelines:** Resume parsing, Multi-dimensional candidate scoring, Cover letter generation, Career roadmap generation, AI Chatbot.

### 2.5 DevOps / Infrastructure
- **Deployment Strategy:** Vercel (Frontend), Railway/Render (Backend)
- **CI/CD:** GitHub Actions for automated linting and deployment
- **Environment Configuration:** Dotenv for managing secrets (DB URLs, API Keys)

---

## 3. COMPLETE FOLDER STRUCTURE ANALYSIS

### 3.1 Backend Directory Structure
```text
backend/
├── config/             # DB and external service connections (db.js, redis.js)
├── controllers/        # Request handlers encapsulating core business logic
├── middleware/         # Custom middleware (auth.js, roleGuard.js, upload.js)
├── models/             # Database queries and schema definitions
├── routes/             # Express router definitions mapping endpoints to controllers
├── services/           # Reusable business logic and external API integrations
├── utils/              # Helper functions (encryption, formatting)
└── server.js           # Express application entry point
```

### 3.2 Frontend Directory Structure
```text
frontend/
├── public/             # Static assets (images, icons)
├── src/
│   ├── api/            # Axios instance and API endpoint wrappers
│   ├── components/     # Reusable React components (UI, Forms, Modals)
│   ├── contexts/       # React Context providers (Auth, Theme)
│   ├── hooks/          # Custom React hooks (useAuth, useFetch)
│   ├── pages/          # Top-level route components (Dashboard, Profile)
│   ├── routes/         # Application routing logic (AppRoutes.jsx)
│   ├── services/       # Frontend service wrappers
│   ├── utils/          # Utility functions (formatting, validation)
│   ├── App.jsx         # Root component
│   └── index.css       # Global CSS and Tailwind directives
├── vite.config.js      # Vite build configuration
└── tailwind.config.js  # Tailwind theme customization
```

---

## 4. FRONTEND FORENSIC ANALYSIS

### 4.1 Architecture & Flow
The frontend operates as a Role-Based Single Page Application (SPA). Upon authentication, the JWT is stored securely, and the user is routed to their respective layout (`UserLayout`, `ProviderLayout`, or `AdminLayout`).

### 4.2 State Management
Global state is minimized to essential contextual data (Authentication, UI Theme) using React Context. Local component state is heavily utilized alongside custom hooks for asynchronous data fetching and loading state management.

### 4.3 Component Hierarchy
Components are heavily modularized. Atomic design principles are used for UI elements (`GlassCard`, `Button`, `SkeletonCard`), while complex features (e.g., `ResumeUpload`, `MonacoEditor`) are abstracted into standalone functional components.

### 4.4 Advanced Integrations
- **Interview Room (`InterviewRoom.jsx`):** Integrates Agora WebRTC for low-latency peer-to-peer video streaming.
- **Live Coding:** Uses Monaco Editor coupled with a custom execution service communicating with the Piston API to run code in multiple languages.

---

## 5. BACKEND FORENSIC ANALYSIS

### 5.1 Architecture Pattern
The backend strictly adheres to a **Controller-Service-Repository (Model)** pattern:
1. **Routes:** Define the HTTP endpoints.
2. **Controllers:** Parse request bodies, validate input, and handle HTTP responses.
3. **Services:** Contain complex business logic, external API calls (Groq, Gemini, Piston), and AI workflows.
4. **Models:** Execute raw PostgreSQL queries using parameterized inputs to prevent SQL injection.

### 5.2 Request Lifecycle
1. Request hits `/api/*` endpoint.
2. Global middleware parses JSON and checks CORS.
3. `auth` middleware verifies the JWT token.
4. `roleGuard` middleware ensures the user has appropriate permissions (e.g., `recruiter`).
5. Controller delegates business logic to a Service.
6. Service queries the Database or Redis Cache.
7. Controller sends formatted JSON response.

### 5.3 Caching Strategy
Redis is heavily utilized to optimize performance. A session warmup strategy triggers immediately post-login, pre-fetching the user's profile, company data, and job postings into Redis. This reduces subsequent API latency to ~5ms.

---

## 6. COMPLETE API DOCUMENTATION

*Note: For brevity, this is a summarized representation of key API domains.*

### 6.1 Authentication (`/api/auth`)
- `POST /register`: Creates a new user (job_seeker or recruiter).
- `POST /login`: Authenticates credentials, returns JWT.
- `GET /google`: Initiates Google OAuth flow.

### 6.2 Jobs (`/api/jobs`)
- `POST /`: Creates a new job posting (Recruiter only).
- `GET /`: Retrieves all active job postings.
- `GET /india`: Fetches external aggregated jobs from Adzuna/Jooble.

### 6.3 Applications (`/api/applications`)
- `POST /apply`: Submits a candidate application to a job.
- `PUT /:id/status`: Updates application status (Recruiter only).

### 6.4 AI & Matching (`/api/ai`)
- `POST /resume/parse`: Extracts and structures text from a resume PDF using Groq.
- `POST /shortlist`: Executes the multi-dimensional scoring algorithm for all applicants of a specific job.

### 6.5 Interviews (`/api/interviews`)
- `POST /schedule`: Schedules an interview and sends an email via Nodemailer.
- `POST /join`: Generates an Agora RTC token for joining a video call.

---

## 7. DATABASE & DATA MODEL ANALYSIS

### 7.1 Core Entities & Relationships
- **Users:** Stores credentials, roles, and profile data. 
- **Companies:** Linked to Recruiters (`created_by`). One Recruiter -> One Company.
- **Job Postings:** Linked to Companies. Includes JSON arrays for requirements and questions.
- **Applications:** Junction table linking Users (Candidates) to Job Postings. Stores AI scores and current status.
- **Interviews:** Linked to Applications. Stores scheduling details and Agora channel names.
- **Assessments:** Includes MCQ tests and Coding tests, linked to Job Postings and Candidates.

### 7.2 Optimization Strategies
- **Indexing:** B-Tree indexes are applied to highly queried foreign keys (`user_id`, `job_id`, `company_id`) to optimize JOIN operations.
- **JSONB Utilization:** Flexible data structures (like unstructured AI analysis output) are stored in `JSONB` columns for fast retrieval without rigid schema migrations.

---

## 8. AUTHENTICATION & AUTHORIZATION SYSTEM

### 8.1 Authentication Flow
1. User provides credentials; backend hashes password using `bcrypt` and compares.
2. Upon success, a JWT is signed with `userId` and `role`.
3. The token is stored in the frontend (localStorage/Context).
4. All protected API requests include `Authorization: Bearer <token>`.

### 8.2 Authorization (RBAC)
Role-Based Access Control is enforced via the `roleGuard` middleware. The system defines three roles: `admin`, `recruiter`, and `job_seeker`. Routes are strictly segregated; a candidate attempting to access `/api/jobs/create` will receive a `403 Forbidden` response.

---

## 9. AI SYSTEM DEEP ANALYSIS

The AI system is the core differentiator of HireX, utilizing multiple LLMs to perform distinct tasks optimally.

### 9.1 Multi-Dimensional Shortlisting Engine
Instead of relying solely on keywords, the AI shortlisting algorithm evaluates candidates across five dimensions:
1. **Skill Match (40%):** Array intersection and synonym normalization.
2. **Experience (20%):** Numeric extraction and delta calculation.
3. **Seniority (15%):** NLP categorization (Junior, Mid, Senior, Exec).
4. **Education (10%):** Degree hierarchy matching.
5. **TF-IDF (15%):** Cosine similarity between the job description and the raw resume text.

### 9.2 AI Narrative Generation
After computing the composite score, Google Gemini 1.5 Flash generates a concise, professional narrative explaining exactly *why* the candidate achieved their score, providing recruiters with immediate context.

### 9.3 Candidate AI Tools
- **Resume Parsing:** Groq Llama 3 structures unstructured PDF text into JSON.
- **Cover Letter:** Gemini Flash synthesizes candidate profile and job requirements into a customized cover letter.
- **Career Roadmap:** Groq Llama 3 generates an interactive React Flow graph mapping out skills required to bridge career gaps.

---

## 10. COMPLETE WORKFLOW ANALYSIS

### 10.1 Candidate Workflow
1. **Onboarding:** Registers, uploads resume, AI auto-fills profile.
2. **Discovery:** Browses internal jobs and external aggregations (Adzuna).
3. **Application:** Applies to jobs, tracked via the Dashboard.
4. **Assessment:** Completes assigned coding challenges and MCQ tests in-browser.
5. **Interview:** Joins live video call via Agora WebRTC upon successful shortlisting.

### 10.2 Recruiter Workflow
1. **Setup:** Registers, creates company profile.
2. **Creation:** Posts jobs with specific requirements and hidden expectations.
3. **Screening:** Uses one-click AI Auto-Shortlist to rank hundreds of applications instantly.
4. **Action:** Assigns assessments or auto-schedules interviews using the Break-Aware Round-Robin algorithm.
5. **Hiring:** Conducts video interviews and finalizes hiring decisions within the platform.

---

## 11. SYSTEM ARCHITECTURE ANALYSIS

```text
[ Client (React SPA) ]
       | (Axios HTTPS)
       v
[ Express REST API ] <---> [ Redis Cache ]
       |
  +----+----+----+
  |         |    |
[ NeonDB ] [ AI ] [ External APIs ]
(Postgres) (LLMs) (Piston/Agora)
```
This service-oriented modular monolith ensures ease of development while maintaining high performance through aggressive caching and decoupled frontend rendering.

---

## 12. SECURITY ANALYSIS

- **Data Protection:** Passwords are mathematically hashed with `bcryptjs`.
- **API Protection:** JWTs secure endpoints. CORS is strictly configured to allow only authorized frontend origins.
- **Injection Prevention:** `pg` parameterization prevents SQL injection.
- **Vulnerabilities/Improvements:** Moving JWT storage from `localStorage` to `HttpOnly` cookies would mitigate potential XSS attack vectors.

---

## 13. PERFORMANCE & SCALABILITY ANALYSIS

- **Caching:** Redis significantly reduces DB load for static read-heavy operations (e.g., viewing job lists).
- **Concurrency:** Piston API execution is rate-limited using `p-limit` to prevent external service bans.
- **Scalability:** The NeonDB serverless PostgreSQL database automatically scales compute resources based on load. The Node.js backend is completely stateless (session data is in JWT/Redis), allowing for infinite horizontal scaling behind a load balancer.

---

## 14. DEPENDENCY ANALYSIS

- **Express/Node:** Core backend infrastructure.
- **React/Vite:** High-performance frontend rendering and fast HMR development.
- **Groq SDK / Google Generative AI:** Powers the intelligence layer. Groq is chosen for extreme speed (LPU), Gemini for high-context synthesis.
- **Agora RTC:** Chosen for enterprise-grade WebRTC reliability without the overhead of maintaining custom TURN/STUN servers.

---

## 15. ENVIRONMENT & CONFIGURATION ANALYSIS

Critical environment variables dictate platform behavior:
- `DATABASE_URL`: Connection string for Neon PostgreSQL.
- `REDIS_URL`: Connection string for Upstash/Redis.
- `JWT_SECRET`: Cryptographic key for signing tokens.
- `GROQ_API_KEY_*`: Segmented keys for different AI workflows to prevent rate limiting.
- `AGORA_APP_ID` / `AGORA_APP_CERTIFICATE`: WebRTC authentication.

---

## 16. ERROR HANDLING & LOGGING

- **Backend:** Centralized error handling wraps async routes. Standardized JSON error responses (`{ error: "Message" }`) prevent stack traces from leaking to the client.
- **Frontend:** API requests are wrapped in `try/catch` blocks. Errors trigger UI toast notifications rather than application crashes. `AILoader` components provide visual feedback during long-running LLM inferences.

---

## 17. CODE QUALITY & ENGINEERING PRACTICES

- **Separation of Concerns:** Strict adherence to MVC/Service patterns.
- **Modularity:** Highly reusable React components and backend utility functions.
- **Naming Conventions:** PascalCase for React components, camelCase for functions and variables.
- **Clean Architecture:** Domain logic is isolated in the `services/` directory, making the system highly testable and agnostic to the HTTP transport layer.

---

## 18. FEATURE-BY-FEATURE BREAKDOWN

- **AI Auto-Shortlist:** Calculates a 5-dimension score and Gemini narrative. Reduces screening time by 90%.
- **Live Coding Tests:** Monaco Editor + Piston API. Provides secure, isolated execution of candidate code against hidden test cases.
- **Video Interviews:** Agora RTC integration provides seamless, no-download video calling with automated unique token generation per session.
- **External Job Aggregation:** Parallel fetching from Adzuna and Jooble, with signature-based deduplication, providing a massive job pool.

---

## 19. EXECUTION FLOW ANALYSIS

1. **Startup:** `server.js` connects to NeonDB and Redis, then binds Express to the designated port.
2. **Request:** Frontend Axios interceptor attaches the JWT.
3. **Processing:** Express routes the request, Middleware authenticates, Controller delegates to Service, Service executes business logic and DB transactions.
4. **Response:** JSON is returned, triggering React state updates and Framer Motion re-renders.

---

## 20. FUTURE IMPROVEMENTS & RECOMMENDATIONS

1. **Security:** Migrate JWT from local storage to secure, HttpOnly cookies.
2. **Architecture:** Decouple long-running AI tasks (e.g., batch shortlisting) into a background worker queue (e.g., BullMQ) to prevent blocking the Node.js event loop.
3. **AI Upgrades:** Implement RAG (Retrieval-Augmented Generation) using a vector database (like Pinecone) for semantic matching of resumes against millions of job postings instantly.
4. **Testing:** Implement a comprehensive unit testing suite using Jest for backend services and React Testing Library for frontend components.
5. **Observability:** Integrate Datadog or Sentry for production application performance monitoring (APM) and distributed tracing.

---
*End of Master Technical Documentation*
