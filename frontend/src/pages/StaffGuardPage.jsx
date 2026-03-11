import React, { useState } from 'react';
import { Shield, Camera, Lock, Unlock, DoorOpen, Video, Maximize, AlertCircle } from 'lucide-react';

const initialDoors = [
  { id: 'd1', name: 'Головний вхід (Турнікети)', status: 'unlocked' },
  { id: 'd2', name: 'Чорний вхід', status: 'locked' },
  { id: 'd3', name: 'Вхід у спортзал', status: 'unlocked' },
  { id: 'd4', name: 'Кабінет Директора', status: 'locked' },
];

export default function StaffGuardPage() {
  const [doors, setDoors] = useState(initialDoors);

  const toggleDoor = (id) => {
    setDoors(doors.map(d => d.id === id ? { ...d, status: d.status === 'locked' ? 'unlocked' : 'locked' } : d));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3"><Shield className="text-emerald-400" size={32}/> Панель охорони</h1>
          <p className="text-gray-400">Відеоспостереження (CCTV) та контроль доступу (СКУД)</p>
        </div>
      </div>

      {/* CCTV Камери */}
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><Video className="text-blue-400" size={20}/> Онлайн-камери</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(num => (
          <div key={num} className="bg-black border border-white/10 rounded-2xl overflow-hidden relative group aspect-video shadow-lg">
            {/* Імітація камери (шум/градієнт) */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-[#121214] opacity-80 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Оверлей камери */}
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-mono text-white">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> CAM 0{num}
            </div>
            <div className="absolute top-3 right-3 text-xs font-mono text-gray-400 bg-black/60 px-2 py-1 rounded-lg">
              {new Date().toISOString().split('T')[1].slice(0, 8)}
            </div>
            <button className="absolute bottom-3 right-3 p-2 bg-black/60 hover:bg-white/20 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all">
              <Maximize size={16}/>
            </button>
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <Camera size={48}/>
            </div>
          </div>
        ))}
      </div>

      {/* СКУД (Управління дверима) */}
      <h2 className="text-lg font-bold text-white flex items-center gap-2 pt-4"><DoorOpen className="text-purple-400" size={20}/> Контроль доступу (СКУД)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {doors.map(door => (
          <div key={door.id} className={`p-5 rounded-3xl border transition-all ${door.status === 'locked' ? 'bg-[#121214] border-white/5' : 'bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${door.status === 'locked' ? 'bg-white/5 text-gray-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {door.status === 'locked' ? <Lock size={24}/> : <Unlock size={24}/>}
              </div>
              <div className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${door.status === 'locked' ? 'bg-gray-800 text-gray-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {door.status === 'locked' ? 'Закрито' : 'Відкрито'}
              </div>
            </div>
            <h3 className="font-bold text-white mb-4">{door.name}</h3>
            <button 
              onClick={() => toggleDoor(door.id)} 
              className={`w-full py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${door.status === 'locked' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
            >
              {door.status === 'locked' ? 'Відкрити двері' : 'Заблокувати'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
