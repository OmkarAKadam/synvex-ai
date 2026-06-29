import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { changePassword } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import PasswordInput from '../../components/auth/PasswordInput';
import AuthButton from '../../components/auth/AuthButton';
import { motion, AnimatePresence } from 'framer-motion';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    shouldFocusError: true,
  });

  const onSubmit = async (data) => {
    setAuthError('');
    setSuccessMessage('');
    try {
      await changePassword(data.currentPassword, data.newPassword);
      setSuccessMessage('Password changed successfully.');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      const message = err?.response?.data?.message || err?.friendlyMessage || 'Failed to change password';
      setAuthError(message);
    }
  };

  const isLoading = isSubmitting;

  return (
    <AuthLayout>
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/profile')}
            className="p-1.5 rounded-lg border border-border bg-surface-elevated/40 hover:bg-surface-elevated text-text-secondary hover:text-text transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Back to profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          </button>
        </div>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-text mb-1">Change Password</h1>
          <p className="text-sm text-text-muted">Update your account password</p>
        </div>

        <AnimatePresence mode="wait">
          {authError && (
            <motion.div
              key="error"
              className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-xs font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {authError}
            </motion.div>
          )}
          {successMessage && (
            <motion.div
              key="success"
              className="mb-4 p-3 rounded-lg bg-success/10 border border-success/20 text-success text-xs font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">
            <PasswordInput
              {...register('currentPassword')}
              label="Current Password"
              type="password"
              autoComplete="current-password"
              error={errors.currentPassword?.message}
              disabled={isLoading}
              placeholder="Enter current password"
              showStrength={false}
            />
            <PasswordInput
              {...register('newPassword')}
              label="New Password"
              error={errors.newPassword?.message}
              disabled={isLoading}
              placeholder="Enter new password"
            />
            <PasswordInput
              {...register('confirmPassword')}
              label="Confirm New Password"
              type="password"
              error={errors.confirmPassword?.message}
              disabled={isLoading}
              placeholder="Confirm new password"
              showStrength={false}
            />
            <AuthButton
              type="submit"
              loading={isLoading}
              className="mt-2"
            >
              Update Password
            </AuthButton>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}