export const leaveBalance = {
  paid: {
    total: 18,
    used: 5,
    remaining: 13,
  },
  sick: {
    total: 12,
    used: 3,
    remaining: 9,
  },
  unpaid: {
    total: 0,
    used: 1,
    remaining: 0,
  },
};

export const leaveRequests = [
  {
    id: 'LV-2026-001',
    type: 'Paid',
    fromDate: '2026-08-25',
    toDate: '2026-08-27',
    days: 3,
    remarks: 'Attending family reunion in Mysore.',
    status: 'Pending',
    hrRemarks: null,
    appliedOn: '2026-08-18',
  },
  {
    id: 'LV-2026-002',
    type: 'Sick',
    fromDate: '2026-08-20',
    toDate: '2026-08-20',
    days: 1,
    remarks: 'Viral fever and severe migraine.',
    status: 'Approved',
    hrRemarks: 'Approved. Get well soon!',
    appliedOn: '2026-08-19',
  },
  {
    id: 'LV-2026-003',
    type: 'Paid',
    fromDate: '2026-08-10',
    toDate: '2026-08-10',
    days: 1,
    remarks: 'Personal administrative work at city municipal office.',
    status: 'Approved',
    hrRemarks: 'Approved by Priya Sharma.',
    appliedOn: '2026-08-01',
  },
  {
    id: 'LV-2026-004',
    type: 'Paid',
    fromDate: '2026-07-28',
    toDate: '2026-07-30',
    days: 3,
    remarks: 'Extended weekend trip to Coorg.',
    status: 'Rejected',
    hrRemarks: 'Q3 major release freeze period. Please reschedule.',
    appliedOn: '2026-07-20',
  },
  {
    id: 'LV-2026-005',
    type: 'Paid',
    fromDate: '2026-06-15',
    toDate: '2026-06-17',
    days: 3,
    remarks: 'Annual summer vacation with family.',
    status: 'Approved',
    hrRemarks: 'Approved by Priya Sharma.',
    appliedOn: '2026-06-01',
  },
  {
    id: 'LV-2026-006',
    type: 'Unpaid',
    fromDate: '2026-05-10',
    toDate: '2026-05-15',
    days: 5,
    remarks: 'Extended personal leave for relocation assistance.',
    status: 'Rejected',
    hrRemarks: 'Key architecture migration milestone scheduled for Engineering team.',
    appliedOn: '2026-05-02',
  },
];

export const leaveCalendarEvents = [
  {
    date: '2026-08-10',
    status: 'approved',
    type: 'Paid',
    title: 'Paid Leave',
  },
  {
    date: '2026-08-20',
    status: 'approved',
    type: 'Sick',
    title: 'Sick Leave',
  },
  {
    date: '2026-08-25',
    status: 'pending',
    type: 'Paid',
    title: 'Paid Leave (Pending)',
  },
  {
    date: '2026-08-26',
    status: 'pending',
    type: 'Paid',
    title: 'Paid Leave (Pending)',
  },
  {
    date: '2026-08-27',
    status: 'pending',
    type: 'Paid',
    title: 'Paid Leave (Pending)',
  },
  {
    date: '2026-06-15',
    status: 'approved',
    type: 'Paid',
    title: 'Paid Leave',
  },
  {
    date: '2026-06-16',
    status: 'approved',
    type: 'Paid',
    title: 'Paid Leave',
  },
  {
    date: '2026-06-17',
    status: 'approved',
    type: 'Paid',
    title: 'Paid Leave',
  },
];

export default {
  leaveBalance,
  leaveRequests,
  leaveCalendarEvents,
};
