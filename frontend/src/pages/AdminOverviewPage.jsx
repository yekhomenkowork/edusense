import React, { useState, useEffect, useCallback } from 'react';
import { Server, Cpu, HardDrive, Activity, Terminal, AlertTriangle, Clock, RefreshCw, X, BarChart2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// --- РЯДОК КОНТЕЙНЕРА ---
const ContainerRow = ({ c, API_URL, token, openDetails }) => {
  const [stats, setStats] = useState({ cpu_percent: 0, ram_mb: 0 });
  const [history, setHistory] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (c.status !== 'running') { setIsFetching(false); return; }
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/system/containers/${c.name}/stats`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
          setHistory(prev => [...prev, { time: new Date().toLocaleTimeString(), cpu: data.cpu_percent, ram: data.ram_mb }].slice(-20));
        }
      } catch (err) {} finally { setIsFetching(false); }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, [c.name, c.status, API_URL, token]);

  const cpuColor = stats.cpu_percent > 80 ? 'bg-red-500' : stats.cpu_percent > 50 ? 'bg-yellow-500' : 'bg-blue-500';
  
  return (
    <tr onClick={() => openDetails(c.name, history)} className="hover:bg-white/[0.03] cursor-pointer group border-b border-white/5 last:border-0 transition-colors">
      <td className="p-4">
        <div className="font-bold text-white group-hover:text-blue-400">{c.name}</div>
        <div className="text-[10px] text-gray-500 font-mono mt-1">{c.image}</div>
      </td>
      <td className="p-4 hidden md:table-cell">
        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${c.status === 'running' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{c.status}</span>
      </td>
      <td className="p-4 w-32">
        <div className="flex justify-between text-[11px] mb-1 font-mono text-gray-400"><span>CPU</span><span className="text-white font-bold">{isFetching ? '...' : stats.cpu_percent}%</span></div>
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden"><div className={`h-full ${cpuColor} transition-all duration-700`} style={{ width: `${Math.min(stats.cpu_percent, 100)}%` }}></div></div>
      </td>
      <td className="p-4 w-32">
        <div className="flex justify-between text-[11px] mb-1 font-mono text-gray-400"><span>RAM</span><span className="text-white font-bold">{isFetching ? '...' : stats.ram_mb} MB</span></div>
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden"><div className="h-full bg-purple-500 transition-all duration-700" style={{ width: `${Math.min((stats.ram_mb / 1024) * 100, 100)}%` }}></div></div>
      </td>
    </tr>
  );
};

// --- ГОЛОВНА СТОРІНКА ---
export default function AdminOverviewPage() {
  const { token } = useAuthStore();
  const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  const [metrics, setMetrics] = useState({ cpu: 0, ram_used: 0, ram_total: 0, uptime: '...', db_status: '...' });
  const [containers, setContainers] = useState([]);
  
  // Історія для графіків Host
  const [hostHistory, setHostHistory] = useState([]);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);

  const [logPeriod, setLogPeriod] = useState("24h");
  const [aggLogs, setAggLogs] = useState({ stats: { errors: 0, warnings: 0 }, events: [] });
  const [isLogsLoading, setIsLogsLoading] = useState(true);

  const [modalData, setModalData] = useState(null);
  const [activeTab, setActiveTab] = useState('graph');
  const [terminalLogs, setTerminalLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mRes, cRes] = await Promise.all([
          fetch(`${API_URL}/system/metrics`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/system/containers`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        if (mRes.ok) {
          const mData = await mRes.json();
          setMetrics(mData);
          // Додаємо дані хоста в історію
          setHostHistory(prev => [...prev, { 
            time: new Date().toLocaleTimeString(), 
            cpu: mData.cpu, 
            ram: mData.ram_used 
          }].slice(-30)); // Зберігаємо останні 30 точок
        }
        if (cRes.ok) setContainers(await cRes.json());
      } catch (err) {}
    };
    fetchData();
    const int = setInterval(fetchData, 4000); // Оновлюємо кожні 4 сек для динамічного графіка
    return () => clearInterval(int);
  }, [API_URL, token]);

  useEffect(() => {
    const fetchAggLogs = async () => {
      setIsLogsLoading(true);
      try {
        const res = await fetch(`${API_URL}/system/logs/aggregated?period=${logPeriod}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setAggLogs(await res.json());
      } catch (err) {} finally { setIsLogsLoading(false); }
    };
    fetchAggLogs();
  }, [logPeriod, API_URL, token]);

  const openDetails = async (name, history) => {
    setModalData({ name, history });
    setActiveTab('graph');
    try {
      const res = await fetch(`${API_URL}/system/containers/${name}/logs`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setTerminalLogs((await res.json()).logs);
    } catch (err) {}
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Статус системи</h1>
          <p className="text-sm text-gray-500 mt-1">Live моніторинг інфраструктури та аналіз помилок</p>
        </div>
      </div>

      {/* Верхні картки (Зробили клікабельними) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => setIsHostModalOpen(true)}
          className="bg-[#121214] border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-blue-500/50 hover:bg-white/[0.02] transition-all group"
        >
          <div className="flex items-center justify-between mb-3 text-gray-500 text-xs font-bold uppercase">
            <span className="flex items-center gap-2"><Cpu size={14} className="text-blue-500"/> Host CPU</span>
            <BarChart2 size={14} className="text-gray-600 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"/>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{metrics.cpu}%</div>
        </div>
        
        <div 
          onClick={() => setIsHostModalOpen(true)}
          className="bg-[#121214] border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-purple-500/50 hover:bg-white/[0.02] transition-all group"
        >
          <div className="flex items-center justify-between mb-3 text-gray-500 text-xs font-bold uppercase">
            <span className="flex items-center gap-2"><HardDrive size={14} className="text-purple-500"/> Host RAM</span>
            <BarChart2 size={14} className="text-gray-600 group-hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"/>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{metrics.ram_used} <span className="text-gray-500 text-sm">/ {metrics.ram_total} GB</span></div>
        </div>
        
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 hidden md:block"><div className="flex items-center gap-2 mb-3 text-gray-500 text-xs font-bold uppercase"><Activity size={14} className="text-emerald-500"/> DB Status</div><div className="text-lg font-bold text-emerald-400 uppercase mt-1">CONNECTED</div></div>
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 hidden md:block"><div className="flex items-center gap-2 mb-3 text-gray-500 text-xs font-bold uppercase"><Clock size={14} className="text-orange-500"/> Uptime</div><div className="text-2xl font-bold text-white font-mono">{metrics.uptime}</div></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ЛІВА ЧАСТИНА: Контейнери */}
        <div className="xl:col-span-2 bg-[#121214] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 bg-black/40 flex items-center gap-3">
            <Server size={18} className="text-blue-500" />
            <h2 className="font-bold text-xs uppercase tracking-widest text-white">Docker Containers (Live)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-white/5">
                {containers.length === 0 ? <tr><td className="p-8 text-center text-gray-500">Завантаження...</td></tr> : containers.map(c => (
                  <ContainerRow key={c.id} c={c} API_URL={API_URL} token={token} openDetails={openDetails} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ПРАВА ЧАСТИНА: Агрегатор логів */}
        <div className="bg-[#121214] border border-white/5 rounded-2xl flex flex-col h-[500px]">
          <div className="p-4 border-b border-white/5 bg-black/40 flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-white">
              <AlertTriangle size={16} className="text-orange-500"/> Інциденти
            </div>
            <select value={logPeriod} onChange={e => setLogPeriod(e.target.value)} className="bg-black border border-white/10 text-xs text-gray-300 rounded px-2 py-1 outline-none">
              <option value="1h">Остання година</option>
              <option value="24h">Остання доба</option>
              <option value="7d">Останній тиждень</option>
              <option value="30d">Останній місяць</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-px bg-white/5 border-b border-white/5">
            <div className="bg-[#121214] p-3 text-center">
              <div className="text-2xl font-bold text-red-500">{isLogsLoading ? '-' : aggLogs.stats.errors}</div>
              <div className="text-[10px] text-gray-500 uppercase mt-1">Помилок (Errors)</div>
            </div>
            <div className="bg-[#121214] p-3 text-center">
              <div className="text-2xl font-bold text-yellow-500">{isLogsLoading ? '-' : aggLogs.stats.warnings}</div>
              <div className="text-[10px] text-gray-500 uppercase mt-1">Попереджень</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar bg-black/20">
            {isLogsLoading ? <div className="text-center text-gray-500 text-xs py-10">Аналіз логів...</div> : 
             aggLogs.events.length === 0 ? <div className="text-center text-emerald-500 text-xs py-10">Система працює ідеально. Помилок немає.</div> :
             aggLogs.events.map((ev, i) => (
              <div key={i} className={`p-3 rounded-lg border text-xs ${ev.level === 'ERROR' ? 'bg-red-500/5 border-red-500/10' : 'bg-yellow-500/5 border-yellow-500/10'}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-white font-mono text-[10px]">{ev.container}</span>
                  <span className="text-gray-500 text-[10px]">{ev.timestamp}</span>
                </div>
                <div className={`font-mono break-words ${ev.level === 'ERROR' ? 'text-red-400' : 'text-yellow-400'}`}>{ev.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* МОДАЛКА HOST GRAFANA */}
      {isHostModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-in zoom-in-95">
          <div className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-5xl h-[70vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-white font-mono font-bold text-lg flex items-center gap-2"><Server className="text-blue-500"/> Host Resources Live</h2>
              <button onClick={() => setIsHostModalOpen(false)} className="text-gray-500 hover:text-white transition-colors"><X size={24}/></button>
            </div>
            <div className="p-6 flex-1 bg-black/50 flex flex-col overflow-hidden">
              <h3 className="text-gray-400 text-xs uppercase font-bold mb-4">Навантаження CPU сервера (%)</h3>
              <div className="flex-1 w-full min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hostHistory}>
                    <defs>
                      <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="time" stroke="#ffffff50" fontSize={10} tickMargin={10} />
                    <YAxis stroke="#ffffff50" fontSize={10} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#121214', border: '1px solid #ffffff10', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <h3 className="text-gray-400 text-xs uppercase font-bold mb-4 mt-8">Використання RAM (GB)</h3>
              <div className="flex-1 w-full min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hostHistory}>
                    <defs>
                      <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="time" stroke="#ffffff50" fontSize={10} tickMargin={10} />
                    <YAxis stroke="#ffffff50" fontSize={10} domain={[0, 'auto']} />
                    <Tooltip contentStyle={{ backgroundColor: '#121214', border: '1px solid #ffffff10', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="ram" stroke="#a855f7" fillOpacity={1} fill="url(#colorRam)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* МОДАЛКА КОНТЕЙНЕРІВ */}
      {modalData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-in zoom-in-95">
          <div className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-5xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <h2 className="text-white font-mono font-bold text-lg">{modalData.name}</h2>
                <div className="flex bg-black/50 rounded-lg p-1 border border-white/5">
                  <button onClick={() => setActiveTab('graph')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-2 ${activeTab === 'graph' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}><BarChart2 size={14}/> Live Графік</button>
                  <button onClick={() => setActiveTab('terminal')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-2 ${activeTab === 'terminal' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}><Terminal size={14}/> Термінал</button>
                </div>
              </div>
              <button onClick={() => setModalData(null)} className="text-gray-500 hover:text-white transition-colors"><X size={24}/></button>
            </div>
            <div className="flex-1 overflow-hidden relative bg-black/50">
              {activeTab === 'graph' ? (
                <div className="p-6 h-full flex flex-col">
                  <h3 className="text-gray-400 text-xs uppercase font-bold mb-4">Навантаження CPU (%)</h3>
                  <div className="flex-1 w-full min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={modalData.history}><CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} /><XAxis dataKey="time" stroke="#ffffff50" fontSize={10} tickMargin={10} /><YAxis stroke="#ffffff50" fontSize={10} domain={[0, 'auto']} /><Tooltip contentStyle={{ backgroundColor: '#121214', border: '1px solid #ffffff10', borderRadius: '8px' }} /><Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={3} dot={false} isAnimationActive={false} /></LineChart>
                    </ResponsiveContainer>
                  </div>
                  <h3 className="text-gray-400 text-xs uppercase font-bold mb-4 mt-8">Використання RAM (MB)</h3>
                  <div className="flex-1 w-full min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={modalData.history}><CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} /><XAxis dataKey="time" stroke="#ffffff50" fontSize={10} tickMargin={10} /><YAxis stroke="#ffffff50" fontSize={10} domain={[0, 'auto']} /><Tooltip contentStyle={{ backgroundColor: '#121214', border: '1px solid #ffffff10', borderRadius: '8px' }} /><Line type="monotone" dataKey="ram" stroke="#a855f7" strokeWidth={3} dot={false} isAnimationActive={false} /></LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="p-5 overflow-y-auto h-full font-mono text-[11px] text-gray-300 leading-relaxed custom-scrollbar">
                  {terminalLogs.length === 0 ? <span className="text-gray-600">Очікування логів...</span> : terminalLogs.map((log, i) => <div key={i} className="mb-1 border-l-2 border-white/5 pl-3 hover:text-gray-200 break-words">{log}</div>)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
