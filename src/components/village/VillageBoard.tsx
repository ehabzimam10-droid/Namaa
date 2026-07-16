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

// Master Layout Config for pixel-perfect positioning of 2.5D PNG assets
const BUILDING_POSITIONS = {
  wall: { top: '0%', left: '0%', width: '100%', height: '100%', zIndex: 10 },
  center: { top: '16%', left: '37%', width: '26%', zIndex: 15 },
  windmill: { top: '20%', left: '62%', width: '18%', zIndex: 18 },
  bank: { top: '42%', left: '12%', width: '20%', zIndex: 25 },
  market: { top: '42%', left: '68%', width: '20%', zIndex: 25 },
  farm: { top: '56%', left: '35%', width: '30%', zIndex: 35 }
};

export default function VillageBoard({ levels, wallLevel }: VillageBoardProps) {
  const finalWallLevel = wallLevel !== undefined ? wallLevel : levels.center;

  return (
    <div className="relative w-full max-w-2xl aspect-square mx-auto flex items-center justify-center p-2 overflow-visible">
      {/* 2.5D Isometric Board Container */}
      <div 
        className="w-full h-full relative rounded-3xl overflow-visible shadow-2xl border border-white/10"
        style={{
          backgroundImage: "url('/assets/village/base_map.png.png')",
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 2px 10px rgba(255,255,255,0.05)',
        }}
      >
        {/* 1. Surrounding Fortress Wall (Base Layer) */}
        <div 
          className="absolute pointer-events-none"
          style={{
            top: BUILDING_POSITIONS.wall.top,
            left: BUILDING_POSITIONS.wall.left,
            width: BUILDING_POSITIONS.wall.width,
            height: BUILDING_POSITIONS.wall.height,
            zIndex: BUILDING_POSITIONS.wall.zIndex
          }}
        >
          <FortressWall level={finalWallLevel} />
        </div>

        {/* 2. CENTER PALACE - Manor House (Largest/Highest in the center-top) */}
        <div
          className="absolute group cursor-pointer"
          style={{
            top: BUILDING_POSITIONS.center.top,
            left: BUILDING_POSITIONS.center.left,
            width: BUILDING_POSITIONS.center.width,
            zIndex: BUILDING_POSITIONS.center.zIndex
          }}
        >
          <CenterSVG level={levels.center} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-350 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">القصر العائلي</span>
            <span className="text-xs font-black text-[#FFD700] whitespace-nowrap">المركز الرئيسي - مستوى {levels.center}</span>
          </div>
        </div>

        {/* 3. WINDMILL - Tasks (Top-right background pad) */}
        <div
          className="absolute group cursor-pointer"
          style={{
            top: BUILDING_POSITIONS.windmill.top,
            left: BUILDING_POSITIONS.windmill.left,
            width: BUILDING_POSITIONS.windmill.width,
            zIndex: BUILDING_POSITIONS.windmill.zIndex
          }}
        >
          <Windmill level={levels.windmill} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-350 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">طاحونة المهام</span>
            <span className="text-xs font-black text-blue-400 whitespace-nowrap">إنجاز المسؤوليات - مستوى {levels.windmill}</span>
          </div>
        </div>

        {/* 4. BANK - Savings (Bottom-left pad) */}
        <div
          className="absolute group cursor-pointer"
          style={{
            top: BUILDING_POSITIONS.bank.top,
            left: BUILDING_POSITIONS.bank.left,
            width: BUILDING_POSITIONS.bank.width,
            zIndex: BUILDING_POSITIONS.bank.zIndex
          }}
        >
          <BankSVG level={levels.bank} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-350 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">خزنة الادخار</span>
            <span className="text-xs font-black text-orange-400 whitespace-nowrap">البنك العائلي - مستوى {levels.bank}</span>
          </div>
        </div>

        {/* 5. MARKET - Investment Bazaar (Bottom-right pad) */}
        <div
          className="absolute group cursor-pointer"
          style={{
            top: BUILDING_POSITIONS.market.top,
            left: BUILDING_POSITIONS.market.left,
            width: BUILDING_POSITIONS.market.width,
            zIndex: BUILDING_POSITIONS.market.zIndex
          }}
        >
          <MarketSVG level={levels.market} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-350 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">سوق الاستثمار المشترك</span>
            <span className="text-xs font-black text-amber-400 whitespace-nowrap">مشاريع الاستثمار - مستوى {levels.market}</span>
          </div>
        </div>

        {/* 6. FARM - Oasis (Front-center/bottom pad, highest z-index) */}
        <div
          className="absolute group cursor-pointer"
          style={{
            top: BUILDING_POSITIONS.farm.top,
            left: BUILDING_POSITIONS.farm.left,
            width: BUILDING_POSITIONS.farm.width,
            zIndex: BUILDING_POSITIONS.farm.zIndex
          }}
        >
          <FarmSVG level={levels.farm} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-350 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">مزرعة العطاء</span>
            <span className="text-xs font-black text-emerald-400 whitespace-nowrap">واحة التبرعات - مستوى {levels.farm}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
