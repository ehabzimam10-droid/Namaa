import { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  kidId: string;
  kidName: string;
}

export default function TransferModal({ isOpen, onClose, kidId, kidName }: TransferModalProps) {
  const { transferMoney } = useApp();

  const [amount, setAmount] = useState<number | ''>('');
  const [reasonCategory, setReasonCategory] = useState<'مصروف' | 'عائد مستحق' | 'جائزة' | 'أخرى'>('مصروف');
  const [customReason, setCustomReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    const finalReason = reasonCategory === 'أخرى' ? customReason.trim() || 'تحويل مخصص' : reasonCategory;

    setIsLoading(true);

    // Simulate 800ms loading delay for premium UX
    setTimeout(async () => {
      await transferMoney(kidId, Number(amount), finalReason);
      setIsLoading(false);
      // Reset state
      setAmount('');
      setReasonCategory('مصروف');
      setCustomReason('');
      onClose();
      alert(`تم تحويل مبلغ ${amount} ريال للابن ${kidName} بنجاح! 💸✨`);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0D1527]/90 border border-white/10 shadow-2xl rounded-3xl p-6 text-right font-sans overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-orange-500/10 blur-2xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold transition-colors p-1"
          >
            ✕
          </button>
          <h3 className="text-base font-black text-white">تحويل مالي ذكي إلى {kidName} 💸</h3>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount input */}
          <div className="space-y-1">
            <label className="block text-xs text-slate-400">المبلغ المراد تحويله (بالريال)</label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="مثال: 50"
              className="w-full bg-[#111C2E]/80 border border-white/10 focus:border-[#8c7355] rounded-xl px-3 py-2.5 text-left text-white text-xs outline-none transition-all placeholder:text-slate-700 font-sans"
            />
          </div>

          {/* Reason category select */}
          <div className="space-y-1">
            <label className="block text-xs text-slate-400">سبب التحويل</label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value as any)}
              className="w-full bg-[#111C2E]/80 border border-white/10 focus:border-[#8c7355] rounded-xl px-3 py-2.5 text-right text-white text-xs outline-none transition-all font-sans"
            >
              <option value="مصروف" className="bg-[#111C2E]">مصروف دوري 💸</option>
              <option value="عائد مستحق" className="bg-[#111C2E]">عائد استثمار مستحق 📈</option>
              <option value="جائزة" className="bg-[#111C2E]">جائزة / تشجيع 🏆</option>
              <option value="أخرى" className="bg-[#111C2E]">سبب آخر 🏷️</option>
            </select>
          </div>

          {/* Custom reason input (rendered only if "أخرى" is selected) */}
          {reasonCategory === 'أخرى' && (
            <div className="space-y-1 animate-slide-down">
              <label className="block text-xs text-slate-400">اكتب السبب المخصص</label>
              <input
                type="text"
                required
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="مثال: مساعدة في تنظيف الحديقة 🏡"
                className="w-full bg-[#111C2E]/80 border border-white/10 focus:border-[#8c7355] rounded-xl px-3 py-2.5 text-right text-white text-xs outline-none transition-all placeholder:text-slate-700"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-white/10 text-slate-300 hover:text-white rounded-xl text-xs hover:bg-white/5 transition-all disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-[#8c7355] hover:from-orange-600 hover:to-[#9c8466] text-white font-extrabold rounded-xl text-xs transition-all active:scale-95 shadow-md flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-1">
                  <span className="animate-spin">⏳</span> جاري التحويل...
                </span>
              ) : (
                <span>تأكيد التحويل ✔️</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
