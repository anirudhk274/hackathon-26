import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, ChevronDown, Download, Printer, X, 
  TrendingUp, TrendingDown, IndianRupee, FileText, 
  Calendar, ChevronRight 
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Card from '../components/Card';
import Button from '../components/Button';
import { payslips, currentPayslip } from '../data/payroll';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatKeyName = (key) => {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const calculateTotal = (items) => {
  if (!items) return 0;
  return Object.values(items).reduce((acc, curr) => acc + curr, 0);
};

export default function Payroll() {
  const [selectedMonth, setSelectedMonth] = useState(currentPayslip?.monthKey || payslips?.[0]?.monthKey);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState(null);

  const activePayslip = useMemo(() => {
    return payslips?.find((p) => p.monthKey === selectedMonth) || payslips?.[0];
  }, [selectedMonth]);

  const totalEarnings = useMemo(() => calculateTotal(activePayslip?.earnings), [activePayslip]);
  const totalDeductions = useMemo(() => calculateTotal(activePayslip?.deductions), [activePayslip]);
  const netSalary = totalEarnings - totalDeductions;

  const toggleHistory = (monthKey) => {
    if (expandedHistory === monthKey) {
      setExpandedHistory(null);
    } else {
      setExpandedHistory(monthKey);
    }
  };

  if (!activePayslip) {
    return (
      <PageTransition>
        <div className="flex h-full items-center justify-center text-gray-500">
          No payroll data available.
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8 pb-12">
        {/* 1. Header */}
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
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg pl-9 pr-10 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent w-full shadow-sm cursor-pointer"
            >
              {payslips.map((slip) => (
                <option key={slip.monthKey} value={slip.monthKey}>
                  {slip.month}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </header>

        {/* 2. Net Salary Hero Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-[#0B0E14] to-[#162032] rounded-2xl p-6 md:p-8 shadow-lg text-white border border-gray-800 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-xs text-[#d4af37] uppercase tracking-widest font-semibold mb-2">
                Net Salary
              </p>
              <div className="text-5xl md:text-6xl font-bold text-[#d4af37] tabular-nums tracking-tight">
                {formatCurrency(netSalary)}
              </div>
              <p className="text-gray-400 mt-2 font-medium">{activePayslip.month}</p>
            </div>

            <div className="flex gap-4 md:gap-8 bg-[#0B0E14]/50 p-4 rounded-xl border border-gray-800/50 backdrop-blur-sm self-start">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Earnings</span>
                </div>
                <div className="text-xl font-semibold tabular-nums">{formatCurrency(totalEarnings)}</div>
              </div>
              <div className="w-px bg-gray-800" />
              <div>
                <div className="flex items-center gap-1.5 text-rose-400 mb-1">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Deductions</span>
                </div>
                <div className="text-xl font-semibold tabular-nums">{formatCurrency(totalDeductions)}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => setShowSlipModal(true)}
            className="flex items-center gap-2 border-[#d4af37] text-[#0B0E14] hover:bg-[#d4af37] hover:text-[#0B0E14] transition-colors"
          >
            <FileText className="h-4 w-4" />
            View Salary Slip
          </Button>
        </div>

        {/* 3. Salary Breakdown */}
        <Card className="p-0 overflow-hidden border-gray-200 shadow-sm">
          <div className="p-6 md:p-8 border-b border-gray-100 bg-white">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
              Salary Breakdown
            </h2>
          </div>
          
          <div className="p-6 md:p-8 bg-gray-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              
              {/* Earnings Column */}
              <div>
                <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-2">
                  <div className="bg-emerald-100 p-1.5 rounded-md">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Earnings</h3>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(activePayslip.earnings || {}).map(([key, amount]) => (
                    <div key={key} className="flex justify-between items-center py-1 pl-3 border-l-2 border-emerald-200">
                      <span className="text-sm text-gray-600">{formatKeyName(key)}</span>
                      <span className="text-sm font-medium text-gray-900 tabular-nums">{formatCurrency(amount)}</span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-200">
                    <span className="text-sm font-bold text-gray-900">Total Earnings</span>
                    <span className="text-sm font-bold text-gray-900 tabular-nums">{formatCurrency(totalEarnings)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions Column */}
              <div>
                <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-2">
                  <div className="bg-rose-100 p-1.5 rounded-md">
                    <TrendingDown className="h-4 w-4 text-rose-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Deductions</h3>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(activePayslip.deductions || {}).map(([key, amount]) => (
                    <div key={key} className="flex justify-between items-center py-1 pl-3 border-l-2 border-rose-200">
                      <span className="text-sm text-gray-600">{formatKeyName(key)}</span>
                      <span className="text-sm font-medium text-gray-900 tabular-nums">{formatCurrency(amount)}</span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-200">
                    <span className="text-sm font-bold text-gray-900">Total Deductions</span>
                    <span className="text-sm font-bold text-gray-900 tabular-nums">{formatCurrency(totalDeductions)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary Total Row */}
            <div className="mt-8 bg-white border border-gray-200 rounded-xl p-5 flex justify-between items-center shadow-sm">
              <span className="text-lg font-bold text-gray-900">Net Salary</span>
              <span className="text-2xl font-bold text-[#d4af37] tabular-nums">{formatCurrency(netSalary)}</span>
            </div>
          </div>
        </Card>

        {/* 6. Payment History */}
        <Card className="p-0 overflow-hidden border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100 bg-white">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">Payment History</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {payslips.filter(p => p.monthKey !== activePayslip.monthKey).length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">No past payment history available.</div>
            ) : (
              payslips
                .filter(p => p.monthKey !== activePayslip.monthKey)
                .map((slip) => {
                  const slipEarnings = calculateTotal(slip.earnings);
                  const slipDeductions = calculateTotal(slip.deductions);
                  const slipNet = slipEarnings - slipDeductions;
                  const isExpanded = expandedHistory === slip.monthKey;

                  return (
                    <div key={slip.monthKey} className="bg-white">
                      <button
                        onClick={() => toggleHistory(slip.monthKey)}
                        className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors focus:outline-none"
                      >
                        <span className="text-sm font-medium text-gray-900">{slip.month}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-900 tabular-nums">{formatCurrency(slipNet)}</span>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden bg-gray-50/50"
                          >
                            <div className="p-4 border-t border-gray-100">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Earnings</div>
                                  <div className="space-y-1.5">
                                    {Object.entries(slip.earnings || {}).map(([key, amount]) => (
                                      <div key={key} className="flex justify-between text-xs">
                                        <span className="text-gray-600">{formatKeyName(key)}</span>
                                        <span className="font-medium text-gray-900 tabular-nums">{formatCurrency(amount)}</span>
                                      </div>
                                    ))}
                                    <div className="flex justify-between text-xs font-bold pt-1.5 border-t border-gray-200 mt-1.5">
                                      <span>Total</span>
                                      <span>{formatCurrency(slipEarnings)}</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Deductions</div>
                                  <div className="space-y-1.5">
                                    {Object.entries(slip.deductions || {}).map(([key, amount]) => (
                                      <div key={key} className="flex justify-between text-xs">
                                        <span className="text-gray-600">{formatKeyName(key)}</span>
                                        <span className="font-medium text-gray-900 tabular-nums">{formatCurrency(amount)}</span>
                                      </div>
                                    ))}
                                    <div className="flex justify-between text-xs font-bold pt-1.5 border-t border-gray-200 mt-1.5">
                                      <span>Total</span>
                                      <span>{formatCurrency(slipDeductions)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
            )}
          </div>
        </Card>
      </div>

      {/* 5. Salary Slip Modal */}
      <AnimatePresence>
        {showSlipModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowSlipModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col pointer-events-auto"
              >
                <div className="p-6 md:p-8 flex-1">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Salary Slip &mdash; {activePayslip.month}</h2>
                    <button 
                      onClick={() => setShowSlipModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Close modal"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Printable Area */}
                  <div className="border border-gray-200 rounded-lg p-6 sm:p-8 bg-white relative">
                    <div className="text-center mb-6">
                      <div className="text-xs tracking-[0.3em] font-bold text-gray-400 mb-4">NORTHLINE COMMERCIAL</div>
                      <div className="h-px w-16 bg-[#d4af37] mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-gray-900 uppercase">Payslip for {activePayslip.month}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div>
                        <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Employee Name</span>
                        <span className="font-semibold text-gray-900">John Doe</span> {/* TODO: Replace with actual employee context */}
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Employee ID</span>
                        <span className="font-semibold text-gray-900">NC-1042</span> {/* TODO: Replace with actual employee context */}
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Department</span>
                        <span className="font-semibold text-gray-900">Engineering</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Designation</span>
                        <span className="font-semibold text-gray-900">Senior Developer</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                      {/* Compact Earnings Table */}
                      <div>
                        <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3 text-sm">Earnings</h4>
                        <table className="w-full text-sm">
                          <tbody>
                            {Object.entries(activePayslip.earnings || {}).map(([key, amount]) => (
                              <tr key={key}>
                                <td className="py-1.5 text-gray-600">{formatKeyName(key)}</td>
                                <td className="py-1.5 text-right font-medium tabular-nums text-gray-900">{formatCurrency(amount)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td className="py-2 border-t border-gray-200 font-bold text-gray-900">Total</td>
                              <td className="py-2 border-t border-gray-200 text-right font-bold tabular-nums text-gray-900">{formatCurrency(totalEarnings)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {/* Compact Deductions Table */}
                      <div>
                        <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3 text-sm">Deductions</h4>
                        <table className="w-full text-sm">
                          <tbody>
                            {Object.entries(activePayslip.deductions || {}).map(([key, amount]) => (
                              <tr key={key}>
                                <td className="py-1.5 text-gray-600">{formatKeyName(key)}</td>
                                <td className="py-1.5 text-right font-medium tabular-nums text-gray-900">{formatCurrency(amount)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td className="py-2 border-t border-gray-200 font-bold text-gray-900">Total</td>
                              <td className="py-2 border-t border-gray-200 text-right font-bold tabular-nums text-gray-900">{formatCurrency(totalDeductions)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-4 border-y-2 border-gray-800">
                      <span className="text-base font-bold text-gray-900 uppercase">Net Pay</span>
                      <span className="text-xl font-bold text-gray-900 tabular-nums">{formatCurrency(netSalary)}</span>
                    </div>
                    
                    <div className="mt-8 text-center text-xs text-gray-400">
                      This is a computer generated document. No signature is required.
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex flex-col-reverse sm:flex-row justify-end gap-3">
                  <Button 
                    variant="ghost" 
                    onClick={() => window.print()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>
                  <Button 
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#d4af37] hover:bg-[#d4af37]/90 text-[#0B0E14] font-semibold"
                    onClick={() => {
                      // TODO: Implement actual PDF download logic
                      alert('PDF download will be implemented by backend.');
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
