import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function FatherLeaguePage() {
  const navigate = useNavigate();
  const { kids, activeLeague, startLeague, endLeague } = useApp();

  // Form states
  const [selectedBases, setSelectedBases] = useState<string[]>([
    'الادخار', 'الاستثمار', 'التبرع', 'إنجاز المهام', 'إدارة المصروف'
  ]);
  const [prize, setPrize] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
    setErrorMsg('');
    try {
      await startLeague(prize, selectedBases);
    } catch (err) {
      console.error(err);
      setErrorMsg('حدث خطأ أثناء بدء الدوري.');
    }
  };

  // Helper to calculate kid's detailed scores
  const calculateKidScores = (kid: typeof kids[0]) => {
    const allowanceTx = (kid.transactions || []).find(tx => tx.title.includes('allowance_granted'));
    const monthlyAllowance = allowanceTx ? allowanceTx.amount : (kid.allowance || 100);

    const now = new Date();
    const currentMonthTx = (kid.transactions || []).filter((tx) => {
      const d = new Date(tx.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });

    const currentMonthTasks = (kid.tasks || []).filter((task) => {
      const d = task.createdAt ? new Date(task.createdAt) : new Date();
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });

    // 1. Savings Points (Max 50)
    const savingsAmount = currentMonthTx
      .filter(tx => tx.type === 'withdrawal' && (tx.title.includes('إيداع في حصالة') || tx.title.includes('حصالة')))
      .reduce((sum, tx) => sum + tx.amount, 0);
    const savingsScore = activeLeague.bases.includes('الادخار')
      ? Math.min(50, Math.round((savingsAmount / monthlyAllowance) * 50))
      : 0;

    // 2. Investment Points (Max 50)
    const investmentAmount = currentMonthTx
      .filter(tx => tx.type === 'withdrawal' && (tx.title.includes('استثمار') || tx.title.includes('مشروع')))
      .reduce((sum, tx) => sum + tx.amount, 0);
    const investmentScore = activeLeague.bases.includes('الاستثمار')
      ? Math.min(50, Math.round((investmentAmount / monthlyAllowance) * 50))
      : 0;

    // 3. Donation Points (Max 50)
    const donationAmount = currentMonthTx
      .filter(tx => tx.type === 'withdrawal' && tx.title.includes('تبرع'))
      .reduce((sum, tx) => sum + tx.amount, 0);
    const donationScore = activeLeague.bases.includes('التبرع')
      ? Math.min(50, Math.round((donationAmount / monthlyAllowance) * 50))
      : 0;

    // 4. Tasks Points (Max 100)
    const totalTasks = currentMonthTasks.length;
    const approvedTasks = currentMonthTasks.filter(t => t.status === 'approved').length;
    const tasksScore = activeLeague.bases.includes('إنجاز المهام') && totalTasks > 0
      ? Math.min(100, Math.round((approvedTasks / totalTasks) * 100))
      : 0;

    // 5. AI Spending Eval Points (Max 100)
    const spentAmount = currentMonthTx
      .filter(tx => {
        if (tx.type !== 'withdrawal') return false;
        const isSavings = tx.title.includes('إيداع في حصالة') || tx.title.includes('حصالة');
        const isInvestment = tx.title.includes('استثمار') || tx.title.includes('مشروع');
        const isDonation = tx.title.includes('تبرع');
        return !isSavings && !isInvestment && !isDonation;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);
    const spendingScore = activeLeague.bases.includes('إدارة المصروف')
      ? Math.max(0, 100 - Math.round((spentAmount / monthlyAllowance) * 100))
      : 0;

    const totalPoints = savingsScore + investmentScore + donationScore + tasksScore + spendingScore;

    return {
      savingsScore,
      savingsAmount,
      investmentScore,
      investmentAmount,
      donationScore,
      donationAmount,
      tasksScore,
      approvedTasks,
      totalTasks,
      spendingScore,
      spentAmount,
      totalPoints,
      monthlyAllowance,
    };
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
              onClick={endLeague}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 px-4 py-2 rounded-xl text-xs font-bold transition-all transform active:scale-95"
            >
              إنهاء التحدي 🏁
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
                        <span className="text-xs font-bold text-white font-sans">{scores.tasksScore}/100</span>
                        <span className="text-[8px] text-slate-500 block font-sans">({scores.approvedTasks}/{scores.totalTasks})</span>
                      </div>
                    )}
                    {/* Spending Eval */}
                    {activeLeague.bases.includes('إدارة المصروف') && (
                      <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-center space-y-1">
                        <span className="text-[9px] text-slate-400 block">المصروف 🛒</span>
                        <span className="text-xs font-bold text-white font-sans">{scores.spendingScore}/100</span>
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
    </div>
  );
}
