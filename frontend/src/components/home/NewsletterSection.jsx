import { useState } from 'react';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import ScrollReveal from '../common/ScrollReveal';
import { BRAND } from '../../constants/brand';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await API.post('/newsletter/subscribe', { email });
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-dark container mx-auto px-4 pb-20">
      <ScrollReveal>
        <div className="relative overflow-hidden rounded-3xl border border-primary-100 dark:border-primary-500/20 bg-gradient-to-br from-white via-primary-50 to-slate-100 dark:from-navy-900 dark:via-primary-950/30 dark:to-navy-950 p-10 lg:p-14">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mb-3">Subscribe for exclusive offers</h2>
              <p className="text-slate-600 dark:text-slate-400">Health tips, new arrivals & up to 10% off — from {BRAND.fullName}.</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input type="email" required placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field flex-1" />
              <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 py-4 px-8">
                {loading ? '...' : <>Subscribe <Send className="w-4 h-4" /></>}
              </button>
            </form>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default NewsletterSection;
