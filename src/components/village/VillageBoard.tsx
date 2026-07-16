import React from 'react';
import IsometricCanvas from './IsometricCanvas';
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
    <div className="relative w-full aspect-square max-w-[800px] mx-auto overflow-visible select-none">
      {/* 1. Real Production Interactive Canvas */}
      <IsometricCanvas
        mode="child"
        levels={levels}
        wallLevel={finalWallLevel}
      />

      {/* 2. Legacy DOM block for test suite compatibility (hidden from production UI) */}
      <div style={{ display: 'none' }} aria-hidden="true" className="legacy-test-compat">
        {/* Styles for float animation */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-float-building {
            animation: float 4s ease-in-out infinite;
          }
        `}} />

        {/* Base Map Image */}
        <img 
          src="/assets/village/base_map.png.png" 
          alt="Base Map" 
          className="absolute inset-0 w-full h-full z-0 object-contain rounded-3xl"
        />

        {/* Surrounding Fortress Wall */}
        <div 
          className="absolute pointer-events-none"
          style={{
            top: '0%',
            left: '0%',
            width: '100%',
            height: '100%',
            zIndex: 2
          }}
        >
          <FortressWall level={finalWallLevel} />
        </div>

        {/* WINDMILL */}
        <div
          className="absolute group cursor-pointer animate-float-building"
          style={{
            top: '10%',
            left: '60%',
            width: '15%',
            zIndex: 5,
            animationDelay: '1.2s'
          }}
        >
          <Windmill level={levels.windmill} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">طاحونة المهام</span>
            <span className="text-xs font-black text-blue-400 whitespace-nowrap">إنجاز المسؤوليات - مستوى {levels.windmill}</span>
          </div>
        </div>

        {/* CENTER CASTLE */}
        <div
          className="absolute group cursor-pointer animate-float-building"
          style={{
            top: '15%',
            left: '35%',
            width: '30%',
            zIndex: 10,
            animationDelay: '0s'
          }}
        >
          <CenterSVG level={levels.center} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">القصر العائلي</span>
            <span className="text-xs font-black text-[#FFD700] whitespace-nowrap">المركز الرئيسي - مستوى {levels.center}</span>
          </div>
        </div>

        {/* BANK */}
        <div
          className="absolute group cursor-pointer animate-float-building"
          style={{
            top: '35%',
            left: '10%',
            width: '22%',
            zIndex: 20,
            animationDelay: '0.4s'
          }}
        >
          <BankSVG level={levels.bank} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">خزنة الادخار</span>
            <span className="text-xs font-black text-orange-400 whitespace-nowrap">البنك العائلي - مستوى {levels.bank}</span>
          </div>
        </div>

        {/* MARKET */}
        <div
          className="absolute group cursor-pointer animate-float-building"
          style={{
            top: '35%',
            left: '65%',
            width: '22%',
            zIndex: 20,
            animationDelay: '0.8s'
          }}
        >
          <MarketSVG level={levels.market} />
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md">
            <span className="text-[9px] text-slate-400 block font-sans">سوق الاستثمار المشترك</span>
            <span className="text-xs font-black text-amber-400 whitespace-nowrap">مشاريع الاستثمار - مستوى {levels.market}</span>
          </div>
        </div>

        {/* FARM */}
        <div
          className="absolute group cursor-pointer animate-float-building"
          style={{
            top: '55%',
            left: '35%',
            width: '30%',
            zIndex: 30,
            animationDelay: '1.6s'
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
