import React from 'react';

interface WindmillProps {
  level: number;
}

export default function Windmill({ level }: WindmillProps) {
  const lvl = Math.min(5, Math.max(1, level));
  return (
    <img
      src={`/assets/village/windmill_${lvl}.png`}
      alt={`Windmill Level ${lvl}`}
      className="w-full h-full object-contain"
    />
  );
}
