import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Shield, LayoutDashboard, Users, ArrowLeft } from 'lucide-react';

export default function DemoPage() {
  const navigate = useNavigate();

  const handleDemoLogin = (roleName, roleType) => {
    // Створюємо "фейкового" користувача з потрібною роллю
    useAuthStore.setState({
      user: {
        id: 999,
        name: roleName,
        email: `demo_${roleType}@school.com`,
        role: roleType,
        school_id: roleType === 'sysadmin' ? null : 1
      },
      token: 'demo-fake-jwt-token-12345',
      isAuthenticated: true,
      rememberMe: false
    });

    // Перекидаємо на правильний стартовий маршрут залежно від ролі
    if (roleType === 'sysadmin') {
      navigate('/dashboard/schools');
    } else if (roleType === 'staff') {
      navigate('/dashboard/guard');
    } else {
      navigate('/dashboard'); // Директор
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <button 
        onClick={() => navigate('/')} 
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-10"
      >
        <ArrowLeft size={20} /> На головну
      </button>
      
      <div className="max-w-2xl w-full text-center mb-12 relative z-10">
        <h1 className="text-4xl font-bold mb-4">Демонстраційний режим</h1>
        <p className="text-gray-400">Оберіть роль для входу в систему. Інтерфейс та меню автоматично адаптуються під ваші права доступу.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl relative z-10">
        {/* Системний Адмін */}
        <button 
          onClick={() => handleDemoLogin('Системний Адміністратор', 'sysadmin')}
          className="bg-[#121214]/80 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] hover:border-blue-500/50 hover:bg-blue-900/10 transition-all text-left group shadow-xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform">
            <Shield className="text-blue-500 w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold mb-2">СуперАдмін (SaaS)</h2>
          <p className="text-gray-400 text-sm">Керування всіма школами, білінгом та налаштуваннями платформи.</p>
        </button>

        {/* Директор */}
        <button 
          onClick={() => handleDemoLogin('Директор Гімназії', 'school_admin')}
          className="bg-[#121214]/80 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] hover:border-emerald-500/50 hover:bg-emerald-900/10 transition-all text-left group shadow-xl border-emerald-500/30"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform">
            <LayoutDashboard className="text-emerald-500 w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold mb-2">Директор Школи</h2>
          <p className="text-gray-400 text-sm">Керування мікрокліматом, розкладом, датчиками та безпекою.</p>
        </button>

        {/* Персонал */}
        <button 
          onClick={() => handleDemoLogin('Черговий Охоронець', 'staff')}
          className="bg-[#121214]/80 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] hover:border-orange-500/50 hover:bg-orange-900/10 transition-all text-left group shadow-xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 border border-orange-500/20 group-hover:scale-110 transition-transform">
            <Users className="text-orange-500 w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold mb-2">Персонал / Охорона</h2>
          <p className="text-gray-400 text-sm">Доступ до тривожної кнопки, камер та базових сповіщень.</p>
        </button>
      </div>
    </div>
  );
}
