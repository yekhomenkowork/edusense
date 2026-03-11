import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { DoorOpen, Activity, Building2, Cpu, Wifi, Server, CheckCircle2, AlertCircle, Database, RefreshCw, Terminal, AlertTriangle, ShieldAlert, Mic2, Bell, Wind, Music, ShieldCheck, Siren, Thermometer, Droplets, ListMusic, Play, Clock, Search, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine, Cell, LineChart, Line } from 'recharts';

// --- ДАНІ ДЛЯ ГОЛОВНОГО АДМІНА ---
const networkData7d = [{ time: 'Пн', devices: 820 }, { time: 'Вв', devices: 835 }, { time: 'Ср', devices: 840 }, { time: 'Чт', devices: 810 }, { time: 'Пт', devices: 845 }, { time: 'Сб', devices: 420 }, { time: 'Нд', devices: 430 }];
const networkData30d = [{ time: '01 Бер', devices: 800 }, { time: '08 Бер', devices: 850 }, { time: '15 Бер', devices: 810 }, { time: '22 Бер', devices: 845 }, { time: '29 Бер', devices: 860 }, { time: '05 Кві', devices: 840 }];
const componentsHealth = [
  { name: 'Core API', status: 'online', uptime: '99.9%', icon: <Server size={20} /> },
  { name: 'MQTT Broker', status: 'online', uptime: '100%', icon: <Activity size={20} /> },
  { name: 'PostgreSQL', status: 'online', uptime: '99.9%', icon: <Database size={20} /> },
];

// --- ДАНІ ДЛЯ ДИРЕКТОРА ШКОЛИ ---
// Топ проблемних зон для головного екрану
const topClimateData = [
  { room: 'Каб. 101', co2: 650 }, { room: 'Каб. 102', co2: 720 }, { room: 'Каб. 103', co2: 1150 }, 
  { room: 'Спортзал', co2: 800 }, { room: 'Їдальня', co2: 950 }, { room: 'Каб. 201', co2: 680 },
];

// Всі сенсори для модалки
const allSensors = [
  { id: '101', name: 'Каб. 101 (Математика)', co2: 650, temp: 21, hum: 45, status: 'ok' },
  { id: '102', name: 'Каб. 102 (Фізика)', co2: 720, temp: 22, hum: 42, status: 'ok' },
  { id: '103', name: 'Каб. 103 (Хімія)', co2: 1150, temp: 24, hum: 38, status: 'critical' },
  { id: 'gym', name: 'Великий Спортзал', co2: 800, temp: 19, hum: 55, status: 'warning' },
  { id: 'din', name: 'Їдальня', co2: 950, temp: 23, hum: 50, status: 'warning' },
  { id: '201', name: 'Каб. 201 (Історія)', co2: 680, temp: 21, hum: 44, status: 'ok' },
  { id: '202', name: 'Каб. 202 (Біологія)', co2: 610, temp: 20, hum: 46, status: 'ok' },
];

// Історія для графіку вибраного сенсора
const sensorHistory = [
  { time: '08:00', co2: 450, temp: 19 }, { time: '09:00', co2: 600, temp: 20 },
  { time: '10:00', co2: 850, temp: 22 }, { time: '11:00', co2: 1150, temp: 24 }, // Пік
  { time: '12:00', co2: 700, temp: 21 }, { time: '13:00', co2: 750, temp: 21 },
];

const fullSchedule = [
  { time: '08:30', event: 'Початок 1-го уроку', track: 'Стандартний дзвінок', type: 'bell', past: true },
  { time: '09:15', event: 'Кінець 1-го уроку', track: 'Укр. мотиви (Легка)', type: 'bell', past: true },
  { time: '09:25', event: 'Початок 2-го уроку', track: 'Стандартний дзвінок', type: 'bell', past: true },
  { time: '10:10', event: 'Кінець 2-го уроку', track: 'Укр. мотиви (Легка)', type: 'bell', past: true },
  { time: '10:20', event: 'Музична перерва', track: 'Плейлист "Ранковий Чіл"', type: 'music', active: true },
  { time: '10:45', event: 'Початок 3-го уроку', track: 'Стандартний сигнал', type: 'bell', future: true },
  { time: '11:30', event: 'Велика перерва', track: 'Плейлист "Lo-Fi Study"', type: 'music', future: true },
];

const SystemAdminDashboard = ({ user }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const currentChartData = timeRange === '7d' ? networkData7d : networkData30d;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-[#121214] border border-white/5 p-8 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="relative z-10"><h1 className="text-3xl font-bold mb-2">Вітаємо, {user.name}! 👋</h1><p className="text-gray-400">Глобальний моніторинг екосистеми EduSense працює в штатному режимі.</p></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
          <button onClick={() => { setIsRefreshing(true); setTimeout(() => setIsRefreshing(false), 1000); }} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-gray-300">
            <RefreshCw size={16} className={isRefreshing ? "animate-spin text-blue-400" : ""} /> {isRefreshing ? 'Оновлення...' : 'Оновити дані'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl"><div className="text-gray-400 font-medium mb-2 flex items-center gap-2"><Building2 size={18} className="text-blue-400"/> Підключено шкіл</div><div className="text-4xl font-bold">12</div></div>
        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl"><div className="text-gray-400 font-medium mb-2 flex items-center gap-2"><Cpu size={18} className="text-purple-400"/> Активні пристрої</div><div className="text-4xl font-bold">845</div></div>
        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl"><div className="text-gray-400 font-medium mb-2 flex items-center gap-2"><Activity size={18} className="text-emerald-400"/> CPU Load</div><div className="text-4xl font-bold">24%</div></div>
        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl"><div className="text-gray-400 font-medium mb-2 flex items-center gap-2"><AlertCircle size={18} className="text-yellow-400"/> Критичні алерти</div><div className="text-4xl font-bold">0</div></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#121214] border border-white/5 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6"><h2 className="text-lg font-bold">Мережева активність</h2><div className="flex bg-black/50 border border-white/10 rounded-lg p-1"><button onClick={() => setTimeRange('7d')} className={`px-3 py-1.5 text-xs rounded-md ${timeRange==='7d'?'bg-white/10':''}`}>7 Днів</button><button onClick={() => setTimeRange('30d')} className={`px-3 py-1.5 text-xs rounded-md ${timeRange==='30d'?'bg-white/10':''}`}>30 Днів</button></div></div>
          <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={currentChartData}><CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} /><XAxis dataKey="time" stroke="#ffffff50" tick={{fontSize: 12}} /><YAxis stroke="#ffffff50" tick={{fontSize: 12}} /><Tooltip contentStyle={{ backgroundColor: '#121214', borderColor: '#ffffff10' }} /><Area type="monotone" dataKey="devices" stroke="#3b82f6" fillOpacity={0.2} fill="#3b82f6" /></AreaChart></ResponsiveContainer></div>
        </div>
        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex flex-col">
          <h2 className="text-lg font-bold mb-6">Стан ядра</h2>
          <div className="space-y-4">{componentsHealth.map((c, i) => (<div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-xl"><div className="flex items-center gap-4 text-gray-400">{c.icon}<div><div className="text-sm text-gray-200">{c.name}</div><div className="text-xs text-gray-500">Uptime: {c.uptime}</div></div></div><CheckCircle2 className="text-emerald-500" size={20}/></div>))}</div>
        </div>
      </div>
    </div>
  );
};

const SchoolAdminDashboard = ({ user }) => {
  const [isEvacModalOpen, setIsEvacModalOpen] = useState(false);
  const [isMicModalOpen, setIsMicModalOpen] = useState(false);
  const [micActive, setMicActive] = useState(false);
  
  // Стан для нових модалок
  const [isSensorsModalOpen, setIsSensorsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(allSensors[2]); // За замовчуванням Каб 103 (проблемний)

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      
      {/* Шапка з Екстреними діями */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center bg-[#121214] border border-white/5 p-6 md:p-8 rounded-[2rem] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500"></div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3"><Building2 className="text-blue-400" /> Ліцей №1 Інтелект</h1>
          <p className="text-gray-400">Оперативний дашборд. Поточний стан: <span className="text-emerald-400 font-medium">Штатний (Йде перерва)</span></p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full lg:w-auto">
          <button onClick={() => setIsMicModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl font-bold transition-all"><Mic2 size={20} /> Живий ефір</button>
          <button onClick={() => setIsEvacModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all animate-pulse"><Siren size={20} /> ТРИВОГА / ЕВАКУАЦІЯ</button>
        </div>
      </div>

      {/* KPI Картки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex flex-col justify-center">
          <div className="text-gray-400 font-medium mb-2 flex items-center gap-2"><ShieldCheck size={18} className="text-emerald-400"/> Безпека периметру</div>
          <div className="text-2xl font-bold text-white">Всі двері зачинені</div>
          <div className="text-xs text-gray-500 mt-2">Охорона на посту</div>
        </div>
        <div className="bg-[#121214] border border-red-500/20 p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden cursor-pointer hover:border-red-500/40 transition-colors" onClick={() => setIsSensorsModalOpen(true)}>
          <div className="absolute top-0 right-0 p-4"><AlertTriangle className="text-red-500/20" size={60}/></div>
          <div className="text-red-400 font-medium mb-2 flex items-center gap-2"><Wind size={18} /> Увага: Мікроклімат</div>
          <div className="text-2xl font-bold text-white">Каб. 103 (CO2)</div>
          <div className="text-xs text-red-400 mt-2 flex items-center gap-1">1150 ppm <span className="underline">Відкрити всі</span></div>
        </div>
        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex flex-col justify-center cursor-pointer hover:border-white/10 transition-colors" onClick={() => setIsScheduleModalOpen(true)}>
          <div className="text-gray-400 font-medium mb-2 flex items-center gap-2"><Bell size={18} className="text-blue-400"/> Наступний дзвінок</div>
          <div className="text-3xl font-bold text-white mb-1">10:45 <span className="text-sm font-normal text-gray-500">через 12 хв</span></div>
          <div className="text-xs text-gray-400 underline">Показати розклад</div>
        </div>
        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex flex-col justify-center">
          <div className="text-gray-400 font-medium mb-2 flex items-center gap-2"><Activity size={18} className="text-purple-400"/> IoT Сенсори</div>
          <div className="text-3xl font-bold text-white">45 / 45</div>
          <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><CheckCircle2 size={12}/> Всі пристрої онлайн</div>
        </div>
      </div>

      {/* Графіки та Розклад (Головна) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Аналітика CO2 (Прев'ю) */}
        <div className="lg:col-span-2 bg-[#121214] border border-white/5 p-6 rounded-2xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Wind size={20} className="text-emerald-400"/> Мікроклімат (Топ-6 зон)</h2>
            <button onClick={() => setIsSensorsModalOpen(true)} className="text-sm text-blue-400 hover:text-blue-300 font-medium">Всі датчики</button>
          </div>
          <div className="h-[300px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topClimateData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="room" stroke="#ffffff50" tick={{fill: '#ffffff50', fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" tick={{fill: '#ffffff50', fontSize: 12}} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: '#121214', borderColor: '#ffffff10', borderRadius: '12px', color: '#fff' }} />
                <ReferenceLine y={1000} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Критична межа', fill: '#ef4444', fontSize: 10 }} />
                <Bar dataKey="co2" radius={[6, 6, 0, 0]}>
                  {topClimateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.co2 > 1000 ? '#ef4444' : entry.co2 > 800 ? '#eab308' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Аудіо Розклад (Прев'ю) */}
        <div className="bg-[#121214] border border-white/5 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-black/20">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Music size={20} className="text-purple-400"/> Найближчі трансляції</h2>
          </div>
          <div className="flex-1 p-4 space-y-3">
            {fullSchedule.filter(item => item.active || item.future).slice(0, 3).map((audio, idx) => (
              <div key={idx} className={`p-4 rounded-xl border flex gap-4 items-center ${audio.active ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/5 border-white/5'}`}>
                <div className={`text-lg font-bold w-14 text-center ${audio.active ? 'text-blue-400' : 'text-white'}`}>{audio.time}</div>
                <div className="flex-1 border-l border-white/10 pl-4">
                  <div className="font-semibold text-gray-200 text-sm mb-1 flex items-center gap-2">
                    {audio.event} {audio.active && <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    {audio.type === 'bell' ? <Bell size={12}/> : <Music size={12}/>} {audio.track}
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setIsScheduleModalOpen(true)} className="w-full mt-4 py-3 bg-black/50 hover:bg-white/5 border border-white/5 rounded-xl text-sm font-medium transition-colors text-gray-300">
              Відкрити повний розклад
            </button>
          </div>
        </div>
      </div>

      {/* МОДАЛКА: ТРИВОГА */}
      {isEvacModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-red-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#121214] border border-red-500/30 rounded-3xl w-full max-w-md p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20"><Siren size={48} className="text-red-500 animate-pulse" /></div>
            <h2 className="text-3xl font-extrabold text-white mb-2">ЗАПУСК ТРИВОГИ</h2>
            <p className="text-red-300 mb-8 text-sm">Це переведе школу в режим евакуації. Включиться сирена, голосові вказівки та світлові покажчики.</p>
            <div className="flex gap-4">
              <button onClick={() => setIsEvacModalOpen(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors">Відміна</button>
              <button onClick={() => { alert('ТРИВОГА АКТИВОВАНА'); setIsEvacModalOpen(false); }} className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-colors">Підтвердити</button>
            </div>
          </div>
        </div>
      )}

      {/* МОДАЛКА: ЖИВИЙ ЕФІР */}
      {isMicModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121214] border border-white/10 rounded-3xl w-full max-w-md p-8 text-center shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Оголошення наживо</h2>
            <button onClick={() => setMicActive(!micActive)} className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center mb-8 transition-all duration-300 ${micActive ? 'bg-blue-600 shadow-[0_0_50px_rgba(37,99,235,0.5)] scale-110' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
              <Mic2 size={48} className={micActive ? 'text-white animate-pulse' : 'text-gray-400'} />
            </button>
            <p className={`text-sm font-medium mb-8 ${micActive ? 'text-blue-400' : 'text-gray-500'}`}>{micActive ? 'УВАГА: ВАС ЧУЄ ВСЯ ШКОЛА' : 'Натисніть на мікрофон, щоб почати'}</p>
            <button onClick={() => { setIsMicModalOpen(false); setMicActive(false); }} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors">Закрити</button>
          </div>
        </div>
      )}

      {/* МОДАЛКА: ПОВНА АНАЛІТИКА ДАТЧИКІВ */}
      {isSensorsModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121214] border border-white/10 rounded-3xl w-full h-full max-w-7xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><Wind className="text-emerald-400" /> Центр аналітики мікроклімату</h2>
              <button onClick={() => setIsSensorsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              {/* Список кімнат (Сайдбар) */}
              <div className="w-full md:w-80 border-r border-white/5 bg-black/20 flex flex-col">
                <div className="p-4 border-b border-white/5">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input type="text" placeholder="Пошук кабінету..." className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-emerald-500 outline-none" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {allSensors.map(sensor => (
                    <button 
                      key={sensor.id} 
                      onClick={() => setSelectedSensor(sensor)}
                      className={`w-full text-left p-3 rounded-xl transition-colors flex items-center justify-between ${selectedSensor.id === sensor.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    >
                      <div>
                        <div className="font-medium text-gray-200 text-sm">{sensor.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1"><Wind size={10}/> {sensor.co2}</span>
                          <span className="flex items-center gap-1"><Thermometer size={10}/> {sensor.temp}°</span>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${sensor.status === 'critical' ? 'bg-red-500 animate-pulse' : sensor.status === 'warning' ? 'bg-yellow-500' : 'bg-emerald-500'}`}></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Деталі вибраного сенсора */}
              <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
                <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{selectedSensor.name}</h3>
                    <p className="text-gray-400">Детальна історія за останні 6 годин</p>
                  </div>
                  {selectedSensor.status === 'critical' && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl flex items-center gap-2 font-medium">
                      <AlertTriangle size={18}/> Перевищення норм CO2
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-black/30 border border-white/5 p-5 rounded-2xl">
                    <div className="text-gray-400 text-sm mb-1 flex items-center gap-2"><Wind size={16}/> Рівень CO2</div>
                    <div className={`text-3xl font-bold ${selectedSensor.co2 > 1000 ? 'text-red-400' : 'text-white'}`}>{selectedSensor.co2} <span className="text-sm font-normal text-gray-500">ppm</span></div>
                  </div>
                  <div className="bg-black/30 border border-white/5 p-5 rounded-2xl">
                    <div className="text-gray-400 text-sm mb-1 flex items-center gap-2"><Thermometer size={16}/> Температура</div>
                    <div className="text-3xl font-bold text-white">{selectedSensor.temp} <span className="text-sm font-normal text-gray-500">°C</span></div>
                  </div>
                  <div className="bg-black/30 border border-white/5 p-5 rounded-2xl">
                    <div className="text-gray-400 text-sm mb-1 flex items-center gap-2"><Droplets size={16}/> Вологість</div>
                    <div className="text-3xl font-bold text-white">{selectedSensor.hum} <span className="text-sm font-normal text-gray-500">%</span></div>
                  </div>
                </div>

                <div className="h-[300px] w-full bg-black/20 border border-white/5 p-4 rounded-2xl">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sensorHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="time" stroke="#ffffff50" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff50" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#121214', borderColor: '#ffffff10', borderRadius: '12px' }} />
                      <Line type="monotone" dataKey="co2" name="CO2 (ppm)" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 0}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* МОДАЛКА: ПОВНИЙ РОЗКЛАД */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121214] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><ListMusic className="text-purple-400" /> Редактор розкладу</h2>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Таймлайн на сьогодні</h3>
                <button className="text-sm bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  + Додати подію
                </button>
              </div>

              <div className="relative border-l-2 border-white/10 ml-3 space-y-6 pb-4">
                {fullSchedule.map((item, idx) => (
                  <div key={idx} className={`relative pl-6 transition-all ${item.past ? 'opacity-50' : 'opacity-100'}`}>
                    {/* Точка на таймлайні */}
                    <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-[#121214] ${item.active ? 'bg-blue-500 animate-pulse' : item.past ? 'bg-gray-500' : 'bg-purple-500'}`}></div>
                    
                    <div className={`bg-black/40 border rounded-xl p-4 flex justify-between items-center ${item.active ? 'border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'border-white/5'}`}>
                      <div>
                        <div className={`text-lg font-bold mb-1 ${item.active ? 'text-blue-400' : 'text-white'}`}>{item.time}</div>
                        <div className="font-medium text-gray-200 text-sm mb-1">{item.event}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1.5">
                          {item.type === 'bell' ? <Bell size={12}/> : <Music size={12}/>} {item.track}
                        </div>
                      </div>
                      {!item.past && (
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-400 hover:text-emerald-400 bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="Запустити зараз"><Play size={16}/></button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// --- ДАШБОРД ОХОРОНЦЯ (Live Моніторинг) ---
const StaffDashboard = ({ user }) => {
  const liveEvents = [
    { id: 1, time: '10:41:22', type: 'info', msg: 'Турнікет 1: Прохід дозволено (Учень)' },
    { id: 2, time: '10:39:05', type: 'warning', msg: 'Датчик руху: Коридор 2 поверх (Нетипова активність)' },
    { id: 3, time: '10:35:00', type: 'success', msg: 'Систему переведено в штатний режим' },
    { id: 4, time: '10:15:12', type: 'info', msg: 'Камера 4 (Подвір\'я): Виявлено рух у зоні парковки' },
    { id: 5, time: '08:30:00', type: 'info', msg: 'Початок навчального дня. Основні двері розблоковано.' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl">
      <div className="bg-[#121214] border border-white/5 p-6 rounded-3xl flex justify-between items-center relative overflow-hidden shadow-lg">
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Пост охорони: Головний вхід</h1>
          <p className="text-gray-400 text-sm">Зміна: {user.name} • Статус: <span className="text-emerald-400 font-medium">Безпечно</span></p>
        </div>
        <div className="hidden sm:flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 font-medium">
          <ShieldCheck size={20} /> Периметр під контролем
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KPI */}
        <div className="space-y-6">
          <div className="bg-[#121214] border border-white/5 p-6 rounded-3xl shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400"><DoorOpen size={24}/></div>
            <div><div className="text-gray-400 text-sm">Турнікети (Проходи)</div><div className="text-2xl font-bold text-white">452 <span className="text-xs text-gray-500 font-normal">за сьогодні</span></div></div>
          </div>
          <div className="bg-[#121214] border border-white/5 p-6 rounded-3xl shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400"><Activity size={24}/></div>
            <div><div className="text-gray-400 text-sm">Активні датчики</div><div className="text-2xl font-bold text-white">16 / 16</div></div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-3xl shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-500 animate-pulse"><AlertTriangle size={24}/></div>
            <div><div className="text-orange-400 text-sm font-medium">Попередження</div><div className="text-sm text-orange-200 mt-1">Високий CO2 в Каб. 103</div></div>
          </div>
        </div>

        {/* Live Журнал */}
        <div className="lg:col-span-2 bg-[#121214] border border-white/5 rounded-3xl shadow-lg flex flex-col overflow-hidden h-[400px]">
          <div className="p-5 border-b border-white/5 bg-black/20 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Clock className="text-blue-400" size={20}/> Live Моніторинг Подій</h2>
            <div className="flex h-2 w-2 rounded-full bg-blue-500 animate-ping"></div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-sm">
            {liveEvents.map(ev => (
              <div key={ev.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="text-gray-500 mt-0.5">{ev.time}</div>
                <div className="flex-1 flex gap-3 items-start">
                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${ev.type === 'info' ? 'bg-blue-500' : ev.type === 'warning' ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                  <span className={ev.type === 'warning' ? 'text-yellow-400' : 'text-gray-300'}>{ev.msg}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ГОЛОВНИЙ РОУТЕР РОЛЕЙ ---
export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  if (user?.role === 'system_admin') return <SystemAdminDashboard user={user} />;
  if (user?.role === 'school_admin') return <SchoolAdminDashboard user={user} />;
  return <StaffDashboard user={user} />;
}
