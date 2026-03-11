import React, { useState } from 'react';
import { Network, Activity, Clock, RefreshCw, History, CheckCircle2, AlertTriangle, XCircle, Radio, Siren, CreditCard, X } from 'lucide-react';

// Мокові дані для API
const initialApis = [
  { 
    id: 'audio', 
    name: 'Шлюз аудіо-трансляцій', 
    desc: 'Сервер для стрімінгу шкільного радіо та подкастів', 
    icon: <Radio size={24} className="text-purple-400" />, 
    status: 'online', 
    ping: '42ms', 
    lastCheck: 'Щойно' 
  },
  { 
    id: 'alert', 
    name: 'API Повітряних тривог', 
    desc: 'Отримання сигналів з державної системи сповіщень', 
    icon: <Siren size={24} className="text-red-400" />, 
    status: 'online', 
    ping: '15ms', 
    lastCheck: '2 хв тому' 
  },
  { 
    id: 'billing', 
    name: 'Банківський еквайринг', 
    desc: 'Обробка автоматичних платежів за підписки', 
    icon: <CreditCard size={24} className="text-emerald-400" />, 
    status: 'degraded', 
    ping: '850ms', 
    lastCheck: '5 хв тому' 
  },
];

// Історія для кожного API
const mockHistory = {
  audio: [
    { time: 'Сьогодні, 09:00', status: 'online', message: 'API доступне. Затримка: 42ms' },
    { time: 'Вчора, 23:15', status: 'offline', message: 'Таймаут з\'єднання (Connection Refused)' },
    { time: 'Вчора, 23:10', status: 'online', message: 'API доступне. Затримка: 45ms' },
  ],
  alert: [
    { time: 'Сьогодні, 09:20', status: 'online', message: 'Синхронізація успішна. Затримка: 15ms' },
    { time: 'Сьогодні, 08:00', status: 'online', message: 'Синхронізація успішна. Затримка: 14ms' },
    { time: 'Вчора, 14:30', status: 'online', message: 'Тестовий пінг пройдено.' },
  ],
  billing: [
    { time: 'Сьогодні, 09:15', status: 'degraded', message: 'Висока затримка: 850ms (Можливі затримки оплат)' },
    { time: 'Сьогодні, 08:00', status: 'online', message: 'API доступне. Затримка: 120ms' },
    { time: 'Вчора, 10:00', status: 'online', message: 'API доступне. Затримка: 115ms' },
  ],
};

export default function AdminApiIntegrationsPage() {
  const [apis, setApis] = useState(initialApis);
  const [checkingId, setCheckingId] = useState(null);
  const [historyModal, setHistoryModal] = useState({ isOpen: false, apiId: null, apiName: '' });

  // Симуляція перевірки доступності
  const checkApiStatus = (id) => {
    setCheckingId(id);
    setTimeout(() => {
      setApis(prev => prev.map(api => {
        if (api.id === id) {
          // Якщо це банківський, зробимо його "online" після перевірки
          return { ...api, status: 'online', ping: Math.floor(Math.random() * 50 + 10) + 'ms', lastCheck: 'Щойно' };
        }
        return api;
      }));
      setCheckingId(null);
    }, 1500);
  };

  const checkAll = () => {
    setCheckingId('all');
    setTimeout(() => {
      setApis(prev => prev.map(api => ({ ...api, status: 'online', ping: Math.floor(Math.random() * 40 + 10) + 'ms', lastCheck: 'Щойно' })));
      setCheckingId(null);
    }, 2000);
  };

  const openHistory = (id, name) => {
    setHistoryModal({ isOpen: true, apiId: id, apiName: name });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <Network className="text-blue-400" size={32}/> Інтеграції (Зовнішні API)
          </h1>
          <p className="text-gray-400">Моніторинг стану підключень до сторонніх сервісів</p>
        </div>
        <button 
          onClick={checkAll}
          disabled={checkingId === 'all'}
          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2"
        >
          <RefreshCw size={18} className={checkingId === 'all' ? "animate-spin text-blue-400" : ""} /> 
          {checkingId === 'all' ? 'Перевірка...' : 'Перевірити всі'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {apis.map((api) => (
          <div key={api.id} className="bg-[#121214] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors hover:border-white/10 relative overflow-hidden group">
            
            {/* Статус-підсвітка збоку */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${api.status === 'online' ? 'bg-emerald-500' : api.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>

            {/* Інфо */}
            <div className="flex items-center gap-5 pl-2">
              <div className="w-14 h-14 bg-black/50 border border-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                {api.icon}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white mb-1">{api.name}</h2>
                <p className="text-sm text-gray-400">{api.desc}</p>
              </div>
            </div>

            {/* Статуси */}
            <div className="flex flex-wrap md:flex-nowrap items-center gap-8">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 font-medium uppercase">Статус</span>
                <div className="flex items-center gap-2">
                  {api.status === 'online' ? <CheckCircle2 size={18} className="text-emerald-500"/> : 
                   api.status === 'degraded' ? <AlertTriangle size={18} className="text-yellow-500"/> : 
                   <XCircle size={18} className="text-red-500"/>}
                  <span className={`font-semibold ${api.status === 'online' ? 'text-emerald-400' : api.status === 'degraded' ? 'text-yellow-400' : 'text-red-400'}`}>
                    {api.status === 'online' ? 'Працює' : api.status === 'degraded' ? 'Нестабільно' : 'Недоступно'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 font-medium uppercase">Затримка</span>
                <div className="flex items-center gap-1.5 text-gray-300 font-mono">
                  <Activity size={16} className="text-gray-500"/> {api.ping}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 font-medium uppercase">Остання перевірка</span>
                <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                  <Clock size={16} className="text-gray-500"/> {api.lastCheck}
                </div>
              </div>

              {/* Кнопки дій */}
              <div className="flex items-center gap-3 ml-auto md:ml-4">
                <button 
                  onClick={() => checkApiStatus(api.id)}
                  disabled={checkingId === api.id || checkingId === 'all'}
                  className="p-2.5 bg-black/50 border border-white/5 hover:bg-white/5 rounded-xl transition-colors text-gray-300"
                  title="Перевірити зараз"
                >
                  <RefreshCw size={18} className={checkingId === api.id ? "animate-spin text-blue-400" : ""} />
                </button>
                <button 
                  onClick={() => openHistory(api.id, api.name)}
                  className="px-4 py-2.5 bg-black/50 border border-white/5 hover:bg-white/5 rounded-xl transition-colors text-gray-300 flex items-center gap-2 font-medium"
                >
                  <History size={18} /> Історія
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* МОДАЛЬНЕ ВІКНО ІСТОРІЇ */}
      {historyModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <History className="text-blue-400" /> Журнал подій API
                </h2>
                <p className="text-sm text-gray-400 mt-1">{historyModal.apiName}</p>
              </div>
              <button onClick={() => setHistoryModal({ isOpen: false, apiId: null, apiName: '' })} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="relative border-l-2 border-white/10 ml-3 space-y-8 pb-4">
                {mockHistory[historyModal.apiId]?.map((log, idx) => (
                  <div key={idx} className="relative pl-6">
                    {/* Точка на таймлайні */}
                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-[#121214] ${log.status === 'online' ? 'bg-emerald-500' : log.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    
                    <div className="text-xs text-gray-500 font-mono mb-1">{log.time}</div>
                    <div className="bg-black/40 border border-white/5 rounded-xl p-4 mt-2">
                      <div className="flex items-start gap-3">
                        {log.status === 'online' ? <CheckCircle2 size={18} className="text-emerald-500 mt-0.5"/> : 
                         log.status === 'degraded' ? <AlertTriangle size={18} className="text-yellow-500 mt-0.5"/> : 
                         <XCircle size={18} className="text-red-500 mt-0.5"/>}
                        <div className="text-sm text-gray-300">{log.message}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-white/5 bg-black/20 text-center text-xs text-gray-500">
              Показані останні події за 48 годин
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
