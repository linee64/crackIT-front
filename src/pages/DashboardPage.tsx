import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
  LogOut, 
  LayoutDashboard, 
  User, 
  Settings, 
  Bell,
  Sparkles,
  ArrowRight,
  ChevronRight,
  BrainCircuit,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          console.error("Auth error or no user found:", error);
          navigate('/login');
        } else {
          setUser(user);
        }
      } catch (err) {
        console.error("Critical error in fetchUser:", err);
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!user) return <div className="min-h-screen bg-background flex items-center justify-center font-sans"><div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div></div>;

  const firstName = user.user_metadata?.first_name || 'Сотрудник';
  const lastName = user.user_metadata?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const roleDisplay = user.user_metadata?.role === 'company' ? 'Администратор' : 'Сотрудник';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-primary/10">
      {/* Sidebar (Desktop) / Navbar (Mobile) */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 z-40 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/10 shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer">
              <Sparkles className="text-primary w-6 h-6" />
           </div>
           <span className="font-extrabold text-2xl tracking-tight text-slate-800">FirstDay</span>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/40">
              <button className="px-4 py-1.5 bg-white rounded-xl shadow-sm border border-slate-200/20 text-sm font-bold text-slate-800">Рабочая область</button>
              <button 
                onClick={() => navigate('/analytics')}
                className="px-4 py-1.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Аналитика
              </button>
           </div>

           <div className="h-10 w-[1px] bg-slate-200/60 hidden sm:block"></div>
           
           <div className="flex items-center gap-4">
              <button className="p-2.5 hover:bg-slate-100 rounded-2xl transition-all relative text-slate-400 hover:text-slate-600 active:scale-90">
                <Bell size={22} strokeWidth={2.3} />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white ring-2 ring-primary/20 animate-pulse"></span>
              </button>
              
              <div className="flex items-center gap-3.5 pl-2 group cursor-pointer">
                 <div className="text-right hidden sm:block">
                    <div className="text-sm font-extrabold leading-none text-slate-800 transition-colors group-hover:text-primary">{fullName}</div>
                    <div className="text-[11px] text-slate-400 capitalize font-bold mt-1 tracking-wider">{roleDisplay}</div>
                 </div>
                 <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-white shadow-md flex items-center justify-center overflow-hidden transition-all group-hover:ring-4 group-hover:ring-primary/10">
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                       {firstName.charAt(0)}
                    </div>
                 </div>
                 <button 
                   onClick={handleLogout}
                   className="p-2.5 hover:bg-red-50 rounded-2xl transition-all text-slate-400 hover:text-red-500 active:scale-90 ml-1 shadow-sm border border-transparent hover:border-red-100 hover:shadow-red-500/5"
                   title="Выйти"
                 >
                   <LogOut size={22} strokeWidth={2.3} />
                 </button>
              </div>
           </div>
        </div>
      </nav>

      <main className="pt-32 pb-16 px-6 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-10"
        >
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20 text-primary font-bold text-xs tracking-wider uppercase">
                Мониторинг прогресса
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 flex items-center gap-4 tracking-tight">
                С возвращением, <span className="text-primary italic font-black">{firstName}</span>!
              </h1>
              <p className="text-slate-500 font-medium text-lg max-w-2xl leading-relaxed">
                Твой путь адаптации в самом разгаре. Давай продолжим работу над задачами от AI-ментора.
              </p>
            </div>
            
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-4 rounded-3xl font-extrabold flex items-center gap-3 transition-all hover:translate-y-[-4px] active:translate-y-0 shadow-xl shadow-slate-900/20 group">
               Профиль системы
               <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             {/* Секция статистики */}
             <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                <motion.button 
                   whileHover={{ y: -5, scale: 1.01 }}
                   whileTap={{ scale: 0.98 }}
                   className="premium-glass p-8 rounded-[40px] border border-white/60 bg-white/40 shadow-xl shadow-slate-200/40 relative overflow-hidden group text-left w-full cursor-pointer h-full"
                >
                   <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full transition-transform group-hover:scale-150 duration-700" />
                   <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Активные задачи</div>
                   <div className="text-5xl font-black text-slate-900 tracking-tighter">0</div>
                   <div className="mt-4 flex items-center gap-2">
                      <div className="px-2 py-0.5 bg-green-100 text-green-700 rounded-lg text-[10px] font-black uppercase">Completed</div>
                      <div className="text-slate-400 text-[11px] font-bold">100% успеваемость</div>
                   </div>
                </motion.button>

                <motion.button 
                   whileHover={{ y: -5, scale: 1.01 }}
                   whileTap={{ scale: 0.98 }}
                   className="premium-glass p-8 rounded-[40px] border border-white/60 bg-white/40 shadow-xl shadow-slate-200/40 relative overflow-hidden group text-left w-full cursor-pointer h-full"
                >
                   <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/5 rounded-full transition-transform group-hover:scale-150 duration-700" />
                   <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Твой уровень</div>
                   <div className="flex items-baseline gap-2">
                      <div className="text-5xl font-black text-slate-900 tracking-tighter">1</div>
                      <div className="text-slate-400 font-bold">Level</div>
                   </div>
                   <div className="mt-5 space-y-2">
                      <div className="h-2.5 w-full bg-slate-100/80 rounded-full overflow-hidden border border-slate-200/50">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: '25%' }}
                           transition={{ duration: 1, delay: 0.5 }}
                           className="h-full bg-gradient-to-r from-primary to-accent" 
                         />
                      </div>
                   </div>
                </motion.button>
             </div>

             {/* Секция основных действий */}
             <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.button 
                   whileHover={{ y: -8, scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => navigate('/simulator')}
                   className="p-8 rounded-[40px] bg-slate-900 border border-white/10 shadow-2xl shadow-slate-900/80 relative overflow-hidden group cursor-pointer text-left w-full transition-all flex flex-col justify-between min-h-[320px]"
                >
                   <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   <div className="absolute -right-6 -bottom-6 text-white/5 group-hover:text-primary/10 group-hover:rotate-12 transition-all duration-700">
                      <BrainCircuit className="w-48 h-48" strokeWidth={1} />
                   </div>
                   
                   <div className="relative z-10 w-full">
                      <div className="flex justify-between items-start mb-6">
                         <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                              <Zap className="text-primary w-4 h-4" />
                           </div>
                           <span className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em]">Практика</span>
                         </div>
                         <div className="px-3 py-1 bg-white/5 text-white/80 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md">
                            New
                         </div>
                      </div>
                      
                      <div className="space-y-1">
                         <h4 className="text-3xl font-black text-white tracking-tighter leading-none">AI Симулятор</h4>
                         <p className="text-3xl font-black text-primary italic tracking-tighter">реальных задач</p>
                      </div>
                   </div>

                   <div className="relative z-10 mt-auto">
                      <div className="flex items-center gap-4">
                         <div className="bg-primary group-hover:bg-white text-white group-hover:text-primary p-3 rounded-2xl shadow-lg shadow-primary/20 transition-all duration-300">
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                         </div>
                         <span className="text-xs font-black text-white/60 group-hover:text-white transition-colors uppercase tracking-widest">Начать практику</span>
                      </div>
                   </div>
                </motion.button>

                <motion.button 
                   whileHover={{ y: -8, scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => navigate('/chat')}
                   className="p-8 rounded-[40px] bg-gradient-to-br from-primary to-primary/80 border border-white/20 shadow-2xl shadow-primary/30 relative overflow-hidden group cursor-pointer text-left w-full flex flex-col justify-between min-h-[320px]"
                >
                   <div className="absolute -right-6 -bottom-6 text-white/10 group-hover:rotate-12 transition-transform duration-500">
                      <Sparkles className="w-48 h-48" strokeWidth={1} />
                   </div>
                   
                   <div className="relative z-10">
                      <div className="text-[11px] font-black text-white/60 uppercase tracking-[0.2em] mb-6">AI Ассистент</div>
                      <h4 className="text-3xl font-black text-white tracking-tighter leading-none mb-2">Чат с ментором</h4>
                      <p className="text-white/70 text-sm font-medium leading-snug max-w-[180px]">Получи мгновенную помощь по любому вопросу</p>
                   </div>

                   <div className="relative z-10 mt-auto">
                      <div className="bg-white/20 group-hover:bg-white p-3 rounded-2xl inline-flex shadow-inner transition-all duration-300">
                         <ArrowRight className="text-white group-hover:text-primary w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </div>
                   </div>
                </motion.button>
             </div>
          </div>

          <div className="premium-glass p-12 rounded-[48px] min-h-[400px] flex items-center justify-center border border-white/80 bg-white/60 shadow-2xl shadow-slate-200/60 relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none">
               <Sparkles className="w-[600px] h-[600px] text-primary transition-all group-hover:rotate-45" strokeWidth={0.5} />
             </div>
             
             <div className="text-center space-y-6 relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[32px] flex items-center justify-center mx-auto mb-6 border border-white shadow-xl shadow-slate-200/60 ring-8 ring-slate-50/50">
                    <Settings className="text-slate-300 w-12 h-12 animate-spin-slow" strokeWidth={1.5} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Пока нет новых тасков</h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                    Твой менеджер скоро назначит тебе первый блок задач для онбординга. А пока можешь изучить систему.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-4 pt-4">
                  <button onClick={() => navigate('/tasks')} className="bg-white border-2 border-slate-100 hover:border-primary/20 hover:text-primary px-8 py-3.5 rounded-2xl font-black text-slate-800 transition-all shadow-sm hover:translate-y-[-2px] active:translate-y-0">
                    Библиотека знаний
                  </button>
                </div>
             </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;
