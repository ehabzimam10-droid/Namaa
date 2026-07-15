import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function KidLeaguePage() {
  const navigate = useNavigate();
  const { kids, profile, activeLeague, calculateKidScores } = useApp();

  const activeKid = kids.find(k => k.name === profile?.name) || kids.find(k => k.name === 'سالم') || kids[0];

  // Compile leaderboard comparing Khalid and Salem
  const compiledList = kids.map(k => ({
    kid: k,
    scores: calculateKidScores(k),
  })).sort((a, b) => b.scores.totalPoints - a.scores.totalPoints);

  const ourRank = compiledList.findIndex(item => item.kid.id === activeKid.id) + 1;
  const ourScores = calculateKidScores(activeKid);
  const isFirst = ourRank === 1;

  // Find sibling above us
  const siblingAbove = ourRank > 1 ? compiledList[ourRank - 2] : null;
  const pointsBehind = siblingAbove ? (siblingAbove.scores.totalPoints - ourScores.totalPoints) : 0;

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
            <h2 className="text-xs font-semibold text-orange-400">تحدي التوفير والمسؤولية بين الإخوة</h2>
            <h3 className="text-2xl font-black text-white mt-1">دوري العائلة المشترك 🏆</h3>
          </div>
        </div>
      </div>

      {!activeLeague.isActive ? (
        <div className="bg-[#111C2E]/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-8 text-center space-y-4">
          <span className="text-4xl block">⏳🏆</span>
          <h4 className="text-sm font-extrabold text-white">لا يوجد دوري نشط حالياً</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            اطلب من والدك بدء الدوري وتوزيع المصروف الشهري لتنطلق المنافسة الكبرى وتحصيل الجوائز! 🎁✨
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Motivation Progress Card */}
          <div className="relative overflow-hidden bg-gradient-to-r from-orange-500/20 to-[#8c7355]/10 border border-orange-500/20 rounded-3xl p-6 text-right space-y-3">
            <div className="absolute -left-6 -top-6 text-7xl opacity-10">🚀</div>
            <h4 className="text-xs font-bold text-orange-300">وضعك الحالي في التحدي 📊</h4>
            
            <div className="flex flex-row-reverse items-center justify-start gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center font-sans font-black text-lg text-orange-400">
                {ourRank === 1 ? '🥇' : ourRank === 2 ? '🥈' : ourRank === 3 ? '🥉' : ourRank}
              </div>
              <div className="space-y-1">
                <span className="text-xl font-black text-white font-sans">{ourScores.totalPoints}</span>
                <span className="text-slate-400 text-[10px] mr-1">نقطة مسجلة</span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-200 font-bold pt-2 border-t border-white/5 font-sans">
              {isFirst ? (
                <span>أنت في المركز الأول 🥇! حافظ على الصدارة بمواصلة الادخار والمواظبة! 👑✨</span>
              ) : siblingAbove ? (
                <span>{siblingAbove.kid.name} يسبقك بـ {pointsBehind} نقطة! ضاعف جهودك في المهام والادخار لتجاوزه! 🔥🚀</span>
              ) : (
                <span>بطل نماء! زد من مدخراتك وأنجز مهامك لتسلق الترتيب بسرعة! 🌟</span>
              )}
            </p>

            <div className="text-[10px] text-slate-400 pt-1">
              الجائزة الكبرى للدوري: <strong className="text-orange-300">{activeLeague.prize} 🎁</strong>
            </div>
          </div>

          {/* Sibling Leaderboard comparison */}
          <div className="relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-6 text-right space-y-4">
            <h4 className="text-xs font-bold text-slate-300 border-b border-white/5 pb-2">جدول الترتيب الحالي للأبناء 📊</h4>
            <div className="space-y-3">
              {compiledList.map((item, idx) => {
                const isOurFamily = item.kid.id === activeKid.id;
                const rankEmoji = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '';
                return (
                  <div
                    key={item.kid.id}
                    className={`flex justify-between items-center p-3.5 rounded-2xl border transition-all duration-300 ${
                      isOurFamily
                        ? 'bg-orange-500/20 border-orange-500/30 shadow-lg scale-[1.01]'
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    {/* Left: Points */}
                    <div className="flex items-center gap-1 font-sans font-black text-xs text-slate-100">
                      <span className="text-orange-400">{item.scores.totalPoints}</span>
                      <span className="text-[9px] text-slate-500 font-bold">نقطة</span>
                    </div>

                    {/* Right: Kid Name */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <h5 className="font-extrabold text-xs text-white flex items-center justify-end gap-1.5">
                          {item.kid.name}
                          {isOurFamily && (
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-orange-500/30 text-orange-300">
                              أنت ✨
                            </span>
                          )}
                        </h5>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-white/5 border border-white/5 flex items-center justify-center font-sans font-black text-xs text-orange-300">
                        {rankEmoji || (idx + 1)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Breakdown Score Board */}
          <div className="relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-6 text-right space-y-4">
            <h4 className="text-xs font-bold text-slate-300 border-b border-white/5 pb-2">تفصيل نقاطك الحالية 🎖️</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {/* Savings */}
              {activeLeague.bases.includes('الادخار') && (
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center space-y-1.5">
                  <span className="text-xs block">الادخار 💰</span>
                  <span className="text-base font-black text-white font-sans">{ourScores.savingsScore}/50</span>
                  <p className="text-[9px] text-slate-400">ادخرت {ourScores.savingsAmount} ريال هذا الشهر</p>
                </div>
              )}
              {/* Investment */}
              {activeLeague.bases.includes('الاستثمار') && (
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center space-y-1.5">
                  <span className="text-xs block">الاستثمار 📈</span>
                  <span className="text-base font-black text-white font-sans">{ourScores.investmentScore}/50</span>
                  <p className="text-[9px] text-slate-400">استثمرت {ourScores.investmentAmount} ريال هذا الشهر</p>
                </div>
              )}
              {/* Donation */}
              {activeLeague.bases.includes('التبرع') && (
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center space-y-1.5">
                  <span className="text-xs block">التبرع 🤲</span>
                  <span className="text-base font-black text-white font-sans">{ourScores.donationScore}/50</span>
                  <p className="text-[9px] text-slate-400">تبرعت بمبلغ {ourScores.donationAmount} ريال</p>
                </div>
              )}
              {/* Tasks */}
              {activeLeague.bases.includes('إنجاز المهام') && (
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center space-y-1.5">
                  <span className="text-xs block">المهام المنجزة 🧹</span>
                  <span className="text-base font-black text-white font-sans">{ourScores.tasksScore}/100</span>
                  <p className="text-[9px] text-slate-400">أنجزت {ourScores.approvedTasks} مهام من أصل {ourScores.totalTasks}</p>
                </div>
              )}
              {/* Spending Eval */}
              {activeLeague.bases.includes('إدارة المصروف') && (
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center space-y-1.5">
                  <span className="text-xs block">إدارة المصروف 🛒</span>
                  <span className="text-base font-black text-white font-sans">{ourScores.spendingScore}/100</span>
                  <p className="text-[9px] text-slate-400">صرفت {ourScores.spentAmount} ريال استهلاكياً</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
