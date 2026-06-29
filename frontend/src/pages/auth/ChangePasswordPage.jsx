import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { changePassword } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import AuthLayout from '../../components/auth/AuthLayout';
import { AnimatePresence } from 'framer-motion';

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
            <ArrowLeft size={16} />
          </button>
        </div>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-text mb-1">Change Password</h1>
          <p className="text-sm text-text-muted">Update your account password</p>
        </div>

        <AnimatePresence mode="wait">
          {authError && (
            <Alert key="error" variant="error">{authError}</Alert>
          )}
          {successMessage && (
            <Alert key="success" variant="success">{successMessage}</Alert>
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
              showStrength={true}
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
            <Button
              type="submit"
              loading={isLoading}
              className="mt-2"
              fullWidth
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}