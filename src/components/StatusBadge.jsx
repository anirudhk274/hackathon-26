import React from 'react';

/**
 * StatusBadge Component
 * Displays a color-coded status badge for attendance, requests, leaves, and payroll.
 * 
 * @param {Object} props
 * @param {string} props.status - Status text (e.g. 'Present', 'Approved', 'Paid', 'Absent', 'Rejected', 'Half-day', 'Pending', 'Leave', 'Unpaid')
 * @param {'sm'|'md'} [props.size='md'] - Size variant of the badge
 * @param {string} [props.className=''] - Additional Tailwind CSS classes
 */
const STATUS_STYLES = {
  // Present / Approved / Paid -> Emerald
  Present: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
  Approved: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
  Paid: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',

  // Absent / Rejected -> Rose
  Absent: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
  Rejected: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',

  // Half-day / Pending -> Amber
  'Half-day': 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
  'Half Day': 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
  Pending: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',

  // Leave -> Gold (#d4af37)
  Leave: 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20',
  'On Leave': 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20',

  // Unpaid -> Gray
  Unpaid: 'bg-gray-400/10 text-gray-400 border border-gray-400/20',
};

const DEFAULT_STYLE = 'bg-gray-100 text-gray-500 border border-gray-200';

const SIZE_STYLES = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-3 py-1 text-xs',
};

export default function StatusBadge({ status = '', size = 'md', className = '' }) {
  // Normalize string for flexible case-insensitive matching
  const matchedKey = Object.keys(STATUS_STYLES).find(
    (key) => key.toLowerCase() === String(status).trim().toLowerCase()
  );

  const colorClasses = matchedKey ? STATUS_STYLES[matchedKey] : DEFAULT_STYLE;
  const sizeClasses = SIZE_STYLES[size] || SIZE_STYLES.md;

  return (
    <span
      role="status"
      aria-label={`Status: ${status}`}
      className={`rounded-full font-semibold inline-flex items-center justify-center tracking-wide transition-colors ${sizeClasses} ${colorClasses} ${className}`.trim()}
    >
      {status}
    </span>
  );
}
