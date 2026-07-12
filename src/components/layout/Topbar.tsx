import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import TransactionsModal from '../ui/TransactionsModal';

interface TopbarProps {
  onMenuToggle: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const navigate = useNavigate();
  const { profile, kids } = useApp();
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasSeenNotifications, setHasSeenNotifications] = useState(false);


  const isFather = profile?.role === 'father';
  const isKid = profile?.role === 'kid';

  // Find current active kid if role is kid
  const kid = isKid ? (kids.find((k) => k.name === profile?.name) || kids.find((k) => k.name === 'سالم') || kids[0]) : null;
  const balance = kid ? kid.balance : 0;

  // Build dynamic notifications list
  const notificationsList = isFather
    ? kids.flatMap((k) =>
      (k.tasks || [])
        .filter((t) => t.status === 'under_review')
        .map((t) => ({
          id: t.id,
          title: `مهمة معلقة: ${t.title} 🧹`,
          description: `بانتظار موافقة الولي للابن ${k.name} بمكافأة ${t.rewardAmount} ${t.rewardType === 'cash' ? 'ريال' : 'نقطة'}`,
          onClick: () => {
            setShowNotifications(false);
            setHasSeenNotifications(true);
            navigate('/father/kids');
          },
        }))
    )
    : isKid && kid
      ? (kid.tasks || [])
        .filter((t) => t.status === 'approved')
        .map((t) => ({
          id: t.id,
          title: `تم اعتماد المهمة: ${t.title} ✅`,
          description: `حصلت على مكافأة: ${t.rewardType === 'custom' ? (t.customReward || 'هدية عائلية 🎁') : `${t.rewardAmount} ${t.rewardType === 'cash' ? 'ريال 💸' : 'نقطة 🌟'}`}`,
          onClick: () => {
            setShowNotifications(false);
            setHasSeenNotifications(true);
          },

        }))
      : [];

  const notificationCount = hasSeenNotifications ? 0 : notificationsList.length;

  return (
    <>
      <header className="w-full h-16 px-6 bg-[#111C2E]/60 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-white relative z-30">
        {/* Left Section: Menu Toggle & Notifications */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Menu Icon (on Left) */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Notification Bell */}
          {(isFather || isKid) && (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  if (showNotifications) {
                    setHasSeenNotifications(true);
                  }
                  setShowNotifications(!showNotifications);
                }}

                className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all select-none relative active:scale-95 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-[#111C2E] animate-pulse font-sans">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Notification Floating Glassmorphism Dropdown */}
              {showNotifications && (
                <div className="absolute left-0 mt-2 w-80 bg-[#0D1527]/95 border border-white/10 shadow-2xl rounded-2xl p-4 text-right font-sans z-50 backdrop-blur-md">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNotifications(false);
                        setHasSeenNotifications(true);
                      }}
                      className="text-slate-400 hover:text-white text-xs font-bold transition-colors"
                    >
                      ✕
                    </button>
                    <h4 className="text-xs font-black text-white flex items-center gap-1">
                      <span>إشعارات نماء</span>
                      <span>🔔</span>
                    </h4>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {notificationsList.length > 0 ? (
                      notificationsList.map((notif, index) => (
                        <div
                          key={`${notif.id}_${index}`}
                          onClick={notif.onClick}
                          className="p-2.5 rounded-xl text-right cursor-pointer bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-200"
                        >
                          <div className="font-bold text-[11px] text-white leading-tight mb-1">{notif.title}</div>
                          <div className="text-[9px] text-slate-400 leading-normal">{notif.description}</div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-xs text-slate-500">
                        لا توجد إشعارات جديدة 💤
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Info & Balance (on Top Right) */}
        <div className="flex items-center gap-3 text-right">
          {/* Action buttons and badge for Kid */}
          {isKid && kid && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsTxModalOpen(true)}
                className="bg-[#8c7355]/20 hover:bg-[#8c7355]/30 border border-[#8c7355]/30 rounded-2xl px-3 py-1.5 text-xs font-bold text-orange-300 transition-all active:scale-95 shadow-md flex items-center gap-1 font-sans"
              >
                <span>سجل العمليات 📜</span>
              </button>

              <div className="bg-white/5 border border-white/10 rounded-2xl px-3 py-1.5 flex items-center gap-1.5 backdrop-blur-xl shadow-lg font-sans">
                <span className="text-[10px] text-slate-300 font-bold">الرصيد المتاح:</span>
                <span className={`text-xs font-black ${balance > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {balance} ريال 💳
                </span>
              </div>
            </div>
          )}

          <div className="space-y-0.5">
            <span className="font-extrabold text-sm block">{profile?.name || 'مستخدم نماء'}</span>
            <span className="text-[10px] text-orange-400 font-bold block">
              {isFather ? 'حساب ولي الأمر 👤' : 'حساب الابن النشط 👦'}
            </span>
          </div>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#8c7355] to-orange-500/30 border border-white/10 flex items-center justify-center text-base">
            {isFather ? '👨‍💼' : '👦'}
          </div>
        </div>
      </header>

      {/* Transactions Modal for Kids */}
      {isKid && kid && (
        <TransactionsModal
          isOpen={isTxModalOpen}
          onClose={() => setIsTxModalOpen(false)}
        />
      )}
    </>
  );
}
