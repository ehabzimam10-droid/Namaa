import React from 'react';

interface CenterSVGProps {
  level: number;
}

export default function CenterSVG({ level }: CenterSVGProps) {
  const lvl = Math.min(5, Math.max(1, level));

  // Render different SVG based on levels to match strict scaling logic
  if (lvl === 1) {
    // Level 1: A tiny 2D foundation on the floor
    return (
      <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-xl animate-pulse">
        <defs>
          <linearGradient id="foundationGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A5568" />
            <stop offset="50%" stopColor="#2D3748" />
            <stop offset="100%" stopColor="#1A202C" />
          </linearGradient>
          <linearGradient id="runeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FF8C00" />
          </linearGradient>
        </defs>
        {/* Foundation Rhombus */}
        <polygon points="50,10 90,30 50,50 10,30" fill="url(#foundationGrad)" stroke="#718096" strokeWidth="1" />
        <polygon points="50,12 86,30 50,48 14,30" fill="none" stroke="url(#runeGrad)" strokeWidth="0.5" strokeDasharray="2,2" />
        {/* Center Rune Symbol */}
        <circle cx="50" cy="30" r="6" fill="none" stroke="url(#runeGrad)" strokeWidth="1" />
        <line x1="50" y1="24" x2="50" y2="36" stroke="url(#runeGrad)" strokeWidth="1" />
        <line x1="44" y1="30" x2="56" y2="30" stroke="url(#runeGrad)" strokeWidth="1" />
      </svg>
    );
  }

  if (lvl === 2) {
    // Level 2: Small stone base with basic cabin
    return (
      <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="stoneLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#718096" />
            <stop offset="100%" stopColor="#4A5568" />
          </linearGradient>
          <linearGradient id="stoneRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A5568" />
            <stop offset="100%" stopColor="#2D3748" />
          </linearGradient>
          <linearGradient id="woodLeft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8c7355" />
            <stop offset="100%" stopColor="#5A4A32" />
          </linearGradient>
          <linearGradient id="woodRight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5A4A32" />
            <stop offset="100%" stopColor="#3E3120" />
          </linearGradient>
          <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9B2C2C" />
            <stop offset="100%" stopColor="#5F1D1D" />
          </linearGradient>
        </defs>
        {/* Stone Base */}
        <polygon points="60,40 100,55 60,70 20,55" fill="#2D3748" />
        <polygon points="20,55 60,70 60,80 20,65" fill="url(#stoneLeft)" />
        <polygon points="60,70 100,55 100,65 60,80" fill="url(#stoneRight)" />

        {/* Cabin Walls */}
        <polygon points="35,45 60,55 60,70 35,60" fill="url(#woodLeft)" />
        <polygon points="60,55 85,45 85,60 60,70" fill="url(#woodRight)" />

        {/* Cabin Roof */}
        <polygon points="60,30 88,44 60,56 32,44" fill="url(#roofGrad)" />
        {/* Door */}
        <polygon points="54,61 60,63 60,70 54,67" fill="#1A202C" />
      </svg>
    );
  }

  if (lvl === 3) {
    // Level 3: Standard 3D building/fortress with purple roof & small tower
    return (
      <svg viewBox="0 0 140 130" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="wallLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A0AEC0" />
            <stop offset="100%" stopColor="#718096" />
          </linearGradient>
          <linearGradient id="wallRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#718096" />
            <stop offset="100%" stopColor="#4A5568" />
          </linearGradient>
          <linearGradient id="royalPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#805AD5" />
            <stop offset="100%" stopColor="#553C9A" />
          </linearGradient>
          <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#AA7C11" />
          </linearGradient>
        </defs>
        
        {/* Foundation */}
        <polygon points="70,55 120,75 70,95 20,75" fill="#1A202C" />

        {/* Main Keep Walls */}
        <polygon points="30,70 70,85 70,110 30,95" fill="url(#wallLeft)" />
        <polygon points="70,85 110,70 110,95 70,110" fill="url(#wallRight)" />

        {/* Roof */}
        <polygon points="70,50 112,69 70,88 28,69" fill="url(#royalPurple)" stroke="#322659" strokeWidth="0.5" />

        {/* Central Tower */}
        <polygon points="55,45 70,50 70,80 55,75" fill="url(#wallLeft)" />
        <polygon points="70,50 85,45 85,75 70,80" fill="url(#wallRight)" />
        {/* Cone Roof */}
        <polygon points="70,20 87,46 53,46" fill="url(#royalPurple)" />

        {/* Golden Gate */}
        <path d="M 64,103 Q 70,97 76,103 L 76,110 L 64,110 Z" fill="url(#goldAccent)" />
        
        {/* Windows */}
        <polygon points="46,80 50,81 50,86 46,85" fill="#FEFCBF" />
        <polygon points="90,76 94,75 94,80 90,81" fill="#FEFCBF" />
      </svg>
    );
  }

  if (lvl === 4) {
    // Level 4: Double tower fortress with arched gates
    return (
      <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="wall4Left" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CBD5E0" />
            <stop offset="100%" stopColor="#718096" />
          </linearGradient>
          <linearGradient id="wall4Right" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#718096" />
            <stop offset="100%" stopColor="#2D3748" />
          </linearGradient>
          <linearGradient id="roof4Purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9F7AEA" />
            <stop offset="100%" stopColor="#4A154B" />
          </linearGradient>
        </defs>

        {/* Foundation */}
        <polygon points="80,70 140,95 80,120 20,95" fill="#1A202C" />

        {/* Left Wing Keep */}
        <polygon points="30,85 60,95 60,120 30,110" fill="url(#wall4Left)" />
        <polygon points="60,95 90,85 90,110 60,120" fill="url(#wall4Right)" />
        <polygon points="60,70 92,84 60,98 28,84" fill="url(#roof4Purple)" />

        {/* Left Spire Tower */}
        <polygon points="40,55 55,60 55,90 40,85" fill="url(#wall4Left)" />
        <polygon points="55,60 70,55 70,85 55,90" fill="url(#wall4Right)" stroke="#718096" strokeWidth="0.5" />
        <polygon points="55,30 72,56 38,56" fill="url(#roof4Purple)" stroke="#4A154B" strokeWidth="0.5" />

        {/* Right Spire Tower */}
        <polygon points="90,55 105,60 105,90 90,85" fill="url(#wall4Left)" />
        <polygon points="105,60 120,55 120,85 105,90" fill="url(#wall4Right)" stroke="#718096" strokeWidth="0.5" />
        <polygon points="105,30 122,56 88,56" fill="url(#roof4Purple)" stroke="#4A154B" strokeWidth="0.5" />

        {/* Main Arch Gate */}
        <path d="M 52,108 Q 60,98 68,108 L 68,118 L 52,115 Z" fill="#D4AF37" stroke="#AA7C11" strokeWidth="1" />
        
        {/* Banner Flag */}
        <line x1="55" y1="30" x2="55" y2="20" stroke="#CBD5E0" strokeWidth="1.5" />
        <polygon points="55,20 68,23 55,26" fill="#D4AF37" />

        {/* Glowing Windows */}
        <rect x="45" y="70" width="4" height="8" rx="2" fill="#FEFCBF" className="animate-pulse" />
        <rect x="110" y="70" width="4" height="8" rx="2" fill="#FEFCBF" className="animate-pulse" />
      </svg>
    );
  }

  // Level 5: A massive, glowing skyscraper/castle with towers, windows, and animated gold particles
  return (
    <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-[0_20px_50px_rgba(212,175,55,0.35)] overflow-visible">
      <defs>
        <linearGradient id="castleGoldL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3C4" />
          <stop offset="30%" stopColor="#F3D060" />
          <stop offset="100%" stopColor="#B88A19" />
        </linearGradient>
        <linearGradient id="castleGoldR" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#9C7A1E" />
          <stop offset="100%" stopColor="#5A420A" />
        </linearGradient>
        <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D6BCFA" />
          <stop offset="50%" stopColor="#805AD5" />
          <stop offset="100%" stopColor="#322659" />
        </linearGradient>
        <linearGradient id="windowGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Floating Gold Particles (Animated) */}
      <g className="animate-bounce" style={{ transformOrigin: 'center bottom' }}>
        <circle cx="35" cy="50" r="1.5" fill="#FFF3C4" filter="url(#glow)" />
        <circle cx="170" cy="80" r="2" fill="#D4AF37" filter="url(#glow)" />
        <circle cx="50" cy="110" r="1.2" fill="#FFF3C4" />
        <circle cx="160" cy="40" r="1.8" fill="#FFF3C4" filter="url(#glow)" />
        <circle cx="90" cy="15" r="2.5" fill="#D4AF37" filter="url(#glow)" />
        <circle cx="110" cy="25" r="1.5" fill="#FFF" filter="url(#glow)" />
      </g>

      {/* Ground Foundation Slab (3D Stepped) */}
      <polygon points="100,105 170,135 100,165 30,135" fill="#1C2D42" stroke="#FFF3C4" strokeWidth="0.5" />
      <polygon points="30,135 100,165 100,173 30,143" fill="#0F1B29" />
      <polygon points="100,165 170,135 170,143 100,173" fill="#152438" />

      {/* Main Central Keep */}
      <polygon points="50,115 100,135 100,160 50,140" fill="url(#castleGoldL)" />
      <polygon points="100,135 150,115 150,140 100,160" fill="url(#castleGoldR)" />
      
      {/* Central Keep Dome/Roof */}
      <polygon points="100,85 152,112 100,134 48,112" fill="url(#purpleGlow)" stroke="#FFF3C4" strokeWidth="0.5" />

      {/* Tower Left (Front side) */}
      <polygon points="55,80 75,88 75,135 55,127" fill="url(#castleGoldL)" />
      <polygon points="75,88 95,80 95,127 75,135" fill="url(#castleGoldR)" />
      <polygon points="75,55 96,81 54,81" fill="url(#purpleGlow)" stroke="#FFF3C4" strokeWidth="0.5" />

      {/* Tower Right (Front side) */}
      <polygon points="105,80 125,88 125,135 105,127" fill="url(#castleGoldL)" />
      <polygon points="125,88 145,80 145,127 125,135" fill="url(#castleGoldR)" />
      <polygon points="125,55 146,81 104,81" fill="url(#purpleGlow)" stroke="#FFF3C4" strokeWidth="0.5" />

      {/* Grand Central Spire Tower (High Rise) */}
      <polygon points="85,60 100,66 100,125 85,119" fill="url(#castleGoldL)" />
      <polygon points="100,66 115,60 115,119 100,125" fill="url(#castleGoldR)" />
      {/* Tall Spire Cone */}
      <polygon points="100,20 117,61 83,61" fill="url(#purpleGlow)" stroke="#D4AF37" strokeWidth="0.5" />

      {/* Steampunk Gold Pipes/Details */}
      <path d="M 85,95 Q 75,100 75,110" fill="none" stroke="#D4AF37" strokeWidth="2" />
      <path d="M 115,95 Q 125,100 125,110" fill="none" stroke="#D4AF37" strokeWidth="2" />

      {/* Arched Royal Gate (Glowing) */}
      <path d="M 90,140 Q 100,128 110,140 L 110,154 L 90,150 Z" fill="url(#windowGlow)" filter="url(#glow)" />
      <path d="M 90,140 Q 100,128 110,140" fill="none" stroke="#FFF" strokeWidth="1.5" />

      {/* Spire Flags (Steampunk/Royal flags) */}
      <line x1="100" y1="20" x2="100" y2="5" stroke="#FFF3C4" strokeWidth="1.5" />
      <polygon points="100,5 120,9 100,13" fill="#D4AF37" />

      <line x1="75" y1="55" x2="75" y2="45" stroke="#FFF3C4" strokeWidth="1" />
      <polygon points="75,45 88,48 75,51" fill="#FFF" />

      <line x1="125" y1="55" x2="125" y2="45" stroke="#FFF3C4" strokeWidth="1" />
      <polygon points="125,45 138,48 125,51" fill="#FFF" />

      {/* Rows of Glowing Windows */}
      <g fill="url(#windowGlow)" filter="url(#glow)">
        <polygon points="63,98 67,99 67,105 63,104" />
        <polygon points="87,98 91,99 91,105 87,104" />
        <polygon points="109,98 113,99 113,105 109,104" />
        <polygon points="133,98 137,99 137,105 133,104" />
        {/* Upper spire windows */}
        <polygon points="91,78 95,79 95,85 91,84" />
        <polygon points="105,78 109,79 109,85 105,84" />
      </g>
    </svg>
  );
}
