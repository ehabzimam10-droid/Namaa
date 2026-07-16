import React, { useState } from 'react';
import type { Kid } from '../../data/mockData';

interface KidVillageBoardProps {
  kidLevel: number;
  kid: Kid;
}

export default function KidVillageBoard({ kidLevel, kid }: KidVillageBoardProps) {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

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

  // Tooltip content helper for kid's individual progress
  const getTooltipData = (hotspot: string) => {
    if (!kid) return null;
    switch (hotspot) {
      case 'center':
        return {
          title: 'المنزل الرئيسي 🏰',
          desc: 'المستوى العام لنموك الشخصي والمالي',
          val: `${(kid.balance || 0) + (kid.saved || 0)} ريال (إجمالي الثروة)`
        };
      case 'bank':
        return {
          title: 'حصالة الادخار 💰',
          desc: 'مجموع المبالغ المودعة في حصالتك',
          val: `${kid.saved || 0} ريال موفر`
        };
      case 'market':
        return {
          title: 'مستقبلي الاستثماري 📈',
          desc: 'حجم المشاركة في تمويل المشاريع الاستثمارية',
          val: `${getInvestmentAmount(kid)} ريال مستثمر`
        };
      case 'farm':
        return {
          title: 'مساحة التبرعات وعمل الخير 💚',
          desc: 'تبرعاتك ونقاط الخير المكتسبة بالدوري',
          val: `${kid.donationPoints || 0} نقطة خير`
        };
      case 'windmill':
        return {
          title: 'طاحونة إنجاز المهام ⚙️',
          desc: 'الواجبات المنزلية المعتمدة بنجاح',
          val: `${getCompletedTasks(kid)} مهام مكتملة`
        };
      default:
        return null;
    }
  };

  const activeTooltip = hoveredHotspot ? getTooltipData(hoveredHotspot) : null;

  return (
    <div className="relative w-full max-w-2xl aspect-square mx-auto flex items-center justify-center p-2 overflow-visible">
      {/* 2.5D Kid Village Map Container */}
      <div 
        className="w-full h-full relative rounded-3xl overflow-visible shadow-2xl border border-white/10"
        style={{
          boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 2px 10px rgba(255,255,255,0.05)',
        }}
      >
        {/* Render the pre-rendered Kid Village Image based on their status level */}
        {imgError ? (
          <div className="w-full h-auto min-h-[400px] aspect-square flex flex-col items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl text-sm font-bold text-slate-350 select-none animate-pulse">
            <span className="text-3xl mb-2">🏡</span>
            <span>جاري تحميل معالم القرية...</span>
          </div>
        ) : (
          <img
            src={`/assets/village/village_${kidLevel || 1}.png`}
            alt={`Village Level ${kidLevel || 1}`}
            className="w-full h-auto min-h-[400px] object-contain block rounded-3xl"
            onError={() => setImgError(true)}
          />
        )}

        {/* 1. Center Castle / Manor House Hotspot */}
        <div
          className="absolute cursor-pointer border border-transparent hover:border-yellow-500/30 rounded-2xl transition-all"
          style={{ top: '20%', left: '35%', width: '30%', height: '30%' }}
          onMouseEnter={() => setHoveredHotspot('center')}
          onMouseLeave={() => setHoveredHotspot(null)}
        />

        {/* 2. Bank / Savings Hotspot */}
        <div
          className="absolute cursor-pointer border border-transparent hover:border-orange-500/30 rounded-2xl transition-all"
          style={{ top: '20%', left: '10%', width: '25%', height: '25%' }}
          onMouseEnter={() => setHoveredHotspot('bank')}
          onMouseLeave={() => setHoveredHotspot(null)}
        />

        {/* 3. Market / Investment Hotspot */}
        <div
          className="absolute cursor-pointer border border-transparent hover:border-amber-500/30 rounded-2xl transition-all"
          style={{ top: '20%', right: '10%', width: '25%', height: '25%' }}
          onMouseEnter={() => setHoveredHotspot('market')}
          onMouseLeave={() => setHoveredHotspot(null)}
        />

        {/* 4. Farm / Donation Hotspot */}
        <div
          className="absolute cursor-pointer border border-transparent hover:border-emerald-500/30 rounded-2xl transition-all"
          style={{ top: '55%', left: '15%', width: '25%', height: '25%' }}
          onMouseEnter={() => setHoveredHotspot('farm')}
          onMouseLeave={() => setHoveredHotspot(null)}
        />

        {/* 5. Windmill / Tasks Hotspot */}
        <div
          className="absolute cursor-pointer border border-transparent hover:border-blue-500/30 rounded-2xl transition-all"
          style={{ top: '55%', right: '15%', width: '25%', height: '25%' }}
          onMouseEnter={() => setHoveredHotspot('windmill')}
          onMouseLeave={() => setHoveredHotspot(null)}
        />

        {/* Floating Glassmorphism Tooltip for Kid's Active Hotspot */}
        {activeTooltip && (
          <div 
            className="absolute bottom-[85%] left-1/2 -translate-x-1/2 bg-[#0D1527]/95 border border-white/15 p-4 rounded-2xl shadow-2xl z-50 backdrop-blur-md text-right font-sans min-w-[260px] pointer-events-none animate-fade-in"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="border-b border-white/10 pb-2 mb-2">
              <h5 className="font-extrabold text-sm text-white">{activeTooltip.title}</h5>
              <p className="text-[9px] text-slate-400 mt-0.5">{activeTooltip.desc}</p>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-orange-400 font-sans">{activeTooltip.val}</span>
              <span className="text-slate-350">مستواك الحالي:</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
