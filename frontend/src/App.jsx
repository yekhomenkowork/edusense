import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Wind, Mic2, Activity, ChevronRight, Play, 
  Wifi, Zap, CloudCog, CheckCircle2, Lock, BarChart3, ArrowUpRight
} from 'lucide-react';

export default function App() {
  // Анімаційні пресети
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-blue-500/30 overflow-x-hidden font-sans">
      
      {/* Navbar */}
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
            <a href="#technology" className="hover:text-white transition-colors">Технології</a>
            <a href="#benefits" className="hover:text-white transition-colors">Переваги</a>
          </div>
          <div className="flex gap-4 items-center">
            <button className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Демо
            </button>
            <button className="px-5 py-2.5 text-sm font-semibold text-white bg-white/10 border border-white/10 rounded-full hover:bg-white/20 transition-all flex items-center gap-2">
              <Lock size={14} /> Вхід
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 flex flex-col justify-center items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none"></div>
        
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            EduSense OS 2.0 вже доступна
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.05]">
            Екосистема <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              безпечної школи.
            </span>
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed">
            Повна відмова від застарілих систем. Керуйте дзвінками, мікрокліматом та безпекою з єдиного хмарного центру з будь-якої точки світу.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-500 transition-all hover:scale-105 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
              Почати інтеграцію <ChevronRight size={20} />
            </button>
            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-semibold hover:bg-white/10 transition-all group">
              <Play size={20} className="fill-transparent group-hover:fill-white transition-all" /> Дивитись презентацію
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature 1: Audio Hub (Left Text, Right Image) */}
      <section id="features" className="py-24 px-6 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="order-2 lg:order-1">
            <motion.div variants={fadeUp} className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20">
              <Mic2 size={32} className="text-blue-400" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Розумний Аудіо-Хаб
            </motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-gray-400 mb-8">
              Забудьте про дратівливі механічні дзвінки. Створюйте розклади мелодій, транслюйте важливі оголошення наживо або запускайте автоматичні сценарії евакуації.
            </motion.p>
            <motion.ul variants={staggerContainer} className="space-y-4">
              {['Персоналізовані плейлисти для перерв', 'Локальний стрімінг та подкасти', 'Миттєве голосове сповіщення з дашборду', 'Зонування аудіо (коридори, класи, вулиця)'].map((item, i) => (
                <motion.li key={i} variants={fadeUp} className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 size={20} className="text-blue-500 flex-shrink-0" /> {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} className="order-1 lg:order-2 relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full"></div>
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#121214] p-2 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop" alt="Audio Control" className="rounded-2xl w-full object-cover opacity-80" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature 2: Security (Left Image, Right Text) */}
      <section className="py-24 px-6 bg-black/40 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-[100px] rounded-full"></div>
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#121214] p-2 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=2000&auto=format&fit=crop" alt="Security Dashboard" className="rounded-2xl w-full object-cover opacity-80" />
            </div>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            <motion.div variants={fadeUp} className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-8 border border-red-500/20">
              <Shield size={32} className="text-red-400" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Безпека 360° та Евакуація
            </motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-gray-400 mb-8">
              Система безперервно аналізує простір за допомогою мережі IoT-сенсорів. У разі небезпеки алгоритм миттєво активує тривогу та включає світлові вказівники до найближчого виходу.
            </motion.p>
            <motion.ul variants={staggerContainer} className="space-y-4">
              {['Датчики руху в неробочий час', 'Аналізатори диму з миттєвим MQTT-зв\'язком', 'Динамічна світлодіодна навігація (LED-стрічки)', 'Автоматичне відкриття електрозамків'].map((item, i) => (
                <motion.li key={i} variants={fadeUp} className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 size={20} className="text-red-500 flex-shrink-0" /> {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </section>

      {/* Feature 3: Climate (Left Text, Right Image) */}
      <section className="py-24 px-6 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="order-2 lg:order-1">
            <motion.div variants={fadeUp} className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20">
              <Wind size={32} className="text-emerald-400" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Прецизійний Мікроклімат
            </motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-gray-400 mb-8">
              Якість повітря прямо впливає на продуктивність. Збирайте телеметрію з кожного класу для забезпечення ідеальних умов навчання.
            </motion.p>
            <motion.ul variants={staggerContainer} className="space-y-4">
              {['Моніторинг рівня вуглекислого газу (CO2)', 'Контроль температури та вологості', 'Детальні графіки та аналітика за періоди', 'Автоматичні сповіщення про необхідність провітрювання'].map((item, i) => (
                <motion.li key={i} variants={fadeUp} className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" /> {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} className="order-1 lg:order-2 relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full"></div>
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#121214] p-2 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1614624532983-4ce03382d63d?q=80&w=2000&auto=format&fit=crop" alt="Climate Sensors" className="rounded-2xl w-full object-cover opacity-80" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technology Grid */}
      <section id="technology" className="py-24 px-6 bg-black/80">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Створено для безвідмовної роботи</h2>
            <p className="text-gray-400 text-lg">Сучасний інженерний підхід під капотом екосистеми.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ y: -5 }} className="bg-[#121214] border border-white/5 p-8 rounded-3xl hover:border-blue-500/30 transition-all">
              <Wifi className="text-blue-400 mb-6" size={36} />
              <h3 className="text-2xl font-bold mb-3">Віддалені оновлення (OTA)</h3>
              <p className="text-gray-400">Всі апаратні пристрої на базі ESP отримують нові прошивки по повітрю без фізичного втручання.</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -5 }} className="bg-[#121214] border border-white/5 p-8 rounded-3xl hover:border-purple-500/30 transition-all">
              <CloudCog className="text-purple-400 mb-6" size={36} />
              <h3 className="text-2xl font-bold mb-3">Гібридна архітектура</h3>
              <p className="text-gray-400">Високонадійний REST API на FastAPI для управління та блискавичний брокер MQTT для потокової телеметрії.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-[#121214] border border-white/5 p-8 rounded-3xl hover:border-yellow-500/30 transition-all">
              <Zap className="text-yellow-400 mb-6" size={36} />
              <h3 className="text-2xl font-bold mb-3">Енергонезалежність</h3>
              <p className="text-gray-400">Система продовжує збирати дані і виконувати критичні сценарії навіть при повному блекауті завдяки UPS.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/20"></div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-4xl mx-auto text-center relative z-10 bg-[#121214]/50 backdrop-blur-xl border border-white/10 p-12 md:p-20 rounded-[3rem] shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Готові трансформувати свій заклад?</h2>
          <p className="text-xl text-gray-400 mb-10">Отримайте безкоштовний доступ до демо-стенду та побачте EduSense в дії.</p>
          <button className="px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center gap-2 mx-auto">
            Отримати доступ <ArrowUpRight size={24} />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#09090b] pt-16 pb-8 px-6 text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-white text-lg">
            <Activity size={20} className="text-blue-500" /> EduSense
          </div>
          <p className="text-sm">© 2026 EduSense Cloud Platform. Всі права захищено.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Документація</a>
            <a href="#" className="hover:text-white transition-colors">API Swagger</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
