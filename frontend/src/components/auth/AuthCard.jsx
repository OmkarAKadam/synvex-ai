import { motion } from 'framer-motion';

export default function AuthCard({ children, className = '' }) {
  return (
    <motion.div
      className={`border border-border bg-surface rounded-xl p-8 shadow-sm ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}