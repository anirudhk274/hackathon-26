import React from 'react';

/**
 * Logo Component
 * Dayflow brand mark featuring 3 gold vertical bars and branded typography.
 * 
 * @param {Object} props
 * @param {boolean} [props.collapsed=false] - Whether to render in collapsed state (icon only)
 * @param {string} [props.className=''] - Additional Tailwind CSS classes
 */
export default function Logo({ collapsed = false, className = '' }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`.trim()}>
      {/* 3 vertical gold bars */}
      <div className="flex items-center gap-1 shrink-0" aria-hidden="true">
        <div className="bg-[#d4af37] w-1 h-6 rounded-full" />
        <div className="bg-[#d4af37] w-1 h-6 rounded-full" />
        <div className="bg-[#d4af37] w-1 h-6 rounded-full" />
      </div>

      {/* Brand Text */}
      {!collapsed && (
        <div className="flex flex-col min-w-0">
          <span className="text-white text-sm font-bold tracking-[0.2em]">
            DAYFLOW
          </span>
          <span className="text-gray-500 text-[10px] tracking-widest uppercase">
            Employee Portal
          </span>
        </div>
      )}
    </div>
  );
}
