import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#0B1727] text-slate-100 flex relative overflow-hidden font-sans">
      {/* Decorative Brand Background Lines */}
      <div className="absolute -top-40 left-0 w-full h-[60vh] bg-gradient-to-r from-orange-400/20 to-[#8c7355]/10 transform -skew-y-12 scale-150 pointer-events-none z-0 origin-top-left"></div>
      <div className="absolute -top-20 left-0 w-full h-[40vh] bg-white/2 transform -skew-y-12 scale-150 pointer-events-none z-0 origin-top-left"></div>

      {/* Sidebar (fixed/drawer) */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main dashboard wrapper (offset on desktop to match sidebar width of 64) */}
      <div className="flex-1 flex flex-col lg:pr-64 min-w-0 z-10 transition-all duration-300">
        {/* Topbar */}
        <Topbar onMenuToggle={toggleSidebar} />

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-5xl mx-auto">
          <Outlet />
        </main>

        {/* Dashboard Footer */}
        <footer className="py-6 text-center text-[10px] text-slate-600 border-t border-white/5 font-sans mt-auto">
          &copy; {new Date().getFullYear()} نماء - بوابة الحوكمة والاستثمار العائلي
        </footer>
      </div>
    </div>
  );
}
