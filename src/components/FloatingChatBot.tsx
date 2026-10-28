import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Check, Sparkles, HelpCircle, ChevronRight, Phone } from 'lucide-react';
import { storageService, ChatMessage, QuickReply } from '../services/storageService';

interface FloatingChatBotProps {
  currentUser: any;
  isUserLoggedIn: boolean;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  onOpenLogin?: () => void;
}

export const FloatingChatBot: React.FC<FloatingChatBotProps> = ({
  currentUser,
  isUserLoggedIn,
  showToast,
  onOpenLogin
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userId = currentUser?.id || currentUser?.email || 'guest_user';
  const userName = currentUser?.name || currentUser?.email?.split('@')[0] || 'زائر ليرن ويب';

  // Load chat messages and quick replies
  const loadData = () => {
    const allMsgs = storageService.getChatMessages();
    // Filter messages for current user or show public/general chat
    const userMsgs = allMsgs.filter(m => m.userId === userId || m.userId === 'guest_user' || m.sender === 'admin');
    setMessages(userMsgs);
    setQuickReplies(storageService.getQuickReplies());
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000); // poll for new admin replies
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const content = textToSend || inputText;
    if (!content.trim()) return;

    if (!isUserLoggedIn) {
      showToast('يرجى تسجيل الدخول أولاً لإرسال رسالة مباشرة للإدارة', 'error');
      if (onOpenLogin) onOpenLogin();
      return;
    }

    const newMsg: Omit<ChatMessage, 'id' | 'createdAt' | 'isRead'> = {
      userId,
      userName,
      userEmail: currentUser?.email,
      message: content.trim(),
      sender: 'client'
    };

    storageService.saveChatMessage(newMsg);
    setInputText('');
    loadData();

    // Simulate smart auto-reply or admin bot response if needed
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Optional friendly welcome acknowledgment if first time
    }, 1000);
  };

  const handleQuickReplyClick = (reply: QuickReply) => {
    handleSend(reply.messageAr);
  };

  const isAiEnabled = storageService.getSettings()?.isAiChatEnabled === true;

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans" dir="rtl">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 ring-4 ring-blue-500/30 animate-bounce hover:animate-none"
          title={isAiEnabled ? "تواصل مع مساعد ليرن ويب الذكي ودعم الإدارة" : "تواصل مع إدارة ليرن ويب مباشرة"}
        >
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 animate-ping" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950" />
          {isAiEnabled ? <Bot className="w-8 h-8 group-hover:rotate-12 transition-transform" /> : <MessageSquare className="w-8 h-8 group-hover:scale-110 transition-transform" />}
          <span className="absolute right-full ml-3 px-3 py-1 bg-slate-900/90 text-slate-100 text-xs font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-slate-700/50">
            {isAiEnabled ? "مساعد ليرن ويب الذكي ودعم الإدارة 💬" : "الدعم المباشر والتواصل مع الإدارة 💬"}
          </span>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[580px] bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-blue-900/80 via-indigo-900/80 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                {isAiEnabled ? <Bot className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base flex items-center gap-1.5">
                  {isAiEnabled ? "دعم ليرن ويب الذكي" : "إدارة ليرن ويب والدعم المباشر"}
                  {isAiEnabled && <Sparkles className="w-4 h-4 text-amber-400" />}
                </h3>
                <p className="text-emerald-400 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  متصل الآن • ردود سريعة ومتابعة الإدارة
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/50">
            {/* Welcome banner message */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                {isAiEnabled ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl rounded-tr-none p-3.5 text-slate-200 text-sm shadow-sm space-y-1">
                <p className="font-bold text-blue-300 text-xs">إدارة ليرن ويب ⚡</p>
                <p>
                  {isAiEnabled 
                    ? "مرحباً بك! أنا المساعد الذكي لطاقم إدارة ليرن ويب. كيف يمكننا مساعدتك اليوم في تفعيل أو تخصيص منظومتك؟"
                    : "مرحباً بك! يسعدنا تواصلك المباشر مع طاقم إدارة ليرن ويب. يمكنك إرسال استفساراتك وسنقوم بمتابعتها والرد عليك فوراً."}
                </p>
              </div>
            </div>

            {/* Chat List */}
            {messages.map((msg) => {
              const isAdminMsg = msg.sender === 'admin';
              return (
                <div key={msg.id} className={`flex gap-3 items-start ${isAdminMsg ? '' : 'flex-row-reverse'}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isAdminMsg 
                      ? 'bg-blue-600/30 border border-blue-500/30 text-blue-400' 
                      : 'bg-indigo-600/30 border border-indigo-500/30 text-indigo-300'
                  }`}>
                    {isAdminMsg ? (isAiEnabled ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />) : <User className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[75%] p-3.5 rounded-2xl text-sm shadow-sm ${
                    isAdminMsg 
                      ? 'bg-blue-950/60 border border-blue-800/50 text-slate-100 rounded-tl-none' 
                      : 'bg-indigo-600 text-white rounded-tr-none'
                  }`}>
                    <p className={`font-semibold text-xs mb-1 ${isAdminMsg ? 'text-blue-300' : 'text-indigo-200'}`}>
                      {isAdminMsg ? 'مسؤول الإدارة' : msg.userName}
                    </p>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                    <span className="block text-[10px] opacity-70 mt-1 text-left">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2 items-center text-slate-400 text-xs italic bg-slate-900/60 p-2.5 rounded-xl w-fit">
                <Bot className="w-3.5 h-3.5 animate-spin text-blue-400" />
                الإدارة تكتب رداً...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Section */}
          {quickReplies.length > 0 && (
            <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800 overflow-x-auto flex gap-2 scrollbar-none">
              <span className="text-[11px] text-slate-400 font-medium self-center flex items-center gap-1 whitespace-nowrap">
                <HelpCircle className="w-3 h-3 text-cyan-400" /> ردود سريعة:
              </span>
              {quickReplies.map((qr) => (
                <button
                  key={qr.id}
                  onClick={() => handleQuickReplyClick(qr)}
                  className="px-3 py-1 bg-slate-800 hover:bg-blue-600/30 border border-slate-700 hover:border-blue-500 text-slate-200 hover:text-blue-300 text-xs rounded-xl whitespace-nowrap transition-all shadow-sm flex items-center gap-1"
                >
                  {qr.titleAr}
                  <ChevronRight className="w-3 h-3 rotate-180" />
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isUserLoggedIn ? "اكتب رسالتك للإدارة هنا..." : "يرجى تسجيل الدخول للمراسلة..."}
              disabled={!isUserLoggedIn}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={!isUserLoggedIn || !inputText.trim()}
              className="p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
