import { useState } from 'react';
import { useLocation } from 'wouter';
import { Mail, Lock, User, Loader, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function Signup() {
  const [, setLocation] = useLocation();
  const { signUp, loading, error: authError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    fullName?: string;
  }>({});

  const validateForm = () => {
    const errors: typeof validationErrors = {};
    
    if (!fullName) {
      errors.fullName = 'Full name is required';
    } else if (fullName.length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password = 'Password must contain uppercase, lowercase, and numbers';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    const { error } = await signUp(email, password);
    
    if (error) {
      setError(error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        setLocation('/login');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="gradient-text text-4xl font-bold mb-2">
            PlatFormula.ONE
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Create your startup dashboard account
          </p>
        </div>

        {/* Signup Card */}
        <div className="glass p-8 rounded-2xl">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Account Created!
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Check your email to verify your account. Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-purple-600 dark:text-pink-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (validationErrors.fullName) {
                        setValidationErrors({ ...validationErrors, fullName: undefined });
                      }
                    }}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/80 dark:bg-slate-700/50 border-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition ${
                      validationErrors.fullName
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-purple-200 dark:border-purple-700'
                    }`}
                  />
                </div>
                {validationErrors.fullName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {validationErrors.fullName}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-purple-600 dark:text-pink-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (validationErrors.email) {
                        setValidationErrors({ ...validationErrors, email: undefined });
                      }
                    }}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/80 dark:bg-slate-700/50 border-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition ${
                      validationErrors.email
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-purple-200 dark:border-purple-700'
                    }`}
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-purple-600 dark:text-pink-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (validationErrors.password) {
                        setValidationErrors({ ...validationErrors, password: undefined });
                      }
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/80 dark:bg-slate-700/50 border-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition ${
                      validationErrors.password
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-purple-200 dark:border-purple-700'
                    }`}
                  />
                </div>
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-purple-600 dark:text-pink-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (validationErrors.confirmPassword) {
                        setValidationErrors({ ...validationErrors, confirmPassword: undefined });
                      }
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/80 dark:bg-slate-700/50 border-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition ${
                      validationErrors.confirmPassword
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-purple-200 dark:border-purple-700'
                    }`}
                  />
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {(error || authError) && (
                <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    {error || authError}
                  </p>
                </div>
              )}

              {/* Sign Up Button */}
              <Button
                type="submit"
                disabled={loading}
                className="gradient-btn w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          )}

          {/* Sign In Link */}
          {!success && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setLocation('/login');
                  }}
                  className="font-semibold text-purple-600 dark:text-pink-400 hover:text-purple-700 dark:hover:text-pink-300 transition"
                >
                  Sign in here
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Info Box */}
        {!success && (
          <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Password must contain uppercase, lowercase, and numbers
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
