import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, X, Briefcase, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('employee');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Auto-detect role from email pattern
  useEffect(() => {
    if (!email) return;
    const lower = email.toLowerCase();
    if (lower.startsWith('admin') || lower.startsWith('hr')) {
      setRole('admin');
    } else if (lower.includes('.mehta@') || lower.includes('.employee@') || lower.includes('emp')) {
      setRole('employee');
    }
  }, [email]);

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 4) {
      errors.password = 'Password must be at least 4 characters';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password, role);
      navigate(role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const clearFieldError = (field) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#d4af37] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Subtle decorative circles */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0B0E14] mb-4 shadow-lg">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 3L28 9V23L16 29L4 23V9L16 3Z" stroke="#d4af37" strokeWidth="2" fill="none"/>
              <path d="M16 10L22 13V19L16 22L10 19V13L16 10Z" fill="#d4af37"/>
              <circle cx="16" cy="16" r="2" fill="#0B0E14"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in to your employee portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8">
          {/* Role Toggle — Segmented Control */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-6">
            <button
              type="button"
              onClick={() => setRole('employee')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all duration-200 ${
                role === 'employee'
                  ? 'bg-[#d4af37] text-[#0B0E14]'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Employee
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all duration-200 ${
                role === 'admin'
                  ? 'bg-[#d4af37] text-[#0B0E14]'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin / HR
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg p-3 mb-6 text-sm"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="flex-1">{error}</p>
              <button onClick={() => setError('')} className="shrink-0 mt-0.5 hover:text-rose-900">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`w-4 h-4 ${fieldErrors.email ? 'text-rose-500' : 'text-gray-400'}`} />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }}
                  className={`block w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border transition-colors
                    ${fieldErrors.email
                      ? 'border-rose-500 text-rose-900 placeholder-rose-400 focus:ring-2 focus:ring-rose-500 focus:border-rose-500'
                      : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37]'
                    }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-rose-600">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`w-4 h-4 ${fieldErrors.password ? 'text-rose-500' : 'text-gray-400'}`} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); }}
                  className={`block w-full pl-10 pr-11 py-2.5 text-sm rounded-lg border transition-colors
                    ${fieldErrors.password
                      ? 'border-rose-500 text-rose-900 placeholder-rose-400 focus:ring-2 focus:ring-rose-500 focus:border-rose-500'
                      : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37]'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-rose-600">{fieldErrors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 bg-[#d4af37] text-[#0B0E14] hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Hint */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              <span className="font-semibold text-gray-700">Demo:</span> Enter any email &amp; password
              <span className="text-gray-400"> (except "wrong")</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          © {new Date().getFullYear()} Dayflow HR Portal
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
