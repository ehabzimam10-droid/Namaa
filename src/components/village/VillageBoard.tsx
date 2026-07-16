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

  return (
    <div className="relative w-full max-w-2xl aspect-square mx-auto flex items-center justify-center p-2 overflow-visible">
      {/* 2.5D Isometric Board Container (No CSS rotation needed as assets are pre-rendered in isometric perspective) */}
      <div 
        className="w-full h-full relative rounded-3xl overflow-visible shadow-2xl border border-white/10"
        style={{
          backgroundImage: "url('/assets/village/base_map.png.png')",
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 2px 10px rgba(255,255,255,0.05)',
        }}
      >
        {/* 1. Surrounding Fortress Wall (Layed out flat covering the board, zIndex: 10) */}
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          <FortressWall level={finalWallLevel} />
        </div>

        {/* 2. BANK - Savings (Left-center, zIndex: 20) */}
        <div
          className="absolute w-[18%] h-[18%] top-[45%] left-[15%] z-20 group cursor-pointer"
        >
          <BankSVG level={levels.bank} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">خزنة الادخار</span>
            <span className="text-xs font-black text-orange-400 whitespace-nowrap">البنك العائلي - مستوى {levels.bank}</span>
          </div>
        </div>

        {/* 3. CENTER PALACE - Manor House (Center-top, zIndex: 15) */}
        <div
          className="absolute w-[22%] h-[22%] top-[20%] left-[39%] z-15 group cursor-pointer"
        >
          <CenterSVG level={levels.center} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">القصر العائلي</span>
            <span className="text-xs font-black text-[#FFD700] whitespace-nowrap">المركز الرئيسي - مستوى {levels.center}</span>
          </div>
        </div>

        {/* 4. FARM - Oasis (Center-bottom, zIndex: 25) */}
        <div
          className="absolute w-[24%] h-[24%] top-[56%] left-[38%] z-25 group cursor-pointer"
        >
          <FarmSVG level={levels.farm} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">مزرعة العطاء</span>
            <span className="text-xs font-black text-emerald-400 whitespace-nowrap">واحة التبرعات - مستوى {levels.farm}</span>
          </div>
        </div>

        {/* 5. MARKET - Investment Bazaar (Right-center, zIndex: 22) */}
        <div
          className="absolute w-[20%] h-[20%] top-[45%] right-[15%] z-22 group cursor-pointer"
        >
          <MarketSVG level={levels.market} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">سوق الاستثمار المشترك</span>
            <span className="text-xs font-black text-amber-400 whitespace-nowrap">مشاريع الاستثمار - مستوى {levels.market}</span>
          </div>
        </div>

        {/* 6. WINDMILL - Tasks (Top-right background, zIndex: 12) */}
        <div
          className="absolute w-[16%] h-[16%] top-[25%] right-[25%] z-12 group cursor-pointer"
        >
          <Windmill level={levels.windmill} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">طاحونة المهام</span>
            <span className="text-xs font-black text-blue-400 whitespace-nowrap">إنجاز المسؤوليات - مستوى {levels.windmill}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
