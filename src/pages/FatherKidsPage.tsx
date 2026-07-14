import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import TransferModal from '../components/ui/TransferModal';
import AssignTaskModal from '../components/ui/AssignTaskModal';

export default function FatherKidsPage() {
  const navigate = useNavigate();
  const { kids, finalizeTaskApproval } = useApp();

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKid, setSelectedKid] = useState<{ id: string; name: string } | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedKidName, setSelectedKidName] = useState<string | null>(null);

  // Month filter state (defaults to current date, July 2026)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 6, 14)); // 14 July 2026

  const openTransferModal = (id: string, name: string) => {
    setSelectedKid({ id, name });
    setIsModalOpen(true);
  };

  const openAssignTaskModal = (name: string) => {
    setSelectedKidName(name);
    setIsAssignModalOpen(true);
  };

  // Helper to format month names in Arabic
  const getMonthLabel = (date: Date) => {
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const prevMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

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
            <h2 className="text-xs font-semibold text-orange-400">لوحة التحليل المالي للأبناء</h2>
            <h3 className="text-2xl font-black text-white mt-1">تفاصيل الأبناء والتحويل الذكي 👦👧</h3>
          </div>
        </div>
      </div>

      {/* Month Filter selector UI */}
      <div className="flex justify-center items-center gap-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-full">
        <button
          type="button"
          onClick={() => setCurrentMonth(prevMonthDate)}
          className="text-slate-400 hover:text-white transition-all text-xs font-bold flex items-center gap-1 select-none font-sans"
        >
          ◀ {getMonthLabel(prevMonthDate)}
        </button>
        <span className="text-xs font-black text-orange-400 bg-orange-500/10 px-4 py-2 rounded-xl border border-orange-500/20 select-none font-sans">
          {getMonthLabel(currentMonth)}
        </span>
        <button
          type="button"
          onClick={() => setCurrentMonth(nextMonthDate)}
          className="text-slate-400 hover:text-white transition-all text-xs font-bold flex items-center gap-1 select-none font-sans"
        >
          {getMonthLabel(nextMonthDate)} ▶
        </button>
      </div>

      {/* Grid of Detailed Kids Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kids.map((kid) => {
          // 1. Filter transactions to current month & sort Descending
          const filteredTransactions = (kid.transactions || []).filter((tx) => {
            const txDate = new Date(tx.date);
            return txDate.getFullYear() === currentMonth.getFullYear() && txDate.getMonth() === currentMonth.getMonth();
          }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          // 2. Filter tasks to current month & sort Descending
          const filteredTasks = (kid.tasks || []).filter((task) => {
            const taskDate = task.createdAt ? new Date(task.createdAt) : new Date();
            return taskDate.getFullYear() === currentMonth.getFullYear() && taskDate.getMonth() === currentMonth.getMonth();
          }).sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });

          // 3. Compute dynamic badges
          const monthSavings = filteredTransactions
            .filter(tx => tx.type === 'withdrawal' && (tx.title.includes('إيداع في حصالة') || tx.title.includes('حصالة')))
            .reduce((sum, tx) => sum + tx.amount, 0);

          const approvedCount = filteredTasks.filter(t => t.status === 'approved').length;
          const donated = filteredTransactions.some(tx => tx.title.includes('تبرع'));

          const dynamicBadges: string[] = [];
          if (monthSavings > 0) dynamicBadges.push('🏆 بطل التوفير');
          if (approvedCount > 2) dynamicBadges.push('🎯 المنجز');
          if (donated) dynamicBadges.push('💚 المعطاء');
          if (dynamicBadges.length === 0) dynamicBadges.push('🌱 بداية واعدة');

          // 4. Compute dynamic AI rating based on savings percentage
          const monthIncome = filteredTransactions
            .filter(tx => tx.type === 'deposit')
            .reduce((sum, tx) => sum + tx.amount, 0);

          const savingsPercentage = monthIncome > 0 ? (monthSavings / monthIncome) * 100 : (monthSavings > 0 ? 100 : 0);

          let aiRatingText = '';
          let aiRatingBadge = '';
          if (monthIncome === 0 && monthSavings === 0) {
            aiRatingText = 'لم يتم تسجيل أي دخل أو ادخار للطفل في هذا الشهر للتقييم.';
            aiRatingBadge = 'لا توجد بيانات ⚡';
          } else if (savingsPercentage >= 50) {
            aiRatingText = `أداء مالي ممتاز ومبهر! لقد تمكن الطفل من ادخار ${Math.round(savingsPercentage)}% من دخل هذا الشهر. يستحق التشجيع والمكافأة! 🌟`;
            aiRatingBadge = 'أداء مالي ممتاز 🌟';
          } else if (savingsPercentage < 20) {
            aiRatingText = `نسبة الادخار منخفضة جداً (${Math.round(savingsPercentage)}%). يحتاج الطفل إلى توجيه ومساعدته في وضع أهداف ادخارية ملموسة لمساعدته على تنظيم مصروفاته بشكل أفضل. ⚠️`;
            aiRatingBadge = 'يحتاج توجيه ⚠️';
          } else {
            aiRatingText = `أداء مالي معتدل ومتوازن. الطفل يوازن بنجاح بين الصرف والادخار (نسبة الادخار ${Math.round(savingsPercentage)}%) بشكل واعد ومسؤول. 👍`;
            aiRatingBadge = 'أداء مالي معتدل 👍';
          }

          return (
            <div
              key={kid.id}
              className="relative overflow-hidden bg-[#111C2E]/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-6 text-right flex flex-col justify-between gap-5 transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="absolute right-0 top-0 -z-10 h-full w-24 bg-orange-500/5 blur-xl"></div>
              
              {/* Kid Header */}
              <div className="flex flex-row-reverse items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <h4 className="font-extrabold text-base text-white">{kid.name}</h4>
                  <span className="text-[10px] text-slate-400">عمر {kid.age} سنة</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-sans">
                  {aiRatingBadge}
                </span>
              </div>

              {/* Balances */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/5 border border-white/5 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-400 block mb-1">الرصيد المتاح</span>
                  <span className="text-lg font-extrabold text-emerald-400 font-sans">{kid.balance} ريال</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-400 block mb-1">إجمالي المدخرات</span>
                  <span className="text-lg font-extrabold text-orange-400 font-sans">{kid.saved} ريال</span>
                </div>
              </div>

              {/* Badges section */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">الأوسمة والإنجازات 🎖️</span>
                <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                  {dynamicBadges.map((badge, index) => (
                    <span
                      key={index}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-white/5 border border-white/5 text-slate-200"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Rating Panel */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 text-right backdrop-blur-md">
                <span className="text-xs font-bold text-orange-400 flex items-center justify-end gap-1">
                  تقييم الذكاء الاصطناعي 🧠
                </span>
                <p className="text-[10px] leading-relaxed text-slate-300">
                  {aiRatingText}
                </p>
              </div>

              {/* Smart Actions */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <button
                  type="button"
                  onClick={() => openTransferModal(kid.id, kid.name)}
                  className="w-full bg-gradient-to-r from-orange-500 to-[#8c7355] hover:from-orange-600 hover:to-[#9c8466] text-white font-extrabold py-2.5 rounded-xl text-xs transition-all duration-300 transform active:scale-95 shadow-md flex items-center justify-center gap-1"
                >
                  <span>تحويل مالي ذكي 💸</span>
                </button>
                <button
                  type="button"
                  onClick={() => openAssignTaskModal(kid.name)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-2.5 rounded-xl text-xs transition-all duration-300 transform active:scale-95 shadow-md flex items-center justify-center gap-1"
                >
                  <span>تخصيص مهمة 🎯</span>
                </button>
              </div>

              {/* a) جدول المهام والمسؤوليات للشهر 📋 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-slate-300">جدول المهام والمسؤوليات للشهر 📋</span>
                </div>
                {filteredTasks.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {filteredTasks.map((task) => {
                      const isUnderReview = task.status === 'under_review';
                      const isApproved = task.status === 'approved';
                      const isPending = task.status === 'pending';
                      const isFailed = task.status === 'failed' || task.status === 'expired';

                      return (
                        <div key={task.id} className="bg-white/5 border border-white/5 p-3 rounded-xl space-y-2 text-right">
                          <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-1.5">
                              {isApproved && (
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                                  تمت الموافقة ✅
                                </span>
                              )}
                              {isUnderReview && (
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 animate-pulse font-sans">
                                  قيد المراجعة ⏳
                                </span>
                              )}
                              {isPending && (
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-500/20 text-slate-300">
                                  معلقة 🧹
                                </span>
                              )}
                              {isFailed && (
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-sans">
                                  غير منجز ❌
                                </span>
                              )}
                            </div>
                            <span className="font-extrabold text-white text-[11px]">{task.title}</span>
                          </div>
                          
                          <div className="flex justify-between items-center text-[10px] text-slate-400">
                            <span className="font-bold text-orange-400 font-sans">
                              {task.rewardType === 'custom'
                                ? task.customReward || 'جائزة مخصصة 🎁'
                                : `${task.rewardAmount} ${task.rewardType === 'cash' ? 'ريال 💸' : 'نقطة 🌟'}`}
                            </span>
                            <span>المكافأة:</span>
                          </div>

                          {isUnderReview && (
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await finalizeTaskApproval(task.id);
                                } catch (err) {
                                  console.error('Error finalizing approval:', err);
                                }
                              }}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-1.5 rounded-lg text-[9px] transition-all transform active:scale-95 flex items-center justify-center gap-1 shadow-md"
                            >
                              <span>موافقة ومنح المكافأة ✅</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-[10px] text-slate-500 py-2">
                    لا توجد مهام مسجلة لهذا الشهر.
                  </div>
                )}
              </div>

              {/* b) سجل العمليات المالي للشهر 📜 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-slate-300">سجل العمليات المالي للشهر 📜</span>
                </div>
                {filteredTransactions.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {filteredTransactions.map((tx) => {
                      const isDeposit = tx.type === 'deposit';
                      return (
                        <div
                          key={tx.id}
                          className="bg-white/5 border border-white/5 p-2 rounded-xl flex justify-between items-center text-xs hover:bg-white/10 transition-all duration-300"
                        >
                          {/* Left: Amount */}
                          <div className={`font-bold font-sans text-[11px] ${isDeposit ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isDeposit ? '+' : '-'} {tx.amount} ريال
                          </div>
                          {/* Right: Title & Date */}
                          <div className="text-right space-y-0.5">
                            <h5 className="font-bold text-[11px] text-white leading-tight">{tx.title}</h5>
                            <span className="text-[9px] text-slate-500 font-sans block">
                              {new Date(tx.date).toLocaleString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-[10px] text-slate-500 py-2">
                    لا توجد عمليات مالية مسجلة في هذا الشهر.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Render Smart Transfer Modal */}
      {selectedKid && (
        <TransferModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedKid(null);
          }}
          kidId={selectedKid.id}
          kidName={selectedKid.name}
        />
      )}

      {/* Render Assign Task Modal */}
      {selectedKidName && (
        <AssignTaskModal
          isOpen={isAssignModalOpen}
          onClose={() => {
            setIsAssignModalOpen(false);
            setSelectedKidName(null);
          }}
          kidName={selectedKidName}
        />
      )}
    </div>
  );
}
