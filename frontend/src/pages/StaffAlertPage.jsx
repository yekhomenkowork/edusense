import React, { useState } from 'react';
import { BellRing, Siren, ShieldAlert, Flame, Lock, AlertTriangle } from 'lucide-react';

export default function StaffAlertPage() {
  const [activeAlert, setActiveAlert] = useState(null);
  const [pendingAlert, setPendingAlert] = useState(null); // Стейт для модалки підтвердження

  const handleAlertClick = (type) => {
    if (activeAlert) return; // Якщо вже активна, ігноруємо
    setPendingAlert(type); // Відкриваємо модалку замість window.confirm
  };

  const confirmAlert = () => {
    setActiveAlert(pendingAlert);
    setPendingAlert(null);
  };

  const cancelAlert = () => {
    setActiveAlert(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in duration-500 max-w-5xl mx-auto relative">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center justify-center gap-3">
          <BellRing className="text-red-500" size={36}/> Екстрене сповіщення
        </h1>
        <p className="text-gray-400">Натисніть кнопку відповідної загрози для негайного запуску протоколу безпеки.</p>
      </div>

      {activeAlert ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-950/40 border border-red-500/50 p-12 rounded-[3rem] text-center shadow-[0_0_100px_rgba(220,38,38,0.4)] relative overflow-hidden w-full max-w-2xl animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500 animate-pulse"></div>
            <Siren size={80} className="mx-auto text-red-500 mb-6 animate-pulse" />
            <h2 className="text-4xl font-black text-red-400 mb-4 uppercase">Активно: {activeAlert}</h2>
            <p className="text-red-200 text-lg mb-10">Протокол евакуації та блокування запущено. Очікуйте прибуття відповідних служб.</p>
            <button 
              onClick={cancelAlert}
              className="px-10 py-5 bg-black/50 border border-red-500/50 hover:bg-white/10 text-white rounded-2xl font-bold text-xl transition-all"
            >
              Скинути тривогу (Відбій)
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <button 
            onClick={() => handleAlertClick('Повітряна тривога')}
            className="group bg-[#121214] border border-orange-500/20 hover:border-orange-500/50 hover:bg-orange-500/10 rounded-[3rem] flex flex-col items-center justify-center p-10 transition-all duration-300 shadow-lg hover:shadow-[0_0_40px_rgba(249,115,22,0.2)]"
          >
            <div className="w-32 h-32 rounded-full bg-orange-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Siren size={64} className="text-orange-500" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2 uppercase">Повітряна</h2>
            <p className="text-gray-400 text-sm">Укриття. Сирена. Світло.</p>
          </button>

          <button 
            onClick={() => handleAlertClick('Пожежна евакуація')}
            className="group bg-[#121214] border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 rounded-[3rem] flex flex-col items-center justify-center p-10 transition-all duration-300 shadow-lg hover:shadow-[0_0_40px_rgba(220,38,38,0.2)]"
          >
            <div className="w-32 h-32 rounded-full bg-red-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Flame size={64} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2 uppercase">Пожежа</h2>
            <p className="text-gray-400 text-sm">Відкрити всі двері.</p>
          </button>

          <button 
            onClick={() => handleAlertClick('Блокування (Вторгнення)')}
            className="group bg-[#121214] border border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/10 rounded-[3rem] flex flex-col items-center justify-center p-10 transition-all duration-300 shadow-lg hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]"
          >
            <div className="w-32 h-32 rounded-full bg-purple-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Lock size={64} className="text-purple-500" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2 uppercase">Вторгнення</h2>
            <p className="text-gray-400 text-sm">Заблокувати двері. Тиха тривога.</p>
          </button>

        </div>
      )}

      {/* --- ВЛАСНЕ МОДАЛЬНЕ ВІКНО ПІДТВЕРДЖЕННЯ --- */}
      {pendingAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-red-950/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#121214] border border-red-500/30 rounded-3xl w-full max-w-md p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500 animate-pulse"></div>
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <AlertTriangle size={48} className="text-red-500 animate-pulse" />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2 uppercase">Підтвердіть запуск</h2>
            <p className="text-red-300 mb-2 font-bold text-lg">{pendingAlert}</p>
            <p className="text-gray-400 mb-8 text-sm">
              УВАГА! Це запустить сирени, світлову індикацію та відправить екстрені SMS сповіщення.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setPendingAlert(null)} 
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors"
              >
                Відміна
              </button>
              <button 
                onClick={confirmAlert} 
                className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-colors"
              >
                АКТИВУВАТИ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
