import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Download,
  CalendarCheck,
  Wallet,
  ClipboardList,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  monthlyAttendance,
  salaryDistribution,
  leaveSummary,
} from '../data/mockData';

const COLORS = ['#d4af37', '#0B0E14', '#162032', '#6366f1', '#ec4899'];

const reportTabs = [
  { id: 'attendance', label: 'Attendance Report', icon: CalendarCheck },
  { id: 'salary', label: 'Salary Report', icon: Wallet },
  { id: 'leave', label: 'Leave Report', icon: ClipboardList },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function Reports() {
  const [activeReport, setActiveReport] = useState('attendance');

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <p className="text-xs font-semibold tracking-widest uppercase text-[#d4af37] mb-1">
          Analytics
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          Reports & Analytics
        </h1>
      </motion.div>

      {/* Report Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex gap-2 mb-6 overflow-x-auto pb-2"
      >
        {reportTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition whitespace-nowrap ${
                activeReport === tab.id
                  ? 'bg-[#0B0E14] text-[#d4af37]'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-[#d4af37] hover:text-[#d4af37]'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </motion.div>

      {/* Report Content */}
      <motion.div
        key={activeReport}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeReport === 'attendance' && <AttendanceReport />}
        {activeReport === 'salary' && <SalaryReport />}
        {activeReport === 'leave' && <LeaveReport />}
      </motion.div>
    </div>
  );
}

function AttendanceReport() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Bar Chart */}
      <motion.div
        variants={item}
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Monthly Attendance Overview
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Present, absent, and leave days per month
            </p>
          </div>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-[#d4af37] hover:text-[#d4af37] transition">
            <Download size={14} />
            Export
          </button>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={monthlyAttendance} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            />
            <Legend />
            <Bar dataKey="present" name="Present" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="absent" name="Absent" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="leave" name="Leave" fill="#d4af37" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Summary Table */}
      <motion.div
        variants={item}
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Attendance Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-xs font-semibold uppercase text-gray-500">Month</th>
                <th className="text-right py-2 text-xs font-semibold uppercase text-gray-500">Present</th>
                <th className="text-right py-2 text-xs font-semibold uppercase text-gray-500">Absent</th>
                <th className="text-right py-2 text-xs font-semibold uppercase text-gray-500">Leave</th>
                <th className="text-right py-2 text-xs font-semibold uppercase text-gray-500">Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {monthlyAttendance.map((row) => {
                const total = row.present + row.absent + row.leave;
                const pct = ((row.present / total) * 100).toFixed(1);
                return (
                  <tr key={row.month} className="border-b border-gray-50 last:border-0">
                    <td className="py-2.5 font-medium text-gray-900">{row.month}</td>
                    <td className="py-2.5 text-right tabular-nums text-emerald-600">{row.present}</td>
                    <td className="py-2.5 text-right tabular-nums text-rose-500">{row.absent}</td>
                    <td className="py-2.5 text-right tabular-nums text-[#d4af37]">{row.leave}</td>
                    <td className="py-2.5 text-right tabular-nums font-medium text-gray-900">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SalaryReport() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Salary Distribution Chart */}
      <motion.div
        variants={item}
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Salary Distribution by Department
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Total monthly net salary per department
            </p>
          </div>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-[#d4af37] hover:text-[#d4af37] transition">
            <Download size={14} />
            Export
          </button>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={salaryDistribution} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
            <YAxis dataKey="department" type="category" tick={{ fontSize: 12, fill: '#6b7280' }} width={100} />
            <Tooltip
              formatter={(value) => [`₹${value.toLocaleString()}`, 'Total Salary']}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            />
            <Bar dataKey="total" fill="#d4af37" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Salary Slip Section */}
      <motion.div
        variants={item}
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          Salary Slip Generation
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Generate downloadable salary slips for employees.
        </p>
        <div className="bg-gray-50 rounded-xl p-8 flex flex-col items-center justify-center text-center">
          <Wallet size={40} className="text-[#d4af37] opacity-60 mb-3" />
          <p className="text-sm font-medium text-gray-600 mb-3">
            Select employees to generate salary slips
          </p>
          <button className="inline-flex items-center gap-2 bg-[#d4af37] text-[#0B0E14] px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition">
            <Download size={16} />
            Generate All Slips
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function LeaveReport() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Pie Chart */}
      <motion.div
        variants={item}
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Leave Distribution by Type
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Breakdown of leave requests across all types
            </p>
          </div>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-[#d4af37] hover:text-[#d4af37] transition">
            <Download size={14} />
            Export
          </button>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={leaveSummary}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              dataKey="count"
              nameKey="type"
              paddingAngle={4}
            >
              {leaveSummary.map((entry, index) => (
                <Cell
                  key={entry.type}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Leave Summary Table */}
      <motion.div
        variants={item}
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Leave Report Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-xs font-semibold uppercase text-gray-500">Leave Type</th>
                <th className="text-right py-2 text-xs font-semibold uppercase text-gray-500">Total Requests</th>
                <th className="text-right py-2 text-xs font-semibold uppercase text-gray-500">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {leaveSummary.map((row) => {
                const total = leaveSummary.reduce((s, r) => s + r.count, 0);
                const pct = ((row.count / total) * 100).toFixed(1);
                return (
                  <tr key={row.type} className="border-b border-gray-50 last:border-0">
                    <td className="py-2.5 font-medium text-gray-900">{row.type}</td>
                    <td className="py-2.5 text-right tabular-nums">{row.count}</td>
                    <td className="py-2.5 text-right tabular-nums text-gray-600">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200">
                <td className="py-2.5 font-bold text-gray-900">Total</td>
                <td className="py-2.5 text-right tabular-nums font-bold">
                  {leaveSummary.reduce((s, r) => s + r.count, 0)}
                </td>
                <td className="py-2.5 text-right font-bold">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
