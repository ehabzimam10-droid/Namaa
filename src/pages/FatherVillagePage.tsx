import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import VillageBoard from '../components/village/VillageBoard';
import KingdomBoard from '../components/village/KingdomBoard';
import LevelSlider from '../components/ui/LevelSlider';
import type { Kid } from '../data/mockData';
import { supabase } from '../utils/supabaseClient';

export default function FatherVillagePage() {
  const { profile, kids, updateFamilyLevel } = useApp();
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [localKids, setLocalKids] = useState<Kid[]>(kids || []);

  useEffect(() => {
    if (kids && kids.length > 0) {
      setLocalKids(kids);
    }
  }, [kids]);

  useEffect(() => {
    if (!kids || kids.length === 0) {
      const fetchKids = async () => {
        try {
          const { data, error } = await supabase.from('kids_profiles').select('*');
          if (!error && data && data.length > 0) {
            const mapped: Kid[] = data.map((k: any) => ({
              id: k.id,
              name: k.name,
              age: k.age || 10,
              balance: k.balance || 0,
              saved: k.saved || 0,
              donationPoints: k.donation_points || 0,
              allowance: k.allowance || 0,
              tasks: [],
              savingsGoals: [],
              transactions: [],
              is_league_winner: !!k.is_league_winner,
              last_savings_points: k.last_savings_points || 0,
              last_league_score: k.last_league_score || 0,
              bank_level: k.bank_level || 3,
              farm_level: k.farm_level || 3,
              market_level: k.market_level || 3,
              center_level: k.center_level || 3,
            }));
            setLocalKids(mapped);
          }
        } catch (err) {
          console.error('Error fetching kids profiles directly:', err);
        }
      };
      fetchKids();
    }
  }, []);

  // Father overall family castle level
  const familyCastleLevel = profile?.family_castle_level || 3;

  // Calculate average levels for the joint family buildings based on kids' progress
  const activeKids = localKids.length > 0 ? localKids : [];

  const getKidWindmillLevel = (kid: Kid) => {
    return Math.min(5, Math.max(1, Math.round((kid.tasks?.filter(t => t.status === 'approved').length || 0) / 2) + 1));
  };

  const averageBank = activeKids.length > 0 
    ? Math.round(activeKids.reduce((sum, k) => sum + (k.bank_level || 3), 0) / activeKids.length)
    : 3;
  const averageFarm = activeKids.length > 0
    ? Math.round(activeKids.reduce((sum, k) => sum + (k.farm_level || 3), 0) / activeKids.length)
    : 3;
  const averageMarket = activeKids.length > 0
    ? Math.round(activeKids.reduce((sum, k) => sum + (k.market_level || 3), 0) / activeKids.length)
    : 3;
  const averageWindmill = activeKids.length > 0
    ? Math.round(activeKids.reduce((sum, k) => sum + getKidWindmillLevel(k), 0) / activeKids.length)
    : 3;

  return (
    <div className="w-full space-y-8 text-right font-sans relative">
      {/* Clean Header Panel */}
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 flex flex-col md:flex-row-reverse md:items-center justify-between gap-4">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl"></div>
        <div>
          <h2 className="text-xs font-semibold text-orange-400">استكشاف نمو الأبناء ومملكة نماء العائلية المشتركة</h2>
          <h3 className="text-2xl font-black text-white mt-1">مملكة نماء العائلية الكبرى 🏰</h3>
        </div>
      </div>

      {/* Row 1: The Grand Family Kingdom (Full Width spanning 90%+ container space) */}
      <div className="w-full relative overflow-hidden bg-gradient-to-b from-[#1C2C4E]/40 to-[#0A111E]/60 border border-white/10 shadow-2xl rounded-3xl p-6 text-center space-y-6 flex flex-col items-center justify-center">
        <div className="text-center space-y-1 z-10">
          <span className="text-[10px] text-orange-400 font-bold block">المملكة العائلية الموحدة</span>
          <h4 className="text-lg font-black text-white">قلعة نماء الكبرى والأسوار المحصنة 🏰🛡️</h4>
          <p className="text-[10px] text-slate-400 font-sans">تتطور مبانيها بمتوسط إنجاز الأبناء والقلعة المركزية مربوطة بالمستوى العام للعائلة</p>
        </div>

        {/* Large and centered VillageBoard */}
        <div className="w-full z-0 overflow-visible flex justify-center">
          <div className="w-full max-w-4xl">
            <KingdomBoard
              familyLevel={familyCastleLevel}
              kids={localKids}
              onOutpostClick={(childId) => {
                const kid = localKids.find(k => k.id === childId);
                if (kid) {
                  setSelectedKid(kid);
                }
              }}
            />
          </div>
        </div>

        <div className="w-full bg-black/20 border border-white/5 p-4 rounded-2xl text-center text-xs leading-relaxed text-slate-350 z-10">
          🏰 مملكة العائلة تجمع مستويات التطور والتقدم لكافة أفراد العائلة بشكل مشترك.
          الأسوار الخارجية المحصنة تزداد قوة مع ارتقاء القلعة المركزية المشتركة (مستواها الحالي: <span className="font-bold text-[#FFD700]">{familyCastleLevel}</span>).
        </div>
      </div>

      {/* Row 2: Kids Previews side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left Side: Elegant Preview Card for Khalid */}
        {(() => {
          const khalid = localKids.find(k => k.name === 'خالد') || localKids[0];
          if (!khalid) return null;
          return (
            <div
              className="w-full bg-[#111C2E]/60 border border-white/10 rounded-3xl p-6 shadow-xl text-center space-y-5 transition-all duration-300 hover:border-blue-500/30 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
                  <span className="text-2xl">👦</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base">قرية خالد 🏰</h4>
                  <p className="text-[10px] text-slate-400 mt-1">اضغط أدناه لاستكشاف قريته ثلاثية الأبعاد الحقيقية</p>
                </div>
                
                <div className="bg-black/20 rounded-2xl p-4 text-xs space-y-2 text-right border border-white/5 font-sans">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-bold text-orange-400">{khalid.bank_level || 3}</span>
                    <span>البنك (الادخار):</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="font-bold text-emerald-400">{khalid.farm_level || 3}</span>
                    <span>الواحة (التبرع):</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="font-bold text-amber-400">{khalid.market_level || 3}</span>
                    <span>السوق (الاستثمار):</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="font-bold text-blue-400">{getKidWindmillLevel(khalid)}</span>
                    <span>طاحونة المهام:</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedKid(khalid)}
                className="w-full mt-4 py-2.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 border border-blue-500/35 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
              >
                استكشاف القرية التفصيلية 🗺️
              </button>
            </div>
          );
        })()}

        {/* Right Side: Elegant Preview Card for Salem */}
        {(() => {
          const salem = localKids.find(k => k.name === 'سالم') || localKids[1];
          if (!salem) return null;
          return (
            <div
              className="w-full bg-[#111C2E]/60 border border-white/10 rounded-3xl p-6 shadow-xl text-center space-y-5 transition-all duration-300 hover:border-emerald-500/30 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                  <span className="text-2xl">👦</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base">قرية سالم 🏰</h4>
                  <p className="text-[10px] text-slate-400 mt-1">اضغط أدناه لاستكشاف قريته ثلاثية الأبعاد الحقيقية</p>
                </div>
                
                <div className="bg-black/20 rounded-2xl p-4 text-xs space-y-2 text-right border border-white/5 font-sans">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-bold text-orange-400">{salem.bank_level || 3}</span>
                    <span>البنك (الادخار):</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="font-bold text-emerald-400">{salem.farm_level || 3}</span>
                    <span>الواحة (التبرع):</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="font-bold text-amber-400">{salem.market_level || 3}</span>
                    <span>السوق (الاستثمار):</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="font-bold text-blue-400">{getKidWindmillLevel(salem)}</span>
                    <span>طاحونة المهام:</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedKid(salem)}
                className="w-full mt-4 py-2.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 border border-emerald-500/35 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
              >
                استكشاف القرية التفصيلية 🗺️
              </button>
            </div>
          );
        })()}
      </div>

      {/* Glassmorphic Modal for Kid's detailed 2.5D village view */}
      {/* Dynamic Evolution Controller Slider at the Bottom */}
      <div className="w-full bg-[#111C2E]/60 border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-right">
          <h4 className="font-extrabold text-sm text-white font-sans">التحكم في تطور المملكة العائلية (عرض تجريبي) ⚙️</h4>
          <p className="text-[10px] text-slate-400 mt-0.5">اسحب المؤشر لترقية مستوى قلعة العائلة والأسوار المحيطة بها في الوقت الفعلي</p>
        </div>
        <div className="w-full md:w-auto min-w-[280px]">
          <LevelSlider
            currentLevel={familyCastleLevel}
            onLevelChange={updateFamilyLevel}
            label="مستوى القلعة والتحصينات:"
          />
        </div>
      </div>

      {selectedKid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-[#0D1527]/90 border border-white/10 shadow-2xl rounded-3xl p-6 text-right font-sans overflow-hidden">
            <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"></div>

            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
              <button
                type="button"
                onClick={() => setSelectedKid(null)}
                className="text-slate-400 hover:text-white text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-all font-sans"
              >
                ✕ إغلاق
              </button>
              <div>
                <h4 className="font-extrabold text-sm text-white">قرية الابن الخاصة: {selectedKid.name} 👦🏰</h4>
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">منظور ثلاثي الأبعاد تفاعلي لمباني قريته الحقيقية (منزل القصر + مبانيه الشخصية الـ 3)</p>
              </div>
            </div>

            {/* Content: Reusing VillageBoard */}
            <div className="flex items-center justify-center py-6 min-h-[400px]">
              <VillageBoard
                levels={{
                  bank: selectedKid.bank_level || 3,
                  farm: selectedKid.farm_level || 3,
                  market: selectedKid.market_level || 3,
                  center: selectedKid.center_level || 3,
                  windmill: getKidWindmillLevel(selectedKid),
                }}
                wallLevel={selectedKid.center_level || 3}
              />
            </div>

            {/* Bottom info row */}
            <div className="flex justify-between items-center text-[10px] text-slate-400 bg-white/5 p-3 rounded-2xl border border-white/5 font-sans">
              <span className="font-bold text-[#FFD700]">سلوك مالي حي</span>
              <span>تتم محاكاة قريته بناءً على مدخراته في حصالة دوري العائلة وتبرعاته واستثماراته</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
