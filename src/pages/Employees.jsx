import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, ArrowUpDown } from 'lucide-react';
import { employees, departments } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const row = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Employees() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [status, setStatus] = useState('All');

  const filtered = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        search === '' ||
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        emp.id.toLowerCase().includes(search.toLowerCase());
      const matchesDept = department === 'All' || emp.department === department;
      const matchesStatus = status === 'All' || emp.status === status;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [search, department, status]);

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
          People
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          Employee Management
        </h1>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition"
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ArrowUpDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
            <ArrowUpDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Employee Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Employee ID
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Name
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase hidden md:table-cell">
                  Department
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase hidden lg:table-cell">
                  Designation
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <motion.tbody variants={container} initial="hidden" animate="show">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Users size={36} className="opacity-60 text-[#d4af37]" />
                      <p className="text-sm">No employees found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <motion.tr
                    key={emp.id}
                    variants={row}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/employees/${emp.id}`)}
                  >
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500">
                      {emp.id}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0B0E14] flex items-center justify-center text-[#d4af37] font-bold text-xs">
                          {emp.firstName[0]}{emp.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-xs text-gray-500 md:hidden">
                            {emp.department}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 hidden md:table-cell">
                      {emp.department}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 hidden lg:table-cell">
                      {emp.designation}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={emp.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/employees/${emp.id}`);
                        }}
                        className="inline-flex items-center gap-1 text-[#d4af37] text-xs font-semibold hover:underline"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-500">
            Showing {filtered.length} of {employees.length} employees
          </div>
        )}
      </motion.div>
    </div>
  );
}
