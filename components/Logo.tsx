'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  lightText?: boolean;
}

export default function Logo({ className = '', showText = true, lightText = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic Vector Logo Icon */}
      <svg 
        viewBox="0 0 100 100" 
        className="h-10 w-10 shrink-0 transform hover:scale-105 transition-transform duration-300"
        id="motriz-svg-logo"
      >
        <defs>
          <linearGradient id="motrizBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2c7db3" />
            <stop offset="50%" stopColor="#125785" />
            <stop offset="100%" stopColor="#003b61" />
          </linearGradient>
        </defs>

        {/* Outer Left Pillar Chevron */}
        <path 
          d="M 5 18 L 22 34 L 22 78 L 5 94 Z" 
          fill="url(#motrizBlueGradient)" 
        />

        {/* Outer Right Pillar Chevron */}
        <path 
          d="M 95 18 L 78 34 L 78 78 L 95 94 Z" 
          fill="url(#motrizBlueGradient)" 
        />

        {/* Center Top Big V Chevron */}
        <path 
          d="M 12 0 L 50 36 L 88 0 L 74 0 L 50 24 L 26 0 Z" 
          fill="url(#motrizBlueGradient)" 
        />

        {/* Center Bottom Column Wedge */}
        <path 
          d="M 40 48 L 50 58 L 60 48 L 60 92 L 50 82 L 40 92 Z" 
          fill="url(#motrizBlueGradient)" 
        />
      </svg>

      {showText && (
        <div className="flex flex-col text-left">
          <span className={`font-sans text-xl font-extrabold tracking-[-0.03em] leading-none ${lightText ? 'text-white' : 'text-[#0a3147]'}`}>
            MOTRIZ
          </span>
          <span className={`font-sans text-[8.5px] font-bold tracking-[0.24em] mt-1 whitespace-nowrap ${lightText ? 'text-[#becee0]' : 'text-[#45567e]'}`}>
            ENGENHARIA - CONSTRUÇÃO
          </span>
        </div>
      )}
    </div>
  );
}
