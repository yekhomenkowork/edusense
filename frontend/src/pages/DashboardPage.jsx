import React from 'react';
import { useAuthStore } from '../store/authStore';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <div className="bg-[#121214] border border-white/5 p-8 rounded-3xl">
        <h1 className="text-3xl font-bold mb-2">Вітаємо, {user.name}! 👋</h1>
        <p className="text-gray-400">
          Ви авторизувалися з правами: <span className="text-blue-400 font-bold uppercase">{user.role}</span>.
          Бічне меню зліва згенерувалося автоматично відповідно до вашої ролі.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-900/20 to-[#121214] border border-emerald-500/20 p-6 rounded-2xl h-40 flex flex-col justify-between">
          <div className="text-gray-400 font-medium">Статус системи</div>
          <div className="text-4xl font-bold text-emerald-400">Норма</div>
        </div>
        <div className="bg-gradient-to-br from-blue-900/20 to-[#121214] border border-blue-500/20 p-6 rounded-2xl h-40 flex flex-col justify-between">
          <div className="text-gray-400 font-medium">Активні пристрої</div>
          <div className="text-4xl font-bold text-blue-400">24 / 24</div>
        </div>
        <div className="bg-gradient-to-br from-purple-900/20 to-[#121214] border border-purple-500/20 p-6 rounded-2xl h-40 flex flex-col justify-between">
          <div className="text-gray-400 font-medium">Останнє оновлення (OTA)</div>
          <div className="text-4xl font-bold text-purple-400">Сьогодні</div>
        </div>
      </div>
    </div>
  );
}
