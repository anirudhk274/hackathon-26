import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, ChevronDown, Download, Printer, 
  TrendingUp, TrendingDown, IndianRupee, FileText, 
  Calendar, ChevronRight 
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { getPayroll } from '../lib/api';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function Payroll() {
  const { user: authUser } = useAuth();
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    async function fetchPayroll() {
      try {
        const data = await getPayroll();
        setPayroll(data);
        if (data.length > 0) {
          setSelectedMonth(data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch payroll:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPayroll();
  }, []);

  const activePayslip = useMemo(() => {
    return payroll.find(p => p.id === selectedMonth) || payroll[0];
  }, [selectedMonth, payroll]);

  if (loading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full" />
        </div>
      </PageTransition>
    );
  }

  if (!activePayslip) {
    return (
      <PageTransition>
        <div className="flex h-full items-center justify-center text-gray-500">
          No payroll data available.
        </div>
      </PageTransition>
    );
  }

  const netSalary = activePayslip.netSalary;
  const grossSalary = activePayslip.baseSalary + activePayslip.allowances;
  const totalDeductions = activePayslip.deductions;

  return (
    <PageTransition>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Payroll
            </h1>
            <p className="text-gray-600 mt-1">View your salary details and history.</p>
          </div>
          
          <div className="relative inline-block w-full sm:w-auto">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={selectedMonth || ''}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg pl-9 pr-10 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent w-full shadow-sm cursor-pointer"
            >
              {payroll.map((slip) => (
                <option key={slip.id} value={slip.id}>
                  {new Date(slip.paymentDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Net Salary Hero Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-[#0B0E14] to-[#162032] rounded-2xl p-6 md:p-8 shadow-lg text-white border border-gray-800 relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-[#d4af37]" />
              </div>
              <span className="text-sm font-medium text-gray-400">
                {new Date(activePayslip.paymentDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            
            <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-1">Net Salary</p>
            <p className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{formatCurrency(netSalary)}</p>
            
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Gross</p>
                <p className="text-lg font-semibold text-emerald-400">{formatCurrency(grossSalary)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Deductions</p>
                <p className="text-lg font-semibold text-rose-400">-{formatCurrency(totalDeductions)}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Salary Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Earnings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Card>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg font-bold text-gray-900">Earnings</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-600">Basic Salary</span>
                  <span className="text-sm font-semibold tabular-nums text-gray-900">{formatCurrency(activePayslip.baseSalary)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-600">Allowances</span>
                  <span className="text-sm font-semibold tabular-nums text-gray-900">{formatCurrency(activePayslip.allowances)}</span>
                </div>
                <div className="flex justify-between items-center py-2 pt-4">
                  <span className="text-sm font-bold text-gray-900">Total Earnings</span>
                  <span className="text-lg font-bold tabular-nums text-emerald-500">{formatCurrency(grossSalary)}</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Deductions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Card>
              <div className="flex items-center gap-2 mb-6">
                <TrendingDown className="w-5 h-5 text-rose-500" />
                <h3 className="text-lg font-bold text-gray-900">Deductions</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-600">Total Deductions</span>
                  <span className="text-sm font-semibold tabular-nums text-rose-500">-{formatCurrency(totalDeductions)}</span>
                </div>
                <div className="flex justify-between items-center py-2 pt-4">
                  <span className="text-sm font-bold text-gray-900">Net Deductions</span>
                  <span className="text-lg font-bold tabular-nums text-rose-500">-{formatCurrency(totalDeductions)}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Payment History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Card className="overflow-hidden p-0">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Payment History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Base</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Allowances</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deductions</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {payroll.map((slip) => (
                    <tr 
                      key={slip.id} 
                      className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer ${slip.id === selectedMonth ? 'bg-[#d4af37]/5' : ''}`}
                      onClick={() => setSelectedMonth(slip.id)}
                    >
                      <td className="px-6 py-3.5 font-medium text-gray-900">
                        {new Date(slip.paymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-3.5 tabular-nums text-gray-600">{formatCurrency(slip.baseSalary)}</td>
                      <td className="px-6 py-3.5 tabular-nums text-gray-600">{formatCurrency(slip.allowances)}</td>
                      <td className="px-6 py-3.5 tabular-nums text-rose-500">-{formatCurrency(slip.deductions)}</td>
                      <td className="px-6 py-3.5 tabular-nums font-semibold text-gray-900">{formatCurrency(slip.netSalary)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
