import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { FULL_WIDTH_BANNERS } from '../../constants/BannerData';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const MedicalBannerSlider = () => {
  return (
    <section className="w-full bg-slate-900 overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        speed={800}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        loop
        className="w-full h-[300px] md:h-[400px] lg:h-[500px] medical-banner-swiper"
      >
        {FULL_WIDTH_BANNERS.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full h-full group overflow-hidden">
              {/* Background Image with Zoom on Hover */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={banner.image}
                  alt={banner.title}
                  onError={(e) => {
                    e.target.src = banner.fallbackImage;
                  }}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[10000ms] ease-out opacity-80"
                />
              </div>

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent dark:from-navy-950/95 dark:via-navy-900/70" />

              {/* Content Container */}
              <div className="relative h-full container mx-auto px-6 lg:px-12 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="max-w-2xl space-y-4 md:space-y-6"
                >
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Premium Healthcare
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                    {banner.title}
                  </h2>
                  
                  <p className="text-lg md:text-xl font-medium text-emerald-300">
                    {banner.subtitle}
                  </p>
                  
                  <p className="text-slate-300 text-sm md:text-base hidden sm:block max-w-xl">
                    {banner.desc}
                  </p>
                  
                  <div className="pt-2">
                    <Link
                      to={banner.link}
                      className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/30"
                    >
                      {banner.cta} <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Global styles override for this specific swiper to ensure pagination dots match the medical theme */}
      <style dangerouslySetInnerHTML={{__html: `
        .medical-banner-swiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
        }
        .medical-banner-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #10b981;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
      `}} />
    </section>
  );
};

export default MedicalBannerSlider;
