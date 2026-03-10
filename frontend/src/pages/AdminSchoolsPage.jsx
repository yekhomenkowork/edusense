import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Search, Edit2, Trash2, X, MapPin, Key, User, ShieldCheck } from 'lucide-react';

const ukraineLocations = {
  "Київська": ["Київ", "Бровари", "Біла Церква"],
  "Львівська": ["Львів", "Дрогобич", "Стрий"],
  "Одеська": ["Одеса", "Ізмаїл", "Чорноморськ"],
  "Івано-Франківська": ["Івано-Франківськ", "Калуш"],
  "Дніпропетровська": ["Дніпро", "Кривий Ріг"]
};

const initialSchools = [
  { id: '101', name: 'Ліцей №1 Інтелект', city: 'Київ', devices: 45, plan: 'Premium', status: 'Активна' },
  { id: '102', name: 'Гімназія №4', city: 'Львів', devices: 12, plan: 'Basic', status: 'Активна' },
  { id: '103', name: 'Спеціалізована школа №12', city: 'Одеса', devices: 0, plan: 'Trial', status: 'Налаштування' },
  { id: '104', name: 'Ліцей №22', city: 'Дніпро', devices: 8, plan: 'Basic', status: 'Активна' },
  { id: '105', name: 'Школа №5', city: 'Івано-Франківськ', devices: 0, plan: 'Premium', status: 'Призупинено' },
];

export default function AdminSchoolsPage() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState(initialSchools);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(Object.keys(ukraineLocations)[0]);

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) || school.id.includes(searchQuery);
    const matchesPlan = filterPlan === 'all' || school.plan === filterPlan;
    const matchesStatus = filterStatus === 'all' || school.status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Управління школами</h1>
          <p className="text-gray-400">Список підключених навчальних закладів та їх статус</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
          <Plus size={18} /> Додати заклад
        </button>
      </div>

      <div className="bg-[#121214] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input type="text" placeholder="Пошук за назвою або ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
        </div>
        <div className="flex gap-4">
          <select value={filterPlan} onChange={(e) => setFilterPlan(e.target.value)} className="bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
            <option value="all">Усі підписки</option><option value="Premium">Premium</option><option value="Basic">Basic</option><option value="Trial">Trial</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
            <option value="all">Усі статуси</option><option value="Активна">Активна</option><option value="Налаштування">Налаштування</option><option value="Призупинено">Призупинено</option>
          </select>
        </div>
      </div>
      
      <div className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/20 text-gray-400">
              <tr>
                <th className="p-4 font-medium">ID / Назва</th>
                <th className="p-4 font-medium">Локація</th>
                <th className="p-4 font-medium">Пристрої IoT</th>
                <th className="p-4 font-medium">Підписка</th>
                <th className="p-4 font-medium">Статус</th>
                <th className="p-4 font-medium text-right">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSchools.map((school) => (
                <tr 
                  key={school.id} 
                  onClick={() => navigate(`/dashboard/schools/${school.id}`)} 
                  className="hover:bg-white/[0.04] transition-colors group cursor-pointer"
                >
                  <td className="p-4">
                    <div className="font-semibold text-white flex items-center gap-2"><Building2 size={16} className="text-blue-400" /> {school.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">ID: #{school.id}</div>
                  </td>
                  <td className="p-4 text-gray-300">{school.city}</td>
                  <td className="p-4 text-gray-300">{school.devices} шт.</td>
                  <td className="p-4"><span className={`px-2.5 py-1 rounded-md text-xs font-medium ${school.plan === 'Premium' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>{school.plan}</span></td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${school.status === 'Активна' ? 'bg-emerald-500' : 'bg-yellow-500'}`}></div>
                      <span className={school.status === 'Активна' ? 'text-emerald-400' : 'text-yellow-400'}>{school.status}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors" onClick={(e) => e.stopPropagation()}><Edit2 size={16} /></button>
                      <button className="p-1.5 text-gray-400 hover:text-red-400 transition-colors" onClick={(e) => e.stopPropagation()}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Повноцінне модальне вікно "Додати школу" */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 className="text-blue-400" /> Реєстрація нового закладу
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-8">
              
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <MapPin size={16}/> 1. Інформація про заклад
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1.5">Повна назва закладу</label>
                    <input type="text" placeholder="Наприклад: Ліцей №1" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Область</label>
                    <select 
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none cursor-pointer"
                    >
                      {Object.keys(ukraineLocations).map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Місто / Населений пункт</label>
                    <select className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none cursor-pointer">
                      {ukraineLocations[selectedRegion].map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Key size={16}/> 2. Технічні доступи (MQTT/IoT)
                </h3>
                <p className="text-xs text-gray-500 mb-4">Ці дані будуть прошиватися в пристрої (ESP32) для зв'язку з брокером.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">MQTT Логін (Device ID)</label>
                    <input type="text" placeholder="school_104_devices" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none font-mono text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">MQTT Пароль</label>
                    <input type="text" placeholder="Згенерувати автоматично..." className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none font-mono text-sm" />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <User size={16}/> 3. Акаунт Директора (School Admin)
                </h3>
                <p className="text-xs text-gray-500 mb-4">Цей акаунт використовуватиметься для входу в веб-панель закладу.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Email (Логін)</label>
                    <input type="email" placeholder="director@school.com" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Пароль доступу</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none" />
                  </div>
                </div>
              </section>

            </div>

            <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Скасувати
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium flex items-center gap-2 shadow-lg transition-colors"
              >
                <ShieldCheck size={18} /> Створити заклад
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
