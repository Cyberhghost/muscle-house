'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    title: 'POUSSE TES LIMITES',
    subtitle: 'LA PERFORMANCE COMMENCE ICI',
    cta: 'Découvrir',
    ctaLink: '/categories',
  },
  {
    title: 'QUALITÉ PREMIUM',
    subtitle: 'COMPLÉMENTS 100% AUTHENTIQUES',
    cta: 'Voir les promos',
    ctaLink: '/promos',
  },
  {
    title: 'LIVRAISON RAPIDE',
    subtitle: "DANS LES 48 WILAYAS D'ALGÉRIE",
    cta: 'Commander',
    ctaLink: '/categories',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <section className="relative h-[88vh] min-h-[500px] flex items-center overflow-hidden mt-16">
      {/* Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a3a5c]/40 to-[#0a0a0a]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 50%, rgba(26,58,92,0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(0,212,170,0.08) 0%, transparent 40%)
          `,
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <p className="text-[#00d4aa] text-sm font-semibold tracking-widest uppercase mb-4">
            Compléments Sportifs Premium
          </p>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-2 leading-none tracking-tight">
            {slides[current].title}
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-[#00d4aa] mb-6">
            {slides[current].subtitle}
          </h2>

          <p className="text-gray-300 text-lg mb-10 max-w-xl">
            Compléments 100% authentiques • Livraison rapide 48 wilayas • Support WhatsApp direct
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href={slides[current].ctaLink}
              className="bg-[#00d4aa] text-[#0a0a0a] font-bold px-8 py-4 rounded-lg hover:bg-[#00b894] transition-all transform hover:scale-105"
            >
              {slides[current].cta}
            </Link>
            <Link
              href="/nouveautes"
              className="border-2 border-[#00d4aa] text-[#00d4aa] font-bold px-8 py-4 rounded-lg hover:bg-[#00d4aa] hover:text-[#0a0a0a] transition-all"
            >
              Nouveautés
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all"
        aria-label="Précédent"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all"
        aria-label="Suivant"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-[#00d4aa] w-6' : 'bg-white/30'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
