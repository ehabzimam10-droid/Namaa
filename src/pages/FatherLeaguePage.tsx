import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function FatherLeaguePage() {
  const navigate = useNavigate();
  const { league } = useApp();

  return (
    <div className="w-full space-y-8 text-right font-sans">
      {/* Header and Back Button */}
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 flex flex-col md:flex-row-reverse md:items-center justify-between gap-4">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl"></div>
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => navigate('/father')}
            className="rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-bold text-white transition-all border border-white/5"
          >
            👨‍💼 العودة للوحة التحكم
          </button>
          <div>
            <h2 className="text-xs font-semibold text-orange-400">منافسة التوفير الذكي بين العائلات</h2>
            <h3 className="text-2xl font-black text-white mt-1">دوري العائلات 🏆</h3>
          </div>
        </div>
      </div>

      {/* Info Message */}
      <div className="bg-[#8c7355]/10 border border-[#8c7355]/20 text-[#dfd5c6] p-4 rounded-2xl text-xs leading-relaxed">
        <strong>💡 ما هو دوري العائلات؟</strong> هو دوري تنافسي يعتمد على السلوك المالي الحقيقي لعائلتك! يتم احتساب نقاط عائلتك حركياً بناءً على:
        مجموع مدخرات الأبناء في الحصالات + نقاط تبرعاتهم + (مجموع مهامهم المنجزة والمعتمدة مضروبة في 50 نقطة). شجع أبنائك للتفوق على بقية العوائل! 🚀
      </div>

      {/* Leaderboard Table Container */}
      <div className="relative overflow-hidden bg-[#111C2E]/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-6 text-right space-y-4">
        <h4 className="text-sm font-bold text-orange-400 border-b border-white/5 pb-2">لوحة الصدارة 📊</h4>
        
        <div className="space-y-3">
          {league.map((fam) => {
            const isOurFamily = fam.family_name === 'عائلة أبو خالد';
            const rankEmoji = fam.rank === 1 ? '🥇' : fam.rank === 2 ? '🥈' : fam.rank === 3 ? '🥉' : '';
            
            return (
              <div
                key={fam.family_name}
                className={`flex justify-between items-center p-4 rounded-2xl border transition-all duration-300 ${
                  isOurFamily
                    ? 'bg-orange-500/20 border-orange-500/30 shadow-lg shadow-orange-500/5 scale-[1.01]'
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                {/* Left: Points */}
                <div className="flex items-center gap-1.5 font-sans font-black text-xs md:text-sm text-slate-100">
                  <span className="text-orange-400">{fam.total_points}</span>
                  <span className="text-[10px] text-slate-500 font-bold">نقطة</span>
                </div>

                {/* Right: Rank Emoji & Family Name */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <h5 className="font-extrabold text-xs md:text-sm text-white flex items-center justify-end gap-1.5">
                      {fam.family_name}
                      {isOurFamily && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-orange-500/30 text-orange-300">
                          عائلتك ✨
                        </span>
                      )}
                    </h5>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center font-sans font-black text-xs md:text-sm text-orange-300">
                    {rankEmoji || fam.rank}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
