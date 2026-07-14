import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function KidLeaguePage() {
  const navigate = useNavigate();
  const { league } = useApp();

  // Find our family's stats
  const ourIndex = league.findIndex(f => f.family_name === 'عائلة أبو خالد');
  const ourFamily = ourIndex !== -1 ? league[ourIndex] : null;
  
  // Find the family directly above us in points
  const familyAbove = ourIndex > 0 ? league[ourIndex - 1] : null;
  const pointsNeeded = familyAbove && ourFamily ? (familyAbove.total_points - ourFamily.total_points + 1) : 0;

  return (
    <div className="w-full space-y-8 text-right font-sans">
      {/* Header and Back Button */}
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
            <h2 className="text-xs font-semibold text-orange-400">تحدي التوفير والمسؤولية بين العوائل</h2>
            <h3 className="text-2xl font-black text-white mt-1">دوري العائلة المشترك 🏆</h3>
          </div>
        </div>
      </div>

      {/* Motivation Panel */}
      {ourFamily && (
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-500/20 to-[#8c7355]/10 border border-orange-500/20 rounded-3xl p-6 text-right space-y-3">
          <div className="absolute -left-6 -top-6 text-7xl opacity-10">🚀</div>
          
          <h4 className="text-sm font-bold text-orange-300">ترتيب عائلتنا الحالي 📊</h4>
          
          <div className="flex flex-row-reverse items-center justify-start gap-4">
            <div className="w-14 h-14 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center font-sans font-black text-xl text-orange-400">
              {ourFamily.rank === 1 ? '🥇' : ourFamily.rank === 2 ? '🥈' : ourFamily.rank === 3 ? '🥉' : ourFamily.rank}
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-black text-white font-sans">{ourFamily.total_points}</span>
              <span className="text-slate-400 text-xs mr-1">نقطة عائلية</span>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-slate-200 font-bold pt-2 border-t border-white/5">
            {ourFamily.rank === 1 ? (
              <span>✨ عائلتنا في الصدارة بالمركز الأول! حافظ على هذا الإنجاز الرائع بمواصلة التوفير والتبرع وإتمام المهام! 🥇👑</span>
            ) : familyAbove ? (
              <span>🔥 نحتاج إلى {pointsNeeded} نقطة إضافية لنتجاوز {familyAbove.family_name} التي تسبقنا مباشرة في الترتيب! 🚀</span>
            ) : (
              <span>بطل نماء! زد من مدخراتك وأنجز مهامك لتسلق الترتيب بسرعة! 🌟</span>
            )}
          </p>
        </div>
      )}

      {/* Leaderboard Grid */}
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-6 text-right space-y-4">
        <h4 className="text-sm font-bold text-slate-300 border-b border-white/5 pb-2">جدول صدارة الدوري العائلي 📊</h4>
        
        <div className="space-y-3">
          {league.map((fam) => {
            const isOurFamily = fam.family_name === 'عائلة أبو خالد';
            const rankEmoji = fam.rank === 1 ? '🥇' : fam.rank === 2 ? '🥈' : fam.rank === 3 ? '🥉' : '';
            
            return (
              <div
                key={fam.family_name}
                className={`flex justify-between items-center p-3.5 rounded-2xl border transition-all duration-300 ${
                  isOurFamily
                    ? 'bg-orange-500/20 border-orange-500/30 shadow-lg scale-[1.01]'
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                {/* Left: Points */}
                <div className="flex items-center gap-1 font-sans font-black text-xs text-slate-100">
                  <span className="text-orange-400">{fam.total_points}</span>
                  <span className="text-[9px] text-slate-500 font-bold">نقطة</span>
                </div>

                {/* Right: Family name & rank */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <h5 className="font-extrabold text-xs text-white flex items-center justify-end gap-1.5">
                      {fam.family_name}
                      {isOurFamily && (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-orange-500/30 text-orange-300">
                          عائلتنا ✨
                        </span>
                      )}
                    </h5>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/5 flex items-center justify-center font-sans font-black text-xs text-orange-300">
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
