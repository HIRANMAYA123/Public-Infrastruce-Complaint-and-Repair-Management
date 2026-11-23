import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ReportComplaintPage from './pages/citizen/ReportComplaintPage';
import MyComplaintsPage from './pages/citizen/MyComplaintsPage';
import ComplaintDetailsPage from './pages/citizen/ComplaintDetailsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ComplaintManagementPage from './pages/admin/ComplaintManagementPage';
import WorkerManagementPage from './pages/admin/WorkerManagementPage';
import DepartmentManagementPage from './pages/admin/DepartmentManagementPage';
import WardManagementPage from './pages/admin/WardManagementPage';
import AnalyticsReportsPage from './pages/admin/AnalyticsReportsPage';

// Field Worker Pages
import WorkerDashboard from './pages/worker/WorkerDashboard';

export const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Citizen Protected Routes */}
      <Route
        path="/citizen"
        element={
          <ProtectedRoute allowedRoles={['citizen']}>
            <CitizenDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/report"
        element={
          <ProtectedRoute allowedRoles={['citizen']}>
            <ReportComplaintPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/complaints"
        element={
          <ProtectedRoute allowedRoles={['citizen']}>
            <MyComplaintsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/complaints/:id"
        element={
          <ProtectedRoute allowedRoles={['citizen', 'admin', 'field_worker']}>
            <ComplaintDetailsPage />
          </ProtectedRoute>
        }
      />

      {/* Municipal Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/complaints"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ComplaintManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/workers"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <WorkerManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/departments"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DepartmentManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/wards"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <WardManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AnalyticsReportsPage />
          </ProtectedRoute>
        }
      />

      {/* Field Worker Protected Routes */}
      <Route
        path="/worker"
        element={
          <ProtectedRoute allowedRoles={['field_worker']}>
            <WorkerDashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
