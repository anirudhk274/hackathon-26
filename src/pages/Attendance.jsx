import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, LogIn, LogOut, Calendar, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import StatusBadge from '../components/StatusBadge';
import Card from '../components/Card';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { attendanceRecords, todayStatus, monthlyStats } from '../data/attendance';

export default function Attendance() {
  const [viewMode, setViewMode] = useState('daily');
  const [isCheckedIn, setIsCheckedIn] = useState(todayStatus?.isCheckedIn || false);
  const [isCheckedOut, setIsCheckedOut] = useState(todayStatus?.isCheckedOut || false);
  const [checkInTime, setCheckInTime] = useState(todayStatus?.checkIn || '');
  const [checkOutTime, setCheckOutTime] = useState(todayStatus?.checkOut || null);
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  const handleCheckIn = () => {
    // TODO: enforce server-side check-in validation
    setIsCheckedIn(true);
    const now = new Date();
    setCheckInTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleCheckOut = () => {
    // TODO: enforce server-side check-out validation
    setIsCheckedOut(true);
    const now = new Date();
    setCheckOutTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((record) => {
      if (!record.status) return false; 
      const matchStatus = filterStatus === 'all' || record.status.toLowerCase() === filterStatus.toLowerCase();
      const matchMonth = filterMonth === 'all' || (record.date && record.date.startsWith(filterMonth));
      return matchStatus && matchMonth;
    });
  }, [filterStatus, filterMonth]);

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const weeklyData = attendanceRecords.slice(-7).map(record => ({
    name: new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' }),
    hours: record.hoursWorked || 0,
    status: record.status,
    date: record.date
  }));

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'present': return '#10b981'; // emerald-500
      case 'absent': return '#f43f5e'; // rose-500
      case 'half-day': return '#f59e0b'; // amber-500
      case 'leave': return '#d4af37'; // gold
      default: return '#9ca3af'; // gray-400
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-sm rounded-lg">
          <p className="font-semibold text-gray-900">{data.date}</p>
          <p className="text-gray-600 text-sm">Hours: {data.hours}</p>
          <p className="text-sm font-medium mt-1" style={{ color: getStatusColor(data.status) }}>
            {data.status}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-1">Manage your attendance and view history</p>
        </div>

        {/* Today's Status Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card variant="dark" className="bg-[#162032] text-white">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Today's Attendance</h2>
              <p className="text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2 p-4 bg-[#0B0E14]/50 rounded-xl border border-gray-800">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Current Status</span>
                <div>
                  <StatusBadge status={isCheckedOut ? 'Present' : (isCheckedIn ? 'Present' : 'Absent')} />
                </div>
              </div>
              <div className="flex flex-col gap-2 p-4 bg-[#0B0E14]/50 rounded-xl border border-gray-800">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Check-in</span>
                <div className="flex items-center gap-3">
                  <LogIn className="w-6 h-6 text-emerald-400" />
                  <span className="text-2xl font-bold text-white tabular-nums">{checkInTime || '--:--'}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 p-4 bg-[#0B0E14]/50 rounded-xl border border-gray-800">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Check-out</span>
                <div className="flex items-center gap-3">
                  <LogOut className="w-6 h-6 text-rose-400" />
                  <span className="text-2xl font-bold text-white tabular-nums">{checkOutTime || '--:--'}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Check-In / Check-Out Button */}
        <div className="flex justify-center relative py-6">
          {!isCheckedIn ? (
            <div className="relative group">
              <div className="absolute -inset-1 bg-[#d4af37]/30 rounded-xl animate-pulse blur-md"></div>
              <Button onClick={handleCheckIn} className="relative bg-[#d4af37] text-[#0B0E14] font-semibold hover:brightness-110 px-8 py-4 text-lg">
                <LogIn className="w-5 h-5 mr-2" />
                Check In
              </Button>
            </div>
          ) : !isCheckedOut ? (
            <div className="relative group">
              <div className="absolute -inset-1 bg-[#d4af37]/30 rounded-xl animate-pulse blur-md"></div>
              <Button variant="outline" onClick={handleCheckOut} className="relative border-[#d4af37] text-[#d4af37] bg-transparent hover:bg-[#d4af37] hover:text-[#0B0E14] font-semibold px-8 py-4 text-lg">
                <LogOut className="w-5 h-5 mr-2" />
                Check Out
              </Button>
            </div>
          ) : (
            <Button disabled className="bg-gray-200 text-gray-500 font-semibold px-8 py-4 text-lg">
              Attendance Recorded ✓
            </Button>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex justify-center">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'daily' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Daily
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'weekly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Weekly
            </button>
          </div>
        </div>

        {/* View Content */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'daily' ? (
            <Card>
              <div className="p-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Details</h3>
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
                      {isCheckedIn && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: isCheckedOut ? '100%' : '50%' }}
                          transition={{ duration: 1 }}
                          className="h-full bg-[#d4af37]"
                        />
                      )}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium">
                      <span>{checkInTime || 'Check-in'}</span>
                      <span>{checkOutTime || (isCheckedIn ? 'In Progress' : 'Check-out')}</span>
                    </div>
                  </div>
                  <div className="text-center min-w-[120px]">
                    <div className="text-4xl font-bold tabular-nums text-gray-900">
                      {isCheckedOut ? '8.0' : (isCheckedIn ? '4.5' : '0.0')}
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-widest text-[#d4af37] mt-1">Hours</div>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="p-2">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Weekly Overview</h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                      <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
                      <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                        {weeklyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-6">
                  {[
                    { label: 'Present', color: 'bg-emerald-500' },
                    { label: 'Absent', color: 'bg-rose-500' },
                    { label: 'Half-day', color: 'bg-amber-500' },
                    { label: 'Leave', color: 'bg-[#d4af37]' },
                  ].map((legend) => (
                    <div key={legend.label} className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${legend.color}`}></span>
                      <span className="text-xs text-gray-600 font-medium">{legend.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Attendance History Table */}
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-xl font-bold tracking-tight text-gray-900">Attendance History</h3>
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={filterMonth}
                  onChange={(e) => { setFilterMonth(e.target.value); setCurrentPage(1); }}
                  className="appearance-none pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50"
                  aria-label="Filter by month"
                >
                  <option value="all">All Months</option>
                  <option value="2023-10">October 2023</option>
                  <option value="2023-09">September 2023</option>
                </select>
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                  className="appearance-none pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50"
                  aria-label="Filter by status"
                >
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="half-day">Half-day</option>
                  <option value="leave">Leave</option>
                </select>
                <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {paginatedRecords.length > 0 ? (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 border-y border-gray-100 sticky top-0">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check In</th>
                      <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check Out</th>
                      <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hours Worked</th>
                      <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedRecords.map((record, index) => (
                      <motion.tr
                        key={record.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50/50 transition-colors even:bg-gray-50/30"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.checkIn || '--:--'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.checkOut || '--:--'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 tabular-nums font-medium">{record.hoursWorked ? record.hoursWorked.toFixed(1) : '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={record.status} />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden divide-y divide-gray-100">
                {paginatedRecords.map((record, index) => (
                  <motion.div
                    key={record.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{record.date}</span>
                      <StatusBadge status={record.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div><span className="text-gray-400 block text-xs">Check In</span>{record.checkIn || '--:--'}</div>
                      <div><span className="text-gray-400 block text-xs">Check Out</span>{record.checkOut || '--:--'}</div>
                      <div className="col-span-2"><span className="text-gray-400 block text-xs">Hours Worked</span><span className="font-medium text-gray-900">{record.hoursWorked ? record.hoursWorked.toFixed(1) : '-'}</span></div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <span className="text-sm text-gray-600 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-8">
              <EmptyState title="No attendance records found" description="Try adjusting your filters to see more results." icon={Calendar} />
            </div>
          )}
        </Card>
      </div>
    </PageTransition>
  );
}
