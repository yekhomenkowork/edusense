import React, { useState, useEffect } from 'react';
import { Server, Wifi, ShieldCheck, Save, UploadCloud, Cpu, Layers, PlayCircle, CheckCircle2, AlertTriangle, FileCode } from 'lucide-react';

// Мокова статистика прошивок
const firmwareStats = [
  { version: 'v2.1.4-stable', devices: 720, color: 'bg-emerald-500' },
  { version: 'v2.1.3', devices: 100, color: 'bg-blue-500' },
  { version: 'v2.0.1 (Legacy)', devices: 30, color: 'bg-yellow-500' },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('system'); // 'system' або 'ota'
  
  // Стейт для OTA
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetAudience, setTargetAudience] = useState('all');
  const [batchSize, setBatchSize] = useState(50);
  
  // Стейт симуляції деплою
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);

  // Симуляція прогресу оновлення
  useEffect(() => {
    let interval;
    if (isDeploying && deployProgress < 100) {
      interval = setInterval(() => {
        setDeployProgress(prev => {
          if (prev >= 100) {
            setIsDeploying(false);
            return 100;
          }
          return prev + Math.floor(Math.random() * 15) + 5;
        });
      }, 800);
    } else if (deployProgress >= 100) {
      setTimeout(() => { setIsDeploying(false); setDeployProgress(0); setSelectedFile(null); }, 3000);
    }
    return () => clearInterval(interval);
  }, [isDeploying, deployProgress]);

  const startDeployment = () => {
    if (!selectedFile) return alert('Будь ласка, завантажте файл прошивки (.bin)');
    setIsDeploying(true);
    setDeployProgress(0);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Глобальні налаштування</h1>
          <p className="text-gray-400">Керування ядром системи та бездротовими оновленнями пристроїв</p>
        </div>
        {activeTab === 'system' && (
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            <Save size={18} /> Зберегти налаштування
          </button>
        )}
      </div>

      {/* Вкладки */}
      <div className="flex border-b border-white/10">
        <button onClick={() => setActiveTab('system')} className={`px-6 py-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'system' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}>
          <Server size={18} /> Системні параметри
        </button>
        <button onClick={() => setActiveTab('ota')} className={`px-6 py-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'ota' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-white'}`}>
          <Wifi size={18} /> OTA Оновлення (Firmware)
        </button>
      </div>

      {/* ВКЛАДКА 1: СИСТЕМНІ ПАРАМЕТРИ */}
      {activeTab === 'system' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-[#121214] border border-white/5 p-6 rounded-3xl space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Layers className="text-blue-400" size={24} />
              <h2 className="text-xl font-bold text-white">Зв'язок з брокером (MQTT)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm text-gray-400 mb-2">Host (Адреса)</label><input type="text" defaultValue="mqtt.edusense.local" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none" /></div>
              <div><label className="block text-sm text-gray-400 mb-2">Порт (WSS)</label><input type="text" defaultValue="8084" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none" /></div>
              <div><label className="block text-sm text-gray-400 mb-2">Global Username</label><input type="text" defaultValue="admin_core" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none" /></div>
              <div><label className="block text-sm text-gray-400 mb-2">Global Password</label><input type="password" defaultValue="********" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none" /></div>
            </div>
          </div>

          <div className="bg-[#121214] border border-white/5 p-6 rounded-3xl space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <ShieldCheck className="text-emerald-400" size={24} />
              <h2 className="text-xl font-bold text-white">Безпека та Сесії</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm text-gray-400 mb-2">Час життя токену (JWT Expiry)</label>
                <select className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none cursor-pointer">
                  <option>12 годин</option><option selected>24 години</option><option>7 днів</option>
                </select>
              </div>
              <div><label className="block text-sm text-gray-400 mb-2">Рівень логування системи</label>
                <select className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none cursor-pointer">
                  <option>INFO (Стандартний)</option><option>WARN (Тільки помилки)</option><option>DEBUG (Детальний)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ВКЛАДКА 2: OTA ОНОВЛЕННЯ */}
      {activeTab === 'ota' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          
          {/* Статистика */}
          <div className="bg-[#121214] border border-white/5 p-6 rounded-3xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Cpu className="text-purple-400" size={20}/> Фрагментація прошивок (850 пристроїв)</h2>
            <div className="w-full h-4 rounded-full overflow-hidden flex mb-4">
              {firmwareStats.map((stat, i) => (
                <div key={i} className={`${stat.color} h-full`} style={{ width: `${(stat.devices / 850) * 100}%` }} title={`${stat.version}: ${stat.devices} шт.`}></div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              {firmwareStats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${stat.color}`}></div><span className="text-gray-300">{stat.version}</span><span className="text-gray-500">({stat.devices})</span></div>
              ))}
            </div>
          </div>

          {/* Форма завантаження та пушу */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Завантаження файлу */}
            <div className="bg-[#121214] border border-white/5 p-6 rounded-3xl flex flex-col">
              <h2 className="text-lg font-bold text-white mb-4">1. Завантаження нової збірки</h2>
              <div 
                className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-colors ${selectedFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 cursor-pointer'}`}
                onClick={() => setSelectedFile('edusense_fw_v2.2.0.bin')}
              >
                {selectedFile ? (
                  <>
                    <FileCode size={48} className="text-emerald-400 mb-4" />
                    <div className="text-emerald-400 font-bold">{selectedFile}</div>
                    <div className="text-xs text-gray-500 mt-2">Готово до деплою • 1.4 MB</div>
                    <button onClick={(e) => {e.stopPropagation(); setSelectedFile(null)}} className="mt-4 text-sm text-gray-400 hover:text-white">Скасувати</button>
                  </>
                ) : (
                  <>
                    <UploadCloud size={48} className="text-gray-600 mb-4" />
                    <div className="text-gray-300 font-medium mb-1">Натисніть, щоб обрати .bin файл</div>
                    <div className="text-xs text-gray-500">ESP32 Firmware (Max 4MB)</div>
                  </>
                )}
              </div>
            </div>

            {/* Налаштування деплою */}
            <div className="bg-[#121214] border border-white/5 p-6 rounded-3xl flex flex-col">
              <h2 className="text-lg font-bold text-white mb-4">2. Налаштування розгортання</h2>
              
              <div className="space-y-5 flex-1">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Цільова аудиторія</label>
                  <select value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 outline-none cursor-pointer">
                    <option value="all">Усі школи (Глобальне оновлення)</option>
                    <option value="school_101">Тільки: Ліцей №1 Інтелект</option>
                    <option value="school_102">Тільки: Гімназія №4</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Розмір пачки (Batch Size)</label>
                  <div className="text-xs text-gray-500 mb-3">Скільки пристроїв оновлюватимуться одночасно, щоб не перевантажити мережу.</div>
                  <div className="flex items-center gap-4">
                    <input type="range" min="10" max="200" step="10" value={batchSize} onChange={(e) => setBatchSize(e.target.value)} className="flex-1 accent-purple-500" />
                    <div className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white font-mono text-sm w-16 text-center">{batchSize}</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-200 flex items-start gap-3">
                  <AlertTriangle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                  Пристрої автоматично перезавантажаться після завантаження прошивки. Дзвінки та евакуація будуть недоступні ~15 секунд для кожної пачки.
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5">
                {!isDeploying && deployProgress === 0 ? (
                  <button onClick={startDeployment} disabled={!selectedFile} className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${selectedFile ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}>
                    <PlayCircle size={20} /> Почати розгортання
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-400 font-medium">{deployProgress < 100 ? 'Оновлення пристроїв...' : 'Успішно завершено!'}</span>
                      <span className="text-white font-bold">{deployProgress}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-500 h-full transition-all duration-300" style={{ width: `${deployProgress}%` }}></div>
                    </div>
                    <div className="text-xs text-gray-500 text-center mt-2">
                      {deployProgress < 100 ? `Оновлюється пачка з ${batchSize} пристроїв...` : 'Всі обрані пристрої використовують нову прошивку.'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
