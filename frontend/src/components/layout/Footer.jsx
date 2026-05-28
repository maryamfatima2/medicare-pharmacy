import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Send } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Logo from '../brand/Logo';
import { BRAND } from '../../constants/brand';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await API.post('/newsletter/subscribe', { email });
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-navy-950 border-t border-white/5 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-5">
            <Logo linked={false} size="md" showTagline />
            <p className="text-slate-400 text-sm leading-relaxed">{BRAND.tagline}. Genuine medicines with fast delivery across Pakistan.</p>
            <div className="flex gap-2">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="p-2.5 rounded-xl bg-navy-800 border border-white/5 text-slate-400 hover:text-primary-300 hover:border-primary-500/30 transition-all" aria-label="Social">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/medicines" className="hover:text-primary-300 transition-colors">All Medicines</Link></li>
              <li><Link to="/about" className="hover:text-primary-300 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary-300 transition-colors">Contact</Link></li>
              <li><Link to="/wishlist" className="hover:text-primary-300 transition-colors">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-5">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex gap-3"><MapPin className="w-5 h-5 text-primary-400 flex-shrink-0" /><span>{BRAND.address}</span></li>
              <li className="flex gap-3"><Phone className="w-5 h-5 text-accent-400 flex-shrink-0" /><span>{BRAND.phone}</span></li>
              <li className="flex gap-3"><Mail className="w-5 h-5 text-primary-400 flex-shrink-0" /><span>{BRAND.supportEmail}</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-5">Newsletter</h4>
            <p className="text-slate-400 text-sm mb-4">Get up to 10% off on health essentials.</p>
            <form onSubmit={handleSubscribe} className="relative">
              <input type="email" required placeholder="Your email" className="input-field pr-12" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit" disabled={loading} className="absolute right-2 top-2 p-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white disabled:opacity-50">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-slate-500 text-center">
          <p>{BRAND.copyright}</p>
          <div className="flex gap-6 mt-2 md:mt-0 md:ml-4">
            <a href="#" className="hover:text-primary-300">Privacy</a>
            <a href="#" className="hover:text-primary-300">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
