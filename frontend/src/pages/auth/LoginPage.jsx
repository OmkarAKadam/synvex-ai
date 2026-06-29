import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../utils/validators';
import useAuth from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import AuthLayout from '../../components/auth/AuthLayout';
import { AnimatePresence } from 'framer-motion';

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
            <Alert key="error" variant="error">{authError}</Alert>
          )}
        </AnimatePresence>
 
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
            <PasswordInput
              {...register('password')}
              label="Password"
              error={errors.password?.message}
              disabled={isLoading}
              placeholder="Enter your password"
              showStrength={false}
            />
            <div className="text-right mt-1">
              <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
            </div>
            <Button
              type="submit"
              loading={isLoading}
              className="mt-2"
              fullWidth
            >
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}