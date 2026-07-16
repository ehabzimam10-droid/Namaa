import React from 'react';

interface CenterSVGProps {
  level: number;
}

export default function CenterSVG({ level }: CenterSVGProps) {
  const lvl = Math.min(5, Math.max(1, level));
  return (
    <img
      src={`/assets/village/center_${lvl}.png.png`}
      alt={`Center Level ${lvl}`}
      className="w-full h-full object-contain"
    />
  );
}
