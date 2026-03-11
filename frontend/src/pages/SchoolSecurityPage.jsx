import React, { useState } from 'react';
import { ShieldAlert, Flame, Siren, Lock, Unlock, Zap, Plus, Play, CheckCircle2, AlertTriangle, Radio, Smartphone, Activity, Lightbulb, DoorOpen, Settings2, X, Save, BellRing, Trash2 } from 'lucide-react';

// --- МОКОВІ ДАНІ ---
const initialScenarios = [
  { 
    id: 'sc1', name: 'Повітряна тривога', trigger: 'Автоматично (API eTryvoga)', type: 'air_raid',
    actions: { audio: 'Сирена + Голос (Укриття)', doors: 'Відкрити турнікети', led: 'Червоні вказівники', push: true }
  },
  { 
    id: 'sc2', name: 'Пожежна евакуація', trigger: 'Датчики диму / Ручна кнопка', type: 'fire',
    actions: { audio: 'Пожежна сирена', doors: 'Розблокувати всі двері', led: 'Динамічна евакуація', push: true }
  },
  { 
    id: 'sc3', name: 'Вторгнення (Lockdown)', trigger: 'Тільки вручну', type: 'lockdown',
    actions: { audio: 'Тихе сповіщення охорони', doors: 'Блокувати всі входи', led: 'Вимкнути освітлення', push: true }
  },
  { 
    id: 'sc4', name: 'Відбій тривоги', trigger: 'Автоматично / Вручну', type: 'clear',
    actions: { audio: 'Голос (Відбій)', doors: 'Штатний режим', led: 'Зелене світло 5 хв', push: false }
  }
];

export default function SchoolSecurityPage() {
  const [scenarios, setScenarios] = useState(initialScenarios);
  const [activeAlarm, setActiveAlarm] = useState(null); // Зберігає ID активної тривоги
  const [autoAirRaid, setAutoAirRaid] = useState(true);
  
  // Модалки
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmingScenario, setConfirmingScenario] = useState(null);
  
  // Редактор
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState(null);

  // --- ФУНКЦІЇ ТРИВОГИ ---
  const triggerAlarm = (scenario) => {
    if (scenario.type === 'clear') {
      setActiveAlarm(null);
      return;
    }
    setConfirmingScenario(scenario);
    setIsConfirmOpen(true);
  };

  const confirmTrigger = () => {
    setActiveAlarm(confirmingScenario.id);
    setIsConfirmOpen(false);
    setConfirmingScenario(null);
  };

  // --- ФУНКЦІЇ РЕДАКТОРА ---
  const openEditor = (scenario = null) => {
    if (scenario) {
      setEditingScenario({ ...scenario }); // Копіюємо для редагування
    } else {
      // Шаблон для нового
      setEditingScenario({
        id: 'sc_' + Date.now(),
        name: '',
        trigger: 'Вручну',
        type: 'custom',
        actions: { audio: 'Вимкнено', doors: 'Не змінювати', led: 'Вимкнено', push: false }
      });
    }
    setIsEditorOpen(true);
  };

  const saveScenario = () => {
    if (!editingScenario.name.trim()) return alert("Введіть назву сценарію!");
    
    setScenarios(prev => {
      const exists = prev.find(s => s.id === editingScenario.id);
      if (exists) {
        return prev.map(s => s.id === editingScenario.id ? editingScenario : s);
      }
      return [...prev, editingScenario];
    });
    setIsEditorOpen(false);
  };

  const deleteScenario = (id) => {
    if (window.confirm("Дійсно видалити цей сценарій?")) {
      setScenarios(prev => prev.filter(s => s.id !== id));
      setIsEditorOpen(false);
    }
  };

  // Допоміжна функція для іконок/кольорів
  const getTypeStyles = (type) => {
    switch(type) {
      case 'air_raid': return { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: <Siren size={24}/> };
      case 'fire': return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: <Flame size={24}/> };
      case 'lockdown': return { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: <Lock size={24}/> };
      case 'clear': return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: <Unlock size={24}/> };
      default: return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: <Zap size={24}/> };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3"><ShieldAlert className="text-blue-400" size={32}/> Сценарії безпеки</h1>
          <p className="text-gray-400">Управління алгоритмами дій при надзвичайних ситуаціях</p>
        </div>
      </div>

      {/* ГОЛОВНИЙ СТАТУС БАР */}
      <div className={`p-6 md:p-8 rounded-[2rem] border transition-all duration-500 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 ${activeAlarm ? 'bg-red-950/40 border-red-500/50 shadow-[0_0_50px_rgba(220,38,38,0.2)]' : 'bg-[#121214] border-white/5 shadow-lg'}`}>
        {activeAlarm && <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>}
        
        <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 ${activeAlarm ? 'bg-red-500/20 text-red-500 border border-red-500/50 animate-pulse' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
            {activeAlarm ? <Siren size={40} /> : <CheckCircle2 size={40} />}
          </div>
          <div>
            <h2 className={`text-2xl font-bold mb-1 ${activeAlarm ? 'text-red-400' : 'text-white'}`}>
              {activeAlarm ? scenarios.find(s => s.id === activeAlarm)?.name.toUpperCase() : 'СИСТЕМА В НОРМІ'}
            </h2>
            <p className={activeAlarm ? 'text-red-300' : 'text-gray-400'}>
              {activeAlarm ? 'Виконується протокол безпеки. Усі підсистеми активовано.' : 'Загроз не виявлено. Моніторинг активний.'}
            </p>
          </div>
        </div>

        {/* Швидкі дії */}
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {activeAlarm ? (
            <button onClick={() => triggerAlarm({type: 'clear'})} className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2 flex-shrink-0">
              <Unlock size={20} /> ДАТИ ВІДБІЙ
            </button>
          ) : (
            scenarios.slice(0, 3).map(s => {
              const styles = getTypeStyles(s.type);
              return (
                <button key={s.id} onClick={() => triggerAlarm(s)} className={`px-5 py-4 ${styles.bg} hover:opacity-80 border ${styles.border} ${styles.color} rounded-xl font-bold transition-all flex items-center gap-2 flex-shrink-0`}>
                  {React.cloneElement(styles.icon, { size: 20 })} {s.name.split(' ')[0]}
                </button>
              )
            })
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* АВТОМАТИКА ТА СЕНСОРИ */}
        <div className="bg-[#121214] border border-white/5 p-6 rounded-3xl flex flex-col gap-6 shadow-lg">
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><Activity className="text-blue-400" size={20}/> Автоматика та Тригери</h2>
          
          <div className="p-4 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-200 text-sm">Інтеграція eTryvoga</div>
              <div className="text-xs text-gray-500 mt-1">Авто-запуск сирени при тривозі</div>
            </div>
            <button onClick={() => setAutoAirRaid(!autoAirRaid)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoAirRaid ? 'bg-blue-600' : 'bg-gray-700'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoAirRaid ? 'translate-x-6' : 'translate-x-1'}`}/>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 flex items-center gap-2"><Flame size={16}/> Датчики диму</span>
              <span className="text-emerald-400 font-mono">12 / 12 ОК</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-full"></div></div>

            <div className="flex justify-between items-center text-sm pt-2">
              <span className="text-gray-400 flex items-center gap-2"><Radio size={16}/> Тривожні кнопки</span>
              <span className="text-emerald-400 font-mono">4 / 4 ОК</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-full"></div></div>
          </div>
        </div>

        {/* СПИСОК СЦЕНАРІЇВ */}
        <div className="lg:col-span-2 bg-[#121214] border border-white/5 p-6 rounded-3xl flex flex-col shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Zap className="text-emerald-400" size={20}/> Алгоритми (Сценарії)</h2>
            <button onClick={() => openEditor(null)} className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1">
              <Plus size={16}/> Додати
            </button>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {scenarios.map(scenario => {
              const styles = getTypeStyles(scenario.type);
              return (
                <div key={scenario.id} className="p-5 rounded-2xl border border-white/5 bg-black/30 hover:border-white/10 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${styles.bg} ${styles.color}`}>
                      {styles.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-200">{scenario.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">Тригер: {scenario.trigger}</p>
                      
                      {/* Іконки дій */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-2 py-1 rounded" title="Аудіо"><BellRing size={12} className="text-blue-400"/> {scenario.actions.audio}</div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-2 py-1 rounded" title="Двері"><DoorOpen size={12} className="text-emerald-400"/> {scenario.actions.doors}</div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-2 py-1 rounded" title="LED"><Lightbulb size={12} className="text-yellow-400"/> {scenario.actions.led}</div>
                        {scenario.actions.push && <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-2 py-1 rounded" title="Сповіщення"><Smartphone size={12} className="text-purple-400"/> Push</div>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <button onClick={() => openEditor(scenario)} className="flex-1 sm:flex-none p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-blue-400 rounded-xl transition-colors" title="Налаштувати параметри">
                      <Settings2 size={18}/>
                    </button>
                    <button onClick={() => triggerAlarm(scenario)} disabled={activeAlarm === scenario.id} className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${activeAlarm === scenario.id ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'}`}>
                      <Play size={16} fill="currentColor"/> {activeAlarm === scenario.id ? 'Активно' : 'Запустити'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- МОДАЛЬНЕ ВІКНО: ПІДТВЕРДЖЕННЯ ТРИВОГИ --- */}
      {isConfirmOpen && confirmingScenario && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-red-950/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#121214] border border-red-500/30 rounded-3xl w-full max-w-md p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500 animate-pulse"></div>
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <AlertTriangle size={48} className="text-red-500 animate-pulse" />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2 uppercase">Підтвердіть запуск</h2>
            <p className="text-red-300 mb-2 font-bold text-lg">{confirmingScenario.name}</p>
            <p className="text-gray-400 mb-8 text-sm">
              Ця дія активує вказані алгоритми ({confirmingScenario.actions.audio}, {confirmingScenario.actions.doors}).
            </p>
            <div className="flex gap-4">
              <button onClick={() => setIsConfirmOpen(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors">Скасувати</button>
              <button onClick={confirmTrigger} className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-colors">АктиВУВАТИ</button>
            </div>
          </div>
        </div>
      )}

      {/* --- МОДАЛЬНЕ ВІКНО: РЕДАКТОР СЦЕНАРІЮ --- */}
      {isEditorOpen && editingScenario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121214] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings2 className="text-emerald-400" size={24}/> Параметри сценарію
              </h2>
              <button onClick={() => setIsEditorOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Назва сценарію</label>
                  <input type="text" value={editingScenario.name} onChange={(e) => setEditingScenario({...editingScenario, name: e.target.value})} placeholder="Напр. Хімічна загроза" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Іконка / Тип</label>
                  <select value={editingScenario.type} onChange={(e) => setEditingScenario({...editingScenario, type: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none cursor-pointer">
                    <option value="air_raid">🚨 Повітряна тривога</option>
                    <option value="fire">🔥 Пожежна загроза</option>
                    <option value="lockdown">🔒 Блокування (Вторгнення)</option>
                    <option value="clear">✅ Відбій / Штатний режим</option>
                    <option value="custom">⚡ Інша загроза (Кастом)</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Алгоритми реагування:</h3>
                
                <div className="space-y-4">
                  {/* Аудіо */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-black/30 gap-4">
                    <div className="flex items-center gap-3">
                      <BellRing className="text-blue-400" size={20}/>
                      <div><div className="font-medium text-white text-sm">Аудіо-оповіщення</div><div className="text-xs text-gray-500">Що лунатиме з динаміків</div></div>
                    </div>
                    <select 
                      value={editingScenario.actions.audio} 
                      onChange={(e) => setEditingScenario({...editingScenario, actions: {...editingScenario.actions, audio: e.target.value}})}
                      className="bg-black/50 border border-white/10 rounded-lg text-sm text-white p-2.5 outline-none focus:border-blue-500 min-w-[220px] cursor-pointer"
                    >
                      <option value="Вимкнено">Вимкнено</option>
                      <option value="Сирена + Голос (Укриття)">Сирена + Голос (Укриття)</option>
                      <option value="Пожежна сирена">Пожежна сирена</option>
                      <option value="Тихе сповіщення охорони">Тихе сповіщення охорони</option>
                      <option value="Голос (Відбій)">Голос (Відбій)</option>
                    </select>
                  </div>

                  {/* СКУД (Двері) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-black/30 gap-4">
                    <div className="flex items-center gap-3">
                      <DoorOpen className="text-emerald-400" size={20}/>
                      <div><div className="font-medium text-white text-sm">СКУД (Двері та Турнікети)</div><div className="text-xs text-gray-500">Контроль доступу</div></div>
                    </div>
                    <select 
                      value={editingScenario.actions.doors} 
                      onChange={(e) => setEditingScenario({...editingScenario, actions: {...editingScenario.actions, doors: e.target.value}})}
                      className="bg-black/50 border border-white/10 rounded-lg text-sm text-white p-2.5 outline-none focus:border-emerald-500 min-w-[220px] cursor-pointer"
                    >
                      <option value="Не змінювати">Не змінювати</option>
                      <option value="Відкрити турнікети">Відкрити турнікети</option>
                      <option value="Розблокувати всі двері">Розблокувати всі двері</option>
                      <option value="Блокувати всі входи">Блокувати всі входи</option>
                      <option value="Штатний режим">Штатний режим</option>
                    </select>
                  </div>

                  {/* LED */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-black/30 gap-4">
                    <div className="flex items-center gap-3">
                      <Lightbulb className="text-yellow-400" size={20}/>
                      <div><div className="font-medium text-white text-sm">Вказівники (LED)</div><div className="text-xs text-gray-500">Світлова індикація</div></div>
                    </div>
                    <select 
                      value={editingScenario.actions.led} 
                      onChange={(e) => setEditingScenario({...editingScenario, actions: {...editingScenario.actions, led: e.target.value}})}
                      className="bg-black/50 border border-white/10 rounded-lg text-sm text-white p-2.5 outline-none focus:border-yellow-500 min-w-[220px] cursor-pointer"
                    >
                      <option value="Вимкнено">Вимкнено</option>
                      <option value="Червоні вказівники">Червоні вказівники</option>
                      <option value="Динамічна евакуація">Динамічна евакуація (Стрілки)</option>
                      <option value="Вимкнути освітлення">Вимкнути освітлення</option>
                      <option value="Зелене світло 5 хв">Зелене світло 5 хв (Безпечно)</option>
                    </select>
                  </div>

                  {/* Push */}
                  <label className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/30 cursor-pointer hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <Smartphone className="text-purple-400" size={20}/>
                      <div><div className="font-medium text-white text-sm">Push/SMS Розсилка</div><div className="text-xs text-gray-500">Сповістити персонал та батьків</div></div>
                    </div>
                    <input type="checkbox" checked={editingScenario.actions.push} onChange={(e) => setEditingScenario({...editingScenario, actions: {...editingScenario.actions, push: e.target.checked}})} className="w-5 h-5 accent-purple-500 rounded bg-black border-white/10 cursor-pointer" />
                  </label>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/5 bg-black/20 flex justify-between items-center">
              {/* Кнопка видалення (показуємо тільки якщо це існуючий сценарій, і не базовий "clear") */}
              {editingScenario.id.startsWith('sc') && editingScenario.type !== 'clear' ? (
                <button onClick={() => deleteScenario(editingScenario.id)} className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1 transition-colors">
                  <Trash2 size={16}/> Видалити
                </button>
              ) : <div></div>}

              <div className="flex gap-3">
                <button onClick={() => setIsEditorOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Скасувати</button>
                <button onClick={saveScenario} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium flex items-center gap-2 shadow-lg transition-colors"><Save size={18} /> Зберегти</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
