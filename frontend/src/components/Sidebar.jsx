import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Mic2, ShieldAlert, Users, 
  Settings, LogOut, Activity, ChevronLeft, ChevronRight, HardDrive,
  Building2, CreditCard, Code, Shield, Bell
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  let menuItems = [];

  // Динамічні пункти меню
  if (user?.role === 'sysadmin') {
    menuItems = [
      { id: 'schools', icon: Building2, label: 'Управління школами', path: '/dashboard/schools' },
      { id: 'billing', icon: CreditCard, label: 'Білінг та Тарифи', path: '/dashboard/billing' },
      { id: 'api', icon: Code, label: 'API Інтеграції', path: '/dashboard/api' },
      { id: 'settings', icon: Settings, label: 'Системні налаштування', path: '/dashboard/settings' },
    ];
  } else if (user?.role === 'staff') {
    menuItems = [
      { id: 'guard', icon: Shield, label: 'Пост охорони', path: '/dashboard/guard' },
      { id: 'alert', icon: Bell, label: 'Тривога', path: '/dashboard/alert' },
    ];
  } else {
    menuItems = [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Дашборд школи', path: '/dashboard' },
      { id: 'audio', icon: Mic2, label: 'Аудіо-Хаб та Розклад', path: '/dashboard/audio' },
      { id: 'security', icon: ShieldAlert, label: 'Сценарії безпеки', path: '/dashboard/security' },
      { id: 'staff', icon: Users, label: 'Персонал', path: '/dashboard/staff' },
      { id: 'devices', icon: Settings, label: 'Налаштування пристроїв', path: '/dashboard/devices' },
    ];
  }

  // Розумний вихід
  const handleLogout = () => {
    // Перевіряємо, чи це демо-акаунт (за email)
    const isDemoSession = user?.email?.startsWith('demo_');
    logout();
    
    if (isDemoSession) {
      navigate('/demo');
    } else {
      navigate('/login');
    }
  };

  const getRoleDisplayName = (role) => {
    if (role === 'sysadmin') return 'System Admin';
    if (role === 'staff') return 'Security Staff';
    return 'School Admin';
  };

  return (
    <aside className={`bg-[#09090b] border-r border-white/5 transition-all duration-300 flex flex-col relative z-50 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-blue-600 rounded-full p-1 text-white border border-[#09090b] hover:bg-blue-500 transition-colors shadow-lg"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Логотип як кнопка "На головну" */}
      <div 
        onClick={() => navigate('/')}
        className={`p-6 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity ${isCollapsed ? 'justify-center' : ''}`}
        title="Повернутися на головну сторінку"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          <Activity size={18} className="text-white" />
        </div>
        {!isCollapsed && <span className="text-xl font-bold text-white tracking-tight">EduSense</span>}
      </div>

      {/* Блок профілю в оригінальному стилі */}
      {!isCollapsed && (
        <div className="px-4 mb-8 mt-2">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Профіль</p>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <p className="text-blue-400 font-bold text-sm truncate">{user?.name || 'Користувач'}</p>
            <p className="text-[10px] text-gray-500 uppercase mt-1">{getRoleDisplayName(user?.role)}</p>
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname === '/dashboard' && item.path === '/dashboard/schools' && user?.role === 'sysadmin');
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all group ${
                isActive ? 'bg-blue-600/10 text-blue-400' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <item.icon size={20} className={isActive ? 'text-blue-500' : 'group-hover:text-gray-300'} />
              {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
              
              {/* Синя крапка для активного меню */}
              {isActive && !isCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-4">
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 p-3.5 text-red-500/70 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all ${isCollapsed ? 'justify-center' : ''}`}
          title="Вийти"
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-bold text-sm">Вийти</span>}
        </button>
        
        {/* Блок автора */}
        {!isCollapsed && (
          <div className="bg-black/40 p-3 rounded-xl border border-white/5">
            <p className="text-[9px] text-gray-600 uppercase text-center leading-relaxed">
              Автор ідеї та прототипу:<br/>
              <span className="text-gray-400 font-medium">Yevhenii Khomenko</span>
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
