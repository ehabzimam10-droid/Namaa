import React from 'react';

interface BankSVGProps {
  level: number;
}

export default function BankSVG({ level }: BankSVGProps) {
  const lvl = Math.min(5, Math.max(1, level));
  return (
    <img
      src={`/assets/village/bank_${lvl}.png`}
      alt={`Bank Level ${lvl}`}
      className="w-full h-full object-contain"
    />
  );
}
