import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, Users, Shield, Server, UserPlus, Key, CreditCard, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function AdminSchoolDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  const [school, setSchool] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('admins'); // 'admins', 'staff', 'settings'

  // Стан для модалки нового користувача
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'school_admin' });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [schoolRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/schools/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/schools/${id}/users`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (schoolRes.ok) setSchool(await schoolRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  }, [id, token, API_URL]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Створення користувача
  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) return alert('Заповніть всі поля');
    try {
      const res = await fetch(`${API_URL}/schools/${id}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        setIsUserModalOpen(false);
        setNewUser({ name: '', email: '', password: '', role: 'school_admin' });
        fetchData();
      } else {
        const error = await res.json();
        alert(error.detail || 'Помилка створення');
      }
    } catch (error) { console.error(error); }
  };

  // Видалення користувача
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Видалити користувача?')) return;
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (error) { console.error(error); }
  };

  // Оновлення школи (Генерація MQTT або зміна тарифу)
  const handleUpdateSchool = async (updateData) => {
    try {
      const res = await fetch(`${API_URL}/schools/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(updateData)
      });
      if (res.ok) fetchData();
    } catch (error) { console.error(error); }
  };

  const generateMQTTPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    const password = Array.from({length: 16}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    handleUpdateSchool({ mqtt_password: password });
  };

  if (isLoading) return <div className="p-8 text-white">Завантаження...</div>;
  if (!school) return <div className="p-8 text-white">Школу не знайдено.</div>;

  const admins = users.filter(u => u.role === 'school_admin');
  const staff = users.filter(u => u.role === 'staff');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <button onClick={() => navigate('/dashboard/schools')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2">
        <ArrowLeft size={18} /> Повернутися до списку
      </button>

      {/* Шапка школи */}
      <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
          <Building2 size={32} className="text-blue-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">{school.name}</h1>
            <span className="px-2.5 py-0.5 bg-white/10 text-gray-300 rounded text-xs font-bold uppercase tracking-wider">ID: {school.id}</span>
            <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${school.status === 'Активна' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{school.status}</span>
          </div>
          <p className="text-gray-400 text-sm">{school.city}, {school.region} обл. • Підписка: <span className="text-white">{school.plan}</span></p>
        </div>
      </div>

      {/* Навігаційні вкладки */}
      <div className="flex border-b border-white/10">
        <button onClick={() => setActiveTab('admins')} className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'admins' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}><Shield size={16}/> Керівництво (Admins)</button>
        <button onClick={() => setActiveTab('staff')} className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'staff' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}><Users size={16}/> Персонал (Staff)</button>
        <button onClick={() => setActiveTab('settings')} className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'settings' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}><Server size={16}/> Налаштування та IoT</button>
      </div>

      {/* ВМІСТ Вкладок */}
      <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 min-h-[400px]">
        
        {/* Вкладка: Адміни або Персонал */}
        {(activeTab === 'admins' || activeTab === 'staff') && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">{activeTab === 'admins' ? 'Адміністратори школи' : 'Персонал (Охорона, Чергові)'}</h3>
              <button onClick={() => { setNewUser({...newUser, role: activeTab === 'admins' ? 'school_admin' : 'staff'}); setIsUserModalOpen(true); }} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
                <UserPlus size={16} /> Створити акаунт
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-400 border-b border-white/5">
                  <tr><th className="pb-3 font-medium">ПІБ Користувача</th><th className="pb-3 font-medium">Електронна пошта</th><th className="pb-3 font-medium text-right">Дії</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(activeTab === 'admins' ? admins : staff).map(u => (
                    <tr key={u.id} className="hover:bg-white/[0.02]">
                      <td className="py-4 text-white font-medium">{u.name}</td>
                      <td className="py-4 text-gray-400">{u.email}</td>
                      <td className="py-4 text-right">
                        <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                  {(activeTab === 'admins' ? admins : staff).length === 0 && (
                    <tr><td colSpan="3" className="py-8 text-center text-gray-500">Користувачів ще не додано.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Вкладка: Налаштування */}
        {activeTab === 'settings' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><Key className="text-blue-400"/> Доступи MQTT (Для ESP32)</h3>
              <div className="bg-black/30 p-5 rounded-xl border border-white/5 space-y-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Device ID (MQTT Логін)</label>
                  <input type="text" disabled value={`school_${school.id}_device`} className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white font-mono text-sm opacity-70" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">MQTT Пароль</label>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={school.mqtt_password || 'Не згенеровано'} className={`w-full bg-black/50 border border-white/10 rounded-lg p-2.5 font-mono text-sm ${school.mqtt_password ? 'text-white' : 'text-gray-500'}`} />
                    <button onClick={generateMQTTPassword} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap">Згенерувати</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><CreditCard className="text-emerald-400"/> Керування підпискою</h3>
              <div className="bg-black/30 p-5 rounded-xl border border-white/5 space-y-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Поточний тариф</label>
                  <select 
                    value={school.plan} 
                    onChange={(e) => handleUpdateSchool({ plan: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white cursor-pointer outline-none"
                  >
                    <option value="Trial">Trial (Тестовий)</option>
                    <option value="Basic">Basic (Базовий)</option>
                    <option value="Premium">Premium (Розширений)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Статус підключення</label>
                  <select 
                    value={school.status} 
                    onChange={(e) => handleUpdateSchool({ status: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white cursor-pointer outline-none"
                  >
                    <option value="Налаштування">Налаштування</option>
                    <option value="Активна">Активна</option>
                    <option value="Призупинено">Призупинено</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Модалка створення користувача */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-6">Створити акаунт ({newUser.role === 'school_admin' ? 'Адміністратор' : 'Персонал'})</h2>
            <div className="space-y-4 mb-8">
              <div>
                <label className="text-sm text-gray-400 block mb-1">ПІБ Користувача</label>
                <input type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white" placeholder="Іван Іванов" />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Email (Логін)</label>
                <input type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white" placeholder="admin@school.com" />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Пароль доступу</label>
                <input type="text" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white" placeholder="Мінімум 6 символів" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsUserModalOpen(false)} className="px-5 py-2 text-gray-400 hover:text-white">Скасувати</button>
              <button onClick={handleCreateUser} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl transition-colors">Зберегти</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
