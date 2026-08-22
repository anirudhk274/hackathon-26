const statusStyles = {
  Active: 'bg-emerald-500/15 text-emerald-500',
  Present: 'bg-emerald-500/15 text-emerald-500',
  Approved: 'bg-emerald-500/15 text-emerald-500',
  Paid: 'bg-emerald-500/15 text-emerald-500',
  Inactive: 'bg-rose-500/15 text-rose-500',
  Absent: 'bg-rose-500/15 text-rose-500',
  Rejected: 'bg-rose-500/15 text-rose-500',
  'On Leave': 'bg-rose-500/15 text-rose-500',
  Leave: 'bg-[#d4af37]/15 text-[#d4af37]',
  Pending: 'bg-amber-500/15 text-amber-500',
  'Half-day': 'bg-amber-500/15 text-amber-500',
};

const darkCardStatusStyles = {
  Active: 'bg-emerald-500/20 text-emerald-400',
  Present: 'bg-emerald-500/20 text-emerald-400',
  Approved: 'bg-emerald-500/20 text-emerald-400',
  Paid: 'bg-emerald-500/20 text-emerald-400',
  Inactive: 'bg-rose-500/20 text-rose-400',
  Absent: 'bg-rose-500/20 text-rose-400',
  Rejected: 'bg-rose-500/20 text-rose-400',
  'On Leave': 'bg-rose-500/20 text-rose-400',
  Leave: 'bg-[#d4af37]/20 text-[#d4af37]',
  Pending: 'bg-amber-500/20 text-amber-400',
  'Half-day': 'bg-amber-500/20 text-amber-400',
};

export default function StatusBadge({ status, dark = false }) {
  const styles = dark
    ? darkCardStatusStyles[status] || 'bg-gray-500/20 text-gray-400'
    : statusStyles[status] || 'bg-gray-100 text-gray-600';

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles}`}
    >
      {status}
    </span>
  );
}
