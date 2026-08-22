import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, LogIn, LogOut, Calendar, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import StatusBadge from '../components/StatusBadge';
import Card from '../components/Card';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { getAttendance, checkIn as apiCheckIn, checkOut as apiCheckOut } from '../lib/api';

export default function Attendance() {
  const { user: authUser } = useAuth();
  const [viewMode, setViewMode] = useState('daily');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  // Fetch attendance from API
  useEffect(() => {
    async function fetchAttendance() {
      try {
        const data = await getAttendance();
        // Transform API data to match expected format
        const formatted = data.map(record => ({
          date: record.date ? new Date(record.date).toISOString().split('T')[0] : '',
          checkIn: record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
          checkOut: record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
          hoursWorked: record.checkIn && record.checkOut
            ? ((new Date(record.checkOut) - new Date(record.checkIn)) / 3600000).toFixed(1)
            : null,
          status: record.status,
          employeeName: record.user?.name || 'Unknown',
          employeeId: record.user?.employeeId || '',
        }));
        setRecords(formatted);
      } catch (err) {
        console.error('Failed to fetch attendance:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAttendance();
  }, []);

  // Today's status derived from records
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = records.find(r => r.date === todayStr);
  const isCheckedIn = todayRecord && !todayRecord.checkOut;
  const checkInTime = todayRecord?.checkIn || '';
  const checkOutTime = todayRecord?.checkOut || null;

  const handleCheckIn = async () => {
    if (!authUser?.id) return;
    setActionLoading(true);
    try {
      await apiCheckIn(authUser.id);
      // Refresh records
      const data = await getAttendance();
      const formatted = data.map(record => ({
        date: record.date ? new Date(record.date).toISOString().split('T')[0] : '',
        checkIn: record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
        checkOut: record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
        hoursWorked: record.checkIn && record.checkOut
          ? ((new Date(record.checkOut) - new Date(record.checkIn)) / 3600000).toFixed(1)
          : null,
        status: record.status,
        employeeName: record.user?.name || 'Unknown',
        employeeId: record.user?.employeeId || '',
      }));
      setRecords(formatted);
    } catch (err) {
      console.error('Check-in failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!authUser?.id) return;
    setActionLoading(true);
    try {
      await apiCheckOut(authUser.id);
      // Refresh records
      const data = await getAttendance();
      const formatted = data.map(record => ({
        date: record.date ? new Date(record.date).toISOString().split('T')[0] : '',
        checkIn: record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
        checkOut: record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
        hoursWorked: record.checkIn && record.checkOut
          ? ((new Date(record.checkOut) - new Date(record.checkIn)) / 3600000).toFixed(1)
          : null,
        status: record.status,
        employeeName: record.user?.name || 'Unknown',
        employeeId: record.user?.employeeId || '',
      }));
      setRecords(formatted);
    } catch (err) {
      console.error('Check-out failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      if (!record.status) return false; 
      const matchStatus = filterStatus === 'all' || record.status.toLowerCase() === filterStatus.toLowerCase();
      const matchMonth = filterMonth === 'all' || (record.date && record.date.startsWith(filterMonth));
      return matchStatus && matchMonth;
    });
  }, [records, filterStatus, filterMonth]);

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const weeklyData = records.slice(-7).map(record => ({
    name: record.date ? new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' }) : '',
    hours: record.hoursWorked ? parseFloat(record.hoursWorked) : 0,
    status: record.status,
    date: record.date
  }));

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'present': return '#10b981';
      case 'absent': return '#f43f5e';
      case 'half-day': return '#f59e0b';
      case 'leave': return '#d4af37';
      default: return '#9ca3af';
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
                  <StatusBadge status={isCheckedIn ? 'Present' : 'Absent'} />
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
              <Button onClick={handleCheckIn} disabled={actionLoading} className="relative bg-[#d4af37] text-[#0B0E14] font-semibold hover:brightness-110 px-8 py-4 text-lg">
                {actionLoading ? (
                  <div className="animate-spin w-5 h-5 border-2 border-[#0B0E14] border-t-transparent rounded-full mr-2" />
                ) : (
                  <LogIn className="w-5 h-5 mr-2" />
                )}
                Check In
              </Button>
            </div>
          ) : !checkOutTime ? (
            <div className="relative group">
              <div className="absolute -inset-1 bg-[#d4af37]/30 rounded-xl animate-pulse blur-md"></div>
              <Button variant="secondary" onClick={handleCheckOut} disabled={actionLoading} className="relative border-[#d4af37] text-[#d4af37] bg-transparent hover:bg-[#d4af37] hover:text-[#0B0E14] font-semibold px-8 py-4 text-lg">
                {actionLoading ? (
                  <div className="animate-spin w-5 h-5 border-2 border-[#d4af37] border-t-transparent rounded-full mr-2" />
                ) : (
                  <LogOut className="w-5 h-5 mr-2" />
                )}
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
                          animate={{ width: checkOutTime ? '100%' : '50%' }}
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
                      {checkOutTime ? '8.0' : (isCheckedIn ? '4.5' : '0.0')}
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
                  <option value="2026-08">August 2026</option>
                  <option value="2026-07">July 2026</option>
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
                  <option value="half_day">Half-day</option>
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
                        key={record.date + index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50/50 transition-colors even:bg-gray-50/30"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.checkIn || '--:--'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.checkOut || '--:--'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 tabular-nums font-medium">{record.hoursWorked || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={record.status} />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <span className="text-sm text-gray-600 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
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
