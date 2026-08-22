import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationDropdown({ notifications, isOpen, onClose, onMarkAllRead }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-gray-100 shadow-xl z-50"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-50">
              <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
              <button
                onClick={onMarkAllRead}
                className="text-[#d4af37] text-xs font-semibold hover:brightness-110"
              >
                Mark all as read
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications && notifications.length > 0 ? (
                notifications.map((notification, idx) => (
                  <div
                    key={notification.id || idx}
                    className="p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors flex gap-3"
                  >
                    <div className="mt-1 flex-shrink-0">
                      {notification.unread ? (
                        <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
                      ) : (
                        <div className="w-2 h-2" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-sm text-gray-500 text-center">No notifications</div>
              )}
            </div>
            <div className="p-3 border-t border-gray-50 text-center">
              <button className="text-sm text-[#d4af37] font-semibold hover:brightness-110">
                View all notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
