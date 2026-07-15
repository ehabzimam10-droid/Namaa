import React from 'react';

interface CenterSVGProps {
  level: number;
}

export default function CenterSVG({ level }: CenterSVGProps) {
  // Determine color palettes dynamically based on level (1 to 5)
  const getColors = () => {
    switch (level) {
      case 1:
        return {
          walls: '#7E8B9B',
          shadow: '#5F6C7D',
          dark: '#3F4956',
          dome: '#5F6C7D',
          accent: '#A0AAB5',
        };
      case 2:
        return {
          walls: '#5C6F8E',
          shadow: '#40526F',
          dark: '#243147',
          dome: '#40526F',
          accent: '#7FA2C7',
        };
      case 3:
        return {
          walls: '#C19370', // Copper wall
          shadow: '#A37554', // Dark copper
          dark: '#7A5235',
          dome: '#009639', // Alinma green dome
          accent: '#FF8A00', // Orange flag
        };
      case 4:
        return {
          walls: '#D1AC6D',
          shadow: '#B28E51',
          dark: '#8E6E34',
          dome: '#009639',
          accent: '#FFD700',
        };
      case 5:
      default:
        return {
          walls: '#FFD700', // Gold Castle Walls
          shadow: '#E6B800',
          dark: '#B38F00',
          dome: '#FFF2A3', // Glowing gold dome
          accent: '#00A8F3', // Bright blue banner
        };
    }
  };

  const c = getColors();

  return (
    <svg viewBox="0 0 180 180" className="w-full h-full">
      {/* Glow aura background for level 5 */}
      {level === 5 && (
        <circle cx="90" cy="90" r="70" fill="rgba(255, 242, 163, 0.25)" filter="blur(15px)" className="animate-pulse" />
      )}

      {/* Ground shadow */}
      <polygon points="90,140 145,112.5 90,85 35,112.5" fill="#0C1527" opacity="0.6" />

      {/* Level 1 & 2: Basic Isometric Block Tower */}
      {level <= 2 && (
        <g>
          {/* Main Tower body */}
          {/* Left wall */}
          <polygon points="55,112.5 90,130 90,70 55,52.5" fill={c.shadow} />
          {/* Right wall */}
          <polygon points="90,130 125,112.5 125,52.5 90,70" fill={c.dark} />
          {/* Roof */}
          <polygon points="90,70 125,52.5 90,35 55,52.5" fill={c.walls} />

          {/* Simple flat battlements */}
          <polygon points="55,52.5 70,60 70,55 55,47.5" fill={c.accent} />
          <polygon points="125,52.5 110,60 110,55 125,47.5" fill={c.accent} />

          {/* Gate archway (Left) */}
          <polygon points="65,107.5 78,114 78,94 65,87.5" fill="#1C273C" />
        </g>
      )}

      {/* Level 3: Majestic Tower with a Green Dome and Side Balconies */}
      {level === 3 && (
        <g>
          {/* Base structure */}
          <polygon points="50,115 90,135 90,85 50,65" fill={c.shadow} />
          <polygon points="90,135 130,115 130,65 90,85" fill={c.dark} />
          <polygon points="90,85 130,65 90,45 50,65" fill={c.walls} />

          {/* Central Dome on top */}
          <ellipse cx="90" cy="45" rx="20" ry="12" fill={c.dome} />
          {/* Half circle / dome dome */}
          <path d="M 70,45 Q 90,20 110,45 Z" fill={c.dome} />
          {/* Flagpole and banner */}
          <line x1="90" y1="20" x2="90" y2="5" stroke="#FFF" strokeWidth="1.5" />
          <polygon points="90,5 110,10 90,15" fill={c.accent} />

          {/* Arched Gate */}
          <path d="M 70,115 C 70,95 110,95 110,115 Z" fill="#1C273C" />
          <polygon points="90,135 90,105 90,135" stroke="#009639" strokeWidth="2" />
        </g>
      )}

      {/* Level 4 & 5: Two-Story Castle with Side Turrets & Banners */}
      {level >= 4 && (
        <g>
          {/* Left Turret */}
          <polygon points="35,112.5 55,122.5 55,62.5 35,52.5" fill={c.shadow} />
          <polygon points="55,122.5 55,62.5 55,62.5 55,122.5" fill={c.dark} /> {/* Edge */}
          {/* Turret Roof cone */}
          <polygon points="35,52.5 55,62.5 45,35" fill={c.accent} />
          <polygon points="55,62.5 55,62.5 45,35" fill={c.dark} />

          {/* Right Turret */}
          <polygon points="125,122.5 145,112.5 145,52.5 125,62.5" fill={c.dark} />
          {/* Turret Roof cone */}
          <polygon points="125,62.5 145,52.5 135,35" fill={c.accent} />

          {/* Central Main Building Block */}
          <polygon points="55,122.5 90,140 90,75 55,57.5" fill={c.shadow} />
          <polygon points="90,140 125,122.5 125,57.5 90,75" fill={c.dark} />
          <polygon points="90,75 125,57.5 90,40 55,57.5" fill={c.walls} />

          {/* Grand Dome on Center Tower */}
          <ellipse cx="90" cy="40" rx="16" ry="9" fill={c.dome} />
          <path d="M 74,40 Q 90,15 106,40 Z" fill={c.dome} />
          <line x1="90" y1="15" x2="90" y2="2" stroke="#FFF" strokeWidth="1.5" />
          <polygon points="90,2 108,7 90,12" fill={level === 5 ? '#FFD700' : '#E57A44'} />

          {/* Grand Arch Doorways (Double pillars) */}
          <path d="M 75,128 A 15 15 0 0 1 105,128 L 105,132 L 75,132 Z" fill="#0C1527" />

          {/* Glowing Windows (Level 5 only) */}
          {level === 5 && (
            <g>
              <polygon points="68,90 82,97 82,82 68,75" fill="#FFF2A3" opacity="0.9" className="animate-pulse" />
              <polygon points="98,97 112,90 112,75 98,82" fill="#FFF2A3" opacity="0.9" className="animate-pulse" />
            </g>
          )}

          {/* Hanging Castle Banners */}
          <polygon points="62,95 62,110 57,105" fill={c.accent} />
          <polygon points="118,95 118,110 123,105" fill={c.accent} />
        </g>
      )}

      {/* Floating Sparkles for level 5 */}
      {level === 5 && (
        <g fill="#FFF2A3" className="animate-pulse">
          <circle cx="30" cy="60" r="1.5" />
          <circle cx="150" cy="50" r="2" />
          <circle cx="90" cy="160" r="1.5" />
        </g>
      )}
    </svg>
  );
}
