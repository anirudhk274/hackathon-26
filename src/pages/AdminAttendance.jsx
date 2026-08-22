import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, ArrowUpDown, Clock, CalendarCheck } from 'lucide-react';
import { getAttendance } from '../lib/api';
import StatusBadge from '../components/StatusBadge';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const row = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function AdminAttendance() {
  const [search, setSearch] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('All');
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttendance() {
      try {
        const data = await getAttendance();
        setAttendance(data);
      } catch (err) {
        console.error('Failed to fetch attendance:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAttendance();
  }, []);

  const filtered = useMemo(() => {
    return attendance.filter((rec) => {
      const recDate = rec.date ? new Date(rec.date).toISOString().split('T')[0] : '';
      const matchesSearch = search === '' || (rec.user?.name || '').toLowerCase().includes(search.toLowerCase()) || (rec.user?.employeeId || '').toLowerCase().includes(search.toLowerCase());
      const matchesDate = recDate === date;
      const recStatus = rec.status === 'PRESENT' ? 'Present' : rec.status === 'ABSENT' ? 'Absent' : rec.status === 'HALF_DAY' ? 'Half-day' : rec.status;
      const matchesStatus = status === 'All' || recStatus === status;
      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [attendance, search, date, status]);

  const presentCount = filtered.filter(r => r.status === 'PRESENT').length;
  const absentCount = filtered.filter(r => r.status === 'ABSENT').length;
  const halfDayCount = filtered.filter(r => r.status === 'HALF_DAY').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#d4af37] mb-1">Tracking</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Attendance Management</h1>
      </motion.div>

      {/* Summary Cards */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><CalendarCheck size={18} className="text-emerald-500" /></div>
          <div><p className="text-2xl font-bold tabular-nums text-gray-900">{presentCount}</p><p className="text-xs text-gray-500">Present</p></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center"><Clock size={18} className="text-rose-500" /></div>
          <div><p className="text-2xl font-bold tabular-nums text-gray-900">{absentCount}</p><p className="text-xs text-gray-500">Absent</p></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center"><Clock size={18} className="text-amber-500" /></div>
          <div><p className="text-2xl font-bold tabular-nums text-gray-900">{halfDayCount}</p><p className="text-xs text-gray-500">Half-day</p></div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search employee…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition" />
          </div>
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition" />
          </div>
          <div className="relative">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="appearance-none pl-4 pr-8 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition">
              <option value="All">All Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Half-day">Half-day</option>
            </select>
            <ArrowUpDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Attendance Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">Employee</th>
                <th className="text-left px-5 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase hidden sm:table-cell">Check-in</th>
                <th className="text-left px-5 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase hidden sm:table-cell">Check-out</th>
                <th className="text-left px-5 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <motion.tbody variants={container} initial="hidden" animate="show">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <CalendarCheck size={36} className="opacity-60 text-[#d4af37]" />
                      <p className="text-sm">No attendance records found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((rec) => {
                  const recDate = rec.date ? new Date(rec.date).toISOString().split('T')[0] : '';
                  const recStatus = rec.status === 'PRESENT' ? 'Present' : rec.status === 'ABSENT' ? 'Absent' : rec.status === 'HALF_DAY' ? 'Half-day' : rec.status;
                  return (
                    <motion.tr key={rec.id} variants={row} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0B0E14] flex items-center justify-center text-[#d4af37] font-bold text-xs">
                            {rec.user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '??'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{rec.user?.name || 'Unknown'}</p>
                            <p className="text-xs text-gray-500 sm:hidden">{rec.user?.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">{recDate}</td>
                      <td className="px-5 py-3.5 text-gray-600 hidden sm:table-cell">{rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                      <td className="px-5 py-3.5 text-gray-600 hidden sm:table-cell">{rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={recStatus} /></td>
                    </motion.tr>
                  );
                })
              )}
            </motion.tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-500">
            Showing {filtered.length} records for {date}
          </div>
        )}
      </motion.div>
    </div>
  );
}
