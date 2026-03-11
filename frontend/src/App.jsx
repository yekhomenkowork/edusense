import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Публічні сторінки
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DemoPage from './pages/DemoPage';

// Обгортка та Головний Дашборд
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';

// Сторінки System Admin
import AdminOverviewPage from './pages/AdminOverviewPage';
import AdminSchoolsPage from './pages/AdminSchoolsPage';
import AdminSchoolDetailsPage from './pages/AdminSchoolDetailsPage';
import AdminBillingPage from './pages/AdminBillingPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminApiIntegrationsPage from './pages/AdminApiIntegrationsPage';

// Сторінки School Admin
import SchoolAudioPage from './pages/SchoolAudioPage';
import SchoolSecurityPage from './pages/SchoolSecurityPage';
import SchoolStaffPage from './pages/SchoolStaffPage';
import SchoolDevicesPage from './pages/SchoolDevicesPage';
import StaffGuardPage from './pages/StaffGuardPage';
import StaffAlertPage from './pages/StaffAlertPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/demo" element={<DemoPage />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          
          {/* Маршрути Головного Адміністратора (SaaS) */}
          <Route path="overview" element={<AdminOverviewPage />} />
          <Route path="schools" element={<AdminSchoolsPage />} />
          <Route path="schools/:id" element={<AdminSchoolDetailsPage />} />
          <Route path="billing" element={<AdminBillingPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="api" element={<AdminApiIntegrationsPage />} />

          {/* Маршрути Директора Школи */}
          <Route path="audio" element={<SchoolAudioPage />} />
          <Route path="security" element={<SchoolSecurityPage />} />
          <Route path="staff" element={<SchoolStaffPage />} />
          <Route path="devices" element={<SchoolDevicesPage />} />
          
          {/* Маршрути Охоронця (Staff) */}
          <Route path="guard" element={<StaffGuardPage />} />
          <Route path="alert" element={<StaffAlertPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
