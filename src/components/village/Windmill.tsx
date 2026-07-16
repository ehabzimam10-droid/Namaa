import React from 'react';

interface WindmillProps {
  level: number;
}

export default function Windmill({ level }: WindmillProps) {
  const lvl = Math.min(5, Math.max(1, level));

  if (lvl === 1) {
    // Level 1: Tiny 2D foundation / Small gear pin on the floor
    return (
      <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-xl animate-pulse">
        <defs>
          <linearGradient id="windBaseL1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A5568" />
            <stop offset="100%" stopColor="#2D3748" />
          </linearGradient>
        </defs>
        <polygon points="50,10 90,30 50,50 10,30" fill="url(#windBaseL1)" stroke="#718096" strokeWidth="0.5" />
        <circle cx="50" cy="30" r="6" fill="#1A202C" stroke="#3182CE" strokeWidth="1" />
        <circle cx="50" cy="30" r="2" fill="#3182CE" />
      </svg>
    );
  }

  if (lvl === 2) {
    // Level 2: Small basic windmill structure
    return (
      <svg viewBox="0 0 110 100" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="windWood" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#6B21A8" />
          </linearGradient>
        </defs>
        {/* Base */}
        <polygon points="55,35 90,50 55,65 20,50" fill="#1E293B" />
        
        {/* Tower */}
        <polygon points="45,50 55,53 55,75 45,70" fill="url(#windWood)" />
        <polygon points="55,53 65,50 65,70 55,75" fill="#581C87" />

        {/* Small Fan (Static or slow animation) */}
        <circle cx="55" cy="40" r="3" fill="#D4AF37" />
        <line x1="55" y1="40" x2="55" y2="25" stroke="#E2E8F0" strokeWidth="1.5" className="animate-spin" style={{ transformOrigin: '55px 40px', animationDuration: '6s' }} />
        <line x1="55" y1="40" x2="70" y2="40" stroke="#E2E8F0" strokeWidth="1.5" className="animate-spin" style={{ transformOrigin: '55px 40px', animationDuration: '6s' }} />
        <line x1="55" y1="40" x2="55" y2="55" stroke="#E2E8F0" strokeWidth="1.5" className="animate-spin" style={{ transformOrigin: '55px 40px', animationDuration: '6s' }} />
        <line x1="55" y1="40" x2="40" y2="40" stroke="#E2E8F0" strokeWidth="1.5" className="animate-spin" style={{ transformOrigin: '55px 40px', animationDuration: '6s' }} />
      </svg>
    );
  }

  if (lvl === 3) {
    // Level 3: Standard stone-and-wood windmill building with rotating sails
    return (
      <svg viewBox="0 0 130 120" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="windStone" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A5568" />
            <stop offset="100%" stopColor="#1A202C" />
          </linearGradient>
          <linearGradient id="windSails" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9F7AEA" />
            <stop offset="100%" stopColor="#6B46C1" />
          </linearGradient>
        </defs>

        {/* Base */}
        <polygon points="65,55 110,75 65,95 20,75" fill="#1A202C" />

        {/* Tower Body */}
        <polygon points="45,70 65,77 65,105 45,95" fill="url(#windStone)" />
        <polygon points="65,77 85,70 85,95 65,105" fill="#2D3748" />

        {/* Cap Roof */}
        <polygon points="65,52 87,66 65,80 43,66" fill="#805AD5" stroke="#553C9A" strokeWidth="0.5" />

        {/* Spinner hub */}
        <circle cx="65" cy="62" r="5" fill="#D4AF37" />

        {/* 4 Rotating sails */}
        <g className="animate-spin" style={{ transformOrigin: '65px 62px', animationDuration: '4s' }}>
          {/* Sail 1 */}
          <polygon points="64,62 66,62 66,22 60,22" fill="url(#windSails)" stroke="#553C9A" strokeWidth="0.5" />
          {/* Sail 2 */}
          <polygon points="65,61 65,63 105,63 105,57" fill="url(#windSails)" stroke="#553C9A" strokeWidth="0.5" />
          {/* Sail 3 */}
          <polygon points="64,62 66,62 70,102 64,102" fill="url(#windSails)" stroke="#553C9A" strokeWidth="0.5" />
          {/* Sail 4 */}
          <polygon points="65,61 65,63 25,63 25,69" fill="url(#windSails)" stroke="#553C9A" strokeWidth="0.5" />
        </g>
      </svg>
    );
  }

  if (lvl === 4) {
    // Level 4: Advanced double tower turbine
    return (
      <svg viewBox="0 0 150 140" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="turbineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A0AEC0" />
            <stop offset="100%" stopColor="#4A5568" />
          </linearGradient>
        </defs>

        {/* Base */}
        <polygon points="75,65 125,85 75,105 25,85" fill="#1A202C" />

        {/* Main Pillar */}
        <polygon points="65,75 75,78 75,115 65,110" fill="url(#turbineGrad)" />
        <polygon points="75,78 85,75 85,110 75,115" fill="#2D3748" />

        {/* Spin rotor */}
        <circle cx="75" cy="55" r="7" fill="#805AD5" stroke="#D4AF37" strokeWidth="1" />

        {/* Blades spinning */}
        <g className="animate-spin" style={{ transformOrigin: '75px 55px', animationDuration: '3s' }}>
          <path d="M 74,55 L 76,55 L 78,15 L 72,15 Z" fill="#9F7AEA" />
          <path d="M 75,54 L 75,56 L 115,58 L 115,52 Z" fill="#9F7AEA" transform="rotate(120, 75, 55)" />
          <path d="M 75,54 L 75,56 L 35,58 L 35,52 Z" fill="#9F7AEA" transform="rotate(240, 75, 55)" />
        </g>
      </svg>
    );
  }

  // Level 5: A massive, glowing high-tech eco-power turbine tower with glowing neon propeller blades spinning in 3D
  return (
    <svg viewBox="0 0 180 200" className="w-full h-full drop-shadow-[0_20px_50px_rgba(147,51,234,0.35)] overflow-visible">
      <defs>
        <linearGradient id="turbineBlueL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E9D5FF" />
          <stop offset="30%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#581C87" />
        </linearGradient>
        <linearGradient id="turbineBlueR" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="60%" stopColor="#581C87" />
          <stop offset="100%" stopColor="#2E0854" />
        </linearGradient>
        <linearGradient id="neonPurpleBlades" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0B0FF" />
          <stop offset="50%" stopColor="#D8B4FE" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0.5" />
        </linearGradient>
        <filter id="purpleGlowF">
          <feGaussianBlur stdDeviation="3.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Floating Sparkles */}
      <g className="animate-pulse">
        <circle cx="30" cy="50" r="1.5" fill="#D8B4FE" filter="url(#purpleGlowF)" />
        <circle cx="150" cy="70" r="2.2" fill="#818CF8" filter="url(#purpleGlowF)" />
        <circle cx="50" cy="20" r="1.8" fill="#FFF" filter="url(#purpleGlowF)" />
        <circle cx="130" cy="110" r="2.5" fill="#D8B4FE" />
      </g>

      {/* Stepped Sci-Fi Foundation Plate */}
      <polygon points="90,120 160,150 90,180 20,150" fill="#1E1B4B" stroke="#D8B4FE" strokeWidth="0.5" />
      <polygon points="20,150 90,180 90,188 20,158" fill="#120E2E" />
      <polygon points="90,180 160,150 160,158 90,188" fill="#1E1035" />

      {/* High-Tech Turbine Pillar */}
      <polygon points="80,95 90,98 90,165 80,160" fill="url(#turbineBlueL)" />
      <polygon points="90,98 100,95 100,160 90,165" fill="url(#turbineBlueR)" />

      {/* Giant Spinning Rotor Hub */}
      <circle cx="90" cy="65" r="10" fill="#312E81" stroke="#D8B4FE" strokeWidth="2.5" />
      <circle cx="90" cy="65" r="4" fill="#6366F1" />

      {/* 3 Massive Glowing Neon Propeller Blades Spinning */}
      <g className="animate-spin" style={{ transformOrigin: '90px 65px', animationDuration: '2s' }}>
        {/* Blade 1 */}
        <path d="M 87,65 L 93,65 L 98,10 L 82,10 Z" fill="url(#neonPurpleBlades)" filter="url(#purpleGlowF)" />
        <path d="M 87,65 L 93,65 L 98,10 L 82,10 Z" fill="#FFF" opacity="0.6" />
        
        {/* Blade 2 */}
        <path d="M 87,65 L 93,65 L 98,10 L 82,10 Z" fill="url(#neonPurpleBlades)" filter="url(#purpleGlowF)" transform="rotate(120, 90, 65)" />
        <path d="M 87,65 L 93,65 L 98,10 L 82,10 Z" fill="#FFF" opacity="0.6" transform="rotate(120, 90, 65)" />

        {/* Blade 3 */}
        <path d="M 87,65 L 93,65 L 98,10 L 82,10 Z" fill="url(#neonPurpleBlades)" filter="url(#purpleGlowF)" transform="rotate(240, 90, 65)" />
        <path d="M 87,65 L 93,65 L 98,10 L 82,10 Z" fill="#FFF" opacity="0.6" transform="rotate(240, 90, 65)" />
      </g>

      {/* High-Tech Glowing Energy Conduits */}
      <line x1="90" y1="98" x2="90" y2="165" stroke="#818CF8" strokeWidth="2" filter="url(#purpleGlowF)" />
      <line x1="75" y1="120" x2="75" y2="150" stroke="#A78BFA" strokeWidth="1" />
      <line x1="105" y1="120" x2="105" y2="150" stroke="#A78BFA" strokeWidth="1" />
    </svg>
  );
}
