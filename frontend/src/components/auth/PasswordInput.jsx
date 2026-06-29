import { useState, useId } from 'react';
import { forwardRef } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const PasswordInput = forwardRef(
  ({
    label = 'Password',
    error,
    showStrength = true,
    className = '',
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState(0);
    const [password, setPassword] = useState('');

    const generatedId = useId();
    const inputId = props.id || generatedId;
    const errorId = `${inputId}-error`;
    const hasError = Boolean(error);

    const calculateStrength = (pwd) => {
      if (!pwd) return 0;
      let score = 0;
      if (pwd.length >= 8) score++;
      if (/[A-Z]/.test(pwd)) score++;
      if (/[a-z]/.test(pwd)) score++;
      if (/[0-9]/.test(pwd)) score++;
      if (/[^A-Za-z0-9]/.test(pwd)) score++;
      return Math.min(score, 4);
    };

    const handleChange = (e) => {
      const value = e.target.value;
      setPassword(value);
      setStrength(calculateStrength(value));
      if (props.onChange) props.onChange(e);
    };

    const handleBlur = (e) => {
      if (props.onBlur) props.onBlur(e);
    };

    const strengthLabels = [
      'Very Weak',
      'Weak',
      'Fair',
      'Strong',
      'Very Strong',
    ];
    const strengthColors = [
      'error',
      'warning',
      'info',
      'success',
      'success',
    ];

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

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? 'text' : 'password'}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3.5 py-2 pr-10 rounded-lg bg-bg border border-border text-text placeholder:text-text-muted
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
              ${hasError ? 'border-error focus:ring-error focus:border-error' : ''}`}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : undefined}
            disabled={props.disabled}
            {...props}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text focus:outline-none focus:ring-2 focus:ring-primary/20 rounded p-0.5"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {hasError && (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 text-xs text-error font-medium"
          >
            {error}
          </p>
        )}

        {showStrength && (
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(strength / 4) * 100}%`,
                    backgroundColor: `var(--color-${strengthColors[strength]})`,
                  }}
                />
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: `var(--color-${strengthColors[strength]})` }}
              >
                {strengthLabels[strength]}
              </span>
            </div>

            <ul className="text-xs text-text-muted space-y-1" role="list" aria-label="Password requirements">
              {[
                { test: password.length >= 8, text: 'At least 8 characters' },
                { test: /[A-Z]/.test(password), text: 'One uppercase letter' },
                { test: /[a-z]/.test(password), text: 'One lowercase letter' },
                { test: /[0-9]/.test(password), text: 'One number' },
                { test: /[^A-Za-z0-9]/.test(password), text: 'One special character' },
              ].map((req, i) => (
                <li
                  key={i}
                  className="flex items-center gap-1.5"
                >
                  {req.test ? (
                    <CheckCircle size={12} className="text-success" />
                  ) : (
                    <AlertCircle size={12} className="text-text-muted" />
                  )}
                  <span className={req.test ? 'text-success' : ''}>{req.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;