import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { notifications as initialNotifications, unreadCount as initialUnreadCount } from '../data/notifications';
import employee from '../data/employee';

export default function Topbar({ title, onMenuClick }) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications || []);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount || 0);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden text-gray-500 hover:text-gray-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 text-gray-500 hover:text-gray-900 transition-colors focus:outline-none relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#d4af37] rounded-full text-[10px] font-bold text-[#0B0E14] flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationDropdown
              notifications={notifications}
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
              onMarkAllRead={handleMarkAllRead}
            />
          </div>

          <Link to="/profile" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] font-semibold text-sm group-hover:bg-[#d4af37]/30 transition-colors">
              {employee?.name ? employee.name.charAt(0) : 'E'}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 group-hover:text-gray-900">
              {employee?.name || 'Employee'}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
