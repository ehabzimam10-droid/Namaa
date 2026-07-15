import React from 'react';

interface CenterSVGProps {
  level: number;
}

export default function CenterSVG({ level }: CenterSVGProps) {
  const getColors = () => {
    switch (level) {
      case 1:
        return {
          walls: '#8E9AA8',
          shadow: '#6D7C8D',
          dark: '#4B5766',
          dome: '#6D7C8D',
          accent: '#A5B1BD',
        };
      case 2:
        return {
          walls: '#6C7E9C',
          shadow: '#4E5F7C',
          dark: '#32425B',
          dome: '#4E5F7C',
          accent: '#8EB4DC',
        };
      case 3:
        return {
          walls: '#D4A47E', // Radiant Copper
          shadow: '#B5855F',
          dark: '#8E5F3B',
          dome: '#009639', // Alinma green dome
          accent: '#FF8A00', // Orange flag
        };
      case 4:
        return {
          walls: '#E8C485',
          shadow: '#C79F63',
          dark: '#9E7A42',
          dome: '#009639',
          accent: '#FFE552',
        };
      case 5:
      default:
        return {
          walls: '#FFE552', // Ultra Gold Castle Walls
          shadow: '#E6C300',
          dark: '#B89B00',
          dome: '#FFF4B8', // Glowing gold dome
          accent: '#00C8FF', // Radiant blue
        };
    }
  };

  const c = getColors();

  return (
    <svg viewBox="0 0 180 180" className="w-full h-full">
      <defs>
        {/* Shadow for premium 3D effect */}
        <filter id="centerShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="5" flood-color="#050B14" flood-opacity="0.6" />
        </filter>
        <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={c.walls} />
          <stop offset="100%" stopColor={c.shadow} />
        </linearGradient>
        <linearGradient id="shadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={c.shadow} />
          <stop offset="100%" stopColor={c.dark} />
        </linearGradient>
        <linearGradient id="domeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.dome} />
          <stop offset="100%" stopColor="#006b29" opacity={level === 3 || level === 4 ? 0.4 : 0} />
        </linearGradient>
      </defs>

      {/* Glow aura background for level 5 */}
      {level === 5 && (
        <circle cx="90" cy="90" r="70" fill="rgba(255, 244, 184, 0.28)" filter="blur(16px)" className="animate-pulse" />
      )}

      {/* Ground shadow */}
      <polygon points="90,140 145,112.5 90,85 35,112.5" fill="#050B14" opacity="0.75" />

      {/* Level 1 & 2: Basic Isometric Block Tower with Shadow */}
      {level <= 2 && (
        <g filter="url(#centerShadow)">
          {/* Main Tower body */}
          <polygon points="55,112.5 90,130 90,70 55,52.5" fill="url(#shadowGrad)" />
          <polygon points="90,130 125,112.5 125,52.5 90,70" fill={c.dark} />
          <polygon points="90,70 125,52.5 90,35 55,52.5" fill="url(#wallGrad)" />

          {/* Simple flat battlements */}
          <polygon points="55,52.5 70,60 70,55 55,47.5" fill={c.accent} />
          <polygon points="125,52.5 110,60 110,55 125,47.5" fill={c.accent} />

          {/* Gate archway (Left) */}
          <polygon points="65,107.5 78,114 78,94 65,87.5" fill="#0D1525" />
        </g>
      )}

      {/* Level 3: Majestic Tower with a Green Dome and Side Balconies */}
      {level === 3 && (
        <g filter="url(#centerShadow)">
          {/* Base structure */}
          <polygon points="50,115 90,135 90,85 50,65" fill="url(#shadowGrad)" />
          <polygon points="90,135 130,115 130,65 90,85" fill={c.dark} />
          <polygon points="90,85 130,65 90,45 50,65" fill="url(#wallGrad)" />

          {/* Central Dome on top */}
          <ellipse cx="90" cy="45" rx="20" ry="12" fill="url(#domeGrad)" />
          <path d="M 70,45 Q 90,20 110,45 Z" fill="url(#domeGrad)" />
          {/* Flagpole and banner */}
          <line x1="90" y1="20" x2="90" y2="5" stroke="#FFF" strokeWidth="2" />
          <polygon points="90,5 110,10 90,15" fill={c.accent} />

          {/* Arched Gate */}
          <path d="M 70,115 C 70,95 110,95 110,115 Z" fill="#0D1525" />
          <polygon points="90,135 90,105 90,135" stroke="#009639" strokeWidth="2" />
        </g>
      )}

      {/* Level 4 & 5: Two-Story Castle with Side Turrets & Banners */}
      {level >= 4 && (
        <g filter="url(#centerShadow)">
          {/* Left Turret */}
          <polygon points="35,112.5 55,122.5 55,62.5 35,52.5" fill="url(#shadowGrad)" />
          <polygon points="35,52.5 55,62.5 45,35" fill={c.accent} />

          {/* Right Turret */}
          <polygon points="125,122.5 145,112.5 145,52.5 125,62.5" fill={c.dark} />
          <polygon points="125,62.5 145,52.5 135,35" fill={c.accent} />

          {/* Central Main Building Block */}
          <polygon points="55,122.5 90,140 90,75 55,57.5" fill="url(#shadowGrad)" />
          <polygon points="90,140 125,122.5 125,57.5 90,75" fill={c.dark} />
          <polygon points="90,75 125,57.5 90,40 55,57.5" fill="url(#wallGrad)" />

          {/* Grand Dome on Center Tower */}
          <ellipse cx="90" cy="40" rx="16" ry="9" fill="url(#domeGrad)" />
          <path d="M 74,40 Q 90,15 106,40 Z" fill="url(#domeGrad)" />
          <line x1="90" y1="15" x2="90" y2="2" stroke="#FFF" strokeWidth="2" />
          <polygon points="90,2 108,7 90,12" fill={level === 5 ? '#FFE552' : '#E57A44'} />

          {/* Grand Arch Doorways (Double pillars) */}
          <path d="M 75,128 A 15 15 0 0 1 105,128 L 105,132 L 75,132 Z" fill="#050B14" />

          {/* Glowing Windows (Level 5 only) */}
          {level === 5 && (
            <g>
              <polygon points="68,90 82,97 82,82 68,75" fill="#FFF4B8" opacity="0.95" className="animate-pulse" />
              <polygon points="98,97 112,90 112,75 98,82" fill="#FFF4B8" opacity="0.95" className="animate-pulse" />
            </g>
          )}

          {/* Hanging Castle Banners */}
          <polygon points="62,95 62,110 57,105" fill={c.accent} />
          <polygon points="118,95 118,110 123,105" fill={c.accent} />
        </g>
      )}

      {/* Floating Sparkles for level 5 */}
      {level === 5 && (
        <g fill="#FFF4B8" className="animate-pulse">
          <circle cx="30" cy="60" r="2" />
          <circle cx="150" cy="50" r="2.5" />
          <circle cx="90" cy="160" r="2" />
        </g>
      )}
    </svg>
  );
}
