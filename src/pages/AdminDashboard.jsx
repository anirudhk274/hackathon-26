import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  UserX,
  ClipboardList,
  Wallet,
  ArrowRight,
  CalendarCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUsers, getAttendance, getLeaves, getPayroll } from '../lib/api';
import StatusBadge from '../components/StatusBadge';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersData, attendanceData, leavesData, payrollData] = await Promise.all([
          getUsers(),
          getAttendance(),
          getLeaves(),
          getPayroll(),
        ]);
        setUsers(usersData);
        setAttendance(attendanceData);
        setLeaves(leavesData);
        setPayroll(payrollData);
      } catch (err) {
        console.error('Failed to fetch admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full" />
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date && a.date.startsWith(todayStr));
  const presentCount = todayAttendance.filter(a => a.status === 'PRESENT').length;
  const absentCount = todayAttendance.filter(a => a.status === 'ABSENT').length;
  const pendingLeaves = leaves.filter(l => l.status === 'PENDING');
  const totalPayroll = payroll.reduce((sum, p) => sum + p.netSalary, 0);

  const statCards = [
    { title: 'Total Employees', value: users.length, icon: Users, color: 'text-[#d4af37]', bg: 'bg-[#d4af37]/10' },
    { title: 'Present Today', value: presentCount, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Absent Today', value: absentCount, icon: UserX, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { title: 'Pending Leaves', value: pendingLeaves.length, icon: ClipboardList, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: 'Payroll (Monthly)', value: `₹${(totalPayroll / 1000).toFixed(0)}K`, icon: Wallet, color: 'text-[#d4af37]', bg: 'bg-[#d4af37]/10' },
  ];

  const quickLinks = [
    { to: '/admin/employees', label: 'Manage Employees', icon: Users },
    { to: '/admin/attendance', label: 'View Attendance', icon: CalendarCheck },
    { to: '/admin/leave', label: 'Approve Leaves', icon: ClipboardList },
    { to: '/admin/payroll', label: 'Payroll Overview', icon: Wallet },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#d4af37] mb-1">Overview</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.title} variants={item} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.bg}`}>
                  <Icon size={20} className={card.color} />
                </div>
              </div>
              <p className="text-3xl font-bold tabular-nums text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.title}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Links */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }} className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.to} to={link.to} className="group bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0B0E14] flex items-center justify-center">
                      <Icon size={18} className="text-[#d4af37]" />
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{link.label}</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Attendance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Today's Attendance</h2>
            <Link to="/admin/attendance" className="text-xs font-semibold text-[#d4af37] hover:underline flex items-center gap-1">View All <ArrowRight size={12} /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-2 font-medium">Employee</th>
                  <th className="pb-2 font-medium">Check-in</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {todayAttendance.slice(0, 5).map((record) => (
                  <tr key={record.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-2.5 font-medium text-gray-900">{record.user?.name || 'Unknown'}</td>
                    <td className="py-2.5 text-gray-600">{record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                    <td className="py-2.5"><StatusBadge status={record.status === 'PRESENT' ? 'Present' : record.status === 'ABSENT' ? 'Absent' : 'Half-day'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Pending Leave Requests */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Pending Leave Requests</h2>
            <Link to="/admin/leave" className="text-xs font-semibold text-[#d4af37] hover:underline flex items-center gap-1">View All <ArrowRight size={12} /></Link>
          </div>
          {pendingLeaves.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <ClipboardList size={36} className="mb-2 opacity-60 text-[#d4af37]" />
              <p className="text-sm">No pending requests</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-2 font-medium">Employee</th>
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium">Dates</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLeaves.map((leave) => (
                    <tr key={leave.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-2.5 font-medium text-gray-900">{leave.user?.name || 'Unknown'}</td>
                      <td className="py-2.5 text-gray-600">{leave.type}</td>
                      <td className="py-2.5 text-gray-600">
                        {new Date(leave.startDate).toLocaleDateString()} — {new Date(leave.endDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
