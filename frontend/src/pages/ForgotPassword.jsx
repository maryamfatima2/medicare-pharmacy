import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../components/brand/Logo';
import { BRAND } from '../constants/brand';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatus('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus('If this email is registered, recovery instructions have been sent.');
      setEmail('');
    } catch (err) {
      setError('Unable to send recovery instructions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
        <div className="text-center mb-10 flex flex-col items-center">
          <Logo linked={false} size="lg" showTagline />
          <h1 className="text-3xl font-black text-slate-900 mt-8">Reset Your Password</h1>
          <p className="text-slate-500 mt-2">Enter your email and we&apos;ll send a link to reset your password.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
          {status && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {status}
            </div>
          )}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center space-y-3">
            <p className="text-slate-500 text-sm">
              Don&apos;t have access to this email? <Link to="/contact" className="text-blue-600 font-bold hover:underline">Contact support</Link>
            </p>
            <p className="text-slate-500 text-sm">
              Remembered your password? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
