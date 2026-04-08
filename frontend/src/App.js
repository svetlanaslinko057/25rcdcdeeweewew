import { useEffect, useState, useCallback } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import { createContext, useContext } from "react";

// Pages
import LandingPage from "@/pages/LandingPage";
import ClientAuthPage from "@/pages/ClientAuthPage";
import BuilderAuthPage from "@/pages/BuilderAuthPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import ClientDashboard from "@/pages/ClientDashboard";
import DeveloperDashboard from "@/pages/DeveloperDashboard";
import TesterDashboard from "@/pages/TesterDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import NewRequest from "@/pages/NewRequest";
import ProjectDetails from "@/pages/ProjectDetails";
import ScopeBuilder from "@/pages/ScopeBuilder";
import WorkUnitDetail from "@/pages/WorkUnitDetail";
import DeliverableBuilder from "@/pages/DeliverableBuilder";
import DeveloperWorkUnit from "@/pages/DeveloperWorkUnit";
import TesterValidation from "@/pages/TesterValidation";
import ClientDeliverable from "@/pages/ClientDeliverable";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, {
        withCredentials: true
      });
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Redirect to appropriate auth page based on path
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    } else if (location.pathname.startsWith('/developer') || location.pathname.startsWith('/tester')) {
      return <Navigate to="/builder/auth" state={{ from: location }} replace />;
    } else {
      return <Navigate to="/client/auth" state={{ from: location }} replace />;
    }
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const dashboardRoutes = {
      client: '/client/dashboard',
      developer: '/developer/dashboard',
      tester: '/tester/dashboard',
      admin: '/admin/dashboard'
    };
    return <Navigate to={dashboardRoutes[user.role] || '/client/dashboard'} replace />;
  }

  return children;
};

function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Auth Routes - New Structure */}
      <Route path="/client/auth" element={<ClientAuthPage />} />
      <Route path="/builder/auth" element={<BuilderAuthPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      
      {/* Client Routes */}
      <Route 
        path="/client/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['client', 'admin']}>
            <ClientDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/client/request/new" 
        element={
          <ProtectedRoute allowedRoles={['client', 'admin']}>
            <NewRequest />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/client/projects/:projectId" 
        element={
          <ProtectedRoute allowedRoles={['client', 'admin']}>
            <ProjectDetails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/client/deliverable/:deliverableId" 
        element={
          <ProtectedRoute allowedRoles={['client', 'admin']}>
            <ClientDeliverable />
          </ProtectedRoute>
        } 
      />
      
      {/* Developer Routes */}
      <Route 
        path="/developer/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['developer', 'admin']}>
            <DeveloperDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/developer/work/:unitId" 
        element={
          <ProtectedRoute allowedRoles={['developer', 'admin']}>
            <DeveloperWorkUnit />
          </ProtectedRoute>
        } 
      />
      
      {/* Tester Routes */}
      <Route 
        path="/tester/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['tester', 'admin']}>
            <TesterDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tester/validation/:validationId" 
        element={
          <ProtectedRoute allowedRoles={['tester', 'admin']}>
            <TesterValidation />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/scope-builder/:requestId" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ScopeBuilder />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/work-unit/:unitId" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <WorkUnitDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/deliverable/:projectId" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DeliverableBuilder />
          </ProtectedRoute>
        } 
      />
      
      {/* Legacy redirects */}
      <Route path="/dashboard" element={<Navigate to="/client/dashboard" replace />} />
      <Route path="/developer/hub" element={<Navigate to="/developer/dashboard" replace />} />
      <Route path="/tester/hub" element={<Navigate to="/tester/dashboard" replace />} />
      <Route path="/admin/work-board" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/request/new" element={<Navigate to="/client/request/new" replace />} />
      <Route path="/auth/client" element={<Navigate to="/client/auth" replace />} />
      <Route path="/auth/builder" element={<Navigate to="/builder/auth" replace />} />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
