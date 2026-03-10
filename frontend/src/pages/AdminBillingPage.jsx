import React, { useState } from 'react';
import { CreditCard, TrendingUp, Users, CheckCircle2, Clock, XCircle, Settings, Plus, LayoutList, Check, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- МОКОВІ ДАНІ ---
const revenueData = [
  { month: 'Жовтень', revenue: 850 },
  { month: 'Листопад', revenue: 940 },
  { month: 'Грудень', revenue: 1100 },
  { month: 'Січень', revenue: 1150 },
  { month: 'Лютий', revenue: 1240 },
  { month: 'Березень (Прогноз)', revenue: 1450 },
];

const recentTransactions = [
  { id: 'TRX-001', school: 'Ліцей №1 Інтелект', plan: 'Premium', amount: 99.00, status: 'success', date: 'Сьогодні, 10:23' },
  { id: 'TRX-002', school: 'Гімназія №4', plan: 'Basic', amount: 49.00, status: 'pending', date: 'Сьогодні, 08:15' },
  { id: 'TRX-003', school: 'Школа №5', plan: 'Premium', amount: 99.00, status: 'failed', date: 'Вчора, 16:40' },
  { id: 'TRX-004', school: 'Спеціалізована школа №12', plan: 'Trial', amount: 0.00, status: 'success', date: '08 Бер, 11:00' },
];

const subscriptionPlans = [
  { 
    id: 'basic', name: 'Basic', price: 49, devicesLimit: 50, 
    features: { audio: true, climate: true, security_basic: true, dynamic_evac: false, custom_roles: false }
  },
  { 
    id: 'premium', name: 'Premium', price: 99, devicesLimit: 'Безліміт', 
    features: { audio: true, climate: true, security_basic: true, dynamic_evac: true, custom_roles: true }
  }
];

export default function AdminBillingPage() {
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Підписки та Білінг</h1>
          <p className="text-gray-400">Фінансова аналітика та управління тарифними планами платформи</p>
        </div>
        <button 
          onClick={() => setIsPlanModalOpen(true)}
          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2"
        >
          <Settings size={18} /> Налаштування тарифів
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex flex-col justify-center group relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp size={100} /></div>
          <div className="text-gray-400 font-medium mb-2 flex items-center gap-2"><TrendingUp size={18} className="text-emerald-400"/> Дохід (MRR)</div>
          <div className="text-4xl font-bold text-white mb-1">$1,240</div>
          <div className="text-sm text-gray-500">Очікується в цьому місяці: <span className="text-emerald-400 font-semibold">~$1,450</span></div>
        </div>
        
        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex flex-col justify-center group relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><Users size={100} /></div>
          <div className="text-gray-400 font-medium mb-2 flex items-center gap-2"><Users size={18} className="text-blue-400"/> Конверсія шкіл</div>
          <div className="text-4xl font-bold text-white mb-1">15 <span className="text-xl font-normal text-gray-500">всього</span></div>
          <div className="text-sm text-gray-500"><span className="text-blue-400 font-semibold">12 шкіл</span> (80%) на платній підписці</div>
        </div>

        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex flex-col justify-center group relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><CreditCard size={100} /></div>
          <div className="text-gray-400 font-medium mb-2 flex items-center gap-2"><CreditCard size={18} className="text-purple-400"/> Статус оплат</div>
          <div className="text-4xl font-bold text-white mb-1">3 <span className="text-xl font-normal text-gray-500">очікується</span></div>
          <div className="text-sm text-gray-500">1 транзакція потребує вашої <span className="text-red-400 font-semibold">уваги</span></div>
        </div>
      </div>

      {/* Main Content Grid: Chart & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Графік доходів */}
        <div className="bg-[#121214] border border-white/5 p-6 rounded-2xl flex flex-col">
          <h2 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
            <BarChart3Icon size={20} className="text-blue-400"/> Динаміка підписок (6 місяців)
          </h2>
          <div className="h-[300px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff50" tick={{fill: '#ffffff50', fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" tick={{fill: '#ffffff50', fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  cursor={{fill: '#ffffff05'}}
                  contentStyle={{ backgroundColor: '#121214', borderColor: '#ffffff10', borderRadius: '12px', color: '#fff' }}
                  formatter={(value) => [`$${value}`, 'MRR']}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Історія транзакцій */}
        <div className="bg-[#121214] border border-white/5 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <LayoutList size={20} className="text-purple-400"/> Останні транзакції
            </h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">Дивитись всі</button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {recentTransactions.map((trx, idx) => (
                <div key={idx} className="p-4 rounded-xl hover:bg-white/[0.02] transition-colors flex justify-between items-center border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      trx.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 
                      trx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {trx.status === 'success' ? <CheckCircle2 size={20}/> : trx.status === 'pending' ? <Clock size={20}/> : <XCircle size={20}/>}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{trx.school}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{trx.date} • {trx.plan} Платіж</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">${trx.amount.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{trx.id}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Модальне вікно: Налаштування тарифів */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="text-blue-400" /> Управління тарифними планами
              </h2>
              <button onClick={() => setIsPlanModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <p className="text-gray-400 mb-6">Налаштуйте вартість, ліміти та доступний функціонал для кожної підписки. Зміни застосуються до нових клієнтів автоматично.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subscriptionPlans.map((plan) => (
                  <div key={plan.id} className="border border-white/10 rounded-2xl p-6 bg-black/30 flex flex-col relative overflow-hidden">
                    {plan.id === 'premium' && <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>}
                    
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <input type="text" defaultValue={plan.name} className="bg-transparent text-2xl font-bold text-white outline-none border-b border-transparent focus:border-blue-500 w-32" />
                        <div className="text-sm text-gray-500 mt-1">Рівень доступу</div>
                      </div>
                      <div className="flex items-center">
                        <DollarSign size={20} className="text-gray-400" />
                        <input type="number" defaultValue={plan.price} className="bg-transparent text-3xl font-extrabold text-white outline-none border-b border-transparent focus:border-blue-500 w-16 text-center" />
                        <span className="text-gray-500 ml-1">/ міс</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ліміт пристроїв (IoT)</label>
                      <input type="text" defaultValue={plan.devicesLimit} className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-3 text-white focus:border-blue-500 outline-none text-sm" />
                    </div>

                    <div className="space-y-3 flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Доступний функціонал</label>
                      
                      <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Аудіо-Хаб (Дзвінки)</span>
                        <input type="checkbox" defaultChecked={plan.features.audio} className="w-4 h-4 accent-blue-500 rounded bg-black border-white/10" />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Моніторинг мікроклімату</span>
                        <input type="checkbox" defaultChecked={plan.features.climate} className="w-4 h-4 accent-blue-500 rounded bg-black border-white/10" />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Охоронний моніторинг</span>
                        <input type="checkbox" defaultChecked={plan.features.security_basic} className="w-4 h-4 accent-blue-500 rounded bg-black border-white/10" />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer group">
                        <span className={`text-sm transition-colors ${plan.features.dynamic_evac ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>Динамічна евакуація (LED)</span>
                        <input type="checkbox" defaultChecked={plan.features.dynamic_evac} className="w-4 h-4 accent-blue-500 rounded bg-black border-white/10" />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer group">
                        <span className={`text-sm transition-colors ${plan.features.custom_roles ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>Кастомні ролі персоналу</span>
                        <input type="checkbox" defaultChecked={plan.features.custom_roles} className="w-4 h-4 accent-blue-500 rounded bg-black border-white/10" />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-white/5 bg-black/20 flex justify-between items-center">
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1">
                <Plus size={16}/> Додати новий тариф
              </button>
              <div className="flex gap-3">
                <button onClick={() => setIsPlanModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Скасувати</button>
                <button onClick={() => setIsPlanModalOpen(false)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium flex items-center gap-2 shadow-lg transition-colors">
                  <Check size={18} /> Зберегти зміни
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Заглушка для іконки графіка
function BarChart3Icon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
    </svg>
  );
}
