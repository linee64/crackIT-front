import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Sparkles } from 'lucide-react';

const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 space-y-6">
      <div className="text-center space-y-2">
        <Sparkles className="w-16 h-16 text-primary mx-auto animate-pulse" />
        <h1 className="text-4xl font-extrabold text-slate-900">Список задач</h1>
        <p className="text-slate-500 max-w-md">Здесь будут твои интерактивные таски от AI-ментора.</p>
      </div>
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all"
      >
        <LayoutDashboard size={20} />
        Вернуться в дашборд
      </button>
    </div>
  );
};

export default TasksPage;
