import React from 'react';

interface BankSVGProps {
  level: number;
}

export default function BankSVG({ level }: BankSVGProps) {
  const getPalette = () => {
    switch (level) {
      case 1:
        return {
          top: '#8E9AA8',
          left: '#6D7C8D',
          right: '#4B5766',
          accent: '#A5B1BD',
          glow: 'none',
          glowClass: '',
        };
      case 2:
        return {
          top: '#6C7E9C',
          left: '#4E5F7C',
          right: '#32425B',
          accent: '#8EB4DC',
          glow: 'none',
          glowClass: '',
        };
      case 3:
        return {
          top: '#D4A47E', // Radiant Copper
          left: '#B5855F',
          right: '#8E5F3B',
          accent: '#009639', // Alinma green
          glow: 'none',
          glowClass: '',
        };
      case 4:
        return {
          top: '#E8C485',
          left: '#C79F63',
          right: '#9E7A42',
          accent: '#FF8A00',
          glow: 'rgba(235, 166, 68, 0.35)',
          glowClass: 'animate-pulse',
        };
      case 5:
      default:
        return {
          top: '#FFE552', // Ultra Shiny Gold
          left: '#E6C300',
          right: '#B89B00',
          accent: '#00C8FF', // Cosmic glow
          glow: 'rgba(255, 215, 0, 0.7)',
          glowClass: 'animate-pulse',
        };
    }
  };

  const p = getPalette();

  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      <defs>
        {/* Subtle drop shadow filter for depth */}
        <filter id="bankShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#050B14" flood-opacity="0.55" />
        </filter>
        {/* Gradients */}
        <linearGradient id="topGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={p.top} />
          <stop offset="100%" stopColor={p.left} />
        </linearGradient>
        <linearGradient id="leftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={p.left} />
          <stop offset="100%" stopColor={p.right} />
        </linearGradient>
        <linearGradient id="rightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={p.right} />
          <stop offset="100%" stopColor="#182333" />
        </linearGradient>
      </defs>

      {/* Glow effect for high levels */}
      {level >= 4 && (
        <ellipse
          cx="80"
          cy="110"
          rx="65"
          ry="32"
          fill={p.glow}
          filter="blur(12px)"
          className={p.glowClass}
        />
      )}

      {/* Ground shadows */}
      <polygon points="80,125 125,102.5 80,80 35,102.5" fill="#050B14" opacity="0.75" />

      {/* Building Base block (Isometric box) with Drop Shadow */}
      <g filter="url(#bankShadow)">
        {/* Left side */}
        <polygon points="35,102.5 80,125 80,95 35,72.5" fill="url(#rightGrad)" />
        {/* Right side */}
        <polygon points="80,125 125,102.5 125,72.5 80,95" fill="url(#leftGrad)" />
        {/* Top face */}
        <polygon points="80,95 125,72.5 80,50 35,72.5" fill="url(#topGrad)" />
      </g>

      {/* Vault Door (Left face) */}
      <polygon points="45,95 65,105 65,85 45,75" fill="#0D1525" />
      {/* Vault handle / wheel */}
      <circle cx="55" cy="90" r="4.5" fill={p.accent} />
      {level >= 3 && <circle cx="55" cy="90" r="1.5" fill="#fff" />}

      {/* Dynamic details based on level */}
      {level >= 2 && (
        <g>
          {/* Decorative band */}
          <polygon points="35,77.5 80,100 80,95 35,72.5" fill={p.accent} opacity="0.8" />
          <polygon points="80,100 125,77.5 125,72.5 80,95" fill={p.accent} opacity="0.8" />
        </g>
      )}

      {level >= 3 && (
        <g filter="url(#bankShadow)">
          {/* Additional top block representing bank vault header */}
          <polygon points="50,72.5 80,87.5 80,72.5 50,57.5" fill="url(#rightGrad)" />
          <polygon points="80,87.5 110,72.5 110,57.5 80,72.5" fill="url(#leftGrad)" />
          <polygon points="80,72.5 110,57.5 80,42.5 50,57.5" fill="url(#topGrad)" />
        </g>
      )}

      {level >= 4 && (
        <g>
          {/* Glowing windows on the right side */}
          <polygon points="90,83 100,78 100,72 90,77" fill={p.accent} className="animate-pulse" />
          <polygon points="105,75 115,70 115,64 105,69" fill={p.accent} className="animate-pulse" />
        </g>
      )}

      {level === 5 && (
        <g>
          {/* Golden Coin floating on top */}
          <g className="animate-bounce" style={{ transformOrigin: '80px 30px' }}>
            <ellipse cx="80" cy="38" rx="8" ry="4" fill="#000" opacity="0.45" />
            <circle cx="80" cy="25" r="9" fill="#FFF4B8" filter="url(#bankShadow)" />
            <circle cx="80" cy="25" r="7.5" fill="#FFE552" />
            <path d="M 77 28 L 77 22 L 83 28 L 83 22" stroke="#FFF4B8" strokeWidth="1.8" fill="none" />
          </g>
        </g>
      )}
    </svg>
  );
}
