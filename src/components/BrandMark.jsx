import { motion } from 'framer-motion';

export default function BrandMark({ collapsed = false }) {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="flex items-end gap-[3px]"
        whileHover="hover"
      >
        <motion.span
          className="block w-1.5 bg-[#d4af37] rounded-full"
          style={{ height: 24 }}
          variants={{ hover: { scaleY: 1.2, originY: 1 } }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
        <motion.span
          className="block w-1.5 bg-[#d4af37] rounded-full"
          style={{ height: 32 }}
          variants={{ hover: { scaleY: 1.2, originY: 1 } }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.05 }}
        />
        <motion.span
          className="block w-1.5 bg-[#d4af37] rounded-full"
          style={{ height: 40 }}
          variants={{ hover: { scaleY: 1.2, originY: 1 } }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
        />
      </motion.div>
      {!collapsed && (
        <div className="leading-none">
          <div className="text-white font-bold text-lg tracking-tight">HRM</div>
          <div className="text-gray-400 text-[10px] font-semibold tracking-widest uppercase mt-0.5">
            Admin Panel
          </div>
        </div>
      )}
    </div>
  );
}
