import React, { useState } from 'react';
import { Mic2, Play, Pause, Volume2, VolumeX, Music, Bell, Plus, Settings2, UploadCloud, Radio, Clock, Trash2, Edit2, Volume1, Shuffle, ToggleRight, ToggleLeft, FolderOpen, ListMusic, CheckSquare, Square, Save, X, Calendar, Sliders, Lock, Unlock } from 'lucide-react';

// --- МОКОВІ ДАНІ ---
const initialZones = [
  { id: 'z1', name: 'Коридори та Холи', volume: 80, muted: false, active: true, playOnLessons: false },
  { id: 'z2', name: 'Навчальні класи', volume: 60, muted: false, active: false, playOnLessons: false },
  { id: 'z3', name: 'Вулиця (Подвір\'я)', volume: 100, muted: false, active: true, playOnLessons: true },
  { id: 'z4', name: 'Спортзал / Їдальня', volume: 75, muted: false, active: true, playOnLessons: true },
];

const mediaLibrary = [
  { id: 'm1', name: 'Класичний дзвінок', duration: '0:15', type: 'bell' },
  { id: 'm2', name: 'Укр. мотиви (Легка)', duration: '0:20', type: 'bell' },
  { id: 'm3', name: 'Сповіщення: Тривога', duration: '0:10', type: 'alert' },
  { id: 'm4', name: 'Сповіщення: Відбій', duration: '0:10', type: 'alert' },
  { id: 'm5', name: 'Lo-Fi Chill Beat 1', duration: '3:45', type: 'music' },
  { id: 'm6', name: 'Lo-Fi Chill Beat 2', duration: '4:10', type: 'music' },
  { id: 'm7', name: 'Happy Upbeat Pop', duration: '2:50', type: 'music' },
  { id: 'm8', name: 'Гімн України', duration: '1:30', type: 'music' },
];

const initialPlaylists = [
  { id: 'p1', name: 'Ранковий Чіл', tracks: 15, duration: '45:00', shuffle: true },
  { id: 'p2', name: 'Lo-Fi Study', tracks: 24, duration: '1:20:00', shuffle: true },
  { id: 'p3', name: 'Спортзал Active', tracks: 10, duration: '35:00', shuffle: false },
];

const initialSchedules = [
  {
    id: 's1', name: 'Стандартний день (Пн-Пт)',
    events: [
      { id: 1, startTime: '08:30', endTime: '08:31', title: 'Початок 1-го уроку', track: 'Класичний дзвінок', type: 'bell', zones: ['z1', 'z2', 'z3'] },
      { id: 2, startTime: '09:15', endTime: '09:25', title: 'Перерва (Фон)', track: 'Плейлист "Ранковий Чіл"', type: 'playlist', zones: ['z1', 'z4'], shuffle: true },
      { id: 3, startTime: '09:25', endTime: '09:26', title: 'Початок 2-го уроку', track: 'Укр. мотиви (Легка)', type: 'bell', zones: ['z1', 'z2', 'z3'] },
    ]
  },
  {
    id: 's2', name: 'Скорочені уроки (Пт)',
    events: [
      { id: 1, startTime: '08:30', endTime: '08:31', title: 'Початок 1-го уроку', track: 'Класичний дзвінок', type: 'bell', zones: ['z1', 'z2', 'z3'] },
      { id: 2, startTime: '09:05', endTime: '09:15', title: 'Перерва (Фон)', track: 'Плейлист "Lo-Fi Study"', type: 'playlist', zones: ['z1', 'z4'], shuffle: true },
    ]
  }
];

export default function SchoolAudioPage() {
  const [zones, setZones] = useState(initialZones);
  
  // Дані розкладів та медіа
  const [schedules, setSchedules] = useState(initialSchedules);
  const [activeScheduleId, setActiveScheduleId] = useState('s1');
  const [isScheduleLocked, setIsScheduleLocked] = useState(true); // Заблоковано за замовчуванням
  const [playlists, setPlaylists] = useState(initialPlaylists);
  
  // Плеєр
  const [isPlaying, setIsPlaying] = useState(true);
  const [playingMediaId, setPlayingMediaId] = useState(null);
  const [mediaTab, setMediaTab] = useState('tracks');

  // Модальні вікна
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [isNewScheduleModalOpen, setIsNewScheduleModalOpen] = useState(false);
  const [newScheduleTitle, setNewScheduleTitle] = useState('');

  const currentSchedule = schedules.find(s => s.id === activeScheduleId);

  // Функції управління зонами
  const handleVolumeChange = (id, newVolume) => setZones(zones.map(z => z.id === id ? { ...z, volume: newVolume, muted: newVolume == 0 } : z));
  const toggleMute = (id) => setZones(zones.map(z => z.id === id ? { ...z, muted: !z.muted } : z));
  const toggleLessonPlay = (id) => setZones(zones.map(z => z.id === id ? { ...z, playOnLessons: !z.playOnLessons } : z));

  // --- ЛОГІКА РОЗКЛАДУ ---
  const openEventEditor = (event = null) => {
    if (isScheduleLocked) return;
    setEditingEvent(event || { id: null, startTime: '12:00', endTime: '12:15', title: '', type: 'bell', track: 'Класичний дзвінок', zones: ['z1'], shuffle: false });
    setIsEventModalOpen(true);
  };

  const toggleEventZone = (zoneId) => {
    if (!editingEvent) return;
    const newZones = editingEvent.zones.includes(zoneId) ? editingEvent.zones.filter(z => z !== zoneId) : [...editingEvent.zones, zoneId];
    setEditingEvent({ ...editingEvent, zones: newZones });
  };

  const handleSaveEvent = () => {
    if (!editingEvent.title) return alert('Введіть назву події');
    
    setSchedules(schedules.map(sched => {
      if (sched.id === activeScheduleId) {
        let newEvents = [...sched.events];
        if (editingEvent.id) {
          // Редагування існуючої
          newEvents = newEvents.map(e => e.id === editingEvent.id ? editingEvent : e);
        } else {
          // Додавання нової
          newEvents.push({ ...editingEvent, id: Date.now() });
        }
        // Сортуємо події по часу
        newEvents.sort((a, b) => a.startTime.localeCompare(b.startTime));
        return { ...sched, events: newEvents };
      }
      return sched;
    }));
    setIsEventModalOpen(false);
  };

  const handleDeleteEvent = (eventId, e) => {
    e.stopPropagation();
    if (window.confirm('Ви впевнені, що хочете видалити цю подію?')) {
      setSchedules(schedules.map(sched => {
        if (sched.id === activeScheduleId) {
          return { ...sched, events: sched.events.filter(ev => ev.id !== eventId) };
        }
        return sched;
      }));
    }
  };

  const handleCreateSchedule = () => {
    if (!newScheduleTitle.trim()) return;
    const newId = 's' + Date.now();
    setSchedules([...schedules, { id: newId, name: newScheduleTitle, events: [] }]);
    setActiveScheduleId(newId);
    setIsNewScheduleModalOpen(false);
    setNewScheduleTitle('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3"><Mic2 className="text-blue-400" size={32}/> Аудіо-Хаб та Розклад</h1>
          <p className="text-gray-400">Управління трансляціями, плейлистами та зонами оповіщення</p>
        </div>
        <button onClick={() => setIsSettingsModalOpen(true)} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2">
          <Settings2 size={18} /> Налаштування
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ПЛЕЄР */}
        <div className="bg-gradient-to-br from-blue-900/20 to-[#121214] border border-blue-500/20 p-6 rounded-3xl flex flex-col relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none"></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span> В ефірі
            </div>
            <Radio size={24} className="text-blue-500/50" />
          </div>
          <div className="text-center mb-8 relative z-10">
            <div className="w-20 h-20 bg-black/50 border border-white/10 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-xl">
              <ListMusic size={32} className="text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Плейлист "Ранковий Чіл"</h2>
            <p className="text-sm text-gray-400 flex items-center justify-center gap-1"><Shuffle size={14}/> Треки перемішано</p>
          </div>
          {isPlaying && (
            <div className="flex items-end justify-center gap-1 h-12 mb-8 opacity-80">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                <div key={i} className="w-2 bg-blue-500 rounded-t-sm animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 0.5 + 0.5}s` }}></div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-center gap-6 mt-auto relative z-10">
            <button className="text-gray-400 hover:text-white transition-colors"><VolumeX size={24}/></button>
            <button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-transform hover:scale-105">
              {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>
            <button className="text-gray-400 hover:text-white transition-colors"><Volume1 size={24}/></button>
          </div>
        </div>

        {/* МІКШЕР */}
        <div className="lg:col-span-2 bg-[#121214] border border-white/5 p-6 rounded-3xl flex flex-col shadow-lg">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Volume2 className="text-emerald-400" size={20} /> Маршрутизація звуку (Зони)
          </h2>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            {zones.map(zone => (
              <div key={zone.id} className={`p-4 rounded-2xl border transition-colors flex flex-col sm:flex-row sm:items-center gap-4 ${zone.active ? 'bg-white/5 border-white/10' : 'bg-black/20 border-white/5 opacity-60'}`}>
                <div className="w-full sm:w-1/3">
                  <div className="font-semibold text-gray-200">{zone.name}</div>
                  <button onClick={() => toggleLessonPlay(zone.id)} className={`mt-2 text-[10px] uppercase font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors w-max ${zone.playOnLessons ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-black/50 text-gray-500 border border-white/5 hover:text-gray-300'}`}>
                    {zone.playOnLessons ? <ToggleRight size={16}/> : <ToggleLeft size={16}/>}
                    Трансляція під час уроків: {zone.playOnLessons ? 'ТАК' : 'НІ'}
                  </button>
                </div>
                <div className="flex-1 flex items-center gap-4">
                  <button onClick={() => toggleMute(zone.id)} className={`p-2 rounded-lg transition-colors ${zone.muted ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}>
                    {zone.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <input type="range" min="0" max="100" value={zone.muted ? 0 : zone.volume} onChange={(e) => handleVolumeChange(zone.id, e.target.value)} className="flex-1 h-2 bg-black rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  <div className="w-10 text-right font-mono text-sm text-gray-400">{zone.muted ? '0' : zone.volume}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* РОЗКЛАД ПОДІЙ */}
        <div className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-lg">
          <div className="p-4 sm:p-6 border-b border-white/5 bg-black/20 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Calendar className="text-purple-400" size={20}/> Розклад подій</h2>
            
            <div className="flex items-center gap-2 flex-wrap">
              <select value={activeScheduleId} onChange={(e) => setActiveScheduleId(e.target.value)} className="bg-black/50 border border-white/10 rounded-lg py-1.5 px-3 text-sm text-white focus:border-blue-500 outline-none cursor-pointer max-w-[180px] truncate">
                {schedules.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              
              <button onClick={() => setIsNewScheduleModalOpen(true)} className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-gray-300" title="Створити новий розклад">
                <Plus size={16}/>
              </button>

              <div className="w-px h-6 bg-white/10 mx-1"></div>

              {/* КНОПКА БЛОКУВАННЯ РЕДАГУВАННЯ */}
              <button 
                onClick={() => setIsScheduleLocked(!isScheduleLocked)} 
                className={`p-1.5 rounded-lg border transition-all flex items-center gap-1.5 text-sm font-medium ${isScheduleLocked ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}
                title={isScheduleLocked ? "Розблокувати редагування" : "Заблокувати редагування"}
              >
                {isScheduleLocked ? <Lock size={16}/> : <Unlock size={16}/>}
              </button>

              {!isScheduleLocked && (
                <button onClick={() => openEventEditor()} className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1">
                  <Plus size={16}/> Подія
                </button>
              )}
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[450px]">
            {currentSchedule?.events.length === 0 ? (
              <div className="text-center text-gray-500 py-10">Цей розклад поки що порожній.</div>
            ) : (
              <div className="relative border-l-2 border-white/10 ml-3 space-y-6 pb-2">
                {currentSchedule?.events.map((item, idx) => (
                  <div key={item.id} className="relative pl-6 group">
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-[#121214] bg-gray-600"></div>
                    <div className="p-4 rounded-xl border border-white/5 bg-black/30 hover:border-white/10 transition-colors relative">
                      
                      {/* Кнопки Редагування/Видалення (тільки якщо розблоковано) */}
                      {!isScheduleLocked && (
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEventEditor(item)} className="bg-black/50 text-gray-400 hover:text-blue-400 p-1.5 rounded-md"><Edit2 size={16}/></button>
                          <button onClick={(e) => handleDeleteEvent(item.id, e)} className="bg-black/50 text-gray-400 hover:text-red-400 p-1.5 rounded-md"><Trash2 size={16}/></button>
                        </div>
                      )}

                      <div className="flex items-start mb-2 pr-16">
                        <div className="text-lg font-bold text-white mr-4 whitespace-nowrap">{item.startTime} - {item.endTime}</div>
                        <div className="flex flex-wrap gap-1">
                          {item.zones.map(z => (<span key={z} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300" title={zones.find(iz => iz.id === z)?.name}>{z.toUpperCase()}</span>))}
                        </div>
                      </div>
                      <div className="font-semibold text-gray-200 text-sm mb-1">{item.title}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1.5">
                        {item.type === 'bell' ? <Bell size={12} className="text-emerald-400"/> : <ListMusic size={12} className="text-purple-400"/>} 
                        {item.track} 
                        {item.shuffle && <span className="flex items-center gap-0.5 text-blue-400 ml-2"><Shuffle size={10}/> Рандом</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* МЕДІАТЕКА ТА ПЛЕЙЛИСТИ */}
        <div className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-lg">
          <div className="p-0 border-b border-white/5 bg-black/20 flex flex-col">
            <div className="p-6 pb-4 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><FolderOpen className="text-emerald-400" size={20}/> Медіа-файли</h2>
              <button className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"><UploadCloud size={16}/> Завантажити</button>
            </div>
            <div className="flex px-6 gap-6">
              <button onClick={() => setMediaTab('tracks')} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${mediaTab === 'tracks' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>Окремі треки / Дзвінки</button>
              <button onClick={() => setMediaTab('playlists')} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${mediaTab === 'playlists' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>Плейлисти</button>
            </div>
          </div>
          <div className="p-4 space-y-2 overflow-y-auto max-h-[400px]">
            {mediaTab === 'tracks' ? (
              mediaLibrary.map(media => (
                <div key={media.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-colors group">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setPlayingMediaId(playingMediaId === media.id ? null : media.id)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${playingMediaId === media.id ? 'bg-blue-500 text-white' : 'bg-black/50 text-gray-400 group-hover:text-white group-hover:bg-white/10'}`}>
                      {playingMediaId === media.id ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                    </button>
                    <div>
                      <div className="font-medium text-gray-200 text-sm">{media.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${media.type === 'bell' ? 'bg-blue-500/20 text-blue-400' : media.type === 'alert' ? 'bg-red-500/20 text-red-400' : 'bg-purple-500/20 text-purple-400'}`}>{media.type}</span>
                        {media.duration}
                      </div>
                    </div>
                  </div>
                  <button className="p-1.5 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                </div>
              ))
            ) : (
              playlists.map(pl => (
                <div key={pl.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center"><ListMusic size={20}/></div>
                    <div>
                      <div className="font-medium text-gray-200 text-sm">{pl.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                        <span>{pl.tracks} треків</span> • <span>{pl.duration}</span>
                        {pl.shuffle && <span className="text-blue-400 flex items-center gap-0.5"><Shuffle size={10}/> Shuffle</span>}
                      </div>
                    </div>
                  </div>
                  <button className="text-sm bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">Редагувати</button>
                </div>
              ))
            )}
            {mediaTab === 'playlists' && (
              <button onClick={() => setIsPlaylistModalOpen(true)} className="w-full mt-4 py-3 border-2 border-dashed border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 rounded-xl text-sm font-medium text-gray-400 hover:text-purple-400 transition-colors flex items-center justify-center gap-2">
                <Plus size={16}/> Створити новий плейлист
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- МОДАЛКИ --- */}

      {/* 1. РЕДАКТОР РОЗКЛАДУ */}
      {isEventModalOpen && editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121214] border border-white/10 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><Clock className="text-blue-400" size={24}/> {editingEvent.id ? 'Редагувати подію' : 'Нова подія'}</h2>
              <button onClick={() => setIsEventModalOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Час початку</label>
                  <input type="time" value={editingEvent.startTime} onChange={e => setEditingEvent({...editingEvent, startTime: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none text-lg font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Час закінчення</label>
                  <input type="time" value={editingEvent.endTime} onChange={e => setEditingEvent({...editingEvent, endTime: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none text-lg font-bold" />
                </div>
                <div className="col-span-2 mt-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Назва події</label>
                  <input type="text" value={editingEvent.title} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} placeholder="Напр. Велика перерва" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none" />
                </div>
              </div>

              <div className="border-t border-white/5 pt-6">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Джерело аудіо</label>
                <div className="flex gap-4 mb-4">
                  <button onClick={() => setEditingEvent({...editingEvent, type: 'bell'})} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border flex justify-center items-center gap-2 transition-all ${editingEvent.type === 'bell' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-black/30 border-white/5 text-gray-500 hover:bg-white/5'}`}>
                    <Bell size={16}/> Одиночний Дзвінок
                  </button>
                  <button onClick={() => setEditingEvent({...editingEvent, type: 'playlist'})} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border flex justify-center items-center gap-2 transition-all ${editingEvent.type === 'playlist' ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' : 'bg-black/30 border-white/5 text-gray-500 hover:bg-white/5'}`}>
                    <ListMusic size={16}/> Фоновий Плейлист
                  </button>
                </div>
                <select value={editingEvent.track} onChange={e => setEditingEvent({...editingEvent, track: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none cursor-pointer">
                  {editingEvent.type === 'bell' 
                    ? mediaLibrary.filter(m => m.type === 'bell').map(m => <option key={m.id} value={m.name}>{m.name}</option>)
                    : playlists.map(p => <option key={p.id} value={p.name}>{p.name}</option>)
                  }
                </select>
                {editingEvent.type === 'playlist' && (
                  <label className="flex items-center gap-2 mt-4 cursor-pointer text-gray-300 hover:text-white transition-colors">
                    <input type="checkbox" checked={editingEvent.shuffle} onChange={e => setEditingEvent({...editingEvent, shuffle: e.target.checked})} className="w-4 h-4 accent-purple-500 rounded bg-black border-white/10" />
                    <Shuffle size={16} className="text-purple-400"/> Щодня перемішувати порядок треків
                  </label>
                )}
              </div>
              <div className="border-t border-white/5 pt-6">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Зони трансляції</label>
                <div className="flex flex-wrap gap-3">
                  {zones.map(zone => (
                    <button key={zone.id} onClick={() => toggleEventZone(zone.id)} className={`px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-2 transition-all ${editingEvent.zones.includes(zone.id) ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-black/30 border-white/5 text-gray-500 hover:bg-white/5'}`}>
                      {editingEvent.zones.includes(zone.id) ? <CheckSquare size={16}/> : <Square size={16}/>} {zone.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end gap-3">
              <button onClick={() => setIsEventModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Скасувати</button>
              <button onClick={handleSaveEvent} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium flex items-center gap-2 shadow-lg transition-colors"><Save size={18} /> Зберегти в розклад</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. СТВОРЕННЯ НОВОГО РОЗКЛАДУ */}
      {isNewScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121214] border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><Calendar className="text-blue-400" size={24}/> Новий розклад</h2>
              <button onClick={() => setIsNewScheduleModalOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="p-6">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Назва розкладу</label>
              <input type="text" value={newScheduleTitle} onChange={(e) => setNewScheduleTitle(e.target.value)} placeholder="Напр. Святковий або Карантин" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none" autoFocus />
            </div>
            <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end gap-3">
              <button onClick={() => setIsNewScheduleModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Скасувати</button>
              <button onClick={handleCreateSchedule} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium flex items-center gap-2 shadow-lg transition-colors"><Save size={18} /> Створити</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ГЛОБАЛЬНІ НАЛАШТУВАННЯ АУДІО */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121214] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><Sliders className="text-blue-400" size={24}/> Налаштування звуку</h2>
              <button onClick={() => setIsSettingsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <label className="flex items-center justify-between cursor-pointer group p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div>
                  <div className="text-sm text-white font-medium">Плавний перехід (Crossfade)</div>
                  <div className="text-xs text-gray-500">Затухання 3 сек між треками плейлиста</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-500 rounded bg-black border-white/10" />
              </label>
              <label className="flex items-center justify-between cursor-pointer group p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div>
                  <div className="text-sm text-white font-medium">Аудіо-Ducking (Мікрофон)</div>
                  <div className="text-xs text-gray-500">Авто-приглушення фону під час оголошень</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-500 rounded bg-black border-white/10" />
              </label>
              <label className="flex items-center justify-between cursor-pointer group p-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                <div>
                  <div className="text-sm text-red-400 font-medium">Максимальний пріоритет тривоги</div>
                  <div className="text-xs text-red-500/70">Ігнорувати всі Mute та грати на 100% гучності</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-red-500 rounded bg-black border-red-500/30" />
              </label>
            </div>
            <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end gap-3">
              <button onClick={() => setIsSettingsModalOpen(false)} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors">Зберегти</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. СТВОРЕННЯ ПЛЕЙЛИСТА */}
      {isPlaylistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121214] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><FolderOpen className="text-emerald-400" size={24}/> Новий плейлист</h2>
              <button onClick={() => setIsPlaylistModalOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Назва плейлиста</label>
                <input type="text" placeholder="Напр. Святковий" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 mt-4">Оберіть треки</label>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  {mediaLibrary.filter(m => m.type === 'music').map(m => (
                    <label key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-transparent hover:border-white/10 cursor-pointer transition-colors">
                      <input type="checkbox" className="w-4 h-4 accent-emerald-500 rounded bg-black border-white/10" />
                      <div className="text-sm text-gray-200">{m.name}</div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end gap-3">
              <button onClick={() => setIsPlaylistModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Скасувати</button>
              <button onClick={() => setIsPlaylistModalOpen(false)} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium flex items-center gap-2 shadow-lg transition-colors"><Save size={18} /> Створити</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
