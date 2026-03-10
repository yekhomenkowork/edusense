import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Публічні маршрути */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Захищені маршрути (Тільки для авторизованих) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          {/* Тут згодом будуть інші сторінки: /dashboard/audio, /dashboard/security і т.д. */}
        </Route>
      </Routes>
    </Router>
  );
}
