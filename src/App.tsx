import { useState } from 'react';
import { mockFamilyData } from './data/mockData';
import KidDashboard from './pages/KidDashboard';
import FatherDashboard from './pages/FatherDashboard';

function App() {
  const [activeTab, setActiveTab] = useState<'kids' | 'father'>('kids');
  const [khalid, salem] = mockFamilyData.kids;

  return (
    <div className="bg-[#0B1727] relative overflow-hidden min-h-screen px-4 py-10 font-sans text-slate-100 flex flex-col items-center">
      {/* Dynamic Alinma Diagonal Stripes */}
      <div className="absolute -top-40 left-0 w-full h-[60vh] bg-gradient-to-r from-orange-400/40 to-rose-500/20 transform -skew-y-12 scale-150 pointer-events-none z-0 origin-top-left"></div>
      <div className="absolute -top-20 left-0 w-full h-[40vh] bg-white/5 transform -skew-y-12 scale-150 pointer-events-none z-0 origin-top-left"></div>

      {/* App Content wrapper to stay above background elements */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">
        {/* App Main Header */}
        <header className="mb-8 text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
            تطبيق نماء العائلي 🍃
          </h1>
          <p className="text-sm text-slate-300">
            منصة الادخار والقلعة الافتراضية الذكية للأطفال
          </p>
        </header>

        {/* Tab Navigation Bar */}
        <div className="mb-10 bg-white/5 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl flex gap-2 relative z-20 w-full max-w-md">
          <button
            onClick={() => setActiveTab('father')}
            className={`flex-1 text-center py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === 'father'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            واجهة الأب 👤
          </button>
          <button
            onClick={() => setActiveTab('kids')}
            className={`flex-1 text-center py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === 'kids'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            واجهة الأبناء 👥
          </button>
        </div>

        {/* Conditional Dashboard Rendering */}
        <main className="w-full px-4">
          {activeTab === 'kids' ? (
            /* Kids Dashboards Grid */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 justify-center items-start">
              {/* Khalid's Dashboard */}
              <div className="w-full">
                <div className="mb-3 text-center lg:text-right">
                  <span className="inline-flex items-center rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-xs text-orange-400 font-semibold">
                    الحساب الأول 👤
                  </span>
                </div>
                <KidDashboard kid={khalid} />
              </div>

              {/* Salem's Dashboard */}
              <div className="w-full">
                <div className="mb-3 text-center lg:text-right">
                  <span className="inline-flex items-center rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs text-amber-400 font-semibold">
                    الحساب الثاني 👤
                  </span>
                </div>
                <KidDashboard kid={salem} />
              </div>
            </div>
          ) : (
            /* Father's Dashboard */
            <FatherDashboard familyData={mockFamilyData} />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} نماء - جميع الحقوق محفوظة
        </footer>
      </div>
    </div>
  );
}

export default App;
