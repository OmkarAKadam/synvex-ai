import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema } from '../../utils/validators'
import { resetPassword } from '../../services/authService'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function ResetPasswordPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [authError, setAuthError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const token = searchParams.get('token')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: token || '' },
    shouldFocusError: true,
  })

  // Keep token in form values in sync with URL (in case it changes)
  useEffect(() => {
    if (token) {
      setValue('token', token, { shouldValidate: false })
    }
  }, [token, setValue])

  const onSubmit = async (data) => {
    setAuthError('')
    setSuccessMessage('')
    try {
      await resetPassword(
        data.token,
        data.newPassword,
        data.confirmPassword
      )
      setSuccessMessage('Password has been reset successfully. Redirecting to login...')
      // Redirect after short delay to let user see the message
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      const message = err?.response?.data?.message || err?.friendlyMessage || 'Password reset failed'
      setAuthError(message)
    }
  }

  const isLoading = isSubmitting

  if (!token) {
    return (
      <div>
        <h1>Reset Password</h1>
        <div role="alert" style={{ color: 'red' }}>Invalid or missing reset token.</div>
      </div>
    )
  }

  return (
    <div>
      <h1>Reset Password</h1>
      {authError && <div role="alert" style={{ color: 'red' }}>{authError}</div>}
      {successMessage && <div role="status" style={{ color: 'green' }}>{successMessage}</div>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <input type="hidden" {...register('token')} />
        <div>
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            {...register('newPassword')}
            type="password"
            autoComplete="new-password"
            disabled={isLoading}
          />
          {errors.newPassword && <span role="alert" style={{ color: 'red' }}>{errors.newPassword.message}</span>}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            {...register('confirmPassword')}
            type="password"
            autoComplete="new-password"
            disabled={isLoading}
          />
          {errors.confirmPassword && <span role="alert" style={{ color: 'red' }}>{errors.confirmPassword.message}</span>}
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  )
}

export default ResetPasswordPage