import { useNavigate } from 'react-router-dom';

export default function KidDonationsPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-8 text-right font-sans">
      {/* Header and Back Button */}
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 flex flex-col md:flex-row-reverse md:items-center justify-between gap-4">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl"></div>
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => navigate('/kid')}
            className="rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-bold text-white transition-all border border-white/5"
          >
            👦 العودة للوحة التحكم
          </button>
          <div>
            <h2 className="text-xs font-semibold text-emerald-400">تبرع للمسؤولية المجتمعية والمشاريع الخيرية</h2>
            <h3 className="text-2xl font-black text-white mt-1">صفحة التبرعات 🤲</h3>
          </div>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center text-slate-400">
        <p className="text-sm">هذه الصفحة ستضم قريباً تفاصيل قنوات التبرع المختلفة والمساهمات الخيرية للأبناء! 💚 ✨</p>
      </div>
    </div>
  );
}
