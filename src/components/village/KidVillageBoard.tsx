import React from 'react';
import type { Kid } from '../../data/mockData';
import IsometricCanvas from './IsometricCanvas';

interface KidVillageBoardProps {
  kidLevel: number;
  kid: Kid;
}

export default function KidVillageBoard({ kidLevel, kid }: KidVillageBoardProps) {
  const getCompletedTasks = (k: Kid) => {
    if (!k || !k.tasks) return 0;
    return k.tasks.filter(t => t.status === 'approved' || t.status === 'completed').length;
  };

  const levels = {
    bank: kid.bank_level || 3,
    farm: kid.farm_level || 3,
    market: kid.market_level || 3,
    center: kid.center_level || kidLevel || 3,
    windmill: Math.min(5, Math.max(1, Math.round(getCompletedTasks(kid) / 2) + 1)),
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-visible select-none">
      <IsometricCanvas
        mode="child"
        levels={levels}
        wallLevel={levels.center}
        kid={kid}
      />
    </div>
  );
}
