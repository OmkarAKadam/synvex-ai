import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '../../utils/validators';
import { forgotPassword } from '../../services/authService';
import { useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import AuthLayout from '../../components/auth/AuthLayout';
import { AnimatePresence } from 'framer-motion';
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
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-text mb-1">Forgot Password</h1>
          <p className="text-sm text-text-muted">Enter your email to receive a reset link</p>
        </div>

        <AnimatePresence mode="wait">
          {authError && (
            <Alert key="error" variant="error">{authError}</Alert>
          )}
          {successMessage && (
            <Alert key="success" variant="success">{successMessage}</Alert>
          )}
        </AnimatePresence>

        {successMessage ? (
          <div className="text-center mt-8">
            <Link to="/login" className="text-sm font-medium text-primary hover:underline">Back to Sign In</Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="space-y-4">
                <Input
                  {...register('email')}
                  label="Email"
                  type="email"
                  autoComplete="email"
                  error={errors.email?.message}
                  disabled={isLoading}
                  placeholder="Enter your email"
                />
                <Button
                  type="submit"
                  loading={isLoading}
                  className="mt-2"
                  fullWidth
                >
                  Send Reset Link
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm text-text-muted">
              Remember your password?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">Sign In</Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
}