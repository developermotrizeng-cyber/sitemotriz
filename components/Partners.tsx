'use client';

import React from 'react';
import { SiteContent } from '../lib/defaultData';

interface PartnersProps {
  content: SiteContent['partners'];
}

export default function Partners({ content }: PartnersProps) {
  if (!content) return null;

  return (
    <section id="parceiros" className="py-16 bg-[#f0f4fa] border-t border-[#E2E8F0] text-[#1b1c1c]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl mx-auto mb-12">
          <span className="font-sans text-xs font-bold tracking-[0.2em] text-[#505f7c] uppercase block">
            {content.tag || "PARCEIROS"}
          </span>
          <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2d3f65] tracking-tight">
            {content.title || "Quem Confia no Nosso Trabalho"}
          </h2>
          <div className="h-1 w-16 bg-[#2d3f65] mx-auto opacity-40 mt-3" />
        </div>

        {/* Large Logo Cards Centered Wrapper */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto justify-center" id="partners-grid">
          {content.items && content.items.map((partner) => (
            <div 
              key={partner.id}
              className="bg-white border border-[#E2E8F0] rounded w-[160px] sm:w-[200px] aspect-[4/3] flex items-center justify-center mx-auto hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              id={`partner-card-${partner.id}`}
            >
              <img 
                src={partner.logoUrl} 
                alt={partner.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>

        {(!content.items || content.items.length === 0) && (
          <p className="text-sm text-[#7a889f] italic">Nenhum parceiro cadastrado nas configurações.</p>
        )}
      </div>
    </section>
  );
}
