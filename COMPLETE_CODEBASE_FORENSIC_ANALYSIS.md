
# Complete Codebase Forensic Analysis

## 1 — GLOBAL PROJECT SUMMARY
**Project Name**: AI Powered Agentic Hiring Platform
**Purpose**: An end-to-end recruitment application that leverages AI to match job seekers with jobs, schedule interviews, screen resumes, and conduct coding tests.
**Target Users**: Job Seekers (Candidates) and Job Providers (Employers).
**Core Features**: 
- Job Matching and Resume Parsing via AI
- Automated Interview Scheduling
- Real-time Video Calling for Interviews (Agora SDK)
- Live Coding Environment with Execution (Piston API)
- Dashboards for both candidates and employers
**Technologies**: React (Vite), Node.js, Express, PostgreSQL/Neon, JWT, TailwindCSS, Groq LLM, Google Gemini.

## 2 — TECHNOLOGY STACK DETECTION
**Frontend**: React, Vite, TailwindCSS, React Router, Recharts, Framer Motion, React Flow, TypeScript/JavaScript.
**Backend**: Node.js, Express, PostgreSQL, Redis, node-fetch, Multer, bcryptjs, jsonwebtoken, passport, PDF manipulation libs (pdf-parse, pdf-lib, pdfkit), Natural NLP.
**AI / Third Party APIs**: Groq SDK, @google/generative-ai, Adzuna, Jooble, Agora RTC, Piston API (Code execution).
**Build & Dev Tools**: nodemon, concurrently, vite, eslint.
**Reasoning**: React & Tailwind provide a rapid, responsive UI development experience. Node.js+Express allows for a lightweight, JS-unified full-stack environment. PostgreSQL offers relational integrity while Redis provides fast caching. Groq/Gemini APIs power the intelligent screening and matching features efficiently.

## 3 — COMPLETE DIRECTORY TREE

```
project-root
├── .gitignore
├── backend
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── check-exact-schema.js
│   ├── check-schema-file.js
│   ├── check-schema.js
│   ├── check-themes-schema.js
│   ├── checkAttempt.cjs
│   ├── checkAttemptsSchema.cjs
│   ├── checkConstraint.cjs
│   ├── checkDemoTest.cjs
│   ├── checkJobColumns.cjs
│   ├── checkNewTestQuestions.cjs
│   ├── checkQuestionsSchema.cjs
│   ├── checkSchemaDetails.cjs
│   ├── checkTestStatus.cjs
│   ├── checkUser.cjs
│   ├── check_blobs.js
│   ├── check_schema.js
│   ├── check_schema_temp.js
│   ├── check_tables_targeted.js
│   ├── config
│   │   ├── db.js
│   │   ├── passport.js
│   │   └── redis.js
│   ├── createAndAssignTest.cjs
│   ├── create_dummy_pdf.py
│   ├── db-check.mjs
│   ├── debug-applications.js
│   ├── debug-apps.js
│   ├── debug-apps.log
│   ├── debug-db.js
│   ├── debug-full-state.js
│   ├── debug-interview.mjs
│   ├── debug-linkage.js
│   ├── debug-my-apps.js
│   ├── debug-output.txt
│   ├── debug-time.mjs
│   ├── debug-time.txt
│   ├── debug-users.js
│   ├── debugQueryJoins.cjs
│   ├── debug_db_connection.js
│   ├── debug_id.log
│   ├── debug_tcp_connection.js
│   ├── debug_tls_connection.js
│   ├── direct-test-apps.js
│   ├── error_log.txt
│   ├── expand-application-schema.js
│   ├── expand-profile-image-schema.js
│   ├── expand-profile-schema.js
│   ├── finalCheck.cjs
│   ├── fix-ownership.js
│   ├── fix-user-id-constraint.js
│   ├── fixTestAssignment.js
│   ├── fixTestStatus.cjs
│   ├── forceSyncTest.cjs
│   ├── fullDiagnostic.mjs
│   ├── insertQuestions.cjs
│   ├── list-all-tables.js
│   ├── listTables.cjs
│   ├── listTests.cjs
│   ├── manualAssign.cjs
│   ├── middleware
│   │   ├── auth.js
│   │   ├── requireAdmin.js
│   │   └── roleGuard.js
│   ├── migrate-ai-schema.js
│   ├── migrate-profile-schema.js
│   ├── migrate_add_google_id.js
│   ├── migrate_make_password_nullable.js
│   ├── migrations
│   │   ├── add-req-education.js
│   │   ├── add_interviewer_columns.js
│   │   ├── create-candidate-resumes-table.js
│   │   ├── create-dynamic-application-tables.js
│   │   ├── create_coding_tables.js
│   │   ├── create_interviews_table.js
│   │   ├── create_tests_tables.js
│   │   ├── fix_tests_cascade.js
│   │   ├── modify-job-applications-resume.js
│   │   ├── phase7-workflow-refinements.js
│   │   └── update_interviews_schema.js
│   ├── package.json
│   ├── quick-check-constraint.js
│   ├── reproduce_issue.js
│   ├── routes
│   │   ├── adminRoutes.js
│   │   ├── ai.js
│   │   ├── aiCoverLetterRoutes.js
│   │   ├── aiResumeRoutes.js
│   │   ├── aiToolsRoutes.js
│   │   ├── applications.js
│   │   ├── auth.js
│   │   ├── candidates.js
│   │   ├── careerRoadmapRoutes.js
│   │   ├── chatbotRoutes.js
│   │   ├── codingRoutes.js
│   │   ├── companies.js
│   │   ├── dashboard.js
│   │   ├── interviewRoutes.js
│   │   ├── jobs.js
│   │   ├── profileImage.js
│   │   ├── recommendedJobsRoutes.js
│   │   ├── testRoutes.js
│   │   └── themeRoutes.js
│   ├── schema_job_postings.txt
│   ├── scripts
│   │   ├── check_columns.js
│   │   ├── check_schema.js
│   │   ├── extract_resume_text.py
│   │   ├── migrate-soft-delete.js
│   │   ├── migrate_cover_letters.js
│   │   ├── migrate_education_skills.js
│   │   ├── migrate_jobs_schema.js
│   │   ├── migrate_optimized_resumes.js
│   │   ├── seed-admin.js
│   │   ├── test_undefined.js
│   │   ├── verify-admin.js
│   │   └── verify_ai_agent.js
│   ├── server.js
│   ├── services
│   │   ├── adzunaService.js
│   │   ├── aiCoverLetterService.js
│   │   ├── aiResumeService.js
│   │   ├── aiShortlistService.js
│   │   ├── careerRoadmapService.js
│   │   ├── chatbotService.js
│   │   ├── groqService.js
│   │   ├── joobleService.js
│   │   ├── notificationService.js
│   │   ├── pdfService.js
│   │   ├── pistonService.js
│   │   ├── recommendedJobsService.js
│   │   ├── resumeParser.js
│   │   ├── resumeScoringService.js
│   │   └── schedulingAlgorithm.js
│   ├── setup-jobs-schema.js
│   ├── setup-schema.js
│   ├── setup-themes-schema.js
│   ├── simulateMyTests.cjs
│   ├── smoke-test-neon.js
│   ├── test-app-flow-root.js
│   ├── test-app-flow.js
│   ├── test-db.js
│   ├── test-fixed-query.js
│   ├── test-flow.js
│   ├── test-groq-direct.js
│   ├── test-job-education.js
│   ├── test-login.js
│   ├── test-profile-flow.js
│   ├── test-profile-schema.js
│   ├── test-query.js
│   ├── test-recruiter-query.js
│   ├── test-resume-parser.js
│   ├── testMyTestsQuery.cjs
│   ├── testQuery.mjs
│   ├── test_out.txt
│   ├── test_output.txt
│   ├── tmp_test_db.js
│   ├── triggerSync.js
│   ├── utils
│   │   ├── agoraToken.js
│   │   ├── cache.js
│   │   ├── emailService.js
│   │   └── validation.js
│   ├── verify-segregation.js
│   ├── verify_fix.js
│   ├── verify_output.txt
│   └── verify_profile_prefill.js
├── extract_check.json
├── extract_pdfs.py
├── faqs.json
├── finalreport_content.txt
├── frontend
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── src
│   │   ├── api
│   │   │   ├── applications.js
│   │   │   ├── auth.js
│   │   │   ├── axios.js
│   │   │   ├── jobs.js
│   │   │   ├── themes.js
│   │   │   └── users.js
│   │   ├── App.jsx
│   │   ├── assets
│   │   │   └── admin.css
│   │   ├── components
│   │   │   ├── admin-layout
│   │   │   │   ├── AdminCommandMenu.jsx
│   │   │   │   ├── AdminLayout.jsx
│   │   │   │   ├── AdminMatrixRain.jsx
│   │   │   │   ├── AdminMetricCard.jsx
│   │   │   │   ├── AdminSystemChart.jsx
│   │   │   │   ├── AdminTerminalPanel.jsx
│   │   │   │   └── GlitchText.jsx
│   │   │   ├── auth
│   │   │   │   ├── AuthPage.jsx
│   │   │   │   ├── OAuthSuccess.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── chatbot
│   │   │   │   └── ChatbotWidget.jsx
│   │   │   ├── coding
│   │   │   │   ├── MonacoCodeEditor.jsx
│   │   │   │   └── SubmissionCodeModal.jsx
│   │   │   ├── futuristic
│   │   │   │   ├── AILoader.jsx
│   │   │   │   ├── AnimatedCounter.jsx
│   │   │   │   ├── ErrorBoundary.jsx
│   │   │   │   ├── GlassCard.jsx
│   │   │   │   ├── MatchScoreRing.jsx
│   │   │   │   ├── SkeletonCard.jsx
│   │   │   │   └── TiltCard.jsx
│   │   │   ├── layout
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── index.js
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── profile
│   │   │   │   ├── AchievementsForm.jsx
│   │   │   │   ├── AddEducationModal.jsx
│   │   │   │   ├── AddExperienceModal.jsx
│   │   │   │   ├── EducationForm.jsx
│   │   │   │   ├── ExperienceForm.jsx
│   │   │   │   ├── PersonalInfoForm.jsx
│   │   │   │   ├── ProjectsForm.jsx
│   │   │   │   ├── ResumeAutoFill.jsx
│   │   │   │   ├── ResumeUpload.jsx
│   │   │   │   └── SkillsForm.jsx
│   │   │   ├── provider-layout
│   │   │   │   ├── index.js
│   │   │   │   ├── ProviderErrorBoundary.jsx
│   │   │   │   ├── ProviderLayout.jsx
│   │   │   │   └── WorkspaceDock.jsx
│   │   │   ├── provider-ui
│   │   │   │   ├── DataTable.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── index.js
│   │   │   │   ├── MetricCard.jsx
│   │   │   │   ├── SkeletonCard.jsx
│   │   │   │   ├── StatusBadge.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   └── TopProgressBar.jsx
│   │   │   ├── shared
│   │   │   │   ├── ApplicantCard.jsx
│   │   │   │   ├── ApplicantDetailsModal.jsx
│   │   │   │   ├── AutoApplyModal.jsx
│   │   │   │   ├── CandidateProfileContent.jsx
│   │   │   │   ├── CandidateProfilePanel.jsx
│   │   │   │   ├── CareerRoadmapModal.jsx
│   │   │   │   ├── CoverLetterModal.jsx
│   │   │   │   ├── index.js
│   │   │   │   ├── JobApplyModal.jsx
│   │   │   │   ├── JobCard.jsx
│   │   │   │   ├── MatchAnalysisModal.jsx
│   │   │   │   ├── MetricCard.jsx
│   │   │   │   ├── OptimizeResumeModal.jsx
│   │   │   │   └── ResumeEditor.jsx
│   │   │   ├── ui
│   │   │   │   ├── Avatar.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Breadcrumb.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Divider.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── FileUpload.jsx
│   │   │   │   ├── index.js
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── Skeleton.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   ├── Textarea.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   ├── Toggle.jsx
│   │   │   │   └── Tooltip.jsx
│   │   │   └── user-layout
│   │   │       ├── AICompanionOrb.jsx
│   │   │       ├── ParticleBackground.jsx
│   │   │       ├── RadialNav.jsx
│   │   │       ├── ScrollToTop.jsx
│   │   │       └── UserLayout.jsx
│   │   ├── contexts
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ProviderToastContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── design-tokens.js
│   │   ├── hooks
│   │   │   ├── useAuthUser.js
│   │   │   ├── useCountUp.js
│   │   │   ├── useDebounce.js
│   │   │   ├── usePageLoader.js
│   │   │   └── useTypingEffect.js
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── admin
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── ApplicationManagement.jsx
│   │   │   │   ├── index.js
│   │   │   │   ├── JobManagement.jsx
│   │   │   │   └── UserManagement.jsx
│   │   │   ├── InterviewRoom.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── provider
│   │   │   │   ├── AITools.jsx
│   │   │   │   ├── ApplicantManagement.jsx
│   │   │   │   ├── AutoShortlist.jsx
│   │   │   │   ├── CodingTestsPage.jsx
│   │   │   │   ├── CompanyProfile.jsx
│   │   │   │   ├── index.js
│   │   │   │   ├── InterviewScheduler.jsx
│   │   │   │   ├── InterviewsPage.jsx
│   │   │   │   ├── JobPosting.jsx
│   │   │   │   ├── ProviderDashboard.jsx
│   │   │   │   └── TestsPage.jsx
│   │   │   ├── ThemesSettings.jsx
│   │   │   └── user
│   │   │       ├── AIActions.jsx
│   │   │       ├── ApplicationTracker.jsx
│   │   │       ├── CandidateCodingDashboard.jsx
│   │   │       ├── CodingResultPage.jsx
│   │   │       ├── CodingTestAttempt.jsx
│   │   │       ├── index.js
│   │   │       ├── InterviewsPage.jsx
│   │   │       ├── JobDiscovery.jsx
│   │   │       ├── JobsInIndia.jsx
│   │   │       ├── MyTestsPage.jsx
│   │   │       ├── Profile.jsx
│   │   │       ├── RecommendedJobs.jsx
│   │   │       ├── TestAttemptPage.jsx
│   │   │       ├── TestResultPage.jsx
│   │   │       └── UserDashboard.jsx
│   │   ├── routes
│   │   │   └── AppRoutes.jsx
│   │   ├── services
│   │   │   ├── codingService.js
│   │   │   ├── interviewService.js
│   │   │   └── testService.js
│   │   └── utils
│   │       └── profileMapper.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── generate_docs.js
├── hirex_content.txt
├── package.json
├── push_error.txt
├── take_admin_screenshots.js
├── take_provider_screenshots.js
├── take_screenshots.js
├── tree_output.txt
├── upload_faqs.py
```

## 4 — FILE LEVEL ANALYSIS & 5 — FUNCTION LEVEL ANALYSIS

### File: backend/check-exact-schema.js
**Purpose**: Contains logic and definitions for check-exact-schema.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `checkSchema()`
  - *Purpose*: Implements logic for checkSchema.
  - *Inputs*: None

### File: backend/check-schema-file.js
**Purpose**: Contains logic and definitions for check-schema-file.js. 
**Dependencies**: pg, fs, dotenv, path

**Functions and Logic Components**: 
- `checkSchema()`
  - *Purpose*: Implements logic for checkSchema.
  - *Inputs*: None

### File: backend/check-schema.js
**Purpose**: Contains logic and definitions for check-schema.js. 
**Dependencies**: pg, dotenv, path

**Functions and Logic Components**: 
- `checkSchema()`
  - *Purpose*: Implements logic for checkSchema.
  - *Inputs*: None

### File: backend/check-themes-schema.js
**Purpose**: Contains logic and definitions for check-themes-schema.js. 
**Dependencies**: ./config/db.js

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: backend/check_blobs.js
**Purpose**: Contains logic and definitions for check_blobs.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `checkBlobUrls()`
  - *Purpose*: Implements logic for checkBlobUrls.
  - *Inputs*: None

### File: backend/check_schema.js
**Purpose**: Contains logic and definitions for check_schema.js. 
**Dependencies**: pg, dotenv

**Functions and Logic Components**: 
- `checkSchema()`
  - *Purpose*: Implements logic for checkSchema.
  - *Inputs*: None

### File: backend/check_schema_temp.js
**Purpose**: Contains logic and definitions for check_schema_temp.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `checkTables()`
  - *Purpose*: Implements logic for checkTables.
  - *Inputs*: None

### File: backend/check_tables_targeted.js
**Purpose**: Contains logic and definitions for check_tables_targeted.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `checkTables()`
  - *Purpose*: Implements logic for checkTables.
  - *Inputs*: None

### File: backend/config/db.js
**Purpose**: Contains logic and definitions for db.js. 
**Dependencies**: pg, dotenv

**Functions and Logic Components**: 
- `testConnection(retries = 5, delayMs = 3000)`
  - *Purpose*: Implements logic for testConnection.
  - *Inputs*: retries = 5, delayMs = 3000
- `query(text, params = [])`
  - *Purpose*: Implements logic for query.
  - *Inputs*: text, params = []
- `getClient()`
  - *Purpose*: Implements logic for getClient.
  - *Inputs*: None
- `closePool()`
  - *Purpose*: Implements logic for closePool.
  - *Inputs*: None

### File: backend/config/passport.js
**Purpose**: Contains logic and definitions for passport.js. 
**Dependencies**: passport, passport-google-oauth20, ./db.js, dotenv

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: backend/config/redis.js
**Purpose**: Contains logic and definitions for redis.js. 
**Dependencies**: ./config/redis.js, redis

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: backend/debug-applications.js
**Purpose**: Contains logic and definitions for debug-applications.js. 
**Dependencies**: ./config/db.js, dotenv

**Functions and Logic Components**: 
- `runDebug()`
  - *Purpose*: Implements logic for runDebug.
  - *Inputs*: None

### File: backend/debug-apps.js
**Purpose**: Contains logic and definitions for debug-apps.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `checkApplications()`
  - *Purpose*: Implements logic for checkApplications.
  - *Inputs*: None

### File: backend/debug-db.js
**Purpose**: Contains logic and definitions for debug-db.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `debug()`
  - *Purpose*: Implements logic for debug.
  - *Inputs*: None

### File: backend/debug-full-state.js
**Purpose**: Contains logic and definitions for debug-full-state.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `debugState()`
  - *Purpose*: Implements logic for debugState.
  - *Inputs*: None

### File: backend/debug-linkage.js
**Purpose**: Contains logic and definitions for debug-linkage.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `debugLinkage()`
  - *Purpose*: Implements logic for debugLinkage.
  - *Inputs*: None

### File: backend/debug-my-apps.js
**Purpose**: Contains logic and definitions for debug-my-apps.js. 
**Dependencies**: axios

**Functions and Logic Components**: 
- `debugMyApps()`
  - *Purpose*: Implements logic for debugMyApps.
  - *Inputs*: None

### File: backend/debug-users.js
**Purpose**: Contains logic and definitions for debug-users.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `check()`
  - *Purpose*: Implements logic for check.
  - *Inputs*: None

### File: backend/debug_db_connection.js
**Purpose**: Contains logic and definitions for debug_db_connection.js. 
**Dependencies**: pg, dotenv, dns

**Functions and Logic Components**: 
- `test()`
  - *Purpose*: Implements logic for test.
  - *Inputs*: None

### File: backend/debug_tcp_connection.js
**Purpose**: Contains logic and definitions for debug_tcp_connection.js. 
**Dependencies**: net

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: backend/debug_tls_connection.js
**Purpose**: Contains logic and definitions for debug_tls_connection.js. 
**Dependencies**: tls

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: backend/direct-test-apps.js
**Purpose**: Contains logic and definitions for direct-test-apps.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `test()`
  - *Purpose*: Implements logic for test.
  - *Inputs*: None

### File: backend/expand-application-schema.js
**Purpose**: Contains logic and definitions for expand-application-schema.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `expandApplicationSchema()`
  - *Purpose*: Implements logic for expandApplicationSchema.
  - *Inputs*: None

### File: backend/expand-profile-image-schema.js
**Purpose**: Contains logic and definitions for expand-profile-image-schema.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `expandProfileImageSchema()`
  - *Purpose*: Implements logic for expandProfileImageSchema.
  - *Inputs*: None

### File: backend/expand-profile-schema.js
**Purpose**: Contains logic and definitions for expand-profile-schema.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `expandProfileSchema()`
  - *Purpose*: Implements logic for expandProfileSchema.
  - *Inputs*: None

### File: backend/fix-ownership.js
**Purpose**: Contains logic and definitions for fix-ownership.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `fix()`
  - *Purpose*: Implements logic for fix.
  - *Inputs*: None

### File: backend/fix-user-id-constraint.js
**Purpose**: Contains logic and definitions for fix-user-id-constraint.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `addUserIdConstraint()`
  - *Purpose*: Implements logic for addUserIdConstraint.
  - *Inputs*: None

### File: backend/fixTestAssignment.js
**Purpose**: Contains logic and definitions for fixTestAssignment.js. 
**Dependencies**: ./config/db.js

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: backend/list-all-tables.js
**Purpose**: Contains logic and definitions for list-all-tables.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `listTables()`
  - *Purpose*: Implements logic for listTables.
  - *Inputs*: None

### File: backend/middleware/auth.js
**Purpose**: Contains logic and definitions for auth.js. 
**Dependencies**: jsonwebtoken

**Functions and Logic Components**: 
- `auth(req, res, next)`
  - *Purpose*: Implements logic for auth.
  - *Inputs*: req, res, next

### File: backend/middleware/requireAdmin.js
**Purpose**: Contains logic and definitions for requireAdmin.js. 
**Dependencies**: None

**Functions and Logic Components**: 
- `requireAdmin(req, res, next)`
  - *Purpose*: Implements logic for requireAdmin.
  - *Inputs*: req, res, next

### File: backend/middleware/roleGuard.js
**Purpose**: Contains logic and definitions for roleGuard.js. 
**Dependencies**: None

**Functions and Logic Components**: 
- `roleGuard(allowedRoles)`
  - *Purpose*: Implements logic for roleGuard.
  - *Inputs*: allowedRoles

### File: backend/migrate-ai-schema.js
**Purpose**: Contains logic and definitions for migrate-ai-schema.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `migrate()`
  - *Purpose*: Implements logic for migrate.
  - *Inputs*: None

### File: backend/migrate-profile-schema.js
**Purpose**: Contains logic and definitions for migrate-profile-schema.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `migrateSchema()`
  - *Purpose*: Implements logic for migrateSchema.
  - *Inputs*: None

### File: backend/migrate_add_google_id.js
**Purpose**: Contains logic and definitions for migrate_add_google_id.js. 
**Dependencies**: pg, dotenv, dns

**Functions and Logic Components**: 
- `migrate_1()`
  - *Purpose*: Implements logic for migrate_1.
  - *Inputs*: None

### File: backend/migrate_make_password_nullable.js
**Purpose**: Contains logic and definitions for migrate_make_password_nullable.js. 
**Dependencies**: pg, dotenv, dns

**Functions and Logic Components**: 
- `migrate_password_nullable()`
  - *Purpose*: Implements logic for migrate_password_nullable.
  - *Inputs*: None

### File: backend/migrations/add-req-education.js
**Purpose**: Contains logic and definitions for add-req-education.js. 
**Dependencies**: dotenv/config, ../config/db.js

**Functions and Logic Components**: 
- `migrate()`
  - *Purpose*: Implements logic for migrate.
  - *Inputs*: None

### File: backend/migrations/add_interviewer_columns.js
**Purpose**: Contains logic and definitions for add_interviewer_columns.js. 
**Dependencies**: ../config/db.js

**Functions and Logic Components**: 
- `addInterviewerColumns()`
  - *Purpose*: Implements logic for addInterviewerColumns.
  - *Inputs*: None

### File: backend/migrations/create-candidate-resumes-table.js
**Purpose**: Contains logic and definitions for create-candidate-resumes-table.js. 
**Dependencies**: ../config/db.js

**Functions and Logic Components**: 
- `createCandidateResumesTable()`
  - *Purpose*: Implements logic for createCandidateResumesTable.
  - *Inputs*: None

### File: backend/migrations/create-dynamic-application-tables.js
**Purpose**: Contains logic and definitions for create-dynamic-application-tables.js. 
**Dependencies**: ../config/db.js

**Functions and Logic Components**: 
- `createTables()`
  - *Purpose*: Implements logic for createTables.
  - *Inputs*: None

### File: backend/migrations/create_coding_tables.js
**Purpose**: Contains logic and definitions for create_coding_tables.js. 
**Dependencies**: ../config/db.js

**Functions and Logic Components**: 
- `createCodingTables()`
  - *Purpose*: Implements logic for createCodingTables.
  - *Inputs*: None

### File: backend/migrations/create_interviews_table.js
**Purpose**: Contains logic and definitions for create_interviews_table.js. 
**Dependencies**: ../config/db.js

**Functions and Logic Components**: 
- `createInterviewsTables()`
  - *Purpose*: Implements logic for createInterviewsTables.
  - *Inputs*: None

### File: backend/migrations/create_tests_tables.js
**Purpose**: Contains logic and definitions for create_tests_tables.js. 
**Dependencies**: ../config/db.js

**Functions and Logic Components**: 
- `createTestsTables()`
  - *Purpose*: Implements logic for createTestsTables.
  - *Inputs*: None

### File: backend/migrations/fix_tests_cascade.js
**Purpose**: Contains logic and definitions for fix_tests_cascade.js. 
**Dependencies**: ../config/db.js

**Functions and Logic Components**: 
- `fixTestsCascade()`
  - *Purpose*: Implements logic for fixTestsCascade.
  - *Inputs*: None

### File: backend/migrations/modify-job-applications-resume.js
**Purpose**: Contains logic and definitions for modify-job-applications-resume.js. 
**Dependencies**: ../config/db.js

**Functions and Logic Components**: 
- `modifyApplicationsTable()`
  - *Purpose*: Implements logic for modifyApplicationsTable.
  - *Inputs*: None

### File: backend/migrations/phase7-workflow-refinements.js
**Purpose**: Contains logic and definitions for phase7-workflow-refinements.js. 
**Dependencies**: ../config/db.js

**Functions and Logic Components**: 
- `runMigration()`
  - *Purpose*: Implements logic for runMigration.
  - *Inputs*: None

### File: backend/migrations/update_interviews_schema.js
**Purpose**: Contains logic and definitions for update_interviews_schema.js. 
**Dependencies**: ../config/db.js

**Functions and Logic Components**: 
- `updateInterviewsSchema()`
  - *Purpose*: Implements logic for updateInterviewsSchema.
  - *Inputs*: None

### File: backend/quick-check-constraint.js
**Purpose**: Contains logic and definitions for quick-check-constraint.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `quickCheck()`
  - *Purpose*: Implements logic for quickCheck.
  - *Inputs*: None

### File: backend/reproduce_issue.js
**Purpose**: Contains logic and definitions for reproduce_issue.js. 
**Dependencies**: axios

**Functions and Logic Components**: 
- `reproduction()`
  - *Purpose*: Implements logic for reproduction.
  - *Inputs*: None

### File: backend/routes/adminRoutes.js
**Purpose**: Contains logic and definitions for adminRoutes.js. 
**Dependencies**: express, jsonwebtoken, ../config/db.js, ../middleware/auth.js, ../middleware/requireAdmin.js

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: backend/routes/ai.js
**Purpose**: Contains logic and definitions for ai.js. 
**Dependencies**: express, ../config/db.js, child_process, path

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: backend/routes/aiCoverLetterRoutes.js
**Purpose**: Contains logic and definitions for aiCoverLetterRoutes.js. 
**Dependencies**: express, ../services/aiCoverLetterService.js, ../middleware/auth.js, express-rate-limit

**Functions and Logic Components**: 
- `roleGuard(role)`
  - *Purpose*: Implements logic for roleGuard.
  - *Inputs*: role

### File: backend/routes/aiResumeRoutes.js
**Purpose**: Contains logic and definitions for aiResumeRoutes.js. 
**Dependencies**: express, ../services/aiResumeService.js, ../services/groqService.js, ../services/pdfService.js, ../middleware/auth.js, express-rate-limit, ../config/db.js, multer, fs, path

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: backend/routes/aiToolsRoutes.js
**Purpose**: Contains logic and definitions for aiToolsRoutes.js. 
**Dependencies**: express, ../config/db.js, ../middleware/auth.js, ../middleware/roleGuard.js, ../services/aiShortlistService.js

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: backend/routes/applications.js
**Purpose**: Contains logic and definitions for applications.js. 
**Dependencies**: express, ../config/db.js, ../middleware/auth.js, ../middleware/roleGuard.js, ../utils/cache.js

**Functions and Logic Components**: 
- `log(msg)`
  - *Purpose*: Implements logic for log.
  - *Inputs*: msg

### File: backend/routes/auth.js
**Purpose**: Contains logic and definitions for auth.js. 
**Dependencies**: express, jsonwebtoken, ../middleware/auth.js, ../utils/cache.js, ../config/passport.js

**Functions and Logic Components**: 
- `warmupSessionCache(userId, role)`
  - *Purpose*: Implements logic for warmupSessionCache.
  - *Inputs*: userId, role

### File: backend/routes/candidates.js
**Purpose**: Contains logic and definitions for candidates.js. 
**Dependencies**: express, multer, ../config/db.js, ../middleware/auth.js, ../services/resumeParser.js

**Functions and Logic Components**: 
- `getCandidateId(userId)`
  - *Purpose*: Implements logic for getCandidateId.
  - *Inputs*: userId
- `syncPrimaryData(client, candidateId)`
  - *Purpose*: Implements logic for syncPrimaryData.
  - *Inputs*: client, candidateId
- `validateDate(dateStr)`
  - *Purpose*: Implements logic for validateDate.
  - *Inputs*: dateStr
- `validateYear(dateStr)`
  - *Purpose*: Implements logic for validateYear.
  - *Inputs*: dateStr
- `addEntry(req, res, table, fields)`
  - *Purpose*: Implements logic for addEntry.
  - *Inputs*: req, res, table, fields
- `removeEntry(req, res, table)`
  - *Purpose*: Implements logic for removeEntry.
  - *Inputs*: req, res, table

### File: backend/routes/careerRoadmapRoutes.js
**Purpose**: Contains logic and definitions for careerRoadmapRoutes.js. 
**Dependencies**: express, ../services/careerRoadmapService.js, ../middleware/auth.js, express-rate-limit

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: backend/routes/chatbotRoutes.js
**Purpose**: Contains logic and definitions for chatbotRoutes.js. 
**Dependencies**: express, ../services/chatbotService.js

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: backend/routes/codingRoutes.js
**Purpose**: Contains logic and definitions for codingRoutes.js. 
**Dependencies**: express, ../config/db.js, ../middleware/auth.js, ../middleware/roleGuard.js, ../services/pistonService.js

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: backend/routes/companies.js
**Purpose**: Contains logic and definitions for companies.js. 
**Dependencies**: express, multer, ../middleware/auth.js, ../middleware/roleGuard.js, ../config/db.js, ../utils/cache.js

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: backend/routes/dashboard.js
**Purpose**: Contains logic and definitions for dashboard.js. 
**Dependencies**: express, ../config/db.js, ../middleware/auth.js, ../utils/cache.js

**Functions and Logic Components**: 
- `fetchProviderDashboardFromDB(userId, userEmail)`
  - *Purpose*: Implements logic for fetchProviderDashboardFromDB.
  - *Inputs*: userId, userEmail

### File: backend/routes/interviewRoutes.js
**Purpose**: Contains logic and definitions for interviewRoutes.js. 
**Dependencies**: express, ../config/db.js, ../middleware/auth.js, ../middleware/roleGuard.js, ../utils/agoraToken.js, ../utils/emailService.js, ../services/schedulingAlgorithm.js

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: backend/routes/jobs.js
**Purpose**: Contains logic and definitions for jobs.js. 
**Dependencies**: express, ../config/db.js, ../services/adzunaService.js, ../services/joobleService.js, ../utils/cache.js, ../middleware/auth.js, ../middleware/roleGuard.js

**Functions and Logic Components**: 
- `normalize(str)`
  - *Purpose*: Implements logic for normalize.
  - *Inputs*: str

### File: backend/routes/profileImage.js
**Purpose**: Contains logic and definitions for profileImage.js. 
**Dependencies**: express, ../config/db.js, ../middleware/auth.js

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: backend/routes/recommendedJobsRoutes.js
**Purpose**: Contains logic and definitions for recommendedJobsRoutes.js. 
**Dependencies**: express, ../middleware/auth.js, express-rate-limit, ../services/recommendedJobsService.js

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: backend/routes/testRoutes.js
**Purpose**: Contains logic and definitions for testRoutes.js. 
**Dependencies**: express, ../config/db.js, ../middleware/auth.js, ../middleware/roleGuard.js

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: backend/routes/themeRoutes.js
**Purpose**: Contains logic and definitions for themeRoutes.js. 
**Dependencies**: express, ../config/db.js, ../middleware/auth.js

**Functions and Logic Components**: 
- `isValidColor(color)`
  - *Purpose*: Implements logic for isValidColor.
  - *Inputs*: color
- `hexToRgb(hex)`
  - *Purpose*: Implements logic for hexToRgb.
  - *Inputs*: hex
- `getLuminance(r, g, b)`
  - *Purpose*: Implements logic for getLuminance.
  - *Inputs*: r, g, b
- `getContrastRatio(hex1, hex2)`
  - *Purpose*: Implements logic for getContrastRatio.
  - *Inputs*: hex1, hex2

### File: backend/scripts/check_columns.js
**Purpose**: Contains logic and definitions for check_columns.js. 
**Dependencies**: ../config/db.js

**Functions and Logic Components**: 
- `checkSchema()`
  - *Purpose*: Implements logic for checkSchema.
  - *Inputs*: None

### File: backend/scripts/check_schema.js
**Purpose**: Contains logic and definitions for check_schema.js. 
**Dependencies**: ../config/db.js

**Functions and Logic Components**: 
- `checkSchema()`
  - *Purpose*: Implements logic for checkSchema.
  - *Inputs*: None

### File: backend/scripts/migrate-soft-delete.js
**Purpose**: Contains logic and definitions for migrate-soft-delete.js. 
**Dependencies**: ../config/db.js, dotenv, path

**Functions and Logic Components**: 
- `migrateSoftDelete()`
  - *Purpose*: Implements logic for migrateSoftDelete.
  - *Inputs*: None

### File: backend/scripts/migrate_cover_letters.js
**Purpose**: Contains logic and definitions for migrate_cover_letters.js. 
**Dependencies**: ../config/db.js

**Functions and Logic Components**: 
- `createTable()`
  - *Purpose*: Implements logic for createTable.
  - *Inputs*: None

### File: backend/scripts/migrate_education_skills.js
**Purpose**: Contains logic and definitions for migrate_education_skills.js. 
**Dependencies**: ../config/db.js

**Functions and Logic Components**: 
- `migrate()`
  - *Purpose*: Implements logic for migrate.
  - *Inputs*: None

### File: backend/scripts/migrate_jobs_schema.js
**Purpose**: Contains logic and definitions for migrate_jobs_schema.js. 
**Dependencies**: ../config/db.js

**Functions and Logic Components**: 
- `migrate()`
  - *Purpose*: Implements logic for migrate.
  - *Inputs*: None

### File: backend/scripts/migrate_optimized_resumes.js
**Purpose**: Contains logic and definitions for migrate_optimized_resumes.js. 
**Dependencies**: None

**Functions and Logic Components**: 
- `migrate()`
  - *Purpose*: Implements logic for migrate.
  - *Inputs*: None

### File: backend/scripts/seed-admin.js
**Purpose**: Contains logic and definitions for seed-admin.js. 
**Dependencies**: ../config/db.js, bcryptjs, dotenv, path

**Functions and Logic Components**: 
- `seedAdmin()`
  - *Purpose*: Implements logic for seedAdmin.
  - *Inputs*: None

### File: backend/scripts/test_undefined.js
**Purpose**: Contains logic and definitions for test_undefined.js. 
**Dependencies**: ../config/db.js

**Functions and Logic Components**: 
- `testUndefined()`
  - *Purpose*: Implements logic for testUndefined.
  - *Inputs*: None

### File: backend/scripts/verify-admin.js
**Purpose**: Contains logic and definitions for verify-admin.js. 
**Dependencies**: axios, dotenv, path

**Functions and Logic Components**: 
- `verifyAdmin()`
  - *Purpose*: Implements logic for verifyAdmin.
  - *Inputs*: None

### File: backend/scripts/verify_ai_agent.js
**Purpose**: Contains logic and definitions for verify_ai_agent.js. 
**Dependencies**: ../services/aiCoverLetterService.js, ../config/db.js, fs

**Functions and Logic Components**: 
- `verifyAgent()`
  - *Purpose*: Implements logic for verifyAgent.
  - *Inputs*: None

### File: backend/server.js
**Purpose**: Contains logic and definitions for server.js. 
**Dependencies**: dotenv/config, express, cors, dns, ./routes/auth.js, ./routes/aiCoverLetterRoutes.js, ./routes/jobs.js, ./routes/candidates.js, ./routes/applications.js, ./routes/dashboard.js, ./routes/ai.js, ./routes/companies.js, ./routes/aiToolsRoutes.js, ./routes/interviewRoutes.js, ./routes/profileImage.js, ./routes/testRoutes.js, ./routes/codingRoutes.js, ./routes/careerRoadmapRoutes.js, ./routes/chatbotRoutes.js, ./config/db.js, ./config/redis.js, path, ./config/passport.js, ./routes/aiResumeRoutes.js, ./routes/recommendedJobsRoutes.js, ./routes/adminRoutes.js, ./routes/themeRoutes.js, os

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: backend/services/adzunaService.js
**Purpose**: Contains logic and definitions for adzunaService.js. 
**Dependencies**: axios, ../config/db.js

**Functions and Logic Components**: 
- `saveJobsToDb(jobs)`
  - *Purpose*: Implements logic for saveJobsToDb.
  - *Inputs*: jobs
- `fetchAdzunaJobs(filters = {})`
  - *Purpose*: Implements logic for fetchAdzunaJobs.
  - *Inputs*: filters = {}
- `syncJobs()`
  - *Purpose*: Implements logic for syncJobs.
  - *Inputs*: None

### File: backend/services/aiCoverLetterService.js
**Purpose**: Contains logic and definitions for aiCoverLetterService.js. 
**Dependencies**: @google/generative-ai, ./pdfService.js, ../config/db.js, dotenv

**Functions and Logic Components**: 
- `queryDB(text, params)`
  - *Purpose*: Implements logic for queryDB.
  - *Inputs*: text, params
- `generateCoverLetter(candidateId, jobId, tone = 'professional')`
  - *Purpose*: Implements logic for generateCoverLetter.
  - *Inputs*: candidateId, jobId, tone = 'professional'
- `generateTemplateFallback(candidate, job, analysis)`
  - *Purpose*: Implements logic for generateTemplateFallback.
  - *Inputs*: candidate, job, analysis

### File: backend/services/aiResumeService.js
**Purpose**: Contains logic and definitions for aiResumeService.js. 
**Dependencies**: @google/generative-ai, ./pdfService.js, ./resumeScoringService.js, ../config/db.js, dotenv, mammoth, module

**Functions and Logic Components**: 
- `cleanText(text)`
  - *Purpose*: Implements logic for cleanText.
  - *Inputs*: text
- `extractTextFromBuffer(buffer, mimeType)`
  - *Purpose*: Implements logic for extractTextFromBuffer.
  - *Inputs*: buffer, mimeType
- `validateOutput(original, optimized)`
  - *Purpose*: Implements logic for validateOutput.
  - *Inputs*: original, optimized
- `optimizeResume(candidateId, resumeText, jobId = null)`
  - *Purpose*: Implements logic for optimizeResume.
  - *Inputs*: candidateId, resumeText, jobId = null

### File: backend/services/aiShortlistService.js
**Purpose**: Contains logic and definitions for aiShortlistService.js. 
**Dependencies**: module, @google/generative-ai, dotenv

**Functions and Logic Components**: 
- `normalizeSkills(text)`
  - *Purpose*: Implements logic for normalizeSkills.
  - *Inputs*: text
- `parseResume(base64Data, mimeType = 'application/pdf')`
  - *Purpose*: Implements logic for parseResume.
  - *Inputs*: base64Data, mimeType = 'application/pdf'
- `preprocessText(text)`
  - *Purpose*: Implements logic for preprocessText.
  - *Inputs*: text
- `computeMatchScore(jobDescription, resumeText)`
  - *Purpose*: Implements logic for computeMatchScore.
  - *Inputs*: jobDescription, resumeText
- `calculateSkillScore(requiredSkillsText, candidateSkills, resumeText)`
  - *Purpose*: Implements logic for calculateSkillScore.
  - *Inputs*: requiredSkillsText, candidateSkills, resumeText
- `extractYearsOfExperience(text)`
  - *Purpose*: Implements logic for extractYearsOfExperience.
  - *Inputs*: text
- `calculateExperienceScore(jobDescription, resumeText)`
  - *Purpose*: Implements logic for calculateExperienceScore.
  - *Inputs*: jobDescription, resumeText
- `getSeniorityLevel(text)`
  - *Purpose*: Implements logic for getSeniorityLevel.
  - *Inputs*: text
- `calculateSeniorityScore(jobText, resumeText)`
  - *Purpose*: Implements logic for calculateSeniorityScore.
  - *Inputs*: jobText, resumeText
- `getEducationLevel(text)`
  - *Purpose*: Implements logic for getEducationLevel.
  - *Inputs*: text
- `calculateEducationScore(requiredEdu, candidateEdu, resumeText)`
  - *Purpose*: Implements logic for calculateEducationScore.
  - *Inputs*: requiredEdu, candidateEdu, resumeText
- `generateAiNarrative(jobTitle, score, breakdown)`
  - *Purpose*: Implements logic for generateAiNarrative.
  - *Inputs*: jobTitle, score, breakdown
- `rankCandidates(jobContext, applications, jobMetadata = {})`
  - *Purpose*: Implements logic for rankCandidates.
  - *Inputs*: jobContext, applications, jobMetadata = {}

### File: backend/services/careerRoadmapService.js
**Purpose**: Contains logic and definitions for careerRoadmapService.js. 
**Dependencies**: groq-sdk, dotenv

**Functions and Logic Components**: 
- `generateCareerRoadmap(skill, currentLevel = 'Beginner')`
  - *Purpose*: Implements logic for generateCareerRoadmap.
  - *Inputs*: skill, currentLevel = 'Beginner'

### File: backend/services/chatbotService.js
**Purpose**: Contains logic and definitions for chatbotService.js. 
**Dependencies**: natural, fs, path

**Functions and Logic Components**: 
- `searchFAQ(query)`
  - *Purpose*: Implements logic for searchFAQ.
  - *Inputs*: query

### File: backend/services/groqService.js
**Purpose**: Contains logic and definitions for groqService.js. 
**Dependencies**: groq-sdk, dotenv

**Functions and Logic Components**: 
- `optimizeResumeWithGroq(resumeText, jobData)`
  - *Purpose*: Implements logic for optimizeResumeWithGroq.
  - *Inputs*: resumeText, jobData
- `analyzeMatchWithGroq(resumeText, jobData)`
  - *Purpose*: Implements logic for analyzeMatchWithGroq.
  - *Inputs*: resumeText, jobData
- `parseResumeWithGroq(resumeText)`
  - *Purpose*: Implements logic for parseResumeWithGroq.
  - *Inputs*: resumeText

### File: backend/services/joobleService.js
**Purpose**: Contains logic and definitions for joobleService.js. 
**Dependencies**: axios

**Functions and Logic Components**: 
- `fetchJoobleJobs(filters)`
  - *Purpose*: Implements logic for fetchJoobleJobs.
  - *Inputs*: filters

### File: backend/services/notificationService.js
**Purpose**: Contains logic and definitions for notificationService.js. 
**Dependencies**: ../config/db.js

**Functions and Logic Components**: 
- `createInterviewNotification(candidateUserId, interviewDetails)`
  - *Purpose*: Implements logic for createInterviewNotification.
  - *Inputs*: candidateUserId, interviewDetails
- `sendInterviewEmail(candidateEmail, interviewDetails)`
  - *Purpose*: Implements logic for sendInterviewEmail.
  - *Inputs*: candidateEmail, interviewDetails

### File: backend/services/pdfService.js
**Purpose**: Contains logic and definitions for pdfService.js. 
**Dependencies**: uuid, fs, path, pdfkit

**Functions and Logic Components**: 
- `generatePDF(content, candidate, job)`
  - *Purpose*: Implements logic for generatePDF.
  - *Inputs*: content, candidate, job
- `generateResumePDF(content, candidate)`
  - *Purpose*: Implements logic for generateResumePDF.
  - *Inputs*: content, candidate

### File: backend/services/pistonService.js
**Purpose**: Contains logic and definitions for pistonService.js. 
**Dependencies**: axios, p-limit

**Functions and Logic Components**: 
- `executeCode(sourceCode, language, stdin = '')`
  - *Purpose*: Implements logic for executeCode.
  - *Inputs*: sourceCode, language, stdin = ''
- `normalize(str)`
  - *Purpose*: Implements logic for normalize.
  - *Inputs*: str
- `evaluateCode(sourceCode, language, testCases)`
  - *Purpose*: Implements logic for evaluateCode.
  - *Inputs*: sourceCode, language, testCases
- `getSupportedLanguages()`
  - *Purpose*: Implements logic for getSupportedLanguages.
  - *Inputs*: None

### File: backend/services/recommendedJobsService.js
**Purpose**: Contains logic and definitions for recommendedJobsService.js. 
**Dependencies**: ../config/db.js, node-fetch

**Functions and Logic Components**: 
- `fetchJoobleJobs(keyword)`
  - *Purpose*: Implements logic for fetchJoobleJobs.
  - *Inputs*: keyword
- `fetchAdzunaJobs(keyword)`
  - *Purpose*: Implements logic for fetchAdzunaJobs.
  - *Inputs*: keyword
- `deduplicateJobs(jobs)`
  - *Purpose*: Implements logic for deduplicateJobs.
  - *Inputs*: jobs
- `getRecommendedJobs(userId)`
  - *Purpose*: Implements logic for getRecommendedJobs.
  - *Inputs*: userId

### File: backend/services/resumeParser.js
**Purpose**: Contains logic and definitions for resumeParser.js. 
**Dependencies**: ./aiResumeService.js, ./groqService.js

**Functions and Logic Components**: 
- `parseResume(buffer, mimeType)`
  - *Purpose*: Implements logic for parseResume.
  - *Inputs*: buffer, mimeType

### File: backend/services/resumeScoringService.js
**Purpose**: Contains logic and definitions for resumeScoringService.js. 
**Dependencies**: None

**Functions and Logic Components**: 
- `calculateKeywordMatch(resumeText, jobSkills = [])`
  - *Purpose*: Implements logic for calculateKeywordMatch.
  - *Inputs*: resumeText, jobSkills = []
- `analyzeStructure(resumeText)`
  - *Purpose*: Implements logic for analyzeStructure.
  - *Inputs*: resumeText
- `calculateImpactScore(resumeText)`
  - *Purpose*: Implements logic for calculateImpactScore.
  - *Inputs*: resumeText
- `scoreResume(resumeText, job = null)`
  - *Purpose*: Implements logic for scoreResume.
  - *Inputs*: resumeText, job = null

### File: backend/services/schedulingAlgorithm.js
**Purpose**: Contains logic and definitions for schedulingAlgorithm.js. 
**Dependencies**: None

**Functions and Logic Components**: 
- `shuffleArray(array)`
  - *Purpose*: Implements logic for shuffleArray.
  - *Inputs*: array
- `timeToMinutes(timeString)`
  - *Purpose*: Implements logic for timeToMinutes.
  - *Inputs*: timeString
- `minutesToTime(minutes)`
  - *Purpose*: Implements logic for minutesToTime.
  - *Inputs*: minutes
- `scheduleInterviewsWithRoundRobin(candidates, interviewers, config)`
  - *Purpose*: Implements logic for scheduleInterviewsWithRoundRobin.
  - *Inputs*: candidates, interviewers, config
- `scheduleInterviewsSequential(candidates, config)`
  - *Purpose*: Implements logic for scheduleInterviewsSequential.
  - *Inputs*: candidates, config

### File: backend/setup-jobs-schema.js
**Purpose**: Contains logic and definitions for setup-jobs-schema.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `createJobPostingsTable()`
  - *Purpose*: Implements logic for createJobPostingsTable.
  - *Inputs*: None

### File: backend/setup-schema.js
**Purpose**: Contains logic and definitions for setup-schema.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `setupSchema()`
  - *Purpose*: Implements logic for setupSchema.
  - *Inputs*: None

### File: backend/setup-themes-schema.js
**Purpose**: Contains logic and definitions for setup-themes-schema.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `setupThemesSchema()`
  - *Purpose*: Implements logic for setupThemesSchema.
  - *Inputs*: None

### File: backend/smoke-test-neon.js
**Purpose**: Contains logic and definitions for smoke-test-neon.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `smokeTest()`
  - *Purpose*: Implements logic for smokeTest.
  - *Inputs*: None

### File: backend/test-app-flow-root.js
**Purpose**: Contains logic and definitions for test-app-flow-root.js. 
**Dependencies**: pg, dotenv, path

**Functions and Logic Components**: 
- `testApplicationFlow()`
  - *Purpose*: Implements logic for testApplicationFlow.
  - *Inputs*: None

### File: backend/test-app-flow.js
**Purpose**: Contains logic and definitions for test-app-flow.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `testApplicationFlow()`
  - *Purpose*: Implements logic for testApplicationFlow.
  - *Inputs*: None

### File: backend/test-db.js
**Purpose**: Contains logic and definitions for test-db.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `testConnection()`
  - *Purpose*: Implements logic for testConnection.
  - *Inputs*: None

### File: backend/test-fixed-query.js
**Purpose**: Contains logic and definitions for test-fixed-query.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `testFixedQuery()`
  - *Purpose*: Implements logic for testFixedQuery.
  - *Inputs*: None

### File: backend/test-flow.js
**Purpose**: Contains logic and definitions for test-flow.js. 
**Dependencies**: None

**Functions and Logic Components**: 
- `testBackend()`
  - *Purpose*: Implements logic for testBackend.
  - *Inputs*: None

### File: backend/test-groq-direct.js
**Purpose**: Contains logic and definitions for test-groq-direct.js. 
**Dependencies**: ./services/groqService.js, dotenv

**Functions and Logic Components**: 
- `runTest()`
  - *Purpose*: Implements logic for runTest.
  - *Inputs*: None

### File: backend/test-job-education.js
**Purpose**: Contains logic and definitions for test-job-education.js. 
**Dependencies**: ./config/db.js, dotenv

**Functions and Logic Components**: 
- `runTest()`
  - *Purpose*: Implements logic for runTest.
  - *Inputs*: None

### File: backend/test-login.js
**Purpose**: Contains logic and definitions for test-login.js. 
**Dependencies**: None

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: backend/test-profile-flow.js
**Purpose**: Contains logic and definitions for test-profile-flow.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `runTests()`
  - *Purpose*: Implements logic for runTests.
  - *Inputs*: None

### File: backend/test-profile-schema.js
**Purpose**: Contains logic and definitions for test-profile-schema.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `testProfileSave()`
  - *Purpose*: Implements logic for testProfileSave.
  - *Inputs*: None

### File: backend/test-query.js
**Purpose**: Contains logic and definitions for test-query.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `testQuery()`
  - *Purpose*: Implements logic for testQuery.
  - *Inputs*: None

### File: backend/test-recruiter-query.js
**Purpose**: Contains logic and definitions for test-recruiter-query.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `test()`
  - *Purpose*: Implements logic for test.
  - *Inputs*: None

### File: backend/test-resume-parser.js
**Purpose**: Contains logic and definitions for test-resume-parser.js. 
**Dependencies**: ./services/resumeParser.js, fs, path

**Functions and Logic Components**: 
- `testResumeParsing()`
  - *Purpose*: Implements logic for testResumeParsing.
  - *Inputs*: None

### File: backend/tmp_test_db.js
**Purpose**: Contains logic and definitions for tmp_test_db.js. 
**Dependencies**: dotenv/config, ./config/db.js

**Functions and Logic Components**: 
- `testLoginQuery()`
  - *Purpose*: Implements logic for testLoginQuery.
  - *Inputs*: None

### File: backend/triggerSync.js
**Purpose**: Contains logic and definitions for triggerSync.js. 
**Dependencies**: None

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: backend/utils/agoraToken.js
**Purpose**: Contains logic and definitions for agoraToken.js. 
**Dependencies**: agora-access-token, dotenv, uuid

**Functions and Logic Components**: 
- `generateAgoraToken(channelName, uid = 0, role = 'publisher')`
  - *Purpose*: Implements logic for generateAgoraToken.
  - *Inputs*: channelName, uid = 0, role = 'publisher'
- `generateChannelName()`
  - *Purpose*: Implements logic for generateChannelName.
  - *Inputs*: None

### File: backend/utils/cache.js
**Purpose**: Contains logic and definitions for cache.js. 
**Dependencies**: ../config/redis.js

**Functions and Logic Components**: 
- `isReady()`
  - *Purpose*: Implements logic for isReady.
  - *Inputs*: None
- `getCache(key)`
  - *Purpose*: Implements logic for getCache.
  - *Inputs*: key
- `setCache(key, data, ttl = 300)`
  - *Purpose*: Implements logic for setCache.
  - *Inputs*: key, data, ttl = 300
- `deleteCache(...keys)`
  - *Purpose*: Implements logic for deleteCache.
  - *Inputs*: ...keys

### File: backend/utils/emailService.js
**Purpose**: Contains logic and definitions for emailService.js. 
**Dependencies**: nodemailer, dotenv

**Functions and Logic Components**: 
- `sendInterviewEmail(candidateEmail, interviewDetails)`
  - *Purpose*: Implements logic for sendInterviewEmail.
  - *Inputs*: candidateEmail, interviewDetails

### File: backend/utils/validation.js
**Purpose**: Contains logic and definitions for validation.js. 
**Dependencies**: None

**Functions and Logic Components**: 
- `isValidEmail(email)`
  - *Purpose*: Implements logic for isValidEmail.
  - *Inputs*: email
- `isValidPassword(password)`
  - *Purpose*: Implements logic for isValidPassword.
  - *Inputs*: password
- `validateRequired(fields, required)`
  - *Purpose*: Implements logic for validateRequired.
  - *Inputs*: fields, required
- `isValidIntent(intent)`
  - *Purpose*: Implements logic for isValidIntent.
  - *Inputs*: intent
- `mapIntentToRole(intent)`
  - *Purpose*: Implements logic for mapIntentToRole.
  - *Inputs*: intent

### File: backend/verify-segregation.js
**Purpose**: Contains logic and definitions for verify-segregation.js. 
**Dependencies**: axios

**Functions and Logic Components**: 
- `verifyJobs()`
  - *Purpose*: Implements logic for verifyJobs.
  - *Inputs*: None

### File: backend/verify_fix.js
**Purpose**: Contains logic and definitions for verify_fix.js. 
**Dependencies**: ./config/db.js

**Functions and Logic Components**: 
- `verifyFix()`
  - *Purpose*: Implements logic for verifyFix.
  - *Inputs*: None

### File: backend/verify_profile_prefill.js
**Purpose**: Contains logic and definitions for verify_profile_prefill.js. 
**Dependencies**: pg, jsonwebtoken, dotenv, axios

**Functions and Logic Components**: 
- `testProfilePrefill()`
  - *Purpose*: Implements logic for testProfilePrefill.
  - *Inputs*: None

### File: frontend/eslint.config.js
**Purpose**: Contains logic and definitions for eslint.config.js. 
**Dependencies**: @eslint/js, globals, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-react-refresh

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: frontend/postcss.config.js
**Purpose**: Contains logic and definitions for postcss.config.js. 
**Dependencies**: None

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: frontend/src/api/applications.js
**Purpose**: Contains logic and definitions for applications.js. 
**Dependencies**: ./axios

**Functions and Logic Components**: 
- `getUserApplications()`
  - *Purpose*: Implements logic for getUserApplications.
  - *Inputs*: None
- `applyToJob(jobId, payload)`
  - *Purpose*: Implements logic for applyToJob.
  - *Inputs*: jobId, payload
- `getJobApplications(jobId)`
  - *Purpose*: Implements logic for getJobApplications.
  - *Inputs*: jobId
- `getAllRecruiterApplications()`
  - *Purpose*: Implements logic for getAllRecruiterApplications.
  - *Inputs*: None
- `updateApplicationStatus(appId, status)`
  - *Purpose*: Implements logic for updateApplicationStatus.
  - *Inputs*: appId, status
- `getApplicationResume(applicationId)`
  - *Purpose*: Implements logic for getApplicationResume.
  - *Inputs*: applicationId
- `getApplicationProfileSnapshot(applicationId)`
  - *Purpose*: Implements logic for getApplicationProfileSnapshot.
  - *Inputs*: applicationId

### File: frontend/src/api/auth.js
**Purpose**: Contains logic and definitions for auth.js. 
**Dependencies**: None

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: frontend/src/api/axios.js
**Purpose**: Contains logic and definitions for axios.js. 
**Dependencies**: axios

**Functions and Logic Components**: 
- `getBaseUrl()`
  - *Purpose*: Implements logic for getBaseUrl.
  - *Inputs*: None

### File: frontend/src/api/jobs.js
**Purpose**: Contains logic and definitions for jobs.js. 
**Dependencies**: ./axios

**Functions and Logic Components**: 
- `getJobs(filters = {})`
  - *Purpose*: Implements logic for getJobs.
  - *Inputs*: filters = {}
- `getJobById(id)`
  - *Purpose*: Implements logic for getJobById.
  - *Inputs*: id
- `getJobsInIndia(params = {})`
  - *Purpose*: Implements logic for getJobsInIndia.
  - *Inputs*: params = {}
- `updateJobStatus(jobId, status)`
  - *Purpose*: Implements logic for updateJobStatus.
  - *Inputs*: jobId, status
- `deleteJob(jobId)`
  - *Purpose*: Implements logic for deleteJob.
  - *Inputs*: jobId

### File: frontend/src/api/themes.js
**Purpose**: Contains logic and definitions for themes.js. 
**Dependencies**: ./axios

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: frontend/src/api/users.js
**Purpose**: Contains logic and definitions for users.js. 
**Dependencies**: ./axios

**Functions and Logic Components**: 
- `getUserProfile()`
  - *Purpose*: Implements logic for getUserProfile.
  - *Inputs*: None
- `updateUserProfile(data)`
  - *Purpose*: Implements logic for updateUserProfile.
  - *Inputs*: data
- `updateFresherStatus(isFresher)`
  - *Purpose*: Implements logic for updateFresherStatus.
  - *Inputs*: isFresher
- `addEducation(data)`
  - *Purpose*: Implements logic for addEducation.
  - *Inputs*: data
- `deleteEducation(id)`
  - *Purpose*: Implements logic for deleteEducation.
  - *Inputs*: id
- `addExperience(data)`
  - *Purpose*: Implements logic for addExperience.
  - *Inputs*: data
- `deleteExperience(id)`
  - *Purpose*: Implements logic for deleteExperience.
  - *Inputs*: id
- `addAchievement(data)`
  - *Purpose*: Implements logic for addAchievement.
  - *Inputs*: data
- `deleteAchievement(id)`
  - *Purpose*: Implements logic for deleteAchievement.
  - *Inputs*: id
- `addProject(data)`
  - *Purpose*: Implements logic for addProject.
  - *Inputs*: data
- `deleteProject(id)`
  - *Purpose*: Implements logic for deleteProject.
  - *Inputs*: id
- `getProfileImage()`
  - *Purpose*: Implements logic for getProfileImage.
  - *Inputs*: None
- `uploadProfileImage(data)`
  - *Purpose*: Implements logic for uploadProfileImage.
  - *Inputs*: data
- `deleteProfileImage()`
  - *Purpose*: Implements logic for deleteProfileImage.
  - *Inputs*: None
- `getDashboardStats()`
  - *Purpose*: Implements logic for getDashboardStats.
  - *Inputs*: None
- `getUserActivity()`
  - *Purpose*: Implements logic for getUserActivity.
  - *Inputs*: None
- `getAllResumes()`
  - *Purpose*: Implements logic for getAllResumes.
  - *Inputs*: None
- `getProfileResume()`
  - *Purpose*: Implements logic for getProfileResume.
  - *Inputs*: None
- `fetchResume(resumeId)`
  - *Purpose*: Implements logic for fetchResume.
  - *Inputs*: resumeId
- `uploadResume(file, options = {})`
  - *Purpose*: Implements logic for uploadResume.
  - *Inputs*: file, options = {}
- `deleteResume(resumeId)`
  - *Purpose*: Implements logic for deleteResume.
  - *Inputs*: resumeId
- `setDefaultResume(resumeId)`
  - *Purpose*: Implements logic for setDefaultResume.
  - *Inputs*: resumeId

### File: frontend/src/App.jsx
**Purpose**: Contains logic and definitions for App.jsx. 
**Dependencies**: react-router-dom, ./routes/AppRoutes, ./contexts/AuthContext, ./contexts/ThemeContext, ./components/chatbot/ChatbotWidget, react

**Functions and Logic Components**: 
- `AdminStylesLoader()`
  - *Purpose*: Implements logic for AdminStylesLoader.
  - *Inputs*: None
- `App()`
  - *Purpose*: Implements logic for App.
  - *Inputs*: None

### File: frontend/src/components/admin-layout/AdminCommandMenu.jsx
**Purpose**: Contains logic and definitions for AdminCommandMenu.jsx. 
**Dependencies**: react, framer-motion, react-router-dom, lucide-react

**Functions and Logic Components**: 
- `AdminCommandMenu()`
  - *Purpose*: Implements logic for AdminCommandMenu.
  - *Inputs*: None
- `executeCommand(key)`
  - *Purpose*: Implements logic for executeCommand.
  - *Inputs*: key
- `handleGlobalKeyDown(e)`
  - *Purpose*: Implements logic for handleGlobalKeyDown.
  - *Inputs*: e

### File: frontend/src/components/admin-layout/AdminLayout.jsx
**Purpose**: Contains logic and definitions for AdminLayout.jsx. 
**Dependencies**: react, framer-motion, ../../contexts/AuthContext, ./AdminCommandMenu, ../../assets/admin.css, lucide-react

**Functions and Logic Components**: 
- `AdminLayout({ children })`
  - *Purpose*: Implements logic for AdminLayout.
  - *Inputs*: { children }
- `handleLogout()`
  - *Purpose*: Implements logic for handleLogout.
  - *Inputs*: None

### File: frontend/src/components/admin-layout/AdminMatrixRain.jsx
**Purpose**: Contains logic and definitions for AdminMatrixRain.jsx. 
**Dependencies**: react

**Functions and Logic Components**: 
- `AdminMatrixRain()`
  - *Purpose*: Implements logic for AdminMatrixRain.
  - *Inputs*: None
- `setCanvasSize()`
  - *Purpose*: Implements logic for setCanvasSize.
  - *Inputs*: None
- `draw()`
  - *Purpose*: Implements logic for draw.
  - *Inputs*: None

### File: frontend/src/components/admin-layout/AdminMetricCard.jsx
**Purpose**: Contains logic and definitions for AdminMetricCard.jsx. 
**Dependencies**: react, framer-motion, ../../hooks/useCountUp, lucide-react

**Functions and Logic Components**: 
- `AdminMetricCard({ label, value, icon: Icon, accentColor, status, delay = 0 })`
  - *Purpose*: Implements logic for AdminMetricCard.
  - *Inputs*: { label, value, icon: Icon, accentColor, status, delay = 0 }

### File: frontend/src/components/admin-layout/AdminSystemChart.jsx
**Purpose**: Contains logic and definitions for AdminSystemChart.jsx. 
**Dependencies**: react, framer-motion, recharts, lucide-react

**Functions and Logic Components**: 
- `AdminSystemChart({ title, data = dummyData, color = "#4F46E5" })`
  - *Purpose*: Implements logic for AdminSystemChart.
  - *Inputs*: { title, data = dummyData, color = "#4F46E5" }

### File: frontend/src/components/admin-layout/AdminTerminalPanel.jsx
**Purpose**: Contains logic and definitions for AdminTerminalPanel.jsx. 
**Dependencies**: react, framer-motion, ../../hooks/useTypingEffect, lucide-react

**Functions and Logic Components**: 
- `AdminTerminalPanel()`
  - *Purpose*: Implements logic for AdminTerminalPanel.
  - *Inputs*: None

### File: frontend/src/components/admin-layout/GlitchText.jsx
**Purpose**: Contains logic and definitions for GlitchText.jsx. 
**Dependencies**: react, framer-motion

**Functions and Logic Components**: 
- `GlitchText({ text, className = '' })`
  - *Purpose*: Implements logic for GlitchText.
  - *Inputs*: { text, className = '' }

### File: frontend/src/components/auth/AuthPage.jsx
**Purpose**: Contains logic and definitions for AuthPage.jsx. 
**Dependencies**: react, react-router-dom, ../../contexts/AuthContext, framer-motion

**Functions and Logic Components**: 
- `CursorGlow()`
  - *Purpose*: Implements logic for CursorGlow.
  - *Inputs*: None
- `move(e)`
  - *Purpose*: Implements logic for move.
  - *Inputs*: e
- `AuthBg()`
  - *Purpose*: Implements logic for AuthBg.
  - *Inputs*: None
- `move(e)`
  - *Purpose*: Implements logic for move.
  - *Inputs*: e
- `AuthPage()`
  - *Purpose*: Implements logic for AuthPage.
  - *Inputs*: None
- `handleChange(e)`
  - *Purpose*: Implements logic for handleChange.
  - *Inputs*: e
- `handleSubmit(e)`
  - *Purpose*: Implements logic for handleSubmit.
  - *Inputs*: e
- `toggleMode(m)`
  - *Purpose*: Implements logic for toggleMode.
  - *Inputs*: m

### File: frontend/src/components/auth/OAuthSuccess.jsx
**Purpose**: Contains logic and definitions for OAuthSuccess.jsx. 
**Dependencies**: react, react-router-dom, ../../contexts/AuthContext, ../../components/ui/LoadingSpinner

**Functions and Logic Components**: 
- `OAuthSuccess()`
  - *Purpose*: Implements logic for OAuthSuccess.
  - *Inputs*: None

### File: frontend/src/components/auth/ProtectedRoute.jsx
**Purpose**: Contains logic and definitions for ProtectedRoute.jsx. 
**Dependencies**: react-router-dom, ../../contexts/AuthContext, ./../../components/ui/LoadingSpinner

**Functions and Logic Components**: 
- `ProtectedRoute({ allowedRoles = [] })`
  - *Purpose*: Implements logic for ProtectedRoute.
  - *Inputs*: { allowedRoles = [] }

### File: frontend/src/components/chatbot/ChatbotWidget.jsx
**Purpose**: Contains logic and definitions for ChatbotWidget.jsx. 
**Dependencies**: react

**Functions and Logic Components**: 
- `ChatbotWidget()`
  - *Purpose*: Implements logic for ChatbotWidget.
  - *Inputs*: None
- `scrollToBottom()`
  - *Purpose*: Implements logic for scrollToBottom.
  - *Inputs*: None
- `handleSendMessage(e)`
  - *Purpose*: Implements logic for handleSendMessage.
  - *Inputs*: e
- `toggleChat()`
  - *Purpose*: Implements logic for toggleChat.
  - *Inputs*: None

### File: frontend/src/components/coding/MonacoCodeEditor.jsx
**Purpose**: Contains logic and definitions for MonacoCodeEditor.jsx. 
**Dependencies**: @monaco-editor/react

**Functions and Logic Components**: 
- `MonacoCodeEditor({ value, onChange, language = 'python3', height = '400px', readOnly = false, theme = 'vs-dark' })`
  - *Purpose*: Implements logic for MonacoCodeEditor.
  - *Inputs*: { value, onChange, language = 'python3', height = '400px', readOnly = false, theme = 'vs-dark' }
- `handleEditorChange(newValue)`
  - *Purpose*: Implements logic for handleEditorChange.
  - *Inputs*: newValue

### File: frontend/src/components/coding/SubmissionCodeModal.jsx
**Purpose**: Contains logic and definitions for SubmissionCodeModal.jsx. 
**Dependencies**: react, @monaco-editor/react, lucide-react

**Functions and Logic Components**: 
- `SubmissionCodeModal({ open, onClose, submission })`
  - *Purpose*: Implements logic for SubmissionCodeModal.
  - *Inputs*: { open, onClose, submission }

### File: frontend/src/components/futuristic/AILoader.jsx
**Purpose**: Contains logic and definitions for AILoader.jsx. 
**Dependencies**: framer-motion

**Functions and Logic Components**: 
- `AILoader({ text = 'Processing...', size = 'md' })`
  - *Purpose*: Implements logic for AILoader.
  - *Inputs*: { text = 'Processing...', size = 'md' }

### File: frontend/src/components/futuristic/AnimatedCounter.jsx
**Purpose**: Contains logic and definitions for AnimatedCounter.jsx. 
**Dependencies**: react, framer-motion

**Functions and Logic Components**: 
- `AnimatedCounter({ value = 0, duration = 1.2, className = '' })`
  - *Purpose*: Implements logic for AnimatedCounter.
  - *Inputs*: { value = 0, duration = 1.2, className = '' }

### File: frontend/src/components/futuristic/ErrorBoundary.jsx
**Purpose**: Contains logic and definitions for ErrorBoundary.jsx. 
**Dependencies**: react, lucide-react

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: frontend/src/components/futuristic/GlassCard.jsx
**Purpose**: Contains logic and definitions for GlassCard.jsx. 
**Dependencies**: framer-motion, clsx

**Functions and Logic Components**: 
- `GlassCard({ children, className = '', hover = false, glow = null, // 'cyan' | 'purple' | 'green' | 'amber' | 'red' | null padding = 'md', // 'none' | 'sm' | 'md' | 'lg' animate = true, onClick, ...props })`
  - *Purpose*: Implements logic for GlassCard.
  - *Inputs*: { children, className = '', hover = false, glow = null, // 'cyan' | 'purple' | 'green' | 'amber' | 'red' | null padding = 'md', // 'none' | 'sm' | 'md' | 'lg' animate = true, onClick, ...props }

### File: frontend/src/components/futuristic/MatchScoreRing.jsx
**Purpose**: Contains logic and definitions for MatchScoreRing.jsx. 
**Dependencies**: react, framer-motion, ../../design-tokens

**Functions and Logic Components**: 
- `MatchScoreRing({ score = 0, size = 80, label = '', thickness = 6 })`
  - *Purpose*: Implements logic for MatchScoreRing.
  - *Inputs*: { score = 0, size = 80, label = '', thickness = 6 }

### File: frontend/src/components/futuristic/SkeletonCard.jsx
**Purpose**: Contains logic and definitions for SkeletonCard.jsx. 
**Dependencies**: None

**Functions and Logic Components**: 
- `SkeletonCard({ lines = 3, height = 'h-32', className = '' })`
  - *Purpose*: Implements logic for SkeletonCard.
  - *Inputs*: { lines = 3, height = 'h-32', className = '' }
- `SkeletonText({ width = 'w-full', height = 'h-4' })`
  - *Purpose*: Implements logic for SkeletonText.
  - *Inputs*: { width = 'w-full', height = 'h-4' }
- `SkeletonAvatar({ size = 'w-12 h-12' })`
  - *Purpose*: Implements logic for SkeletonAvatar.
  - *Inputs*: { size = 'w-12 h-12' }

### File: frontend/src/components/futuristic/TiltCard.jsx
**Purpose**: Contains logic and definitions for TiltCard.jsx. 
**Dependencies**: react, framer-motion

**Functions and Logic Components**: 
- `TiltCard({ children, className = '', strength = 8 })`
  - *Purpose*: Implements logic for TiltCard.
  - *Inputs*: { children, className = '', strength = 8 }
- `handleMouseMove(e)`
  - *Purpose*: Implements logic for handleMouseMove.
  - *Inputs*: e
- `handleMouseLeave()`
  - *Purpose*: Implements logic for handleMouseLeave.
  - *Inputs*: None

### File: frontend/src/components/layout/DashboardLayout.jsx
**Purpose**: Contains logic and definitions for DashboardLayout.jsx. 
**Dependencies**: lucide-react, react, ./Sidebar, ../../api/users

**Functions and Logic Components**: 
- `DashboardLayout({ type = 'user', title, children })`
  - *Purpose*: Implements logic for DashboardLayout.
  - *Inputs*: { type = 'user', title, children }
- `fetchProfileImage()`
  - *Purpose*: Implements logic for fetchProfileImage.
  - *Inputs*: None

### File: frontend/src/components/layout/Footer.jsx
**Purpose**: Contains logic and definitions for Footer.jsx. 
**Dependencies**: lucide-react, react-router-dom

**Functions and Logic Components**: 
- `Footer()`
  - *Purpose*: Implements logic for Footer.
  - *Inputs*: None

### File: frontend/src/components/layout/index.js
**Purpose**: Contains logic and definitions for index.js. 
**Dependencies**: None

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: frontend/src/components/layout/Navbar.jsx
**Purpose**: Contains logic and definitions for Navbar.jsx. 
**Dependencies**: lucide-react, react, react-router-dom, ../ui/Button

**Functions and Logic Components**: 
- `Navbar()`
  - *Purpose*: Implements logic for Navbar.
  - *Inputs*: None

### File: frontend/src/components/layout/Sidebar.jsx
**Purpose**: Contains logic and definitions for Sidebar.jsx. 
**Dependencies**: react, react-router-dom, ../../contexts/AuthContext

**Functions and Logic Components**: 
- `Sidebar({ type = 'user' })`
  - *Purpose*: Implements logic for Sidebar.
  - *Inputs*: { type = 'user' }
- `handleLogout()`
  - *Purpose*: Implements logic for handleLogout.
  - *Inputs*: None
- `isActive(path)`
  - *Purpose*: Implements logic for isActive.
  - *Inputs*: path

### File: frontend/src/components/profile/AchievementsForm.jsx
**Purpose**: Contains logic and definitions for AchievementsForm.jsx. 
**Dependencies**: lucide-react, ../ui

**Functions and Logic Components**: 
- `AchievementsForm({ achievements, onUpdate, onAdd, onRemove })`
  - *Purpose*: Implements logic for AchievementsForm.
  - *Inputs*: { achievements, onUpdate, onAdd, onRemove }

### File: frontend/src/components/profile/AddEducationModal.jsx
**Purpose**: Contains logic and definitions for AddEducationModal.jsx. 
**Dependencies**: react, ../ui/Modal, ../ui, ../../api/users

**Functions and Logic Components**: 
- `AddEducationModal({ isOpen, onClose, onSuccess })`
  - *Purpose*: Implements logic for AddEducationModal.
  - *Inputs*: { isOpen, onClose, onSuccess }
- `handleSubmit(e)`
  - *Purpose*: Implements logic for handleSubmit.
  - *Inputs*: e

### File: frontend/src/components/profile/AddExperienceModal.jsx
**Purpose**: Contains logic and definitions for AddExperienceModal.jsx. 
**Dependencies**: react, ../ui/Modal, ../ui, ../../api/users

**Functions and Logic Components**: 
- `AddExperienceModal({ isOpen, onClose, onSuccess })`
  - *Purpose*: Implements logic for AddExperienceModal.
  - *Inputs*: { isOpen, onClose, onSuccess }
- `handleSubmit(e)`
  - *Purpose*: Implements logic for handleSubmit.
  - *Inputs*: e

### File: frontend/src/components/profile/EducationForm.jsx
**Purpose**: Contains logic and definitions for EducationForm.jsx. 
**Dependencies**: lucide-react, ../ui

**Functions and Logic Components**: 
- `EducationForm({ education, onUpdate, onAdd, onRemove })`
  - *Purpose*: Implements logic for EducationForm.
  - *Inputs*: { education, onUpdate, onAdd, onRemove }

### File: frontend/src/components/profile/ExperienceForm.jsx
**Purpose**: Contains logic and definitions for ExperienceForm.jsx. 
**Dependencies**: lucide-react, ../ui

**Functions and Logic Components**: 
- `ExperienceForm({ experience, onUpdate, onAdd, onRemove })`
  - *Purpose*: Implements logic for ExperienceForm.
  - *Inputs*: { experience, onUpdate, onAdd, onRemove }

### File: frontend/src/components/profile/PersonalInfoForm.jsx
**Purpose**: Contains logic and definitions for PersonalInfoForm.jsx. 
**Dependencies**: lucide-react, ../ui

**Functions and Logic Components**: 
- `PersonalInfoForm({ profile, setProfile, profileImage, handleImageUpload, isUploadingImage })`
  - *Purpose*: Implements logic for PersonalInfoForm.
  - *Inputs*: { profile, setProfile, profileImage, handleImageUpload, isUploadingImage }
- `handleFresherToggle(value)`
  - *Purpose*: Implements logic for handleFresherToggle.
  - *Inputs*: value

### File: frontend/src/components/profile/ProjectsForm.jsx
**Purpose**: Contains logic and definitions for ProjectsForm.jsx. 
**Dependencies**: lucide-react, ../ui

**Functions and Logic Components**: 
- `ProjectsForm({ projects, onUpdate, onAdd, onRemove })`
  - *Purpose*: Implements logic for ProjectsForm.
  - *Inputs*: { projects, onUpdate, onAdd, onRemove }

### File: frontend/src/components/profile/ResumeAutoFill.jsx
**Purpose**: Contains logic and definitions for ResumeAutoFill.jsx. 
**Dependencies**: react, lucide-react, ../ui

**Functions and Logic Components**: 
- `ResumeAutoFill({ onExtractComplete })`
  - *Purpose*: Implements logic for ResumeAutoFill.
  - *Inputs*: { onExtractComplete }
- `handleFileSelect(e)`
  - *Purpose*: Implements logic for handleFileSelect.
  - *Inputs*: e
- `handleUpload()`
  - *Purpose*: Implements logic for handleUpload.
  - *Inputs*: None

### File: frontend/src/components/profile/ResumeUpload.jsx
**Purpose**: Contains logic and definitions for ResumeUpload.jsx. 
**Dependencies**: lucide-react, ../ui

**Functions and Logic Components**: 
- `ResumeUpload({ hasResume, resumeFile, onSelectFile, onDelete, pViewResume, onReupload })`
  - *Purpose*: Implements logic for ResumeUpload.
  - *Inputs*: { hasResume, resumeFile, onSelectFile, onDelete, pViewResume, onReupload }

### File: frontend/src/components/profile/SkillsForm.jsx
**Purpose**: Contains logic and definitions for SkillsForm.jsx. 
**Dependencies**: lucide-react, react, ../ui

**Functions and Logic Components**: 
- `SkillsForm({ skills, onAdd, onRemove })`
  - *Purpose*: Implements logic for SkillsForm.
  - *Inputs*: { skills, onAdd, onRemove }
- `handleAdd()`
  - *Purpose*: Implements logic for handleAdd.
  - *Inputs*: None

### File: frontend/src/components/provider-layout/index.js
**Purpose**: Contains logic and definitions for index.js. 
**Dependencies**: None

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: frontend/src/components/provider-layout/ProviderErrorBoundary.jsx
**Purpose**: Contains logic and definitions for ProviderErrorBoundary.jsx. 
**Dependencies**: react, framer-motion, lucide-react, react-router-dom

**Functions and Logic Components**: 
- `ProviderErrorBoundary({ children })`
  - *Purpose*: Implements logic for ProviderErrorBoundary.
  - *Inputs*: { children }

### File: frontend/src/components/provider-layout/ProviderLayout.jsx
**Purpose**: Contains logic and definitions for ProviderLayout.jsx. 
**Dependencies**: framer-motion, ./WorkspaceDock, ./ProviderErrorBoundary

**Functions and Logic Components**: 
- `ProviderLayout({ children })`
  - *Purpose*: Implements logic for ProviderLayout.
  - *Inputs*: { children }

### File: frontend/src/components/provider-layout/WorkspaceDock.jsx
**Purpose**: Contains logic and definitions for WorkspaceDock.jsx. 
**Dependencies**: react-router-dom, framer-motion, react, ../../contexts/AuthContext

**Functions and Logic Components**: 
- `WorkspaceDock()`
  - *Purpose*: Implements logic for WorkspaceDock.
  - *Inputs*: None
- `handleKeyDown(e)`
  - *Purpose*: Implements logic for handleKeyDown.
  - *Inputs*: e
- `handleLogout()`
  - *Purpose*: Implements logic for handleLogout.
  - *Inputs*: None
- `getInitials(name)`
  - *Purpose*: Implements logic for getInitials.
  - *Inputs*: name

### File: frontend/src/components/provider-ui/DataTable.jsx
**Purpose**: Contains logic and definitions for DataTable.jsx. 
**Dependencies**: lucide-react, ./SkeletonCard

**Functions and Logic Components**: 
- `DataTable({ columns, data, loading, emptyMessage = 'No data found', onRowClick })`
  - *Purpose*: Implements logic for DataTable.
  - *Inputs*: { columns, data, loading, emptyMessage = 'No data found', onRowClick }

### File: frontend/src/components/provider-ui/EmptyState.jsx
**Purpose**: Contains logic and definitions for EmptyState.jsx. 
**Dependencies**: react, framer-motion

**Functions and Logic Components**: 
- `EmptyState({ icon: Icon, title, description, actionLabel, onAction, className = "" })`
  - *Purpose*: Implements logic for EmptyState.
  - *Inputs*: { icon: Icon, title, description, actionLabel, onAction, className = "" }

### File: frontend/src/components/provider-ui/index.js
**Purpose**: Contains logic and definitions for index.js. 
**Dependencies**: None

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: frontend/src/components/provider-ui/MetricCard.jsx
**Purpose**: Contains logic and definitions for MetricCard.jsx. 
**Dependencies**: framer-motion, react, lucide-react

**Functions and Logic Components**: 
- `MetricCard({ title, value, icon: Icon, trend, trendLabel, color = 'blue' })`
  - *Purpose*: Implements logic for MetricCard.
  - *Inputs*: { title, value, icon: Icon, trend, trendLabel, color = 'blue' }
- `handleMouseMove(e)`
  - *Purpose*: Implements logic for handleMouseMove.
  - *Inputs*: e
- `handleMouseLeave()`
  - *Purpose*: Implements logic for handleMouseLeave.
  - *Inputs*: None

### File: frontend/src/components/provider-ui/SkeletonCard.jsx
**Purpose**: Contains logic and definitions for SkeletonCard.jsx. 
**Dependencies**: None

**Functions and Logic Components**: 
- `SkeletonCard({ lines = 3, height = 'h-32', className = '' })`
  - *Purpose*: Implements logic for SkeletonCard.
  - *Inputs*: { lines = 3, height = 'h-32', className = '' }

### File: frontend/src/components/provider-ui/StatusBadge.jsx
**Purpose**: Contains logic and definitions for StatusBadge.jsx. 
**Dependencies**: None

**Functions and Logic Components**: 
- `StatusBadge({ status })`
  - *Purpose*: Implements logic for StatusBadge.
  - *Inputs*: { status }
- `getStyles(status)`
  - *Purpose*: Implements logic for getStyles.
  - *Inputs*: status

### File: frontend/src/components/provider-ui/Toast.jsx
**Purpose**: Contains logic and definitions for Toast.jsx. 
**Dependencies**: framer-motion, lucide-react

**Functions and Logic Components**: 
- `Toast({ message, type = 'success', onClose })`
  - *Purpose*: Implements logic for Toast.
  - *Inputs*: { message, type = 'success', onClose }

### File: frontend/src/components/provider-ui/TopProgressBar.jsx
**Purpose**: Contains logic and definitions for TopProgressBar.jsx. 
**Dependencies**: framer-motion

**Functions and Logic Components**: 
- `TopProgressBar({ loading })`
  - *Purpose*: Implements logic for TopProgressBar.
  - *Inputs*: { loading }

### File: frontend/src/components/shared/ApplicantCard.jsx
**Purpose**: Contains logic and definitions for ApplicantCard.jsx. 
**Dependencies**: lucide-react, ../ui/Badge, ../ui/Button

**Functions and Logic Components**: 
- `ApplicantCard({ applicant, onViewResume, onViewProfile, onShortlist, onInterview, onAccept, onReject, className = '', })`
  - *Purpose*: Implements logic for ApplicantCard.
  - *Inputs*: { applicant, onViewResume, onViewProfile, onShortlist, onInterview, onAccept, onReject, className = '', }

### File: frontend/src/components/shared/ApplicantDetailsModal.jsx
**Purpose**: Contains logic and definitions for ApplicantDetailsModal.jsx. 
**Dependencies**: react, lucide-react, ../ui, ../../api/applications

**Functions and Logic Components**: 
- `ApplicantDetailsModal({ applicant, isOpen, onClose, onUpdateStatus })`
  - *Purpose*: Implements logic for ApplicantDetailsModal.
  - *Inputs*: { applicant, isOpen, onClose, onUpdateStatus }
- `handleViewResume()`
  - *Purpose*: Implements logic for handleViewResume.
  - *Inputs*: None

### File: frontend/src/components/shared/AutoApplyModal.jsx
**Purpose**: Contains logic and definitions for AutoApplyModal.jsx. 
**Dependencies**: react, react-dom, lucide-react, ../ui

**Functions and Logic Components**: 
- `AutoApplyModal({ isOpen, onClose, active, onToggle })`
  - *Purpose*: Implements logic for AutoApplyModal.
  - *Inputs*: { isOpen, onClose, active, onToggle }

### File: frontend/src/components/shared/CandidateProfileContent.jsx
**Purpose**: Contains logic and definitions for CandidateProfileContent.jsx. 
**Dependencies**: lucide-react

**Functions and Logic Components**: 
- `CandidateProfileContent({ data, resumeUrl, onViewResume, isSnapshot, snapshotDate })`
  - *Purpose*: Implements logic for CandidateProfileContent.
  - *Inputs*: { data, resumeUrl, onViewResume, isSnapshot, snapshotDate }

### File: frontend/src/components/shared/CandidateProfilePanel.jsx
**Purpose**: Contains logic and definitions for CandidateProfilePanel.jsx. 
**Dependencies**: react, lucide-react, ../../api/applications, ./CandidateProfileContent

**Functions and Logic Components**: 
- `CandidateProfilePanel({ applicationId, isOpen, onClose, candidateName = 'Candidate', initialData = null, initialResumeUrl = null })`
  - *Purpose*: Implements logic for CandidateProfilePanel.
  - *Inputs*: { applicationId, isOpen, onClose, candidateName = 'Candidate', initialData = null, initialResumeUrl = null }
- `fetchProfileSnapshot()`
  - *Purpose*: Implements logic for fetchProfileSnapshot.
  - *Inputs*: None
- `fetchResume()`
  - *Purpose*: Implements logic for fetchResume.
  - *Inputs*: None
- `handleViewResume()`
  - *Purpose*: Implements logic for handleViewResume.
  - *Inputs*: None

### File: frontend/src/components/shared/CareerRoadmapModal.jsx
**Purpose**: Contains logic and definitions for CareerRoadmapModal.jsx. 
**Dependencies**: react, reactflow/dist/style.css, lucide-react, ../../api/axios

**Functions and Logic Components**: 
- `CareerRoadmapModal({ isOpen, onClose })`
  - *Purpose*: Implements logic for CareerRoadmapModal.
  - *Inputs*: { isOpen, onClose }
- `generateRoadmap()`
  - *Purpose*: Implements logic for generateRoadmap.
  - *Inputs*: None

### File: frontend/src/components/shared/CoverLetterModal.jsx
**Purpose**: Contains logic and definitions for CoverLetterModal.jsx. 
**Dependencies**: react, react-dom, lucide-react, ../ui, ../../api/axios

**Functions and Logic Components**: 
- `CoverLetterModal({ isOpen, onClose, candidateId })`
  - *Purpose*: Implements logic for CoverLetterModal.
  - *Inputs*: { isOpen, onClose, candidateId }
- `fetchJobs()`
  - *Purpose*: Implements logic for fetchJobs.
  - *Inputs*: None
- `handleGenerate()`
  - *Purpose*: Implements logic for handleGenerate.
  - *Inputs*: None
- `handleCopy()`
  - *Purpose*: Implements logic for handleCopy.
  - *Inputs*: None
- `handleDownload()`
  - *Purpose*: Implements logic for handleDownload.
  - *Inputs*: None
- `SparklesIcon({ className })`
  - *Purpose*: Implements logic for SparklesIcon.
  - *Inputs*: { className }

### File: frontend/src/components/shared/index.js
**Purpose**: Contains logic and definitions for index.js. 
**Dependencies**: None

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: frontend/src/components/shared/JobApplyModal.jsx
**Purpose**: Contains logic and definitions for JobApplyModal.jsx. 
**Dependencies**: react, lucide-react, ../ui, ../../api/axios, ../../api/applications, ../../api/users, ../../components/profile/PersonalInfoForm, ../../components/profile/SkillsForm, ../../components/profile/ExperienceForm, ../../components/profile/EducationForm, ../../components/profile/AchievementsForm, ../../components/profile/ProjectsForm, ../../components/profile/ResumeUpload, ./CandidateProfileContent, ../../utils/profileMapper

**Functions and Logic Components**: 
- `JobApplyModal({ job, isOpen, onClose })`
  - *Purpose*: Implements logic for JobApplyModal.
  - *Inputs*: { job, isOpen, onClose }
- `fetchJobDetails()`
  - *Purpose*: Implements logic for fetchJobDetails.
  - *Inputs*: None
- `fetchResumes()`
  - *Purpose*: Implements logic for fetchResumes.
  - *Inputs*: None
- `fetchProfile()`
  - *Purpose*: Implements logic for fetchProfile.
  - *Inputs*: None
- `fetchProfileImageForSnapshot()`
  - *Purpose*: Implements logic for fetchProfileImageForSnapshot.
  - *Inputs*: None
- `handleSaveProfile()`
  - *Purpose*: Implements logic for handleSaveProfile.
  - *Inputs*: None
- `handleImageUpload(file)`
  - *Purpose*: Implements logic for handleImageUpload.
  - *Inputs*: file
- `updateArrayItem(field, index, key, value)`
  - *Purpose*: Implements logic for updateArrayItem.
  - *Inputs*: field, index, key, value
- `addArrayItem(field, initialItem)`
  - *Purpose*: Implements logic for addArrayItem.
  - *Inputs*: field, initialItem
- `removeArrayItem(field, index)`
  - *Purpose*: Implements logic for removeArrayItem.
  - *Inputs*: field, index
- `handleAddSkill(skillName)`
  - *Purpose*: Implements logic for handleAddSkill.
  - *Inputs*: skillName
- `handleRemoveSkill(skillName)`
  - *Purpose*: Implements logic for handleRemoveSkill.
  - *Inputs*: skillName
- `handleViewResume()`
  - *Purpose*: Implements logic for handleViewResume.
  - *Inputs*: None
- `handleDeleteResume()`
  - *Purpose*: Implements logic for handleDeleteResume.
  - *Inputs*: None
- `handleAnswerChange(questionId, value)`
  - *Purpose*: Implements logic for handleAnswerChange.
  - *Inputs*: questionId, value
- `buildProfileSnapshot()`
  - *Purpose*: Implements logic for buildProfileSnapshot.
  - *Inputs*: None
- `handleSubmit()`
  - *Purpose*: Implements logic for handleSubmit.
  - *Inputs*: None
- `SelectionList({ title, items, selected, onChange, renderItem, emptyMsg, linkAction })`
  - *Purpose*: Implements logic for SelectionList.
  - *Inputs*: { title, items, selected, onChange, renderItem, emptyMsg, linkAction }

### File: frontend/src/components/shared/JobCard.jsx
**Purpose**: Contains logic and definitions for JobCard.jsx. 
**Dependencies**: lucide-react, ../ui/Badge, ../ui/Button

**Functions and Logic Components**: 
- `JobCard({ job, onApply, isApplied = false, showMatchScore = true, className = '', })`
  - *Purpose*: Implements logic for JobCard.
  - *Inputs*: { job, onApply, isApplied = false, showMatchScore = true, className = '', }

### File: frontend/src/components/shared/MatchAnalysisModal.jsx
**Purpose**: Contains logic and definitions for MatchAnalysisModal.jsx. 
**Dependencies**: react, react-dom, lucide-react, ../ui, ../../api/axios

**Functions and Logic Components**: 
- `MatchAnalysisModal({ isOpen, onClose })`
  - *Purpose*: Implements logic for MatchAnalysisModal.
  - *Inputs*: { isOpen, onClose }
- `fetchInternalJobs()`
  - *Purpose*: Implements logic for fetchInternalJobs.
  - *Inputs*: None
- `fetchExternalJobs()`
  - *Purpose*: Implements logic for fetchExternalJobs.
  - *Inputs*: None
- `handleAnalyze()`
  - *Purpose*: Implements logic for handleAnalyze.
  - *Inputs*: None

### File: frontend/src/components/shared/MetricCard.jsx
**Purpose**: Contains logic and definitions for MetricCard.jsx. 
**Dependencies**: lucide-react

**Functions and Logic Components**: 
- `MetricCard({ title, value, change, trend, icon: Icon, color = 'primary', className = '', })`
  - *Purpose*: Implements logic for MetricCard.
  - *Inputs*: { title, value, change, trend, icon: Icon, color = 'primary', className = '', }

### File: frontend/src/components/shared/OptimizeResumeModal.jsx
**Purpose**: Contains logic and definitions for OptimizeResumeModal.jsx. 
**Dependencies**: react, react-dom, lucide-react, ../ui, ../../api/axios, ./ResumeEditor

**Functions and Logic Components**: 
- `OptimizeResumeModal({ isOpen, onClose })`
  - *Purpose*: Implements logic for OptimizeResumeModal.
  - *Inputs*: { isOpen, onClose }
- `fetchJobs()`
  - *Purpose*: Implements logic for fetchJobs.
  - *Inputs*: None
- `handleFileChange(e)`
  - *Purpose*: Implements logic for handleFileChange.
  - *Inputs*: e
- `handleOptimize()`
  - *Purpose*: Implements logic for handleOptimize.
  - *Inputs*: None

### File: frontend/src/components/shared/ResumeEditor.jsx
**Purpose**: Contains logic and definitions for ResumeEditor.jsx. 
**Dependencies**: react, lucide-react, ../ui, ../../api/axios

**Functions and Logic Components**: 
- `ResumeEditor({ isOpen, onClose, originalText, optimizedData, onSaveSuccess })`
  - *Purpose*: Implements logic for ResumeEditor.
  - *Inputs*: { isOpen, onClose, originalText, optimizedData, onSaveSuccess }
- `handleSave()`
  - *Purpose*: Implements logic for handleSave.
  - *Inputs*: None
- `updateField(section, field, value)`
  - *Purpose*: Implements logic for updateField.
  - *Inputs*: section, field, value
- `updateArrayField(section, index, field, value)`
  - *Purpose*: Implements logic for updateArrayField.
  - *Inputs*: section, index, field, value
- `addListItem(section, template)`
  - *Purpose*: Implements logic for addListItem.
  - *Inputs*: section, template
- `removeListItem(section, index)`
  - *Purpose*: Implements logic for removeListItem.
  - *Inputs*: section, index

### File: frontend/src/components/ui/Avatar.jsx
**Purpose**: Contains logic and definitions for Avatar.jsx. 
**Dependencies**: None

**Functions and Logic Components**: 
- `Avatar({ src, alt, fallback, size = 'md', className = '' })`
  - *Purpose*: Implements logic for Avatar.
  - *Inputs*: { src, alt, fallback, size = 'md', className = '' }

### File: frontend/src/components/ui/Badge.jsx
**Purpose**: Contains logic and definitions for Badge.jsx. 
**Dependencies**: None

**Functions and Logic Components**: 
- `Badge({ variant = 'default', size = 'md', dot = false, children, className = '', ...props })`
  - *Purpose*: Implements logic for Badge.
  - *Inputs*: { variant = 'default', size = 'md', dot = false, children, className = '', ...props }

### File: frontend/src/components/ui/Breadcrumb.jsx
**Purpose**: Contains logic and definitions for Breadcrumb.jsx. 
**Dependencies**: lucide-react, react-router-dom

**Functions and Logic Components**: 
- `Breadcrumb({ items, showHome = true })`
  - *Purpose*: Implements logic for Breadcrumb.
  - *Inputs*: { items, showHome = true }
- `generateBreadcrumbs(pathname)`
  - *Purpose*: Implements logic for generateBreadcrumbs.
  - *Inputs*: pathname

### File: frontend/src/components/ui/Button.jsx
**Purpose**: Contains logic and definitions for Button.jsx. 
**Dependencies**: lucide-react

**Functions and Logic Components**: 
- `Button({ variant = 'primary', size = 'md', loading = false, disabled = false, fullWidth = false, leftIcon, rightIcon, children, className = '', ...props })`
  - *Purpose*: Implements logic for Button.
  - *Inputs*: { variant = 'primary', size = 'md', loading = false, disabled = false, fullWidth = false, leftIcon, rightIcon, children, className = '', ...props }

### File: frontend/src/components/ui/Card.jsx
**Purpose**: Contains logic and definitions for Card.jsx. 
**Dependencies**: None

**Functions and Logic Components**: 
- `Card({ children, className = '', hover = false, flat = false, padding = 'md', onClick, ...props })`
  - *Purpose*: Implements logic for Card.
  - *Inputs*: { children, className = '', hover = false, flat = false, padding = 'md', onClick, ...props }
- `CardHeader({ children, className = '' })`
  - *Purpose*: Implements logic for CardHeader.
  - *Inputs*: { children, className = '' }
- `CardTitle({ children, className = '' })`
  - *Purpose*: Implements logic for CardTitle.
  - *Inputs*: { children, className = '' }
- `CardDescription({ children, className = '' })`
  - *Purpose*: Implements logic for CardDescription.
  - *Inputs*: { children, className = '' }
- `CardContent({ children, className = '' })`
  - *Purpose*: Implements logic for CardContent.
  - *Inputs*: { children, className = '' }
- `CardFooter({ children, className = '' })`
  - *Purpose*: Implements logic for CardFooter.
  - *Inputs*: { children, className = '' }

### File: frontend/src/components/ui/Divider.jsx
**Purpose**: Contains logic and definitions for Divider.jsx. 
**Dependencies**: None

**Functions and Logic Components**: 
- `Divider({ label, align = 'center', className = '' })`
  - *Purpose*: Implements logic for Divider.
  - *Inputs*: { label, align = 'center', className = '' }

### File: frontend/src/components/ui/EmptyState.jsx
**Purpose**: Contains logic and definitions for EmptyState.jsx. 
**Dependencies**: lucide-react, react, ./Button

**Functions and Logic Components**: 
- `EmptyState({ icon: Icon = Search, title = "No items found", description = "We couldn't find what you're looking for.", action, className })`
  - *Purpose*: Implements logic for EmptyState.
  - *Inputs*: { icon: Icon = Search, title = "No items found", description = "We couldn't find what you're looking for.", action, className }

### File: frontend/src/components/ui/FileUpload.jsx
**Purpose**: Contains logic and definitions for FileUpload.jsx. 
**Dependencies**: lucide-react, react

**Functions and Logic Components**: 
- `FileUpload({ label, accept = '.pdf,.doc,.docx', hint = 'PDF, DOC up to 10MB', onFileSelect, className = '', })`
  - *Purpose*: Implements logic for FileUpload.
  - *Inputs*: { label, accept = '.pdf,.doc,.docx', hint = 'PDF, DOC up to 10MB', onFileSelect, className = '', }
- `handleDragOver(e)`
  - *Purpose*: Implements logic for handleDragOver.
  - *Inputs*: e
- `handleDragLeave(e)`
  - *Purpose*: Implements logic for handleDragLeave.
  - *Inputs*: e
- `handleDrop(e)`
  - *Purpose*: Implements logic for handleDrop.
  - *Inputs*: e
- `handleFileChange(e)`
  - *Purpose*: Implements logic for handleFileChange.
  - *Inputs*: e
- `removeFile()`
  - *Purpose*: Implements logic for removeFile.
  - *Inputs*: None

### File: frontend/src/components/ui/index.js
**Purpose**: Contains logic and definitions for index.js. 
**Dependencies**: None

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: frontend/src/components/ui/Input.jsx
**Purpose**: Contains logic and definitions for Input.jsx. 
**Dependencies**: None

**Functions and Logic Components**: 
- `Input({ label, error, success, hint, leftIcon, rightIcon, className = '', id, ...props })`
  - *Purpose*: Implements logic for Input.
  - *Inputs*: { label, error, success, hint, leftIcon, rightIcon, className = '', id, ...props }

### File: frontend/src/components/ui/LoadingSpinner.jsx
**Purpose**: Contains logic and definitions for LoadingSpinner.jsx. 
**Dependencies**: None

**Functions and Logic Components**: 
- `LoadingSpinner({ size = 'lg', color = 'text-primary-500', className = '' })`
  - *Purpose*: Implements logic for LoadingSpinner.
  - *Inputs*: { size = 'lg', color = 'text-primary-500', className = '' }

### File: frontend/src/components/ui/Modal.jsx
**Purpose**: Contains logic and definitions for Modal.jsx. 
**Dependencies**: lucide-react, react, framer-motion

**Functions and Logic Components**: 
- `Modal({ isOpen, onClose, title, size = 'md', children, className = '', })`
  - *Purpose*: Implements logic for Modal.
  - *Inputs*: { isOpen, onClose, title, size = 'md', children, className = '', }
- `handleEscape(e)`
  - *Purpose*: Implements logic for handleEscape.
  - *Inputs*: e
- `ModalFooter({ children, className = '' })`
  - *Purpose*: Implements logic for ModalFooter.
  - *Inputs*: { children, className = '' }

### File: frontend/src/components/ui/Select.jsx
**Purpose**: Contains logic and definitions for Select.jsx. 
**Dependencies**: lucide-react

**Functions and Logic Components**: 
- `Select({ label, options = [], error, placeholder = 'Select an option', className = '', id, ...props })`
  - *Purpose*: Implements logic for Select.
  - *Inputs*: { label, options = [], error, placeholder = 'Select an option', className = '', id, ...props }

### File: frontend/src/components/ui/Skeleton.jsx
**Purpose**: Contains logic and definitions for Skeleton.jsx. 
**Dependencies**: react

**Functions and Logic Components**: 
- `Skeleton({ className, height, width, circle, count = 1 })`
  - *Purpose*: Implements logic for Skeleton.
  - *Inputs*: { className, height, width, circle, count = 1 }

### File: frontend/src/components/ui/Table.jsx
**Purpose**: Contains logic and definitions for Table.jsx. 
**Dependencies**: lucide-react

**Functions and Logic Components**: 
- `Table({ children, className = '' })`
  - *Purpose*: Implements logic for Table.
  - *Inputs*: { children, className = '' }
- `TableHead({ children, className = '' })`
  - *Purpose*: Implements logic for TableHead.
  - *Inputs*: { children, className = '' }
- `TableBody({ children, className = '' })`
  - *Purpose*: Implements logic for TableBody.
  - *Inputs*: { children, className = '' }
- `TableRow({ children, className = '', hover = true, onClick })`
  - *Purpose*: Implements logic for TableRow.
  - *Inputs*: { children, className = '', hover = true, onClick }
- `TableHeader({ children, className = '', sortable = false, sortDirection, onSort, })`
  - *Purpose*: Implements logic for TableHeader.
  - *Inputs*: { children, className = '', sortable = false, sortDirection, onSort, }
- `TableCell({ children, className = '' })`
  - *Purpose*: Implements logic for TableCell.
  - *Inputs*: { children, className = '' }
- `TableEmpty({ message = 'No data found', description = '', icon: Icon, colSpan = 1 })`
  - *Purpose*: Implements logic for TableEmpty.
  - *Inputs*: { message = 'No data found', description = '', icon: Icon, colSpan = 1 }

### File: frontend/src/components/ui/Textarea.jsx
**Purpose**: Contains logic and definitions for Textarea.jsx. 
**Dependencies**: None

**Functions and Logic Components**: 
- `Textarea({ label, error, hint, rows = 4, className = '', id, ...props })`
  - *Purpose*: Implements logic for Textarea.
  - *Inputs*: { label, error, hint, rows = 4, className = '', id, ...props }

### File: frontend/src/components/ui/Toast.jsx
**Purpose**: Contains logic and definitions for Toast.jsx. 
**Dependencies**: lucide-react, react

**Functions and Logic Components**: 
- `useToast()`
  - *Purpose*: Implements logic for useToast.
  - *Inputs*: None
- `Toast({ id, type = 'info', title, message, onClose })`
  - *Purpose*: Implements logic for Toast.
  - *Inputs*: { id, type = 'info', title, message, onClose }
- `ToastProvider({ children })`
  - *Purpose*: Implements logic for ToastProvider.
  - *Inputs*: { children }

### File: frontend/src/components/ui/Toggle.jsx
**Purpose**: Contains logic and definitions for Toggle.jsx. 
**Dependencies**: None

**Functions and Logic Components**: 
- `Toggle({ label, description, checked = false, onChange, disabled = false, className = '', id, })`
  - *Purpose*: Implements logic for Toggle.
  - *Inputs*: { label, description, checked = false, onChange, disabled = false, className = '', id, }

### File: frontend/src/components/ui/Tooltip.jsx
**Purpose**: Contains logic and definitions for Tooltip.jsx. 
**Dependencies**: None

**Functions and Logic Components**: 
- `Tooltip({ content, children, position = 'top', className = '' })`
  - *Purpose*: Implements logic for Tooltip.
  - *Inputs*: { content, children, position = 'top', className = '' }

### File: frontend/src/components/user-layout/AICompanionOrb.jsx
**Purpose**: Contains logic and definitions for AICompanionOrb.jsx. 
**Dependencies**: react, framer-motion, lucide-react, react-router-dom

**Functions and Logic Components**: 
- `AICompanionOrb()`
  - *Purpose*: Implements logic for AICompanionOrb.
  - *Inputs*: None
- `handleAction(path)`
  - *Purpose*: Implements logic for handleAction.
  - *Inputs*: path

### File: frontend/src/components/user-layout/ParticleBackground.jsx
**Purpose**: Contains logic and definitions for ParticleBackground.jsx. 
**Dependencies**: react, @tsparticles/react, @tsparticles/slim, framer-motion

**Functions and Logic Components**: 
- `ParticleBackground()`
  - *Purpose*: Implements logic for ParticleBackground.
  - *Inputs*: None

### File: frontend/src/components/user-layout/RadialNav.jsx
**Purpose**: Contains logic and definitions for RadialNav.jsx. 
**Dependencies**: react, react-router-dom, framer-motion

**Functions and Logic Components**: 
- `RadialNav()`
  - *Purpose*: Implements logic for RadialNav.
  - *Inputs*: None
- `handleNav(item)`
  - *Purpose*: Implements logic for handleNav.
  - *Inputs*: item
- `getItemPosition(index, total)`
  - *Purpose*: Implements logic for getItemPosition.
  - *Inputs*: index, total

### File: frontend/src/components/user-layout/ScrollToTop.jsx
**Purpose**: Contains logic and definitions for ScrollToTop.jsx. 
**Dependencies**: react, react-router-dom

**Functions and Logic Components**: 
- `ScrollToTop()`
  - *Purpose*: Implements logic for ScrollToTop.
  - *Inputs*: None

### File: frontend/src/components/user-layout/UserLayout.jsx
**Purpose**: Contains logic and definitions for UserLayout.jsx. 
**Dependencies**: react-router-dom, framer-motion, ./ParticleBackground, ./RadialNav, ./AICompanionOrb, ./ScrollToTop

**Functions and Logic Components**: 
- `UserLayout({ children })`
  - *Purpose*: Implements logic for UserLayout.
  - *Inputs*: { children }

### File: frontend/src/contexts/AuthContext.jsx
**Purpose**: Contains logic and definitions for AuthContext.jsx. 
**Dependencies**: react, ../api/auth

**Functions and Logic Components**: 
- `useAuth()`
  - *Purpose*: Implements logic for useAuth.
  - *Inputs*: None
- `AuthProvider({ children })`
  - *Purpose*: Implements logic for AuthProvider.
  - *Inputs*: { children }
- `checkAuth()`
  - *Purpose*: Implements logic for checkAuth.
  - *Inputs*: None
- `login(email, password)`
  - *Purpose*: Implements logic for login.
  - *Inputs*: email, password
- `register(name, email, password, intent)`
  - *Purpose*: Implements logic for register.
  - *Inputs*: name, email, password, intent
- `logout()`
  - *Purpose*: Implements logic for logout.
  - *Inputs*: None

### File: frontend/src/contexts/ProviderToastContext.jsx
**Purpose**: Contains logic and definitions for ProviderToastContext.jsx. 
**Dependencies**: react, framer-motion, ../components/provider-ui/Toast

**Functions and Logic Components**: 
- `ProviderToastProvider({ children })`
  - *Purpose*: Implements logic for ProviderToastProvider.
  - *Inputs*: { children }
- `useProviderToast()`
  - *Purpose*: Implements logic for useProviderToast.
  - *Inputs*: None

### File: frontend/src/contexts/ThemeContext.jsx
**Purpose**: Contains logic and definitions for ThemeContext.jsx. 
**Dependencies**: react, ../api/themes, ./AuthContext

**Functions and Logic Components**: 
- `injectThemeVariables(theme)`
  - *Purpose*: Implements logic for injectThemeVariables.
  - *Inputs*: theme
- `clearThemeVariables()`
  - *Purpose*: Implements logic for clearThemeVariables.
  - *Inputs*: None
- `useTheme()`
  - *Purpose*: Implements logic for useTheme.
  - *Inputs*: None
- `ThemeProvider({ children })`
  - *Purpose*: Implements logic for ThemeProvider.
  - *Inputs*: { children }

### File: frontend/src/contexts/ToastContext.jsx
**Purpose**: Contains logic and definitions for ToastContext.jsx. 
**Dependencies**: react, framer-motion, lucide-react

**Functions and Logic Components**: 
- `useToast()`
  - *Purpose*: Implements logic for useToast.
  - *Inputs*: None
- `ToastItem({ id, type = 'info', message, onRemove })`
  - *Purpose*: Implements logic for ToastItem.
  - *Inputs*: { id, type = 'info', message, onRemove }
- `ToastProvider({ children })`
  - *Purpose*: Implements logic for ToastProvider.
  - *Inputs*: { children }

### File: frontend/src/design-tokens.js
**Purpose**: Contains logic and definitions for design-tokens.js. 
**Dependencies**: None

**Functions and Logic Components**: 
- `scoreRingColors(score)`
  - *Purpose*: Implements logic for scoreRingColors.
  - *Inputs*: score

### File: frontend/src/hooks/useAuthUser.js
**Purpose**: Contains logic and definitions for useAuthUser.js. 
**Dependencies**: react, ../contexts/AuthContext

**Functions and Logic Components**: 
- `useAuthUser()`
  - *Purpose*: Implements logic for useAuthUser.
  - *Inputs*: None

### File: frontend/src/hooks/useCountUp.js
**Purpose**: Contains logic and definitions for useCountUp.js. 
**Dependencies**: react

**Functions and Logic Components**: 
- `useCountUp(target, duration = 1400)`
  - *Purpose*: Implements logic for useCountUp.
  - *Inputs*: target, duration = 1400
- `animate(timestamp)`
  - *Purpose*: Implements logic for animate.
  - *Inputs*: timestamp

### File: frontend/src/hooks/useDebounce.js
**Purpose**: Contains logic and definitions for useDebounce.js. 
**Dependencies**: react

**Functions and Logic Components**: 
- `useDebounce(value, delay)`
  - *Purpose*: Implements logic for useDebounce.
  - *Inputs*: value, delay

### File: frontend/src/hooks/usePageLoader.js
**Purpose**: Contains logic and definitions for usePageLoader.js. 
**Dependencies**: react, ../components/futuristic/AILoader

**Functions and Logic Components**: 
- `usePageLoader(fetchFn, deps = [])`
  - *Purpose*: Implements logic for usePageLoader.
  - *Inputs*: fetchFn, deps = []

### File: frontend/src/hooks/useTypingEffect.js
**Purpose**: Contains logic and definitions for useTypingEffect.js. 
**Dependencies**: react

**Functions and Logic Components**: 
- `useTypingEffect(lines, speed = 35)`
  - *Purpose*: Implements logic for useTypingEffect.
  - *Inputs*: lines, speed = 35

### File: frontend/src/main.jsx
**Purpose**: Contains logic and definitions for main.jsx. 
**Dependencies**: react, react-dom/client, ./App.jsx, ./index.css, ./contexts/ToastContext.jsx

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: frontend/src/pages/admin/AdminDashboard.jsx
**Purpose**: Contains logic and definitions for AdminDashboard.jsx. 
**Dependencies**: react, lucide-react, framer-motion, react-router-dom, ../../components/admin-layout/AdminLayout, ../../components/admin-layout/AdminMetricCard, ../../components/admin-layout/AdminTerminalPanel, ../../components/admin-layout/AdminSystemChart, ../../api/axios

**Functions and Logic Components**: 
- `AdminDashboard()`
  - *Purpose*: Implements logic for AdminDashboard.
  - *Inputs*: None
- `fetchStats()`
  - *Purpose*: Implements logic for fetchStats.
  - *Inputs*: None

### File: frontend/src/pages/admin/ApplicationManagement.jsx
**Purpose**: Contains logic and definitions for ApplicationManagement.jsx. 
**Dependencies**: react, framer-motion, lucide-react, ../../components/admin-layout/AdminLayout, ../../api/axios, ../../hooks/useDebounce

**Functions and Logic Components**: 
- `ApplicationManagement()`
  - *Purpose*: Implements logic for ApplicationManagement.
  - *Inputs*: None
- `fetchApplications()`
  - *Purpose*: Implements logic for fetchApplications.
  - *Inputs*: None
- `getStatusBadge(status)`
  - *Purpose*: Implements logic for getStatusBadge.
  - *Inputs*: status

### File: frontend/src/pages/admin/index.js
**Purpose**: Contains logic and definitions for index.js. 
**Dependencies**: None

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: frontend/src/pages/admin/JobManagement.jsx
**Purpose**: Contains logic and definitions for JobManagement.jsx. 
**Dependencies**: react, framer-motion, lucide-react, ../../components/admin-layout/AdminLayout, ../../api/axios, ../../hooks/useDebounce

**Functions and Logic Components**: 
- `JobManagement()`
  - *Purpose*: Implements logic for JobManagement.
  - *Inputs*: None
- `fetchJobs()`
  - *Purpose*: Implements logic for fetchJobs.
  - *Inputs*: None
- `handleConfirmDelete(jobId)`
  - *Purpose*: Implements logic for handleConfirmDelete.
  - *Inputs*: jobId
- `handleToggleStatus(jobId, currentStatus)`
  - *Purpose*: Implements logic for handleToggleStatus.
  - *Inputs*: jobId, currentStatus
- `getStatusBadge(status)`
  - *Purpose*: Implements logic for getStatusBadge.
  - *Inputs*: status

### File: frontend/src/pages/admin/UserManagement.jsx
**Purpose**: Contains logic and definitions for UserManagement.jsx. 
**Dependencies**: react, framer-motion, lucide-react, ../../components/admin-layout/AdminLayout, ../../api/axios, ../../hooks/useDebounce

**Functions and Logic Components**: 
- `UserManagement()`
  - *Purpose*: Implements logic for UserManagement.
  - *Inputs*: None
- `fetchUsers()`
  - *Purpose*: Implements logic for fetchUsers.
  - *Inputs*: None
- `handleConfirmDelete(userId)`
  - *Purpose*: Implements logic for handleConfirmDelete.
  - *Inputs*: userId
- `handleImpersonate(userId)`
  - *Purpose*: Implements logic for handleImpersonate.
  - *Inputs*: userId
- `getRoleBadge(role)`
  - *Purpose*: Implements logic for getRoleBadge.
  - *Inputs*: role

### File: frontend/src/pages/InterviewRoom.jsx
**Purpose**: Contains logic and definitions for InterviewRoom.jsx. 
**Dependencies**: react, react-router-dom, agora-rtc-sdk-ng, lucide-react, ../services/interviewService, ../components/ui/LoadingSpinner

**Functions and Logic Components**: 
- `InterviewRoom()`
  - *Purpose*: Implements logic for InterviewRoom.
  - *Inputs*: None
- `joinChannel()`
  - *Purpose*: Implements logic for joinChannel.
  - *Inputs*: None
- `handleUserPublished(user, mediaType)`
  - *Purpose*: Implements logic for handleUserPublished.
  - *Inputs*: user, mediaType
- `handleUserUnpublished(user, mediaType)`
  - *Purpose*: Implements logic for handleUserUnpublished.
  - *Inputs*: user, mediaType
- `handleUserLeft(user)`
  - *Purpose*: Implements logic for handleUserLeft.
  - *Inputs*: user
- `toggleVideo()`
  - *Purpose*: Implements logic for toggleVideo.
  - *Inputs*: None
- `toggleAudio()`
  - *Purpose*: Implements logic for toggleAudio.
  - *Inputs*: None
- `leaveChannel()`
  - *Purpose*: Implements logic for leaveChannel.
  - *Inputs*: None
- `handleLeave()`
  - *Purpose*: Implements logic for handleLeave.
  - *Inputs*: None

### File: frontend/src/pages/Landing.jsx
**Purpose**: Contains logic and definitions for Landing.jsx. 
**Dependencies**: react, react-router-dom, framer-motion

**Functions and Logic Components**: 
- `CursorGlow()`
  - *Purpose*: Implements logic for CursorGlow.
  - *Inputs*: None
- `move(e)`
  - *Purpose*: Implements logic for move.
  - *Inputs*: e
- `HeroBg()`
  - *Purpose*: Implements logic for HeroBg.
  - *Inputs*: None
- `move(e)`
  - *Purpose*: Implements logic for move.
  - *Inputs*: e
- `Reveal({ children, delay = 0, direction = 'up', className = '' })`
  - *Purpose*: Implements logic for Reveal.
  - *Inputs*: { children, delay = 0, direction = 'up', className = '' }
- `Highlight({ children, color = 'primary' })`
  - *Purpose*: Implements logic for Highlight.
  - *Inputs*: { children, color = 'primary' }
- `TiltCard({ children, className = '' })`
  - *Purpose*: Implements logic for TiltCard.
  - *Inputs*: { children, className = '' }
- `handleMouseMove(e)`
  - *Purpose*: Implements logic for handleMouseMove.
  - *Inputs*: e
- `handleMouseLeave()`
  - *Purpose*: Implements logic for handleMouseLeave.
  - *Inputs*: None
- `LandingNav()`
  - *Purpose*: Implements logic for LandingNav.
  - *Inputs*: None
- `fn()`
  - *Purpose*: Implements logic for fn.
  - *Inputs*: None
- `Landing()`
  - *Purpose*: Implements logic for Landing.
  - *Inputs*: None

### File: frontend/src/pages/provider/AITools.jsx
**Purpose**: Contains logic and definitions for AITools.jsx. 
**Dependencies**: react, react-router-dom, ../../components/provider-layout, framer-motion

**Functions and Logic Components**: 
- `AITools()`
  - *Purpose*: Implements logic for AITools.
  - *Inputs*: None

### File: frontend/src/pages/provider/ApplicantManagement.jsx
**Purpose**: Contains logic and definitions for ApplicantManagement.jsx. 
**Dependencies**: react, framer-motion, @dnd-kit/utilities, ../../components/provider-layout, ../../components/provider-ui, ../../contexts/ProviderToastContext, ../../api/applications, ../../components/shared/ApplicantDetailsModal, ../../components/shared, ../../hooks/useDebounce

**Functions and Logic Components**: 
- `SortableApplicantCard({ app, onClick })`
  - *Purpose*: Implements logic for SortableApplicantCard.
  - *Inputs*: { app, onClick }
- `KanbanColumn({ stage, items, onCardClick, isOver })`
  - *Purpose*: Implements logic for KanbanColumn.
  - *Inputs*: { stage, items, onCardClick, isOver }
- `ApplicantManagement()`
  - *Purpose*: Implements logic for ApplicantManagement.
  - *Inputs*: None
- `fetchApplicants()`
  - *Purpose*: Implements logic for fetchApplicants.
  - *Inputs*: None
- `handleUpdateStatus(appId, newStatus)`
  - *Purpose*: Implements logic for handleUpdateStatus.
  - *Inputs*: appId, newStatus
- `handleViewProfile(app)`
  - *Purpose*: Implements logic for handleViewProfile.
  - *Inputs*: app
- `handleDragStart(event)`
  - *Purpose*: Implements logic for handleDragStart.
  - *Inputs*: event
- `handleDragOver(event)`
  - *Purpose*: Implements logic for handleDragOver.
  - *Inputs*: event
- `handleDragEnd(event)`
  - *Purpose*: Implements logic for handleDragEnd.
  - *Inputs*: event

### File: frontend/src/pages/provider/AutoShortlist.jsx
**Purpose**: Contains logic and definitions for AutoShortlist.jsx. 
**Dependencies**: react, framer-motion, ../../components/provider-layout, ../../components/provider-ui, ../../contexts/ProviderToastContext, ../../api/axios

**Functions and Logic Components**: 
- `AutoShortlist()`
  - *Purpose*: Implements logic for AutoShortlist.
  - *Inputs*: None
- `fetchJobs()`
  - *Purpose*: Implements logic for fetchJobs.
  - *Inputs*: None
- `fetchJobDetails()`
  - *Purpose*: Implements logic for fetchJobDetails.
  - *Inputs*: None
- `fetchCandidates()`
  - *Purpose*: Implements logic for fetchCandidates.
  - *Inputs*: None
- `handleRunAutoShortlist()`
  - *Purpose*: Implements logic for handleRunAutoShortlist.
  - *Inputs*: None

### File: frontend/src/pages/provider/CodingTestsPage.jsx
**Purpose**: Contains logic and definitions for CodingTestsPage.jsx. 
**Dependencies**: react, react-router-dom, framer-motion, ../../components/provider-layout, ../../components/provider-ui, ../../services/codingService, ../../components/coding/SubmissionCodeModal, ../../api/axios, ../../contexts/ProviderToastContext

**Functions and Logic Components**: 
- `CodingTestsPage()`
  - *Purpose*: Implements logic for CodingTestsPage.
  - *Inputs*: None
- `fetchTests()`
  - *Purpose*: Implements logic for fetchTests.
  - *Inputs*: None
- `fetchJobs()`
  - *Purpose*: Implements logic for fetchJobs.
  - *Inputs*: None
- `handleSubmit(e)`
  - *Purpose*: Implements logic for handleSubmit.
  - *Inputs*: e
- `resetForm()`
  - *Purpose*: Implements logic for resetForm.
  - *Inputs*: None
- `handleEdit(test)`
  - *Purpose*: Implements logic for handleEdit.
  - *Inputs*: test
- `handleViewResults(test)`
  - *Purpose*: Implements logic for handleViewResults.
  - *Inputs*: test
- `handleViewCode(submissionId)`
  - *Purpose*: Implements logic for handleViewCode.
  - *Inputs*: submissionId
- `updateQuestion(idx, field, value)`
  - *Purpose*: Implements logic for updateQuestion.
  - *Inputs*: idx, field, value
- `updateTestCase(qIdx, tcIdx, field, value)`
  - *Purpose*: Implements logic for updateTestCase.
  - *Inputs*: qIdx, tcIdx, field, value
- `renderList()`
  - *Purpose*: Implements logic for renderList.
  - *Inputs*: None
- `renderForm()`
  - *Purpose*: Implements logic for renderForm.
  - *Inputs*: None
- `renderResults()`
  - *Purpose*: Implements logic for renderResults.
  - *Inputs*: None

### File: frontend/src/pages/provider/CompanyProfile.jsx
**Purpose**: Contains logic and definitions for CompanyProfile.jsx. 
**Dependencies**: react, framer-motion, ../../components/provider-layout, ../../components/provider-ui, ../../contexts/ProviderToastContext, ../../api/axios, ../../contexts/AuthContext

**Functions and Logic Components**: 
- `CompanyProfile()`
  - *Purpose*: Implements logic for CompanyProfile.
  - *Inputs*: None
- `fetchCompanyProfile()`
  - *Purpose*: Implements logic for fetchCompanyProfile.
  - *Inputs*: None
- `handleInputChange(e)`
  - *Purpose*: Implements logic for handleInputChange.
  - *Inputs*: e
- `handleLogoChange(e)`
  - *Purpose*: Implements logic for handleLogoChange.
  - *Inputs*: e
- `handleSubmit(e)`
  - *Purpose*: Implements logic for handleSubmit.
  - *Inputs*: e

### File: frontend/src/pages/provider/index.js
**Purpose**: Contains logic and definitions for index.js. 
**Dependencies**: None

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: frontend/src/pages/provider/InterviewScheduler.jsx
**Purpose**: Contains logic and definitions for InterviewScheduler.jsx. 
**Dependencies**: react, react-router-dom, framer-motion, ../../components/provider-layout, ../../components/provider-ui, ../../contexts/ProviderToastContext, ../../api/axios

**Functions and Logic Components**: 
- `InterviewScheduler()`
  - *Purpose*: Implements logic for InterviewScheduler.
  - *Inputs*: None
- `fetchJobs()`
  - *Purpose*: Implements logic for fetchJobs.
  - *Inputs*: None
- `fetchCandidates()`
  - *Purpose*: Implements logic for fetchCandidates.
  - *Inputs*: None
- `handleAddInterviewer()`
  - *Purpose*: Implements logic for handleAddInterviewer.
  - *Inputs*: None
- `handleSchedule(e)`
  - *Purpose*: Implements logic for handleSchedule.
  - *Inputs*: e

### File: frontend/src/pages/provider/InterviewsPage.jsx
**Purpose**: Contains logic and definitions for InterviewsPage.jsx. 
**Dependencies**: react, framer-motion, ../../components/provider-layout, ../../components/provider-ui, ../../contexts/ProviderToastContext, ../../api/axios, ../../contexts/AuthContext

**Functions and Logic Components**: 
- `InterviewsPage()`
  - *Purpose*: Implements logic for InterviewsPage.
  - *Inputs*: None
- `fetchInitialData()`
  - *Purpose*: Implements logic for fetchInitialData.
  - *Inputs*: None
- `fetchInterviews(jobId)`
  - *Purpose*: Implements logic for fetchInterviews.
  - *Inputs*: jobId
- `handleJobChange(e)`
  - *Purpose*: Implements logic for handleJobChange.
  - *Inputs*: e
- `startInterview(interviewId)`
  - *Purpose*: Implements logic for startInterview.
  - *Inputs*: interviewId

### File: frontend/src/pages/provider/JobPosting.jsx
**Purpose**: Contains logic and definitions for JobPosting.jsx. 
**Dependencies**: react, ../../components/provider-layout, ../../contexts/ProviderToastContext, ../../hooks/useDebounce, ../../api/axios, ../../api/jobs, framer-motion

**Functions and Logic Components**: 
- `JobPosting()`
  - *Purpose*: Implements logic for JobPosting.
  - *Inputs*: None
- `fetchJobs()`
  - *Purpose*: Implements logic for fetchJobs.
  - *Inputs*: None
- `addRequirement()`
  - *Purpose*: Implements logic for addRequirement.
  - *Inputs*: None
- `removeRequirement(index)`
  - *Purpose*: Implements logic for removeRequirement.
  - *Inputs*: index
- `updateRequirement(index, field, value)`
  - *Purpose*: Implements logic for updateRequirement.
  - *Inputs*: index, field, value
- `addQuestion()`
  - *Purpose*: Implements logic for addQuestion.
  - *Inputs*: None
- `removeQuestion(index)`
  - *Purpose*: Implements logic for removeQuestion.
  - *Inputs*: index
- `updateQuestion(index, field, value)`
  - *Purpose*: Implements logic for updateQuestion.
  - *Inputs*: index, field, value
- `handleSaveJob(e)`
  - *Purpose*: Implements logic for handleSaveJob.
  - *Inputs*: e
- `handleEditClick(job)`
  - *Purpose*: Implements logic for handleEditClick.
  - *Inputs*: job
- `handleStatusChange(jobId, newStatus)`
  - *Purpose*: Implements logic for handleStatusChange.
  - *Inputs*: jobId, newStatus
- `confirmDelete(jobId)`
  - *Purpose*: Implements logic for confirmDelete.
  - *Inputs*: jobId

### File: frontend/src/pages/provider/ProviderDashboard.jsx
**Purpose**: Contains logic and definitions for ProviderDashboard.jsx. 
**Dependencies**: react, react-router-dom, framer-motion, ../../components/provider-layout, ../../contexts/AuthContext, ../../api/axios

**Functions and Logic Components**: 
- `ProviderDashboard()`
  - *Purpose*: Implements logic for ProviderDashboard.
  - *Inputs*: None
- `fetchDashboardData()`
  - *Purpose*: Implements logic for fetchDashboardData.
  - *Inputs*: None

### File: frontend/src/pages/provider/TestsPage.jsx
**Purpose**: Contains logic and definitions for TestsPage.jsx. 
**Dependencies**: react, react-router-dom, framer-motion, ../../components/provider-layout, ../../components/provider-ui, ../../services/testService, ../../contexts/ProviderToastContext, ../../api/axios

**Functions and Logic Components**: 
- `TestsPage()`
  - *Purpose*: Implements logic for TestsPage.
  - *Inputs*: None
- `fetchTests()`
  - *Purpose*: Implements logic for fetchTests.
  - *Inputs*: None
- `fetchJobs()`
  - *Purpose*: Implements logic for fetchJobs.
  - *Inputs*: None
- `fetchCandidates()`
  - *Purpose*: Implements logic for fetchCandidates.
  - *Inputs*: None
- `handleCreateTest(e)`
  - *Purpose*: Implements logic for handleCreateTest.
  - *Inputs*: e
- `resetForm()`
  - *Purpose*: Implements logic for resetForm.
  - *Inputs*: None
- `handleEditTest(test)`
  - *Purpose*: Implements logic for handleEditTest.
  - *Inputs*: test
- `handleViewResults(test)`
  - *Purpose*: Implements logic for handleViewResults.
  - *Inputs*: test
- `updateQuestion(index, field, value)`
  - *Purpose*: Implements logic for updateQuestion.
  - *Inputs*: index, field, value
- `renderList()`
  - *Purpose*: Implements logic for renderList.
  - *Inputs*: None
- `renderForm()`
  - *Purpose*: Implements logic for renderForm.
  - *Inputs*: None
- `renderResults()`
  - *Purpose*: Implements logic for renderResults.
  - *Inputs*: None

### File: frontend/src/pages/ThemesSettings.jsx
**Purpose**: Contains logic and definitions for ThemesSettings.jsx. 
**Dependencies**: react, ../contexts/ThemeContext, ../contexts/AuthContext, ../components/user-layout/UserLayout, ../components/provider-layout/ProviderLayout, ../components/admin-layout/AdminLayout

**Functions and Logic Components**: 
- `hexToRgb(hex)`
  - *Purpose*: Implements logic for hexToRgb.
  - *Inputs*: hex
- `getLuminance(r, g, b)`
  - *Purpose*: Implements logic for getLuminance.
  - *Inputs*: r, g, b
- `contrastRatio(hex1, hex2)`
  - *Purpose*: Implements logic for contrastRatio.
  - *Inputs*: hex1, hex2
- `ThemeMiniPreview({ theme })`
  - *Purpose*: Implements logic for ThemeMiniPreview.
  - *Inputs*: { theme }
- `PresetThemeCard({ theme, isActive, onPreview, onApply, applying })`
  - *Purpose*: Implements logic for PresetThemeCard.
  - *Inputs*: { theme, isActive, onPreview, onApply, applying }
- `ThemesSettings()`
  - *Purpose*: Implements logic for ThemesSettings.
  - *Inputs*: None
- `handleApply(themeId)`
  - *Purpose*: Implements logic for handleApply.
  - *Inputs*: themeId
- `handleSaveCustom(andApply = false)`
  - *Purpose*: Implements logic for handleSaveCustom.
  - *Inputs*: andApply = false

### File: frontend/src/pages/user/AIActions.jsx
**Purpose**: Contains logic and definitions for AIActions.jsx. 
**Dependencies**: react, react-router-dom, framer-motion, ../../components/user-layout/UserLayout, ../../components/futuristic/GlassCard, ../../components/futuristic/TiltCard, ../../components/shared/CoverLetterModal, ../../components/shared/OptimizeResumeModal, ../../components/shared/MatchAnalysisModal, ../../components/shared/CareerRoadmapModal, ../../components/shared/AutoApplyModal

**Functions and Logic Components**: 
- `AIActions()`
  - *Purpose*: Implements logic for AIActions.
  - *Inputs*: None

### File: frontend/src/pages/user/ApplicationTracker.jsx
**Purpose**: Contains logic and definitions for ApplicationTracker.jsx. 
**Dependencies**: react, framer-motion, lucide-react, ../../components/user-layout/UserLayout, ../../components/futuristic/GlassCard, ../../components/futuristic/SkeletonCard, ../../components/futuristic/AnimatedCounter, ../../api/applications

**Functions and Logic Components**: 
- `getStatus(s)`
  - *Purpose*: Implements logic for getStatus.
  - *Inputs*: s
- `ApplicationTracker()`
  - *Purpose*: Implements logic for ApplicationTracker.
  - *Inputs*: None

### File: frontend/src/pages/user/CandidateCodingDashboard.jsx
**Purpose**: Contains logic and definitions for CandidateCodingDashboard.jsx. 
**Dependencies**: react, react-router-dom, framer-motion, lucide-react, ../../components/user-layout/UserLayout, ../../components/futuristic/GlassCard, ../../components/futuristic/TiltCard, ../../components/futuristic/AILoader, ../../services/codingService

**Functions and Logic Components**: 
- `CodingTestCard({ test, navigate, index })`
  - *Purpose*: Implements logic for CodingTestCard.
  - *Inputs*: { test, navigate, index }
- `CandidateCodingDashboard()`
  - *Purpose*: Implements logic for CandidateCodingDashboard.
  - *Inputs*: None
- `fetchMyTests()`
  - *Purpose*: Implements logic for fetchMyTests.
  - *Inputs*: None

### File: frontend/src/pages/user/CodingResultPage.jsx
**Purpose**: Contains logic and definitions for CodingResultPage.jsx. 
**Dependencies**: react, react-router-dom, framer-motion, ../../components/user-layout/UserLayout, ../../components/futuristic/GlassCard, ../../components/futuristic/AILoader, ../../components/futuristic/MatchScoreRing, ../../components/futuristic/AnimatedCounter, ../../services/codingService

**Functions and Logic Components**: 
- `CodingResultPage()`
  - *Purpose*: Implements logic for CodingResultPage.
  - *Inputs*: None
- `fetchResults()`
  - *Purpose*: Implements logic for fetchResults.
  - *Inputs*: None

### File: frontend/src/pages/user/CodingTestAttempt.jsx
**Purpose**: Contains logic and definitions for CodingTestAttempt.jsx. 
**Dependencies**: react, react-router-dom, ../../components/coding/MonacoCodeEditor, ../../services/codingService

**Functions and Logic Components**: 
- `CodingTestAttempt()`
  - *Purpose*: Implements logic for CodingTestAttempt.
  - *Inputs*: None
- `fetchTestData()`
  - *Purpose*: Implements logic for fetchTestData.
  - *Inputs*: None
- `formatTime(seconds)`
  - *Purpose*: Implements logic for formatTime.
  - *Inputs*: seconds
- `handleCodeChange(newCode)`
  - *Purpose*: Implements logic for handleCodeChange.
  - *Inputs*: newCode
- `handleLanguageChange(langId)`
  - *Purpose*: Implements logic for handleLanguageChange.
  - *Inputs*: langId
- `handleRunCode()`
  - *Purpose*: Implements logic for handleRunCode.
  - *Inputs*: None
- `handleRunCustom()`
  - *Purpose*: Implements logic for handleRunCustom.
  - *Inputs*: None
- `handleSubmitSolution()`
  - *Purpose*: Implements logic for handleSubmitSolution.
  - *Inputs*: None
- `handleAutoSubmit()`
  - *Purpose*: Implements logic for handleAutoSubmit.
  - *Inputs*: None
- `toggleFullScreen()`
  - *Purpose*: Implements logic for toggleFullScreen.
  - *Inputs*: None

### File: frontend/src/pages/user/index.js
**Purpose**: Contains logic and definitions for index.js. 
**Dependencies**: None

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: frontend/src/pages/user/InterviewsPage.jsx
**Purpose**: Contains logic and definitions for InterviewsPage.jsx. 
**Dependencies**: react, framer-motion, lucide-react, ../../components/user-layout/UserLayout, ../../components/futuristic/GlassCard, ../../components/futuristic/AILoader, ../../services/interviewService

**Functions and Logic Components**: 
- `InterviewsPage()`
  - *Purpose*: Implements logic for InterviewsPage.
  - *Inputs*: None
- `fetchInterviews()`
  - *Purpose*: Implements logic for fetchInterviews.
  - *Inputs*: None
- `handleJoinInterview(channelName, scheduledAt)`
  - *Purpose*: Implements logic for handleJoinInterview.
  - *Inputs*: channelName, scheduledAt
- `formatDate(date)`
  - *Purpose*: Implements logic for formatDate.
  - *Inputs*: date
- `formatTime(time)`
  - *Purpose*: Implements logic for formatTime.
  - *Inputs*: time
- `canJoin(scheduledAt, status)`
  - *Purpose*: Implements logic for canJoin.
  - *Inputs*: scheduledAt, status

### File: frontend/src/pages/user/JobDiscovery.jsx
**Purpose**: Contains logic and definitions for JobDiscovery.jsx. 
**Dependencies**: react, framer-motion, lucide-react, ../../components/user-layout/UserLayout, ../../components/futuristic/GlassCard, ../../components/futuristic/TiltCard, ../../components/futuristic/SkeletonCard, ../../components/shared/JobApplyModal, ../../api/jobs, ../../api/applications

**Functions and Logic Components**: 
- `JobCard({ job, isApplied, onApply, index })`
  - *Purpose*: Implements logic for JobCard.
  - *Inputs*: { job, isApplied, onApply, index }
- `JobDiscovery()`
  - *Purpose*: Implements logic for JobDiscovery.
  - *Inputs*: None
- `clearFilters()`
  - *Purpose*: Implements logic for clearFilters.
  - *Inputs*: None

### File: frontend/src/pages/user/JobsInIndia.jsx
**Purpose**: Contains logic and definitions for JobsInIndia.jsx. 
**Dependencies**: react, framer-motion, lucide-react, ../../components/user-layout/UserLayout, ../../components/futuristic/GlassCard, ../../components/futuristic/SkeletonCard, ../../components/futuristic/AILoader, ../../api/jobs

**Functions and Logic Components**: 
- `ExternalJobCard({ job, index })`
  - *Purpose*: Implements logic for ExternalJobCard.
  - *Inputs*: { job, index }
- `JobsInIndia()`
  - *Purpose*: Implements logic for JobsInIndia.
  - *Inputs*: None

### File: frontend/src/pages/user/MyTestsPage.jsx
**Purpose**: Contains logic and definitions for MyTestsPage.jsx. 
**Dependencies**: react, framer-motion, react-router-dom, ../../components/user-layout/UserLayout, ../../components/futuristic/GlassCard, ../../components/futuristic/AILoader, ../../components/futuristic/MatchScoreRing, ../../services/testService

**Functions and Logic Components**: 
- `TestCard({ test, section, navigate, index })`
  - *Purpose*: Implements logic for TestCard.
  - *Inputs*: { test, section, navigate, index }
- `formatDateTime(date, time)`
  - *Purpose*: Implements logic for formatDateTime.
  - *Inputs*: date, time
- `getTimeUntil(date, time)`
  - *Purpose*: Implements logic for getTimeUntil.
  - *Inputs*: date, time
- `MyTestsPage()`
  - *Purpose*: Implements logic for MyTestsPage.
  - *Inputs*: None
- `fetchMyTests()`
  - *Purpose*: Implements logic for fetchMyTests.
  - *Inputs*: None

### File: frontend/src/pages/user/Profile.jsx
**Purpose**: Contains logic and definitions for Profile.jsx. 
**Dependencies**: react, framer-motion, lucide-react, ../../components/user-layout/UserLayout, ../../components/futuristic/GlassCard, ../../components/futuristic/AILoader, ../../api/users, ../../components/profile/PersonalInfoForm, ../../components/profile/SkillsForm, ../../components/profile/ExperienceForm, ../../components/profile/EducationForm, ../../components/profile/AchievementsForm, ../../components/profile/ProjectsForm, ../../components/profile/ResumeUpload, ../../components/profile/ResumeAutoFill

**Functions and Logic Components**: 
- `Profile()`
  - *Purpose*: Implements logic for Profile.
  - *Inputs*: None
- `fetchProfile()`
  - *Purpose*: Implements logic for fetchProfile.
  - *Inputs*: None
- `handleAddSkill(skillName)`
  - *Purpose*: Implements logic for handleAddSkill.
  - *Inputs*: skillName
- `handleRemoveSkill(skillName)`
  - *Purpose*: Implements logic for handleRemoveSkill.
  - *Inputs*: skillName
- `handleImageUpload(file)`
  - *Purpose*: Implements logic for handleImageUpload.
  - *Inputs*: file
- `updateArrayItem(field, index, key, value)`
  - *Purpose*: Implements logic for updateArrayItem.
  - *Inputs*: field, index, key, value
- `addArrayItem(field, initialItem)`
  - *Purpose*: Implements logic for addArrayItem.
  - *Inputs*: field, initialItem
- `removeArrayItem(field, index)`
  - *Purpose*: Implements logic for removeArrayItem.
  - *Inputs*: field, index
- `handleSave()`
  - *Purpose*: Implements logic for handleSave.
  - *Inputs*: None
- `handleViewResume()`
  - *Purpose*: Implements logic for handleViewResume.
  - *Inputs*: None
- `handleReuploadResume(file)`
  - *Purpose*: Implements logic for handleReuploadResume.
  - *Inputs*: file
- `handleDeleteResume()`
  - *Purpose*: Implements logic for handleDeleteResume.
  - *Inputs*: None

### File: frontend/src/pages/user/RecommendedJobs.jsx
**Purpose**: Contains logic and definitions for RecommendedJobs.jsx. 
**Dependencies**: react, framer-motion, lucide-react, ../../components/user-layout/UserLayout, ../../components/futuristic/GlassCard, ../../components/futuristic/TiltCard, ../../components/futuristic/MatchScoreRing, ../../components/futuristic/SkeletonCard, ../../api/axios

**Functions and Logic Components**: 
- `RecommendedJobs()`
  - *Purpose*: Implements logic for RecommendedJobs.
  - *Inputs*: None

### File: frontend/src/pages/user/TestAttemptPage.jsx
**Purpose**: Contains logic and definitions for TestAttemptPage.jsx. 
**Dependencies**: react, react-router-dom, framer-motion, lucide-react, ../../services/testService, ../../components/futuristic/AILoader, ../../components/futuristic/GlassCard, ../../components/futuristic/MatchScoreRing

**Functions and Logic Components**: 
- `TestAttemptPage()`
  - *Purpose*: Implements logic for TestAttemptPage.
  - *Inputs*: None
- `loadTest()`
  - *Purpose*: Implements logic for loadTest.
  - *Inputs*: None
- `handleVisibility()`
  - *Purpose*: Implements logic for handleVisibility.
  - *Inputs*: None
- `handleBeforeUnload(e)`
  - *Purpose*: Implements logic for handleBeforeUnload.
  - *Inputs*: e
- `saveProgress()`
  - *Purpose*: Implements logic for saveProgress.
  - *Inputs*: None
- `doSubmit(aId, currentAnswers, autoSubmitted)`
  - *Purpose*: Implements logic for doSubmit.
  - *Inputs*: aId, currentAnswers, autoSubmitted
- `setAnswer(questionId, value)`
  - *Purpose*: Implements logic for setAnswer.
  - *Inputs*: questionId, value
- `formatTime(s)`
  - *Purpose*: Implements logic for formatTime.
  - *Inputs*: s

### File: frontend/src/pages/user/TestResultPage.jsx
**Purpose**: Contains logic and definitions for TestResultPage.jsx. 
**Dependencies**: react, react-router-dom, framer-motion, lucide-react, ../../components/user-layout/UserLayout, ../../components/futuristic/GlassCard, ../../components/futuristic/AILoader, ../../components/futuristic/MatchScoreRing, ../../services/testService

**Functions and Logic Components**: 
- `TestResultPage()`
  - *Purpose*: Implements logic for TestResultPage.
  - *Inputs*: None

### File: frontend/src/pages/user/UserDashboard.jsx
**Purpose**: Contains logic and definitions for UserDashboard.jsx. 
**Dependencies**: react, react-router-dom, framer-motion, lucide-react, ../../components/user-layout/UserLayout, ../../components/futuristic/GlassCard, ../../components/futuristic/TiltCard, ../../components/futuristic/AnimatedCounter, ../../components/futuristic/MatchScoreRing, ../../components/futuristic/AILoader, ../../components/futuristic/SkeletonCard, ../../components/shared/JobApplyModal, ../../hooks/useAuthUser, ../../api/users, ../../api/jobs

**Functions and Logic Components**: 
- `JobItem({ job, onApply })`
  - *Purpose*: Implements logic for JobItem.
  - *Inputs*: { job, onApply }
- `UserDashboard()`
  - *Purpose*: Implements logic for UserDashboard.
  - *Inputs*: None

### File: frontend/src/routes/AppRoutes.jsx
**Purpose**: Contains logic and definitions for AppRoutes.jsx. 
**Dependencies**: react, react-router-dom, ../pages/Landing, ../pages/ThemesSettings, ../pages/user/TestAttemptPage, ../components/auth/AuthPage, ../components/auth/OAuthSuccess, ../components/auth/ProtectedRoute, ../pages/InterviewRoom, ../components/provider-ui, ../contexts/ProviderToastContext

**Functions and Logic Components**: 
- `AdminLoadingScreen()`
  - *Purpose*: Implements logic for AdminLoadingScreen.
  - *Inputs*: None
- `AppRoutes()`
  - *Purpose*: Implements logic for AppRoutes.
  - *Inputs*: None

### File: frontend/src/services/codingService.js
**Purpose**: Contains logic and definitions for codingService.js. 
**Dependencies**: ../api/axios

**Functions and Logic Components**: 
- `createCodingTest(testData)`
  - *Purpose*: Implements logic for createCodingTest.
  - *Inputs*: testData
- `getRecruiterCodingTests()`
  - *Purpose*: Implements logic for getRecruiterCodingTests.
  - *Inputs*: None
- `getCodingTestById(testId)`
  - *Purpose*: Implements logic for getCodingTestById.
  - *Inputs*: testId
- `updateCodingTest(testId, testData)`
  - *Purpose*: Implements logic for updateCodingTest.
  - *Inputs*: testId, testData
- `deleteCodingTest(testId)`
  - *Purpose*: Implements logic for deleteCodingTest.
  - *Inputs*: testId
- `publishCodingTest(testId)`
  - *Purpose*: Implements logic for publishCodingTest.
  - *Inputs*: testId
- `getCodingTestResults(testId)`
  - *Purpose*: Implements logic for getCodingTestResults.
  - *Inputs*: testId
- `publishCodingTestResults(testId)`
  - *Purpose*: Implements logic for publishCodingTestResults.
  - *Inputs*: testId
- `getMyCodingTests()`
  - *Purpose*: Implements logic for getMyCodingTests.
  - *Inputs*: None
- `getCodingTestForAttempt(testId)`
  - *Purpose*: Implements logic for getCodingTestForAttempt.
  - *Inputs*: testId
- `submitCode(submissionData)`
  - *Purpose*: Implements logic for submitCode.
  - *Inputs*: submissionData
- `runCode(runData)`
  - *Purpose*: Implements logic for runCode.
  - *Inputs*: runData
- `getCodingSubmissions(testId)`
  - *Purpose*: Implements logic for getCodingSubmissions.
  - *Inputs*: testId
- `getSubmissionById(id)`
  - *Purpose*: Implements logic for getSubmissionById.
  - *Inputs*: id
- `getSupportedLanguages()`
  - *Purpose*: Implements logic for getSupportedLanguages.
  - *Inputs*: None

### File: frontend/src/services/interviewService.js
**Purpose**: Contains logic and definitions for interviewService.js. 
**Dependencies**: axios

**Functions and Logic Components**: 
- `getAuthHeader()`
  - *Purpose*: Implements logic for getAuthHeader.
  - *Inputs*: None
- `selectCandidateForInterview(jobId, applicationId, candidateId)`
  - *Purpose*: Implements logic for selectCandidateForInterview.
  - *Inputs*: jobId, applicationId, candidateId
- `scheduleInterview(interviewId, scheduleData)`
  - *Purpose*: Implements logic for scheduleInterview.
  - *Inputs*: interviewId, scheduleData
- `sendInterviewEmail(interviewId)`
  - *Purpose*: Implements logic for sendInterviewEmail.
  - *Inputs*: interviewId
- `getRecruiterInterviews()`
  - *Purpose*: Implements logic for getRecruiterInterviews.
  - *Inputs*: None
- `getCandidateInterviews()`
  - *Purpose*: Implements logic for getCandidateInterviews.
  - *Inputs*: None
- `joinInterview(channelName)`
  - *Purpose*: Implements logic for joinInterview.
  - *Inputs*: channelName
- `cancelInterview(interviewId)`
  - *Purpose*: Implements logic for cancelInterview.
  - *Inputs*: interviewId

### File: frontend/src/services/testService.js
**Purpose**: Contains logic and definitions for testService.js. 
**Dependencies**: ../api/axios

**Functions and Logic Components**: 
- `createTest(data)`
  - *Purpose*: Implements logic for createTest.
  - *Inputs*: data
- `getRecruiterTests()`
  - *Purpose*: Implements logic for getRecruiterTests.
  - *Inputs*: None
- `getTestById(id)`
  - *Purpose*: Implements logic for getTestById.
  - *Inputs*: id
- `updateTest(id, data)`
  - *Purpose*: Implements logic for updateTest.
  - *Inputs*: id, data
- `deleteTest(id)`
  - *Purpose*: Implements logic for deleteTest.
  - *Inputs*: id
- `publishTest(id)`
  - *Purpose*: Implements logic for publishTest.
  - *Inputs*: id
- `getTestResults(id)`
  - *Purpose*: Implements logic for getTestResults.
  - *Inputs*: id
- `publishTestResults(id)`
  - *Purpose*: Implements logic for publishTestResults.
  - *Inputs*: id
- `getMyTests()`
  - *Purpose*: Implements logic for getMyTests.
  - *Inputs*: None
- `getTestForAttempt(id)`
  - *Purpose*: Implements logic for getTestForAttempt.
  - *Inputs*: id
- `submitTest(id, data)`
  - *Purpose*: Implements logic for submitTest.
  - *Inputs*: id, data
- `saveTestProgress(id, data)`
  - *Purpose*: Implements logic for saveTestProgress.
  - *Inputs*: id, data
- `getMyTestResult(id)`
  - *Purpose*: Implements logic for getMyTestResult.
  - *Inputs*: id

### File: frontend/src/utils/profileMapper.js
**Purpose**: Contains logic and definitions for profileMapper.js. 
**Dependencies**: None

**Functions and Logic Components**: 
- `mapProfileToFrontend(data)`
  - *Purpose*: Implements logic for mapProfileToFrontend.
  - *Inputs*: data
- `mapProfileToBackend(state)`
  - *Purpose*: Implements logic for mapProfileToBackend.
  - *Inputs*: state

### File: frontend/tailwind.config.js
**Purpose**: Contains logic and definitions for tailwind.config.js. 
**Dependencies**: None

*No explicit functions detected. May be a configuration, style, or type definition file.*

### File: frontend/vite.config.js
**Purpose**: Contains logic and definitions for vite.config.js. 
**Dependencies**: vite, @vitejs/plugin-react

*No explicit functions detected. May be a configuration, style, or type definition file.*


## 6 — API ENDPOINT MAPPING
**Routes Context**: Handled in backend/routes/. The main routers define the following core capabilities:
- `/api/auth`: User login, registration, token refreshing.
- `/api/jobs`: Fetching, creating, updating job posts; applying integrations with Jooble/Adzuna.
- `/api/interviews`: Interview scheduling, updating status, fetching meeting links.
- `/api/users`: Profile management, retrieving candidacies.
*Note: Due to file parsing limitations, specific HTTP methods and parameters are contained within the controller functions mapped above.*

## 7 — FRONTEND ARCHITECTURE
The frontend is a React SPA built with Vite.
- **Routing**: Handled by `react-router-dom` generally in `App.jsx` or `routes/`.
- **State Management**: React Context APIs (ThemeContext, AuthContext) and standard React Hooks (useState, useEffect, useReducer).
- **Styling**: TailwindCSS via `className` attributes and vanilla `index.css`.
- **Pages**: Separated by roles: Admin (`pages/admin`), Provider (`pages/provider`), User/Seeker (`pages/user`).

## 8 — UI INTERACTION FLOW
Example Flow: **User Login**
1. User enters credentials in `LoginPage.jsx` / `AuthPage.jsx`.
2. Form submits data to `authService.js` / `api/auth`.
3. Backend `authController.js` queries PostgreSQL to hash/compare password.
4. Backend issues a JWT to the frontend.
5. Frontend stores token in localStorage and updates Context state.
6. User is redirected to their respective Dashboard based on Role (Provider or Seeker).

## 9 — DATA FLOW TRACING
1. **Frontend Request**: UI triggers asynchronous fetch via Axios in `src/services`.
2. **Express Routing**: `server.js` parses JSON and directs to the appropriate route handler.
3. **Middleware**: Validates token and checks role permissions (e.g., admin only).
4. **Controller logic**: Executes business rules and connects to DB (Postgres query).
5. **Database Response**: PostresSQL returns relational records.
6. **Frontend Update**: Response parsed, local state updated, triggers re-render with new data.

## 10 — DATABASE ANALYSIS
**Technology**: PostgreSQL (Neon Cloud) and Redis for caching.
**Key Conceptual Entities**:
- `Users`: id, email, password_hash, role, profile_data.
- `Jobs`: id, title, description, company, salary_range, status.
- `Applications`: id, job_id, user_id, status, ai_score, notes.
- `Interviews`: id, application_id, date, status, meeting_link.

## 11 — CONFIGURATION FILE ANALYSIS
- `package.json`: Defines entry points, scripts (concurrently to run frontend+backend), and node dependencies.
- `.env`: SECRETS storage, containing Database URLs, JWT secrets, and AI keys (Groq, Gemini, Adzuna).
- `vite.config.js`: Vite bundler config for fast HMR frontend dev server.
- `tailwind.config.js`: Tailwind utility class customizations, UI theme colors.
- `eslint.config.js`: Linter rules for code cleanliness.

## 12 — DEPENDENCY ANALYSIS
**Major Packages**:
- `express`: Core backend server framework.
- `pg`: PostgreSQL client wrapper.
- `jsonwebtoken`: JWT creation and verification.
- `@google/generative-ai` / `groq-sdk`: LLM integration for AI features.
- `react-router-dom`: Frontend client-side navigation.
- `framer-motion`: UI layout animations and smooth transitions.

## 13 — SECURITY ANALYSIS
- **Authentication**: Stateful JWT stored locally. 
- **Database Security**: Parameterized queries or secure ORM functions using `pg` library to prevent SQL Injection.
- **Data Protection**: Passwords are mathematically hashed with `bcrypt`.
- **Vulnerabilities**: If JWT is stored in LocalStorage, XSS could potentially steal it. An HttpOnly cookie implementation is recommended for better security.

## 14 — PERFORMANCE ANALYSIS
- **Bottlenecks**: Intensive PDF parsing on Node.js thread could block the event loop for concurrent users. Offloading to worker threads is recommended.
- **Redundancies**: Uncached slow API responses from external AI dependencies (Gemini/Groq) could increase loading times (AILoader mitigates UX wait).
- **Optimization**: Redis is present, likely used to cache frequently requested records to avoid hitting Postgres DB excessively.

## 15 — ERROR HANDLING
- Backend responds with standardized error JSON `{ error: "Description..." }`.
- Frontend wraps API calls in `try/catch` and utilizes notification components/toasts to display errors gracefully to end-users instead of crashing.

## 16 — PROJECT WORKFLOW
1. Environment is bootstrapped with `npm start`.
2. Both dev servers initialize.
3. User visits UI, initiates action (Apply -> Send Resume).
4. File is processed backend (PDF parsed), text sent to Groq/Gemini to compute ATS score.
5. Score stored in Neon DB.
6. Recruiter dashboard instantly sees AI-scored applicant list.

## 17 — CODE QUALITY ANALYSIS
- **Modularity**: Separation of concerns is respected (Models, Controllers, Routes on Backend. Components, Pages, Context on Frontend).
- **Naming Conventions**: PascalCase for React components, camelCase for functions.
- **Reusability**: Shared UI components (`Button.jsx`, `FileUpload.jsx`) are successfully grouped to avoid duplication.
- **Maintainability**: Solid file structure, but requires strict adherence to React custom hooks to prevent overly bloated functional components.

## 18 — MISSING CONNECTIONS
- Large chunks of `tmp` files and screenshot scripts indicate some test structures are mixed with production source.
- Dead code / AI features without backend endpoints (as observed in previous cleanup task) imply ongoing refactoring where some UI placeholders await API plumbing.

## 19 — COMPLETE SYSTEM BLUEPRINT
[ FRONTEND SPA ] <--(JSON/REST via Axios)--> [ NODE.JS/EXPRESS SERVER ] 
       |                                          |
   (React UI)                                     +---[ NEON POSTGRES DB ] (Data Persistence)
   (Tailwind)                                     +---[ REDIS CACHE ] (Fast read/KV)
   (WebRTC Client)                                +---[ AI APIs (Gemini/Groq) ] (Intelligence layer)
                                                  +---[ EMAIL SMTP ] (Notifications)

## 20 — FINAL SIMPLIFIED EXPLANATION
Imagine you have an intelligent matchmaker that sits between people looking for jobs and companies looking to hire.
This application provides the storefronts (dashboards) for both parties to meet.
When a candidate applies, instead of a human reading their resume blindly, an AI reads it, summarizes it, predicts how good a fit they are, and shows the recruiter the top list automatically.
If the recruiter likes them, they click one button to arrange a video interview or send a coding challenge, all built directly into the same app.
It replaces 5 separate tools with one AI-powered brain.
