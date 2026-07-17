import React from 'react';

interface MarketSVGProps {
  level: number;
}

export default function MarketSVG({ level }: MarketSVGProps) {
  const lvl = Math.min(5, Math.max(1, level));
  return (
    <img
      src={`/assets/village/market_${lvl}.png`}
      alt={`Market Level ${lvl}`}
      className="w-full h-full object-contain"
    />
  );
}
