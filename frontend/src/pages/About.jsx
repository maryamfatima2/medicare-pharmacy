import { ShieldCheck, Users, Heart, Award, CheckCircle2, Pill, Truck, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { BRAND } from '../constants/brand';

const About = () => {
  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="bg-primary-900 text-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-6"
          >
            We Care About <br /><span className="text-primary-400">Your Health</span>
          </motion.h1>
          <p className="text-xl text-primary-200 max-w-2xl mx-auto">
            {BRAND.fullName} is Pakistan&apos;s leading digital healthcare platform, committed to accessible and authentic medical care.
          </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-400 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-12">
        <div className="bg-white rounded-3xl shadow-2xl p-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <Users className="w-8 h-8" />, label: 'Happy Customers', value: '50k+' },
            { icon: <Pill className="w-8 h-8" />, label: 'Medicines', value: '10k+' },
            { icon: <Truck className="w-8 h-8" />, label: 'Cities Covered', value: '100+' },
            { icon: <Award className="w-8 h-8" />, label: 'Awards Won', value: '15+' },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="text-primary-600 flex justify-center mb-2">{stat.icon}</div>
              <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
              <p className="text-gray-500 font-bold text-sm uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-24 space-y-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-4xl font-black text-gray-900">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              At {BRAND.name}, we believe that healthcare should be simple, affordable, and accessible to everyone. We started with a vision to revolutionize the pharmacy experience in Pakistan by combining technology with professional pharmaceutical care.
            </p>
            <div className="space-y-4">
              {[
                "100% Genuine and authentic medicines",
                "Qualified pharmacists for verification",
                "Temperature controlled storage and delivery",
                "Transparent pricing and great discounts"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary-600" />
                  <span className="font-bold text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800" 
              className="rounded-3xl shadow-2xl" 
              alt="Pharmacy"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Quality First", desc: "We source our products directly from manufacturers and authorized distributors.", icon: <ShieldCheck className="w-10 h-10" /> },
            { title: "Customer Centric", desc: "Our 24/7 support team and pharmacists are always here to help you.", icon: <Heart className="w-10 h-10" /> },
            { title: "Global Standards", desc: "We follow international best practices in pharmacy management and logistics.", icon: <Globe className="w-10 h-10" /> },
          ].map((item, i) => (
            <div key={i} className="card p-10 text-center space-y-4 hover:border-primary-200 transition-all">
              <div className="bg-primary-50 w-20 h-20 rounded-2xl flex items-center justify-center text-primary-600 mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
