import { useState } from 'react'
import { forwardRef, useId } from 'react'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import Input from './Input'

function calculateStrength(password) {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return Math.min(score, 4)
}

const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong']
const barColors = ['bg-error', 'bg-warning', 'bg-info', 'bg-success', 'bg-success']
const labelColors = ['text-error', 'text-warning', 'text-info', 'text-success', 'text-success']
const barWidths = ['w-0', 'w-1/4', 'w-1/2', 'w-3/4', 'w-full']

const PasswordInput = forwardRef(({
  label = 'Password',
  error,
  showStrength = false,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [strength, setStrength] = useState(0)

  const generatedId = useId()
  const inputId = props.id || generatedId

  const { onChange: externalOnChange, onBlur: externalOnBlur, ...inputProps } = props

  const handleChange = (e) => {
    const value = e.target.value
    setPassword(value)
    setStrength(calculateStrength(value))
    externalOnChange?.(e)
  }

  return (
    <div className={className}>
      <div className="relative">
        <Input
          ref={ref}
          id={inputId}
          label={label}
          type={showPassword ? 'text' : 'password'}
          error={error}
          onChange={handleChange}
          onBlur={externalOnBlur}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-muted hover:text-text transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded p-0.5"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          {...inputProps}
        />
      </div>
      {showStrength && (
        <div className="mt-3">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${barColors[strength]} ${barWidths[strength]}`}
              />
            </div>
            <span
              className={`text-xs font-medium ${labelColors[strength]}`}
            >
              {strengthLabels[strength]}
            </span>
          </div>
          <ul className="text-xs text-text-muted space-y-1" aria-label="Password requirements">
            {[
              { test: password.length >= 8, text: 'At least 8 characters' },
              { test: /[A-Z]/.test(password), text: 'One uppercase letter' },
              { test: /[a-z]/.test(password), text: 'One lowercase letter' },
              { test: /[0-9]/.test(password), text: 'One number' },
              { test: /[^A-Za-z0-9]/.test(password), text: 'One special character' },
            ].map((req, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {req.test ? (
                  <CheckCircle size={12} className="text-success shrink-0" />
                ) : (
                  <AlertCircle size={12} className="text-text-muted shrink-0" />
                )}
                <span className={req.test ? 'text-success' : ''}>{req.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
})

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
