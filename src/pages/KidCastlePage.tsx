import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import VillageBoard from '../components/village/VillageBoard';

export default function KidCastlePage() {
  const navigate = useNavigate();
  const { kids, profile } = useApp();

  // Find current active kid from context
  const kid = kids.find((k) => k.name === profile?.name) || kids.find((k) => k.name === 'سالم') || kids[0];

  // Live levels bound to Supabase database columns via Context
  const bankLevel = kid.bank_level || 3;
  const farmLevel = kid.farm_level || 3;
  const marketLevel = kid.market_level || 3;
  const centerLevel = kid.center_level || 3;

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
            <h2 className="text-xs font-semibold text-orange-400">التمثيل البصري ثلاثي الأبعاد لنموك المالي وسلوكك</h2>
            <h3 className="text-2xl font-black text-white mt-1">القرية الافتراضية ثلاثية الأبعاد 2.5D 🏰</h3>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#111C2E]/60 border border-white/10 p-5 rounded-3xl text-xs leading-relaxed text-slate-350">
        <strong>💡 دليل معالم قريتك الافتراضية المربوطة بسلوكك:</strong>
        <ul className="list-disc pr-5 mt-2 space-y-1.5 text-slate-400">
          <li><strong>البنك العائلي 💰 (مستوى {bankLevel}):</strong> ينمو ويتزين بالذهب بناءً على التزامك بادخار الأموال بانتظام.</li>
          <li><strong>واحة التبرعات 💚 (مستوى {farmLevel}):</strong> تصبح خضراء ويفيض بئرها بالماء العذب عند مشاركتك المجتمعية بالخير والتبرع.</li>
          <li><strong>سوق الاستثمار 📈 (مستوى {marketLevel}):</strong> يمتلئ بالخيام والنشاط التجاري مع زيادة حجم استثماراتك في المشاريع العائلية.</li>
          <li><strong>المركز الرئيسي 🏛️ (مستوى {centerLevel}):</strong> قصر قريتك الذي يعكس شموخه وجماله مستواك المالي الشامل والتزامك بأهدافك.</li>
        </ul>
      </div>

      {/* Center Section: Render the 2.5D Isometric Village Board (Data bound to Supabase) */}
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

      {/* Tips Section */}
      <div className="bg-[#8c7355]/10 border border-[#8c7355]/20 text-[#e9e3db] p-5 rounded-3xl text-xs text-right leading-relaxed font-sans">
        <strong>💡 نصيحة للنمو:</strong> لإعمار قريتك وتحويلها إلى قلعة ذهبية شامخة 👑، استمر في إيداع الأموال بحصالتك الذكية، وشارك في التبرعات، ولا تهمل إتمام المهام المنزلية الموكلة إليك بانتظام من ولي أمرك!
      </div>
    </div>
  );
}
