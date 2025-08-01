import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  BrowserRouter,
} from "react-router-dom";
import Cookies from "js-cookie"; // For cookie checks (consistent with LoginPage and Dashboard)
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import DataEntry from "./pages/DataEntry";
import Reports from "./pages/Reports";
import Navigation from "./components/Navigation";
import ModuleDetailPage from "./pages/ModuleDetailPage";
import GPProfile from "./pages/GPProfile";
import ICDSDataEntry from "./pages/ICDSDataEntry";
import HealthCentreDataEntry from "./pages/HealthCentreDataEntry";
import { useLocation } from "react-router-dom";
import { ToastProvider } from "../src/context/ToastContext"



// ProtectedRoute wrapper: Checks for authToken in cookies
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = Cookies.get("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// PublicRoute: Redirects to dashboard if already logged in
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const token = Cookies.get("authToken");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function AppContent() {
  const [hasToken, setHasToken] = useState(!!Cookies.get("authToken"));
  const location = useLocation();
  console.log("Initial token check:", hasToken);


  // Listen for token changes (e.g., after login/logout)
  useEffect(() => {
    const token = Cookies.get("authToken");
    setHasToken(!!token);
    const checkToken = () => setHasToken(!!token);
    console.log("token check triggered:", hasToken);
    window.addEventListener("storage", checkToken); // In case cookies change externally
    return () => window.removeEventListener("storage", checkToken);
  }, [location]);

  return (
    <>
      {hasToken && <Navigation />}
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/data-entry"
          element={
            <ProtectedRoute>
              <DataEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/details/:moduleId/:id"
          element={
            <ProtectedRoute>
              <ModuleDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gp-profile"
          element={
            <ProtectedRoute>
              <GPProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/icds-data-entry"
          element={
            <ProtectedRoute>
              <ICDSDataEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/health-centre-data-entry"
          element={
            <ProtectedRoute>
              <HealthCentreDataEntry />
            </ProtectedRoute>
          }
        />
        {/* Catch-all redirect for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ToastProvider>
        {/* <Router> */}
        <BrowserRouter basename="/RuralHealth">
          <AppContent />
        {/* </Router> */}
        </BrowserRouter>
      </ToastProvider>
    </div>
  );
}

export default App;
