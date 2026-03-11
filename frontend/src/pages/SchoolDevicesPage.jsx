import React, { useState } from 'react';
import { Settings, Wind, Thermometer, Droplets, Shield, DoorOpen, Activity, Search, Edit2, Sliders, X, Save, Clock, Server, CheckCircle2 } from 'lucide-react';

// --- МОКОВІ ДАНІ ---
const globalClimate = { co2Alert: 1000, tempMin: 18, tempMax: 24, humMin: 40, humMax: 60 };

const initialClimateSensors = [
  { id: 'c1', name: 'Каб. 101 (Математика)', type: 'climate', custom: false, limits: { ...globalClimate }, status: 'online' },
  { id: 'c2', name: 'Серверна', type: 'climate', custom: true, limits: { co2Alert: 1500, tempMin: 15, tempMax: 28, humMin: 30, humMax: 50 }, status: 'online' },
  { id: 'c3', name: 'Спортзал', type: 'climate', custom: true, limits: { co2Alert: 1200, tempMin: 16, tempMax: 22, humMin: 40, humMax: 65 }, status: 'online' },
  { id: 'c4', name: 'Каб. 102 (Фізика)', type: 'climate', custom: false, limits: { ...globalClimate }, status: 'online' },
];

const initialSecuritySensors = [
  { id: 's1', name: 'Головний вхід (Двері)', type: 'door', mode: 'schedule', schedule: { start: '20:00', end: '07:00' }, status: 'online' },
  { id: 's2', name: 'Коридор 1 поверх (Рух)', type: 'motion', mode: 'schedule', schedule: { start: '20:00', end: '07:00' }, status: 'online' },
  { id: 's3', name: 'Кабінет Директора (Двері)', type: 'door', mode: 'always', schedule: { start: '00:00', end: '23:59' }, status: 'online' },
  { id: 's4', name: 'Спортзал (Рух)', type: 'motion', mode: 'disabled', schedule: { start: '00:00', end: '00:00' }, status: 'offline' },
];

export default function SchoolDevicesPage() {
  const [activeTab, setActiveTab] = useState('climate'); // 'climate' | 'security'
  const [climateSensors, setClimateSensors] = useState(initialClimateSensors);
  const [securitySensors, setSecuritySensors] = useState(initialSecuritySensors);
  const [globalLimits, setGlobalLimits] = useState(globalClimate);

  // Модальні вікна
  const [isGlobalModalOpen, setIsGlobalModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);

  // Функції
  const openDeviceEditor = (device) => setEditingDevice({ ...device });

  const saveDevice = () => {
    if (activeTab === 'climate') {
      setClimateSensors(climateSensors.map(d => d.id === editingDevice.id ? editingDevice : d));
    } else {
      setSecuritySensors(securitySensors.map(d => d.id === editingDevice.id ? editingDevice : d));
    }
    setEditingDevice(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3"><Settings className="text-blue-400" size={32}/> Налаштування пристроїв</h1>
          <p className="text-gray-400">Правила тригерів для IoT датчиків та систем охорони</p>
        </div>
        {activeTab === 'climate' && (
          <button onClick={() => setIsGlobalModalOpen(true)} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2">
            <Sliders size={18} /> Глобальні норми клімату
          </button>
        )}
      </div>

      {/* Вкладки */}
      <div className="flex border-b border-white/10">
        <button onClick={() => setActiveTab('climate')} className={`px-6 py-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'climate' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-gray-400 hover:text-white'}`}>
          <Wind size={18} /> Датчики мікроклімату
        </button>
        <button onClick={() => setActiveTab('security')} className={`px-6 py-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'security' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-white'}`}>
          <Shield size={18} /> Охоронні датчики
        </button>
      </div>

      {/* --- ВКЛАДКА 1: МІКРОКЛІМАТ --- */}
      {activeTab === 'climate' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex items-center gap-5">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400"><Wind size={24}/></div>
              <div><div className="text-gray-400 text-sm">Глобальний ліміт CO2</div><div className="text-2xl font-bold text-white">{globalLimits.co2Alert} ppm</div></div>
            </div>
            <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex items-center gap-5">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400"><Thermometer size={24}/></div>
              <div><div className="text-gray-400 text-sm">Норма температури</div><div className="text-2xl font-bold text-white">{globalLimits.tempMin}° - {globalLimits.tempMax}°</div></div>
            </div>
            <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex items-center gap-5">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400"><Droplets size={24}/></div>
              <div><div className="text-gray-400 text-sm">Норма вологості</div><div className="text-2xl font-bold text-white">{globalLimits.humMin}% - {globalLimits.humMax}%</div></div>
            </div>
          </div>

          <div className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-black/40 text-gray-400">
                  <tr>
                    <th className="p-4 font-medium pl-6">Локація (Датчик)</th>
                    <th className="p-4 font-medium">Тип налаштувань</th>
                    <th className="p-4 font-medium">Критичний CO2</th>
                    <th className="p-4 font-medium">Температура</th>
                    <th className="p-4 font-medium text-right pr-6">Дії</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {climateSensors.map(device => (
                    <tr key={device.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 pl-6 font-medium text-white flex items-center gap-3">
                        <Server size={16} className="text-gray-500"/> {device.name}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${device.custom ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                          {device.custom ? 'Індивідуальні' : 'Глобальні'}
                        </span>
                      </td>
                      <td className={`p-4 font-mono ${device.custom ? 'text-purple-300' : 'text-gray-300'}`}>
                        > {device.limits.co2Alert} ppm
                      </td>
                      <td className={`p-4 font-mono ${device.custom ? 'text-purple-300' : 'text-gray-300'}`}>
                        {device.limits.tempMin}° ... {device.limits.tempMax}°
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button onClick={() => openDeviceEditor(device)} className="p-2 bg-black/50 hover:bg-white/10 text-gray-400 hover:text-blue-400 rounded-lg transition-colors"><Edit2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- ВКЛАДКА 2: ОХОРОНА --- */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-black/40 text-gray-400">
                  <tr>
                    <th className="p-4 font-medium pl-6">Датчик / Локація</th>
                    <th className="p-4 font-medium">Режим охорони</th>
                    <th className="p-4 font-medium">Розклад активності</th>
                    <th className="p-4 font-medium">Статус пристрою</th>
                    <th className="p-4 font-medium text-right pr-6">Дії</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {securitySensors.map(device => (
                    <tr key={device.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${device.type === 'door' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                            {device.type === 'door' ? <DoorOpen size={16}/> : <Activity size={16}/>}
                          </div>
                          <span className="font-medium text-white">{device.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border ${
                          device.mode === 'always' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 
                          device.mode === 'schedule' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 
                          'bg-gray-500/10 text-gray-400 border-gray-500/30'
                        }`}>
                          {device.mode === 'always' ? 'Завжди активний' : device.mode === 'schedule' ? 'За розкладом' : 'Вимкнено'}
                        </span>
                      </td>
                      <td className="p-4">
                        {device.mode === 'schedule' ? (
                          <div className="flex items-center gap-2 text-gray-300 font-mono bg-white/5 px-3 py-1.5 rounded-lg w-max">
                            <Clock size={14} className="text-emerald-400"/> {device.schedule.start} - {device.schedule.end}
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <div className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                          <span className={device.status === 'online' ? 'text-gray-300' : 'text-red-400'}>{device.status === 'online' ? 'На зв\'язку' : 'Офлайн'}</span>
                        </div>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button onClick={() => openDeviceEditor(device)} className="p-2 bg-black/50 hover:bg-white/10 text-gray-400 hover:text-blue-400 rounded-lg transition-colors"><Edit2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- МОДАЛКА: ГЛОБАЛЬНІ КЛІМАТ ЛІМІТИ --- */}
      {isGlobalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121214] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><Sliders className="text-emerald-400" size={24}/> Глобальні норми</h2>
              <button onClick={() => setIsGlobalModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl mb-2 text-sm text-emerald-200">
                Ці налаштування будуть застосовані до всіх датчиків, окрім тих, що мають "Індивідуальні" налаштування.
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2"><Wind size={14}/> Критичний рівень CO2 (ppm)</label>
                <input type="number" value={globalLimits.co2Alert} onChange={(e) => setGlobalLimits({...globalLimits, co2Alert: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-emerald-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2"><Thermometer size={14}/> Мін. Темп (°C)</label>
                  <input type="number" value={globalLimits.tempMin} onChange={(e) => setGlobalLimits({...globalLimits, tempMin: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Макс. Темп (°C)</label>
                  <input type="number" value={globalLimits.tempMax} onChange={(e) => setGlobalLimits({...globalLimits, tempMax: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-emerald-500 outline-none" />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end gap-3">
              <button onClick={() => setIsGlobalModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-400 hover:text-white">Скасувати</button>
              <button onClick={() => setIsGlobalModalOpen(false)} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium flex items-center gap-2"><Save size={18} /> Зберегти</button>
            </div>
          </div>
        </div>
      )}

      {/* --- МОДАЛКА: РЕДАГУВАННЯ ДАТЧИКА (Обидва типи) --- */}
      {editingDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121214] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="text-blue-400" size={24}/> Налаштування датчика
              </h2>
              <button onClick={() => setEditingDevice(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-lg font-bold text-gray-200 border-b border-white/5 pb-4">{editingDevice.name}</div>
              
              {/* РЕНДЕР ДЛЯ МІКРОКЛІМАТУ */}
              {editingDevice.type === 'climate' && (
                <>
                  <label className="flex items-center justify-between cursor-pointer group p-4 rounded-xl border border-white/5 bg-black/30 hover:bg-white/5 transition-colors">
                    <div>
                      <div className="text-sm text-white font-medium">Індивідуальні ліміти</div>
                      <div className="text-xs text-gray-500">Ігнорувати глобальні норми школи</div>
                    </div>
                    <input type="checkbox" checked={editingDevice.custom} onChange={(e) => {
                      if(e.target.checked) setEditingDevice({...editingDevice, custom: true});
                      else setEditingDevice({...editingDevice, custom: false, limits: {...globalLimits}});
                    }} className="w-5 h-5 accent-purple-500 rounded bg-black border-white/10" />
                  </label>

                  {editingDevice.custom && (
                    <div className="space-y-4 p-4 border border-purple-500/20 bg-purple-500/5 rounded-xl animate-in fade-in">
                      <div>
                        <label className="block text-xs font-bold text-purple-400/70 uppercase mb-2 flex items-center gap-2"><Wind size={14}/> Критичний CO2 (ppm)</label>
                        <input type="number" value={editingDevice.limits.co2Alert} onChange={(e) => setEditingDevice({...editingDevice, limits: {...editingDevice.limits, co2Alert: e.target.value}})} className="w-full bg-black/50 border border-purple-500/30 rounded-xl py-2 px-3 text-white focus:border-purple-500 outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-purple-400/70 uppercase mb-2 flex items-center gap-2"><Thermometer size={14}/> Мін. Темп (°C)</label>
                          <input type="number" value={editingDevice.limits.tempMin} onChange={(e) => setEditingDevice({...editingDevice, limits: {...editingDevice.limits, tempMin: e.target.value}})} className="w-full bg-black/50 border border-purple-500/30 rounded-xl py-2 px-3 text-white focus:border-purple-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-purple-400/70 uppercase mb-2">Макс. Темп (°C)</label>
                          <input type="number" value={editingDevice.limits.tempMax} onChange={(e) => setEditingDevice({...editingDevice, limits: {...editingDevice.limits, tempMax: e.target.value}})} className="w-full bg-black/50 border border-purple-500/30 rounded-xl py-2 px-3 text-white focus:border-purple-500 outline-none" />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* РЕНДЕР ДЛЯ ОХОРОНИ */}
              {(editingDevice.type === 'door' || editingDevice.type === 'motion') && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Режим охорони</label>
                    <select 
                      value={editingDevice.mode} 
                      onChange={(e) => setEditingDevice({...editingDevice, mode: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none cursor-pointer"
                    >
                      <option value="always">🔴 Завжди активний (24/7)</option>
                      <option value="schedule">⏱️ Тільки за розкладом</option>
                      <option value="disabled">⚪ Вимкнено</option>
                    </select>
                  </div>

                  {editingDevice.mode === 'schedule' && (
                    <div className="grid grid-cols-2 gap-4 p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-xl animate-in fade-in">
                      <div>
                        <label className="block text-xs font-bold text-emerald-400/70 uppercase mb-2">Час постановки</label>
                        <input type="time" value={editingDevice.schedule.start} onChange={(e) => setEditingDevice({...editingDevice, schedule: {...editingDevice.schedule, start: e.target.value}})} className="w-full bg-black/50 border border-emerald-500/30 rounded-xl py-2 px-3 text-white focus:border-emerald-500 outline-none font-bold" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-emerald-400/70 uppercase mb-2">Час зняття</label>
                        <input type="time" value={editingDevice.schedule.end} onChange={(e) => setEditingDevice({...editingDevice, schedule: {...editingDevice.schedule, end: e.target.value}})} className="w-full bg-black/50 border border-emerald-500/30 rounded-xl py-2 px-3 text-white focus:border-emerald-500 outline-none font-bold" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end gap-3">
              <button onClick={() => setEditingDevice(null)} className="px-5 py-2.5 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Скасувати</button>
              <button onClick={saveDevice} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium flex items-center gap-2 shadow-lg transition-colors"><Save size={18} /> Зберегти</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
