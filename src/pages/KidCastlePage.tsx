import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VillageBoard from '../components/village/VillageBoard';

export default function KidCastlePage() {
  const navigate = useNavigate();

  // Range slider states for the 4 isometric village buildings (levels 1-5)
  const [bankLevel, setBankLevel] = useState<number>(3);
  const [farmLevel, setFarmLevel] = useState<number>(3);
  const [marketLevel, setMarketLevel] = useState<number>(3);
  const [centerLevel, setCenterLevel] = useState<number>(3);

  return (
    <div className="w-full space-y-8 text-right font-sans">
      {/* Header Panel */}
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 flex flex-col md:flex-row-reverse md:items-center justify-between gap-4">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl"></div>
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => navigate('/kid')}
            className="rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-bold text-white transition-all border border-white/5 animate-pulse"
          >
            👦 العودة للوحة التحكم
          </button>
          <div>
            <h2 className="text-xs font-semibold text-orange-400">التمثيل البصري ثلاثي الأبعاد للنمو المالي والادخاري</h2>
            <h3 className="text-2xl font-black text-white mt-1">القرية الافتراضية ثلاثية الأبعاد 2.5D 🏰</h3>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#111C2E]/60 border border-white/10 p-5 rounded-3xl text-xs leading-relaxed text-slate-300">
        <strong>💡 دليل معالم القرية الافتراضية ثلاثية الأبعاد:</strong>
        <p className="text-slate-400 mt-1">
          هذه قرية حيوية تتطور معالمها ومبانيها هندسياً وبصرياً بناءً على تقدمك المالي وسلوكك. مرر مؤشر الماوس (أو انقر) فوق أي مبنى لرؤية تصنيفه ومستواه!
        </p>
      </div>

      {/* Center Section: Render the 2.5D Isometric Village Board */}
      <div className="flex items-center justify-center bg-[#0D1527]/40 border border-white/5 rounded-3xl p-6 shadow-inner relative overflow-hidden min-h-[420px]">
        {/* Glowing background circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-orange-500/5 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-blue-500/5 blur-3xl pointer-events-none"></div>

        <VillageBoard
          levels={{
            bank: bankLevel,
            farm: farmLevel,
            market: marketLevel,
            center: centerLevel,
          }}
        />
      </div>

      {/* Developer Controls Glass Panel */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl space-y-6">
        <div className="border-b border-white/5 pb-3">
          <h4 className="text-sm font-black text-orange-400">لوحة تحكيم وتطوير المطورين (Developer Controls) 🛠️</h4>
          <p className="text-[10px] text-slate-400 mt-1 font-sans">
            اسحب مؤشرات التمرير أدناه للتحكم في مستوى كل مبنى على حدة (من 1 إلى 5) لمعاينة التغيرات الهندسية ومستويات الجمال المدمجة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slider 1: Center Palace */}
          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-sans text-slate-400 font-bold">المستوى: {centerLevel}</span>
              <span className="text-xs font-black text-white">المركز الرئيسي (قصر البلدية) 🏛️</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={centerLevel}
              onChange={(e) => setCenterLevel(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[8px] text-slate-500 font-sans">
              <span>مستوى 5 (ملكي ذهبي)</span>
              <span>مستوى 1 (بسيط رمادي)</span>
            </div>
          </div>

          {/* Slider 2: Bank Vault */}
          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-sans text-slate-400 font-bold">المستوى: {bankLevel}</span>
              <span className="text-xs font-black text-white">البنك العائلي (الادخار) 💰</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={bankLevel}
              onChange={(e) => setBankLevel(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[8px] text-slate-500 font-sans">
              <span>مستوى 5 (نقود عائمة)</span>
              <span>مستوى 1 (خزنة حجرية)</span>
            </div>
          </div>

          {/* Slider 3: Farm Oasis */}
          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-sans text-slate-400 font-bold">المستوى: {farmLevel}</span>
              <span className="text-xs font-black text-white">واحة العطاء (التبرعات) 💚</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={farmLevel}
              onChange={(e) => setFarmLevel(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[8px] text-slate-500 font-sans">
              <span>مستوى 5 (شلال مقدس)</span>
              <span>مستوى 1 (أرض قاحلة)</span>
            </div>
          </div>

          {/* Slider 4: Market Tent */}
          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-sans text-slate-400 font-bold">المستوى: {marketLevel}</span>
              <span className="text-xs font-black text-white">سوق الاستثمار العائلي 📈</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={marketLevel}
              onChange={(e) => setMarketLevel(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[8px] text-slate-500 font-sans">
              <span>مستوى 5 (مهرجان تجاري)</span>
              <span>مستوى 1 (كشك بسيط)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
