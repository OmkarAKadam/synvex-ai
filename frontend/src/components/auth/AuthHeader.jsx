import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

export default function AuthHeader() {
  return (
    <motion.header
      className="absolute top-0 left-0 right-0 z-20 p-8 flex items-center justify-between pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Brain size={18} className="text-primary" />
        </div>
        <span className="font-bold text-xl text-text tracking-tight">Synvex AI</span>
      </div>
      <nav className="pointer-events-auto flex items-center gap-6">
        <a href="#" className="text-sm text-text-secondary hover:text-text transition-colors">Features</a>
        <a href="#" className="text-sm text-text-secondary hover:text-text transition-colors">Pricing</a>
        <a href="#" className="text-sm text-text-secondary hover:text-text transition-colors">Docs</a>
      </nav>
    </motion.header>
  );
}