import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Activity, Building2, Cpu, Wifi, Server, CheckCircle2, AlertCircle, Database, RefreshCw, Terminal, HardDrive, X, ShieldAlert } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- МОКОВІ ДАНІ ---
const networkData7d = [
  { time: 'Пн', devices: 820 }, { time: 'Вв', devices: 835 }, { time: 'Ср', devices: 840 }, 
  { time: 'Чт', devices: 810 }, { time: 'Пт', devices: 845 }, { time: 'Сб', devices: 420 }, { time: 'Нд', devices: 430 },
];
const networkData30d = [
  { time: '01 Бер', devices: 800 }, { time: '08 Бер', devices: 850 }, { time: '15 Бер', devices: 810 }, 
  { time: '22 Бер', devices: 845 }, { time: '29 Бер', devices: 860 }, { time: '05 Кві', devices: 840 },
];

const componentsHealth = [
  { name: 'Core API (FastAPI)', status: 'online', uptime: '99.9%', icon: <Server size={20} /> },
  { name: 'MQTT Broker (EMQX)', status: 'online', uptime: '100%', icon: <Activity size={20} /> },
  { name: 'PostgreSQL Database', status: 'online', uptime: '99.9%', icon: <Database size={20} /> },
  { name: 'WebSocket Cluster', status: 'online', uptime: '99.8%', icon: <Wifi size={20} /> },
];

// --- ДАШБОРД ГОЛОВНОГО АДМІНА ---
const SystemAdminDashboard = ({ user }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const currentChartData = timeRange === '7d' ? networkData7d : networkData30d;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Привітання та Кнопка оновлення */}
      <div className="bg-[#121214] border border-white/5 p-8 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            Вітаємо, {user.name}! 👋
          </h1>
          <p className="text-gray-400">Глобальний моніторинг екосистеми EduSense працює в штатному режимі.</p>
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-gray-300"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin text-blue-400" : ""} /> 
            {isRefreshing ? 'Оновлення...' : 'Оновити дані'}
          </button>
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            Усі системи в нормі
          </div>
        </div>
      </div>

      {/* KPI Картки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group hover:border-blue-500/30 transition-colors cursor-pointer">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500"><Building2 size={100} /></div>
          <div className="text-gray-400 font-medium mb-4 flex items-center gap-2"><Building2 size={18} className="text-blue-400"/> Підключено шкіл</div>
          <div className="text-4xl font-bold text-white">12 <span className="text-sm font-normal text-emerald-400 ml-2">↑ 2 нові</span></div>
        </div>
        
        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group hover:border-purple-500/30 transition-colors cursor-pointer">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500"><Cpu size={100} /></div>
          <div className="text-gray-400 font-medium mb-4 flex items-center gap-2"><Cpu size={18} className="text-purple-400"/> Активні пристрої</div>
          <div className="text-4xl font-bold text-white flex items-baseline gap-2">845 <span className="text-lg font-normal text-gray-500">/ 850</span></div>
          <div className="w-full bg-white/10 h-1.5 mt-4 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full w-[99%] rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
          </div>
        </div>

        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group hover:border-emerald-500/30 transition-colors cursor-pointer">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500"><Activity size={100} /></div>
          <div className="text-gray-400 font-medium mb-4 flex items-center gap-2"><Activity size={18} className="text-emerald-400"/> Завантаження CPU</div>
          <div className="text-4xl font-bold text-white">24%</div>
        </div>

        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group hover:border-yellow-500/30 transition-colors cursor-pointer">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500"><AlertCircle size={100} /></div>
          <div className="text-gray-400 font-medium mb-4 flex items-center gap-2"><AlertCircle size={18} className="text-yellow-400"/> Сповіщення системи</div>
          <div className="text-4xl font-bold text-white">0 <span className="text-sm font-normal text-gray-500 ml-2">критичних</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Інтерактивний графік */}
        <div className="lg:col-span-2 bg-[#121214] border border-white/5 p-6 rounded-2xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Мережева активність пристроїв</h2>
            <div className="flex bg-black/50 border border-white/10 rounded-lg p-1">
              <button onClick={() => setTimeRange('7d')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${timeRange === '7d' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>7 Днів</button>
              <button onClick={() => setTimeRange('30d')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${timeRange === '30d' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>30 Днів</button>
            </div>
          </div>
          <div className="h-[300px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDevices" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="time" stroke="#ffffff50" tick={{fill: '#ffffff50', fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" tick={{fill: '#ffffff50', fontSize: 12}} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#121214', borderColor: '#ffffff10', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#3b82f6' }} />
                <Area type="monotone" dataKey="devices" name="В мережі" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorDevices)" animationDuration={1000} />
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
                <CheckCircle2 className="text-emerald-500" size={20} />
              </div>
            ))}
          </div>
          <button onClick={() => setIsReportOpen(true)} className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors text-white flex justify-center items-center gap-2">
            <Terminal size={16}/> Повний звіт серверу
          </button>
        </div>
      </div>

      {/* МОДАЛЬНЕ ВІКНО ЗВІТУ */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Server className="text-blue-400" /> Детальний звіт інфраструктури
              </h2>
              <button onClick={() => setIsReportOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <div className="p-6 overflow-y-auto space-y-8">
              
              {/* Ресурси сервера */}
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Навантаження на хост (edusense-prod-1)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between text-sm mb-2"><span className="text-gray-400">CPU Usage</span><span className="text-emerald-400">24%</span></div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-[24%]"></div></div>
                    <div className="text-xs text-gray-500 mt-2">16 Cores / 32 Threads</div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between text-sm mb-2"><span className="text-gray-400">RAM (Memory)</span><span className="text-yellow-400">77%</span></div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden"><div className="bg-yellow-500 h-full w-[77%]"></div></div>
                    <div className="text-xs text-gray-500 mt-2">24.6 GB / 32.0 GB</div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between text-sm mb-2"><span className="text-gray-400">SSD Storage</span><span className="text-emerald-400">18%</span></div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-[18%]"></div></div>
                    <div className="text-xs text-gray-500 mt-2">180 GB / 1000 GB NVMe</div>
                  </div>
                </div>
              </section>

              {/* Docker Контейнери */}
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Docker Контейнери</h3>
                <div className="space-y-2 text-sm font-mono bg-black/50 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center text-gray-300 border-b border-white/5 pb-2 mb-2"><span>CONTAINER ID</span><span>IMAGE</span><span>STATUS</span></div>
                  <div className="flex justify-between items-center text-emerald-400"><span>a1b2c3d4e5f6</span><span>edusense-backend:latest</span><span>Up 4 days</span></div>
                  <div className="flex justify-between items-center text-emerald-400"><span>f6e5d4c3b2a1</span><span>edusense-frontend:latest</span><span>Up 4 days</span></div>
                  <div className="flex justify-between items-center text-emerald-400"><span>9c8b7a6d5e4f</span><span>edusense-mqtt-worker:latest</span><span>Up 4 days</span></div>
                  <div className="flex justify-between items-center text-emerald-400"><span>1a2b3c4d5e6f</span><span>postgres:15-alpine</span><span>Up 12 days</span></div>
                </div>
              </section>

              {/* Термінал */}
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Останні логи системи</h3>
                <div className="bg-black p-4 rounded-xl border border-gray-800 font-mono text-xs overflow-x-auto h-48 overflow-y-auto">
                  <div className="text-gray-500">[2026-03-10 10:24:01] <span className="text-blue-400">INFO</span>: App started on http://0.0.0.0:5000</div>
                  <div className="text-gray-500">[2026-03-10 10:24:02] <span className="text-emerald-400">SUCCESS</span>: MQTT Broker connected successfully. Subscribed to topics.</div>
                  <div className="text-gray-500">[2026-03-10 10:24:05] <span className="text-yellow-400">WARN</span>: High memory usage detected in container edusense-db.</div>
                  <div className="text-gray-500">[2026-03-10 10:25:12] <span className="text-blue-400">INFO</span>: Auth token generated for user sys@admin.com</div>
                  <div className="text-gray-500">[2026-03-10 10:25:15] <span className="text-emerald-400">SUCCESS</span>: Handshake completed with device ID School_102_ZoneA.</div>
                  <div className="text-gray-500">[2026-03-10 10:25:20] <span className="text-blue-400">INFO</span>: Client requested 30d network history.</div>
                  <div className="text-gray-500 animate-pulse mt-2">_</div>
                </div>
              </section>

            </div>
          </div>
        </div>
      )}
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

// --- ГОЛОВНИЙ КОМПОНЕНТ ---
export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  if (user?.role === 'system_admin') return <SystemAdminDashboard user={user} />;
  if (user?.role === 'school_admin') return <SchoolAdminDashboard user={user} />;
  return <StaffDashboard user={user} />;
}
