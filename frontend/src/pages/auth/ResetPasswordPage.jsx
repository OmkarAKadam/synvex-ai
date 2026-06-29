import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '../../utils/validators';
import { resetPassword } from '../../services/authService';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';
import AuthLayout from '../../components/auth/AuthLayout';
import Alert from '../../components/ui/Alert';
import { AnimatePresence } from 'framer-motion';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: token || '' },
    shouldFocusError: true,
  });

  useEffect(() => {
    if (token) {
      setValue('token', token, { shouldValidate: false });
    }
  }, [token, setValue]);

  const onSubmit = async (data) => {
    setAuthError('');
    setSuccessMessage('');
    try {
      await resetPassword(data.token, data.newPassword, data.confirmPassword);
      setSuccessMessage('Password has been reset successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const message = err?.response?.data?.message || err?.friendlyMessage || 'Password reset failed';
      setAuthError(message);
    }
  };

  const isLoading = isSubmitting;

  if (!token) {
    return (
      <AuthLayout>
        <div className="w-full">
          <Alert variant="error">Invalid or missing reset token. Please request a new password reset link.</Alert>
          <div className="text-center mt-8">
            <Link to="/login" className="text-sm font-medium text-primary hover:underline">Back to Sign In</Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-text mb-1">Reset Password</h1>
          <p className="text-sm text-text-muted">Enter your new password</p>
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
          <input type="hidden" {...register('token')} />
          <div className="space-y-4">
            <PasswordInput
              {...register('newPassword')}
              label="New Password"
              error={errors.newPassword?.message}
              disabled={isLoading}
              placeholder="Enter your new password"
              showStrength={true}
            />
            <PasswordInput
              {...register('confirmPassword')}
              label="Confirm Password"
              type="password"
              error={errors.confirmPassword?.message}
              disabled={isLoading}
              placeholder="Confirm your new password"
              showStrength={false}
            />
            <Button
              type="submit"
              loading={isLoading}
              className="mt-2"
              fullWidth
            >
              Reset Password
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-text-muted">
          Remember your password?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">Sign In</Link>
        </div>
      </div>
    </AuthLayout>
  );
}