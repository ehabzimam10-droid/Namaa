import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function KidTasksPage() {
  const navigate = useNavigate();
  const { kids, profile, submitTaskProof } = useApp();
  
  // Find current active kid
  const kid = kids.find((k) => k.name === profile?.name) || kids.find((k) => k.name === 'سالم') || kids[0];

  // State to simulate image upload loading spinner per task
  const [uploadLoading, setUploadLoading] = useState<Record<string, boolean>>({});

  const handleUploadProof = async (taskId: string) => {
    setUploadLoading((prev) => ({ ...prev, [taskId]: true }));
    
    // Simulate minor premium loading delay for proof upload
    setTimeout(async () => {
      await submitTaskProof(taskId);
      setUploadLoading((prev) => ({ ...prev, [taskId]: false }));
      alert('تم رفع إثبات إنجاز المهمة بنجاح وهو الآن قيد مراجعة ولي الأمر! 📸✨');
    }, 1200);
  };

  return (
    <div className="w-full space-y-8 text-right font-sans">
      {/* Header with Back Button */}
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
            <h2 className="text-xs font-semibold text-orange-400">قائمة الواجبات المنزلية والمهام</h2>
            <h3 className="text-2xl font-black text-white mt-1">المهام والمسؤوليات 🧹</h3>
          </div>
        </div>
      </div>

      {/* Info Message */}
      <div className="bg-[#8c7355]/10 border border-[#8c7355]/20 text-[#dfd5c6] p-4 rounded-2xl text-xs leading-relaxed">
        <strong>💡 كيف تنجز مهامك وتكسب المكافأة؟</strong> قم بإنجاز المهمة المطلوبة منك في المنزل، ثم اضغط على "إرفاق إثبات" 
        لرفع صورة تثبت عملك. سيراجع والداك الإثبات، وفور اعتماد المهمة ستضاف المكافأة (سواء كانت ريالاً أو نقاطاً) تلقائياً لحصالتك! 🌟
      </div>

      {/* Grid of Task Cards */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-orange-400">المهام المسندة إليك 📅</h4>

        {kid.tasks && kid.tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kid.tasks.map((task) => {
              const isLoading = uploadLoading[task.id] || false;
              
              return (
                <div
                  key={task.id}
                  className="relative overflow-hidden bg-[#111C2E]/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-5 text-right flex flex-col justify-between gap-4 transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="absolute right-0 top-0 -z-10 h-full w-24 bg-[#8c7355]/5 blur-xl"></div>

                  <div className="flex justify-between items-start border-b border-white/5 pb-3">
                    {/* Status Badge */}
                    {task.status === 'pending' && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-slate-500/20 text-slate-300">
                        معلقة ⏳
                      </span>
                    )}
                    {task.status === 'under_review' && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 animate-pulse">
                        بانتظار مراجعة الولي ⏳
                      </span>
                    )}
                    {task.status === 'approved' && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400">
                        تمت الموافقة 💰
                      </span>
                    )}

                    <h5 className="font-extrabold text-sm text-white">{task.title}</h5>
                  </div>

                  {/* Reward Detail */}
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5 text-xs">
                    <span className="font-extrabold text-white text-sm">
                      {task.rewardType === 'custom'
                        ? task.customReward || 'جائزة مخصصة 🎁'
                        : `${task.rewardAmount} ${task.rewardType === 'cash' ? 'ريال 💸' : 'نقطة 🌟'}`}
                    </span>
                    <span className="text-slate-400 font-bold">المكافأة المقررة:</span>
                  </div>

                  {/* Actions based on Status */}
                  <div className="pt-2">
                    {task.status === 'pending' && (
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleUploadProof(task.id)}
                        className="w-full bg-gradient-to-r from-[#8c7355] to-orange-500 hover:from-[#9c8466] hover:to-orange-600 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-1 focus:outline-none"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-1">
                            <span className="animate-spin">⏳</span> جاري الرفع...
                          </span>
                        ) : (
                          <span>إرفاق إثبات 📸</span>
                        )}
                      </button>
                    )}

                    {task.status === 'under_review' && (
                      <button
                        type="button"
                        disabled
                        className="w-full bg-amber-500/10 border border-amber-500/25 text-amber-400 font-bold py-2.5 rounded-xl text-xs cursor-not-allowed text-center"
                      >
                        بانتظار مراجعة الولي ⏳
                      </button>
                    )}

                    {task.status === 'approved' && (
                      <div className="w-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-bold py-2.5 rounded-xl text-xs text-center font-sans">
                        تمت الموافقة واستلام المكافأة ✅
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center text-xs text-slate-400">
            لا توجد مهام مسندة إليك حالياً. استمتع بوقتك أو اطلب من والدك تكليفك بمهمة جديدة! 🌟
          </div>
        )}
      </div>
    </div>
  );
}
