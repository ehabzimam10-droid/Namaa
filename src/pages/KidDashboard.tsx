import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DynamicCarousel from '../components/ui/DynamicCarousel';
import { donationCauses } from '../data/mockData';

export default function KidDashboard() {
  const { kids, profile, projects } = useApp();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const REMINDER_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours

    // Trigger immediately after 5 seconds for demonstration purposes
    const demoTimeout = setTimeout(() => {
      setToast('تذكير: هل تفكر في التبرع اليوم لمساعدة الآخرين؟ 💚');
    }, 5000);

    const interval = setInterval(() => {
      setToast('تذكير: هل تفكر في التبرع اليوم لمساعدة الآخرين؟ 💚');
    }, REMINDER_INTERVAL);

    return () => {
      clearTimeout(demoTimeout);
      clearInterval(interval);
    };
  }, []);

  const kid = kids.find(k => k.name === profile?.name) || kids.find(k => k.name === 'سالم') || kids[0];
  const totalTarget = (kid.savingsGoals || []).reduce((sum, g) => sum + g.targetAmount, 0);
  const progressPercentage = totalTarget > 0 ? Math.min(100, Math.round((kid.saved / totalTarget) * 100)) : 0;
  const isThriving = kid.saved > 0;

  return (
    <div className="w-full space-y-8 text-right font-sans">
      {/* Header Profile Summary */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-amber-600 px-6 py-6 rounded-3xl border border-white/10 shadow-2xl text-white">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-450 opacity-20 blur-xl"></div>
        <div className="flex justify-between items-center">
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold backdrop-blur-md text-white">
            العمر: {kid.age} سنوات
          </span>
          <h2 className="text-xl font-black text-white">لوحة تحكم {kid.name} 👦</h2>
        </div>
      </div>

      {/* Grid of 6 Glassmorphism Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Card 1: القرية (Preview Castle) */}
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-5 flex flex-col justify-between transition-all hover:scale-[1.01] duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-15">🏰</div>
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 border-b border-white/5 pb-2">
              <h4 className="text-sm font-bold text-white">قلعتك الافتراضية</h4>
              <span className="text-base">🏰</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className={`px-2.5 py-0.5 rounded-full font-bold ${isThriving ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {isThriving ? 'مزدهرة ✨' : 'بسيطة 🛖'}
              </span>
              <span className="font-extrabold text-white">{isThriving ? 'Thriving Castle 🏰' : 'Basic Castle 🛖'}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isThriving
                ? 'قلعتك مزدهرة وتنبض بالحياة لأنك قمت بادخار مبالغ رائعة في حصالتك! ✨'
                : 'قلعتك بحاجة لادخار المزيد من المبالغ في حصالتك لتنمو وتتحول إلى قلعة ذهبية! 🏰'}
            </p>
          </div>

          <div className="mt-4">
            <div className="h-2 w-full rounded-full bg-slate-800/60 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${isThriving ? 'from-emerald-500 to-teal-400' : 'from-amber-600 to-amber-450'}`}
                style={{ width: `${progressPercentage || (kid.saved > 0 ? 100 : 0)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 2: الحصالة (Savings) */}
        <Link to="/kid/savings" className="block relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-5 flex flex-col justify-between transition-all hover:scale-[1.02] hover:border-orange-500/30 duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-15">💰</div>
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 border-b border-white/5 pb-2">
              <h4 className="text-sm font-bold text-white">الحصالة الذكية</h4>
              <span className="text-base">💰</span>
            </div>

            <div className="text-right pb-2">
              <span className="text-[10px] text-slate-400 block">إجمالي المدخرات الحالية</span>
              <span className="text-3xl font-extrabold text-white block mt-0.5">
                {kid.saved} <span className="text-sm font-bold text-orange-400">ريال</span>
              </span>
            </div>
          </div>
        </Link>

        {/* Card 3: الاستثمار العائلي */}
        <Link to="/kid/investments" className="block relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-5 flex flex-col justify-between transition-all hover:scale-[1.02] hover:border-orange-500/30 duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-15">📈</div>
          <div className="space-y-3 w-full">
            <div className="flex items-center justify-end gap-2 border-b border-white/5 pb-2">
              <h4 className="text-sm font-bold text-white">الاستثمار العائلي</h4>
              <span className="text-base">📈</span>
            </div>

            <DynamicCarousel
              items={projects}
              renderItem={(project) => {
                const percentage = Math.min(Math.round((project.currentInvested / project.totalRequired) * 100), 100);
                return (
                  <div className="w-full text-right space-y-2 px-1">
                    <h5 className="font-bold text-xs text-white">{project.title}</h5>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-sans">
                      <span>{percentage}% مكتمل</span>
                      <span>ROI: {project.roiPercentage}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800/60 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-l from-[#8c7355] to-[#009639]"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              }}
            />
          </div>
        </Link>

        {/* Card 4: التبرع */}
        <Link to="/kid/donations" className="block relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-5 flex flex-col justify-between transition-all hover:scale-[1.02] hover:border-orange-500/30 duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-15">🤲</div>
          <div className="space-y-3 w-full">
            <div className="flex items-center justify-end gap-2 border-b border-white/5 pb-2">
              <h4 className="text-sm font-bold text-emerald-400">التبرع والمسؤولية</h4>
              <span className="text-base">💚</span>
            </div>

            <DynamicCarousel
              items={donationCauses}
              renderItem={(cause) => (
                <div className="w-full text-center py-2 space-y-1">
                  <h5 className="font-bold text-xs text-white">{cause.title}</h5>
                  <p className="text-[10px] text-slate-400">اضغط للمساهمة والتبرع 🤲</p>
                </div>
              )}
            />
          </div>
        </Link>

        {/* Card 5: نقاط دوري العائلة (Hidden/Blind state) */}
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-5 flex flex-col justify-between transition-all hover:scale-[1.01] duration-300 group">
          {/* Blurred Locked Overlay to act as blind/hidden state */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center text-center p-4">
            <span className="text-2xl mb-1">🔒</span>
            <span className="text-xs font-bold text-white">قريباً: دوري نماء العائلي</span>
            <span className="text-[9px] text-slate-400 mt-1">قارن تقدمك ونقاط التوفير مع عائلتك وأصدقائك!</span>
          </div>

          <div className="space-y-3 opacity-30 select-none pointer-events-none">
            <div className="flex items-center justify-end gap-2 border-b border-white/5 pb-2">
              <h4 className="text-sm font-bold text-white">نقاط دوري العائلة</h4>
              <span className="text-base">🏆</span>
            </div>
            <p className="text-xs leading-relaxed">
              ترتيبك الحالي ونقاط المنافسة مع بقية عوائل نماء.
            </p>
          </div>
        </div>

        {/* Card 6: المهام */}
        <Link to="/kid/tasks" className="block relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-5 flex flex-col justify-between transition-all hover:scale-[1.02] hover:border-orange-500/30 duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-15">🧹</div>
          <div className="space-y-3 w-full">
            <div className="flex items-center justify-end gap-2 border-b border-white/5 pb-2">
              <h4 className="text-sm font-bold text-white">المهام والمسؤوليات</h4>
              <span className="text-base">🧹</span>
            </div>

            <DynamicCarousel
              items={[...(kid.tasks || [])].sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
              })}
              renderItem={(task) => (
                <div className="w-full text-right px-1 flex justify-between items-center text-xs">
                  <span className={`text-[9px] px-2 py-0.5 rounded-md ${
                    task.status === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : task.status === 'under_review'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {task.status === 'approved' ? 'مكتملة ✅' : task.status === 'under_review' ? 'قيد المراجعة ⏳' : 'قيد التنفيذ 🧹'}
                  </span>
                  <span className="font-bold text-white text-[11px]">{task.title}</span>
                </div>
              )}
            />
          </div>
        </Link>

      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#111C2E]/95 backdrop-blur-2xl border border-emerald-500/30 shadow-2xl rounded-2xl p-4 flex items-center gap-3 animate-fade-in text-right">
          <div className="flex-1 space-y-1">
            <h5 className="text-xs font-black text-emerald-400">تذكير المسؤولية المجتمعية 💚</h5>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">{toast}</p>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded-xl bg-white/5 border border-white/10 transition-colors"
          >
            إغلاق
          </button>
        </div>
      )}
    </div>
  );
}
