import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useId } from 'react';

const AuthInput = forwardRef(({ 
  label, 
  type = 'text', 
  error, 
  className = '', 
  inputClassName = '',
  ...props 
}, ref) => {
  const generatedId = useId();
  const inputId = props.id || generatedId;
  const errorId = `${inputId}-error`;
  const hasError = Boolean(error);

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-secondary mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={`w-full px-3.5 py-2 rounded-lg bg-bg border border-border text-text placeholder:text-text-muted
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
          ${hasError ? 'border-error focus:ring-error focus:border-error' : ''}
          ${inputClassName}`}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        {...props}
      />
      {hasError && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-xs text-error font-medium"
        >
          {error}
        </p>
      )}
    </div>
  );
});

AuthInput.displayName = 'AuthInput';
export default AuthInput;