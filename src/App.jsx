import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeProfile from './pages/EmployeeProfile';
import Attendance from './pages/Attendance';
import LeaveApproval from './pages/LeaveApproval';
import Payroll from './pages/Payroll';
import Reports from './pages/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/employees/:id" element={<EmployeeProfile />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leave" element={<LeaveApproval />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
