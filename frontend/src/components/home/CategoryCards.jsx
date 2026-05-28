import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import MedicineCard from '../medicine/MedicineCard';

const CategoryCards = ({ category }) => {
  if (!category || !category.products || category.products.length === 0) return null;

  return (
    <section className="bg-slate-50 dark:bg-navy-900/40 py-12 lg:py-16 border-t border-slate-200 dark:border-white/5 transition-colors">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 p-5 md:p-6 bg-sky-50 dark:bg-sky-900/20 rounded-2xl border border-sky-100 dark:border-sky-800/50 gap-4">
          <div className="relative pl-5">
            <div className="absolute left-0 top-1.5 bottom-1.5 w-1.5 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full shadow-sm" />
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl bg-primary-100 dark:bg-primary-900/30 p-2 rounded-2xl">
                {category.icon || '💊'}
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {category.name}
              </h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {category.description || 'Discover top products in this category.'}
            </p>
          </div>
          <Link 
            to={`/medicines?category=${category.name}`} 
            className="group flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-sm hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {category.products.slice(0, 12).map((product, index) => {
            const mappedProduct = {
              ...product,
              averageRating: product.rating,
              stock: product.inStock ? 50 : 0,
              discountPrice: product.discount ? Number((product.price * (1 - product.discount/100)).toFixed(2)) : 0,
              category: { name: category.name },
              genericName: product.brand
            };
            
            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="h-full"
              >
                <MedicineCard medicine={mappedProduct} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
