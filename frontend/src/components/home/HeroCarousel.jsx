import React, { useEffect, useState } from 'react';
import pharmacyHeroHand from '../../assets/pharmacy_hero_hand.png';


// Simple auto‑play carousel without external dependencies
const images = [pharmacyHeroHand].filter(Boolean);

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // 5 s per slide
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden bg-primary-hero">
      {/* Background image */}
      {images.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt={`Hero slide ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${idx === current ? 'opacity-100' : 'opacity-0'}
            `}
        />
      ))}
        {/* Overlay content: two CTA buttons at the bottom */}
        <div className="absolute bottom-8 left-0 right-0 z-10 flex flex-row items-center justify-center gap-4 px-4">
          <a href="/contact" className="px-8 py-3 bg-white/90 backdrop-blur text-primary-600 border-2 border-primary-500 rounded-lg hover:bg-white transition-colors font-semibold shadow-lg">
            Upload Prescription
          </a>
          <a href="/medicines" className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-semibold shadow-lg">
            Explore Medicines
          </a>
        </div>

    </section>
  );
};

export default HeroCarousel;
