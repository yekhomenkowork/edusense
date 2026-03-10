import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function DemoPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Демонстраційна логіка (Mock Auth)
    let role = 'staff';
    let name = 'Охоронець / Працівник';

    if (email.includes('sys')) {
      role = 'system_admin';
      name = 'Головний Адміністратор';
    } else if (email.includes('school')) {
      role = 'school_admin';
      name = 'Директор Школи №1';
    }

    login({ id: 1, name, email, role, schoolId: role === 'system_admin' ? null : 101 });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <a href="/" className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] mb-6 hover:scale-105 transition-transform">
            <Sparkles size={24} className="text-white" />
          </a>
          <h1 className="text-3xl font-bold text-white mb-2">Демо-доступ</h1>
          <p className="text-gray-400 text-center">Протестуйте інтерфейс з різними правами</p>
        </div>

        <div className="mb-6 p-5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-sm text-purple-200">
          <span className="font-bold text-purple-400 block mb-2">Оберіть роль (пароль будь-який):</span>
          <ul className="space-y-2 opacity-80 cursor-pointer">
            <li onClick={() => setEmail('sys@admin.com')} className="hover:text-white transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>sys@admin.com <span className="text-xs opacity-50">(Sys Admin)</span></li>
            <li onClick={() => setEmail('school@admin.com')} className="hover:text-white transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>school@admin.com <span className="text-xs opacity-50">(School Admin)</span></li>
            <li onClick={() => setEmail('staff@school.com')} className="hover:text-white transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>staff@school.com <span className="text-xs opacity-50">(Staff)</span></li>
          </ul>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 bg-[#121214]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl">
          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder="Email для демо" />
            </div>
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder="Будь-який пароль" />
            </div>
          </div>
          <button type="submit" className="w-full py-3.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] mt-4">
            Увійти в Демо <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
