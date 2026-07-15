import React from 'react';
import BankSVG from './BankSVG';
import FarmSVG from './FarmSVG';
import MarketSVG from './MarketSVG';
import CenterSVG from './CenterSVG';
import FortressWall from './FortressWall';

interface VillageBoardProps {
  levels: {
    bank: number;
    farm: number;
    market: number;
    center: number;
  };
  wallLevel?: number; // surrounding fortress wall level (defaults to center level)
}

export default function VillageBoard({ levels, wallLevel }: VillageBoardProps) {
  const finalWallLevel = wallLevel !== undefined ? wallLevel : levels.center;

  return (
    <div className="relative w-full max-w-2xl aspect-square mx-auto flex items-center justify-center p-8 overflow-visible">
      {/* 3D Perspective Wrapper */}
      <div 
        className="w-full h-full relative flex items-center justify-center" 
        style={{ perspective: '1500px' }}
      >
        {/* The Rotated Ground Board (scaled up to 1.8x to fill the screen area) */}
        <div
          className="absolute w-[330px] h-[330px] bg-gradient-to-br from-[#1A263F] to-[#0A101C] border-2 border-white/10 rounded-[45px] transition-transform duration-500 shadow-2xl flex items-center justify-center"
          style={{
            transform: 'rotateX(60deg) rotateZ(-45deg) scale(1.8)',
            transformStyle: 'preserve-3d',
            boxShadow: '0 45px 90px rgba(0,0,0,0.9), inset 0 2px 15px rgba(255,255,255,0.08)',
          }}
        >
          {/* Solid ground paths and stone textures to connect buildings (no dotted lines or glows) */}
          <svg className="absolute inset-0 w-full h-full rounded-[45px] pointer-events-none z-0">
            {/* Outline roads - Solid stone path */}
            <path
              d="M 73.5 73.5 L 248.5 73.5 L 248.5 256.5 L 73.5 256.5 Z"
              fill="none"
              stroke="#403328"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
            />
            {/* Center infill road - Solid cobblestone accent */}
            <path
              d="M 73.5 73.5 L 248.5 73.5 L 248.5 256.5 L 73.5 256.5 Z"
              fill="none"
              stroke="#8C7355"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />

            {/* Solid crossways pathways meeting at center plaza */}
            <line x1="73.5" y1="73.5" x2="248.5" y2="256.5" stroke="#403328" strokeWidth="12" opacity="0.8" />
            <line x1="73.5" y1="73.5" x2="248.5" y2="256.5" stroke="#8C7355" strokeWidth="5" opacity="0.9" />

            <line x1="248.5" y1="73.5" x2="73.5" y2="256.5" stroke="#403328" strokeWidth="12" opacity="0.8" />
            <line x1="248.5" y1="73.5" x2="73.5" y2="256.5" stroke="#8C7355" strokeWidth="5" opacity="0.9" />

            {/* Center Plaza - solid stone platform */}
            <circle cx="165" cy="165" r="38" fill="#1C273C" stroke="#403328" strokeWidth="8" opacity="0.9" />
            <circle cx="165" cy="165" r="30" fill="none" stroke="#8C7355" strokeWidth="4" opacity="0.9" />
          </svg>

          {/* Isometric Grid lines overlay on the floor */}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-5 pointer-events-none z-0">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border border-white/10"></div>
            ))}
          </div>

          {/* Surrounding Fortress Wall */}
          <FortressWall level={finalWallLevel} />

          {/* 1. BANK (Top-Left in local coordinates -> Left corner on screen) */}
          <div
            className="absolute top-4 left-4 w-[115px] h-[115px] group cursor-pointer z-10"
            style={{
              transform: 'rotateZ(45deg) rotateX(-60deg) translateZ(12px)',
              transformStyle: 'preserve-3d',
            }}
          >
            <BankSVG level={levels.bank} />
            
            {/* Glassmorphic Tooltip */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
              <span className="text-[9px] text-slate-400 block font-sans">خزنة الادخار</span>
              <span className="text-xs font-black text-orange-400 whitespace-nowrap">البنك العائلي - مستوى {levels.bank}</span>
            </div>
          </div>

          {/* 2. CENTER PALACE (Top-Right in local coordinates -> Top corner on screen) */}
          <div
            className="absolute top-4 right-4 w-[130px] h-[130px] group cursor-pointer z-10"
            style={{
              transform: 'rotateZ(45deg) rotateX(-60deg) translateZ(18px)',
              transformStyle: 'preserve-3d',
            }}
          >
            <CenterSVG level={levels.center} />
            
            {/* Glassmorphic Tooltip */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
              <span className="text-[9px] text-slate-400 block font-sans">قصر البلدية العام</span>
              <span className="text-xs font-black text-[#FFD700] whitespace-nowrap">المركز الرئيسي - مستوى {levels.center}</span>
            </div>
          </div>

          {/* 3. FARM (Bottom-Left in local coordinates -> Bottom corner on screen) */}
          <div
            className="absolute bottom-4 left-4 w-[115px] h-[115px] group cursor-pointer z-10"
            style={{
              transform: 'rotateZ(45deg) rotateX(-60deg) translateZ(12px)',
              transformStyle: 'preserve-3d',
            }}
          >
            <FarmSVG level={levels.farm} />
            
            {/* Glassmorphic Tooltip */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
              <span className="text-[9px] text-slate-400 block font-sans">مزرعة العطاء</span>
              <span className="text-xs font-black text-emerald-400 whitespace-nowrap">واحة التبرعات - مستوى {levels.farm}</span>
            </div>
          </div>

          {/* 4. MARKET (Bottom-Right in local coordinates -> Right corner on screen) */}
          <div
            className="absolute bottom-4 right-4 w-[115px] h-[115px] group cursor-pointer z-10"
            style={{
              transform: 'rotateZ(45deg) rotateX(-60deg) translateZ(12px)',
              transformStyle: 'preserve-3d',
            }}
          >
            <MarketSVG level={levels.market} />
            
            {/* Glassmorphic Tooltip */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
              <span className="text-[9px] text-slate-400 block font-sans">سوق الاستثمار المشترك</span>
              <span className="text-xs font-black text-amber-400 whitespace-nowrap">مشاريع الاستثمار - مستوى {levels.market}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
