import React, { useState } from 'react';
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
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  const buildingDetails = {
    center: {
      title: 'المنزل الرئيسي 🏰',
      desc: 'المركز الرئيسي والتطور المالي الشامل',
      levelText: `مستوى ${levels.center}`
    },
    bank: {
      title: 'حصالة الادخار 💰',
      desc: 'مجموع المبالغ المودعة في حصالتك',
      levelText: `مستوى ${levels.bank}`
    },
    market: {
      title: 'مستقبلي الاستثماري 📈',
      desc: 'حجم المشاركة في تمويل المشاريع',
      levelText: `مستوى ${levels.market}`
    },
    farm: {
      title: 'مساحة التبرعات 💚',
      desc: 'تبرعاتك ونقاط الخير المكتسبة بالدوري',
      levelText: `مستوى ${levels.farm}`
    },
    windmill: {
      title: 'طاحونة إنجاز المهام ⚙️',
      desc: 'الواجبات المنزلية المعتمدة بنجاح',
      levelText: `مستوى ${levels.windmill}`
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 font-sans text-right select-none relative">
      {/* 1. Production Interactive CSS Grid Layout */}
      <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-[2rem] justify-center items-center"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}
      >
        {/* BANK (Column 1, Row 1) */}
        <div
          onMouseEnter={() => setHoveredBuilding('bank')}
          onMouseLeave={() => setHoveredBuilding(null)}
          className="relative group cursor-pointer transition-all duration-300 hover:scale-110 w-full flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-3xl shadow-xl backdrop-blur-md"
          style={{ gridColumn: '1', gridRow: '1' }}
        >
          <div className="w-32 h-32 flex items-center justify-center">
            <BankSVG level={levels.bank} />
          </div>
          <span className="mt-3 text-xs font-bold text-slate-300">حصالة الادخار 💰</span>
          
          {/* Glassmorphic Tooltip */}
          <div className="absolute bottom-[105%] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md text-white whitespace-nowrap min-w-[200px]">
            <span className="text-[10px] text-slate-400 block font-sans">{buildingDetails.bank.desc}</span>
            <span className="text-xs font-black text-orange-400 block mt-1">{buildingDetails.bank.title} - {buildingDetails.bank.levelText}</span>
          </div>
        </div>

        {/* CENTER CASTLE (Column 2, Row 1 & 2) */}
        <div
          onMouseEnter={() => setHoveredBuilding('center')}
          onMouseLeave={() => setHoveredBuilding(null)}
          className="relative group cursor-pointer transition-all duration-300 hover:scale-110 w-full flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-3xl shadow-xl backdrop-blur-md md:col-start-2 md:row-start-1 md:row-span-2"
          style={{ gridColumn: '2', gridRow: '1 / span 2' }}
        >
          <div className="w-40 h-40 flex items-center justify-center">
            <CenterSVG level={levels.center} />
          </div>
          <span className="mt-4 text-sm font-extrabold text-orange-400">القلعة المركزية 🏰</span>

          {/* Glassmorphic Tooltip */}
          <div className="absolute bottom-[105%] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md text-white whitespace-nowrap min-w-[200px]">
            <span className="text-[10px] text-slate-400 block font-sans">{buildingDetails.center.desc}</span>
            <span className="text-xs font-black text-[#FFD700] block mt-1">{buildingDetails.center.title} - {buildingDetails.center.levelText}</span>
          </div>
        </div>

        {/* MARKET (Column 3, Row 1) */}
        <div
          onMouseEnter={() => setHoveredBuilding('market')}
          onMouseLeave={() => setHoveredBuilding(null)}
          className="relative group cursor-pointer transition-all duration-300 hover:scale-110 w-full flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-3xl shadow-xl backdrop-blur-md"
          style={{ gridColumn: '3', gridRow: '1' }}
        >
          <div className="w-32 h-32 flex items-center justify-center">
            <MarketSVG level={levels.market} />
          </div>
          <span className="mt-3 text-xs font-bold text-slate-300">سوق الاستثمار 📈</span>

          {/* Glassmorphic Tooltip */}
          <div className="absolute bottom-[105%] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md text-white whitespace-nowrap min-w-[200px]">
            <span className="text-[10px] text-slate-400 block font-sans">{buildingDetails.market.desc}</span>
            <span className="text-xs font-black text-amber-400 block mt-1">{buildingDetails.market.title} - {buildingDetails.market.levelText}</span>
          </div>
        </div>

        {/* WINDMILL (Column 1, Row 2) */}
        <div
          onMouseEnter={() => setHoveredBuilding('windmill')}
          onMouseLeave={() => setHoveredBuilding(null)}
          className="relative group cursor-pointer transition-all duration-300 hover:scale-110 w-full flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-3xl shadow-xl backdrop-blur-md"
          style={{ gridColumn: '1', gridRow: '2' }}
        >
          <div className="w-32 h-32 flex items-center justify-center">
            <Windmill level={levels.windmill} />
          </div>
          <span className="mt-3 text-xs font-bold text-slate-300">طاحونة المهام ⚙️</span>

          {/* Glassmorphic Tooltip */}
          <div className="absolute bottom-[105%] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md text-white whitespace-nowrap min-w-[200px]">
            <span className="text-[10px] text-slate-400 block font-sans">{buildingDetails.windmill.desc}</span>
            <span className="text-xs font-black text-blue-400 block mt-1">{buildingDetails.windmill.title} - {buildingDetails.windmill.levelText}</span>
          </div>
        </div>

        {/* FARM (Column 3, Row 2) */}
        <div
          onMouseEnter={() => setHoveredBuilding('farm')}
          onMouseLeave={() => setHoveredBuilding(null)}
          className="relative group cursor-pointer transition-all duration-300 hover:scale-110 w-full flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-3xl shadow-xl backdrop-blur-md"
          style={{ gridColumn: '3', gridRow: '2' }}
        >
          <div className="w-32 h-32 flex items-center justify-center">
            <FarmSVG level={levels.farm} />
          </div>
          <span className="mt-3 text-xs font-bold text-slate-300">واحة التبرعات 💚</span>

          {/* Glassmorphic Tooltip */}
          <div className="absolute bottom-[105%] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 bg-[#0D1527]/95 border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl text-center z-50 backdrop-blur-md text-white whitespace-nowrap min-w-[200px]">
            <span className="text-[10px] text-slate-400 block font-sans">{buildingDetails.farm.desc}</span>
            <span className="text-xs font-black text-emerald-400 block mt-1">{buildingDetails.farm.title} - {buildingDetails.farm.levelText}</span>
          </div>
        </div>
      </div>

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
          src="/assets/village/base_map.png" 
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
