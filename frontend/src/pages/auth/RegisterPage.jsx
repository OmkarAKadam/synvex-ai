import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../utils/validators';
import { register } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import AuthLayout from '../../components/auth/AuthLayout';
import { AnimatePresence } from 'framer-motion';

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
            <Alert key="error" variant="error">{authError}</Alert>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">
            <Input
              {...registerField('name')}
              label="Full Name"
              type="text"
              autoComplete="name"
              error={errors.name?.message}
              disabled={isLoading}
              placeholder="Enter your name"
            />
            <Input
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
              showStrength={true}
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
            <Button
              type="submit"
              loading={isLoading}
              className="mt-2"
              fullWidth
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}