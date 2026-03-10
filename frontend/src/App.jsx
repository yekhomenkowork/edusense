import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Wind, Mic2, Activity, ChevronRight, Play } from 'lucide-react';

export default function App() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-blue-500/30">
      
      {/* Навігація */}
      <nav className="fixed top-0 w-full z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity size={18} className="text-white" />
            </div>
            EduSense
          </div>
          <div className="flex gap-4 items-center">
            <button className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Як це працює
            </button>
            <button className="px-5 py-2 text-sm font-semibold text-black bg-white rounded-full hover:bg-gray-200 transition-all">
              Вхід у систему
            </button>
          </div>
        </div>
      </nav>

      {/* Головний екран (Hero) */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        {/* Декоративні елементи (світіння) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] md:w-[800px] md:h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Версія 2.0 вже доступна
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Школа майбутнього. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Під твоїм контролем.
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-lg">
              Єдина екосистема, яка об'єднує безпеку, аудіо-навігацію та клімат-контроль. Створена для сучасних навчальних закладів.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-500 transition-all hover:scale-105 shadow-lg shadow-blue-600/25">
                Замовити демо <ChevronRight size={20} />
              </button>
              <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-semibold hover:bg-white/10 transition-all">
                <Play size={20} className="fill-white" /> Дивитись відео
              </button>
            </div>
          </motion.div>

          {/* Картинка-прев'ю дашборду */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-2xl blur-2xl"></div>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/50 aspect-video">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                alt="Dashboard Preview" 
                className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Секція можливостей (Bento Grid) */}
      <section id="features" className="py-24 px-6 bg-black/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Більше ніж просто моніторинг</h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">Апаратні та програмні рішення, що працюють як єдиний організм для безпеки дітей.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Картка 1: Безпека (Велика) */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="md:col-span-2 group relative overflow-hidden rounded-[2rem] bg-[#121214] border border-white/5 p-10 hover:border-white/20 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=2000&auto=format&fit=crop" alt="Security" className="absolute right-0 bottom-0 w-1/2 h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500 mix-blend-overlay" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
                  <Shield size={28} />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white">Безпека 360°</h3>
                <p className="text-gray-400 text-lg max-w-md">Датчики руху, контроль периметра та розумна система динамічної евакуації зі світловою навігацією.</p>
              </div>
            </motion.div>

            {/* Картка 2: Клімат */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="md:col-span-1 group relative overflow-hidden rounded-[2rem] bg-[#121214] border border-white/5 p-10 hover:border-white/20 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center mb-6 border border-green-500/20">
                  <Wind size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Мікроклімат</h3>
                <p className="text-gray-400">Аналіз якості повітря, температури та рівня CO2 в режимі реального часу.</p>
              </div>
            </motion.div>

            {/* Картка 3: Аудіо */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="md:col-span-3 group relative overflow-hidden rounded-[2rem] bg-[#121214] border border-white/5 p-10 hover:border-white/20 transition-colors flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 relative z-10">
                <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                  <Mic2 size={28} />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white">Інтелектуальний Аудіо-Хаб</h3>
                <p className="text-gray-400 text-lg max-w-lg mb-6">Скажи "Ні" радянським шкільним дзвоникам. Транслюй музику на перервах, роби голосові оголошення та запускай сценарії тривоги прямо зі смартфона.</p>
                <button className="text-blue-400 font-semibold hover:text-blue-300 flex items-center gap-1">Дізнатись більше <ChevronRight size={16}/></button>
              </div>
              
              {/* Анімований еквалайзер */}
              <div className="w-full md:w-1/3 h-32 flex items-end justify-center gap-2 opacity-50">
                {[...Array(12)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: ["20%", "100%", "30%", "80%", "20%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                    className="w-3 bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-sm"
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
