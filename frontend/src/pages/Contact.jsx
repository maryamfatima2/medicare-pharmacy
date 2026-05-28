import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../api/axios';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/contact', formData);
      toast.success('Message sent! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to send message';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4">Get in Touch</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">Have questions? We're here to help you 24/7.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Info Cards */}
          <div className="space-y-6">
            <div className="card p-8 flex items-start gap-6 border-l-4 border-primary-600 dark:border-primary-500">
              <div className="bg-primary-50 dark:bg-primary-500/10 p-4 rounded-2xl text-primary-600 dark:text-primary-400">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Call Us</h3>
                <p className="text-slate-600 dark:text-slate-300 font-medium">+92 300 1234567</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Mon-Sun, 24/7</p>
              </div>
            </div>

            <div className="card p-8 flex items-start gap-6 border-l-4 border-secondary-600 dark:border-secondary-500">
              <div className="bg-secondary-50 dark:bg-secondary-500/10 p-4 rounded-2xl text-secondary-600 dark:text-secondary-400">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Email Support</h3>
                <p className="text-slate-600 dark:text-slate-300 font-medium">support@healora.com</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Response within 2 hours</p>
              </div>
            </div>

            <div className="card p-8 flex items-start gap-6 border-l-4 border-amber-500">
              <div className="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-2xl text-amber-600 dark:text-amber-400">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Main Branch</h3>
                <p className="text-slate-600 dark:text-slate-300 font-medium">123 Health St, Karachi</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Flagship Store</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-10">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                <MessageSquare className="w-7 h-7 text-primary-600 dark:text-primary-400" /> Send a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Your Name</label>
                    <input 
                      required 
                      className="input-field" 
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                    <input 
                      required 
                      type="email" 
                      className="input-field" 
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Subject</label>
                  <input 
                    required 
                    className="input-field" 
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Message</label>
                  <textarea 
                    required 
                    className="input-field h-40 pt-4" 
                    placeholder="Your message here..."
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5" /> Send Message</>}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
