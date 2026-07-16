import React from 'react';

interface FarmSVGProps {
  level: number;
}

export default function FarmSVG({ level }: FarmSVGProps) {
  const lvl = Math.min(5, Math.max(1, level));
  return (
    <img
      src={`/assets/village/farm_${lvl}.png.png`}
      alt={`Farm Level ${lvl}`}
      className="w-full h-full object-contain"
    />
  );
}
