import { mockFamilyData } from './data/mockData';
import KidDashboard from './pages/KidDashboard';

function App() {
  const [khalid, salem] = mockFamilyData.kids;

  return (
    <div className="bg-slate-950 relative overflow-hidden min-h-screen px-4 py-10 font-sans text-slate-100 flex flex-col items-center">
      {/* Ambient background orbs */}
      <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-orange-500/20 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none z-0"></div>

      {/* App Content wrapper to stay above orbs */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* App Main Header */}
        <header className="mb-10 text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
            تطبيق نماء العائلي 🍃
          </h1>
          <p className="text-sm text-slate-450 text-slate-400">
            منصة الادخار والقلعة الافتراضية الذكية للأطفال
          </p>
          <div className="inline-flex items-center rounded-full bg-white/5 backdrop-blur-md px-4 py-1.5 text-xs border border-white/10 mt-2">
            <span className="text-slate-300 font-medium">ولي الأمر المسؤول:</span>
            <span className="text-orange-450 text-orange-400 font-bold mr-1">{mockFamilyData.father.name}</span>
          </div>
        </header>

        {/* Dashboards Container */}
        <main className="w-full max-w-5xl flex flex-col md:flex-row gap-8 justify-center items-start">
          {/* Khalid's Dashboard */}
          <div className="w-full flex-1">
            <div className="mb-3 text-center md:text-right">
              <span className="inline-flex items-center rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-xs text-orange-400 font-semibold">
                الحساب الأول 👤
              </span>
            </div>
            <KidDashboard kid={khalid} />
          </div>

          {/* Salem's Dashboard */}
          <div className="w-full flex-1">
            <div className="mb-3 text-center md:text-right">
              <span className="inline-flex items-center rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs text-amber-400 font-semibold">
                الحساب الثاني 👤
              </span>
            </div>
            <KidDashboard kid={salem} />
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-xs text-slate-655 text-slate-550 text-slate-500">
          &copy; {new Date().getFullYear()} نماء - جميع الحقوق محفوظة
        </footer>
      </div>
    </div>
  );
}

export default App;
