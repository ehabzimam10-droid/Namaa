import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import TransferModal from '../components/ui/TransferModal';

export default function FatherKidsPage() {
  const navigate = useNavigate();
  const { kids } = useApp();

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKid, setSelectedKid] = useState<{ id: string; name: string } | null>(null);

  const openTransferModal = (id: string, name: string) => {
    setSelectedKid({ id, name });
    setIsModalOpen(true);
  };

  // Hardcoded badges & AI rating based on kids for detailed demonstration
  const getKidDetails = (name: string) => {
    if (name === 'سالم') {
      return {
        aiRating: 'أداء مالي ممتاز 🌟',
        badges: ['🏆 بطل التوفير', '🎯 المنجز', '💚 صديق البيئة'],
      };
    } else {
      return {
        aiRating: 'بداية توفير واعدة ⚡',
        badges: ['🚲 مستثمر الغد', '🌱 المبادر'],
      };
    }
  };

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

      {/* Grid of Detailed Kids Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kids.map((kid) => {
          const details = getKidDetails(kid.name);
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
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
                  {details.aiRating}
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
                  {details.badges.map((badge, index) => (
                    <span
                      key={index}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-white/5 border border-white/5 text-slate-200"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Smart Transfer Action */}
              <div className="pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => openTransferModal(kid.id, kid.name)}
                  className="w-full bg-gradient-to-r from-orange-500 to-[#8c7355] hover:from-orange-600 hover:to-[#9c8466] text-white font-extrabold py-2.5 rounded-xl text-xs transition-all duration-300 transform active:scale-95 shadow-md flex items-center justify-center gap-1"
                >
                  <span>تحويل مالي ذكي 💸</span>
                </button>
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
    </div>
  );
}
