import React from 'react';
import { motion } from 'framer-motion';

/**
 * PageTransition Component
 * Motion wrapper for smooth page transitions across router views.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page contents
 * @param {string} [props.className=''] - Additional Tailwind CSS classes
 */
export default function PageTransition({ children, className = '', ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`w-full ${className}`.trim()}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
