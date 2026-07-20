import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/index';
import Register from './pages/Patients/Register';
import Detail from './pages/Patients/Detail';
import VaccinationForm from './pages/Vaccinations/Form';
import Alertes from './pages/Alertes/index';
import Rapports from './pages/Rapports/index';
import PortailParent from './pages/PortailParent/index';
import AgentDashboard from './pages/AgentDashboard/index';
import { AnimatePresence } from 'framer-motion';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-evaccin-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-evaccin-primary/20 border-t-evaccin-primary rounded-full animate-spin" />
        <p className="text-xs font-bold text-evaccin-primary/40 uppercase tracking-widest">Vérification...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'AGENT' ? '/agent-dashboard' : '/'} replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Route Publique pour les Parents */}
        <Route path="/carnet" element={<PortailParent />} />
        
        <Route path="/login" element={<Login />} />
        
        {/* Route Spécifique pour les Agents de Santé */}
        <Route path="/agent-dashboard" element={
          <ProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
            <AgentDashboard />
          </ProtectedRoute>
        } />

        {/* Routes pour les Médecins et Admins */}
        <Route path="/" element={<ProtectedRoute allowedRoles={['MEDECIN', 'ADMIN']}><Dashboard /></ProtectedRoute>} />
        <Route path="/patients/register" element={<ProtectedRoute allowedRoles={['MEDECIN', 'ADMIN']}><Register /></ProtectedRoute>} />
        <Route path="/patients/:id" element={<ProtectedRoute allowedRoles={['MEDECIN', 'ADMIN']}><Detail /></ProtectedRoute>} />
        <Route path="/vaccinations/new" element={<ProtectedRoute allowedRoles={['MEDECIN', 'ADMIN', 'AGENT']}><VaccinationForm /></ProtectedRoute>} />
        <Route path="/alertes" element={<ProtectedRoute allowedRoles={['MEDECIN', 'ADMIN']}><Alertes /></ProtectedRoute>} />
        <Route path="/rapports" element={<ProtectedRoute allowedRoles={['MEDECIN', 'ADMIN']}><Rapports /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
