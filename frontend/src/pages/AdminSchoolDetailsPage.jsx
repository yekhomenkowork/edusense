import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, UserPlus, Shield, User, Key, Edit2, Trash2, X, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Мокові користувачі для цієї школи
const initialUsers = [
  { id: 1, name: 'Олександр Петренко', email: 'director@school101.com', role: 'school_admin', status: 'Активний' },
  { id: 2, name: 'Марія Іванова', email: 'zavuch@school101.com', role: 'school_admin', status: 'Активний' },
  { id: 3, name: 'Іван Сидоренко', email: 'security1@school101.com', role: 'staff', status: 'Активний' },
  { id: 4, name: 'Олена Коваль', email: 'teacher.duty@school101.com', role: 'staff', status: 'Офлайн' },
];

export default function AdminSchoolDetailsPage() {
  const { id } = useParams(); // Отримуємо ID школи з URL
  const navigate = useNavigate();
  
  const [users, setUsers] = useState(initialUsers);
  const [activeTab, setActiveTab] = useState('school_admin'); // 'school_admin' або 'staff'
  
  // Стейт для модального вікна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Фільтруємо користувачів по вкладках
  const displayedUsers = users.filter(u => u.role === activeTab);

  const openModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Кнопка назад та Заголовок */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/dashboard/schools')}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Building2 className="text-blue-400" /> Ліцей №1 Інтелект (ID: {id})
          </h1>
          <p className="text-gray-400 mt-1">Керування персоналом та налаштуваннями доступу</p>
        </div>
      </div>

      {/* Вкладки (Tabs) */}
      <div className="flex border-b border-white/10">
        <button 
          onClick={() => setActiveTab('school_admin')}
          className={`px-6 py-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'school_admin' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Shield size={18} /> Керівництво (School Admins)
        </button>
        <button 
          onClick={() => setActiveTab('staff')}
          className={`px-6 py-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'staff' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <User size={18} /> Персонал (Staff / Охорона)
        </button>
      </div>

      {/* Панель керування користувачами */}
      <div className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
          <h2 className="font-bold text-white">
            {activeTab === 'school_admin' ? 'Адміністратори школи' : 'Працівники та охорона'}
          </h2>
          <button 
            onClick={() => openModal()}
            className={`px-4 py-2 text-white rounded-lg font-medium transition-all flex items-center gap-2 text-sm ${
              activeTab === 'school_admin' ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'bg-purple-600 hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
            }`}
          >
            <UserPlus size={16} /> Створити акаунт
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/20 text-gray-400">
              <tr>
                <th className="p-4 font-medium">ПІБ Користувача</th>
                <th className="p-4 font-medium">Електронна пошта</th>
                <th className="p-4 font-medium">Статус</th>
                <th className="p-4 font-medium text-right">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 font-medium text-white">{user.name}</td>
                  <td className="p-4 text-gray-400">{user.email}</td>
                  <td className="p-4">
                    <span className={`flex items-center gap-1.5 ${user.status === 'Активний' ? 'text-emerald-400' : 'text-gray-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Активний' ? 'bg-emerald-500' : 'bg-gray-500'}`}></div>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(user)} className="text-gray-400 hover:text-blue-400 flex items-center gap-1" title="Редагувати">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => openModal(user)} className="text-gray-400 hover:text-yellow-400 flex items-center gap-1" title="Змінити пароль">
                        <Key size={16} />
                      </button>
                      <button className="text-gray-400 hover:text-red-400 flex items-center gap-1" title="Видалити">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {displayedUsers.length === 0 && (
                <tr><td colSpan="4" className="p-8 text-center text-gray-500">Користувачів у цій категорії не знайдено.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модальне вікно (Створення / Редагування) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {editingUser ? <Edit2 className="text-blue-400"/> : <UserPlus className="text-emerald-400"/>} 
                {editingUser ? 'Редагування користувача' : 'Новий користувач'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">ПІБ</label>
                <input type="text" defaultValue={editingUser?.name || ''} placeholder="Іванов Іван" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Електронна пошта (Логін)</label>
                <input type="email" defaultValue={editingUser?.email || ''} placeholder="email@school.com" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Роль</label>
                <select defaultValue={editingUser?.role || activeTab} className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none cursor-pointer">
                  <option value="school_admin">Адміністратор школи (School Admin)</option>
                  <option value="staff">Персонал / Охорона (Staff)</option>
                </select>
              </div>
              
              <div className="pt-2">
                <label className="block text-sm text-gray-400 mb-1.5">
                  {editingUser ? 'Новий пароль (залиште порожнім, щоб не змінювати)' : 'Пароль'}
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input type="password" placeholder="••••••••" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-blue-500 outline-none" />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Скасувати</button>
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium flex items-center gap-2 shadow-lg transition-colors">
                <CheckCircle2 size={18} /> Зберегти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
