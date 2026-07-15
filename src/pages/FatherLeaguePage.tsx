import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function FatherLeaguePage() {
  const navigate = useNavigate();
  const { kids, activeLeague, startFamilyLeague, endFamilyLeague, calculateKidScores } = useApp();

  // Form states
  const [selectedBases, setSelectedBases] = useState<string[]>([
    'الادخار', 'الاستثمار', 'التبرع', 'إنجاز المهام', 'إدارة المصروف'
  ]);
  const [prize, setPrize] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allowances, setAllowances] = useState<Record<string, number>>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  useEffect(() => {
    if (kids.length > 0 && Object.keys(allowances).length === 0) {
      const initial: Record<string, number> = {};
      kids.forEach(k => {
        initial[k.id] = k.allowance || 100;
      });
      setAllowances(initial);
    }
  }, [kids, allowances]);

  const toggleBase = (base: string) => {
    if (selectedBases.includes(base)) {
      setSelectedBases(selectedBases.filter(b => b !== base));
    } else {
      setSelectedBases([...selectedBases, base]);
    }
  };

  const handleStartLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prize.trim()) {
      setErrorMsg('الرجاء إدخال الجائزة لتحفيز الأبناء!');
      return;
    }
    if (selectedBases.length === 0) {
      setErrorMsg('الرجاء اختيار معيار واحد على الأقل للدوري!');
      return;
    }
    if (!endDate) {
      setErrorMsg('الرجاء تحديد تاريخ نهاية التحدي!');
      return;
    }

    const today = new Date();
    const selectedEndDate = new Date(endDate);
    const diffTime = selectedEndDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    if (diffDays < 6.9 || diffDays > 30.1) {
      setErrorMsg('يجب أن تكون مدة التحدي بين 7 أيام و 30 يوماً!');
      return;
    }

    setErrorMsg('');
    try {
      await startFamilyLeague(prize, selectedBases, endDate, allowances);
    } catch (err) {
      console.error(err);
      setErrorMsg('حدث خطأ أثناء بدء الدوري.');
    }
  };

  const handleEndLeague = () => {
    setShowEndConfirm(true);
  };

  // Compile leaderboard
  const leaderboard = kids
    .map(kid => ({
      kid,
      scores: calculateKidScores(kid),
    }))
    .sort((a, b) => b.scores.totalPoints - a.scores.totalPoints);

  return (
    <div className="w-full space-y-8 text-right font-sans">
      {/* Header with Back Button */}
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
            <h2 className="text-xs font-semibold text-orange-400">تحدي الثقافة المالية والتوفير الداخلي</h2>
            <h3 className="text-2xl font-black text-white mt-1">دوري الأبناء الداخلي 🏆</h3>
          </div>
        </div>
      </div>

      {!activeLeague.isActive ? (
        /* START LEAGUE FORM */
        <div className="relative overflow-hidden bg-[#111C2E]/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-6 text-right space-y-6">
          <div className="border-b border-white/5 pb-3">
            <h4 className="text-base font-black text-white">بدء تحدي مالي جديد للأبناء 🏁</h4>
            <p className="text-[10px] text-slate-400 mt-1">
              اختر معايير التقييم والجائزة، وسيتم تحويل المصروف الشهري تلقائياً وبدء المنافسة رسمياً!
            </p>
          </div>

          <form onSubmit={handleStartLeague} className="space-y-6">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Select bases */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block">اختر معايير التقييم المالي 🎖️</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: 'الادخار', label: 'الادخار (أقصى 50 ن)' },
                  { id: 'الاستثمار', label: 'الاستثمار (أقصى 50 ن)' },
                  { id: 'التبرع', label: 'التبرع (أقصى 50 ن)' },
                  { id: 'إنجاز المهام', label: 'إنجاز المهام (أقصى 100 ن)' },
                  { id: 'إدارة المصروف', label: 'إدارة المصروف (أقصى 100 ن)' },
                ].map(base => {
                  const active = selectedBases.includes(base.id);
                  return (
                    <button
                      key={base.id}
                      type="button"
                      onClick={() => toggleBase(base.id)}
                      className={`p-3 rounded-2xl border transition-all text-xs font-bold text-center flex items-center justify-center gap-1.5 ${
                        active
                          ? 'bg-orange-500/20 border-orange-500/30 text-white font-black'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        readOnly
                        className="accent-orange-500"
                      />
                      <span>{base.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Base allowance for each kid */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block">حدد المصروف الأساسي لكل طفل 💵</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kids.map((kid) => (
                  <div key={kid.id} className="space-y-1">
                    <label className="block text-[11px] text-slate-400">مصروف {kid.name}</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={allowances[kid.id] !== undefined ? allowances[kid.id] : kid.allowance}
                      onChange={(e) => setAllowances({
                        ...allowances,
                        [kid.id]: Number(e.target.value)
                      })}
                      className="w-full bg-[#0D1527]/90 border border-white/10 rounded-2xl px-3 py-2 text-right text-white text-xs outline-none focus:border-orange-500/50 font-sans"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Prize Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">جائزة دوري هذا الشهر 🎁</label>
              <input
                type="text"
                value={prize}
                onChange={(e) => setPrize(e.target.value)}
                placeholder="مثال: بلايستيشن 5 🎮"
                className="w-full bg-[#0D1527]/90 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 transition-all text-right"
              />
            </div>

            {/* End Date Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">تاريخ نهاية التحدي 📅</label>
              <input
                type="datetime-local"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#0D1527]/90 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white text-right font-sans focus:outline-none focus:border-orange-500/50"
              />
            </div>

            {/* Start Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-[#8c7355] hover:from-orange-600 hover:to-[#9c8466] text-white font-black py-3.5 rounded-2xl text-xs transition-all duration-300 transform active:scale-95 shadow-lg flex items-center justify-center gap-1.5"
            >
              <span>توزيع المصروف وبدء الدوري العائلي 🏆</span>
            </button>
          </form>
        </div>
      ) : (
        /* ACTIVE LEAGUE LEADERBOARD */
        <div className="space-y-6">
          {/* Active League Prize Info */}
          <div className="relative overflow-hidden bg-gradient-to-r from-orange-500/10 to-indigo-500/5 border border-white/10 rounded-3xl p-6 text-right flex justify-between items-center gap-4">
            <button
              onClick={handleEndLeague}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 hover:text-rose-450 border border-rose-500/20 px-4 py-2 rounded-xl text-xs font-bold transition-all transform active:scale-95 flex items-center gap-1"
            >
              إنهاء التحدي مبكراً 🛑
            </button>
            <div className="space-y-1">
              <span className="text-[10px] text-orange-400 font-bold block">دوري الأبناء نشط حالياً 🔥</span>
              <h4 className="text-sm font-extrabold text-white">
                الجائزة الكبرى: <span className="text-orange-300">{activeLeague.prize}</span> 🎁
              </h4>
              <p className="text-[9px] text-slate-400">
                المعايير المعتمدة: {activeLeague.bases.join(' ، ')}
              </p>
            </div>
          </div>

          {/* Leaderboard Cards */}
          <div className="grid grid-cols-1 gap-6">
            {leaderboard.map((item, idx) => {
              const { kid, scores } = item;
              const isWinner = idx === 0;
              
              return (
                <div
                  key={kid.id}
                  className={`relative overflow-hidden bg-[#111C2E]/60 backdrop-blur-2xl border rounded-3xl p-6 text-right flex flex-col md:flex-row-reverse justify-between gap-6 transition-all duration-300 hover:scale-[1.01] ${
                    isWinner
                      ? 'border-orange-500/30 shadow-lg shadow-orange-500/5'
                      : 'border-white/10'
                  }`}
                >
                  {isWinner && (
                    <div className="absolute right-0 top-0 w-24 h-full bg-orange-500/5 blur-xl -z-10"></div>
                  )}

                  {/* Right Column: Kid Profile & Total Points */}
                  <div className="flex flex-row-reverse items-center gap-4 md:border-l md:border-white/5 md:pl-6 min-w-[200px]">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-xl">
                      {isWinner ? '👑' : '👦'}
                    </div>
                    <div className="space-y-1 text-right">
                      <h4 className="font-extrabold text-sm text-white flex items-center justify-end gap-1.5">
                        {kid.name}
                        {isWinner && <span className="text-[9px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded">المتصدر</span>}
                      </h4>
                      <div className="text-[10px] text-slate-400 font-sans">
                        مصروف الشهر: {scores.monthlyAllowance} ريال
                      </div>
                      <div className="text-lg font-black text-orange-400 font-sans">
                        {scores.totalPoints} <span className="text-[10px] text-slate-500 font-bold">نقطة</span>
                      </div>
                    </div>
                  </div>

                  {/* Left Column: Points Breakdown */}
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {/* Savings */}
                    {activeLeague.bases.includes('الادخار') && (
                      <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-center space-y-1">
                        <span className="text-[9px] text-slate-400 block">الادخار 💰</span>
                        <span className="text-xs font-bold text-white font-sans">{scores.savingsScore}/50</span>
                        <span className="text-[8px] text-slate-500 block font-sans">({scores.savingsAmount} ر)</span>
                      </div>
                    )}
                    {/* Investment */}
                    {activeLeague.bases.includes('الاستثمار') && (
                      <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-center space-y-1">
                        <span className="text-[9px] text-slate-400 block">الاستثمار 📈</span>
                        <span className="text-xs font-bold text-white font-sans">{scores.investmentScore}/50</span>
                        <span className="text-[8px] text-slate-500 block font-sans">({scores.investmentAmount} ر)</span>
                      </div>
                    )}
                    {/* Donation */}
                    {activeLeague.bases.includes('التبرع') && (
                      <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-center space-y-1">
                        <span className="text-[9px] text-slate-400 block">التبرع 🤲</span>
                        <span className="text-xs font-bold text-white font-sans">{scores.donationScore}/50</span>
                        <span className="text-[8px] text-slate-500 block font-sans">({scores.donationAmount} ر)</span>
                      </div>
                    )}
                    {/* Tasks */}
                    {activeLeague.bases.includes('إنجاز المهام') && (
                      <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-center space-y-1">
                        <span className="text-[9px] text-slate-400 block">المهام 🧹</span>
                        <span className="text-xs font-bold text-white font-sans">{scores.tasksScore}/50</span>
                        <span className="text-[8px] text-slate-500 block font-sans">({scores.approvedTasks}/{scores.totalTasks})</span>
                      </div>
                    )}
                    {/* Spending Eval */}
                    {activeLeague.bases.includes('إدارة المصروف') && (
                      <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-center space-y-1">
                        <span className="text-[9px] text-slate-400 block">المصروف 🛒</span>
                        <span className="text-xs font-bold text-white font-sans">{scores.spendingScore}/50</span>
                        <span className="text-[8px] text-slate-500 block font-sans">({scores.spentAmount} ر)</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Glassmorphism Confirmation Modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0D1527]/90 border border-white/10 p-6 rounded-3xl text-right space-y-4 shadow-2xl relative">
            <h3 className="text-lg font-black text-white">هل أنت متأكد؟</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              سيتم إنهاء الدوري الحالي وإلغاء جميع المهام المعلقة للأبناء بشكل نهائي. هل تريد الاستمرار؟
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowEndConfirm(false)}
                className="px-4 py-2 border border-white/10 rounded-xl text-xs font-bold text-slate-350 hover:bg-white/5 transition-all"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={async () => {
                  setShowEndConfirm(false);
                  if (activeLeague.id !== undefined) {
                    await endFamilyLeague(activeLeague.id);
                  }
                }}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
              >
                نعم، متأكد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
