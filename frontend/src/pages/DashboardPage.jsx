import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Activity, Building2, Cpu, Wifi, Server, CheckCircle2, AlertCircle, Database } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- МОКОВІ ДАНІ ДЛЯ ГРАФІКІВ ---
const networkData = [
  { time: 'Пн', devices: 820 }, { time: 'Вв', devices: 835 },
  { time: 'Ср', devices: 840 }, { time: 'Чт', devices: 810 },
  { time: 'Пт', devices: 845 }, { time: 'Сб', devices: 420 }, // Вихідні
  { time: 'Нд', devices: 430 },
];

const componentsHealth = [
  { name: 'Core API (FastAPI)', status: 'online', uptime: '99.9%', icon: <Server size={20} /> },
  { name: 'MQTT Broker (EMQX)', status: 'online', uptime: '100%', icon: <Activity size={20} /> },
  { name: 'PostgreSQL Database', status: 'online', uptime: '99.9%', icon: <Database size={20} /> },
  { name: 'WebSocket Cluster', status: 'online', uptime: '99.8%', icon: <Wifi size={20} /> },
];

// --- ДАШБОРД ГОЛОВНОГО АДМІНА ---
const SystemAdminDashboard = ({ user }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Привітання */}
      <div className="bg-[#121214] border border-white/5 p-8 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Вітаємо, {user.name}! 👋</h1>
          <p className="text-gray-400">Глобальний моніторинг екосистеми EduSense працює в штатному режимі.</p>
        </div>
        <div className="relative z-10 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          Усі системи в нормі
        </div>
      </div>

      {/* KPI Картки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><Building2 size={100} /></div>
          <div className="text-gray-400 font-medium mb-4 flex items-center gap-2"><Building2 size={18} className="text-blue-400"/> Підключено шкіл</div>
          <div className="text-4xl font-bold text-white">12 <span className="text-sm font-normal text-emerald-400 ml-2">↑ 2 нові</span></div>
        </div>
        
        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><Cpu size={100} /></div>
          <div className="text-gray-400 font-medium mb-4 flex items-center gap-2"><Cpu size={18} className="text-purple-400"/> Активні пристрої (IoT)</div>
          <div className="text-4xl font-bold text-white flex items-baseline gap-2">
            845 <span className="text-lg font-normal text-gray-500">/ 850</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 mt-4 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full w-[99%] rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
          </div>
        </div>

        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><Activity size={100} /></div>
          <div className="text-gray-400 font-medium mb-4 flex items-center gap-2"><Activity size={18} className="text-emerald-400"/> Завантаження CPU</div>
          <div className="text-4xl font-bold text-white">24%</div>
        </div>

        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><AlertCircle size={100} /></div>
          <div className="text-gray-400 font-medium mb-4 flex items-center gap-2"><AlertCircle size={18} className="text-yellow-400"/> Сповіщення системи</div>
          <div className="text-4xl font-bold text-white">0 <span className="text-sm font-normal text-gray-500 ml-2">критичних</span></div>
        </div>
      </div>

      {/* Графіки та Стан компонентів */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Великий графік */}
        <div className="lg:col-span-2 bg-[#121214] border border-white/5 p-6 rounded-2xl">
          <h2 className="text-lg font-bold mb-6 text-white">Мережева активність пристроїв (Останні 7 днів)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={networkData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDevices" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="time" stroke="#ffffff50" tick={{fill: '#ffffff50', fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" tick={{fill: '#ffffff50', fontSize: 12}} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121214', borderColor: '#ffffff10', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="devices" name="В мережі" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorDevices)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Стан компонентів */}
        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex flex-col">
          <h2 className="text-lg font-bold mb-6 text-white">Стан ядра системи</h2>
          <div className="flex-1 space-y-4">
            {componentsHealth.map((comp, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="text-gray-400">{comp.icon}</div>
                  <div>
                    <div className="font-semibold text-sm text-gray-200">{comp.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Uptime: {comp.uptime}</div>
                  </div>
                </div>
                {comp.status === 'online' ? (
                  <CheckCircle2 className="text-emerald-500" size={20} />
                ) : (
                  <AlertCircle className="text-red-500 animate-pulse" size={20} />
                )}
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors text-white">
            Повний звіт серверу
          </button>
        </div>
      </div>
    </div>
  );
};

// --- ДАШБОРД ДИРЕКТОРА ШКОЛИ (Заглушка) ---
const SchoolAdminDashboard = ({ user }) => (
  <div className="text-center py-20 text-gray-400">
    <Building2 size={48} className="mx-auto mb-4 opacity-20" />
    <h2 className="text-2xl font-bold text-white mb-2">Дашборд Директора</h2>
    <p>Тут буде статистика конкретної школи: розклад дзвінків, статус охорони, клімат у класах.</p>
  </div>
);

// --- ДАШБОРД ОХОРОНЦЯ (Заглушка) ---
const StaffDashboard = ({ user }) => (
  <div className="text-center py-20 text-gray-400">
    <ShieldAlert size={48} className="mx-auto mb-4 opacity-20" />
    <h2 className="text-2xl font-bold text-white mb-2">Панель моніторингу</h2>
    <p>Тут будуть камери, датчики руху та тривожні кнопки швидкого реагування.</p>
  </div>
);

// --- ГОЛОВНИЙ КОМПОНЕНТ (МАРШРУТИЗАТОР РОЛЕЙ) ---
export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  if (user?.role === 'system_admin') return <SystemAdminDashboard user={user} />;
  if (user?.role === 'school_admin') return <SchoolAdminDashboard user={user} />;
  return <StaffDashboard user={user} />;
}
