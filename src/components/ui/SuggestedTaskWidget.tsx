import { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface SuggestedTaskWidgetProps {
  kidName: string;
  title: string;
  suggestedAmount: number;
  type: 'cash' | 'points';
  reasoning: string;
}

export default function SuggestedTaskWidget({
  kidName,
  title,
  suggestedAmount,
  type,
  reasoning
}: SuggestedTaskWidgetProps) {
  const { assignManualTask } = useApp();
  const [status, setStatus] = useState<'idle' | 'approved' | 'rejected'>('idle');

  const handleApprove = async () => {
    try {
      await assignManualTask(
        kidName,
        title,
        suggestedAmount,
        type === 'cash' ? 'cash' : 'points'
      );
      setStatus('approved');
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = () => {
    setStatus('rejected');
  };

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 shadow-lg backdrop-blur-md text-right font-sans my-2">
      {/* Widget Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#8c7355]/30 text-orange-300">
          توصية ذكية 🤖
        </span>
        <h4 className="text-xs font-bold text-white">اقتراح مهمة لـ {kidName} 🎯</h4>
      </div>

      {/* Task Content */}
      <div className="space-y-2 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 block">المهمة المقترحة</span>
          <span className="font-extrabold text-white">{title}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
            <span className="text-[9px] text-slate-400 block">المكافأة</span>
            <span className="font-bold text-orange-400 font-sans">
              {suggestedAmount} {type === 'cash' ? 'ريال 💸' : 'نقطة 🌟'}
            </span>
          </div>
          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
            <span className="text-[9px] text-slate-400 block">النوع</span>
            <span className="font-bold text-slate-200">
              {type === 'cash' ? 'نقدية 💵' : 'نقاط تحفيزية 🏆'}
            </span>
          </div>
        </div>

        <div className="bg-[#111C2E]/40 p-2.5 rounded-xl border border-white/5 text-[10px] leading-relaxed text-slate-300">
          <span className="font-bold text-orange-300 block mb-0.5">لماذا تم الاقتراح؟</span>
          {reasoning}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end pt-2 border-t border-white/5">
        {status === 'idle' ? (
          <>
            <button
              type="button"
              onClick={handleReject}
              className="px-3 py-1.5 border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 rounded-lg text-[10px] font-bold transition-all active:scale-95"
            >
              تعديل/رفض ❌
            </button>
            <button
              type="button"
              onClick={handleApprove}
              className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-[10px] font-bold transition-all active:scale-95 shadow-md"
            >
              اعتماد المهمة 🎯
            </button>
          </>
        ) : status === 'approved' ? (
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 w-full text-center">
            تم اعتماد المهمة وإسنادها للطفل بنجاح! ✅
          </span>
        ) : (
          <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 w-full text-center">
            تم رفض اقتراح المهمة. ❌
          </span>
        )}
      </div>
    </div>
  );
}
