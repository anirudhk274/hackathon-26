import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  Edit3,
  Save,
  X,
  Search,
  DollarSign,
  TrendingUp,
  Users,
} from 'lucide-react';
import { employees } from '../data/mockData';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Payroll() {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const activeEmployees = employees.filter((e) => e.status !== 'Inactive');
  const totalPayroll = activeEmployees.reduce(
    (sum, e) => sum + e.salary.netSalary,
    0
  );

  const filtered = activeEmployees.filter(
    (emp) =>
      search === '' ||
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (emp) => {
    setEditingId(emp.id);
    setEditData({ ...emp.salary });
  };

  const saveEdit = () => {
    // In production, this would save to API
    setEditingId(null);
    setEditData({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

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
          Finance
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          Payroll Management
        </h1>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
            <Users size={18} className="text-[#d4af37]" />
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-gray-900">
              {activeEmployees.length}
            </p>
            <p className="text-xs text-gray-500">Active Employees</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
            <Wallet size={18} className="text-[#d4af37]" />
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-gray-900">
              ₹{(totalPayroll / 100000).toFixed(2)}L
            </p>
            <p className="text-xs text-gray-500">Total Monthly Payroll</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <TrendingUp size={18} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-gray-900">
              ₹{Math.round(totalPayroll / activeEmployees.length / 1000)}K
            </p>
            <p className="text-xs text-gray-500">Average Net Salary</p>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="mb-6"
      >
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search employee…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition bg-white"
          />
        </div>
      </motion.div>

      {/* Salary Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {filtered.map((emp) => (
          <motion.div
            key={emp.id}
            variants={item}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0B0E14] flex items-center justify-center text-[#d4af37] font-bold text-sm">
                  {emp.firstName[0]}
                  {emp.lastName[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {emp.firstName} {emp.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {emp.id} · {emp.department}
                  </p>
                </div>
              </div>
              {editingId === emp.id ? (
                <div className="flex gap-1">
                  <button
                    onClick={saveEdit}
                    className="p-1.5 rounded-lg bg-emerald-500 text-white hover:brightness-110 transition"
                    title="Save"
                  >
                    <Save size={14} />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-1.5 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition"
                    title="Cancel"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEdit(emp)}
                  className="inline-flex items-center gap-1 text-[#d4af37] text-xs font-semibold hover:underline"
                >
                  <Edit3 size={14} />
                  Edit Salary
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              <SalaryRow
                label="Basic"
                value={emp.salary.basic}
                editing={editingId === emp.id}
                field="basic"
                editData={editData}
                setEditData={setEditData}
              />
              <SalaryRow
                label="HRA"
                value={emp.salary.hra}
                editing={editingId === emp.id}
                field="hra"
                editData={editData}
                setEditData={setEditData}
              />
              <SalaryRow
                label="Allowances"
                value={emp.salary.allowances}
                editing={editingId === emp.id}
                field="allowances"
                editData={editData}
                setEditData={setEditData}
              />
              <SalaryRow
                label="Deductions"
                value={emp.salary.deductions}
                editing={editingId === emp.id}
                field="deductions"
                editData={editData}
                setEditData={setEditData}
                negative
              />
              <div className="pt-2.5 mt-2.5 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Net Salary</span>
                <span className="text-lg font-bold tabular-nums text-[#d4af37]">
                  ₹
                  {(
                    editingId === emp.id
                      ? (editData.basic || 0) +
                        (editData.hra || 0) +
                        (editData.allowances || 0) -
                        (editData.deductions || 0)
                      : emp.salary.netSalary
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function SalaryRow({ label, value, editing, field, editData, setEditData, negative }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-600">{label}</span>
      {editing ? (
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            ₹
          </span>
          <input
            type="number"
            value={editData[field] || 0}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                [field]: Number(e.target.value),
              }))
            }
            className="w-28 pl-5 pr-2 py-1.5 rounded-lg border border-gray-200 text-sm text-right text-gray-900 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition tabular-nums"
          />
        </div>
      ) : (
        <span className={`tabular-nums font-medium ${negative ? 'text-rose-500' : 'text-gray-900'}`}>
          {negative ? '-' : ''}₹{value.toLocaleString()}
        </span>
      )}
    </div>
  );
}
