export const notifications = [
  {
    id: 'NOTIF-001',
    type: 'payslip_generated',
    title: 'Payslip Available',
    message: 'Your payslip for August 2026 is now available for download.',
    timestamp: '2026-08-22T09:00:00.000Z',
    isRead: false,
  },
  {
    id: 'NOTIF-002',
    type: 'attendance_reminder',
    title: 'Daily Check-In Recorded',
    message: 'You checked in today at 09:15 AM. Have a productive day!',
    timestamp: '2026-08-22T09:15:30.000Z',
    isRead: false,
  },
  {
    id: 'NOTIF-003',
    type: 'leave_approved',
    title: 'Sick Leave Approved',
    message: 'Your sick leave request for Aug 20, 2026 has been approved by Priya Sharma.',
    timestamp: '2026-08-20T10:30:00.000Z',
    isRead: false,
  },
  {
    id: 'NOTIF-004',
    type: 'general',
    title: 'Company Townhall Announcement',
    message: 'All-Hands Q3 Strategic Townhall is scheduled for August 28, 2026 at 4:00 PM IST.',
    timestamp: '2026-08-19T14:00:00.000Z',
    isRead: true,
  },
  {
    id: 'NOTIF-005',
    type: 'leave_approved',
    title: 'Leave Request Approved',
    message: 'Your paid leave request for Aug 10, 2026 has been approved.',
    timestamp: '2026-08-02T11:20:00.000Z',
    isRead: true,
  },
  {
    id: 'NOTIF-006',
    type: 'leave_rejected',
    title: 'Leave Request Rejected',
    message: 'Your leave request for Jul 28 – Jul 30 was rejected: Q3 major release freeze period.',
    timestamp: '2026-07-21T16:45:00.000Z',
    isRead: true,
  },
  {
    id: 'NOTIF-007',
    type: 'payslip_generated',
    title: 'Payslip Credited',
    message: 'Your salary for July 2026 has been processed and credited to your account.',
    timestamp: '2026-07-31T18:00:00.000Z',
    isRead: true,
  },
  {
    id: 'NOTIF-008',
    type: 'general',
    title: 'Security Compliance Training Due',
    message: 'Annual Information Security compliance refresher module is due by Aug 31.',
    timestamp: '2026-07-15T09:00:00.000Z',
    isRead: true,
  },
];

export const recentActivity = [
  {
    id: 'ACT-001',
    type: 'check_in',
    description: 'Checked in at 09:15 AM',
    timestamp: '2026-08-22T09:15:00.000Z',
    icon: 'LogIn',
  },
  {
    id: 'ACT-002',
    type: 'check_out',
    description: 'Checked out at 06:18 PM on Aug 21',
    timestamp: '2026-08-21T18:18:00.000Z',
    icon: 'LogOut',
  },
  {
    id: 'ACT-003',
    type: 'leave_approved',
    description: 'Sick Leave request for Aug 20 was approved',
    timestamp: '2026-08-20T10:30:00.000Z',
    icon: 'CheckCircle',
  },
  {
    id: 'ACT-004',
    type: 'leave_applied',
    description: 'Applied for 3 days Paid Leave (Aug 25 – Aug 27)',
    timestamp: '2026-08-18T14:30:00.000Z',
    icon: 'CalendarPlus',
  },
  {
    id: 'ACT-005',
    type: 'leave_approved',
    description: 'Paid Leave for Aug 10 approved',
    timestamp: '2026-08-02T11:20:00.000Z',
    icon: 'CheckCircle',
  },
  {
    id: 'ACT-006',
    type: 'payslip_generated',
    description: 'Payslip for July 2026 generated',
    timestamp: '2026-07-31T18:00:00.000Z',
    icon: 'FileText',
  },
];

export const unreadCount = notifications.filter((n) => !n.isRead).length;

export default {
  notifications,
  recentActivity,
  unreadCount,
};
