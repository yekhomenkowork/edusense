import React, { useState } from 'react';
import { Users, UserPlus, Search, Edit2, Trash2, Shield, GraduationCap, Briefcase, Key, Mail, Phone, CheckCircle2, XCircle, Clock, X, Save, Lock, Unlock } from 'lucide-react';

// --- МОКОВІ ДАНІ ---
const initialStaff = [
  { id: 1, name: 'Олександр Петренко', email: 'director@school101.com', phone: '+38 (050) 123-45-67', role: 'admin', roleName: 'Директор', status: 'online', canTriggerAlarm: true },
  { id: 2, name: 'Іван Сидоренко', email: 'security1@school101.com', phone: '+38 (067) 987-65-43', role: 'security', roleName: 'Старший охоронець', status: 'online', canTriggerAlarm: true },
  { id: 3, name: 'Олена Коваль', email: 'teacher.math@school101.com', phone: '+38 (063) 111-22-33', role: 'teacher', roleName: 'Вчитель математики', status: 'offline', canTriggerAlarm: false },
  { id: 4, name: 'Марія Іванова', email: 'zavuch@school101.com', phone: '+38 (050) 555-44-33', role: 'admin', roleName: 'Завуч', status: 'online', canTriggerAlarm: true },
  { id: 5, name: 'Петро Василенко', email: 'security2@school101.com', phone: '+38 (097) 777-88-99', role: 'security', roleName: 'Охоронець', status: 'vacation', canTriggerAlarm: true },
];

export default function SchoolStaffPage() {
  const [staff, setStaff] = useState(initialStaff);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  // Модалка
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Фільтрація
  const filteredStaff = staff.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: staff.length,
    online: staff.filter(s => s.status === 'online').length,
    securityOnline: staff.filter(s => s.role === 'security' && s.status === 'online').length
  };

  const openEditor = (user = null) => {
    setEditingUser(user || { id: null, name: '', email: '', phone: '', role: 'teacher', roleName: 'Вчитель', status: 'offline', canTriggerAlarm: false });
    setIsModalOpen(true);
  };

  const saveUser = () => {
    if (!editingUser.name || !editingUser.email) return alert('Заповніть обов\'язкові поля');
    
    if (editingUser.id) {
      setStaff(staff.map(s => s.id === editingUser.id ? editingUser : s));
    } else {
      setStaff([...staff, { ...editingUser, id: Date.now(), status: 'offline' }]);
    }
    setIsModalOpen(false);
  };

  const deleteUser = (id) => {
    if (window.confirm('Дійсно видалити працівника? Доступ до системи буде анульовано.')) {
      setStaff(staff.filter(s => s.id !== id));
    }
  };

  // Допоміжна функція для іконок ролей
  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <Briefcase size={18} className="text-blue-400" />;
      case 'security': return <Shield size={18} className="text-emerald-400" />;
      case 'teacher': return <GraduationCap size={18} className="text-purple-400" />;
      default: return <Users size={18} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <Users className="text-blue-400" size={32}/> Управління персоналом
          </h1>
          <p className="text-gray-400">Облікові записи працівників та контроль доступу</p>
        </div>
        <button onClick={() => openEditor()} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
          <UserPlus size={18} /> Додати працівника
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex items-center gap-5 shadow-lg">
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400"><Users size={28}/></div>
          <div><div className="text-gray-400 font-medium">Всього працівників</div><div className="text-3xl font-bold text-white">{stats.total}</div></div>
        </div>
        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex items-center gap-5 shadow-lg">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400"><CheckCircle2 size={28}/></div>
          <div><div className="text-gray-400 font-medium">Зараз в системі</div><div className="text-3xl font-bold text-white">{stats.online}</div></div>
        </div>
        <div className={`bg-[#121214] border p-6 rounded-2xl flex items-center gap-5 shadow-lg transition-colors ${stats.securityOnline > 0 ? 'border-white/5' : 'border-red-500/30 bg-red-950/20'}`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stats.securityOnline > 0 ? 'bg-purple-500/10 text-purple-400' : 'bg-red-500/20 text-red-500 animate-pulse'}`}><Shield size={28}/></div>
          <div>
            <div className={`font-medium ${stats.securityOnline > 0 ? 'text-gray-400' : 'text-red-400'}`}>Охорона на посту</div>
            <div className="text-3xl font-bold text-white flex items-baseline gap-2">{stats.securityOnline} <span className="text-sm font-normal text-gray-500">осіб</span></div>
          </div>
        </div>
      </div>

      {/* Фільтри та Таблиця */}
      <div className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden shadow-lg flex flex-col">
        
        {/* Панель інструментів */}
        <div className="p-4 border-b border-white/5 bg-black/20 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input type="text" placeholder="Пошук за ім'ям або email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-blue-500 outline-none transition-colors" />
          </div>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:border-blue-500 outline-none cursor-pointer md:w-48">
            <option value="all">Всі посади</option>
            <option value="admin">Адміністрація</option>
            <option value="security">Охорона</option>
            <option value="teacher">Вчителі</option>
          </select>
        </div>

        {/* Таблиця */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-black/40 text-gray-400">
              <tr>
                <th className="p-4 font-medium pl-6">Працівник</th>
                <th className="p-4 font-medium">Роль та Посада</th>
                <th className="p-4 font-medium">Контакти</th>
                <th className="p-4 font-medium">Статус</th>
                <th className="p-4 font-medium text-right pr-6">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStaff.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">За вашим запитом нікого не знайдено</td></tr>
              ) : (
                filteredStaff.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center font-bold text-white shadow-inner">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-white">{user.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            {user.canTriggerAlarm ? <Unlock size={10} className="text-red-400"/> : <Lock size={10}/>}
                            {user.canTriggerAlarm ? 'Може вмикати тривогу' : 'Без доступу до тривоги'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${user.role === 'admin' ? 'bg-blue-500/10' : user.role === 'security' ? 'bg-emerald-500/10' : 'bg-purple-500/10'}`}>
                          {getRoleIcon(user.role)}
                        </div>
                        <div>
                          <div className="text-gray-200 font-medium">{user.roleName}</div>
                          <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-300"><Mail size={14} className="text-gray-500"/> {user.email}</div>
                        <div className="flex items-center gap-2 text-gray-400 text-xs"><Phone size={14} className="text-gray-600"/> {user.phone}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                        user.status === 'online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        user.status === 'vacation' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'online' ? 'bg-emerald-500 animate-pulse' : user.status === 'vacation' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
                        {user.status === 'online' ? 'В системі' : user.status === 'vacation' ? 'Відпустка' : 'Офлайн'}
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditor(user)} className="p-2 bg-black/50 hover:bg-white/10 text-gray-400 hover:text-blue-400 rounded-lg transition-colors" title="Редагувати">
                          <Edit2 size={16}/>
                        </button>
                        <button className="p-2 bg-black/50 hover:bg-white/10 text-gray-400 hover:text-yellow-400 rounded-lg transition-colors" title="Скинути пароль">
                          <Key size={16}/>
                        </button>
                        <button onClick={() => deleteUser(user.id)} className="p-2 bg-black/50 hover:bg-white/10 text-gray-400 hover:text-red-400 rounded-lg transition-colors" title="Блокувати / Видалити">
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* МОДАЛЬНЕ ВІКНО ДОДАВАННЯ/РЕДАГУВАННЯ */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121214] border border-white/10 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {editingUser.id ? <Edit2 className="text-blue-400"/> : <UserPlus className="text-emerald-400"/>}
                {editingUser.id ? 'Редагування профілю' : 'Новий співробітник'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Базова інфа */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Особисті дані</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1.5">ПІБ працівника</label>
                    <input type="text" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} placeholder="Шевченко Тарас Григорович" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Email (Логін)</label>
                    <input type="email" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} placeholder="email@school.com" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Телефон</label>
                    <input type="text" value={editingUser.phone} onChange={e => setEditingUser({...editingUser, phone: e.target.value})} placeholder="+38 (000) 000-00-00" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none" />
                  </div>
                </div>
              </div>

              {/* Посада і Права */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Права доступу в системі</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Системна Роль</label>
                    <select value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none cursor-pointer">
                      <option value="teacher">Вчитель / Персонал</option>
                      <option value="security">Служба охорони</option>
                      <option value="admin">Адміністрація (Директор/Завуч)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Внутрішня посада</label>
                    <input type="text" value={editingUser.roleName} onChange={e => setEditingUser({...editingUser, roleName: e.target.value})} placeholder="Напр. Вчитель фізики" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:border-blue-500 outline-none" />
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={editingUser.canTriggerAlarm} onChange={e => setEditingUser({...editingUser, canTriggerAlarm: e.target.checked})} className="mt-1 w-4 h-4 accent-red-500 rounded bg-black border-red-500/30" />
                    <div>
                      <div className="text-sm font-bold text-red-400">Дозволити ручний запуск тривоги</div>
                      <div className="text-xs text-gray-400 mt-0.5">Цей користувач матиме червону кнопку для активації евакуації чи протоколу блокування зі свого смартфону.</div>
                    </div>
                  </label>
                </div>
              </div>

            </div>
            
            <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Скасувати</button>
              <button onClick={saveUser} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium flex items-center gap-2 shadow-lg transition-colors"><Save size={18} /> Зберегти</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
