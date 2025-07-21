import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import DataEntry from './pages/DataEntry';
import Reports from './pages/Reports';
import Navigation from './components/Navigation';
import ModuleDetailPage from './pages/ModuleDetailPage';
import GPProfile from './pages/GPProfile';
import ICDSDataEntry from './pages/ICDSDataEntry';
import HealthCentreDataEntry from './pages/HealthCentreDataEntry';

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        {user && <Navigation />}
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/data-entry" element={user ? <DataEntry /> : <Navigate to="/login" />} />
          <Route path="/reports" element={user ? <Reports /> : <Navigate to="/login" />} />
          <Route path="/details/:moduleId" element={user ? <ModuleDetailPage /> : <Navigate to="/login" />} />
          <Route path="/gp-profile" element={<GPProfile />} />
          <Route path="/icds-data-entry" element={<ICDSDataEntry />} />
          <Route path="/health-centre-data-entry" element={<HealthCentreDataEntry />} />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;