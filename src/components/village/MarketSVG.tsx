import React from 'react';

interface MarketSVGProps {
  level: number;
}

export default function MarketSVG({ level }: MarketSVGProps) {
  const getColors = () => {
    switch (level) {
      case 1:
        return {
          roof: '#8E9AA8',
          wood: '#5C4A38',
          accent: '#A5B1BD',
          banner: '#6D7C8D',
        };
      case 2:
        return {
          roof: '#D95D5D',
          wood: '#6E553F',
          accent: '#FFF',
          banner: '#5C749C',
        };
      case 3:
        return {
          roof: '#D4A47E', // Radiant Copper
          wood: '#9C7A59',
          accent: '#009639', // Alinma green banner
          banner: '#E57A44', // Orange detail
        };
      case 4:
        return {
          roof: '#E8C485',
          wood: '#B38E59',
          accent: '#FF8A00',
          banner: '#009639',
        };
      case 5:
      default:
        return {
          roof: '#FFE552', // Ultra Shiny Gold
          wood: '#B89600',
          accent: '#00D0FF', // Neon Blue accent
          banner: '#E57A44', // Orange wind flag
        };
    }
  };

  const c = getColors();

  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      <defs>
        <filter id="marketShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#050B14" flood-opacity="0.5" />
        </filter>
        <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.roof} />
          <stop offset="100%" stopColor="#8C6E3F" opacity={level >= 4 ? 0.3 : 0} />
        </linearGradient>
        <linearGradient id="woodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={c.wood} />
          <stop offset="100%" stopColor="#4A3423" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <polygon points="80,125 125,102.5 80,80 35,102.5" fill="#050B14" opacity="0.75" />

      {/* Main Base floor with Shadow */}
      <g filter="url(#marketShadow)">
        {/* Left side */}
        <polygon points="35,102.5 80,125 80,118 35,95.5" fill="#1C273C" />
        {/* Right side */}
        <polygon points="80,125 125,102.5 125,95.5 80,118" fill="#151E2E" />
        {/* Top tile */}
        <polygon points="80,118 125,95.5 80,73 35,95.5" fill="#24324D" />
      </g>

      {/* Level 1 & 2: Simple Wooden Market Stall */}
      {level <= 2 && (
        <g filter="url(#marketShadow)">
          {/* Wooden stall posts */}
          <rect x="50" y="70" width="3.5" height="30" fill="url(#woodGrad)" />
          <rect x="75" y="82" width="3.5" height="30" fill="url(#woodGrad)" />
          <rect x="100" y="70" width="3.5" height="30" fill="url(#woodGrad)" />

          {/* Table / Counter */}
          <polygon points="48,93 78,108 78,100 48,85" fill="url(#woodGrad)" />
          <polygon points="78,108 108,93 108,85 78,100" fill="#423427" />
          <polygon points="78,100 108,85 78,70 48,85" fill={c.accent} />

          {/* Simple flat roof */}
          <polygon points="45,70 78,86.5 78,82 45,65.5" fill="url(#roofGrad)" />
          <polygon points="78,86.5 110,70.5 110,66 78,82" fill="#B34444" opacity={level === 2 ? 1 : 0.6} />
          <polygon points="78,82 110,66 78,49.5 45,65.5" fill={c.accent} />
        </g>
      )}

      {/* Level 3 & 4: Dual Merchant Tent Structures */}
      {level >= 3 && (
        <g filter="url(#marketShadow)">
          {/* Tent 1 (Left-Center) */}
          <line x1="45" y1="92" x2="45" y2="70" stroke="url(#woodGrad)" strokeWidth="3" />
          <line x1="75" y1="107" x2="75" y2="85" stroke="url(#woodGrad)" strokeWidth="3" />
          {/* Main Tent Peak / Roof */}
          <polygon points="40,70 75,87.5 75,80 40,62.5" fill="url(#roofGrad)" />
          <polygon points="75,87.5 105,72.5 105,65 75,80" fill={c.accent} />
          <polygon points="75,80 105,65 75,47.5 40,62.5" fill="url(#roofGrad)" />
          
          {/* Alinma Green Hanging banner */}
          <polygon points="50,85 65,92.5 65,100 50,92.5" fill={c.accent} />

          {/* Tent 2 (Right-Back) */}
          <line x1="85" y1="87" x2="85" y2="67" stroke="url(#woodGrad)" strokeWidth="2.5" />
          <line x1="110" y1="74" x2="110" y2="54" stroke="url(#woodGrad)" strokeWidth="2.5" />
          <polygon points="82,67 110,81 110,76 82,62" fill={c.banner} />
          <polygon points="110,81 132,70 132,65 110,76" fill="url(#roofGrad)" />
          <polygon points="110,76 132,65 110,50 82,62" fill={c.accent} />
        </g>
      )}

      {/* Level 4 extra details: Banners & Gold Columns */}
      {level >= 4 && (
        <g>
          {/* Gold column trims */}
          <rect x="73.5" y="80" width="3.5" height="26" fill="#FFE552" filter="url(#marketShadow)" />
          <rect x="43.5" y="65.5" width="3.5" height="26" fill="#FFE552" filter="url(#marketShadow)" />

          {/* Trade flag flying */}
          <line x1="75" y1="47.5" x2="75" y2="28" stroke="#FFF" strokeWidth="2" />
          <polygon points="75,28 92,34 75,40" fill={c.banner} />
        </g>
      )}

      {/* Level 5 details: Golden pillars, rotating wind banner, glowing details */}
      {level === 5 && (
        <g>
          {/* Floating gold particles */}
          <circle cx="50" cy="50" r="2" fill="#FFF4B8" className="animate-pulse" />
          <circle cx="105" cy="40" r="2.5" fill="#FFF4B8" className="animate-ping" />
          <circle cx="120" cy="55" r="2" fill="#FFF4B8" />

          {/* Grand double-shield ornament on main roof */}
          <polygon points="75,47.5 83,43.5 75,39.5 67,43.5" fill="#FFF4B8" />
          <circle cx="75" cy="43.5" r="2.5" fill={c.accent} />

          {/* Waving/Spinning wind banner on flagpole */}
          <g className="animate-bounce" style={{ transformOrigin: '75px 28px' }}>
            <polygon points="75,22 95,26 75,30" fill="#FF8A00" filter="url(#marketShadow)" />
          </g>
        </g>
      )}
    </svg>
  );
}
