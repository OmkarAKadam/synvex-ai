import { forwardRef, useId } from 'react'

const Input = forwardRef(({
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
  id: externalId,
  rightIcon,
  ...props
}, ref) => {
  const generatedId = useId()
  const inputId = externalId || generatedId
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`
  const hasError = Boolean(error)

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-secondary mb-1.5"
        >
          {label}
          {required && <span className="text-error ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`w-full px-3.5 py-2 rounded-input bg-bg border text-text placeholder:text-text-muted
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
            ${hasError ? 'border-error focus:ring-error focus:border-error' : 'border-border'}
            ${rightIcon ? 'pr-10' : ''}
            ${inputClassName}`}
          aria-invalid={hasError}
          aria-describedby={
            [hasError ? errorId : '', helperText ? helperId : ''].filter(Boolean).join(' ') || undefined
          }
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightIcon}
          </div>
        )}
      </div>
      {helperText && !hasError && (
        <p id={helperId} className="mt-1.5 text-xs text-text-muted">{helperText}</p>
      )}
      {hasError && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-error font-medium">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
