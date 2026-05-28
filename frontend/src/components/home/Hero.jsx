import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/doctor_template_hero_1779953857954.png';

const Hero = () => (
  <section className="relative w-full h-[70vh] md:h-[80vh] bg-primary-hero overflow-hidden">
    <img src={heroImage} alt="Doctor Hero" className="absolute inset-0 w-full h-full object-cover opacity-30" />
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
        Your Trusted Pharmacy Partner
      </h1>
      <p className="text-lg md:text-xl text-white mb-6 max-w-2xl drop-shadow-md">
        Genuine medicines, fast delivery, and personalized care.
      </p>
      <Link to="/medicines" className="btn-primary text-lg font-semibold px-8 py-3">
        Shop Now
      </Link>
    </div>
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-primary-600/30 to-primary-900/70 pointer-events-none" />
  </section>
);

export default Hero;
