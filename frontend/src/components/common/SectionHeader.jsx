import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const SectionHeader = ({ title, subtitle, linkTo, linkLabel = 'View All' }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 p-5 md:p-6 bg-sky-50 dark:bg-sky-900/20 rounded-2xl border border-sky-100 dark:border-sky-800/50">
    <div className="relative pl-5">
      <div className="absolute left-0 top-1.5 bottom-1.5 w-1.5 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full shadow-sm" />
      <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
      {subtitle && <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{subtitle}</p>}
    </div>
    {linkTo && (
      <Link
        to={linkTo}
        className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold hover:text-primary-700 dark:hover:text-primary-300 transition-colors group text-sm"
      >
        {linkLabel}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    )}
  </div>
);

export default SectionHeader;
