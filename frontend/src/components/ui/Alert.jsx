import { motion } from 'framer-motion'

const variantStyles = {
  error: 'bg-error/10 border-error/20 text-error',
  success: 'bg-success/10 border-success/20 text-success',
  warning: 'bg-warning/10 border-warning/20 text-warning',
  info: 'bg-info/10 border-info/20 text-info',
}

export default function Alert({
  variant = 'error',
  title,
  children,
  className = '',
  ...props
}) {
  return (
    <motion.div
      role="alert"
      className={`mb-4 p-3 rounded-lg border text-xs font-medium ${variantStyles[variant]} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      {...props}
    >
      {title && <p className="font-semibold mb-0.5">{title}</p>}
      {children}
    </motion.div>
  )
}
