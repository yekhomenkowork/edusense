import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DemoPage from './pages/DemoPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import AdminSchoolsPage from './pages/AdminSchoolsPage';
import AdminSchoolDetailsPage from './pages/AdminSchoolDetailsPage'; // <--- НОВИЙ ІМПОРТ
import AdminBillingPage from './pages/AdminBillingPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminApiIntegrationsPage from './pages/AdminApiIntegrationsPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/demo" element={<DemoPage />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          
          <Route path="schools" element={<AdminSchoolsPage />} />
          <Route path="schools/:id" element={<AdminSchoolDetailsPage />} /> {/* <--- НОВИЙ МАРШРУТ */}
          
          <Route path="billing" element={<AdminBillingPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="api" element={<AdminApiIntegrationsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
