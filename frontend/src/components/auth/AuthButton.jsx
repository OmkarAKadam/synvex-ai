import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const AuthButton = forwardRef(({ 
  children, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  fullWidth = true,
  className = '',
  type = 'button',
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active shadow-sm',
    secondary: 'bg-surface-elevated text-text hover:bg-surface-elevated/80 border border-border shadow-sm',
    ghost: 'bg-transparent text-text-secondary hover:bg-surface-elevated/50 hover:text-text',
  };

  const baseClasses = `inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
    ${className}`;

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`${variants[variant]} ${baseClasses}`}
      {...props}
    >
      {loading && (
        <motion.span
          className="flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 size={18} className="animate-spin" />
        </motion.span>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </motion.button>
  );
});

AuthButton.displayName = 'AuthButton';
export default AuthButton;