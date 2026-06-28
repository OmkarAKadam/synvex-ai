import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema } from '../../utils/validators'
import { forgotPassword } from '../../services/authService'
import { useState } from 'react'

function ForgotPasswordPage() {
  const [authError, setAuthError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    shouldFocusError: true,
  })

  const onSubmit = async (data) => {
    setAuthError('')
    setSuccessMessage('')
    try {
      await forgotPassword(data.email)
      setSuccessMessage('If the email exists, a password reset link has been sent.')
    } catch (err) {
      const message = err?.response?.data?.message || err?.friendlyMessage || 'Failed to send reset link'
      setAuthError(message)
    }
  }

  const isLoading = isSubmitting

  return (
    <div>
      <h1>Forgot Password</h1>
      {authError && <div role="alert" style={{ color: 'red' }}>{authError}</div>}
      {successMessage && <div role="status" style={{ color: 'green' }}>{successMessage}</div>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            {...register('email')}
            type="email"
            autoComplete="email"
            disabled={isLoading}
          />
          {errors.email && <span role="alert" style={{ color: 'red' }}>{errors.email.message}</span>}
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  )
}

export default ForgotPasswordPage