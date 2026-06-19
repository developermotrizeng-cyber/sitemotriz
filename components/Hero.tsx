'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SiteContent } from '../lib/defaultData';
import { motion } from 'motion/react';

interface HeroProps {
  content: SiteContent['hero'];
  onCtaClick: () => void;
}

export default function Hero({ content, onCtaClick }: HeroProps) {
  return (
    <section 
      id="inicio"
      className="relative min-h-[640px] md:min-h-[720px] bg-[#45567e] text-white flex items-center justify-center overflow-hidden"
    >
      {/* Background Image / Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={content.backgroundUrl || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80"} 
          alt="Construção fundo" 
          className="w-full h-full object-cover opacity-25 mix-blend-multiply"
          referrerPolicy="no-referrer"
        />
        {/* Soft elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2d3f65] via-transparent to-[#2d3f65]/40" />
      </div>

      {/* Decorative Blueprint Grid Lines */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 flex flex-col justify-between min-h-[600px]">
        {/* Empty spacing for layout flow */}
        <div className="hidden md:block h-6" />

        {/* Hero Central Content */}
        <div className="max-w-4xl text-left space-y-6">
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-sans text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-white uppercase text-balance"
            id="hero-header-title"
          >
            {content.title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="h-1 w-20 bg-white opacity-80" 
          />

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-body text-lg sm:text-xl text-[#ceddff] max-w-2xl font-light leading-relaxed text-pretty"
            id="hero-header-subtitle"
          >
            {content.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="pt-4"
          >
            <button
              onClick={onCtaClick}
              className="group flex items-center gap-2 bg-[#2d3f65] border border-white hover:bg-white hover:text-[#2d3f65] text-white px-8 py-4 font-sans text-xs font-extrabold tracking-widest transition-all duration-300 rounded"
              id="hero-cta-btn"
            >
              <span>{content.ctaText.toUpperCase()}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
            </button>
          </motion.div>
        </div>

        {/* Hero Bottom Tags Footer row */}
        {content.bottomTags && content.bottomTags.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="pt-16 border-t border-white/20 grid grid-cols-3 max-w-3xl gap-4"
          >
            {content.bottomTags.map((tag, idx) => (
              <div key={idx} className="flex items-center space-x-3 group">
                <span className="font-sans text-xs sm:text-sm font-bold tracking-[0.2em] text-[#bbccfb] uppercase transition-colors group-hover:text-white">
                  {tag}
                </span>
                {idx < content.bottomTags.length - 1 && (
                  <div className="hidden sm:block flex-grow h-[1px] bg-white/20" />
                )}
              </div>
            ))}
          </motion.div>
        )}

      </div>
    </section>
  );
}
