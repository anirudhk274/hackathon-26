import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ClipboardList,
  Wallet,
  BarChart3,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import BrandMark from './BrandMark';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
  { to: '/leave', label: 'Leave Approval', icon: ClipboardList },
  { to: '/payroll', label: 'Payroll', icon: Wallet },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-5 border-b border-white/5">
        <BrandMark />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-[#d4af37]/15 text-[#d4af37]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon
                size={18}
                className={`transition-transform duration-200 group-hover:translate-x-0.5 ${
                  isActive ? 'text-[#d4af37]' : ''
                }`}
              />
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d4af37]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/5">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all w-full">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0B0E14] border-r border-white/5 fixed inset-y-0 left-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0B0E14]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <BrandMark collapsed />
        <button
          onClick={() => setMobileOpen(true)}
          className="text-gray-400 hover:text-white p-1"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-64 bg-[#0B0E14]/95 backdrop-blur-md z-50 lg:hidden"
            >
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-gray-400 hover:text-white"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
