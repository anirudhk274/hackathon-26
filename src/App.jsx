import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import EmployeeLayout from './layouts/EmployeeLayout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Payroll from './pages/Payroll';

function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route element={<EmployeeLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
  );
}

export default App;

