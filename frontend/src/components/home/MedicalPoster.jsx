import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { PROMOTIONAL_POSTERS } from '../../constants/BannerData';

const MedicalPoster = () => {
  return (
    <section className="bg-white dark:bg-navy-950 py-12 transition-colors">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROMOTIONAL_POSTERS.map((poster, index) => (
            <motion.div
              key={poster.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Link 
                to={poster.link}
                className={`group relative flex flex-col justify-end h-[280px] rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-t ${poster.color}`}
              >
                {/* Background Image with lazy load */}
                <img 
                  src={poster.image} 
                  alt={poster.title} 
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                />
                
                {/* Overlay gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

                {/* Content */}
                <div className="relative z-10 p-6 md:p-8 flex flex-col gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="bg-white/20 backdrop-blur-md self-start rounded-full px-3 py-1 text-xs font-semibold text-white flex items-center gap-1.5 mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> Trusted
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-tight">
                    {poster.title}
                  </h3>
                  <p className="text-slate-200 text-sm font-medium">
                    {poster.subtitle}
                  </p>
                  
                  <div className="mt-2 flex items-center gap-2 text-white/90 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    Shop Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MedicalPoster;
