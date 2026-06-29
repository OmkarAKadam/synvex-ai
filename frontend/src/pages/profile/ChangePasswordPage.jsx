import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { changePasswordSchema } from '../../utils/validators'
import { changePassword } from '../../services/authService'
import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'

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
    <DashboardLayout title="Change Password">
      <div className="max-w-xl">
        <div className="border border-border bg-surface rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-text mb-4 uppercase tracking-wider text-text-secondary">
            Update Credentials
          </h2>

          {authError && (
            <div role="alert" className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-xs font-medium">
              {authError}
            </div>
          )}
          {successMessage && (
            <div role="status" className="mb-4 p-3 rounded-lg bg-success/10 border border-success/20 text-success text-xs font-medium">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-text-secondary mb-1.5">
                Current Password
              </label>
              <input
                id="currentPassword"
                {...register('currentPassword')}
                type="password"
                autoComplete="current-password"
                disabled={isLoading}
                placeholder="Enter current password"
                className="w-full px-3.5 py-2 rounded-lg bg-bg border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              />
              {errors.currentPassword && (
                <p role="alert" className="text-xs text-error font-medium mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-text-secondary mb-1.5">
                New Password
              </label>
              <input
                id="newPassword"
                {...register('newPassword')}
                type="password"
                autoComplete="new-password"
                disabled={isLoading}
                placeholder="Enter new password"
                className="w-full px-3.5 py-2 rounded-lg bg-bg border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              />
              {errors.newPassword && (
                <p role="alert" className="text-xs text-error font-medium mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1.5">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                {...register('confirmPassword')}
                type="password"
                autoComplete="new-password"
                disabled={isLoading}
                placeholder="Confirm new password"
                className="w-full px-3.5 py-2 rounded-lg bg-bg border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              />
              {errors.confirmPassword && (
                <p role="alert" className="text-xs text-error font-medium mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {isLoading ? 'Changing…' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ChangePasswordPage