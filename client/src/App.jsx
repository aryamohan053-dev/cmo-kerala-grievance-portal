import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Departments from './pages/Departments';
import TrackGrievance from './pages/TrackGrievance';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';

// Protected pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import SubmitGrievance from './pages/citizen/SubmitGrievance';
import CMODashboard from './pages/cmo/CMODashboard';
import OfficerDashboard from './pages/officer/OfficerDashboard';

// Protected Route Guard
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs text-gray-500">
        Verifying authorization...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/track" element={<TrackGrievance />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Citizen Protected Routes */}
          <Route
            path="/citizen/dashboard"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/submit"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <SubmitGrievance />
              </ProtectedRoute>
            }
          />

          {/* CMO Admin Protected Routes */}
          <Route
            path="/cmo/dashboard"
            element={
              <ProtectedRoute allowedRoles={['cmo_admin']}>
                <CMODashboard />
              </ProtectedRoute>
            }
          />

          {/* Department Officer Protected Routes */}
          <Route
            path="/officer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['department_officer']}>
                <OfficerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
