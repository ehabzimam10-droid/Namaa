import { useApp } from '../../context/AppContext';
import { useNavigate, NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { profile, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isFather = profile?.role === 'father';

  const menuItems = isFather
    ? [
        { title: 'الرئيسية 🏠', path: '/father' },
        { title: 'إدارة الأبناء 👥', path: '/father/kids' },
        { title: 'مشاريع العائلة 📈', path: '/father/projects' },
        { title: 'المستشار الذكي 🤖', path: '/father/ai' },
      ]
    : [
        { title: 'الرئيسية 🏠', path: '/kid' },
        { title: 'الحصالة الذكية 💰', path: '/kid/savings' },
        { title: 'المهام والمسؤوليات 🧹', path: '/kid/tasks' },
        { title: 'الاستثمار العائلي 📈', path: '/kid/investments' },
        { title: 'المسؤولية المجتمعية (التبرع) 🤲', path: '/kid/donations' },
      ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 right-0 z-50 h-screen w-64 flex flex-col justify-between p-6 bg-[#111C2E]/90 backdrop-blur-2xl border-l border-white/10 text-right text-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Brand header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <button
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white text-xs bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5 transition-all"
            >
              ✕ إغلاق
            </button>
            <div className="text-right">
              <h1 className="text-xl font-black bg-gradient-to-r from-orange-400 to-[#8c7355] bg-clip-text text-transparent">
                نماء العائلي 🍃
              </h1>
              <p className="text-[10px] text-slate-400 font-sans">بوابتك للثقافة المالية الذكية</p>
            </div>
          </div>

          {/* User profile brief */}
          <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-right space-y-1">
            <span className="text-[10px] text-orange-400 font-bold block">
              {isFather ? 'ولي الأمر 👤' : 'الابن النشط 👦'}
            </span>
            <span className="font-extrabold text-sm text-white block">{profile?.name || 'مستخدم نماء'}</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {menuItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `w-full text-right px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-end gap-2 border ${
                    isActive
                      ? 'bg-white/10 text-white border-white/20'
                      : 'bg-white/0 hover:bg-white/5 text-slate-300 hover:text-white border-transparent hover:border-white/5'
                  }`
                }
              >
                <span>{item.title}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full text-center py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1 mt-auto font-sans"
        >
          <span>تسجيل الخروج ➜</span>
        </button>
      </aside>
    </>
  );
}
