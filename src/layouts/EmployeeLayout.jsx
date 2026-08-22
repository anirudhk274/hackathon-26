import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import Topbar from '../components/Topbar';

export default function EmployeeLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/profile':
        return 'Profile';
      case '/attendance':
        return 'Attendance';
      case '/leave':
        return 'Leave Management';
      case '/payroll':
        return 'Payroll';
      default:
        return 'Dashboard';
    }
  };

  const title = getPageTitle(location.pathname);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Topbar title={title} onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
