import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet, Search, TrendingUp, Users,
} from 'lucide-react';
import { getPayroll } from '../lib/api';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function AdminPayroll() {
  const [search, setSearch] = useState('');
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayroll() {
      try {
        const data = await getPayroll();
        setPayroll(data);
      } catch (err) {
        console.error('Failed to fetch payroll:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPayroll();
  }, []);

  const activeEmployees = payroll.filter(p => p.user);
  const totalPayroll = activeEmployees.reduce((sum, p) => sum + p.netSalary, 0);

  const filtered = activeEmployees.filter((record) => {
    const userName = record.user?.name || '';
    const empId = record.user?.employeeId || '';
    return search === '' || userName.toLowerCase().includes(search.toLowerCase()) || empId.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#d4af37] mb-1">Finance</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Payroll Management</h1>
      </motion.div>

      {/* Summary Cards */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center"><Users size={18} className="text-[#d4af37]" /></div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-gray-900">{activeEmployees.length}</p>
            <p className="text-xs text-gray-500">Employees with Payroll</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center"><Wallet size={18} className="text-[#d4af37]" /></div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-gray-900">₹{(totalPayroll / 100000).toFixed(2)}L</p>
            <p className="text-xs text-gray-500">Total Monthly Payroll</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><TrendingUp size={18} className="text-emerald-500" /></div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-gray-900">₹{activeEmployees.length > 0 ? Math.round(totalPayroll / activeEmployees.length / 1000) : 0}K</p>
            <p className="text-xs text-gray-500">Average Net Salary</p>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }} className="mb-6">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search employee…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition bg-white" />
        </div>
      </motion.div>

      {/* Salary Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((record) => (
          <motion.div key={record.id} variants={item} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#0B0E14] flex items-center justify-center text-[#d4af37] font-bold text-sm">
                {record.user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '??'}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{record.user?.name || 'Unknown'}</p>
                <p className="text-xs text-gray-500">{record.user?.employeeId} · {record.user?.department}</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Base Salary</span>
                <span className="tabular-nums font-medium text-gray-900">₹{record.baseSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Allowances</span>
                <span className="tabular-nums font-medium text-gray-900">₹{record.allowances.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Deductions</span>
                <span className="tabular-nums font-medium text-rose-500">-₹{record.deductions.toLocaleString()}</span>
              </div>
              <div className="pt-2.5 mt-2.5 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Net Salary</span>
                <span className="text-lg font-bold tabular-nums text-[#d4af37]">₹{record.netSalary.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
