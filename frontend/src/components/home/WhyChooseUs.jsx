import { ShieldCheck, Truck, BadgeCheck, Headphones, FlaskConical, Clock } from 'lucide-react';
import ScrollReveal from '../common/ScrollReveal';
import { BRAND } from '../../constants/brand';

const features = [
  { icon: BadgeCheck, title: '100% Genuine', desc: 'Licensed distributors and verified stock.' },
  { icon: Truck, title: 'Express Delivery', desc: 'Same-day delivery in Lahore, Karachi & more.' },
  { icon: ShieldCheck, title: 'Secure Checkout', desc: 'COD and safe order processing.' },
  { icon: FlaskConical, title: 'Expert Pharmacists', desc: 'Professional dosage & interaction advice.' },
  { icon: Headphones, title: '24/7 Support', desc: 'Always here for orders and prescriptions.' },
  { icon: Clock, title: 'Easy Reorders', desc: 'One-tap refill from order history.' },
];

const WhyChooseUs = () => (
  <section className="section-dark container mx-auto px-4">
    <ScrollReveal>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-primary-600 dark:text-primary-400 font-bold text-xs uppercase tracking-widest">Why {BRAND.name}</span>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-2">Why Choose {BRAND.fullName}?</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-3">Premium pharmacy experience — inspired by the best, built uniquely for you.</p>
      </div>
    </ScrollReveal>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map((f, i) => (
        <ScrollReveal key={f.title} delay={i * 0.06}>
          <div className="card-dark p-6 hover:shadow-glow-teal group">
            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-gradient-to-br dark:from-primary-600/30 dark:to-accent-600/30 flex items-center justify-center text-primary-600 dark:text-primary-300 mb-4 group-hover:scale-110 transition-transform border border-primary-100 dark:border-primary-500/20">
              <f.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        </ScrollReveal>
      ))}
    </div>
  </section>
);

export default WhyChooseUs;
