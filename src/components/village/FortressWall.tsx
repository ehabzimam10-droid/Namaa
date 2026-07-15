import React from 'react';

interface FortressWallProps {
  level: number;
}

export default function FortressWall({ level }: FortressWallProps) {
  // Styles for the perimeter wall depending on level
  const getWallStyles = () => {
    switch (level) {
      case 1:
        return {
          stroke: '#8C7355',
          strokeWidth: '4',
          strokeDasharray: '6 6',
          opacity: 0.6,
        };
      case 2:
        return {
          stroke: '#5C4533', // Palisade wood fence
          strokeWidth: '8',
          strokeDasharray: 'none',
          opacity: 0.8,
        };
      case 3:
        return {
          stroke: '#5F6C7D', // Normal stone wall
          strokeWidth: '12',
          strokeDasharray: 'none',
          opacity: 0.9,
        };
      case 4:
        return {
          stroke: '#4B5666', // Strong stone fortress wall
          strokeWidth: '16',
          strokeDasharray: 'none',
          opacity: 1,
        };
      case 5:
      default:
        return {
          stroke: '#FFD700', // Golden Empire Wall
          strokeWidth: '20',
          strokeDasharray: 'none',
          opacity: 1,
        };
    }
  };

  const w = getWallStyles();

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      {/* Surrounding perimeter line (lies flat on the board floor) */}
      <svg className="absolute inset-0 w-full h-full rounded-[45px] pointer-events-none">
        <rect
          x="15"
          y="15"
          width="300"
          height="300"
          rx="45"
          fill="none"
          stroke={w.stroke}
          strokeWidth={w.strokeWidth}
          strokeDasharray={w.strokeDasharray}
          opacity={w.opacity}
          style={{ transition: 'all 0.5s ease' }}
        />
        
        {/* Extra gold inner trim for Level 5 */}
        {level === 5 && (
          <rect
            x="25"
            y="25"
            width="280"
            height="280"
            rx="35"
            fill="none"
            stroke="#FFE552"
            strokeWidth="3"
            opacity="0.8"
          />
        )}
      </svg>

      {/* Upright Corner Turret Towers (Counter-rotated to stand straight) */}
      {level >= 2 && (
        <>
          {/* Top-Left Corner Post */}
          <div
            className="absolute top-[-5px] left-[-5px] w-10 h-10"
            style={{ transform: 'rotateZ(45deg) rotateX(-60deg)' }}
          >
            <TurretSVG level={level} />
          </div>

          {/* Top-Right Corner Post */}
          <div
            className="absolute top-[-5px] right-[-5px] w-10 h-10"
            style={{ transform: 'rotateZ(45deg) rotateX(-60deg)' }}
          >
            <TurretSVG level={level} />
          </div>

          {/* Bottom-Left Corner Post */}
          <div
            className="absolute bottom-[-5px] left-[-5px] w-10 h-10"
            style={{ transform: 'rotateZ(45deg) rotateX(-60deg)' }}
          >
            <TurretSVG level={level} />
          </div>

          {/* Bottom-Right Corner Post */}
          <div
            className="absolute bottom-[-5px] right-[-5px] w-10 h-10"
            style={{ transform: 'rotateZ(45deg) rotateX(-60deg)' }}
          >
            <TurretSVG level={level} />
          </div>
        </>
      )}
    </div>
  );
}

// Corner Guard Turret SVG helper
function TurretSVG({ level }: { level: number }) {
  const getTurretColors = () => {
    switch (level) {
      case 2:
        return { walls: '#5C4533', top: '#8C7355' };
      case 3:
        return { walls: '#4B5666', top: '#E57A44' };
      case 4:
        return { walls: '#3D4D6B', top: '#FFE552' };
      case 5:
      default:
        return { walls: '#FFD700', top: '#00C8FF' };
    }
  };

  const tc = getTurretColors();

  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      {/* Shadow */}
      <ellipse cx="20" cy="35" rx="12" ry="5" fill="#000" opacity="0.4" />
      {/* Main post */}
      <rect x="14" y="10" width="12" height="25" fill={tc.walls} rx="1" />
      {/* Top cap */}
      <polygon points="10,10 20,0 30,10" fill={tc.top} />
      {/* Glowing light for L5 */}
      {level === 5 && (
        <circle cx="20" cy="20" r="2.5" fill="#FFF4B8" className="animate-pulse" />
      )}
    </svg>
  );
}
