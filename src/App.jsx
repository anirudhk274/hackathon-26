import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import EmployeeLayout from './layouts/EmployeeLayout';
import Layout from './components/Layout';
import Login from './pages/Login';

// Employee pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Payroll from './pages/Payroll';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import Employees from './pages/Employees';
import EmployeeProfile from './pages/EmployeeProfile';
import AdminAttendance from './pages/AdminAttendance';
import LeaveApproval from './pages/LeaveApproval';
import AdminPayroll from './pages/AdminPayroll';
import Reports from './pages/Reports';

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <Routes location={location} key={location.pathname}>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Employee routes */}
        <Route element={<EmployeeLayout />}>
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

        {/* Admin routes */}
        <Route path="/admin" element={<Layout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="employees/:id" element={<EmployeeProfile />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="leave" element={<LeaveApproval />} />
          <Route path="payroll" element={<AdminPayroll />} />
          <Route path="reports" element={<Reports />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
