'use client'

import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [attendances, setAttendances] = useState<any[]>([])
  const [leaves, setLeaves] = useState<any[]>([])
  const [payroll, setPayroll] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Modal State for New Leave Request
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)
  const [leaveType, setLeaveType] = useState('SICK')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [submittingLeave, setSubmittingLeave] = useState(false)

  // Fetch users on mount
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch('/api/users')
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setUsers(data)
          setSelectedUser(data[0].id)
        }
      } catch (err) {
        console.error('Failed to load users', err)
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  // Fetch data when user changes
  useEffect(() => {
    if (!selectedUser) return
    fetchData()
  }, [selectedUser])

  async function fetchData() {
    try {
      const [attRes, leaveRes, payRes] = await Promise.all([
        fetch(`/api/attendance?userId=${selectedUser}`),
        fetch(`/api/leaves?userId=${selectedUser}`),
        fetch(`/api/payroll?userId=${selectedUser}`)
      ])
      const attData = await attRes.json()
      const leaveData = await leaveRes.json()
      const payData = await payRes.json()

      setAttendances(Array.isArray(attData) ? attData : [])
      setLeaves(Array.isArray(leaveData) ? leaveData : [])
      setPayroll(Array.isArray(payData) && payData.length > 0 ? payData[0] : null)
    } catch (err) {
      console.error('Error fetching dashboard data', err)
    }
  }

  async function handleAttendance(action: 'checkIn' | 'checkOut') {
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser, action })
      })
      if (res.ok) {
        fetchData()
      } else {
        const err = await res.json()
        alert(err.error || 'Action failed')
      }
    } catch (err) {
      console.error('Attendance error', err)
    }
  }

  async function handleLeaveSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!startDate || !endDate || !reason) {
      alert('Please fill out all fields')
      return
    }
    setSubmittingLeave(true)
    try {
      const res = await fetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser,
          type: leaveType,
          startDate,
          endDate,
          reason
        })
      })
      if (res.ok) {
        setIsLeaveModalOpen(false)
        setReason('')
        setStartDate('')
        setEndDate('')
        fetchData()
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to submit leave request')
      }
    } catch (err) {
      console.error('Submit leave error', err)
    } finally {
      setSubmittingLeave(false)
    }
  }

  async function handleLeaveStatusUpdate(leaveId: string, newStatus: 'APPROVED' | 'REJECTED') {
    try {
      const res = await fetch('/api/leaves', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: leaveId,
          status: newStatus,
          adminComments: `Updated by Admin on ${new Date().toLocaleDateString()}`
        })
      })
      if (res.ok) {
        fetchData()
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to update leave status')
      }
    } catch (err) {
      console.error('Leave update error', err)
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading DayFlow Dashboard...</div>
  }

  const currentUser = users.find((u) => u.id === selectedUser)
  const isAdmin = currentUser?.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">DayFlow Dashboard</h1>
          <p className="text-sm text-gray-500">Employee & HR Management Portal</p>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border">
          <label className="text-xs font-semibold text-gray-600 uppercase">Viewing As:</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="bg-white border text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Top Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Employee Profile</h2>
            <p className="text-lg font-bold text-gray-800 mt-1">{currentUser?.name}</p>
            <p className="text-sm text-gray-500">{currentUser?.jobTitle || 'Team Member'} • {currentUser?.department || 'General'}</p>
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between text-xs text-gray-500">
            <span>ID: {currentUser?.employeeId}</span>
            <span>{currentUser?.email}</span>
          </div>
        </div>

        {/* Attendance Clock Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Attendance Clock</h2>
            <p className="text-sm text-gray-600 mt-1">Record your daily work session.</p>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => handleAttendance('checkIn')}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition"
            >
              Clock In
            </button>
            <button
              onClick={() => handleAttendance('checkOut')}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg shadow-sm transition"
            >
              Clock Out
            </button>
          </div>
        </div>

        {/* Payroll Breakdown Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Payroll Summary</h2>
            {payroll ? (
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Base Salary:</span>
                  <span className="font-medium">${payroll.baseSalary?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Allowances:</span>
                  <span className="font-medium">+${payroll.allowances?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Deductions:</span>
                  <span className="font-medium">-${payroll.deductions?.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 mt-2">No payroll record found.</p>
            )}
          </div>
          <div className="mt-4 pt-3 border-t flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase">Net Salary</span>
            <span className="text-xl font-extrabold text-blue-600">
              {payroll ? `$${payroll.netSalary?.toLocaleString()}` : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Attendance Logs */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-base font-bold text-gray-800 mb-4">Recent Attendance Logs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Check In</th>
                  <th className="p-3">Check Out</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attendances.length === 0 ? (
                  <tr><td colSpan={4} className="p-4 text-center text-gray-400">No logs found</td></tr>
                ) : (
                  attendances.map((att) => (
                    <tr key={att.id}>
                      <td className="p-3 font-medium">{new Date(att.date).toLocaleDateString()}</td>
                      <td className="p-3">{att.checkIn ? new Date(att.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                      <td className="p-3">{att.checkOut ? new Date(att.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                          {att.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leave Requests & Admin Action */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-gray-800">Leave Requests</h3>
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-sm transition"
            >
              + Request Leave
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="p-3">Type</th>
                  <th className="p-3">Dates</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Status / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaves.length === 0 ? (
                  <tr><td colSpan={4} className="p-4 text-center text-gray-400">No requests found</td></tr>
                ) : (
                  leaves.map((leave) => (
                    <tr key={leave.id}>
                      <td className="p-3 font-medium">{leave.type}</td>
                      <td className="p-3 text-xs">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-gray-600 max-w-[120px] truncate">{leave.reason}</td>
                      <td className="p-3">
                        {leave.status === 'PENDING' && isAdmin ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleLeaveStatusUpdate(leave.id, 'APPROVED')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleLeaveStatusUpdate(leave.id, 'REJECTED')}
                              className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            leave.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                            leave.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {leave.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Leave Request Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Submit Leave Request</h3>
            <form onSubmit={handleLeaveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SICK">Sick Leave</option>
                  <option value="CASUAL">Casual Leave</option>
                  <option value="PAID">Paid Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="State your reason for leave..."
                  className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingLeave}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition disabled:opacity-50"
                >
                  {submittingLeave ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}