const variantStyles = {
  success: 'bg-success-50 text-success border-success/20',
  warning: 'bg-warning-50 text-warning border-warning/20',
  error: 'bg-error-50 text-error border-error/20',
  info: 'bg-info-50 text-info border-info/20',
  neutral: 'bg-surface-elevated text-text-secondary border-border/80',
}

const typeStyles = {
  pill: 'rounded-full px-2 py-0.5 text-xs font-medium',
  chip: 'rounded px-1.5 py-0.5 text-[10px] font-bold',
}

export default function Badge({
  children,
  variant = 'neutral',
  type = 'pill',
  className = '',
}) {
  return (
    <span
      className={`inline-flex items-center border whitespace-nowrap ${variantStyles[variant]} ${typeStyles[type]} ${className}`}
    >
      {children}
    </span>
  )
}
