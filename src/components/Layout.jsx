import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="p-4 md:p-6"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
