import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Truck, Sparkles } from 'lucide-react';
import { BRAND } from '../../constants/brand';
import FloatingMedicines from './FloatingMedicines';
import { getMedicineImage } from '../../constants/medicineImages';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { HERO_SLIDES } from '../../constants/BannerData';

const HeroSlider = () => (
  <section className="relative min-h-[85vh] lg:min-h-[88vh] overflow-hidden bg-slate-50 dark:bg-navy-950 transition-colors duration-300">
    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-slate-50 dark:from-primary-950/20 dark:to-navy-950 pointer-events-none z-[1]" />
    <Swiper
      modules={[Autoplay, EffectFade, Pagination, Navigation]}
      effect="fade"
      speed={1000}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true, dynamicBullets: true }}
      navigation
      loop
      className="h-[85vh] lg:h-[88vh] hero-swiper"
    >
      {HERO_SLIDES.map((slide, index) => (
        <SwiperSlide key={slide.id || index}>
          <div className="relative h-full flex items-center">
            <div className="absolute inset-0">
              <img src={slide.image} alt="" className="w-full h-full object-cover opacity-15 dark:opacity-25" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/90 to-slate-50/40 dark:from-navy-950 dark:via-navy-950/85 dark:to-navy-900/40" />
            </div>
            <div className="container mx-auto px-4 relative z-10 py-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, rotateY: 12 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                  className="hidden lg:block relative h-[400px]"
                  style={{ perspective: '1000px' }}
                >
                  <FloatingMedicines />
                  <motion.div
                    animate={{ y: [0, -14, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-glow ring-2 ring-primary-500/20 bg-white dark:bg-navy-800"
                  >
                    <img src={getMedicineImage('Panadol Extra')} alt="Featured medicine" className="w-full h-full object-contain p-4" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

export default HeroSlider;
