import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, 
  ArrowLeft, 
  User, 
  Sparkles,
  Bot,
  Paperclip,
  MoreHorizontal,
  Loader2,
  Plus,
  MessageSquare,
  Trash2,
  PanelLeft,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGeminiResponse } from '../lib/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
}

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem('chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((chat: any) => ({
          ...chat,
          updatedAt: new Date(chat.updatedAt),
          messages: chat.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        }));
      } catch (e) {
        console.error("Failed to parse chat history", e);
        return [];
      }
    }
    return [];
  });

  const [currentChatId, setCurrentChatId] = useState<string | null>(() => {
    const saved = localStorage.getItem('last_chat_id');
    return saved || null;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync current chat messages
  useEffect(() => {
    if (currentChatId) {
      const chat = chats.find(c => c.id === currentChatId);
      if (chat) {
        setMessages(chat.messages);
      }
    } else if (chats.length === 0) {
      // Create initial chat if none exists
      createNewChat();
    } else {
      setCurrentChatId(chats[0].id);
    }
  }, [currentChatId, chats]);

  // Save to localStorage whenever chats change
  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(chats));
    if (currentChatId) {
      localStorage.setItem('last_chat_id', currentChatId);
    }
  }, [chats, currentChatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: window.crypto.randomUUID(),
      title: 'Новый чат',
      messages: [
        {
          id: '1',
          text: 'Привет! Я твой персональный AI-ментор. Как я могу помочь тебе сегодня в твоем онбординге?',
          sender: 'ai',
          timestamp: new Date()
        }
      ],
      updatedAt: new Date()
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const deleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newChats = chats.filter(c => c.id !== id);
    setChats(newChats);
    if (currentChatId === id) {
      if (newChats.length > 0) {
        setCurrentChatId(newChats[0].id);
      } else {
        createNewChat();
      }
    }
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim() || isLoading || !currentChatId) return;

    const userMessage: Message = {
      id: window.crypto.randomUUID(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    if (!text) setInputValue('');
    setIsLoading(true);

    // Update chat title if it's the first user message
    const isFirstUserMessage = messages.filter(m => m.sender === 'user').length === 0;
    
    try {
      const history = updatedMessages
        .filter(m => m.id !== '1')
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

      const response = await getGeminiResponse(messageText, history);
      
      const aiResponse: Message = {
        id: window.crypto.randomUUID(),
        text: response,
        sender: 'ai',
        timestamp: new Date()
      };
      
      const finalMessages = [...updatedMessages, aiResponse];
      setMessages(finalMessages);

      // Update the chat in state
      setChats(prev => prev.map(c => {
        if (c.id === currentChatId) {
          return {
            ...c,
            messages: finalMessages,
            title: isFirstUserMessage ? messageText.slice(0, 30) + (messageText.length > 30 ? '...' : '') : c.title,
            updatedAt: new Date()
          };
        }
        return c;
      }));
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-white border-r border-slate-200/60 flex flex-col h-screen z-50 relative shrink-0"
          >
            <div className="p-4 border-b border-slate-200/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="text-primary w-5 h-5" />
                </div>
                <span className="font-extrabold text-lg text-slate-800">История</span>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <button 
                onClick={createNewChat}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-slate-900/10"
              >
                <Plus size={18} />
                Новый чат
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setCurrentChatId(chat.id)}
                  className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    currentChatId === chat.id 
                      ? 'bg-primary/10 text-primary border border-primary/10' 
                      : 'hover:bg-slate-100 text-slate-600 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <MessageSquare size={16} className={currentChatId === chat.id ? 'text-primary' : 'text-slate-400'} />
                    <span className="text-sm font-bold truncate max-w-[180px]">{chat.title}</span>
                  </div>
                  <button 
                    onClick={(e) => deleteChat(e, chat.id)}
                    className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500 text-slate-400`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-200/60 mt-auto">
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full flex items-center gap-3 p-3 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors font-bold text-sm"
              >
                <ArrowLeft size={18} />
                В дашборд
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Toggle Sidebar Button (Mobile/When closed) */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-5 left-6 z-50 p-2.5 bg-white border border-slate-200/60 shadow-sm rounded-xl text-slate-600 hover:bg-slate-50 transition-all active:scale-90"
          >
            <PanelLeft size={22} />
          </button>
        )}

        {/* Header */}
        <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {isSidebarOpen ? null : <div className="w-10" />} {/* Spacer for toggle button */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/10">
                <Bot className="text-primary w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-slate-800 leading-none">AI Ментор</h1>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Online</span>
                </div>
              </div>
            </div>
          </div>
          
          <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
            <MoreHorizontal size={22} />
          </button>
        </nav>

        {/* Chat Messages */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto w-full custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-1 ${
                    message.sender === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-primary/10 text-primary'
                  }`}>
                    {message.sender === 'user' ? <User size={18} /> : <Sparkles size={18} />}
                  </div>
                  <div className={`p-4 rounded-2xl shadow-sm ${
                    message.sender === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200/60 text-slate-800 rounded-tl-none'
                  }`}>
                    <div className={`text-sm font-medium leading-relaxed prose prose-sm ${message.sender === 'user' ? 'prose-invert' : ''}`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.text}
                      </ReactMarkdown>
                    </div>
                    <span className={`text-[10px] mt-2 block font-bold uppercase tracking-wider ${
                      message.sender === 'user' ? 'text-white/60' : 'text-slate-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                key="loading-indicator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Bot size={18} className="animate-spin-slow" />
                  </div>
                  <div className="bg-white border border-slate-200/60 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-primary" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ментор думает...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </main>

        {/* Input Area */}
        <div className="p-6 bg-white/80 backdrop-blur-md border-t border-slate-200/60 z-30">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Suggestions */}
            {!isLoading && messages.length <= 1 && (
              <div className="flex flex-wrap gap-2">
                {[
                  "Какие мои первые задачи?",
                  "Расскажи о культуре компании",
                  "Где найти регламенты?",
                  "Как работает система бонусов?"
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(suggestion)}
                    className="px-4 py-2 bg-slate-50 hover:bg-primary/5 text-slate-600 hover:text-primary border border-slate-200 hover:border-primary/20 rounded-xl text-xs font-bold transition-all active:scale-95"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  disabled={isLoading}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isLoading ? "Ментор печатает..." : "Напишите сообщение ментору..."}
                  className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 disabled:opacity-50"
                />
                <Paperclip className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 cursor-pointer hover:text-slate-600" />
              </div>
              <button 
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">AI может ошибаться. Проверяйте важную информацию.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
