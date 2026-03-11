import React from 'react';
import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Activity, LogOut, LayoutDashboard, Building2, Settings, ShieldAlert, Mic2, Users, BellRing, Network } from 'lucide-react';

const MENU_ITEMS = {
  system_admin: [
    { title: 'Огляд системи', path: '/dashboard', icon: <LayoutDashboard size={20}/> },
    { title: 'Управління школами', path: '/dashboard/schools', icon: <Building2 size={20}/> },
    { title: 'Підписки та Білінг', path: '/dashboard/billing', icon: <Activity size={20}/> },
    { title: 'Глобальні налаштування', path: '/dashboard/settings', icon: <Settings size={20}/> },
    { title: 'Інтеграції (API)', path: '/dashboard/api', icon: <Network size={20}/> },
  ],
  school_admin: [
    { title: 'Дашборд школи', path: '/dashboard', icon: <LayoutDashboard size={20}/> },
    { title: 'Аудіо-Хаб та Розклад', path: '/dashboard/audio', icon: <Mic2 size={20}/> },
    { title: 'Сценарії безпеки', path: '/dashboard/security', icon: <ShieldAlert size={20}/> },
    { title: 'Персонал', path: '/dashboard/staff', icon: <Users size={20}/> },
    { title: 'Налаштування пристроїв', path: '/dashboard/devices', icon: <Settings size={20}/> },
  ],
  staff: [
    { title: 'Моніторинг (Live)', path: '/dashboard', icon: <LayoutDashboard size={20}/> },
    { title: 'Панель охорони', path: '/dashboard/guard', icon: <ShieldAlert size={20}/> },
    { title: 'Ручне сповіщення', path: '/dashboard/alert', icon: <BellRing size={20}/> },
  ]
};

export default function DashboardLayout() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) return <Navigate to="/demo" replace />;

  const currentMenu = MENU_ITEMS[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/demo');
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex text-white font-sans">
      <aside className="w-72 bg-[#121214] border-r border-white/5 flex flex-col">
        <Link to="/" className="h-16 flex items-center gap-3 px-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)] group-hover:scale-105 transition-transform">
            <Activity size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight group-hover:text-blue-400 transition-colors">EduSense</span>
        </Link>
        
        <div className="p-6 pb-2 border-b border-white/5">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Профіль</div>
          <div className="font-medium text-blue-400">{user.name}</div>
          <div className="text-xs text-gray-500 mt-1 capitalize">{user.role.replace('_', ' ')}</div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {currentMenu.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/dashboard');
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                {item.icon}
                <span className="font-medium">{item.title}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-medium">
            <LogOut size={20} /> Вийти
          </button>
        </div>
        
        {/* АВТОРСЬКИЙ ПІДВАЛ */}
        <div className="pb-6 text-center px-4">
          <div className="text-[10px] text-gray-500 leading-relaxed bg-black/30 p-2 rounded-lg border border-white/5">
            Автор ідеї та прототипу:<br/>
            <span className="text-gray-400 font-bold tracking-wide">Yevhenii Khomenko</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 bg-[#121214]/80 backdrop-blur-md border-b border-white/5 flex items-center px-8 justify-between relative z-10">
          <h2 className="text-xl font-semibold text-gray-200">Панель управління</h2>
          <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-gray-300">Система активна</span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 relative z-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
