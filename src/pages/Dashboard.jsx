import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Clock, CalendarDays, Wallet, User, LogIn, LogOut, 
  CheckCircle, FileText, CalendarPlus, 
  ArrowUpRight, Info, AlertTriangle, FileCheck
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import StatusBadge from '../components/StatusBadge';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { getUsers, getAttendance, getLeaves, getPayroll } from '../lib/api';
import { notifications as initialNotifications, recentActivity } from '../data/notifications';

// Helper to map icon names from string to Lucide component
const getIcon = (iconName) => {
  const icons = {
    'CheckCircle': CheckCircle,
    'Clock': Clock,
    'FileText': FileText,
    'CalendarDays': CalendarDays,
    'CalendarPlus': CalendarPlus,
    'Info': Info,
    'AlertTriangle': AlertTriangle,
    'FileCheck': FileCheck,
    'Wallet': Wallet,
    'LogIn': LogIn,
    'LogOut': LogOut,
  };
  const Icon = icons[iconName] || Info;
  return <Icon className="w-4 h-4" />;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [users, attendanceData, leavesData, payrollData] = await Promise.all([
          getUsers(),
          getAttendance(),
          getLeaves(),
          getPayroll(),
        ]);

        // Find the current employee user
        const emp = users.find(u => u.role === 'EMPLOYEE');
        setEmployee(emp);

        setAttendance(attendanceData);
        setLeaves(leavesData);
        setPayroll(payrollData);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  // Derive stats from API data
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const todayAttendance = attendance.find(a => a.date && a.date.startsWith(todayStr));
  const isCheckedIn = todayAttendance && !todayAttendance.checkOut;

  const thisMonth = today.toISOString().slice(0, 7);
  const monthAttendance = attendance.filter(a => a.date && a.date.startsWith(thisMonth));
  const presentDays = monthAttendance.filter(a => a.status === 'PRESENT').length;
  const totalWorkingDays = 22;
  const presentPercentage = (presentDays / totalWorkingDays) * 100;

  const pendingLeaves = leaves.filter(l => l.status === 'PENDING').length;
  const latestPayroll = payroll[0];

  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  if (loading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8 pb-10">
        
        {/* Welcome Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-2"
        >
          <p className="uppercase text-xs font-semibold tracking-widest text-[#d4af37]">
            Employee Portal
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Welcome back, {employee?.name || authUser?.name || 'Employee'}
          </h1>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-gray-500 font-medium">{formattedDate}</span>
            <StatusBadge status={isCheckedIn ? 'Present' : 'Absent'} />
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-3"
          aria-label="Quick Actions"
        >
          <button 
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-transform hover:-translate-y-0.5 hover:brightness-110 bg-[#d4af37] text-[#0B0E14]"
            onClick={() => navigate('/attendance')}
          >
            {isCheckedIn ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            {isCheckedIn ? 'Check Out' : 'Check In'}
          </button>
          
          <button 
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0B0E14]"
            onClick={() => navigate('/leave')}
          >
            <CalendarPlus className="w-4 h-4" />
            Apply Leave
          </button>
          
          <button 
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-transform hover:-translate-y-0.5 bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={() => navigate('/profile')}
          >
            <User className="w-4 h-4" />
            View Profile
          </button>
          
          <button 
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-transform hover:-translate-y-0.5 bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={() => navigate('/payroll')}
          >
            <FileText className="w-4 h-4" />
            View Payslip
          </button>
        </motion.section>

        {/* KPI Summary Row */}
        <section aria-label="Key Performance Indicators" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0 * 0.08 }}>
            <Card variant="light" hover={true} className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-[#d4af37]/10 p-2 rounded-lg text-[#d4af37]">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <p className="uppercase text-xs tracking-widest text-gray-400 font-semibold mb-1">
                  Attendance
                </p>
                <p className="text-3xl md:text-4xl font-bold tabular-nums text-gray-900 mb-2">
                  {presentDays}/{totalWorkingDays}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Days Present This Month
                </p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-auto">
                <div 
                  className="bg-[#d4af37] h-1.5 rounded-full" 
                  style={{ width: `${presentPercentage}%` }}
                />
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1 * 0.08 }}>
            <Card variant="light" hover={true} className="h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-600">
                  <CalendarDays className="w-5 h-5" />
                </div>
              </div>
              <p className="uppercase text-xs tracking-widest text-gray-400 font-semibold mb-1">
                Leave Requests
              </p>
              <p className="text-3xl md:text-4xl font-bold tabular-nums text-gray-900 mb-2">
                {leaves.length}
              </p>
              <p className="text-sm text-gray-500">
                {pendingLeaves} pending approval
              </p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 2 * 0.08 }}>
            <Card variant="light" hover={true} className="h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-amber-500/10 p-2 rounded-lg text-amber-600">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <p className="uppercase text-xs tracking-widest text-gray-400 font-semibold mb-1">
                Pending Requests
              </p>
              <p className="text-3xl md:text-4xl font-bold tabular-nums text-gray-900 mb-2">
                {pendingLeaves}
              </p>
              <p className="text-sm text-gray-500">
                Awaiting Approval
              </p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 3 * 0.08 }}>
            <Card variant="light" hover={true} className="h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-[#162032]/10 p-2 rounded-lg text-[#0B0E14]">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <p className="uppercase text-xs tracking-widest text-gray-400 font-semibold mb-1">
                Net Pay
              </p>
              <p className="text-3xl md:text-4xl font-bold tabular-nums text-gray-900 mb-2">
                ₹{(latestPayroll?.netSalary || 0).toLocaleString()}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <p className="text-sm text-gray-500">
                  {latestPayroll ? new Date(latestPayroll.paymentDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                </p>
                <Link to="/payroll" className="text-sm text-[#d4af37] font-medium hover:underline flex items-center gap-1">
                  View <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* Two-column section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          
          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card variant="dark" className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Recent Activity</h2>
                <button className="text-sm text-[#d4af37] hover:underline font-medium">
                  View All
                </button>
              </div>
              
              <div className="relative pl-6 space-y-6">
                <div className="absolute left-[3px] top-2 bottom-2 border-l border-[#d4af37]/30"></div>
                
                {recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="relative">
                    <div className="absolute -left-6 top-1 w-2 h-2 rounded-full bg-[#d4af37]" />
                    <div className="flex gap-4 items-start">
                      <div className="text-[#d4af37] bg-[#d4af37]/10 p-1.5 rounded-md shrink-0">
                        {getIcon(activity.icon)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-300 font-medium">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <Card variant="light" className="h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-[#d4af37] text-[#0B0E14] font-bold text-xs px-2 py-0.5">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-sm text-gray-500 hover:text-gray-900 hover:underline transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              
              <div className="flex flex-col">
                {notifications.slice(0, 5).map((notification, idx) => (
                  <div 
                    key={notification.id} 
                    className={`py-4 flex gap-4 ${idx !== 0 ? 'border-t border-gray-100' : ''}`}
                  >
                    <div className="mt-1.5 w-2 shrink-0">
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${notification.isRead ? 'text-gray-500' : 'text-gray-900'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1.5">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

        </section>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
