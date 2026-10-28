import React from 'react';
import { Rocket, Sparkles, X, ChevronRight } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
  onNavigate: (tab: string) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, lang, onNavigate }) => {
  if (!isOpen) return null;
  const isRtl = lang === 'ar';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl border border-blue-500/30 bg-slate-900/95 p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={20} />
        </button>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />
        
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
            <Rocket className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            {isRtl ? 'مرحباً بك في عالمنا الفضائي!' : 'Welcome to our cosmic world!'}
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            {isRtl 
              ? 'استكشف منصتنا، اكتشف أحدث المنظومات، وشاركنا تجربتك. رحلة ممتعة تنتظرك!' 
              : 'Explore our platform, discover the latest systems, and share your experience. An exciting journey awaits!'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full pt-4">
            <button 
              onClick={() => { onNavigate('store'); onClose(); }}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-500 transition"
            >
              {isRtl ? 'تصفح المتجر' : 'Browse Store'} <ChevronRight size={16} />
            </button>
            <button 
              onClick={() => { onNavigate('rating'); onClose(); }}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              {isRtl ? 'قيمنا' : 'Rate Us'} <Sparkles size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
