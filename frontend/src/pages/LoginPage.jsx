import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password, rememberMe);
    } catch (err) {
      setError(err.message || 'Невірний логін або пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] mb-6">
            <Activity size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 text-center">EduSense</h1>
          <p className="text-gray-400 text-center text-sm">Введіть дані для входу в систему</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 bg-[#121214]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm animate-in fade-in duration-300">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Електронна пошта</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                id="email"
                name="email"
                type="email" 
                autoComplete="username"
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-all" 
                placeholder="name@school.com" 
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                id="password"
                name="password"
                type="password" 
                autoComplete="current-password"
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-all" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-white/20 bg-white/5 group-hover:border-white/40'}`}>
                  {rememberMe && <CheckCircle2 size={14} className="text-white" />}
                </div>
              </div>
              <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Запам'ятати мене</span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] mt-2 disabled:opacity-50"
          >
            {loading ? 'Вхід...' : 'Увійти'} <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
