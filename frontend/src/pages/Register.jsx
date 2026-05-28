import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../components/brand/Logo';
import { BRAND } from '../constants/brand';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.phone);
    } catch (err) {
      // Handled in Context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center container mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full"
      >
        <div className="text-center mb-10 flex flex-col items-center">
          <Logo linked={false} size="lg" showTagline />
          <h1 className="text-3xl font-black text-slate-900 mt-8">Create Account</h1>
          <p className="text-slate-500 mt-2">Join {BRAND.fullName} for personalized healthcare</p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
              <div className="relative">
                <input
                  name="name"
                  type="text"
                  required
                  className="input-field pl-12"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
                <User className="absolute left-4 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  required
                  className="input-field pl-12"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Mail className="absolute left-4 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
              <div className="relative">
                <input
                  name="phone"
                  type="tel"
                  required
                  className="input-field pl-12"
                  placeholder="0300-1234567"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <Phone className="absolute left-4 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  className="input-field pl-12 pr-12"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Lock className="absolute left-4 top-2.5 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-2.5 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Register Now"}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-50 text-center">
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-primary-600 font-bold hover:underline">Login Here</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
