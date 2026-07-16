import React from 'react';

interface FortressWallProps {
  level: number;
}

export default function FortressWall({ level }: FortressWallProps) {
  const lvl = Math.min(5, Math.max(1, level));

  // Determine wall height and colors based on levels
  const height = lvl === 1 ? 4 : lvl === 2 ? 8 : lvl === 3 ? 15 : lvl === 4 ? 24 : 36;
  const wallWidth = lvl === 1 ? 4 : lvl === 2 ? 6 : lvl === 3 ? 10 : lvl === 4 ? 14 : 18;

  // Render different styling for Level 1 (2D foundation) vs 3D walls
  if (lvl === 1) {
    return (
      <svg viewBox="0 0 400 400" className="w-full h-full opacity-60">
        {/* Simple low stone outline around the board */}
        <polygon 
          points="200,30 370,200 200,370 30,200" 
          fill="none" 
          stroke="#4A5568" 
          strokeWidth="3" 
          strokeDasharray="4,4"
        />
        {/* Low corner marker stones */}
        <circle cx="200" cy="30" r="3" fill="#718096" />
        <circle cx="370" cy="200" r="3" fill="#718096" />
        <circle cx="200" cy="370" r="3" fill="#718096" />
        <circle cx="30" cy="200" r="3" fill="#718096" />
      </svg>
    );
  }

  // Draw a 3D watchtower helper at a specific coordinate (cx, cy)
  const renderTower = (cx: number, cy: number, key: string, isBig: boolean = false) => {
    const tHeight = isBig ? height * 1.8 : height * 1.4;
    const tWidth = isBig ? wallWidth * 1.5 : wallWidth * 1.2;

    const leftX = cx - tWidth;
    const rightX = cx + tWidth;
    const topY = cy - tHeight;
    const midY = cy;

    return (
      <g key={key}>
        {/* Left Side (Shadow) */}
        <polygon 
          points={`${leftX},${midY} ${cx},${midY + tWidth/2} ${cx},${topY + tWidth/2} ${leftX},${topY}`} 
          fill={lvl === 5 ? 'url(#wallGoldR)' : 'url(#towerShadow)'} 
        />
        {/* Right Side (Light) */}
        <polygon 
          points={`${cx},${midY + tWidth/2} ${rightX},${midY} ${rightX},${topY} ${cx},${topY + tWidth/2}`} 
          fill={lvl === 5 ? 'url(#wallGoldL)' : 'url(#towerLight)'} 
        />
        {/* Tower Roof (Cone / Pyramid) */}
        <polygon 
          points={`${cx},${topY - tWidth} ${rightX},${topY} ${cx},${topY + tWidth/2} ${leftX},${topY}`} 
          fill={lvl === 5 ? 'url(#wallRoofBlue)' : '#7B3911'} 
          stroke={lvl === 5 ? '#FFF3C4' : '#5C2D0C'}
          strokeWidth="0.5"
        />
        {/* Glowing window or spire tip on level 5 */}
        {lvl === 5 && (
          <>
            <line x1={cx} y1={topY - tWidth} x2={cx} y2={topY - tWidth - 8} stroke="#FFF3C4" strokeWidth="1" />
            <circle cx={cx} cy={topY - tWidth - 8} r="1.5" fill="#00E5FF" filter="url(#wallCyanGlow)" />
            <polygon points={`${cx - 1},${topY - 5} ${cx + 1},${topY - 5} ${cx + 1},${topY - 1} ${cx - 1},${topY - 1}`} fill="#FEFCBF" />
          </>
        )}
      </g>
    );
  };

  return (
    <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
      <defs>
        {/* Gradients */}
        <linearGradient id="wallLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#718096" />
          <stop offset="100%" stopColor="#4A5568" />
        </linearGradient>
        <linearGradient id="wallShadow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A5568" />
          <stop offset="100%" stopColor="#2D3748" />
        </linearGradient>
        <linearGradient id="wallTop" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A0AEC0" />
          <stop offset="100%" stopColor="#718096" />
        </linearGradient>
        
        {/* Tower Colors */}
        <linearGradient id="towerLight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#CBD5E0" />
          <stop offset="100%" stopColor="#718096" />
        </linearGradient>
        <linearGradient id="towerShadow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4A5568" />
          <stop offset="100%" stopColor="#1A202C" />
        </linearGradient>

        {/* Level 5 Gold/Obsidian theme */}
        <linearGradient id="wallGoldL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3C4" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#9C7A1E" />
        </linearGradient>
        <linearGradient id="wallGoldR" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="70%" stopColor="#5A420A" />
          <stop offset="100%" stopColor="#1A1201" />
        </linearGradient>
        <linearGradient id="wallRoofBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#312E81" />
        </linearGradient>

        <filter id="wallCyanGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* ================= BACKGROUND WALLS (TOP LEFT & TOP RIGHT) ================= */}
      {/* Top-Left Wall (200,30 to 30,200) */}
      <polygon 
        points={`200,30 30,200 30,200 200,30`} 
        stroke={lvl === 5 ? 'url(#wallGoldL)' : '#4A5568'} 
        strokeWidth={wallWidth} 
        strokeLinecap="round"
      />
      {/* Top-Right Wall (200,30 to 370,200) */}
      <polygon 
        points={`200,30 370,200 370,200 200,30`} 
        stroke={lvl === 5 ? 'url(#wallGoldR)' : '#2D3748'} 
        strokeWidth={wallWidth} 
        strokeLinecap="round"
      />

      {/* Render watchtowers on Top, Left, Right corners */}
      {renderTower(200, 30, 'top_tower')}
      {renderTower(30, 200, 'left_tower')}
      {renderTower(370, 200, 'right_tower')}

      {/* ================= FOREGROUND WALLS (BOTTOM LEFT & BOTTOM RIGHT) ================= */}
      {/* Bottom-Left Wall Front Face (30,200 to 200,370) */}
      <g>
        {/* Wall Solid Side Panel */}
        <polygon 
          points={`30,200 200,370 200,370-${height} 30,200-${height}`} 
          fill={lvl === 5 ? 'url(#wallGoldR)' : 'url(#wallShadow)'} 
        />
        {/* Wall Top Path cap */}
        <polygon 
          points={`30,200-${height} 200,370-${height} ${200 - wallWidth},${370 - wallWidth/2}-${height} ${30 + wallWidth},${200 + wallWidth/2}-${height}`} 
          fill={lvl === 5 ? 'url(#wallRoofBlue)' : 'url(#wallTop)'} 
          stroke={lvl === 5 ? '#FFF3C4' : 'none'}
          strokeWidth="0.5"
        />
        {/* Glowing neon line for level 5 */}
        {lvl === 5 && (
          <path 
            d={`M 30,${200 - height/2} Q 115,${285 - height/2} 200,${370 - height/2}`} 
            fill="none" 
            stroke="#00E5FF" 
            strokeWidth="1.5" 
            filter="url(#wallCyanGlow)" 
          />
        )}
      </g>

      {/* Bottom-Right Wall Front Face (200,370 to 370,200) */}
      <g>
        {/* Wall Solid Side Panel */}
        <polygon 
          points={`200,370 370,200 370,200-${height} 200,370-${height}`} 
          fill={lvl === 5 ? 'url(#wallGoldL)' : 'url(#wallLight)'} 
        />
        {/* Wall Top Path cap */}
        <polygon 
          points={`200,370-${height} 370,200-${height} ${370 - wallWidth},${200 + wallWidth/2}-${height} ${200 + wallWidth},${370 - wallWidth/2}-${height}`} 
          fill={lvl === 5 ? 'url(#wallRoofBlue)' : 'url(#wallTop)'} 
          stroke={lvl === 5 ? '#FFF3C4' : 'none'}
          strokeWidth="0.5"
        />
        {/* Glowing neon line for level 5 */}
        {lvl === 5 && (
          <path 
            d={`M 200,${370 - height/2} Q 285,${285 - height/2} 370,${200 - height/2}`} 
            fill="none" 
            stroke="#00E5FF" 
            strokeWidth="1.5" 
            filter="url(#wallCyanGlow)" 
          />
        )}
      </g>

      {/* Render Main Watchtower at Bottom (largest tower) */}
      {renderTower(200, 370, 'bottom_tower', true)}

      {/* Archway gate details at bottom watchtower */}
      <path 
        d={`M 194,${370 + 4} Q 200,${364} 206,${370 + 4} L 206,${370 + 10} L 194,${370 + 8} Z`} 
        fill={lvl === 5 ? '#00E5FF' : '#1A202C'} 
        stroke={lvl === 5 ? '#FFF' : 'none'}
      />
    </svg>
  );
}
