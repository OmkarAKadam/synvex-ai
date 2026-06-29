import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../utils/validators';
import useAuth from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import PasswordInput from '../../components/auth/PasswordInput';
import AuthButton from '../../components/auth/AuthButton';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const { login, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    shouldFocusError: true,
  });

  const onSubmit = async (data) => {
    setAuthError('');
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err) {
      const message = err?.response?.data?.message || err?.friendlyMessage || 'Login failed';
      setAuthError(message);
    }
  };

  const isLoading = authLoading || isSubmitting;

  return (
    <AuthLayout isLogin={true} onSwitch={() => navigate('/register')}>
      <div className="w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-text mb-1">Welcome back</h1>
          <p className="text-sm text-text-muted">Sign in to your Synvex AI account</p>
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
            <PasswordInput
              {...register('password')}
              label="Password"
              error={errors.password?.message}
              disabled={isLoading}
              placeholder="Enter your password"
              showStrength={false}
            />
            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-bg text-primary focus:ring-primary/20"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
            </div>
            <AuthButton
              type="submit"
              loading={isLoading}
              className="mt-2"
            >
              Sign In
            </AuthButton>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}