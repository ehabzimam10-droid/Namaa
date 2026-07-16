import React from 'react';

interface MarketSVGProps {
  level: number;
}

export default function MarketSVG({ level }: MarketSVGProps) {
  const lvl = Math.min(5, Math.max(1, level));

  if (lvl === 1) {
    // Level 1: Tiny 2D foundation / Open market carpet flat on the floor
    return (
      <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-xl animate-pulse">
        <defs>
          <linearGradient id="carpetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </linearGradient>
        </defs>
        {/* Grass Pad */}
        <polygon points="50,10 90,30 50,50 10,30" fill="#1E293B" stroke="#475569" strokeWidth="0.5" />
        {/* Flat Carpet */}
        <polygon points="50,15 80,30 50,45 20,30" fill="url(#carpetGrad)" stroke="#FBBF24" strokeWidth="1" />
        <line x1="50" y1="15" x2="50" y2="45" stroke="#FFF" strokeWidth="0.5" strokeDasharray="1,1" />
      </svg>
    );
  }

  if (lvl === 2) {
    // Level 2: Small wooden stall
    return (
      <svg viewBox="0 0 110 100" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="woodL2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
          <linearGradient id="woodR2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>
        </defs>
        {/* Base */}
        <polygon points="55,35 90,50 55,65 20,50" fill="#1F2937" />

        {/* Pillars */}
        <line x1="30" y1="50" x2="30" y2="35" stroke="#78350F" strokeWidth="2.5" />
        <line x1="55" y1="58" x2="55" y2="43" stroke="#78350F" strokeWidth="2.5" />
        <line x1="80" y1="50" x2="80" y2="35" stroke="#78350F" strokeWidth="2.5" />

        {/* Tent roof (striped flat canopy) */}
        <polygon points="55,22 83,34 55,46 27,34" fill="#EF4444" stroke="#7F1D1D" strokeWidth="0.5" />
        <polygon points="55,22 55,46 27,34" fill="#F59E0B" opacity="0.8" />
      </svg>
    );
  }

  if (lvl === 3) {
    // Level 3: Standard 3D market pavilion/shop with striped red/gold roof
    return (
      <svg viewBox="0 0 130 120" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="shopWallL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
          <linearGradient id="shopWallR" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>
          <linearGradient id="stripedRoof" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
        </defs>

        {/* Base */}
        <polygon points="65,55 110,75 65,95 20,75" fill="#1A202C" />

        {/* Shop Keep Walls */}
        <polygon points="30,70 65,85 65,110 30,95" fill="url(#shopWallL)" />
        <polygon points="65,85 100,70 100,95 65,110" fill="url(#shopWallR)" />

        {/* Striped Canopy Roof */}
        <polygon points="65,45 107,64 65,83 23,64" fill="url(#stripedRoof)" stroke="#7F1D1D" strokeWidth="0.5" />

        {/* Shop Window Opening */}
        <polygon points="40,78 58,85 58,95 40,88" fill="#1A202C" />
        {/* Shop Counter */}
        <polygon points="38,87 60,94 60,97 38,90" fill="#FBBF24" />
      </svg>
    );
  }

  if (lvl === 4) {
    // Level 4: Double pavilion bazaar with towers
    return (
      <svg viewBox="0 0 150 140" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="clayL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#9A3412" />
          </linearGradient>
          <linearGradient id="clayR" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9A3412" />
            <stop offset="100%" stopColor="#431407" />
          </linearGradient>
        </defs>

        {/* Base */}
        <polygon points="75,65 125,85 75,105 25,85" fill="#1A202C" />

        {/* Left Wing stall */}
        <polygon points="35,75 70,88 70,110 35,97" fill="url(#clayL)" />
        <polygon points="70,88 105,75 105,97 70,110" fill="url(#clayR)" />
        
        {/* Roof Domes */}
        <path d="M 35,75 Q 70,35 105,75 Z" fill="#F97316" stroke="#9A3412" strokeWidth="1" />
        <path d="M 52,75 Q 70,45 88,75" fill="none" stroke="#FBBF24" strokeWidth="1" />
      </svg>
    );
  }

  // Level 5: A massive, glowing skyscraper trading bazaar with high-tech hologram boards
  return (
    <svg viewBox="0 0 180 200" className="w-full h-full drop-shadow-[0_20px_50px_rgba(245,158,11,0.35)] overflow-visible">
      <defs>
        <linearGradient id="tradeGoldL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="30%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <linearGradient id="tradeGoldR" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="60%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>
        <linearGradient id="neonOrange" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7E00" />
          <stop offset="100%" stopColor="#FF3E00" />
        </linearGradient>
        <filter id="orangeGlow">
          <feGaussianBlur stdDeviation="3.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Floating Gold Sparks (Animated) */}
      <g className="animate-pulse">
        <circle cx="35" cy="80" r="1.5" fill="#F59E0B" filter="url(#orangeGlow)" />
        <circle cx="150" cy="90" r="2.2" fill="#FCD34D" filter="url(#orangeGlow)" />
        <circle cx="45" cy="40" r="2" fill="#FF8C00" filter="url(#orangeGlow)" />
        <circle cx="130" cy="30" r="1.5" fill="#FFFBEB" />
      </g>

      {/* Stepped Foundation Bazaar Slab */}
      <polygon points="90,110 160,140 90,170 20,140" fill="#241400" stroke="#F59E0B" strokeWidth="0.5" />
      <polygon points="20,140 90,170 90,178 20,148" fill="#140B00" />
      <polygon points="90,170 160,140 160,148 90,178" fill="#301B02" />

      {/* Hologram Board in Background (Vibrant Glowing Neon) */}
      <polygon points="50,60 130,30 130,80 50,110" fill="rgba(245, 158, 11, 0.15)" stroke="url(#neonOrange)" strokeWidth="1.5" filter="url(#orangeGlow)" />
      {/* Stock Market Upward Graph inside Hologram */}
      <path d="M 60,95 L 80,75 L 100,82 L 120,50" fill="none" stroke="#22C55E" strokeWidth="3" filter="url(#orangeGlow)" />
      <circle cx="120" cy="50" r="3" fill="#22C55E" filter="url(#orangeGlow)" />

      {/* Steampunk Brass Pillars and Gears */}
      <line x1="45" y1="130" x2="45" y2="85" stroke="#F59E0B" strokeWidth="3" />
      <line x1="135" y1="130" x2="135" y2="85" stroke="#F59E0B" strokeWidth="3" />

      {/* Main Multi-tiered pagoda building */}
      <polygon points="55,95 90,105 90,150 55,140" fill="url(#tradeGoldL)" />
      <polygon points="90,105 125,95 125,150 90,150" fill="url(#tradeGoldR)" />
      <polygon points="90,80 128,94 90,108 52,94" fill="#D97706" />

      {/* Second pagoda tier */}
      <polygon points="65,70 90,77 90,100 65,93" fill="url(#tradeGoldL)" />
      <polygon points="90,77 115,70 115,100 90,100" fill="url(#tradeGoldR)" />
      <polygon points="90,58 118,67 90,76 62,67" fill="#F59E0B" />

      {/* Glowing Lanterns */}
      <circle cx="45" cy="95" r="4" fill="url(#neonOrange)" filter="url(#orangeGlow)" />
      <circle cx="135" cy="95" r="4" fill="url(#neonOrange)" filter="url(#orangeGlow)" />
      <line x1="45" y1="85" x2="45" y2="91" stroke="#F59E0B" strokeWidth="1" />
      <line x1="135" y1="85" x2="135" y2="91" stroke="#F59E0B" strokeWidth="1" />
    </svg>
  );
}
