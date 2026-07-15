import React from 'react';

interface MarketSVGProps {
  level: number;
}

export default function MarketSVG({ level }: MarketSVGProps) {
  // Return different SVG structures based on levels
  return (
    <svg viewBox="0 0 180 180" className="w-full h-full">
      <defs>
        <filter id="marketDropShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#040810" flood-opacity="0.6" />
        </filter>
        <linearGradient id="carpetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C24D4D" />
          <stop offset="100%" stopColor="#802626" />
        </linearGradient>
        <linearGradient id="roofStripeRed" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D9534F" />
          <stop offset="100%" stopColor="#A94442" />
        </linearGradient>
        <linearGradient id="bazaarGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFE054" />
          <stop offset="100%" stopColor="#B38F00" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <polygon points="90,145 145,117.5 90,90 35,117.5" fill="#040810" opacity="0.8" />

      {/* LEVEL 1: Small rug (low height, simple carpet lying on the ground) */}
      {level === 1 && (
        <g filter="url(#marketDropShadow)">
          {/* Flat thin carpet */}
          <polygon points="50,115 90,135 130,115 90,95" fill="url(#carpetGrad)" />
          {/* Carpet fringes/lines */}
          <line x1="50" y1="115" x2="60" y2="120" stroke="#FFF" strokeWidth="1.5" opacity="0.6" />
          <line x1="130" y1="115" x2="120" y2="110" stroke="#FFF" strokeWidth="1.5" opacity="0.6" />
          {/* A small brown bowl on the rug */}
          <ellipse cx="90" cy="115" rx="5" ry="2.5" fill="#5C4533" />
        </g>
      )}

      {/* LEVEL 2: Simple wooden table under a single small red/white striped canopy */}
      {level === 2 && (
        <g filter="url(#marketDropShadow)">
          {/* Base */}
          <polygon points="35,117.5 90,145 145,117.5 90,90" fill="#24324D" />

          {/* Wooden posts */}
          <rect x="55" y="80" width="3.5" height="36" fill="#6B5641" />
          <rect x="85" y="93" width="3.5" height="36" fill="#6B5641" />
          <rect x="110" y="80" width="3.5" height="36" fill="#6B5641" />

          {/* Counter table */}
          <polygon points="50,105 85,122 85,114 50,97" fill="#6B5641" />
          <polygon points="85,122 120,105 120,97 85,114" fill="#4A3423" />
          <polygon points="85,114 120,97 85,82 50,97" fill="#8C6E53" />

          {/* Striped Canopy Roof */}
          <polygon points="45,82 85,99 85,93 45,76" fill="url(#roofStripeRed)" />
          <polygon points="85,99 122,82 122,76 85,93" fill="#FFF" />
          <polygon points="85,93 122,76 85,60 45,77" fill="url(#roofStripeRed)" />
        </g>
      )}

      {/* LEVEL 3: Two tents side by side with flags */}
      {level === 3 && (
        <g filter="url(#marketDropShadow)">
          {/* Floor */}
          <polygon points="35,117.5 90,145 145,117.5 90,90" fill="#24324D" />

          {/* Tent 1 (Left side) */}
          <line x1="50" y1="102" x2="50" y2="75" stroke="#6B5641" strokeWidth="3" />
          <line x1="80" y1="117" x2="80" y2="90" stroke="#6B5641" strokeWidth="3" />
          <polygon points="45,75 80,92.5 80,85 45,67.5" fill="#D4A47E" />
          <polygon points="80,92.5 110,77.5 110,70 80,85" fill="#FFF" />
          <polygon points="80,85 110,70 80,52.5 45,67.5" fill="#D4A47E" />

          {/* Tent 2 (Right side) */}
          <line x1="90" y1="97" x2="90" y2="77" stroke="#6B5641" strokeWidth="2.5" />
          <line x1="115" y1="84" x2="115" y2="64" stroke="#6B5641" strokeWidth="2.5" />
          <polygon points="87,77 115,91 115,86 87,72" fill="#009639" />
          <polygon points="115,91 137,80 137,75 115,86" fill="#FFF" />
          <polygon points="115,86 137,75 115,60 87,72" fill="#009639" />
        </g>
      )}

      {/* LEVEL 4: Solid wooden market bazaar with striped roofs and merchant boxes */}
      {level === 4 && (
        <g filter="url(#marketDropShadow)">
          {/* Grand wooden floor deck */}
          <polygon points="35,117.5 90,145 145,117.5 90,90" fill="#6E553F" />

          {/* Front arches / pillars */}
          <rect x="52" y="85" width="4.5" height="38" fill="#8C7355" />
          <rect x="78" y="98" width="4.5" height="38" fill="#8C7355" />
          <rect x="105" y="98" width="4.5" height="38" fill="#8C7355" />
          <rect x="123" y="88" width="4.5" height="38" fill="#8C7355" />

          {/* Multi-striped grand roofs */}
          <polygon points="45,85 78,101.5 78,95 45,78.5" fill="url(#roofStripeRed)" />
          <polygon points="78,101.5 105,88 105,82 78,95" fill="#FFF" />
          <polygon points="105,88 132,74.5 132,68.5 105,82" fill="url(#roofStripeRed)" />
          {/* Top ridges */}
          <polygon points="78,95 105,82 78,65 45,78" fill="#D9534F" />

          {/* Merchant crates/boxes on floor */}
          <polygon points="55,120 65,125 65,115 55,110" fill="#8C6E53" />
          <polygon points="110,120 120,125 120,115 110,110" fill="#8C6E53" />
        </g>
      )}

      {/* LEVEL 5: Grand multi-tiered bazaar marketplace with colorful banners, glowing lanterns, golden columns, wind flags waving, and crowded details (High height & majestic scale) */}
      {level === 5 && (
        <g filter="url(#marketDropShadow)">
          {/* Base tiled platform */}
          <polygon points="35,117.5 90,145 145,117.5 90,90" fill="#24324D" />
          <polygon points="35,117.5 90,145 90,137 35,109.5" fill="#1C273C" />
          <polygon points="90,145 145,117.5 145,109.5 90,137" fill="#151E2E" />

          {/* Main bazaar dome center (Story 1) */}
          <polygon points="50,110 90,130 130,110 90,80" fill="url(#bazaarGold)" />
          {/* Main pillars */}
          <rect x="52" y="80" width="5" height="34" fill="#FFE552" />
          <rect x="80" y="94" width="5" height="34" fill="#FFE552" />
          <rect x="108" y="94" width="5" height="34" fill="#FFE552" />
          <rect x="123" y="86.5" width="5" height="34" fill="#FFE552" />

          {/* Story 2: Elevated dome canopy */}
          <polygon points="62,80 90,94 118,80 90,60" fill="#00C8FF" />
          {/* Golden top spire */}
          <polygon points="80,60 90,65 100,60 90,40" fill="#FFE552" />

          {/* Colorful Banners hanging */}
          {/* Left banner (Red/White) */}
          <polygon points="56,92 56,108 61,104" fill="#D9534F" />
          <polygon points="61,94 61,110 66,106" fill="#FFF" />
          {/* Right banner (Green/Gold) */}
          <polygon points="108,98 108,114 113,110" fill="#009639" />
          <polygon points="113,96 113,112 118,108" fill="#FFE552" />

          {/* Waving/Spinning wind flag on top */}
          <g className="animate-bounce" style={{ transformOrigin: '90px 40px' }}>
            <line x1="90" y1="40" x2="90" y2="20" stroke="#FFE552" strokeWidth="2.5" />
            <polygon points="90,20 112,26 90,32" fill="#E57A44" />
          </g>

          {/* Glowing lanterns (Level 5 only) */}
          <circle cx="70" cy="94" r="3.5" fill="#FFC90E" className="animate-pulse" />
          <circle cx="110" cy="94" r="3.5" fill="#FFC90E" className="animate-pulse" />

          {/* Sparkles */}
          <g fill="#FFF2A3" className="animate-pulse">
            <circle cx="45" cy="50" r="2" />
            <circle cx="135" cy="45" r="2.5" />
          </g>
        </g>
      )}
    </svg>
  );
}
