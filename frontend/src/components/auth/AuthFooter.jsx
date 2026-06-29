import { motion } from 'framer-motion';

export default function AuthFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <motion.footer
      className="absolute bottom-0 left-0 right-0 p-8 text-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="pointer-events-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-text-muted">
        <p>&copy; {currentYear} Synvex AI. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-text transition-colors">Privacy</a>
          <a href="#" className="hover:text-text transition-colors">Terms</a>
          <a href="#" className="hover:text-text transition-colors">Contact</a>
        </div>
      </div>
    </motion.footer>
  );
}