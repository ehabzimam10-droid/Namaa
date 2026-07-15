import React from 'react';

interface BankSVGProps {
  level: number;
}

export default function BankSVG({ level }: BankSVGProps) {
  // Determine color palettes dynamically based on level (1 to 5)
  const getPalette = () => {
    switch (level) {
      case 1:
        return {
          top: '#7E8B9B',
          left: '#5F6C7D',
          right: '#3F4956',
          accent: '#A0AAB5',
          glow: 'none',
          glowClass: '',
        };
      case 2:
        return {
          top: '#5C6F8E',
          left: '#40526F',
          right: '#243147',
          accent: '#7FA2C7',
          glow: 'none',
          glowClass: '',
        };
      case 3:
        return {
          top: '#C19370', // Copper tones
          left: '#A37554',
          right: '#7A5235',
          accent: '#009639', // Alinma green
          glow: 'none',
          glowClass: '',
        };
      case 4:
        return {
          top: '#D1AC6D',
          left: '#B28E51',
          right: '#8E6E34',
          accent: '#FF8A00',
          glow: 'rgba(235, 166, 68, 0.3)',
          glowClass: 'animate-pulse',
        };
      case 5:
      default:
        return {
          top: '#FFD700', // Shiny Gold
          left: '#E6B800',
          right: '#B38F00',
          accent: '#00A8F3', // Bright blue glow
          glow: 'rgba(255, 215, 0, 0.6)',
          glowClass: 'animate-pulse',
        };
    }
  };

  const p = getPalette();

  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      {/* Glow effect for high levels */}
      {level >= 4 && (
        <ellipse
          cx="80"
          cy="110"
          rx="60"
          ry="30"
          fill={p.glow}
          filter="blur(10px)"
          className={p.glowClass}
        />
      )}

      {/* Ground shadows */}
      <polygon points="80,125 125,102.5 80,80 35,102.5" fill="#0C1527" opacity="0.6" />

      {/* Building Base block (Isometric box) */}
      {/* Left side */}
      <polygon points="35,102.5 80,125 80,95 35,72.5" fill={p.right} />
      {/* Right side */}
      <polygon points="80,125 125,102.5 125,72.5 80,95" fill={p.left} />
      {/* Top face */}
      <polygon points="80,95 125,72.5 80,50 35,72.5" fill={p.top} />

      {/* Vault Door (Left face) */}
      <polygon points="45,95 65,105 65,85 45,75" fill="#1C273C" />
      {/* Vault handle / wheel */}
      <circle cx="55" cy="90" r="4" fill={p.accent} />
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
        <g>
          {/* Additional top block representing bank vault header */}
          <polygon points="50,72.5 80,87.5 80,72.5 50,57.5" fill={p.right} />
          <polygon points="80,87.5 110,72.5 110,57.5 80,72.5" fill={p.left} />
          <polygon points="80,72.5 110,57.5 80,42.5 50,57.5" fill={p.top} />
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
            {/* Coin shadow */}
            <ellipse cx="80" cy="38" rx="8" ry="4" fill="#000" opacity="0.4" />
            
            {/* The gold coin itself */}
            <circle cx="80" cy="25" r="9" fill="#FFF2A3" />
            <circle cx="80" cy="25" r="7.5" fill="#FFD700" />
            {/* Currency symbol inside coin - geometric 'N' for Namaa */}
            <path d="M 77 28 L 77 22 L 83 28 L 83 22" stroke="#FFF2A3" strokeWidth="1.5" fill="none" />
          </g>
        </g>
      )}
    </svg>
  );
}
