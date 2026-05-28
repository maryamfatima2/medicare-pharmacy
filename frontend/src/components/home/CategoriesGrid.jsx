import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../common/ScrollReveal';

const CategoriesGrid = ({ categories }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
      {categories.slice(0, 10).map((cat, i) => (
        <ScrollReveal key={cat._id} delay={i * 0.04}>
          <Link 
            to={`/medicines?category=${cat._id}`} 
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-navy-900 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20 text-3xl mb-4 group-hover:scale-110 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 transition-all">
              {cat.icon || '💊'}
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-center text-sm group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors line-clamp-1">
              {cat.name}
            </h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 text-center font-medium">
              {cat.productCount || 0}+ Products
            </p>
          </Link>
        </ScrollReveal>
      ))}
    </div>
  );
};

export default CategoriesGrid;
