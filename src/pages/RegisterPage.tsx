import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
  User, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  Key, 
  Mail, 
  Lock,
  Sparkles,
  AlertCircle,
  Hash
} from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<'employee' | 'teamleader'>('employee');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [platformInvite, setPlatformInvite] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
            first_name: firstName,
            last_name: lastName,
            // Для совместимости со старыми триггерами (если они есть),
            // мы можем передать company_name, даже если это teamleader.
            company_name: companyName,
          }
        }
      });

      if (error) throw error;
      
      if (data.user) {
        // Если это тимлидер, записываем его в отдельную таблицу
        if (role === 'teamleader') {
          try {
            const { error: insertError } = await supabase
              .from('team_leaders')
              .insert({
                id: data.user.id,
                first_name: firstName,
                last_name: lastName,
                company_name: companyName,
                email: email
              });

            if (insertError) {
              console.error("DEBUG: Ошибка вставки в team_leaders:", insertError);
              // Если вставка не удалась, НЕ ПРЕРЫВАЕМ регистрацию, а просто предупреждаем
              alert(`Внимание: аккаунт создан, но возникла ошибка при записи в профиль: ${insertError.message}`);
            }
          } catch (tableErr) {
            console.error("DEBUG: Критическая ошибка таблицы:", tableErr);
          }
        }

        alert('Регистрация успешна! Проверьте почту (если включено подтверждение) или попробуйте войти!');
        navigate('/login');
      }
    } catch (err: any) {
      console.error("DEBUG: Ошибка signUp:", err);
      setError(err.message || 'Ошибка регистрации.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden relative font-sans text-slate-900">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10"
      >
        {/* Left Side: Info & Branding */}
        <div className="hidden lg:block space-y-8 pr-12">
          <div className="flex items-center gap-3 cursor-default">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">FirstDay</h1>
          </div>

          <div className="space-y-6">
            <h2 className="text-5xl font-extrabold leading-[1.1] text-slate-900">
              {role === 'employee' 
                ? "Начни путь в компании уверенно" 
                : "Управляй командой эффективно"}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-md">
              {role === 'employee'
                ? "Решай реальные задачи с поддержкой AI-ментора. Никакого страха сделать ошибку — только развитие."
                : "Автоматизируй онбординг своей команды и отслеживай их прогресс в реальном времени."}
            </p>
          </div>

          <div className="space-y-4">
            {[
              role === 'employee' ? "AI-ментор на базе GPT-4o" : "Статистика обучения команды",
              role === 'employee' ? "Симулятор реальных задач" : "Управление контентом онбординга",
              role === 'employee' ? "Мгновенная связь с куратором" : "Аналитика прогресса новичков"
            ].map((text, i) => (
              <motion.div 
                key={text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="flex items-center gap-3 text-slate-700"
              >
                <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                </div>
                <span className="font-semibold text-slate-600">{text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="premium-glass p-8 sm:p-10 rounded-[40px] w-full border border-white/60 backdrop-blur-3xl bg-white/70 shadow-2xl flex flex-col gap-8 transition-all hover:bg-white/80">
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Создать аккаунт</h3>
            <p className="text-slate-500 font-medium tracking-tight">Заполни данные, чтобы войти в систему</p>
          </div>

          <div className="flex p-1.5 bg-slate-100/90 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('employee')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${
                role === 'employee' 
                  ? 'bg-white text-primary shadow-lg shadow-primary/5' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <User size={18} />
              <span>Сотрудник</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('teamleader')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${
                role === 'teamleader' 
                  ? 'bg-white text-primary shadow-lg shadow-primary/5' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Users size={18} />
              <span>Тимлидер</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50/80 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 font-semibold shadow-sm"
              >
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Имя</label>
                <input 
                   type="text" 
                   placeholder="Иван" 
                   className="input-premium py-3.5 px-5"
                   value={firstName}
                   onChange={(e) => setFirstName(e.target.value)}
                   required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Фамилия</label>
                <input 
                   type="text" 
                   placeholder="Иванов" 
                   className="input-premium py-3.5 px-5"
                   value={lastName}
                   onChange={(e) => setLastName(e.target.value)}
                   required
                />
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {role === 'employee' ? (
                  <motion.div
                    key="employee-fields"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Инвайт-код</label>
                      <div className="relative group">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                        <input 
                          type="text" 
                          placeholder="FD-XXXX-XXXX" 
                          className="input-premium pl-12 py-3.5"
                          value={inviteCode}
                          onChange={(e) => setInviteCode(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="teamleader-fields"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Название компании</label>
                      <div className="relative group">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                        <input 
                          type="text" 
                          placeholder="Напр. Verigram" 
                          className="input-premium pl-12 py-3.5"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Код доступа Тимлидера</label>
                      <div className="relative group">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                        <input 
                          type="text" 
                          placeholder="PLATFORM-XXXX" 
                          className="input-premium pl-12 py-3.5"
                          value={platformInvite}
                          onChange={(e) => setPlatformInvite(e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type="email" 
                    placeholder="work@example.com" 
                    className="input-premium pl-12 py-3.5"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Пароль</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="input-premium pl-12 py-3.5"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-3 mt-4 py-4.5 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-lg">Создать аккаунт</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            <p className="text-center text-sm text-slate-500 mt-6 font-medium">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="font-bold text-primary hover:text-primary/80 transition-all border-b-2 border-primary/10 hover:border-primary">Войти</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
