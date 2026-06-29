import { motion } from 'framer-motion';
import AuthCard from './AuthCard';
import AuthHeader from './AuthHeader';
import AuthFooter from './AuthFooter';

export default function AuthLayout({
  children,
  isLogin = true,
  onSwitch,
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg relative px-4 py-16">
      {/* Header */}
      <AuthHeader />

      {/* Authentication Form Panel */}
      <motion.div
        className="w-full max-w-md z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <AuthCard>{children}</AuthCard>
        <div className="mt-6 text-center text-sm text-text-muted">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitch}
                className="text-primary hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitch}
                className="text-primary hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Login
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Footer */}
      <AuthFooter />
    </div>
  );
}