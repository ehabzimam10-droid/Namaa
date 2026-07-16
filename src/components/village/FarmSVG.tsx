import React from 'react';

interface FarmSVGProps {
  level: number;
}

export default function FarmSVG({ level }: FarmSVGProps) {
  const lvl = Math.min(5, Math.max(1, level));

  if (lvl === 1) {
    // Level 1: Tiny 2D foundation / Flat oasis pool
    return (
      <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-xl animate-pulse">
        <defs>
          <linearGradient id="oasisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>
        {/* Grass Pad */}
        <polygon points="50,10 90,30 50,50 10,30" fill="url(#oasisGrad)" stroke="#34D399" strokeWidth="1" />
        {/* Small Pool in Middle */}
        <ellipse cx="50" cy="30" rx="15" ry="8" fill="url(#waterGrad)" stroke="#E0F2FE" strokeWidth="0.5" />
      </svg>
    );
  }

  if (lvl === 2) {
    // Level 2: Oasis pool with a small tree
    return (
      <svg viewBox="0 0 110 100" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="grassGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>
          <linearGradient id="waterGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
        </defs>
        {/* Base */}
        <polygon points="55,35 90,50 55,65 20,50" fill="url(#grassGrad2)" />
        <polygon points="20,50 55,65 55,73 20,58" fill="#047857" />
        <polygon points="55,65 90,50 90,58 55,73" fill="#064E3B" />

        {/* Small Water Pool */}
        <ellipse cx="48" cy="50" rx="12" ry="6" fill="url(#waterGrad2)" />

        {/* Small Tree */}
        <path d="M 68,54 L 72,54 L 72,42 L 68,42 Z" fill="#78350F" />
        <circle cx="70" cy="36" r="10" fill="#10B981" opacity="0.9" />
        <circle cx="74" cy="32" r="8" fill="#34D399" opacity="0.95" />
      </svg>
    );
  }

  if (lvl === 3) {
    // Level 3: Standard green water pump oasis with beautiful plants and trees
    return (
      <svg viewBox="0 0 130 120" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="grassGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>
          <linearGradient id="wellStone" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* Base */}
        <polygon points="65,55 110,75 65,95 20,75" fill="url(#grassGrad3)" />

        {/* Central Water Well (Oasis Pump) */}
        <polygon points="55,70 75,78 75,90 55,82" fill="url(#wellStone)" />
        <polygon points="75,78 95,70 95,82 75,90" fill="#334155" />
        <ellipse cx="75" cy="70" rx="20" ry="8" fill="#0284C7" stroke="#E2E8F0" strokeWidth="1" />

        {/* Pumping structure */}
        <line x1="75" y1="70" x2="75" y2="45" stroke="#94A3B8" strokeWidth="2.5" />
        <polygon points="68,45 82,45 75,38" fill="#B91C1C" />

        {/* Flanking Trees */}
        <g transform="translate(30, 45)">
          <rect x="8" y="20" width="4" height="15" fill="#78350F" />
          <circle cx="10" cy="15" r="12" fill="#047857" opacity="0.9" />
        </g>
        <g transform="translate(85, 40)">
          <rect x="8" y="20" width="4" height="15" fill="#78350F" />
          <circle cx="10" cy="15" r="14" fill="#10B981" opacity="0.9" />
        </g>
      </svg>
    );
  }

  if (lvl === 4) {
    // Level 4: Greenhouse conservatory dome
    return (
      <svg viewBox="0 0 150 140" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Base */}
        <polygon points="75,65 125,85 75,105 25,85" fill="#065F46" />

        {/* Main Dome (Semi-transparent Glasshouse) */}
        <path d="M 35,80 Q 75,25 115,80 Z" fill="url(#glassGrad)" stroke="#10B981" strokeWidth="1.5" />
        {/* Metal Ribs of Greenhouse */}
        <path d="M 50,80 Q 75,35 100,80" fill="none" stroke="#34D399" strokeWidth="1" />
        <path d="M 62,80 Q 75,40 88,80" fill="none" stroke="#34D399" strokeWidth="1" />

        {/* Internal Exotic Plants (Vibrant colors inside dome) */}
        <circle cx="75" cy="72" r="12" fill="#047857" opacity="0.8" />
        <circle cx="68" cy="76" r="8" fill="#F43F5E" opacity="0.75" />
        <circle cx="82" cy="76" r="8" fill="#FBBF24" opacity="0.75" />
      </svg>
    );
  }

  // Level 5: A massive, glowing ecological treehouse temple / skyscraper oasis
  return (
    <svg viewBox="0 0 180 200" className="w-full h-full drop-shadow-[0_20px_50px_rgba(16,185,129,0.35)] overflow-visible">
      <defs>
        <linearGradient id="ecoWoodL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="ecoWoodR" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#78350F" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064E3B" />
        </linearGradient>
        <linearGradient id="neonWater" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F5FF" />
          <stop offset="100%" stopColor="#0080FF" />
        </linearGradient>
        <filter id="greenGlow">
          <feGaussianBlur stdDeviation="3.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Sparkling Green/Gold Dust (Animated) */}
      <g className="animate-pulse">
        <circle cx="40" cy="90" r="1.5" fill="#34D399" filter="url(#greenGlow)" />
        <circle cx="140" cy="80" r="2.5" fill="#6EE7B7" filter="url(#greenGlow)" />
        <circle cx="55" cy="50" r="2" fill="#FBBF24" filter="url(#greenGlow)" />
        <circle cx="120" cy="40" r="1.8" fill="#34D399" filter="url(#greenGlow)" />
        <circle cx="85" cy="15" r="2.2" fill="#FBBF24" filter="url(#greenGlow)" />
      </g>

      {/* Stepped Hydroponic Foundation Slab */}
      <polygon points="90,110 160,140 90,170 20,140" fill="#022C22" stroke="#10B981" strokeWidth="0.5" />
      <polygon points="20,140 90,170 90,178 20,148" fill="#021E17" />
      <polygon points="90,170 160,140 160,148 90,178" fill="#042F26" />

      {/* Waterfall Pool on foundation */}
      <ellipse cx="90" cy="140" rx="35" ry="12" fill="url(#neonWater)" filter="url(#greenGlow)" opacity="0.8" />

      {/* Main Steampunk Wood trunk/building */}
      <polygon points="65,95 90,105 90,145 65,135" fill="url(#ecoWoodL)" />
      <polygon points="90,105 115,95 115,145 90,145" fill="url(#ecoWoodR)" />
      <polygon points="90,75 118,87 90,99 62,87" fill="#10B981" opacity="0.2" />

      {/* Grand Hanging Garden Spire (Skyscraper) */}
      <polygon points="75,55 90,60 90,105 75,100" fill="url(#ecoWoodL)" />
      <polygon points="90,60 105,55 105,100 90,105" fill="url(#ecoWoodR)" />

      {/* Giant Tree Canopy (Top Spire) */}
      <path d="M 50,55 C 30,20 80,0 90,30 C 100,0 150,20 130,55 C 150,85 100,90 90,75 C 80,90 30,85 50,55 Z" fill="url(#leafGrad)" stroke="#6EE7B7" strokeWidth="0.5" />
      
      {/* Hanging Vines */}
      <path d="M 60,70 Q 55,90 58,105" fill="none" stroke="#059669" strokeWidth="1.5" strokeDasharray="3,1" />
      <path d="M 120,70 Q 125,90 122,105" fill="none" stroke="#059669" strokeWidth="1.5" strokeDasharray="3,1" />

      {/* Glass Greenhouses on the sides */}
      <ellipse cx="48" cy="115" rx="14" ry="10" fill="rgba(110, 231, 183, 0.25)" stroke="#10B981" strokeWidth="1" />
      <ellipse cx="132" cy="115" rx="14" ry="10" fill="rgba(110, 231, 183, 0.25)" stroke="#10B981" strokeWidth="1" />

      {/* Glowing Neon Hydroponic Pipes */}
      <path d="M 90,105 L 90,135" fill="none" stroke="#38BDF8" strokeWidth="2.5" filter="url(#greenGlow)" />
      <path d="M 72,110 L 72,125" fill="none" stroke="#34D399" strokeWidth="1.5" filter="url(#greenGlow)" />
      <path d="M 108,110 L 108,125" fill="none" stroke="#34D399" strokeWidth="1.5" filter="url(#greenGlow)" />
    </svg>
  );
}
