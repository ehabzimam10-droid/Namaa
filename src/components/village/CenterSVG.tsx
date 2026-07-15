import React from 'react';

interface CenterSVGProps {
  level: number;
}

export default function CenterSVG({ level }: CenterSVGProps) {
  // Render based on level
  return (
    <svg viewBox="0 0 180 180" className="w-full h-full">
      <defs>
        <filter id="centerDropShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="5" flood-color="#040810" flood-opacity="0.65" />
        </filter>
        <linearGradient id="castleGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFE552" />
          <stop offset="100%" stopColor="#E6C300" />
        </linearGradient>
        <linearGradient id="castleGoldDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E6C300" />
          <stop offset="100%" stopColor="#8A7000" />
        </linearGradient>
        <linearGradient id="stoneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8E9AA8" />
          <stop offset="100%" stopColor="#4B5766" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <polygon points="90,145 145,117.5 90,90 35,117.5" fill="#040810" opacity="0.8" />

      {/* LEVEL 1: Campfire & Tiny Mud Tent (low height) */}
      {level === 1 && (
        <g filter="url(#centerDropShadow)">
          {/* Mud Tent */}
          {/* Left face */}
          <polygon points="55,120 80,128 80,100 55,95" fill="#8C7355" />
          {/* Right face */}
          <polygon points="80,128 105,120 105,95 80,100" fill="#735E45" />
          {/* Tent poles */}
          <line x1="80" y1="100" x2="80" y2="92" stroke="#5C4533" strokeWidth="2.5" />
          <line x1="55" y1="95" x2="50" y2="93" stroke="#5C4533" strokeWidth="2" />
          <line x1="105" y1="95" x2="110" y2="93" stroke="#5C4533" strokeWidth="2" />

          {/* Tiny Campfire (center right) */}
          <ellipse cx="115" cy="122" rx="10" ry="5" fill="#3D291F" />
          {/* Fire embers (Red/Orange polygons) */}
          <polygon points="110,122 115,110 120,122" fill="#FF4500" />
          <polygon points="112,122 115,115 118,122" fill="#FF8C00" />
          <polygon points="114,122 115,118 116,122" fill="#FFD700" />
        </g>
      )}

      {/* LEVEL 2: Simple stone fort wall (Medium-low) */}
      {level === 2 && (
        <g filter="url(#centerDropShadow)">
          {/* Main wall block */}
          {/* Left wall */}
          <polygon points="50,118 90,136 90,100 50,82" fill="url(#stoneGrad)" />
          {/* Right wall */}
          <polygon points="90,136 130,118 130,82 90,100" fill="#323E27" /> {/* Darker stone */}
          <polygon points="90,100 130,82 90,64 50,82" fill="#6A7A8C" />

          {/* Basic battlements */}
          <rect x="52" y="72" width="12" height="10" fill="#6A7A8C" />
          <rect x="72" y="81" width="12" height="10" fill="#6A7A8C" />
          <rect x="106" y="81" width="12" height="10" fill="#6A7A8C" />
          <rect x="116" y="76" width="12" height="10" fill="#6A7A8C" />

          {/* Arch door */}
          <polygon points="65,112.5 78,119 78,99 65,92.5" fill="#0D1525" />
        </g>
      )}

      {/* LEVEL 3: Solid tower with a green dome and gate */}
      {level === 3 && (
        <g filter="url(#centerDropShadow)">
          {/* Base castle structure */}
          <polygon points="45,122.5 90,143 90,93 45,72.5" fill="url(#stoneGrad)" />
          <polygon points="90,143 135,122.5 135,72.5 90,93" fill="#3A4859" />
          <polygon points="90,93 135,72.5 90,52 45,72.5" fill="#6A7A8C" />

          {/* Central Green Dome */}
          <ellipse cx="90" cy="52" rx="18" ry="10" fill="#009639" />
          <path d="M 72,52 Q 90,26 108,52 Z" fill="#009639" />
          
          {/* Flag */}
          <line x1="90" y1="26" x2="90" y2="10" stroke="#FFF" strokeWidth="2" />
          <polygon points="90,10 108,15 90,20" fill="#E57A44" />

          {/* Arched Gate */}
          <path d="M 68,122 C 68,102 112,102 112,122 Z" fill="#0D1525" />
        </g>
      )}

      {/* LEVEL 4: Tall two-story castle with side towers, battlements, and flags */}
      {level === 4 && (
        <g filter="url(#centerDropShadow)">
          {/* Left Turret */}
          <polygon points="35,115 55,125 55,65 35,55" fill="url(#stoneGrad)" />
          <polygon points="35,55 55,65 45,38" fill="#E57A44" />

          {/* Right Turret */}
          <polygon points="125,125 145,115 145,55 125,65" fill="#3A4859" />
          <polygon points="125,65 145,55 135,38" fill="#E57A44" />

          {/* Central Block */}
          <polygon points="55,125 90,143 90,78 55,60" fill="url(#stoneGrad)" />
          <polygon points="90,143 125,125 125,60 90,78" fill="#3A4859" />
          <polygon points="90,78 125,60 90,42 55,60" fill="#6A7A8C" />

          {/* Dome */}
          <ellipse cx="90" cy="42" rx="15" ry="8" fill="#009639" />
          <path d="M 75,42 Q 90,18 105,42 Z" fill="#009639" />
        </g>
      )}

      {/* LEVEL 5: Majestic multi-tiered Citadel/Castle (high height, grand towers, turrets, glowing arched windows, cascading banners, and sparkles) */}
      {level === 5 && (
        <g filter="url(#centerDropShadow)">
          {/* Massive Base Stone Platform */}
          <polygon points="30,122.5 90,152.5 150,122.5 90,92.5" fill="#4B5666" />
          <polygon points="30,122.5 90,152.5 90,142.5 30,112.5" fill="#333C47" />
          <polygon points="90,152.5 150,122.5 150,112.5 90,142.5" fill="#20262E" />

          {/* Left Tower Turret */}
          <polygon points="35,112.5 58,124 58,54 35,42.5" fill="url(#castleGoldDark)" />
          {/* Left Turret Golden Roof */}
          <polygon points="35,42.5 58,54 46.5,22" fill="url(#castleGold)" />

          {/* Right Tower Turret */}
          <polygon points="122,124 145,112.5 145,42.5 122,54" fill="#8A7000" />
          {/* Right Turret Golden Roof */}
          <polygon points="122,54 145,42.5 133.5,22" fill="url(#castleGold)" />

          {/* Main Center Castle Structure (Two levels) */}
          {/* Level 1 block */}
          <polygon points="58,124 90,140 90,75 58,59" fill="url(#castleGoldDark)" />
          <polygon points="90,140 122,124 122,59 90,75" fill="#8A7000" />
          
          {/* Level 2 central tower rising higher */}
          <polygon points="70,75 90,85 90,45 70,35" fill="url(#castleGoldDark)" />
          <polygon points="90,85 110,75 110,45 90,45" fill="#8A7000" />

          {/* Grand Dome on top of Level 2 */}
          <ellipse cx="90" cy="45" rx="18" ry="9" fill="url(#castleGold)" />
          <path d="M 72,45 Q 90,15 108,45 Z" fill="#FFF4B8" />

          {/* Spire and flags */}
          <line x1="90" y1="15" x2="90" y2="0" stroke="#FFF" strokeWidth="2.5" />
          <polygon points="90,0 112,6 90,12" fill="#00C8FF" />

          {/* Double arched portals */}
          <path d="M 76,126 A 14 14 0 0 1 104,126 L 104,131 L 76,131 Z" fill="#050B14" />

          {/* Glowing Windows */}
          <polygon points="74,68 84,73 84,61 74,56" fill="#FFF4B8" className="animate-pulse" />
          <polygon points="96,73 106,68 106,56 96,61" fill="#FFF4B8" className="animate-pulse" />

          {/* Hanging banners */}
          <polygon points="63,90 63,108 58,103" fill="#00C8FF" />
          <polygon points="117,90 117,108 122,103" fill="#00C8FF" />

          {/* Floating magic sparkles */}
          <g fill="#FFF2A3" className="animate-pulse">
            <circle cx="25" cy="55" r="2.5" />
            <circle cx="155" cy="45" r="3" />
            <circle cx="90" cy="155" r="2" />
          </g>
        </g>
      )}
    </svg>
  );
}
