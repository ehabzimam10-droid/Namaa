import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { donationCauses } from '../data/mockData';

export default function KidDonationsPage() {
  const navigate = useNavigate();
  const { kids, profile, addDonation } = useApp();

  // Find current active kid
  const kid = kids.find((k) => k.name === profile?.name) || kids.find((k) => k.name === 'سالم') || kids[0];

  // States for donation amounts per cause ID
  const [amounts, setAmounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  const handleDonate = (causeId: number, causeTitle: string) => {
    const amount = amounts[causeId] || 0;
    if (amount <= 0 || amount > kid.balance) return;

    setLoading((prev) => ({ ...prev, [causeId]: true }));

    // Simulate 800ms premium loading delay
    setTimeout(async () => {
      await addDonation(kid.id, amount);
      setAmounts((prev) => ({ ...prev, [causeId]: 0 }));
      setLoading((prev) => ({ ...prev, [causeId]: false }));
      alert(`شكراً لمساهمتك الكريمة بقيمة ${amount} ريال في مبادرة "${causeTitle}"! 💚🤲`);
    }, 800);
  };

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
            <h3 className="text-2xl font-black text-white mt-1">بوابة التبرعات العائلية 🤲</h3>
          </div>
        </div>
      </div>

      {/* Balance Summary Banner */}
      <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 p-4 rounded-2xl text-xs">
        <div className="flex items-center gap-1 font-bold text-sm">
          <span>{kid.balance}</span>
          <span>ريال</span>
        </div>
        <strong>رصيدك المتاح للتبرع:</strong>
      </div>

      {/* Grid of Donation Causes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {donationCauses.map((cause) => {
          const customAmount = amounts[cause.id] || 0;
          const isCauseLoading = loading[cause.id] || false;
          const isInsufficient = customAmount > kid.balance;
          const isZeroOrNegative = customAmount <= 0;
          const isDisabled = isZeroOrNegative || isInsufficient || isCauseLoading || kid.balance === 0;

          return (
            <div
              key={cause.id}
              className="relative overflow-hidden bg-[#111C2E]/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-5 text-right flex flex-col justify-between gap-4 transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="absolute left-0 top-0 -z-10 h-full w-24 bg-emerald-500/5 blur-xl"></div>
              
              {/* Cause Info */}
              <div className="border-b border-white/5 pb-3 flex justify-between items-center">
                <span className="text-2xl">💚</span>
                <h4 className="font-bold text-sm text-white">{cause.title}</h4>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                ساهم في هذه المبادرة الإنسانية لمساعدة الآخرين وكسب نقاط تبرع لرفع ترتيبك العائلي!
              </p>

              {/* Input and Action Button */}
              <div className="space-y-3 pt-2">
                <input
                  type="number"
                  min="1"
                  max={kid.balance}
                  disabled={kid.balance === 0}
                  value={customAmount === 0 ? '' : customAmount}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : Number(e.target.value);
                    setAmounts((prev) => ({ ...prev, [cause.id]: val }));
                  }}
                  placeholder={kid.balance === 0 ? 'رصيدك فارغ 🚫' : 'المبلغ بالريال...'}
                  className={`w-full bg-[#111C2E]/80 border border-white/10 rounded-xl px-3 py-2 text-left text-white text-xs outline-none placeholder:text-slate-700 transition-all ${
                    kid.balance === 0 ? 'opacity-40 cursor-not-allowed' : 'focus:border-emerald-500'
                  }`}
                />

                <button
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleDonate(cause.id, cause.title)}
                  className={`w-full text-white text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                    kid.balance === 0 || isInsufficient
                      ? 'bg-slate-600 opacity-40 cursor-not-allowed active:scale-100'
                      : isZeroOrNegative || isCauseLoading
                        ? 'bg-emerald-600 opacity-40 cursor-not-allowed active:scale-100'
                        : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md'
                  }`}
                >
                  {isCauseLoading ? (
                    <span className="flex items-center gap-1">
                      <span className="animate-spin">⏳</span> جاري التبرع...
                    </span>
                  ) : kid.balance === 0 || isInsufficient ? (
                    <span>الرصيد غير كافٍ 🚫</span>
                  ) : (
                    <span>تبرع للمبادرة 🤲</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
