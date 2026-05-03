import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes, Outlet } from 'react-router-dom';

// Pages
import Landing from '../pages/Landing';
import ThemesSettings from '../pages/ThemesSettings';
import {
    AIActions,
    ApplicationTracker,
    JobDiscovery,
    JobsInIndia,
    Profile,
    UserDashboard,
    InterviewsPage as UserInterviewsPage,
    MyTestsPage,
    TestResultPage,
    CandidateCodingDashboard,
    CodingTestAttempt,
    CodingResultPage,
    RecommendedJobs,
} from '../pages/user';
// Lazy load admin pages (Phase 7.5)
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));
const JobManagement = lazy(() => import('../pages/admin/JobManagement'));
const ApplicationManagement = lazy(() => import('../pages/admin/ApplicationManagement'));
import TestAttemptPage from '../pages/user/TestAttemptPage';

// Auth components
import AuthPage from '../components/auth/AuthPage';
import OAuthSuccess from '../components/auth/OAuthSuccess';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Shared components
import InterviewRoom from '../pages/InterviewRoom';
import { TopProgressBar } from '../components/provider-ui';

// Contexts
import { ProviderToastProvider } from '../contexts/ProviderToastContext';

// Lazy load provider pages pattern for Route-Level Code Splitting (Phase 5.4)
const AITools = lazy(() => import('../pages/provider/AITools'));
const AutoShortlist = lazy(() => import('../pages/provider/AutoShortlist'));
const InterviewScheduler = lazy(() => import('../pages/provider/InterviewScheduler'));
const ApplicantManagement = lazy(() => import('../pages/provider/ApplicantManagement'));
const CompanyProfile = lazy(() => import('../pages/provider/CompanyProfile'));
const JobPosting = lazy(() => import('../pages/provider/JobPosting'));
const ProviderDashboard = lazy(() => import('../pages/provider/ProviderDashboard'));
const ProviderInterviewsPage = lazy(() => import('../pages/provider/InterviewsPage'));
const ProviderTestsPage = lazy(() => import('../pages/provider/TestsPage'));
const ProviderCodingTestsPage = lazy(() => import('../pages/provider/CodingTestsPage'));

const AdminLoadingScreen = () => (
    <div className="fixed inset-0 bg-[#020408] flex items-center justify-center z-[9999]">
        <div className="font-mono text-[#00ffe7] text-xl flex items-center gap-2">
            <span className="opacity-70">SYSTEM</span>
            <span className="font-bold">INITIALIZING</span>
            <span className="w-3 h-6 bg-[#00ffe7] animate-pulse"></span>
        </div>
    </div>
);

/**
 * Application routes configuration
 * Handles routing for Landing, Auth, User (protected), and Provider (protected) dashboards
 */
const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />

            {/* User (Job Seeker) Routes - Protected */}
            <Route element={<ProtectedRoute allowedRoles={['job_seeker']} />}>
                <Route path="/user">
                    <Route index element={<Navigate to="/user/dashboard" replace />} />
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="jobs" element={<JobDiscovery />} />
                    <Route path="jobs-india" element={<JobsInIndia />} />
                    <Route path="ai-actions" element={<AIActions />} />
                    <Route path="ai-actions/recommended-jobs" element={<RecommendedJobs />} />
                    <Route path="applications" element={<ApplicationTracker />} />
                    <Route path="interviews" element={<UserInterviewsPage />} />
                    <Route path="tests" element={<MyTestsPage />} />
                    <Route path="tests/:id/attempt" element={<TestAttemptPage />} />
                    <Route path="tests/:id/results" element={<TestResultPage />} />
                    <Route path="coding-tests" element={<CandidateCodingDashboard />} />
                    <Route path="coding-tests/:id/attempt" element={<CodingTestAttempt />} />
                    <Route path="coding-tests/:id/results" element={<CodingResultPage />} />
                    <Route path="settings/themes" element={<ThemesSettings />} />
                </Route>
            </Route>


            {/* Admin Routes - Protected */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin">
                    <Route element={
                        <Suspense fallback={<AdminLoadingScreen />}>
                            <Outlet />
                        </Suspense>
                    }>
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="jobs" element={<JobManagement />} />
                        <Route path="applications" element={<ApplicationManagement />} />
                        <Route path="settings/themes" element={<ThemesSettings />} />
                    </Route>
                </Route>
            </Route>

            {/* I will fix the manual routing below without the generic Outlet wrapper to keep logic untouched */}
            <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
                <Route path="/provider" element={
                    <ProviderToastProvider>
                        <Suspense fallback={<TopProgressBar loading={true} />}>
                            <Outlet />
                        </Suspense>
                    </ProviderToastProvider>
                }>
                    <Route index element={<Navigate to="/provider/dashboard" replace />} />
                    <Route path="dashboard" element={<ProviderDashboard />} />
                    <Route path="post-job" element={<JobPosting />} />
                    <Route path="jobs" element={<JobPosting />} />
                    <Route path="applicants" element={<ApplicantManagement />} />
                    <Route path="ai-tools" element={<AITools />} />
                    <Route path="ai-tools/auto-shortlist" element={<AutoShortlist />} />
                    <Route path="ai-tools/interview-scheduler" element={<InterviewScheduler />} />
                    <Route path="company" element={<CompanyProfile />} />
                    <Route path="interviews" element={<ProviderInterviewsPage />} />
                    <Route path="tests" element={<ProviderTestsPage />} />
                    <Route path="coding-tests" element={<ProviderCodingTestsPage />} />
                    <Route path="settings/themes" element={<ThemesSettings />} />
                </Route>
            </Route>

            {/* Shared Interview Room Route (accessible by both roles) */}
            <Route element={<ProtectedRoute allowedRoles={['recruiter', 'job_seeker', 'admin']} />}>
                <Route path="/interview/:channelName" element={<InterviewRoom />} />
            </Route>

            {/* Catch-all redirect to login for unauthenticated users */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;
