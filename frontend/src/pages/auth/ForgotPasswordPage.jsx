import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '../../utils/validators';
import { forgotPassword } from '../../services/authService';
import { useState } from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    shouldFocusError: true,
  });

  const onSubmit = async (data) => {
    setAuthError('');
    setSuccessMessage('');
    try {
      await forgotPassword(data.email);
      setSuccessMessage('If the email exists, a password reset link has been sent.');
    } catch (err) {
      const message = err?.response?.data?.message || err?.friendlyMessage || 'Failed to send reset link';
      setAuthError(message);
    }
  };

  const isLoading = isSubmitting;

  return (
    <AuthLayout>
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/login')}
            className="p-1.5 rounded-lg border border-border bg-surface-elevated/40 hover:bg-surface-elevated text-text-secondary hover:text-text transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Back to login"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          </button>
        </div>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-text mb-1">Forgot Password</h1>
          <p className="text-sm text-text-muted">Enter your email to receive a reset link</p>
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
            <AuthInput
              {...register('email')}
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              disabled={isLoading}
              placeholder="Enter your email"
            />
            <AuthButton
              type="submit"
              loading={isLoading}
              className="mt-2"
            >
              Send Reset Link
            </AuthButton>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-text-muted">
          Remember your password?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">Sign In</Link>
        </div>
      </div>
    </AuthLayout>
  );
}