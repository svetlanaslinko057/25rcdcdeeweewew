import { useEffect, useState, useCallback } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { createContext, useContext } from "react";

// Pages
import LandingPage from "@/pages/LandingPage";
import ClientAuth from "@/pages/ClientAuth";
import BuilderAuth from "@/pages/BuilderAuth";
import ClientDashboard from "@/pages/ClientDashboard";
import DeveloperDashboard from "@/pages/DeveloperDashboard";
import TesterDashboard from "@/pages/TesterDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import NewRequest from "@/pages/NewRequest";
import ProjectDetails from "@/pages/ProjectDetails";
import ScopeBuilder from "@/pages/ScopeBuilder";
import WorkUnitDetail from "@/pages/WorkUnitDetail";
import DeliverableBuilder from "@/pages/DeliverableBuilder";

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
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const dashboardRoutes = {
      client: '/dashboard',
      developer: '/developer/hub',
      tester: '/tester/hub',
      admin: '/admin/work-board'
    };
    return <Navigate to={dashboardRoutes[user.role] || '/dashboard'} replace />;
  }

  return children;
};

// Role-based Dashboard Router
const DashboardRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/work-board" replace />;
    case 'developer':
      return <Navigate to="/developer/hub" replace />;
    case 'tester':
      return <Navigate to="/tester/hub" replace />;
    default:
      return <ClientDashboard />;
  }
};

function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Auth Routes */}
      <Route path="/auth/client" element={<ClientAuth />} />
      <Route path="/auth/builder" element={<BuilderAuth />} />
      
      {/* Client Routes */}
      <Route path="/dashboard" element={<DashboardRouter />} />
      <Route 
        path="/request/new" 
        element={
          <ProtectedRoute allowedRoles={['client', 'admin']}>
            <NewRequest />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/projects/:projectId" 
        element={
          <ProtectedRoute>
            <ProjectDetails />
          </ProtectedRoute>
        } 
      />
      
      {/* Developer Routes */}
      <Route 
        path="/developer/hub" 
        element={
          <ProtectedRoute allowedRoles={['developer', 'admin']}>
            <DeveloperDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Tester Routes */}
      <Route 
        path="/tester/hub" 
        element={
          <ProtectedRoute allowedRoles={['tester', 'admin']}>
            <TesterDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin Routes */}
      <Route 
        path="/admin/work-board" 
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
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
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
