// ============================================================
// HIREREADY 2.0 - MAIN APPLICATION ROUTER
// Complete route configuration with auth guards
// ============================================================

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';
import AppShell from './components/layout/AppShell';
import { ROUTES } from './config/constants';

// Lazy load pages for code splitting
const Landing = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Generator = lazy(() => import('./pages/Generator'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const Certify = lazy(() => import('./pages/Certify'));
const Verify = lazy(() => import('./pages/Verify'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black">
    <div className="text-center">
      <div className="inline-block w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
      <p className="text-gray-400 text-lg">Loading HireReady...</p>
    </div>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return <>{children}</>;
};

// Public only route (redirect to dashboard if logged in)
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.landing} element={<Landing />} />
            <Route path={ROUTES.verify} element={<Verify />} />
            
            {/* Auth Routes (public only) */}
            <Route
              path={ROUTES.login}
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />
            <Route
              path={ROUTES.signup}
              element={
                <PublicOnlyRoute>
                  <Signup />
                </PublicOnlyRoute>
              }
            />

            {/* Protected Routes (wrapped in AppShell) */}
            <Route
              path={ROUTES.dashboard}
              element={
                <ProtectedRoute>
                  <AppShell>
                    <Dashboard />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.generator}
              element={
                <ProtectedRoute>
                  <AppShell>
                    <Generator />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.roadmap}
              element={
                <ProtectedRoute>
                  <AppShell>
                    <Roadmap />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.certify}
              element={
                <ProtectedRoute>
                  <AppShell>
                    <Certify />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.profile}
              element={
                <ProtectedRoute>
                  <AppShell>
                    <Profile />
                  </AppShell>
                </ProtectedRoute>
              }
            />

            {/* 404 Catch-all */}
            <Route path="*" element={<Navigate to={ROUTES.landing} replace />} />
          </Routes>
        </Suspense>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
