import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import EmployeeLayout from './layouts/EmployeeLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Payroll from './pages/Payroll';

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <Routes location={location} key={location.pathname}>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Admin placeholder */}
        <Route
          path="/admin/dashboard"
          element={
            <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center max-w-sm">
                <h1 className="text-xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-500 text-sm">Coming Soon</p>
              </div>
            </div>
          }
        />

        {/* Employee routes */}
        <Route element={<EmployeeLayout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/dashboard"
            element={
              <AnimatePresence mode="wait">
                <Dashboard key="dashboard" />
              </AnimatePresence>
            }
          />
          <Route
            path="/profile"
            element={
              <AnimatePresence mode="wait">
                <Profile key="profile" />
              </AnimatePresence>
            }
          />
          <Route
            path="/attendance"
            element={
              <AnimatePresence mode="wait">
                <Attendance key="attendance" />
              </AnimatePresence>
            }
          />
          <Route
            path="/leave"
            element={
              <AnimatePresence mode="wait">
                <Leave key="leave" />
              </AnimatePresence>
            }
          />
          <Route
            path="/payroll"
            element={
              <AnimatePresence mode="wait">
                <Payroll key="payroll" />
              </AnimatePresence>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
