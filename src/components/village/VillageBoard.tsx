import React from 'react';
import BankSVG from './BankSVG';
import FarmSVG from './FarmSVG';
import MarketSVG from './MarketSVG';
import CenterSVG from './CenterSVG';
import Windmill from './Windmill';
import FortressWall from './FortressWall';

interface VillageBoardProps {
  levels: {
    bank: number;
    farm: number;
    market: number;
    center: number;
    windmill: number;
  };
  wallLevel?: number;
}

export default function VillageBoard({ levels, wallLevel }: VillageBoardProps) {
  const finalWallLevel = wallLevel !== undefined ? wallLevel : levels.center;

  // 3D Billboard Transform Generator based on Level
  const get3DStyle = (lvl: number) => {
    const zOffset = lvl === 1 ? 0 : lvl === 2 ? 6 : lvl === 3 ? 14 : lvl === 4 ? 26 : 42;
    const scale = lvl === 1 ? 0.72 : lvl === 2 ? 0.92 : lvl === 3 ? 1.12 : lvl === 4 ? 1.28 : 1.48;

    return {
      transformStyle: 'preserve-3d' as const,
      transform: `translate(-50%, -50%) rotateZ(45deg) rotateX(-58deg) translateZ(${zOffset}px) scale(${scale})`,
      transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    };
  };

  return (
    <div 
      className="relative w-full aspect-[4/3] md:aspect-[16/10] mx-auto flex items-center justify-center overflow-visible select-none"
      style={{
        perspective: '1200px',
        perspectiveOrigin: '50% 30%',
      }}
    >
      {/* 3D Rotated Ground Plane (Rotated 3D Surface) */}
      <div
        className="relative w-[92%] h-[92%] transition-transform duration-1000 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(58deg) rotateZ(-45deg)',
          background: 'radial-gradient(circle at center, #111e3b 0%, #080d1a 80%, #03050a 100%)',
          boxShadow: '0 50px 100px rgba(0,0,0,0.85), inset 0 0 50px rgba(212,175,55,0.1)',
          borderRadius: '40px',
          border: '2.5px solid rgba(212, 175, 55, 0.2)',
        }}
      >
        {/* Ground grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] rounded-[38px]"></div>

        {/* 1. Surrounding 3D Fortress Wall (Flat base, components raise up) */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(0px)',
          }}
        >
          <FortressWall level={finalWallLevel} />
        </div>

        {/* 2. Flat Cobblestone Pathways & Central Plaza on the floor */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: 'translateZ(0.5px)',
          }}
        >
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(212,175,55,0.01)" />
                <stop offset="50%" stopColor="rgba(212,175,55,0.08)" />
                <stop offset="100%" stopColor="rgba(212,175,55,0.01)" />
              </linearGradient>
            </defs>
            {/* Center Plaza */}
            <circle cx="45" cy="45" r="9" fill="url(#roadGradient)" stroke="rgba(212,175,55,0.12)" strokeWidth="0.5" />
            <circle cx="45" cy="45" r="7" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" strokeDasharray="1,1" />

            {/* Connecting Roads to Structures */}
            <line x1="45" y1="45" x2="25" y2="65" stroke="rgba(212,175,55,0.08)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="45" y1="45" x2="65" y2="65" stroke="rgba(212,175,55,0.08)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="45" y1="45" x2="68" y2="35" stroke="rgba(212,175,55,0.08)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="45" y1="45" x2="45" y2="75" stroke="rgba(212,175,55,0.08)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* ================= 3D BILLBOARD BUILDINGS ================= */}

        {/* 3. CENTER PALACE (Palace - Main Castle) */}
        <div
          className="absolute group cursor-pointer"
          style={{
            left: '45%',
            top: '45%',
            width: '28%',
            height: '28%',
            ...get3DStyle(levels.center),
            zIndex: 15
          }}
        >
          <CenterSVG level={levels.center} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">القصر العائلي</span>
            <span className="text-xs font-black text-[#FFD700] whitespace-nowrap">المركز الرئيسي - مستوى {levels.center}</span>
          </div>
        </div>

        {/* 4. WINDMILL (Tasks - Propeller Turbine) */}
        <div
          className="absolute group cursor-pointer"
          style={{
            left: '68%',
            top: '35%',
            width: '20%',
            height: '20%',
            ...get3DStyle(levels.windmill),
            zIndex: 18
          }}
        >
          <Windmill level={levels.windmill} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">طاحونة المهام</span>
            <span className="text-xs font-black text-blue-400 whitespace-nowrap">إنجاز المسؤوليات - مستوى {levels.windmill}</span>
          </div>
        </div>

        {/* 5. BANK (Savings - Gold Vault) */}
        <div
          className="absolute group cursor-pointer"
          style={{
            left: '25%',
            top: '65%',
            width: '22%',
            height: '22%',
            ...get3DStyle(levels.bank),
            zIndex: 25
          }}
        >
          <BankSVG level={levels.bank} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">خزنة الادخار</span>
            <span className="text-xs font-black text-orange-400 whitespace-nowrap">البنك العائلي - مستوى {levels.bank}</span>
          </div>
        </div>

        {/* 6. MARKET (Investments - Trading Bazaar) */}
        <div
          className="absolute group cursor-pointer"
          style={{
            left: '65%',
            top: '65%',
            width: '22%',
            height: '22%',
            ...get3DStyle(levels.market),
            zIndex: 25
          }}
        >
          <MarketSVG level={levels.market} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">سوق الاستثمار المشترك</span>
            <span className="text-xs font-black text-amber-400 whitespace-nowrap">مشاريع الاستثمار - مستوى {levels.market}</span>
          </div>
        </div>

        {/* 7. FARM (Charity - Ecotech Oasis Canopy) */}
        <div
          className="absolute group cursor-pointer"
          style={{
            left: '45%',
            top: '75%',
            width: '24%',
            height: '24%',
            ...get3DStyle(levels.farm),
            zIndex: 35
          }}
        >
          <FarmSVG level={levels.farm} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">مزرعة العطاء</span>
            <span className="text-xs font-black text-emerald-400 whitespace-nowrap">واحة التبرعات - مستوى {levels.farm}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
