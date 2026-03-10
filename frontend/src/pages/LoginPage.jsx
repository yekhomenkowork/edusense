import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // ТИМЧАСОВА ЛОГІКА ДЛЯ ТЕСТУВАННЯ РОЛЕЙ (Mock Auth)
    let role = 'staff';
    let name = 'Охоронець / Працівник';

    if (email.includes('sys')) {
      role = 'system_admin';
      name = 'Головний Адміністратор';
    } else if (email.includes('school')) {
      role = 'school_admin';
      name = 'Директор Школи №1';
    }

    // Зберігаємо юзера в глобальний стейт і кидаємо на дашборд
    login({ id: 1, name, email, role, schoolId: role === 'system_admin' ? null : 101 });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center relative overflow-hidden font-sans">
      {/* Декоративне світіння */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="flex flex-col items-center mb-10">
          <a href="/" className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] mb-6 hover:scale-105 transition-transform">
            <Activity size={24} className="text-white" />
          </a>
          <h1 className="text-3xl font-bold text-white mb-2">Вхід у систему</h1>
          <p className="text-gray-400 text-center">Керування екосистемою EduSense</p>
        </div>

        {/* Підказка для тебе */}
        <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
          <span className="font-bold text-blue-400 block mb-1">Тестові акаунти (введи будь-який пароль):</span>
          • sys@admin.com (Головний адмін)<br/>
          • school@admin.com (Адмін школи)<br/>
          • staff@school.com (Охорона)
        </div>

        <form onSubmit={handleLogin} className="space-y-5 bg-[#121214]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Електронна пошта</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="admin@school.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] mt-4">
            Увійти <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
