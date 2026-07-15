import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DynamicCarousel from '../components/ui/DynamicCarousel';

export default function FatherDashboard() {
  const { kids, projects, activeLeague } = useApp();

  const [countdownText, setCountdownText] = useState('');

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

  // Calculate total family balance (sum of all kids' saved amounts)
  const totalBalance = kids.reduce((sum, kid) => sum + kid.saved, 0);

  return (
    <div className="w-full space-y-8 text-right font-sans">
      {/* Header Summary */}
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 md:p-8">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl"></div>
        <div className="flex flex-col md:flex-row-reverse md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xs font-semibold text-orange-400">لوحة تحكم ولي الأمر</h2>
            <h3 className="text-2xl font-black text-white mt-1">الرئيسية 🏠</h3>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-400">إجمالي مدخرات الأبناء المشتركة</span>
            <span className="text-3xl font-extrabold text-white mt-1">
              {totalBalance} <span className="text-base font-bold text-orange-400">ريال</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 5 Glassmorphism Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: القرية الافتراضية */}
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 flex flex-col justify-between transition-all hover:scale-[1.01] duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-15">🏰</div>
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2">
              <h4 className="text-lg font-bold text-white">القرية الافتراضية</h4>
              <span className="text-xl">🏰</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              شاهد قلاع أطفالك الافتراضية وهي تنمو وتزدهر مع كل ريال يقومون بادخاره.
            </p>
            
            <div className="pt-2 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                <span className="text-slate-400 block">قلاع نشطة</span>
                <span className="text-sm font-extrabold text-orange-400 mt-1 block">{kids.length} قلاع</span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                <span className="text-slate-400 block">أعلى مستوى</span>
                <span className="text-sm font-extrabold text-emerald-400 mt-1 block">مستوى 4 🌟</span>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white font-bold py-2 rounded-xl text-xs border border-white/10 transition-all">
            استعراض القرية ➜
          </button>
        </div>

        {/* Card 2: المستشار المالي الذكي */}
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-orange-500/30 shadow-2xl rounded-3xl p-6 flex flex-col justify-between transition-all hover:scale-[1.01] duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-15">🤖</div>
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2">
              <h4 className="text-lg font-bold text-white">المستشار الذكي 🤖</h4>
              <span className="text-xl">🤖</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed text-right">
              استشارات وتوصيات ذكية مخصصة لمساعدتك في توجيه سلوك أبنائك المالي وغرس ثقافة الادخار.
            </p>
          </div>
          <Link to="/father/ai" className="w-full mt-4 bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 font-bold py-2 rounded-xl text-xs border border-orange-500/20 transition-all text-center block">
            المستشار الذكي والدردشة 🤖
          </Link>
        </div>

        {/* Card 3: إدارة الأبناء 👥 */}
        <Link to="/father/kids" className="md:col-span-2 block relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 transition-all hover:scale-[1.01] hover:border-orange-500/30 duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-10">👦</div>
          <div className="space-y-4 w-full">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs text-slate-400 font-sans">{kids.length} أبناء مسجلين</span>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-white">إدارة الأبناء 👥</h4>
                <span className="text-xl">👦👧</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kids.map((kid) => (
                <div key={kid.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col justify-between hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-bold text-slate-400">عمر {kid.age} سنة</span>
                    <span className="font-extrabold text-sm text-white">{kid.name}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-slate-300 font-sans mt-3">
                    <span>المدخرات: {kid.saved} ريال</span>
                    <span>الرصيد المتاح: {kid.balance} ريال</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Link>

        {/* Card 4: المشاريع الاستثمارية العائلية */}
        <Link to="/father/projects" className="block relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 flex flex-col justify-between transition-all hover:scale-[1.02] hover:border-orange-500/30 duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-15">📈</div>
          <div className="space-y-3 w-full">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs text-emerald-400 font-bold">{projects.length} مشاريع نشطة</span>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-white">المشاريع الاستثمارية</h4>
                <span className="text-xl">📈</span>
              </div>
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

        {/* Card 5: دوري العائلة 🏆 */}
        <Link to="/father/league" className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 flex flex-col justify-between transition-all hover:scale-[1.01] duration-300">
          <div className="absolute -left-6 -top-6 text-6xl opacity-15">🏆</div>
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2">
              <h4 className="text-lg font-bold text-white">دوري العائلة 🏆</h4>
              <span className="text-xl">🏆</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed text-right">
              تحدي وتنافس مالي وتربوي إيجابي بين الأبناء (خالد وسالم) لتعزيز ثقافة الادخار والاستثمار الذكي.
            </p>
            
            <div className="bg-white/5 p-2 rounded-xl border border-white/5 flex flex-col gap-1.5 text-xs font-sans">
              <div className="flex justify-between items-center w-full">
                <span className={activeLeague?.isActive ? "text-emerald-400 font-extrabold" : "text-orange-400 font-extrabold"}>
                  {activeLeague?.isActive ? "دوري نشط حالياً 🔥" : "ابدأ تحدي جديد الآن 🎯"}
                </span>
                <span className="text-slate-400">حالة التحدي:</span>
              </div>
              {activeLeague?.isActive && countdownText && (
                <div className="flex justify-between items-center w-full border-t border-white/5 pt-1.5 font-sans">
                  <span className="text-orange-300 font-bold">{countdownText}</span>
                  <span className="text-slate-400 text-[10px]">الوقت المتبقي:</span>
                </div>
              )}
            </div>
          </div>
          <button className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white font-bold py-2 rounded-xl text-xs border border-white/10 transition-all">
            استعراض الدوري 🏆
          </button>
        </Link>

      </div>
    </div>
  );
}
