import React from 'react';

interface FortressWallProps {
  level: number;
}

export default function FortressWall({ level }: FortressWallProps) {
  const lvl = Math.min(5, Math.max(1, level));
  return (
    <img
      src={`/assets/village/wall_${lvl}.png.png`}
      alt={`Fortress Wall Level ${lvl}`}
      className="w-full h-full object-contain"
    />
  );
}
