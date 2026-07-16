import React, { useState } from 'react';
import type { Kid } from '../../data/mockData';

interface KingdomBoardProps {
  familyLevel: number;
  kids: Kid[];
}

export default function KingdomBoard({ familyLevel, kids }: KingdomBoardProps) {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  // Safeguards to get kids' data
  const khalid = kids.find(k => k.name === 'خالد') || kids[0];
  const salem = kids.find(k => k.name === 'سالم') || kids[1] || kids[0];

  // Helper calculations for specific building stats
  const getInvestmentAmount = (k: Kid) => {
    if (!k || !k.transactions) return 0;
    return k.transactions
      .filter(t => t.description?.includes('استثمار') || t.type === 'investment' || t.category === 'استثمار')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  const getCompletedTasks = (k: Kid) => {
    if (!k || !k.tasks) return 0;
    return k.tasks.filter(t => t.status === 'approved' || t.status === 'completed').length;
  };

  // Tooltip content helper
  const getTooltipData = (hotspot: string) => {
    switch (hotspot) {
      case 'center':
        return {
          title: 'قلعة العائلة الكبرى 🏰',
          desc: 'المستوى العام المشترك ونماء المملكة العام',
          stats: [
            { name: khalid?.name || 'خالد', val: `${(khalid?.balance || 0) + (khalid?.saved || 0)} ريال (إجمالي الثروة)` },
            { name: salem?.name || 'سالم', val: `${(salem?.balance || 0) + (salem?.saved || 0)} ريال (إجمالي الثروة)` }
          ]
        };
      case 'bank':
        return {
          title: 'البنك العائلي 💰',
          desc: 'مجموع المدخرات والأرصدة المودعة بالحصالة',
          stats: [
            { name: khalid?.name || 'خالد', val: `${khalid?.saved || 0} ريال مدخر` },
            { name: salem?.name || 'سالم', val: `${salem?.saved || 0} ريال مدخر` }
          ]
        };
      case 'market':
        return {
          title: 'سوق الاستثمار المشترك 📈',
          desc: 'المشاريع الاستثمارية المفتوحة وحجم رأس المال',
          stats: [
            { name: khalid?.name || 'خالد', val: `${getInvestmentAmount(khalid)} ريال مستثمر` },
            { name: salem?.name || 'سالم', val: `${getInvestmentAmount(salem)} ريال مستثمر` }
          ]
        };
      case 'farm':
        return {
          title: 'مزرعة العطاء والخير 💚',
          desc: 'المساهمات المجتمعية ونقاط التبرع بالواحة',
          stats: [
            { name: khalid?.name || 'خالد', val: `${khalid?.donationPoints || 0} نقطة خير` },
            { name: salem?.name || 'سالم', val: `${salem?.donationPoints || 0} نقطة خير` }
          ]
        };
      case 'windmill':
        return {
          title: 'طاحونة المهام والمسؤوليات ⚙️',
          desc: 'معدل إنجاز الواجبات المنزلية والتمكين اليومي',
          stats: [
            { name: khalid?.name || 'خالد', val: `${getCompletedTasks(khalid)} مهام مكتملة` },
            { name: salem?.name || 'سالم', val: `${getCompletedTasks(salem)} مهام مكتملة` }
          ]
        };
      default:
        return null;
    }
  };

  const activeTooltip = hoveredHotspot ? getTooltipData(hoveredHotspot) : null;

  return (
    <div className="relative w-full max-w-2xl aspect-square mx-auto flex items-center justify-center p-2 overflow-visible">
      {/* 2.5D Master Kingdom Map Container */}
      <div 
        className="w-full h-full relative rounded-3xl overflow-visible shadow-2xl border border-white/10"
        style={{
          boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 2px 10px rgba(255,255,255,0.05)',
        }}
      >
        {/* Render the Master Pre-rendered Kingdom Image based on family castle level */}
        <img
          src={`/assets/village/kingdom_${familyLevel}.png`}
          alt={`Kingdom Level ${familyLevel}`}
          className="w-full h-full object-contain rounded-3xl"
          onError={(e) => {
            // Fallback to level 3 if image fails to load
            (e.target as HTMLImageElement).src = '/assets/village/kingdom_3.png';
          }}
        />

        {/* 1. Center Castle Hotspot */}
        <div
          className="absolute cursor-pointer border border-transparent hover:border-yellow-500/30 rounded-2xl transition-all"
          style={{ top: '20%', left: '35%', width: '30%', height: '30%' }}
          onMouseEnter={() => setHoveredHotspot('center')}
          onMouseLeave={() => setHoveredHotspot(null)}
        />

        {/* 2. Bank Hotspot */}
        <div
          className="absolute cursor-pointer border border-transparent hover:border-orange-500/30 rounded-2xl transition-all"
          style={{ top: '20%', left: '10%', width: '25%', height: '25%' }}
          onMouseEnter={() => setHoveredHotspot('bank')}
          onMouseLeave={() => setHoveredHotspot(null)}
        />

        {/* 3. Market Hotspot */}
        <div
          className="absolute cursor-pointer border border-transparent hover:border-amber-500/30 rounded-2xl transition-all"
          style={{ top: '20%', right: '10%', width: '25%', height: '25%' }}
          onMouseEnter={() => setHoveredHotspot('market')}
          onMouseLeave={() => setHoveredHotspot(null)}
        />

        {/* 4. Farm Hotspot */}
        <div
          className="absolute cursor-pointer border border-transparent hover:border-emerald-500/30 rounded-2xl transition-all"
          style={{ top: '55%', left: '15%', width: '25%', height: '25%' }}
          onMouseEnter={() => setHoveredHotspot('farm')}
          onMouseLeave={() => setHoveredHotspot(null)}
        />

        {/* 5. Windmill Hotspot */}
        <div
          className="absolute cursor-pointer border border-transparent hover:border-blue-500/30 rounded-2xl transition-all"
          style={{ top: '55%', right: '15%', width: '25%', height: '25%' }}
          onMouseEnter={() => setHoveredHotspot('windmill')}
          onMouseLeave={() => setHoveredHotspot(null)}
        />

        {/* Floating Glassmorphism Tooltip for Active Hotspot */}
        {activeTooltip && (
          <div 
            className="absolute bottom-[85%] left-1/2 -translate-x-1/2 bg-[#0D1527]/95 border border-white/15 p-4 rounded-2xl shadow-2xl z-50 backdrop-blur-md text-right font-sans min-w-[260px] pointer-events-none animate-fade-in"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="border-b border-white/10 pb-2 mb-2">
              <h5 className="font-extrabold text-sm text-white">{activeTooltip.title}</h5>
              <p className="text-[9px] text-slate-400 mt-0.5">{activeTooltip.desc}</p>
            </div>
            <div className="space-y-1.5">
              {activeTooltip.stats.map((s, idx) => (
                <div key={idx} className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-orange-400 font-sans">{s.val}</span>
                  <span className="text-slate-300">{s.name}:</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
