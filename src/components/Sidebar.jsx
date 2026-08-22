import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, User, Clock, CalendarDays, Wallet, LogOut } from 'lucide-react';
import Logo from './Logo';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/attendance', label: 'Attendance', icon: Clock },
  { path: '/leave', label: 'Leave', icon: CalendarDays },
  { path: '/payroll', label: 'Payroll', icon: Wallet },
];

export default function Sidebar() {
  return (
    <div className="hidden md:flex md:flex-col fixed top-0 left-0 bottom-0 w-64 bg-[#0B0E14]">
      <div className="p-6 border-b border-white/10">
        <Logo />
      </div>
      <nav className="flex-1 flex flex-col pt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-l-2 border-[#d4af37] text-[#d4af37] bg-[#d4af37]/5'
                  : 'text-gray-400 hover:text-white border-l-2 border-transparent'
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
        <div className="mt-auto border-t border-white/10 pt-4 pb-6">
          <NavLink
            to="/logout"
            className="flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors text-gray-500 hover:text-rose-400 border-l-2 border-transparent"
          >
            <LogOut size={20} />
            Logout
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
