'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Lightbulb, Gem, Target, Shield, Award, HelpCircle, Compass, HardHat } from 'lucide-react';
import { SiteContent } from '../lib/defaultData';

function AnimatedCounter({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState('0');
  const elementRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const match = value.match(/^(\d+)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }
    
    const target = parseInt(match[1], 10);
    const suffix = match[2] || '';
    
    let observer: IntersectionObserver | null = null;
    let animated = false;
    
    const startAnimation = () => {
      if (animated) return;
      animated = true;
      
      const duration = 2000; // 2 seconds animation
      const startTime = performance.now();
      
      const updateCount = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function: easeOutQuad
        const easeProgress = progress * (2 - progress);
        
        const current = Math.floor(easeProgress * target);
        setDisplayValue(`${current}${suffix}`);
        
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          setDisplayValue(value);
        }
      };
      
      requestAnimationFrame(updateCount);
    };
    
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          startAnimation();
          if (observer && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      }, { threshold: 0.1 });
      
      if (elementRef.current) {
        observer.observe(elementRef.current);
      }
    } else {
      startAnimation();
    }
    
    return () => {
      if (observer && elementRef.current) {
        observer.disconnect();
      }
    };
  }, [value]);
  
  return <span ref={elementRef}>{displayValue}</span>;
}

const mvvIconMap: Record<string, React.ComponentType<any>> = {
  Lightbulb: Lightbulb,
  Gem: Gem,
  Target: Target,
  Shield: Shield,
  Award: Award,
  Compass: Compass,
  HardHat: HardHat
};

interface AboutProps {
  content: SiteContent['about'];
}

export default function About({ content }: AboutProps) {
  return (
    <section id="quem-somos" className="py-12 bg-[#fcf9f8] text-[#1b1c1c]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text and Stats side */}
          <div className="lg:col-span-7 space-y-8" id="about-content-left">
            <div className="space-y-4">
              <span className="font-sans text-xs font-bold tracking-[0.2em] text-[#505f7c] uppercase block">
                {content.tag}
              </span>
              <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#2d3f65]" id="about-title">
                {content.title}
              </h2>
            </div>

            <p className="font-body text-[#44464e] leading-relaxed text-lg font-light text-pretty" id="about-description">
              {content.description}
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4" id="about-stats-container">
              {content.stats && content.stats.map((stat) => (
                <div 
                  key={stat.id} 
                  className="flex flex-col border-l-4 border-[#2d3f65] bg-[#f6f3f2] p-6 transition-all duration-300 hover:bg-[#eae7e7] rounded"
                >
                  <span className="font-sans text-3xl sm:text-4xl font-extrabold text-[#2d3f65] tracking-tight">
                    <AnimatedCounter value={stat.value} />
                  </span>
                  <span className="font-sans text-xs font-bold text-[#505f7c] tracking-[0.1em] mt-2 uppercase">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image side */}
          <div className="lg:col-span-5" id="about-content-right">
            <div className="relative group overflow-hidden bg-[#e5e2e1] rounded p-1 shadow-sm border border-[#E2E8F0]">
              <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden rounded">
                <img 
                  src={content.imageUrl || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80"} 
                  alt="Engenheira vistoriando obra" 
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {/* Visual tone matching overlay */}
                <div className="absolute inset-0 bg-[#2d3f65]/5 opacity-30 group-hover:opacity-0 transition-opacity duration-300" />
              </div>
              
              {/* Minimal geometric frame graphic */}
              <div className="absolute top-4 right-4 h-6 w-6 border-t-2 border-r-2 border-white/80 pointer-events-none" />
              <div className="absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-white/80 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Mission, Vision, Values and Expertise grid section (Anexo01) */}
        {content.mvv && content.mvv.length > 0 && (
          <div className="mt-16 sm:mt-20 border-t border-[#f0eded] pt-12 sm:pt-16 scroll-mt-20" id="missao-visao-valores">
            
            {/* Pilares Header Block */}
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
              <span className="font-sans text-xs font-bold tracking-[0.2em] text-[#505f7c] uppercase block">
                Nossos Pilares de Engenharia
              </span>
              <h2 className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2d3f65]">
                Missão, Visão e Valores
              </h2>
              <div className="h-1 w-12 bg-sky-500 mx-auto rounded-full mt-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.mvv.map((item) => {
                const IconComponent = mvvIconMap[item.icon] || HelpCircle;
                return (
                  <div 
                    key={item.id}
                    className="group bg-white border border-[#E2E8F0] p-8 rounded shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
                    id={`about-mvv-card-${item.id}`}
                  >
                    {/* Top blue border highlight */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#2d3f65] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                    
                    {/* Centered blue icon */}
                    <div className="mb-6 p-4 bg-sky-50 rounded-full text-sky-500 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-10 w-10 stroke-[2]" />
                    </div>
                    
                    {/* Centered Bold Title */}
                    <h3 className="font-sans text-base font-extrabold tracking-widest text-[#2d3f65] mb-3 uppercase">
                      {item.title}
                    </h3>
                    
                    {/* Description narrative text */}
                    <p className="font-body text-xs sm:text-sm text-[#505f7c] leading-relaxed font-light">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
