import { Link } from 'react-router-dom';
import { Upload, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { BRAND } from '../../constants/brand';

const PrescriptionBanner = () => (
  <section className="container mx-auto px-4 -mt-6 relative z-20 mb-8">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid md:grid-cols-2 gap-4"
    >
      <div className="card-dark flex flex-col sm:flex-row items-center gap-6 p-6 border-primary-100 dark:border-primary-500/20 bg-gradient-to-r from-primary-50 to-white dark:from-primary-950/50 dark:to-navy-900/80">
        <div className="w-14 h-14 rounded-2xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
          <Upload className="w-7 h-7 text-primary-400" />
        </div>
        <div className="flex-grow text-center sm:text-left">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Upload your prescription</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Get medicines at your door — no hassle.</p>
        </div>
        <Link to="/contact" className="btn-primary whitespace-nowrap text-sm py-2.5 px-5">
          Upload Rx
        </Link>
      </div>
      <div className="card-dark flex items-center gap-4 p-6">
        <MapPin className="w-8 h-8 text-accent-400 flex-shrink-0" />
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Deliver to</p>
          <p className="text-slate-900 dark:text-white font-bold">Lahore · Karachi · Islamabad</p>
          <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">{BRAND.fullName} nationwide</p>
        </div>
      </div>
    </motion.div>
  </section>
);

export default PrescriptionBanner;
