import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Star, Percent } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../api/axios';
import MedicineCard from '../components/medicine/MedicineCard';
import HeroCarousel from '../components/home/HeroCarousel';

import MedicalBannerSlider from '../components/home/MedicalBannerSlider';
import CategoryCards from '../components/home/CategoryCards';
import PrescriptionBanner from '../components/home/PrescriptionBanner';
import TrustBar from '../components/home/TrustBar';
import WhyChooseUs from '../components/home/WhyChooseUs';
import NewsletterSection from '../components/home/NewsletterSection';
import SectionHeader from '../components/common/SectionHeader';
import ProductSkeleton from '../components/common/ProductSkeleton';
import ScrollReveal from '../components/common/ScrollReveal';
import { BRAND } from '../constants/brand';
import { getMedicineImage } from '../constants/medicineImages';

const OFFERS = [
  { title: 'Free Delivery', subtitle: 'Orders above Rs. 2000', image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&h=400&fit=crop&q=80', link: '/medicines', color: 'from-navy-800 to-primary-900/50' },
  { title: 'Rx Upload', subtitle: 'Pharmacist verified', image: getMedicineImage('Augmentin 625'), link: '/contact', color: 'from-navy-800 to-navy-900' },
];

const TESTIMONIALS = [
  { name: 'Malik Veer', city: 'Lahore', text: 'Excellent quick delivery with 100% original products. Highly recommended!', date: 'May 2025' },
  { name: 'Saima Akram', city: 'Karachi', text: 'Prescription upload made ordering so easy. Very satisfied with the service.', date: 'Jun 2025' },
  { name: 'Dr. Usman Ali', city: 'Islamabad', text: `I recommend ${BRAND.fullName} to patients for genuine medicines and fast support.`, date: 'Sep 2025' },
];



const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [loadingHome, setLoadingHome] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, medRes] = await Promise.all([
          API.get('/categories'),
          API.get('/medicines', { params: { page: 1, limit: 100 } }),
        ]);

        const allMeds = Array.isArray(medRes.data)
          ? medRes.data
          : medRes.data.medicines || [];

        const featuredProducts = allMeds.filter((m) => m.isFeatured && m.isActive);
        const bestsellerProducts = allMeds.filter((m) => m.isBestSeller && m.isActive);

        const sortedBySales = [...allMeds].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));

        setFeatured(featuredProducts.length ? featuredProducts.slice(0, 4) : sortedBySales.slice(0, 4));
        setBestsellers(bestsellerProducts.length ? bestsellerProducts.slice(0, 8) : sortedBySales.slice(0, 8));
        setCategories(catRes.data || []);

        const catsWithMeds = (catRes.data || [])
          .map((cat) => ({
            ...cat,
            products: allMeds.filter((m) => m.category?._id === cat._id || m.category === cat._id || m.category?.name === cat.name),
          }))
          .filter((cat) => cat.products && cat.products.length > 0);

        setDynamicCategories(catsWithMeds);
      } catch (error) {
        console.error('Error fetching home data', error);
      } finally {
        setLoadingHome(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <HeroCarousel />
      <MedicalBannerSlider />

      <section className="section-dark bg-slate-100/50 dark:bg-navy-900/30 border-y border-slate-200 dark:border-white/5">
        <div className="container mx-auto px-4">
          <SectionHeader title="Featured Products" subtitle="Hand-picked healthcare essentials" linkTo="/medicines" />
          {loadingHome ? (
            <ProductSkeleton count={4} />
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.slice(0, 4).map((m) => <MedicineCard key={m._id} medicine={m} />)}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-600 dark:text-slate-300">No featured products available right now.</div>
          )}
        </div>
      </section>

      <section className="section-dark container mx-auto px-4">
        <SectionHeader title="Top Selling Products" subtitle="Get necessities at up to 10% discount" linkTo="/medicines" linkLabel="Shop All" />
        {loadingHome ? (
          <ProductSkeleton count={4} />
        ) : bestsellers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.slice(0, 8).map((m) => <MedicineCard key={m._id} medicine={m} />)}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-600 dark:text-slate-300">No best selling products available right now.</div>
        )}
      </section>

      {/* Dynamic Category Sections with Products */}
      {dynamicCategories.slice(0, 4).map((category) => (
        <CategoryCards key={category._id} category={category} />
      ))}

      <section className="section-dark container mx-auto px-4">
        <SectionHeader title="Special Offers" subtitle="Limited-time healthcare deals" />
        <div className="grid md:grid-cols-3 gap-4">
          {OFFERS.map((offer) => (
            <ScrollReveal key={offer.title}>
              <Link to={offer.link} className={`card-dark flex items-center gap-4 p-6 bg-gradient-to-br ${offer.color} hover:shadow-glow group`}>
                <img src={offer.image} alt="" className="w-20 h-20 rounded-2xl object-cover border border-white/10 flex-shrink-0" />
                <div>
                  <span className="inline-flex items-center gap-1 text-accent-500 dark:text-accent-400 text-xs font-black uppercase mb-1"><Percent className="w-3 h-3" />{offer.title}</span>
                  <p className="text-slate-900 dark:text-white font-bold">{offer.subtitle}</p>
                  <span className="text-primary-400 text-sm font-semibold group-hover:gap-2 inline-flex items-center gap-1 mt-2">Shop <ArrowRight className="w-4 h-4" /></span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <WhyChooseUs />

      <section className="section-dark container mx-auto px-4">
        <div className="card-dark p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 bg-gradient-to-r from-rose-50 to-white dark:from-rose-950/40 dark:to-navy-900 border border-rose-100 dark:border-rose-500/20">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Emergency Support</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md">Priority delivery for urgent medicines — available 24/7.</p>
          </div>
          <a href={`tel:${BRAND.phone.replace(/\s/g, '')}`} className="btn-primary inline-flex items-center gap-2 whitespace-nowrap">
            <Phone className="w-5 h-5" /> {BRAND.phone}
          </a>
        </div>
      </section>



      <section className="section-dark bg-slate-50 dark:bg-navy-900/40 border-t border-slate-200 dark:border-white/5">
        <div className="container mx-auto px-4">
          <SectionHeader title="What Our Customers Say" subtitle="Real reviews from across Pakistan" />
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 0.1}>
                <div className="bg-white dark:bg-navy-800 p-8 h-full flex flex-col rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                    <svg className="w-24 h-24 text-slate-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/></svg>
                  </div>
                  <div className="flex gap-1 text-amber-500 dark:text-amber-400 mb-6 relative z-10">{[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}</div>
                  <p className="text-slate-700 dark:text-slate-300 italic flex-grow leading-relaxed text-lg font-medium relative z-10">&ldquo;{t.text}&rdquo;</p>
                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-black text-xl shadow-md">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{t.name}</p>
                      <p className="text-slate-500 text-sm">From {t.city} · {t.date}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </div>
  );
};

export default Home;
