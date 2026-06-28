import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { changePasswordSchema } from '../../utils/validators'
import { changePassword } from '../../services/authService'
import { useState } from 'react'

function ChangePasswordPage() {
  const [authError, setAuthError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    shouldFocusError: true,
  })

  const onSubmit = async (data) => {
    setAuthError('')
    setSuccessMessage('')
    try {
      await changePassword(data.currentPassword, data.newPassword)
      setSuccessMessage('Password changed successfully.')
    } catch (err) {
      const message = err?.response?.data?.message || err?.friendlyMessage || 'Failed to change password'
      setAuthError(message)
    }
  }

  const isLoading = isSubmitting

  return (
    <div>
      <h1>Change Password</h1>
      {authError && <div role="alert" style={{ color: 'red' }}>{authError}</div>}
      {successMessage && <div role="status" style={{ color: 'green' }}>{successMessage}</div>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label htmlFor="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            {...register('currentPassword')}
            type="password"
            autoComplete="current-password"
            disabled={isLoading}
          />
          {errors.currentPassword && (
            <span role="alert" style={{ color: 'red' }}>{errors.currentPassword.message}</span>
          )}
        </div>
        <div>
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            {...register('newPassword')}
            type="password"
            autoComplete="new-password"
            disabled={isLoading}
          />
          {errors.newPassword && (
            <span role="alert" style={{ color: 'red' }}>{errors.newPassword.message}</span>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            {...register('confirmPassword')}
            type="password"
            autoComplete="new-password"
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <span role="alert" style={{ color: 'red' }}>{errors.confirmPassword.message}</span>
          )}
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Changing…' : 'Change Password'}
        </button>
      </form>
    </div>
  )
}

export default ChangePasswordPage