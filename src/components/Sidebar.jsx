import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  User,
  Clock,
  CalendarDays,
  Wallet,
  LogOut,
  Users,
  ClipboardList,
  BarChart3,
  Menu,
  X,
  CalendarCheck,
} from 'lucide-react';
import Logo from './Logo';
import BrandMark from './BrandMark';

const employeeNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/attendance', label: 'Attendance', icon: Clock },
  { path: '/leave', label: 'Leave', icon: CalendarDays },
  { path: '/payroll', label: 'Payroll', icon: Wallet },
];

const adminNavItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/employees', label: 'Employees', icon: Users },
  { path: '/admin/attendance', label: 'Attendance', icon: CalendarCheck },
  { path: '/admin/leave', label: 'Leave Approval', icon: ClipboardList },
  { path: '/admin/payroll', label: 'Payroll', icon: Wallet },
  { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');
  const navItems = isAdmin ? adminNavItems : employeeNavItems;

  const isActive = (item) => {
    if (item.path === '/dashboard' || item.path === '/admin/dashboard') {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-6 border-b border-white/10">
        {isAdmin ? <BrandMark /> : <Logo />}
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col pt-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                active
                  ? 'border-l-2 border-[#d4af37] text-[#d4af37] bg-[#d4af37]/5'
                  : 'text-gray-400 hover:text-white border-l-2 border-transparent'
              }`}
            >
              <Icon size={20} />
              {item.label}
              {active && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d4af37]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </NavLink>
          );
        })}

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

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col fixed top-0 left-0 bottom-0 w-64 bg-[#0B0E14] z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0B0E14]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
        {isAdmin ? <BrandMark collapsed /> : <Logo />}
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-64 bg-[#0B0E14]/95 backdrop-blur-md z-50 md:hidden"
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
