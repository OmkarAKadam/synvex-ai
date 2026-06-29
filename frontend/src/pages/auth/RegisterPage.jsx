import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../utils/validators';
import { register } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import PasswordInput from '../../components/auth/PasswordInput';
import AuthButton from '../../components/auth/AuthButton';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setAuthError('');
    try {
      await register(data);
      navigate('/login');
    } catch (err) {
      const message = err?.response?.data?.message || err?.friendlyMessage || 'Registration failed';
      setAuthError(message);
    }
  };

  const isLoading = isSubmitting;

  return (
    <AuthLayout isLogin={false} onSwitch={() => navigate('/login')}>
      <div className="w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-text mb-1">Create account</h1>
          <p className="text-sm text-text-muted">Join Synvex AI today</p>
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
              {...registerField('name')}
              label="Full Name"
              type="text"
              autoComplete="name"
              error={errors.name?.message}
              disabled={isLoading}
              placeholder="Enter your name"
            />
            <AuthInput
              {...registerField('email')}
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              disabled={isLoading}
              placeholder="Enter your email"
            />
            <PasswordInput
              {...registerField('password')}
              label="Password"
              error={errors.password?.message}
              disabled={isLoading}
              placeholder="Create a password"
            />
            <PasswordInput
              {...registerField('confirmPassword')}
              label="Confirm Password"
              type="password"
              error={errors.confirmPassword?.message}
              disabled={isLoading}
              placeholder="Confirm your password"
              showStrength={false}
            />
            <AuthButton
              type="submit"
              loading={isLoading}
              className="mt-2"
            >
              Create Account
            </AuthButton>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}