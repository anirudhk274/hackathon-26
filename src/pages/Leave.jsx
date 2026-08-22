import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Heart,
  Clock,
  Send
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import StatusBadge from '../components/StatusBadge';
import Card from '../components/Card';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { getLeaves, createLeave } from '../lib/api';

export default function Leave() {
  const { user: authUser } = useAuth();
  const [localRequests, setLocalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'PAID',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // Fetch leaves from API
  useEffect(() => {
    async function fetchLeaves() {
      try {
        const data = await getLeaves();
        // Transform API data to match expected format
        const formatted = data.map(leave => ({
          id: leave.id,
          type: leave.type,
          fromDate: leave.startDate ? new Date(leave.startDate).toISOString().split('T')[0] : '',
          toDate: leave.endDate ? new Date(leave.endDate).toISOString().split('T')[0] : '',
          days: leave.startDate && leave.endDate
            ? Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / 86400000) + 1
            : 1,
          remarks: leave.reason,
          status: leave.status.charAt(0) + leave.status.slice(1).toLowerCase(),
          hrRemarks: leave.adminComments,
          appliedOn: leave.createdAt ? new Date(leave.createdAt).toISOString().split('T')[0] : '',
        }));
        setLocalRequests(formatted);
      } catch (err) {
        console.error('Failed to fetch leaves:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaves();
  }, []);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculatedDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }, [formData.startDate, formData.endDate]);

  const isFormValid = formData.startDate && formData.endDate && calculatedDays > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || !authUser?.id) return;

    setSubmitting(true);
    try {
      await createLeave({
        userId: authUser.id,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
      });
      // Refresh leaves
      const data = await getLeaves();
      const formatted = data.map(leave => ({
        id: leave.id,
        type: leave.type,
        fromDate: leave.startDate ? new Date(leave.startDate).toISOString().split('T')[0] : '',
        toDate: leave.endDate ? new Date(leave.endDate).toISOString().split('T')[0] : '',
        days: leave.startDate && leave.endDate
          ? Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / 86400000) + 1
          : 1,
        remarks: leave.reason,
        status: leave.status.charAt(0) + leave.status.slice(1).toLowerCase(),
        hrRemarks: leave.adminComments,
        appliedOn: leave.createdAt ? new Date(leave.createdAt).toISOString().split('T')[0] : '',
      }));
      setLocalRequests(formatted);
      setFormData({ type: 'PAID', startDate: '', endDate: '', reason: '' });
      setShowApplyForm(false);
    } catch (err) {
      console.error('Failed to submit leave:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Calendar logic
  const currentYear = calendarMonth.getFullYear();
  const currentMonthIdx = calendarMonth.getMonth();
  const daysInMonth = new Date(currentYear, currentMonthIdx + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonthIdx, 1).getDay();
  const prevMonthDays = new Date(currentYear, currentMonthIdx, 0).getDate();
  const nextMonth = () => setCalendarMonth(new Date(currentYear, currentMonthIdx + 1, 1));
  const prevMonth = () => setCalendarMonth(new Date(currentYear, currentMonthIdx - 1, 1));

  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push({ day: prevMonthDays - firstDayOfMonth + i + 1, isCurrentMonth: false, dateStr: null });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dStr = `${currentYear}-${String(currentMonthIdx + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarCells.push({ day: i, isCurrentMonth: true, dateStr: dStr });
  }
  const totalCells = Math.ceil(calendarCells.length / 7) * 7;
  let nextDay = 1;
  while (calendarCells.length < totalCells) {
    calendarCells.push({ day: nextDay++, isCurrentMonth: false, dateStr: null });
  }

  const todayStr = new Date().toISOString().split('T')[0];

  const sortedRequests = [...localRequests].sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn));

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
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Leave Management
          </h1>
          <Button onClick={() => setShowApplyForm(true)} icon={<Plus className="w-5 h-5" />}>
            Apply Leave
          </Button>
        </div>

        {/* Apply Leave Form */}
        <AnimatePresence>
          {showApplyForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
                    Apply for Leave
                  </h2>
                  <button 
                    onClick={() => setShowApplyForm(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Leave Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Leave Type
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {['PAID', 'SICK', 'UNPAID'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleFormChange('type', type)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors border ${
                            formData.type === type
                              ? 'bg-[#d4af37] text-[#0B0E14] border-[#d4af37]'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {type === 'PAID' && <CalendarDays className="w-4 h-4" />}
                          {type === 'SICK' && <Heart className="w-4 h-4" />}
                          {type === 'UNPAID' && <Clock className="w-4 h-4" />}
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                        From
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        required
                        value={formData.startDate}
                        onChange={(e) => handleFormChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#d4af37] focus:border-[#d4af37] bg-white text-gray-900 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                        To
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        required
                        min={formData.startDate}
                        value={formData.endDate}
                        onChange={(e) => handleFormChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#d4af37] focus:border-[#d4af37] bg-white text-gray-900 sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Calculations */}
                  {formData.startDate && formData.endDate && (
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                        {calculatedDays > 0 ? `${calculatedDays} day(s)` : 'Invalid date range'}
                      </div>
                    </div>
                  )}

                  {/* Remarks */}
                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                      Remarks
                    </label>
                    <textarea
                      id="reason"
                      rows={3}
                      placeholder="Reason for leave (optional)"
                      value={formData.reason}
                      onChange={(e) => handleFormChange('reason', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#d4af37] focus:border-[#d4af37] bg-white text-gray-900 sm:text-sm"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 justify-end pt-2">
                    <Button variant="secondary" onClick={() => setShowApplyForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!isFormValid || submitting} icon={<Send className="w-5 h-5" />}>
                      {submitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leave Requests Table */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 mb-4">
            Leave Requests
          </h2>
          
          {sortedRequests.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No leave requests yet"
              description="When you apply for leave, your requests will appear here."
            />
          ) : (
            <Card className="overflow-hidden p-0 sm:p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Days</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Remarks</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {req.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {req.fromDate} <span className="text-gray-400 mx-1">to</span> {req.toDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 tabular-nums">
                          {req.days}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">
                          {req.remarks || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col items-start gap-1">
                            <StatusBadge status={req.status} />
                            {req.status === 'Rejected' && req.hrRemarks && (
                              <span className="text-xs text-rose-500 italic">
                                {req.hrRemarks}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        {/* Leave Calendar */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 mb-4">
            Leave Calendar
          </h2>
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={prevMonth}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-semibold text-gray-400 uppercase py-2">
                  {day}
                </div>
              ))}
              
              {calendarCells.map((cell, idx) => {
                const isWeekend = idx % 7 === 0 || idx % 7 === 6;
                const isToday = cell.dateStr === todayStr;

                return (
                  <div 
                    key={idx} 
                    className={`aspect-square w-full flex flex-col items-center justify-center p-1 sm:p-2 text-sm sm:text-base transition-colors
                      ${!cell.isCurrentMonth ? 'text-gray-300' : ''}
                      ${cell.isCurrentMonth && isWeekend ? 'bg-gray-50 text-gray-500' : 'text-gray-700'}
                      ${isToday ? 'ring-2 ring-gray-300 rounded-lg font-bold' : ''}
                    `}
                  >
                    {cell.day}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#d4af37]/20 rounded"></div>
                <span className="text-gray-600">Approved Leave</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 ring-2 ring-amber-400 rounded"></div>
                <span className="text-gray-600">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 ring-2 ring-gray-300 rounded"></div>
                <span className="text-gray-600">Today</span>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </PageTransition>
  );
}
