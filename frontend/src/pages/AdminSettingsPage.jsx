import React from 'react';
import { Server, Wifi, ShieldCheck, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Глобальні налаштування</h1>
          <p className="text-gray-400">Системні параметри ядра EduSense OS</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2">
          <Save size={18} /> Зберегти зміни
        </button>
      </div>

      <div className="bg-[#121214] border border-white/5 p-6 rounded-3xl space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <Server className="text-purple-400" size={24} />
          <h2 className="text-xl font-bold text-white">Брокер MQTT (Потокові дані)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Адреса сервера (Host)</label>
            <input type="text" defaultValue="mqtt.edusense.local" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Порт</label>
            <input type="text" defaultValue="1883" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none" />
          </div>
        </div>
      </div>

      <div className="bg-[#121214] border border-white/5 p-6 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <Wifi className="text-blue-400" size={24} />
            <h2 className="text-xl font-bold text-white">OTA Оновлення прошивок</h2>
          </div>
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors text-white">
            Форсувати оновлення всіх ESP32
          </button>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Поточна стабільна версія прошивки</label>
          <input type="text" disabled defaultValue="v2.1.4-stable" className="w-full max-w-md bg-black/30 border border-white/5 rounded-xl py-2.5 px-4 text-gray-500 outline-none" />
        </div>
      </div>
    </div>
  );
}
