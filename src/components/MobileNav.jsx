import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, User, Clock, CalendarDays, Wallet, LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/attendance', label: 'Attendance', icon: Clock },
  { path: '/leave', label: 'Leave', icon: CalendarDays },
  { path: '/payroll', label: 'Payroll', icon: Wallet },
];

export default function MobileNav({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-[#0B0E14]/95 backdrop-blur-md z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <Logo />
              <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close menu">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 flex flex-col pt-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
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
                  onClick={onClose}
                  className="flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors text-gray-500 hover:text-rose-400 border-l-2 border-transparent"
                >
                  <LogOut size={20} />
                  Logout
                </NavLink>
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
