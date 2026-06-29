import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

const variantStyles = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active shadow-sm',
  secondary: 'bg-surface-elevated text-text hover:bg-surface-elevated/80 border border-border shadow-sm',
  ghost: 'bg-transparent text-text-secondary hover:bg-surface-elevated/50 hover:text-text',
  danger: 'bg-error text-error-foreground hover:bg-error/95 shadow-sm',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs gap-1 h-8',
  md: 'px-4 py-2 text-sm gap-1.5 h-10',
  lg: 'px-5 py-2.5 text-base gap-2 h-12',
}

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium rounded-button transition-colors
        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-bg
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}`}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin shrink-0" />}
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
