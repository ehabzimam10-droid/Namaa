import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { evaluateKidsSpending } from '../utils/aiService';
import { supabase } from '../utils/supabaseClient';

export default function FatherLeaguePage() {
  const navigate = useNavigate();
  const { kids, activeLeague, startFamilyLeague, endFamilyLeague, calculateKidScores, geminiApiKey } = useApp();

  // Form states
  const [selectedBases, setSelectedBases] = useState<string[]>([
    'الادخار', 'الاستثمار', 'التبرع', 'إنجاز المهام', 'إدارة المصروف'
  ]);
  const [prize, setPrize] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allowances, setAllowances] = useState<Record<string, number>>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showAiEvaluation, setShowAiEvaluation] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiEvaluations, setAiEvaluations] = useState<any[]>([]);
  const [customScores, setCustomScores] = useState<Record<string, number>>({});
  const [countdownText, setCountdownText] = useState('');
  const [pastLeagues, setPastLeagues] = useState<any[]>([]);
  const [selectedPastLeague, setSelectedPastLeague] = useState<any | null>(null);
  const [forceShowCreateForm, setForceShowCreateForm] = useState(false);

  useEffect(() => {
    if (activeLeague && activeLeague.isActive) {
      setForceShowCreateForm(false);
    }
  }, [activeLeague]);

  useEffect(() => {
    const fetchPastLeagues = async () => {
      try {
        const { data, error } = await supabase
          .from('family_leagues')
          .select('*')
          .eq('is_active', false)
          .order('end_date', { ascending: false });
        if (!error && data) {
          setPastLeagues(data);
        }
      } catch (err) {
        console.error('Failed to fetch past leagues:', err);
      }
    };
    fetchPastLeagues();
  }, [activeLeague]);

  useEffect(() => {
    if (!activeLeague || !activeLeague.isActive || !activeLeague.endDate) return;

    const updateTimer = () => {
      const target = new Date(activeLeague.endDate!).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setCountdownText('انتهت مدة التحدي 🏁');
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdownText(`المتبقي: ${days} يوم، ${hours} ساعة، ${minutes} دقيقة، ${seconds} ثانية`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeLeague]);

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
    const diffMinutes = diffTime / (1000 * 60);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    if (diffMinutes < 1 || diffDays > 30.1) {
      setErrorMsg('يجب أن تكون مدة التحدي دقيقة واحدة على الأقل و 30 يوماً كحد أقصى!');
      return;
    }

    const isoEndDate = selectedEndDate.toISOString();
    setErrorMsg('');
    try {
      await startFamilyLeague(prize, selectedBases, isoEndDate, allowances);
    } catch (err) {
      console.error(err);
      setErrorMsg('حدث خطأ أثناء بدء الدوري.');
    }
  };

  const handleEndLeague = () => {
    setShowEndConfirm(true);
  };

  const handleTriggerAiEvaluation = async () => {
    setShowAiEvaluation(true);
    setIsAiLoading(true);
    try {
      const result = await evaluateKidsSpending(geminiApiKey, kids, activeLeague.startDate, activeLeague.endDate);
      setAiEvaluations(result);
      const scoresRecord: Record<string, number> = {};
      result.forEach(item => {
        const kidObj = kids.find(k => k.name === item.kidName);
        const kidKey = kidObj ? kidObj.id : item.kidName;
        scoresRecord[kidKey] = item.suggestedScore;
      });
      setCustomScores(scoresRecord);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Compile leaderboard
  const leaderboard = kids
    .map(kid => ({
      kid,
      scores: calculateKidScores(kid),
    }))
    .sort((a, b) => b.scores.totalPoints - a.scores.totalPoints);

  const isLeagueExpired = activeLeague.endDate ? new Date() >= new Date(activeLeague.endDate) : false;

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

      {(() => {
        const isLeagueEndedRecent = !activeLeague.isActive && activeLeague.endDate &&
          (new Date().getTime() - new Date(activeLeague.endDate).getTime()) < 24 * 60 * 60 * 1000;

        if (!activeLeague.isActive && isLeagueEndedRecent && !forceShowCreateForm) {
          return (
            <div className="space-y-6">
              {/* Festive Banner */}
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 to-[#111C2E] border-2 border-orange-500/30 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
                <div className="absolute -left-12 -top-12 text-8xl opacity-15">🏆</div>
                <div className="absolute -right-12 -bottom-12 text-8xl opacity-15">🎉</div>
                
                <span className="text-5xl block animate-bounce">🏆🎉👑</span>
                <h2 className="text-xl font-black text-white">إعلان نتائج الدوري العائلي الكبرى 🏆🎉</h2>
                <p className="text-xs text-slate-350 max-w-md mx-auto leading-relaxed">
                  تهانينا للجميع! لقد انتهت جولات الدوري بنجاح. إليكم نتائج تقييم أبطال نماء الماليين!
                </p>

                <div className="bg-orange-500/10 border border-orange-500/20 max-w-sm mx-auto p-4 rounded-2xl">
                  <span className="text-[10px] text-slate-400 block mb-1">الجائزة الكبرى للدوري:</span>
                  <span className="text-lg font-black text-orange-400">{activeLeague.prize} 🎁</span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setForceShowCreateForm(true)}
                    className="px-6 py-3 bg-[#E57A44]/20 hover:bg-[#E57A44]/35 text-[#E57A44] border border-[#E57A44]/40 font-extrabold rounded-2xl text-sm transition-all shadow-lg backdrop-blur-md active:scale-95 flex items-center justify-center gap-2 mx-auto font-sans"
                  >
                    <span>بدء تحدي جديد 🎯</span>
                  </button>
                </div>
              </div>

              {/* Winner announcement card */}
              {leaderboard.length > 0 && (() => {
                const maxPoints = leaderboard[0].scores.totalPoints;
                const winners = leaderboard.filter(item => item.scores.totalPoints === maxPoints);
                const isTie = winners.length > 1;
                const winnerNames = winners.map(w => w.kid.name).join(' و');

                return (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center space-y-4 relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-yellow-500/10 blur-2xl"></div>
                    
                    <div className="inline-flex flex-col items-center">
                      <span className="text-5xl mb-2 animate-bounce">👑</span>
                      <span className="text-sm font-semibold text-slate-400">
                        {isTie ? 'أبطال دوري العائلة المشتركون:' : 'بطل دوري العائلة المالي:'}
                      </span>
                      <span className="text-2xl font-black text-yellow-300 mt-1">
                        {isTie ? `أبطال دوري العائلة: ${winnerNames} 👑🏆` : `${leaderboard[0].kid.name} 👑`}
                      </span>
                      <span className="text-xs text-slate-300 mt-1 font-sans">بمجموع نقاط {maxPoints} نقطة 🌟</span>
                    </div>
                  </div>
                );
              })()}

              {/* Final leaderboard list */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-right space-y-4">
                <h4 className="text-xs font-bold text-slate-300 border-b border-white/5 pb-2">جدول الترتيب النهائي للأبناء 📊</h4>
                <div className="space-y-3">
                  {leaderboard.map((item, idx) => {
                    const isWinner = idx === 0;
                    return (
                      <div
                        key={item.kid.id}
                        className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${
                          isWinner
                            ? 'bg-yellow-500/10 border-yellow-500/20 shadow-md scale-[1.01]'
                            : 'bg-white/5 border-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-1 font-sans font-black text-xs text-white">
                          <span className="text-orange-400">{item.scores.totalPoints}</span>
                          <span className="text-[9px] text-slate-500">نقطة</span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <div className="text-right">
                            <h5 className="font-extrabold text-xs text-white flex items-center justify-end gap-1.5">
                              {item.kid.name} {isWinner && '👑'}
                            </h5>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-sans font-black text-xs text-orange-300">
                            {idx + 1}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed breakdown of all kids' categories */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-right space-y-4">
                <h4 className="text-xs font-bold text-slate-300 border-b border-white/5 pb-2">تحليل أداء الأداء المالي للأبناء 📊</h4>
                <div className="space-y-6">
                  {leaderboard.map((item) => (
                    <div key={item.kid.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3">
                      <span className="font-extrabold text-xs text-white block">الابن: {item.kid.name} 👦</span>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-[10px] font-sans">
                        <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                          <span className="block text-slate-400">الادخار (50)</span>
                          <span className="font-extrabold text-white">{item.scores.savingsScore}/50</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                          <span className="block text-slate-400">الاستثمار (50)</span>
                          <span className="font-extrabold text-white">{item.scores.investmentScore}/50</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                          <span className="block text-slate-400">التبرع (50)</span>
                          <span className="font-extrabold text-white">{item.scores.donationScore}/50</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                          <span className="block text-slate-400">المهام (100)</span>
                          <span className="font-extrabold text-white">{item.scores.tasksScore}/100</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                          <span className="block text-slate-400">إدارة المصروف (100)</span>
                          <span className="font-extrabold text-white">{item.scores.spendingScore}/100</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (!activeLeague.isActive) {
          return (
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
      );
    }

    return (
      /* ACTIVE LEAGUE LEADERBOARD */
      <div className="space-y-6">
          {/* Active League Prize Info */}
          <div className="relative overflow-hidden bg-gradient-to-r from-orange-500/10 to-indigo-500/5 border border-white/10 rounded-3xl p-6 text-right flex justify-between items-center gap-4">
            {!isLeagueExpired ? (
              <button
                onClick={handleEndLeague}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-500 border border-rose-500/20 px-4 py-2 rounded-xl text-xs font-bold transition-all transform active:scale-95 flex items-center gap-1"
              >
                إنهاء التحدي مبكراً 🛑
              </button>
            ) : (
              <button
                onClick={handleTriggerAiEvaluation}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-bold transition-all transform active:scale-95 flex items-center gap-1"
              >
                تقييم الأبناء وإعلان النتائج 🏆
              </button>
            )}
            <div className="space-y-1">
              <span className="text-[10px] text-orange-400 font-bold block">دوري الأبناء نشط حالياً 🔥</span>
              <h4 className="text-sm font-extrabold text-white">
                الجائزة الكبرى: <span className="text-orange-300">{activeLeague.prize}</span> 🎁
              </h4>
              <p className="text-[9px] text-slate-400">
                المعايير المعتمدة: {activeLeague.bases.join(' ، ')}
              </p>
              {countdownText && (
                <span className="text-[10px] text-orange-300 font-bold block mt-1 font-sans">
                  {countdownText}
                </span>
              )}
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
      );
    })()}

      {/* Custom Glassmorphism Confirmation Modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0D1527]/90 border border-white/10 p-6 rounded-3xl text-right space-y-4 shadow-2xl relative">
            <h3 className="text-lg font-black text-white">هل أنت متأكد؟</h3>
            <p className="text-xs text-slate-350 leading-relaxed">
              سيؤدي هذا إلى إلغاء التحدي بالكامل وحذف جميع المهام المرتبطة به دون تقييم.
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

      {/* AI Evaluation Generative UI Modal */}
      {showAiEvaluation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0D1527]/95 border border-white/10 p-6 rounded-3xl text-right space-y-6 shadow-2xl relative my-8">
            <div className="border-b border-white/5 pb-3 flex justify-between items-center flex-row-reverse">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>تقييم المستشار المالي النهائي 🤖</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAiEvaluation(false)}
                className="text-slate-400 hover:text-white text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {isAiLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="h-10 w-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-slate-300 font-bold">جاري تحليل معاملات الأبناء واحتساب التقييم النهائي... 🧠🤖</span>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-300 leading-relaxed">
                  يقوم المستشار المالي الآن بتقييم مهارات الإنفاق وإدارة المصروف للأبناء بناءً على سلوكياتهم ومعاملاتهم المالية خلال الدوري:
                </p>

                <div className="space-y-4">
                  {aiEvaluations.map((evalItem, idx) => {
                    const kidObj = kids.find(k => k.name === evalItem.kidName);
                    const kidId = kidObj ? kidObj.id : evalItem.kidName;
                    const currentScore = customScores[kidId] ?? evalItem.suggestedScore;

                    return (
                      <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3 text-right">
                        <div className="flex justify-between items-center flex-row-reverse">
                          <span className="font-extrabold text-sm text-white">الابن: {evalItem.kidName} 👦</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">الدرجة المقترحة (0-100):</span>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={currentScore}
                              onChange={(e) => setCustomScores({
                                ...customScores,
                                [kidId]: Math.min(100, Math.max(0, Number(e.target.value)))
                              })}
                              className="w-16 bg-[#111C2E]/60 border border-white/10 rounded-xl px-2 py-1 text-center text-xs font-bold text-orange-400 font-sans outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>

                        <div className="bg-[#111C2E]/40 p-3 rounded-xl border border-white/5 text-[11px] leading-relaxed text-slate-300">
                          <span className="font-bold text-orange-300 block mb-1">تحليل المستشار المالي:</span>
                          {evalItem.reasoning}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3 justify-end pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowAiEvaluation(false)}
                    className="px-4 py-2 border border-white/10 rounded-xl text-xs font-bold text-slate-350 hover:bg-white/5 transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (activeLeague.id !== undefined) {
                        await endFamilyLeague(activeLeague.id, customScores);
                      }
                      setShowAiEvaluation(false);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-[#8c7355] hover:from-orange-600 hover:to-[#9c8466] text-white rounded-xl text-xs font-black transition-all shadow-lg active:scale-95 flex items-center gap-1.5"
                  >
                    <span>اعتماد التقييم وإعلان النتائج 🏆</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {/* Past Leagues History Section */}
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 text-right space-y-4">
        <h3 className="text-base font-black text-white flex items-center justify-end gap-2">
          <span>سجل التحديات السابقة 📜</span>
        </h3>
        
        {pastLeagues.length === 0 ? (
          <p className="text-xs text-slate-400">لا توجد تحديات سابقة مؤرشفة حالياً.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pastLeagues.map((league) => {
              const formattedDate = new Date(league.end_date).toLocaleDateString('ar-SA');
              return (
                <div
                  key={league.id}
                  onClick={() => setSelectedPastLeague(league)}
                  className="bg-[#111C2E]/60 border border-white/5 hover:border-orange-500/30 p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between gap-3 text-right"
                >
                  <div className="flex justify-between items-center flex-row-reverse border-b border-white/5 pb-2">
                    <span className="text-xs font-black text-white">الجائزة: {league.prize} 🎁</span>
                    <span className="text-[10px] text-slate-400">{formattedDate}</span>
                  </div>
                  <div className="text-[10px] text-slate-350 space-y-1">
                    <p>المعايير: {league.bases?.join(' ، ')}</p>
                  </div>
                  <span className="text-[9px] text-orange-400 font-bold self-start mt-2">عرض التفاصيل ➜</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past League Detail Modal */}
      {selectedPastLeague && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0D1527]/95 border border-white/10 p-6 rounded-3xl text-right space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="border-b border-white/5 pb-3 flex justify-between items-center flex-row-reverse">
              <h3 className="text-lg font-black text-white">تفاصيل التحدي المؤرشف 📜</h3>
              <button
                type="button"
                onClick={() => setSelectedPastLeague(null)}
                className="text-slate-400 hover:text-white text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between flex-row-reverse bg-white/5 p-2.5 rounded-xl">
                <span className="font-bold text-white">الجائزة الكبرى:</span>
                <span className="text-orange-300 font-extrabold">{selectedPastLeague.prize} 🎁</span>
              </div>
              <div className="flex justify-between flex-row-reverse bg-white/5 p-2.5 rounded-xl font-sans">
                <span className="font-bold text-white">تاريخ الانتهاء:</span>
                <span>{new Date(selectedPastLeague.end_date).toLocaleString('ar-SA')}</span>
              </div>
              <div className="flex justify-between flex-row-reverse bg-white/5 p-2.5 rounded-xl">
                <span className="font-bold text-white">المعايير المعتمدة:</span>
                <span>{selectedPastLeague.bases?.join(' ، ')}</span>
              </div>

              {/* Leaderboard & Breakdown inside History Modal */}
              <div className="space-y-4 border-t border-white/5 pt-3 mt-3">
                <span className="font-bold text-white block">الترتيب والنتائج النهائية للأبناء:</span>
                {(() => {
                  const calculatePastLeagueKidScores = (kid: any, league: any) => {
                    const baseAllowance = Number(league.allowances?.[kid.id] || league.allowances?.[kid.name] || kid.allowance || 100);
                    const startTime = new Date(league.start_date).getTime();
                    const endTime = new Date(league.end_date).getTime();

                    const currentLeagueTx = (kid.transactions || []).filter((tx: any) => {
                      const txTime = new Date(tx.date).getTime();
                      return txTime >= startTime && txTime <= endTime;
                    });

                    const currentLeagueTasks = (kid.tasks || []).filter((task: any) => {
                      const taskTime = new Date(task.createdAt || task.endDate || '').getTime();
                      if (isNaN(taskTime)) return false;
                      return taskTime >= startTime && taskTime <= endTime;
                    });

                    const savingsAmount = currentLeagueTx
                      .filter((tx: any) => tx.type === 'withdrawal' && tx.title.includes('حصالة'))
                      .reduce((sum: number, tx: any) => sum + tx.amount, 0);
                    const savingsScore = league.bases?.includes('الادخار')
                      ? Math.min(50, Math.round((savingsAmount / baseAllowance) * 50))
                      : 0;

                    const investmentAmount = currentLeagueTx
                      .filter((tx: any) => tx.type === 'withdrawal' && (tx.title.includes('استثمار') || tx.title.includes('مشروع')))
                      .reduce((sum: number, tx: any) => sum + tx.amount, 0);
                    const investmentScore = league.bases?.includes('الاستثمار')
                      ? Math.min(50, Math.round((investmentAmount / baseAllowance) * 50))
                      : 0;

                    const donationAmount = currentLeagueTx
                      .filter((tx: any) => tx.type === 'withdrawal' && tx.title.includes('تبرع'))
                      .reduce((sum: number, tx: any) => sum + tx.amount, 0);
                    const donationScore = league.bases?.includes('التبرع')
                      ? Math.min(50, Math.round((donationAmount / baseAllowance) * 50))
                      : 0;

                    const totalTasks = currentLeagueTasks.length;
                    const approvedTasks = currentLeagueTasks.filter((t: any) => t.status === 'approved').length;
                    const tasksScore = league.bases?.includes('إنجاز المهام') && totalTasks > 0
                      ? Math.min(100, Math.round((approvedTasks / totalTasks) * 100))
                      : 0;

                    const spendingScores = league.allowances?.spendingScores || {};
                    const spendingScore = league.bases?.includes('إدارة المصروف')
                      ? (spendingScores[kid.id] || spendingScores[kid.name] || 0)
                      : 0;

                    const totalPoints = savingsScore + investmentScore + donationScore + tasksScore + spendingScore;

                    return {
                      savingsScore,
                      investmentScore,
                      donationScore,
                      tasksScore,
                      spendingScore,
                      totalPoints
                    };
                  };

                  const pastLeaderboard = kids.map(k => ({
                    kid: k,
                    scores: calculatePastLeagueKidScores(k, selectedPastLeague)
                  })).sort((a, b) => b.scores.totalPoints - a.scores.totalPoints);

                  if (pastLeaderboard.length === 0) return null;
                  const winnerName = pastLeaderboard[0].kid.name;

                  return (
                    <div className="space-y-3">
                      <div className="bg-yellow-500/10 border border-yellow-500/25 p-3 rounded-2xl text-center">
                        <span className="text-[10px] text-slate-400 block">الفائز بالدوري:</span>
                        <span className="text-sm font-black text-yellow-300">👑 {winnerName} 👑</span>
                      </div>

                      <div className="space-y-2">
                        {pastLeaderboard.map((item, idx) => (
                          <div key={item.kid.id} className="bg-[#111C2E]/80 border border-white/5 p-3 rounded-xl space-y-2">
                            <div className="flex justify-between items-center flex-row-reverse text-xs">
                              <span className="font-extrabold text-white">{idx + 1}. {item.kid.name}</span>
                              <span className="text-orange-300 font-sans font-bold">{item.scores.totalPoints} نقطة</span>
                            </div>
                            <div className="grid grid-cols-5 gap-1 text-[9px] text-center text-slate-400 font-sans">
                              <div className="bg-white/5 p-1 rounded">
                                <span>ادخار: {item.scores.savingsScore}</span>
                              </div>
                              <div className="bg-white/5 p-1 rounded">
                                <span>استثمار: {item.scores.investmentScore}</span>
                              </div>
                              <div className="bg-white/5 p-1 rounded">
                                <span>تبرع: {item.scores.donationScore}</span>
                              </div>
                              <div className="bg-white/5 p-1 rounded">
                                <span>مهام: {item.scores.tasksScore}</span>
                              </div>
                              <div className="bg-white/5 p-1 rounded">
                                <span>مصروف: {item.scores.spendingScore}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="space-y-2 border-t border-white/5 pt-3 mt-3">
                <span className="font-bold text-white block mb-1">المصروفات الموزعة للأبناء:</span>
                {Object.entries(selectedPastLeague.allowances || {}).map(([kidId, amount]) => {
                  if (kidId === 'spendingScores') return null; // skip spendingScores metadata
                  const kidObj = kids.find(k => k.id === kidId);
                  return (
                    <div key={kidId} className="flex justify-between flex-row-reverse bg-white/5 p-2 rounded-xl text-[11px]">
                      <span className="text-slate-350 font-bold">{kidObj ? kidObj.name : 'ابن'}</span>
                      <span className="text-white font-sans font-bold">{amount as number} ريال</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedPastLeague(null)}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-[#8c7355] hover:from-orange-600 hover:to-[#9c8466] text-white rounded-xl text-xs font-black transition-all shadow-lg active:scale-95"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
