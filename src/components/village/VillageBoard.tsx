import React from 'react';
import BankSVG from './BankSVG';
import FarmSVG from './FarmSVG';
import MarketSVG from './MarketSVG';
import CenterSVG from './CenterSVG';

interface VillageBoardProps {
  levels: {
    bank: number;
    farm: number;
    market: number;
    center: number;
  };
}

export default function VillageBoard({ levels }: VillageBoardProps) {
  return (
    <div className="relative w-full max-w-lg aspect-square mx-auto flex items-center justify-center p-4">
      {/* 3D Perspective Wrapper */}
      <div 
        className="w-full h-full relative" 
        style={{ perspective: '1200px' }}
      >
        {/* The Rotated Ground Board */}
        <div
          className="absolute inset-0 m-auto w-[330px] h-[330px] bg-gradient-to-br from-[#1C2C4E]/60 to-[#0A111E]/80 border-2 border-white/10 rounded-[40px] shadow-2xl flex items-center justify-center"
          style={{
            transform: 'rotateX(60deg) rotateZ(-45deg) scale(1.05)',
            transformStyle: 'preserve-3d',
            boxShadow: '0 30px 70px rgba(0,0,0,0.8), inset 0 2px 10px rgba(255,255,255,0.05)',
          }}
        >
          {/* Isometric Grid lines overlay on the floor */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-15 pointer-events-none">
            <div className="border border-white/30"></div>
            <div className="border border-white/30"></div>
            <div className="border border-white/30"></div>
            <div className="border border-white/30"></div>
            <div className="border border-white/30"></div>
            <div className="border border-white/30"></div>
            <div className="border border-white/30"></div>
            <div className="border border-white/30"></div>
            <div className="border border-white/30"></div>
          </div>

          {/* Decorative central circle on floor */}
          <div className="absolute w-24 h-24 rounded-full border border-[#FF8A00]/25 bg-orange-500/5 animate-pulse pointer-events-none"></div>

          {/* 1. BANK (Top-Left in local coordinates -> Left corner on screen) */}
          <div
            className="absolute top-4 left-4 w-[115px] h-[115px] group cursor-pointer"
            style={{
              transform: 'rotateZ(45deg) rotateX(-60deg) translateZ(10px)',
              transformStyle: 'preserve-3d',
            }}
          >
            <BankSVG level={levels.bank} />
            
            {/* Glassmorphic Tooltip */}
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
              <span className="text-[10px] text-slate-450 block font-sans">خزنة الادخار</span>
              <span className="text-xs font-black text-orange-400 whitespace-nowrap">البنك العائلي - مستوى {levels.bank}</span>
            </div>
          </div>

          {/* 2. CENTER PALACE (Top-Right in local coordinates -> Top corner on screen) */}
          <div
            className="absolute top-4 right-4 w-[130px] h-[130px] group cursor-pointer"
            style={{
              transform: 'rotateZ(45deg) rotateX(-60deg) translateZ(15px)',
              transformStyle: 'preserve-3d',
            }}
          >
            <CenterSVG level={levels.center} />
            
            {/* Glassmorphic Tooltip */}
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
              <span className="text-[10px] text-slate-455 block font-sans">قصر البلدية العام</span>
              <span className="text-xs font-black text-[#FFD700] whitespace-nowrap">المركز الرئيسي - مستوى {levels.center}</span>
            </div>
          </div>

          {/* 3. FARM (Bottom-Left in local coordinates -> Bottom corner on screen) */}
          <div
            className="absolute bottom-4 left-4 w-[115px] h-[115px] group cursor-pointer"
            style={{
              transform: 'rotateZ(45deg) rotateX(-60deg) translateZ(10px)',
              transformStyle: 'preserve-3d',
            }}
          >
            <FarmSVG level={levels.farm} />
            
            {/* Glassmorphic Tooltip */}
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
              <span className="text-[10px] text-slate-450 block font-sans">مزرعة العطاء</span>
              <span className="text-xs font-black text-emerald-400 whitespace-nowrap">واحة التبرعات - مستوى {levels.farm}</span>
            </div>
          </div>

          {/* 4. MARKET (Bottom-Right in local coordinates -> Right corner on screen) */}
          <div
            className="absolute bottom-4 right-4 w-[115px] h-[115px] group cursor-pointer"
            style={{
              transform: 'rotateZ(45deg) rotateX(-60deg) translateZ(10px)',
              transformStyle: 'preserve-3d',
            }}
          >
            <MarketSVG level={levels.market} />
            
            {/* Glassmorphic Tooltip */}
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
              <span className="text-[10px] text-slate-450 block font-sans">سوق الاستثمار المشترك</span>
              <span className="text-xs font-black text-amber-400 whitespace-nowrap">مشاريع الاستثمار - مستوى {levels.market}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
