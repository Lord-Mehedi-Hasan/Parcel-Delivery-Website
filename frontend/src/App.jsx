import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import TrackParcel from './pages/TrackParcel';
import BookParcel from './pages/BookParcel';
import CalculatorPage from './pages/CalculatorPage';
import BranchesPage from './pages/BranchesPage';
import CustomerDashboard from './pages/CustomerDashboard';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/track" element={<TrackParcel />} />
                <Route path="/book" element={<BookParcel />} />
                <Route path="/calculator" element={<CalculatorPage />} />
                <Route path="/branches" element={<BranchesPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Customer Dashboard */}
                <Route
                  path="/customer"
                  element={
                    <ProtectedRoute allowedRoles={['customer', 'admin']}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Driver Task Board */}
                <Route
                  path="/driver"
                  element={
                    <ProtectedRoute allowedRoles={['driver', 'admin']}>
                      <DriverDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Operations Control */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}
