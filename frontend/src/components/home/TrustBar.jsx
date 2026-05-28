import { ShieldCheck, Truck, Clock, BadgeCheck } from 'lucide-react';
import ScrollReveal from '../common/ScrollReveal';

const items = [
  { icon: BadgeCheck, title: '100% Original', desc: 'Licensed distributors only', color: 'text-accent-400' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Same-day in major cities', color: 'text-primary-400' },
  { icon: ShieldCheck, title: 'Secure Checkout', desc: 'Safe COD & payments', color: 'text-primary-300' },
  { icon: Clock, title: '24/7 Support', desc: 'Pharmacist assistance', color: 'text-accent-300' },
];

const TrustBar = () => (
  <section className="container mx-auto px-4 -mt-10 relative z-20 mb-4">
    <ScrollReveal>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {items.map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="card-dark flex items-center gap-4 p-4 lg:p-5 hover:border-primary-200 dark:hover:border-primary-500/25">
            <div className={`p-3 rounded-xl bg-slate-100 dark:bg-navy-800 ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h5>
              <p className="text-slate-600 dark:text-slate-500 text-xs">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollReveal>
  </section>
);

export default TrustBar;
