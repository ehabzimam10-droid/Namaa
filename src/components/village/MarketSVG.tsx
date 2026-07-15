import React from 'react';

interface MarketSVGProps {
  level: number;
}

export default function MarketSVG({ level }: MarketSVGProps) {
  // Determine color palettes dynamically based on level (1 to 5)
  const getColors = () => {
    switch (level) {
      case 1:
        return {
          roof: '#7E8B9B',
          wood: '#5C4A38',
          accent: '#7A6655',
          banner: '#5F6C7D',
        };
      case 2:
        return {
          roof: '#C25B5B', // Dull Red
          wood: '#6B5641',
          accent: '#FFF',
          banner: '#5C6F8E',
        };
      case 3:
        return {
          roof: '#C19370', // Copper
          wood: '#8C7355',
          accent: '#009639', // Alinma green banner
          banner: '#E57A44', // Orange detail
        };
      case 4:
        return {
          roof: '#D1AC6D',
          wood: '#A88046',
          accent: '#FF8A00',
          banner: '#009639',
        };
      case 5:
      default:
        return {
          roof: '#FFD700', // Gold Roof
          wood: '#B38F00',
          accent: '#00A8F3', // Bright blue banner/shield
          banner: '#E57A44', // Orange wind flag
        };
    }
  };

  const c = getColors();

  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      {/* Ground shadow */}
      <polygon points="80,125 125,102.5 80,80 35,102.5" fill="#0C1527" opacity="0.6" />

      {/* Main Base floor */}
      {/* Left side */}
      <polygon points="35,102.5 80,125 80,118 35,95.5" fill="#1C273C" />
      {/* Right side */}
      <polygon points="80,125 125,102.5 125,95.5 80,118" fill="#151E2E" />
      {/* Top tile */}
      <polygon points="80,118 125,95.5 80,73 35,95.5" fill="#24324D" />

      {/* Level 1 & 2: Simple Wooden Market Stall */}
      {level <= 2 && (
        <g>
          {/* Wooden stall posts */}
          <rect x="50" y="70" width="3" height="30" fill={c.wood} />
          <rect x="75" y="82" width="3" height="30" fill={c.wood} />
          <rect x="100" y="70" width="3" height="30" fill={c.wood} />

          {/* Table / Counter */}
          <polygon points="48,93 78,108 78,100 48,85" fill={c.wood} />
          <polygon points="78,108 108,93 108,85 78,100" fill="#524030" />
          <polygon points="78,100 108,85 78,70 48,85" fill={c.accent} />

          {/* Simple flat roof */}
          <polygon points="45,70 78,86.5 78,82 45,65.5" fill={c.roof} />
          <polygon points="78,86.5 110,70.5 110,66 78,82" fill="#993D3D" opacity={level === 2 ? 1 : 0.6} />
          <polygon points="78,82 110,66 78,49.5 45,65.5" fill={c.accent} />
        </g>
      )}

      {/* Level 3 & 4: Dual Merchant Tent Structures */}
      {level >= 3 && (
        <g>
          {/* Tent 1 (Left-Center) */}
          {/* Posts */}
          <line x1="45" y1="92" x2="45" y2="70" stroke={c.wood} strokeWidth="2.5" />
          <line x1="75" y1="107" x2="75" y2="85" stroke={c.wood} strokeWidth="2.5" />
          {/* Main Tent Peak / Roof */}
          <polygon points="40,70 75,87.5 75,80 40,62.5" fill={c.roof} />
          <polygon points="75,87.5 105,72.5 105,65 75,80" fill={c.accent} />
          <polygon points="75,80 105,65 75,47.5 40,62.5" fill={c.roof} />
          
          {/* Alinma Green Hanging banner */}
          <polygon points="50,85 65,92.5 65,100 50,92.5" fill={c.accent} />

          {/* Tent 2 (Right-Back) */}
          <line x1="85" y1="87" x2="85" y2="67" stroke={c.wood} strokeWidth="2" />
          <line x1="110" y1="74" x2="110" y2="54" stroke={c.wood} strokeWidth="2" />
          <polygon points="82,67 110,81 110,76 82,62" fill={c.banner} />
          <polygon points="110,81 132,70 132,65 110,76" fill={c.roof} />
          <polygon points="110,76 132,65 110,50 82,62" fill={c.accent} />
        </g>
      )}

      {/* Level 4 extra details: Banners & Gold Columns */}
      {level >= 4 && (
        <g>
          {/* Gold column trims */}
          <rect x="73.5" y="80" width="3" height="26" fill="#FFD700" />
          <rect x="43.5" y="65.5" width="3" height="26" fill="#FFD700" />

          {/* Trade flag flying */}
          <line x1="75" y1="47.5" x2="75" y2="28" stroke="#FFF" strokeWidth="1.5" />
          <polygon points="75,28 92,34 75,40" fill={c.banner} />
        </g>
      )}

      {/* Level 5 details: Golden pillars, rotating wind banner, glowing details */}
      {level === 5 && (
        <g>
          {/* Floating gold particles */}
          <circle cx="50" cy="50" r="1.5" fill="#FFF2A3" className="animate-pulse" />
          <circle cx="105" cy="40" r="2" fill="#FFF2A3" className="animate-ping" />
          <circle cx="120" cy="55" r="1.5" fill="#FFF2A3" />

          {/* Grand double-shield ornament on main roof */}
          <polygon points="75,47.5 83,43.5 75,39.5 67,43.5" fill="#FFF2A3" />
          <circle cx="75" cy="43.5" r="2.5" fill={c.accent} />

          {/* Waving/Spinning wind banner on flagpole */}
          <g className="animate-bounce" style={{ transformOrigin: '75px 28px' }}>
            <polygon points="75,22 95,26 75,30" fill="#FF8A00" />
          </g>
        </g>
      )}
    </svg>
  );
}
