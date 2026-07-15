import React from 'react';

interface BankSVGProps {
  level: number;
}

export default function BankSVG({ level }: BankSVGProps) {
  // Detailed 2.5D Isometric shapes for architectural growth
  return (
    <svg viewBox="0 0 180 180" className="w-full h-full">
      <defs>
        <filter id="bankDropShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#040810" flood-opacity="0.6" />
        </filter>
        <linearGradient id="goldTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE054" />
          <stop offset="100%" stopColor="#E6B800" />
        </linearGradient>
        <linearGradient id="goldSide" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E6B800" />
          <stop offset="100%" stopColor="#9C7A00" />
        </linearGradient>
        <linearGradient id="copperTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0A370" />
          <stop offset="100%" stopColor="#C78552" />
        </linearGradient>
        <linearGradient id="copperSide" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C78552" />
          <stop offset="100%" stopColor="#854C22" />
        </linearGradient>
        <linearGradient id="woodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8C6A4E" />
          <stop offset="100%" stopColor="#5C4533" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <polygon points="90,145 145,117.5 90,90 35,117.5" fill="#040810" opacity="0.8" />

      {/* LEVEL 1: Tiny wooden chest/box (Low height) */}
      {level === 1 && (
        <g filter="url(#bankDropShadow)">
          {/* Wooden Chest */}
          {/* Left face */}
          <polygon points="70,120 90,130 90,115 70,105" fill="#5C4533" />
          {/* Right face */}
          <polygon points="90,130 110,120 110,105 90,115" fill="#423124" />
          {/* Top face */}
          <polygon points="90,115 110,105 90,95 70,105" fill="url(#woodGrad)" />
          {/* Steel lock lock */}
          <polygon points="87,116 93,119 93,113 87,110" fill="#7E8B9B" />
        </g>
      )}

      {/* LEVEL 2: Simple stone vault structure (Medium-low) */}
      {level === 2 && (
        <g filter="url(#bankDropShadow)">
          {/* Left wall */}
          <polygon points="55,122.5 90,140 90,100 55,82.5" fill="#5F6C7D" />
          {/* Right wall */}
          <polygon points="90,140 125,122.5 125,82.5 90,100" fill="#434E5C" />
          {/* Top roof */}
          <polygon points="90,100 125,82.5 90,65 55,82.5" fill="#7E8B9B" />
          {/* Small round vault wheel */}
          <circle cx="72" cy="111" r="5" fill="#1C273C" />
        </g>
      )}

      {/* LEVEL 3: Nice bank building with copper pillars */}
      {level === 3 && (
        <g filter="url(#bankDropShadow)">
          {/* Main walls */}
          <polygon points="45,122.5 90,145 90,95 45,72.5" fill="#3D4D6B" />
          <polygon points="90,145 135,122.5 135,72.5 90,95" fill="#24314A" />
          <polygon points="90,95 135,72.5 90,50 45,72.5" fill="#546B96" />

          {/* Copper pillars (Left face) */}
          {/* Pillar 1 */}
          <polygon points="50,112.5 54,114.5 54,80 50,78" fill="url(#copperSide)" />
          {/* Pillar 2 */}
          <polygon points="65,120 69,122 69,87.5 65,85.5" fill="url(#copperSide)" />
          {/* Pillar 3 */}
          <polygon points="80,127.5 84,129.5 84,95 80,93" fill="url(#copperSide)" />

          {/* Pediment (Copper top accent) */}
          <polygon points="43,72.5 90,96 90,88 43,64.5" fill="url(#copperTop)" />
          <polygon points="90,96 137,72.5 137,64.5 90,88" fill="url(#copperSide)" />
        </g>
      )}

      {/* LEVEL 4: Tall golden vault structure with two levels */}
      {level === 4 && (
        <g filter="url(#bankDropShadow)">
          {/* First story */}
          <polygon points="40,125 90,150 90,105 40,80" fill="#9C7A00" />
          <polygon points="90,150 140,125 140,80 90,105" fill="#806200" />
          <polygon points="90,105 140,80 90,55 40,80" fill="url(#goldTop)" />

          {/* Second story */}
          <polygon points="55,92.5 90,110 90,75 55,57.5" fill="url(#goldSide)" />
          <polygon points="90,110 125,92.5 125,75 90,75" fill="#806200" />
          <polygon points="90,75 125,92.5 90,57.5 55,57.5" fill="url(#goldTop)" />

          {/* Shield logo details */}
          <circle cx="70" cy="115" r="5" fill="#FFF2A3" />
        </g>
      )}

      {/* LEVEL 5: Massive, multi-tiered Greek-style golden bank (Grand height & elevation) */}
      {level === 5 && (
        <g filter="url(#bankDropShadow)">
          {/* Ground stairs/platform (Base) */}
          <polygon points="35,122.5 90,150 145,122.5 90,95" fill="#5F6C7D" />
          <polygon points="35,122.5 90,150 90,140 35,112.5" fill="#434E5C" />
          <polygon points="90,150 145,122.5 145,112.5 90,140" fill="#29323D" />

          {/* Main Bank Structure */}
          {/* Left block wall */}
          <polygon points="45,112.5 90,135 90,70 45,47.5" fill="url(#goldSide)" />
          {/* Right block wall */}
          <polygon points="90,135 135,112.5 135,70 90,70" fill="#806200" />

          {/* 4 Grand Golden Columns / Pillars (Standing on Left & Right faces) */}
          {/* Left face pillars */}
          <rect x="52" y="73" width="5" height="42" fill="url(#goldTop)" />
          <rect x="68" y="81" width="5" height="42" fill="url(#goldTop)" />
          <rect x="84" y="89" width="5" height="42" fill="url(#goldTop)" />
          {/* Right face pillars */}
          <rect x="100" y="89" width="5" height="42" fill="url(#goldTop)" />
          <rect x="116" y="81" width="5" height="42" fill="url(#goldTop)" />
          <rect x="123" y="77" width="5" height="42" fill="url(#goldTop)" />

          {/* Grand Triangular Pediment / Roof */}
          <polygon points="40,47.5 90,72.5 140,47.5 90,20" fill="url(#goldTop)" />
          {/* Pediment front trims */}
          <polygon points="40,47.5 90,72.5 90,66 40,41" fill="#FFE054" />
          <polygon points="90,72.5 140,47.5 140,41 90,66" fill="#CC9900" />

          {/* Top glowing Glass Dome */}
          <path d="M 75,32.5 Q 90,10 105,32.5 Z" fill="#00D2FF" opacity="0.75" />
          {/* Shimmering / Sparkling particles */}
          <g fill="#FFF2A3" className="animate-pulse">
            <circle cx="55" cy="20" r="2" />
            <circle cx="125" cy="15" r="2.5" />
            <circle cx="90" cy="5" r="1.5" />
          </g>

          {/* Giant floating gold coin */}
          <g className="animate-bounce" style={{ transformOrigin: '90px 25px' }}>
            <circle cx="90" cy="2" r="10" fill="#FFF2A3" />
            <circle cx="90" cy="2" r="8" fill="#FFD700" />
            <path d="M 87 5 L 87 -1 L 93 5 L 93 -1" stroke="#FFF2A3" strokeWidth="1.8" fill="none" />
          </g>
        </g>
      )}
    </svg>
  );
}
