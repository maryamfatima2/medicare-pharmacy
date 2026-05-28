import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../components/brand/Logo';
import { BRAND } from '../constants/brand';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  // Auto-fill from localStorage on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberMe_email');
    const wasSaved = localStorage.getItem('rememberMe_checked') === 'true';
    if (savedEmail && wasSaved) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (rememberMe) {
        localStorage.setItem('rememberMe_email', email);
        localStorage.setItem('rememberMe_checked', 'true');
      } else {
        localStorage.removeItem('rememberMe_email');
        localStorage.removeItem('rememberMe_checked');
      }
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
        <div className="text-center mb-10 flex flex-col items-center">
          <Logo linked={false} size="lg" showTagline />
          <h1 className="text-3xl font-black text-slate-900 mt-8">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Sign in to your {BRAND.fullName} account and continue shopping with ease.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
          {error && (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  autoComplete="email"
                  required
                  className="input-field pl-12"
                  placeholder="name@healora.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="input-field pl-12 pr-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3 text-slate-400 hover:text-blue-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border border-slate-300 cursor-pointer accent-blue-600"
                />
                Keep me signed in
              </label>
              <Link to="/forgot-password" className="text-sm font-semibold text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <p className="text-xs text-slate-500">Only your email address is saved locally for convenience.</p>
            <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500">
              Don&apos;t have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Create One</Link>
            </p>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-100 p-4 rounded-2xl text-xs text-blue-900 text-center">
          <strong>Demo User:</strong> john@healora.com / user123 <br />
          <strong>Demo Admin:</strong> admin@healora.com / admin123
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
