import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Wind, Mic2, Activity, ChevronRight, Play, 
  Wifi, Zap, CloudCog, CheckCircle2, Lock, ArrowUpRight,
  MonitorSmartphone, Settings, Radio, Siren, Layers, BarChart3
} from 'lucide-react';

export default function LandingPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-blue-500/30 overflow-x-hidden font-sans">
      <nav className="fixed top-0 w-full z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <Activity size={18} className="text-white" />
            </div>
            EduSense
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Можливості</a>
            <a href="#dashboard" className="hover:text-white transition-colors">Управління</a>
            <a href="#technology" className="hover:text-white transition-colors">Технології</a>
            <a href="#pricing" className="hover:text-white transition-colors">Підписка</a>
          </div>
          <div className="flex gap-4 items-center">
            <a href="/demo" className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white transition-colors">Демо</a>
            <a href="/login" className="px-5 py-2.5 text-sm font-semibold text-white bg-white/10 border border-white/10 rounded-full hover:bg-white/20 transition-all flex items-center gap-2"><Lock size={14} /> Вхід</a>
          </div>
        </div>
      </nav>

      <section className="relative pt-40 pb-32 px-6 flex flex-col justify-center items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none"></div>
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>EduSense OS 2.0 вже доступна
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.05]">Екосистема <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">безпечної школи.</span></motion.h1>
          <motion.p variants={fadeUp} className="text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed">Забудьте про застарілі системи. Керуйте аудіо-навігацією, мікрокліматом та безпекою з єдиного хмарного центру управління.</motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-500 transition-all hover:scale-105 shadow-[0_0_30px_rgba(37,99,235,0.3)]">Почати інтеграцію <ChevronRight size={20} /></button>
            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-semibold hover:bg-white/10 transition-all group"><Play size={20} className="fill-transparent group-hover:fill-white transition-all" /> Дивитись презентацію</button>
          </motion.div>
        </motion.div>
      </section>

      <section id="features" className="py-24 px-6 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="order-2 lg:order-1">
            <motion.div variants={fadeUp} className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20"><Mic2 size={32} className="text-blue-400" /></motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Розумний Аудіо-Хаб</motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-gray-400 mb-8">Забудьте про дратівливі механічні дзвінки. Створюйте розклади мелодій, транслюйте важливі оголошення наживо або запускайте автоматичні сценарії евакуації в один клік.</motion.p>
            <motion.ul variants={staggerContainer} className="space-y-5">
              {[ { title: 'Заміна класичних дзвінків', desc: 'Приємні мелодії та фонова музика на перервах.' }, { title: 'Зонування аудіо', desc: 'Окремі трансляції для коридорів, класів та вулиці.' }, { title: 'Шкільні подкасти', desc: 'Можливість вести прямі ефіри та аудіо-оголошення наживо.' } ].map((item, i) => (
                <motion.li key={i} variants={fadeUp} className="flex items-start gap-4"><div className="mt-1 bg-blue-500/20 p-1 rounded-full"><CheckCircle2 size={16} className="text-blue-400" /></div><div><h4 className="text-white font-semibold text-lg">{item.title}</h4><p className="text-gray-400">{item.desc}</p></div></motion.li>
              ))}
            </motion.ul>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} className="order-1 lg:order-2 relative group">
            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full group-hover:bg-blue-500/30 transition-all duration-700"></div>
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#121214] p-2 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop" alt="Audio Control" className="rounded-2xl w-full object-cover opacity-80" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 bg-black/40 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} className="relative group">
            <div className="absolute inset-0 bg-red-500/20 blur-[100px] rounded-full group-hover:bg-red-500/30 transition-all duration-700"></div>
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#121214] p-2 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=2000&auto=format&fit=crop" alt="Emergency Exit" className="rounded-2xl w-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700" />
            </div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
            <motion.div variants={fadeUp} className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-8 border border-red-500/20"><Shield size={32} className="text-red-400" /></motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Безпека 360° та Динамічна Евакуація</motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-gray-400 mb-8">Система безперервно аналізує простір за допомогою IoT-сенсорів. У разі небезпеки алгоритм миттєво активує тривогу та включає світлові вказівники до найближчого укриття.</motion.p>
            <motion.ul variants={staggerContainer} className="space-y-5">
              {[ { icon: <Siren size={20}/>, title: 'Повітряні тривоги', desc: 'Автоматичне сповіщення через вбудовані динаміки про початок та відбій тривоги.' }, { icon: <Zap size={20}/>, title: 'Світлодіодна навігація', desc: 'Увімкнення LED-стрічок, які динамічно вказують напрямок до безпечної зони.' }, { icon: <Activity size={20}/>, title: 'Охоронний моніторинг', desc: 'Датчики руху в неробочий час, контроль відкриття дверей та миттєві аналізатори диму.' } ].map((item, i) => (
                <motion.li key={i} variants={fadeUp} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"><div className="mt-1 text-red-400">{item.icon}</div><div><h4 className="text-white font-semibold">{item.title}</h4><p className="text-gray-400 text-sm mt-1">{item.desc}</p></div></motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="order-2 lg:order-1">
            <motion.div variants={fadeUp} className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20"><Wind size={32} className="text-emerald-400" /></motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Прецизійний Мікроклімат</motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-gray-400 mb-8">Якість повітря прямо впливає на продуктивність. Збирайте телеметрію з кожного класу для забезпечення ідеальних умов навчання.</motion.p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Моніторинг CO2', 'Температура та вологість', 'Детальні графіки', 'Сповіщення про провітрювання'].map((item, i) => (
                <motion.div key={i} variants={fadeUp} className="flex items-center gap-3 bg-[#121214] border border-white/5 p-4 rounded-xl"><CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" /><span className="text-gray-300 font-medium">{item}</span></motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} className="order-1 lg:order-2 relative group">
            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full group-hover:bg-emerald-500/30 transition-all duration-700"></div>
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#121214] p-2 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1614624532983-4ce03382d63d?q=80&w=2000&auto=format&fit=crop" alt="Climate Control" className="rounded-2xl w-full object-cover opacity-80" />
            </div>
          </motion.div>
        </div>
      </section>

      <section id="dashboard" className="py-24 px-6 bg-gradient-to-b from-[#09090b] to-[#121214] relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} className="relative">
            <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full"></div>
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/50 p-2 shadow-2xl aspect-video">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" alt="Web Interface" className="rounded-2xl w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent"></div>
            </div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
            <motion.div variants={fadeUp} className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/20"><MonitorSmartphone size={32} className="text-indigo-400" /></motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Єдиний Центр Керування</motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-gray-400 mb-8">Доступ до всіх даних надається через зручний веб-інтерфейс. Керуйте своїм навчальним закладом з будь-якого пристрою.</motion.p>
            <motion.ul variants={staggerContainer} className="space-y-4 text-gray-300">
              <motion.li variants={fadeUp} className="flex items-center gap-3"><Settings size={20} className="text-indigo-400"/> Внесення налаштувань та конфігурацій</motion.li>
              <motion.li variants={fadeUp} className="flex items-center gap-3"><Radio size={20} className="text-indigo-400"/> Ведення підкастів прямо з браузера</motion.li>
              <motion.li variants={fadeUp} className="flex items-center gap-3"><Shield size={20} className="text-indigo-400"/> Гнучке налаштування зон безпеки</motion.li>
              <motion.li variants={fadeUp} className="flex items-center gap-3"><BarChart3 size={20} className="text-indigo-400"/> Зведена статистика та аналітика</motion.li>
            </motion.ul>
          </motion.div>
        </div>
      </section>

      <section id="technology" className="py-24 px-6 border-t border-white/5 bg-black/80">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-bold mb-4">Створено для безвідмовної роботи</h2><p className="text-gray-400 text-lg">Сучасний інженерний підхід під капотом екосистеми.</p></motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} whileHover={{ y: -5 }} className="bg-[#121214] border border-white/5 p-8 rounded-3xl hover:border-blue-500/30 transition-all"><Wifi className="text-blue-400 mb-6" size={36} /><h3 className="text-2xl font-bold mb-3">Віддалені оновлення (OTA)</h3><p className="text-gray-400 leading-relaxed">Всі апаратні пристрої на базі ESP отримують нові прошивки "по повітрю" (Over-The-Air) без фізичного втручання.</p></motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} whileHover={{ y: -5 }} className="bg-[#121214] border border-white/5 p-8 rounded-3xl hover:border-purple-500/30 transition-all"><CloudCog className="text-purple-400 mb-6" size={36} /><h3 className="text-2xl font-bold mb-3">Гібридна архітектура</h3><p className="text-gray-400 leading-relaxed">Високонадійний REST API на FastAPI для управління та блискавичний брокер MQTT для безперервної потокової телеметрії.</p></motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} whileHover={{ y: -5 }} className="bg-[#121214] border border-white/5 p-8 rounded-3xl hover:border-yellow-500/30 transition-all"><Zap className="text-yellow-400 mb-6" size={36} /><h3 className="text-2xl font-bold mb-3">Енергонезалежність</h3><p className="text-gray-400 leading-relaxed">Система продовжує збирати дані і виконувати критичні сценарії навіть при повному блекауті завдяки інтегрованим UPS.</p></motion.div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-indigo-900/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-bold mb-4">Гнучка система підписок</h2><p className="text-gray-400 text-lg">Обирайте рівень доступу, який ідеально підходить вашому закладу.</p></motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="bg-[#121214] border border-white/10 p-10 rounded-[2.5rem] flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Базовий рівень</h3><div className="text-4xl font-extrabold mb-6">Безкоштовно</div><p className="text-gray-400 mb-8 border-b border-white/5 pb-8">Ідеально для старту. Базовий моніторинг та налаштування ауді-хабу.</p>
              <ul className="space-y-4 mb-auto">{['Базові сценарії розкладів', 'Підключення до 10 IoT-пристроїв', 'Стандартна підтримка'].map((item, i) => (<li key={i} className="flex items-center gap-3 text-gray-300"><CheckCircle2 size={18} className="text-gray-500"/> {item}</li>))}</ul>
              <button className="w-full py-4 mt-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 font-semibold">Почати безкоштовно</button>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="bg-gradient-to-b from-blue-900/40 to-[#121214] border border-blue-500/30 p-10 rounded-[2.5rem] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">ПОПУЛЯРНИЙ</div>
              <h3 className="text-2xl font-bold mb-2 text-blue-400">Pro Підписка</h3><div className="text-4xl font-extrabold mb-6">Premium</div><p className="text-gray-400 mb-8 border-b border-white/5 pb-8">Розширена аналітика та повний контроль безпеки для великих закладів.</p>
              <ul className="space-y-4 mb-auto">{['Необмежена кількість пристроїв', 'Live-подкасти та зонування', 'Динамічна евакуація', 'Детальна статистика та графіки'].map((item, i) => (<li key={i} className="flex items-center gap-3 text-gray-100"><CheckCircle2 size={18} className="text-blue-500"/> {item}</li>))}</ul>
              <button className="w-full py-4 mt-8 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors font-semibold shadow-[0_0_20px_rgba(37,99,235,0.3)]">Оформити підписку</button>
            </motion.div>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="bg-[#121214] border border-purple-500/20 p-8 md:p-12 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-purple-500/20 mx-auto md:mx-0"><Layers size={40} className="text-purple-400" /></div>
            <div className="flex-1"><h3 className="text-2xl font-bold mb-3">Індивідуальна розробка</h3><p className="text-gray-400">Ми розуміємо, що кожен заклад унікальний. Можлива повна кастомізація платформи, розробка нових датчиків та інтеграція специфічного функціоналу під конкретні потреби вашого клієнта.</p></div>
            <button className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors whitespace-nowrap">Обговорити проєкт</button>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 relative overflow-hidden">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="max-w-4xl mx-auto text-center relative z-10 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 backdrop-blur-xl border border-blue-500/20 p-12 md:p-20 rounded-[3rem] shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Готові трансформувати свій заклад?</h2>
          <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">Зробіть крок у майбутнє управління шкільною інфраструктурою вже сьогодні.</p>
          <button className="px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center gap-2 mx-auto">Отримати доступ <ArrowUpRight size={24} /></button>
        </motion.div>
      </section>

      <footer className="border-t border-white/5 bg-[#09090b] pt-12 pb-8 px-6 text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-white text-lg"><Activity size={20} className="text-blue-500" /> EduSense</div>
          <p className="text-sm">© 2026 EduSense Cloud Platform. Всі права захищено.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Документація</a>
            <a href="#" className="hover:text-white transition-colors">Swagger API</a>
            <a href="#" className="hover:text-white transition-colors">Умови</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
