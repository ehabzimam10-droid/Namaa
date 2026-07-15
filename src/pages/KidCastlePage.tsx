import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CastleVisual from '../components/ui/CastleVisual';

type PartStatus = 'thriving' | 'average' | 'damaged';

export default function KidCastlePage() {
  const navigate = useNavigate();

  // Test states for development phase
  const [level, setLevel] = useState<number>(3);
  const [parts, setParts] = useState<{
    savings: PartStatus;
    spending: PartStatus;
    donation: PartStatus;
    investment: PartStatus;
    tasks: PartStatus;
  }>({
    savings: 'average',
    spending: 'average',
    donation: 'average',
    investment: 'average',
    tasks: 'average',
  });

  const togglePart = (partKey: keyof typeof parts) => {
    setParts((prev) => {
      const current = prev[partKey];
      let next: PartStatus = 'average';
      if (current === 'average') next = 'thriving';
      else if (current === 'thriving') next = 'damaged';
      else if (current === 'damaged') next = 'average';

      return {
        ...prev,
        [partKey]: next,
      };
    });
  };

  const getStatusLabel = (status: PartStatus) => {
    switch (status) {
      case 'thriving':
        return 'مزدهر ✨';
      case 'average':
        return 'طبيعي ⚖️';
      case 'damaged':
        return 'متضرر ⚠️';
    }
  };

  const getStatusColor = (status: PartStatus) => {
    switch (status) {
      case 'thriving':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'average':
        return 'text-slate-350 border-slate-500/20 bg-slate-500/5';
      case 'damaged':
        return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    }
  };

  return (
    <div className="w-full space-y-8 text-right font-sans">
      {/* Header Panel */}
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 flex flex-col md:flex-row-reverse md:items-center justify-between gap-4">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl"></div>
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => navigate('/kid')}
            className="rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-bold text-white transition-all border border-white/5"
          >
            👦 العودة للوحة التحكم
          </button>
          <div>
            <h2 className="text-xs font-semibold text-orange-400">التمثيل البصري التفاعلي لنموك المالي وسلوكك</h2>
            <h3 className="text-2xl font-black text-white mt-1">القلعة الافتراضية والقرية الذكية 🏰</h3>
          </div>
        </div>
      </div>

      {/* Intro info banner */}
      <div className="bg-[#111C2E]/60 border border-white/10 p-5 rounded-3xl text-xs leading-relaxed text-slate-350">
        <strong>💡 كيف تعمل القلعة الافتراضية؟</strong> تتأثر وتتغير معالم قريتك المخصصة بناءً على سلوكك المالي الحقيقي في تطبيق نماء:
        <ul className="list-disc pr-5 mt-2 space-y-1 text-slate-400">
          <li><strong>حصالة الادخار (البرج المركزي):</strong> يرتفع ويزدهر باللون الذهبي كلما ادخرت والتزمت بأهدافك.</li>
          <li><strong>إدارة المصروف (الأسوار والقرية):</strong> تظل قوية وسليمة وتتصدع في حال الإسراف الاستهلاكي.</li>
          <li><strong>بوابة التبرع (الواحة والمزرعة):</strong> تصبح خضراء يانعة ومليئة بالمياه كلما شاركت بالخير والعطاء.</li>
          <li><strong>الاستثمار العائلي (الخيمة التجارية/السوق):</strong> تزدحم بخيام التجار والنشاط كلما استثمرت عوائدك.</li>
          <li><strong>إنجاز المهام (طاحونة الهواء):</strong> تدور أشرعتها بسرعة مع كل مهمة منزلية تنجزها بجد وتوقف عند الإهمال.</li>
        </ul>
      </div>

      {/* Main Castle Visual Container */}
      <div className="flex justify-center py-4">
        <CastleVisual level={level} parts={parts} />
      </div>

      {/* Developer Debug Panel */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl space-y-4">
        <div className="border-b border-white/5 pb-2">
          <h4 className="text-sm font-black text-orange-400">لوحة تحكم وتطوير معالم القرية (Developer Debug Panel) 🛠️</h4>
          <p className="text-[10px] text-slate-400 mt-1 font-sans">
            استخدم الأزرار أدناه لتغيير مستوى القرية وحالة الأقسام الخمسة لمشاهدة التغيرات البصرية والتفاعلية فورياً.
          </p>
        </div>

        {/* Level Toggler */}
        <div className="flex flex-row-reverse items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5">
          <span className="text-xs font-bold text-slate-300">مستوى القرية العام:</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevel(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans transition-all active:scale-95 ${
                  level === lvl
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Parts State Togglers */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(Object.keys(parts) as Array<keyof typeof parts>).map((key) => {
            let label = '';
            if (key === 'savings') label = 'حصالة الادخار 💰';
            else if (key === 'spending') label = 'الإنفاق والمصروف 💳';
            else if (key === 'donation') label = 'التبرع والعطاء 💚';
            else if (key === 'investment') label = 'الاستثمار العائلي 📈';
            else if (key === 'tasks') label = 'إنجاز المهام 🎯';

            const status = parts[key];

            return (
              <button
                key={key}
                type="button"
                onClick={() => togglePart(key)}
                className={`flex flex-col items-center justify-between p-3 border rounded-2xl transition-all active:scale-95 text-center gap-2 focus:outline-none ${getStatusColor(
                  status
                )}`}
              >
                <span className="text-xs font-black">{label}</span>
                <span className="text-[9px] font-sans bg-black/30 px-2 py-0.5 rounded-full block mt-1">
                  {getStatusLabel(status)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
