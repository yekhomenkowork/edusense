import React, { useState, useEffect } from 'react';
import { Server, Cpu, HardDrive, Activity, Terminal, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function AdminOverviewPage() {
  // Для презентації ми робимо імітацію "живих" даних, які оновлюються
  const [cpuLoad, setCpuLoad] = useState(12);
  const [ramLoad, setRamLoad] = useState(4.2);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuLoad(prev => Math.max(5, Math.min(95, prev + (Math.random() * 10 - 5))));
      setRamLoad(prev => Math.max(2, Math.min(15, prev + (Math.random() * 0.4 - 0.2))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const containers = [
    { name: 'edusense_frontend', image: 'nginx:alpine', status: 'Up 2 days', state: 'healthy' },
    { name: 'edusense_backend', image: 'fastapi-app', status: 'Up 2 days', state: 'healthy' },
    { name: 'edusense_db', image: 'postgres:15', status: 'Up 2 days', state: 'healthy' },
    { name: 'edusense_mqtt', image: 'mosquitto-go-auth', status: 'Up 2 days', state: 'healthy' },
  ];

  const logs = [
    { time: '10:42:15', level: 'INFO', msg: 'POST /api/schools - 201 Created' },
    { time: '10:35:02', level: 'INFO', msg: 'New JWT token generated for superadmin@edusense.com' },
    { time: '10:15:00', level: 'WARN', msg: 'High memory usage detected in edusense_db (85%)' },
    { time: '09:00:12', level: 'INFO', msg: 'Database backup completed successfully' },
    { time: '08:45:33', level: 'ERROR', msg: 'MQTT Worker connection timeout (Retrying...)' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Статус системи</h1>
        <p className="text-gray-400">Моніторинг серверів, контейнерів та загального навантаження SaaS-платформи</p>
      </div>

      {/* Картки ресурсів */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-bl-full blur-2xl"></div>
          <div className="flex items-center gap-3 mb-4 text-gray-400"><Cpu size={18} className="text-blue-400"/> CPU Load</div>
          <div className="text-3xl font-bold text-white">{cpuLoad.toFixed(1)}%</div>
          <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${cpuLoad}%` }}></div>
          </div>
        </div>

        <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500/10 rounded-bl-full blur-2xl"></div>
          <div className="flex items-center gap-3 mb-4 text-gray-400"><HardDrive size={18} className="text-purple-400"/> RAM Usage</div>
          <div className="text-3xl font-bold text-white">{ramLoad.toFixed(1)} <span className="text-lg text-gray-500">/ 16 GB</span></div>
          <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${(ramLoad/16)*100}%` }}></div>
          </div>
        </div>

        <div className="bg-[#121214] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4 text-gray-400"><Activity size={18} className="text-emerald-400"/> Database (PostgreSQL)</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>
            <span className="text-xl font-bold text-emerald-400">Connected</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Latency: 12ms</p>
        </div>

        <div className="bg-[#121214] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4 text-gray-400"><Clock size={18} className="text-orange-400"/> Uptime</div>
          <div className="text-3xl font-bold text-white">48h 12m</div>
          <p className="text-sm text-gray-500 mt-2">Останнє перезавантаження: 10 лист.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Docker Containers */}
        <div className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-white/5 flex items-center gap-2 bg-black/20">
            <Server size={18} className="text-gray-400" />
            <h2 className="font-bold text-white">Docker Контейнери</h2>
          </div>
          <div className="p-2">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500 text-xs uppercase">
                <tr><th className="p-3 font-medium">Контейнер</th><th className="p-3 font-medium">Статус</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {containers.map(c => (
                  <tr key={c.name} className="hover:bg-white/[0.02]">
                    <td className="p-3">
                      <div className="font-medium text-white">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.image}</div>
                    </td>
                    <td className="p-3">
                      <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md w-fit text-xs font-bold">
                        <CheckCircle2 size={14} /> {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/20">
            <div className="flex items-center gap-2">
              <Terminal size={18} className="text-gray-400" />
              <h2 className="font-bold text-white">Останні Логи</h2>
            </div>
            <span className="text-xs text-gray-500 font-mono">/var/log/syslog</span>
          </div>
          <div className="p-5 flex-1 bg-black/40 font-mono text-xs space-y-3 overflow-y-auto max-h-[300px]">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-gray-500 shrink-0">[{log.time}]</span>
                <span className={`shrink-0 font-bold ${log.level === 'INFO' ? 'text-blue-400' : log.level === 'WARN' ? 'text-yellow-400' : 'text-red-400'}`}>
                  {log.level}
                </span>
                <span className="text-gray-300">{log.msg}</span>
              </div>
            ))}
            <div className="flex gap-3 items-start animate-pulse">
              <span className="text-gray-500">[{new Date().toLocaleTimeString('uk-UA')}]</span>
              <span className="text-gray-500">Очікування нових подій...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
