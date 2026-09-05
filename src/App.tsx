import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './utils/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { DoctorDashboard } from './components/dashboard/DoctorDashboard';
import { PatientDashboard } from './components/dashboard/PatientDashboard';
import {SignicatCallback} from './pages/SignicatCallback';
import {GoogleCallback} from './pages/GoogleCallback';
import { AuthLogin } from './pages/AuthLogin';
import { DashboardPage } from './pages/DashboardPage';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication Callback Routes */}
          <Route path="/auth/signicat/callback" element={<SignicatCallback />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/auth/login" element={<AuthLogin />} />
          
          {/* Protected Routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            {/* Role-Based Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/doctor/*" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/patient/*" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;