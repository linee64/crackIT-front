import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
  User, 
  Building2, 
  ArrowRight, 
  Mail, 
  Lock,
  Sparkles,
  Fingerprint,
  AlertCircle
} from 'lucide-react';

const LoginPage: React.FC = () => {
  const [role, setRole] = useState<'employee' | 'company'>('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data.session) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка входа. Проверьте данные.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10"
      >
        {/* Left Side: Illustration / Info */}
        <div className="hidden lg:block space-y-8 pr-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">FirstDay</h1>
          </div>

          <div className="space-y-6">
            <h2 className="text-5xl font-extrabold leading-[1.1] text-slate-900">
              С возвращением <br />
              <span className="text-primary italic">в будущее компании</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-md">
              Продолжай работу над своими задачами, общайся с AI-ментором и помогай коллегам осваиваться.
            </p>
          </div>

          <div className="premium-glass p-6 rounded-3xl border border-white/40 shadow-xl inline-block">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                   <Fingerprint className="text-primary w-8 h-8" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Безовасность</div>
                  <div className="text-slate-800 font-semibold">Зашифровано сквозным шифрованием</div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="premium-glass p-8 sm:p-10 rounded-[32px] w-full border border-white/50 backdrop-blur-xl bg-white/80 shadow-2xl">
          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">Вход в систему</h3>
              <p className="text-slate-500">Введите свои данные для продолжения</p>
            </div>

            {/* Role Switcher (Keeping consistency with Register) */}
            <div className="flex p-1 bg-slate-100/80 rounded-2xl">
              <button
                type="button"
                onClick={() => setRole('employee')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  role === 'employee' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <User size={18} />
                <span>Сотрудник</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('company')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  role === 'company' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Building2 size={18} />
                <span>Компания</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm"
                >
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </motion.div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                      type="email" 
                      placeholder="work@company.com" 
                      className="input-premium pl-12"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-semibold text-slate-700">Пароль</label>
                    <a href="#" className="text-xs font-semibold text-primary hover:underline transition-all">Забыли пароль?</a>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="input-premium pl-12"
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
                className="btn-primary w-full flex items-center justify-center gap-2 mt-4 py-4"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Войти</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white/50 backdrop-blur-px px-2 text-slate-400">Или</span></div>
              </div>

              <p className="text-center text-sm text-slate-500">
                Нет аккаунта?{' '}
                <Link to="/register" className="font-bold text-primary hover:underline transition-all">Присоединиться</Link>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
