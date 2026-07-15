import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import CenterSVG from '../components/village/CenterSVG';
import VillageBoard from '../components/village/VillageBoard';
import type { Kid } from '../data/mockData';

export default function FatherVillagePage() {
  const { profile, kids } = useApp();
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);

  // Fallback if not set in localStorage profile
  const familyCastleLevel = profile?.family_castle_level || 3;

  return (
    <div className="w-full space-y-8 text-right font-sans">
      {/* Header Panel */}
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 flex flex-col md:flex-row-reverse md:items-center justify-between gap-4">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl"></div>
        <div>
          <h2 className="text-xs font-semibold text-orange-400">استكشاف نمو الأبناء ومملكة نماء العائلية المشتركة</h2>
          <h3 className="text-2xl font-black text-white mt-1">مملكة نماء العائلية 🏰</h3>
        </div>
      </div>

      {/* Main Kingdom Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        
        {/* Left Side: Kid 1 (Khalid) */}
        <div className="flex flex-col items-center">
          {(() => {
            const khalid = kids.find(k => k.name === 'خالد') || kids[0];
            if (!khalid) return null;
            return (
              <button
                type="button"
                onClick={() => setSelectedKid(khalid)}
                className="w-full bg-[#111C2E]/60 hover:bg-[#111C2E]/80 backdrop-blur-xl border border-white/10 hover:border-orange-500/30 rounded-3xl p-6 shadow-2xl text-center space-y-4 transition-all duration-300 transform hover:scale-[1.03] group focus:outline-none"
              >
                <div className="w-24 h-24 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/50 transition-all">
                  <span className="text-4xl">👦</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base">قرية الابن خالد 🏰</h4>
                  <p className="text-[11px] text-slate-400 mt-1">اضغط لاستكشاف لوحة القرية ثلاثية الأبعاد والتفاصيل</p>
                </div>
                <div className="flex justify-center gap-1.5 text-[10px] text-slate-350">
                  <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded-md font-sans">البنك: {khalid.bank_level || 3}</span>
                  <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded-md font-sans">الواحة: {khalid.farm_level || 3}</span>
                  <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded-md font-sans">السوق: {khalid.market_level || 3}</span>
                </div>
              </button>
            );
          })()}
        </div>

        {/* Center: Overall Family Castle */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#1C2C4E]/40 to-[#0A111E]/60 border border-white/10 shadow-2xl rounded-3xl p-6 text-center space-y-6 flex flex-col items-center">
          {/* Subtle light glow behind the main castle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-orange-500/5 blur-3xl pointer-events-none"></div>

          <div>
            <span className="text-xs font-bold text-orange-400 block mb-1">القلعة المشتركة الكبرى</span>
            <h3 className="text-lg font-black text-white">قلعة العائلة الملكية 👑</h3>
          </div>

          {/* Large Center SVG palace */}
          <div className="w-56 h-56 mx-auto">
            <CenterSVG level={familyCastleLevel} />
          </div>

          <div className="bg-black/20 border border-white/5 p-3 rounded-2xl max-w-xs mx-auto text-xs leading-relaxed text-slate-300 font-sans">
            مستوى قلعة العائلة العام هو <span className="font-bold text-[#FFD700]">{familyCastleLevel}</span> من أصل 5.
            ينمو المستوى تلقائياً كلما زادت نسبة الإنجاز والتعاون العائلي المشترك! 🌟
          </div>
        </div>

        {/* Right Side: Kid 2 (Salem) */}
        <div className="flex flex-col items-center">
          {(() => {
            const salem = kids.find(k => k.name === 'سالم') || kids[1];
            if (!salem) return null;
            return (
              <button
                type="button"
                onClick={() => setSelectedKid(salem)}
                className="w-full bg-[#111C2E]/60 hover:bg-[#111C2E]/80 backdrop-blur-xl border border-white/10 hover:border-orange-500/30 rounded-3xl p-6 shadow-2xl text-center space-y-4 transition-all duration-300 transform hover:scale-[1.03] group focus:outline-none"
              >
                <div className="w-24 h-24 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 group-hover:border-emerald-500/50 transition-all">
                  <span className="text-4xl">👦</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base">قرية الابن سالم 🏰</h4>
                  <p className="text-[11px] text-slate-400 mt-1">اضغط لاستكشاف لوحة القرية ثلاثية الأبعاد والتفاصيل</p>
                </div>
                <div className="flex justify-center gap-1.5 text-[10px] text-slate-350">
                  <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded-md font-sans">البنك: {salem.bank_level || 3}</span>
                  <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded-md font-sans">الواحة: {salem.farm_level || 3}</span>
                  <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded-md font-sans">السوق: {salem.market_level || 3}</span>
                </div>
              </button>
            );
          })()}
        </div>

      </div>

      {/* Glassmorphic Modal for viewing selected kid's detailed 2.5D board */}
      {selectedKid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl bg-[#0D1527]/90 border border-white/10 shadow-2xl rounded-3xl p-6 text-right font-sans overflow-hidden">
            <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"></div>

            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
              <button
                type="button"
                onClick={() => setSelectedKid(null)}
                className="text-slate-450 hover:text-white text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-all font-sans"
              >
                ✕ إغلاق
              </button>
              <div>
                <h4 className="font-extrabold text-sm text-white">تفاصيل قرية الابن: {selectedKid.name} 👦🏰</h4>
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">منظور ثلاثي الأبعاد تفاعلي لمباني قريته الحقيقية</p>
              </div>
            </div>

            {/* Content: Reusing VillageBoard */}
            <div className="flex items-center justify-center py-6 min-h-[350px]">
              <VillageBoard
                levels={{
                  bank: selectedKid.bank_level || 3,
                  farm: selectedKid.farm_level || 3,
                  market: selectedKid.market_level || 3,
                  center: selectedKid.center_level || 3,
                }}
              />
            </div>

            {/* Bottom info row */}
            <div className="flex justify-between items-center text-[10px] text-slate-400 bg-white/5 p-3 rounded-2xl border border-white/5 font-sans">
              <span className="font-bold text-[#FFD700]">تقييم ذكي فوري</span>
              <span>مباني قريته متأثرة بمدخراته والتزاماته وقراراته الحقيقية بالدوري</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
