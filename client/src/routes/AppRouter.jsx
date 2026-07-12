import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import DoctorDashboard from '../pages/DoctorDashboard';
import DoctorPortal from '../pages/DoctorPortal';
import PatientDashboard from '../pages/PatientDashboard';
import PatientPortal from '../pages/PatientPortal';
import ReceptionistDashboard from '../pages/ReceptionistDashboard';
import Doctors from '../pages/Doctors';
import Patients from '../pages/Patients';
import Appointments from '../pages/Appointments';
import Billing from '../pages/Billing';
import Prescriptions from '../pages/Prescriptions';
import Laboratory from '../pages/Laboratory';
import Pharmacy from '../pages/Pharmacy';
import Inventory from '../pages/Inventory';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';
import ReceptionistPortal from '../pages/ReceptionistPortal';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        <Route path="/doctor-dashboard" element={<DoctorPortal />} />
        <Route path="/patient-dashboard" element={<PatientPortal />} />
<Route path="/receptionist-dashboard" element={<ReceptionistDashboard />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/laboratory" element={<Laboratory />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
