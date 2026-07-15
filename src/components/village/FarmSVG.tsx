import React from 'react';

interface FarmSVGProps {
  level: number;
}

export default function FarmSVG({ level }: FarmSVGProps) {
  const getColors = () => {
    switch (level) {
      case 1:
        return {
          soil: '#9E8565',
          soilDark: '#7A6348',
          crop: '#6E5945',
          accent: '#B0987D',
          water: '#8F9CA8',
        };
      case 2:
        return {
          soil: '#8EA175',
          soilDark: '#5E704B',
          crop: '#5A7F42',
          accent: '#A3BD87',
          water: '#6D91BD',
        };
      case 3:
        return {
          soil: '#6BA65A', // Rich Green
          soilDark: '#447A34', // Dark rich green
          crop: '#009639', // Alinma green crops
          accent: '#C7936E', // Copper well structure
          water: '#00B8FF', // Bright blue pond
        };
      case 4:
        return {
          soil: '#4CAE6D',
          soilDark: '#2C7F4B',
          crop: '#1BE583',
          accent: '#D49F6A',
          water: '#00E5FF',
        };
      case 5:
      default:
        return {
          soil: '#00B846', // Radiant Emerald
          soilDark: '#007A2E',
          crop: '#FFD700', // Gold wheat/flowers
          accent: '#FFE552', // Golden shrine
          water: '#00FFFF', // Magic glowing stream
        };
    }
  };

  const c = getColors();

  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      <defs>
        <filter id="farmShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#050B14" flood-opacity="0.5" />
        </filter>
        <linearGradient id="soilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.soil} />
          <stop offset="100%" stopColor={c.soilDark} />
        </linearGradient>
        <linearGradient id="wellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={c.accent} />
          <stop offset="100%" stopColor="#7E5F48" />
        </linearGradient>
      </defs>

      {/* Ground tile shadow */}
      <polygon points="80,125 125,102.5 80,80 35,102.5" fill="#050B14" opacity="0.75" />

      {/* Base Field Block with Shadow */}
      <g filter="url(#farmShadow)">
        {/* Left face */}
        <polygon points="35,102.5 80,125 80,118 35,95.5" fill="#1C273C" />
        {/* Right face */}
        <polygon points="80,125 125,102.5 125,95.5 80,118" fill="#151E2E" />
        {/* Top Field Tile */}
        <polygon points="80,118 125,95.5 80,73 35,95.5" fill="url(#soilGrad)" />
      </g>

      {/* Level 1 specific details: Dry cracks */}
      {level === 1 && (
        <g stroke="#5C4533" strokeWidth="1.5" fill="none" opacity="0.8">
          <path d="M 60,95 L 75,90 L 80,95" />
          <path d="M 85,85 L 90,92 L 105,88" />
          <path d="M 70,105 L 85,110 L 95,102" />
        </g>
      )}

      {/* Level 2 details: Small green rows */}
      {level === 2 && (
        <g fill={c.crop}>
          <polygon points="50,91 55,93.5 53,88" />
          <polygon points="65,98.5 70,101 68,95.5" />
          <polygon points="80,106 85,108.5 83,103" />
          
          <polygon points="75,85.5 80,88 78,82.5" />
          <polygon points="90,93 95,95.5 93,90" />
          <polygon points="105,100.5 110,103 108,97.5" />
        </g>
      )}

      {/* Level 3 details: Field Rows and a Stone Water Well */}
      {level >= 3 && (
        <g>
          {/* Field furrows / rows */}
          <polygon points="45,95 50,97.5 75,85 70,82.5" fill={c.crop} />
          <polygon points="55,100 60,102.5 85,90 80,87.5" fill={c.crop} />
          <polygon points="65,105 70,107.5 95,95 90,92.5" fill={c.crop} />
          <polygon points="75,110 80,112.5 105,100 100,97.5" fill={c.crop} />

          {/* Water pond */}
          <ellipse cx="105" cy="85" rx="14" ry="7" fill={c.water} filter="url(#farmShadow)" />
          <ellipse cx="103" cy="85" rx="9" ry="4.5" fill="#FFF" opacity="0.4" />

          {/* Well structure */}
          <g filter="url(#farmShadow)">
            {/* Well Wall */}
            <polygon points="45,82.5 58,89 58,80 45,73.5" fill="#4B5E7D" />
            <polygon points="58,89 71,82.5 71,73.5 58,80" fill="#364761" />
            <polygon points="58,80 71,73.5 58,67 45,73.5" fill="url(#wellGrad)" />
            {/* Well Roof posts and top */}
            <line x1="51" y1="73" x2="51" y2="58" stroke="#4B5E7D" strokeWidth="2.5" />
            <line x1="64" y1="78" x2="64" y2="63" stroke="#4B5E7D" strokeWidth="2.5" />
            <polygon points="47,60 58,65 58,62 47,57" fill="#8C7355" />
            <polygon points="58,65 69,60 69,57 58,62" fill="#7A634E" />
          </g>
        </g>
      )}

      {/* Level 4 extra tiered terrace */}
      {level >= 4 && (
        <g>
          {/* Golden flower beds / bushes */}
          <circle cx="50" cy="94" r="4.5" fill="#FFD700" filter="url(#farmShadow)" />
          <circle cx="60" cy="100" r="4.5" fill="#FFD700" filter="url(#farmShadow)" />
          <circle cx="85" cy="108" r="4.5" fill="#FFD700" filter="url(#farmShadow)" />

          {/* Water stream flowing from a higher stone block */}
          <polygon points="105,80 115,85 115,75 105,70" fill="#243147" />
          <polygon points="115,85 125,80 125,70 115,75" fill="#1C273C" />
          <polygon points="115,75 125,70 115,65 105,70" fill="url(#wellGrad)" />
          {/* Water pouring */}
          <path d="M 115,75 L 115,87" stroke={c.water} strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
        </g>
      )}

      {/* Level 5: Majestic golden shrine, glowing floating seeds, magic waterfall */}
      {level === 5 && (
        <g>
          {/* Golden arch above the well */}
          <path d="M 45,70 Q 58,42 71,70" stroke="#FFE552" strokeWidth="3" fill="none" filter="url(#farmShadow)" />
          {/* Glowing magic particle dots */}
          <circle cx="58" cy="42" r="2.5" fill="#FFF4B8" className="animate-ping" />
          <circle cx="115" cy="55" r="2" fill="#FFF4B8" />
          <circle cx="95" cy="70" r="1.5" fill="#FFF4B8" />

          {/* Waterfall glowing lines */}
          <path d="M 115,73 Q 112,83 115,88" stroke="#FFF" strokeWidth="1.8" fill="none" opacity="0.85" />
        </g>
      )}
    </svg>
  );
}
