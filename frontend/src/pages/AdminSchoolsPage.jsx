import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Search, Trash2, ShieldCheck, Activity, CreditCard } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const ukraineRegions = [
  "Вінницька", "Волинська", "Дніпропетровська", "Донецька", "Житомирська", 
  "Закарпатська", "Запорізька", "Івано-Франківська", "Київська", "Кіровоградська", 
  "Луганська", "Львівська", "Миколаївська", "Одеська", "Полтавська", "Рівненська", 
  "Сумська", "Тернопільська", "Харківська", "Херсонська", "Хмельницька", 
  "Черкаська", "Чернівецька", "Чернігівська", "м. Київ"
];

export default function AdminSchoolsPage() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';
  
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(ukraineRegions[0]);
  const [cityName, setCityName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchSchools = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/schools`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setSchools(data.map(school => ({ ...school, devices: 0 })));
      }
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchSchools(); }, []);

  const handleCreateSchool = async () => {
    if (!newSchoolName.trim() || !cityName.trim()) return alert('Введіть назву школи та місто');
    setIsCreating(true);
    try {
      const res = await fetch(`${API_URL}/schools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: newSchoolName, region: selectedRegion, city: cityName, plan: 'Trial', status: 'Налаштування' })
      });
      if (res.ok) {
        setIsModalOpen(false); setNewSchoolName(''); setCityName(''); fetchSchools();
      }
    } catch (error) { console.error(error); } finally { setIsCreating(false); }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Ви дійсно хочете видалити цю школу? Цю дію неможливо скасувати.")) return;
    try {
      const res = await fetch(`${API_URL}/schools/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchSchools();
    } catch (error) { console.error(error); }
  };

  const filteredSchools = schools.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.city.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toString() === searchQuery;
    const matchesPlan = filterPlan === 'all' || s.plan === filterPlan;
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const stats = {
    total: schools.length,
    active: schools.filter(s => s.status === 'Активна').length,
    premium: schools.filter(s => s.plan === 'Premium').length,
    trial: schools.filter(s => s.plan === 'Trial').length
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Управління школами</h1>
          <p className="text-gray-400">Список підключених навчальних закладів та їх статуси</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
          <Plus size={18} /> Додати заклад
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2 text-gray-400"><Building2 size={18}/> Всього шкіл</div>
          <div className="text-3xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-[#121214] border border-emerald-500/10 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2 text-emerald-400/80"><Activity size={18}/> Активні</div>
          <div className="text-3xl font-bold text-emerald-400">{stats.active}</div>
        </div>
        <div className="bg-[#121214] border border-purple-500/10 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2 text-purple-400/80"><ShieldCheck size={18}/> Premium тариф</div>
          <div className="text-3xl font-bold text-purple-400">{stats.premium}</div>
        </div>
        <div className="bg-[#121214] border border-blue-500/10 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2 text-blue-400/80"><CreditCard size={18}/> Trial період</div>
          <div className="text-3xl font-bold text-blue-400">{stats.trial}</div>
        </div>
      </div>

      <div className="bg-[#121214] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input type="text" placeholder="Пошук за назвою, містом або ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-blue-500 outline-none" />
        </div>
        <div className="flex gap-4">
          <select value={filterPlan} onChange={(e) => setFilterPlan(e.target.value)} className="bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:border-blue-500 outline-none cursor-pointer">
            <option value="all">Всі тарифи</option><option value="Trial">Trial</option><option value="Basic">Basic</option><option value="Premium">Premium</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:border-blue-500 outline-none cursor-pointer">
            <option value="all">Всі статуси</option><option value="Налаштування">Налаштування</option><option value="Активна">Активна</option><option value="Призупинено">Призупинено</option>
          </select>
        </div>
      </div>

      <div className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/20 text-gray-400">
            <tr>
              <th className="p-4 font-medium">ID / Назва</th>
              <th className="p-4 font-medium">Локація</th>
              <th className="p-4 font-medium">Підписка</th>
              <th className="p-4 font-medium">Статус</th>
              <th className="p-4 font-medium text-right">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? <tr><td colSpan="5" className="p-8 text-center text-gray-500">Завантаження...</td></tr> : 
             filteredSchools.length === 0 ? <tr><td colSpan="5" className="p-8 text-center text-gray-500">Шкіл не знайдено.</td></tr> :
             filteredSchools.map((school) => (
              <tr key={school.id} onClick={() => navigate(`/dashboard/schools/${school.id}`)} className="hover:bg-white/[0.04] cursor-pointer group">
                <td className="p-4">
                  <div className="font-semibold text-white">{school.name}</div>
                  <div className="text-xs text-gray-500">ID: #{school.id}</div>
                </td>
                <td className="p-4 text-gray-300">{school.city}, {school.region} обл.</td>
                <td className="p-4"><span className={`px-2.5 py-1 rounded-md text-xs font-medium ${school.plan === 'Premium' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>{school.plan}</span></td>
                <td className="p-4"><span className={`${school.status === 'Активна' ? 'text-emerald-400' : 'text-yellow-400'}`}>{school.status}</span></td>
                <td className="p-4 text-right">
                  <button onClick={(e) => handleDelete(e, school.id)} className="p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Додати новий заклад</h2>
            <div className="space-y-4 mb-8">
              <div><label className="text-sm text-gray-400 block mb-1">Назва закладу</label><input type="text" value={newSchoolName} onChange={e => setNewSchoolName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-blue-500" placeholder="Гімназія №1" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Область</label>
                  <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white outline-none">
                    {ukraineRegions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div><label className="text-sm text-gray-400 block mb-1">Місто/Село</label><input type="text" value={cityName} onChange={e => setCityName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-blue-500" placeholder="Введіть назву" /></div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-400 hover:text-white">Скасувати</button>
              <button onClick={handleCreateSchool} disabled={isCreating} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2 rounded-xl flex items-center gap-2">{isCreating ? 'Створення...' : 'Створити'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
