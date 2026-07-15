import React from 'react';

interface FarmSVGProps {
  level: number;
}

export default function FarmSVG({ level }: FarmSVGProps) {
  // Ground variables based on level
  return (
    <svg viewBox="0 0 180 180" className="w-full h-full">
      <defs>
        <filter id="farmDropShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#040810" flood-opacity="0.6" />
        </filter>
        <linearGradient id="drySoil" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8C7355" />
          <stop offset="100%" stopColor="#5C4A38" />
        </linearGradient>
        <linearGradient id="greenPasture" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5CA647" />
          <stop offset="100%" stopColor="#2E661F" />
        </linearGradient>
        <linearGradient id="magicWater" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#008CFF" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <polygon points="90,145 145,117.5 90,90 35,117.5" fill="#040810" opacity="0.8" />

      {/* LEVEL 1: Tiny Dry Plot (low height, flat, dry brown soil) */}
      {level === 1 && (
        <g filter="url(#farmDropShadow)">
          {/* Flat thin dry patch */}
          <polygon points="35,117.5 90,145 145,117.5 90,90" fill="url(#drySoil)" />
          {/* Side mud lines */}
          <polygon points="35,117.5 90,145 90,140 35,112.5" fill="#5C4A38" />
          <polygon points="90,145 145,117.5 145,112.5 90,140" fill="#423427" />
          {/* Mud cracks */}
          <path d="M 65,110 L 80,105 L 85,112" stroke="#2B1D12" strokeWidth="2" fill="none" />
          <path d="M 95,102 L 105,108 L 115,100" stroke="#2B1D12" strokeWidth="2" fill="none" />
        </g>
      )}

      {/* LEVEL 2: Soil patch with minor green grass tufts */}
      {level === 2 && (
        <g filter="url(#farmDropShadow)">
          {/* Base plot */}
          <polygon points="35,117.5 90,145 145,117.5 90,90" fill="#758C5A" />
          <polygon points="35,117.5 90,145 90,138 35,110.5" fill="#4E5E3D" />
          <polygon points="90,145 145,117.5 145,110.5 90,138" fill="#323E27" />

          {/* Simple grass rows */}
          <path d="M 60,110 L 62,103 M 65,112 L 67,105" stroke="#009639" strokeWidth="3" />
          <path d="M 90,115 L 92,108 M 95,117 L 97,110" stroke="#009639" strokeWidth="3" />
          <path d="M 110,102 L 112,95 M 115,104 L 117,97" stroke="#009639" strokeWidth="3" />
        </g>
      )}

      {/* LEVEL 3: A lush green pasture, small blue pond, and a stone well */}
      {level === 3 && (
        <g filter="url(#farmDropShadow)">
          {/* Base plot */}
          <polygon points="35,117.5 90,145 145,117.5 90,90" fill="url(#greenPasture)" />
          <polygon points="35,117.5 90,145 90,136 35,108.5" fill="#2E661F" />
          <polygon points="90,145 145,117.5 145,108.5 90,136" fill="#1C4012" />

          {/* Pond */}
          <ellipse cx="110" cy="110" rx="16" ry="8" fill="#00A8F3" />
          <ellipse cx="106" cy="110" rx="10" ry="5" fill="#FFF" opacity="0.3" />

          {/* Stone Well */}
          <polygon points="50,105 65,112 65,97 50,90" fill="#5F6C7D" />
          <polygon points="65,112 80,105 80,97 65,97" fill="#434E5C" />
          <polygon points="65,97 80,105 65,105 50,97" fill="#8C7355" />
          <line x1="58" y1="97" x2="58" y2="82" stroke="#5F6C7D" strokeWidth="2.5" />
          <line x1="72" y1="102" x2="72" y2="87" stroke="#5F6C7D" strokeWidth="2.5" />
          <polygon points="52,84 65,90 78,84" fill="#C78552" />
        </g>
      )}

      {/* LEVEL 4: Multi-tiered terrace garden with green crops, a waterfall, and flowers */}
      {level === 4 && (
        <g filter="url(#farmDropShadow)">
          {/* Terrace level 1 */}
          <polygon points="35,117.5 90,145 145,117.5 90,90" fill="url(#greenPasture)" />
          <polygon points="35,117.5 90,145 90,138 35,110.5" fill="#2E661F" />
          <polygon points="90,145 145,117.5 145,110.5 90,138" fill="#1C4012" />

          {/* Terrace level 2 (Elevated block) */}
          <polygon points="60,95 90,110 120,95 90,80" fill="#4CAE6D" />
          <polygon points="60,95 90,110 90,103 60,88" fill="#2C7F4B" />
          <polygon points="90,110 120,95 120,88 90,103" fill="#185630" />

          {/* Small stream pouring */}
          <path d="M 90,98 L 90,120" stroke="#00E5FF" strokeWidth="4" strokeLinecap="round" className="animate-pulse" />

          {/* Crops and flowers */}
          <circle cx="50" cy="115" r="4.5" fill="#FFC90E" />
          <circle cx="130" cy="110" r="4.5" fill="#FFC90E" />
          <circle cx="70" cy="92" r="3" fill="#FFF" />
          <circle cx="110" cy="92" r="3" fill="#FFF" />
        </g>
      )}

      {/* LEVEL 5: Lush Grand Oasis with moving water paths (Tiered waterfall, golden shrine archway, animated splash water paths, and glowing lotus flowers) */}
      {level === 5 && (
        <g filter="url(#farmDropShadow)">
          {/* Main green pasture ground */}
          <polygon points="35,117.5 90,145 145,117.5 90,90" fill="#00B846" />
          <polygon points="35,117.5 90,145 90,136 35,108.5" fill="#007A2E" />
          <polygon points="90,145 145,117.5 145,108.5 90,136" fill="#00521F" />

          {/* Elevated waterfall rock (2 levels) */}
          {/* Tier 1 */}
          <polygon points="70,95 90,105 120,90 95,75" fill="#4D5D75" />
          {/* Tier 2 (Top shrine block) */}
          <polygon points="82,75 90,79 110,69 102,65" fill="#FFD700" />
          <polygon points="82,75 90,79 90,70 82,66" fill="#CC9900" />

          {/* Waterfall (Tier 2 to Tier 1, and Tier 1 to Ground Pond) */}
          {/* Upper fall */}
          <path d="M 94,76 L 94,92" stroke="#00FFFF" strokeWidth="5.5" strokeLinecap="round" className="animate-pulse" />
          {/* Lower fall */}
          <path d="M 94,96 L 94,124" stroke="url(#magicWater)" strokeWidth="8" strokeLinecap="round" className="animate-pulse" />

          {/* Ground River/Pond flowing around the center */}
          <ellipse cx="90" cy="128" rx="28" ry="12" fill="url(#magicWater)" />
          <ellipse cx="88" cy="128" rx="18" ry="7" fill="#E0FFFF" opacity="0.6" />

          {/* Golden Shrine Archway */}
          <path d="M 70,82 Q 95,50 120,82" stroke="#FFE552" strokeWidth="4.5" fill="none" />

          {/* Lotus Flowers & Waterlilies */}
          <circle cx="70" cy="125" r="4" fill="#FF83FA" />
          <circle cx="110" cy="130" r="4.5" fill="#FF83FA" />
          <circle cx="85" cy="133" r="3" fill="#FFF2A3" />

          {/* Glowing/Shimmering particles */}
          <g fill="#FFF2A3" className="animate-pulse">
            <circle cx="50" cy="65" r="2.5" />
            <circle cx="130" cy="60" r="2" />
            <circle cx="95" cy="40" r="3" />
          </g>
        </g>
      )}
    </svg>
  );
}
