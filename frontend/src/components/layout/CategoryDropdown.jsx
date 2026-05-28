import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axios';

const CategoryDropdown = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    API.get('/categories')
      .then((res) => setCategories(res.data.slice(0, 10)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="relative hidden lg:block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-800/80 border border-white/10 text-slate-200 font-semibold text-sm hover:border-primary-500/40 hover:text-primary-300 transition-all"
      >
        <LayoutGrid className="w-4 h-4 text-primary-400" />
        Categories
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute left-0 top-full mt-2 w-72 bg-navy-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-glass overflow-hidden z-[200] py-2"
          >
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/medicines?category=${cat._id}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-primary-500/10 text-slate-200 hover:text-primary-300 transition-colors"
              >
                <span className="text-xl">{cat.icon || '💊'}</span>
                <span className="font-medium text-sm">{cat.name}</span>
              </Link>
            ))}
            <Link
              to="/medicines"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-center text-primary-400 font-bold text-sm border-t border-white/5 hover:bg-white/5"
            >
              View All Medicines →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryDropdown;
