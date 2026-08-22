import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  Eye,
  X,
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { leaveRequests } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';

export default function LeaveApproval() {
  const [requests, setRequests] = useState(leaveRequests);
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState('');

  const handleApprove = (id) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: 'Approved', comment: comment || 'Approved by HR.' }
          : r
      )
    );
    setSelected(null);
    setComment('');
  };

  const handleReject = (id) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: 'Rejected', comment: comment || 'Rejected by HR.' }
          : r
      )
    );
    setSelected(null);
    setComment('');
  };

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const approvedCount = requests.filter((r) => r.status === 'Approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'Rejected').length;

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
          Approvals
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          Leave Approval
        </h1>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="grid grid-cols-3 gap-4 mb-6"
      >
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold tabular-nums text-amber-500">{pendingCount}</p>
          <p className="text-xs text-gray-500 mt-1">Pending</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold tabular-nums text-emerald-500">{approvedCount}</p>
          <p className="text-xs text-gray-500 mt-1">Approved</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold tabular-nums text-rose-500">{rejectedCount}</p>
          <p className="text-xs text-gray-500 mt-1">Rejected</p>
        </div>
      </motion.div>

      {/* Table */}
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
                  Employee
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase hidden md:table-cell">
                  Leave Type
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Dates
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr
                  key={req.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0B0E14] flex items-center justify-center text-[#d4af37] font-bold text-xs">
                        {req.employeeName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <p className="font-medium text-gray-900">
                        {req.employeeName}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 hidden md:table-cell">
                    {req.leaveType}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-gray-400" />
                      {req.startDate} — {req.endDate}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => {
                        setSelected(req);
                        setComment(req.comment || '');
                      }}
                      className="inline-flex items-center gap-1 text-[#d4af37] text-xs font-semibold hover:underline"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => {
                setSelected(null);
                setComment('');
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">
                  Leave Request Detail
                </h2>
                <button
                  onClick={() => {
                    setSelected(null);
                    setComment('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#0B0E14] flex items-center justify-center text-[#d4af37] font-bold">
                    {selected.employeeName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {selected.employeeName}
                    </p>
                    <p className="text-xs text-gray-500">{selected.employeeId}</p>
                  </div>
                  <div className="ml-auto">
                    <StatusBadge status={selected.status} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-wide uppercase text-gray-500 mb-1">
                      Leave Type
                    </p>
                    <p className="text-sm text-gray-900">{selected.leaveType}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wide uppercase text-gray-500 mb-1">
                      Request ID
                    </p>
                    <p className="text-sm text-gray-900 font-mono">{selected.id}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-wide uppercase text-gray-500 mb-1">
                    Date Range
                  </p>
                  <p className="text-sm text-gray-900">
                    {selected.startDate} → {selected.endDate}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-wide uppercase text-gray-500 mb-1">
                    Reason
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3">
                    {selected.reason}
                  </p>
                </div>

                {/* Comment Field */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-gray-500 mb-1.5">
                    <MessageSquare size={12} />
                    HR Comment
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment (optional)…"
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer — Action Buttons */}
              {selected.status === 'Pending' && (
                <div className="p-6 border-t border-gray-100 flex gap-3">
                  <button
                    onClick={() => handleReject(selected.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-rose-500 text-rose-500 text-sm font-semibold hover:bg-rose-500 hover:text-white transition"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selected.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#d4af37] text-[#0B0E14] text-sm font-semibold hover:brightness-110 transition"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>
                </div>
              )}

              {selected.status !== 'Pending' && selected.comment && (
                <div className="p-6 border-t border-gray-100">
                  <p className="text-xs font-semibold tracking-wide uppercase text-gray-500 mb-1">
                    HR Comment
                  </p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                    {selected.comment}
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
