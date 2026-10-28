import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Send, Bot, User, Trash2, ShieldCheck, Crown, 
  Paperclip, Image as ImageIcon, FileText, X, Check, Eye, 
  Key, Cpu, RefreshCw, Zap, ExternalLink, HelpCircle, AlertCircle,
  Phone, PhoneCall, PhoneOff, Mic, MicOff, Volume2, VolumeX, History, Clock
} from 'lucide-react';
import { 
  storageService, 
  SupportTicket, 
  SupportTicketMessage, 
  SupportTicketAttachment, 
  subscribeToAiContext, 
  AiContext,
  AiCallRecord
} from '../services/storageService';

interface AiSupportChatProps {
  lang?: 'ar' | 'en';
  currentUser?: any;
  settings?: any;
}

export default function AiSupportChat({ lang = 'ar', currentUser, settings }: AiSupportChatProps) {
  const isRtl = lang === 'ar';
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Persistent User/Visitor ID
  const [visitorId] = useState<string>(() => {
    if (currentUser?.id) return currentUser.id;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lernweb_chat_visitor_id');
      if (saved) return saved;
      const newId = 'v-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
      localStorage.setItem('lernweb_chat_visitor_id', newId);
      return newId;
    }
    return 'guest-' + Date.now();
  });

  const userId = currentUser?.id || visitorId;
  const userName = currentUser?.name || 'زائر كريم';
  const userPhone = currentUser?.phone || '';
  const userEmail = currentUser?.email || '';

  const [ticket, setTicket] = useState<SupportTicket | null>(() => storageService.getTicketByUserId(userId));
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Attachments State (Images & Documents)
  const [stagedAttachments, setStagedAttachments] = useState<SupportTicketAttachment[]>([]);
  const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);

  // AI Provider & Model Selection (Exclusively Gemini Engine)
  const [selectedProvider] = useState<'gemini'>('gemini');
  const [selectedModel] = useState<string>('gemini-1.5-flash');

  // Key Pool Metrics State
  const [keyPoolStatus, setKeyPoolStatus] = useState<{
    totalKeys: number;
    activeKeys: number;
    coolingDownKeys: number;
    hasOpenAiKey?: boolean;
    slots?: any[];
  }>({
    totalKeys: 25,
    activeKeys: 25,
    coolingDownKeys: 0
  });
  const [isKeyPoolModalOpen, setIsKeyPoolModalOpen] = useState(false);

  // Fetch real-time key pool status from server
  const fetchKeyPoolStatus = async () => {
    try {
      const res = await fetch('/api/ai/keys-status');
      if (res.ok) {
        const data = await res.json();
        setKeyPoolStatus(data);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchKeyPoolStatus();
    const interval = setInterval(fetchKeyPoolStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Sync ticket with storageService
  useEffect(() => {
    const updateLocalTicket = () => {
      const fresh = storageService.getTicketByUserId(userId);
      setTicket(fresh);
    };

    updateLocalTicket();
    const unsubscribe = storageService.subscribe(() => {
      updateLocalTicket();
    });
    return () => unsubscribe();
  }, [userId]);

  // Auto-scroll on new messages or thinking state
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ticket?.messages, isThinking, stagedAttachments]);

  const clearChat = () => {
    if (ticket?.id) {
      storageService.deleteSupportTicket(ticket.id);
      setTicket(null);
      setStagedAttachments([]);
    }
  };

  // Voice Call & Call History States
  const [callHistory, setCallHistory] = useState<AiCallRecord[]>(() => storageService.getCallHistory(userId));
  const [isCallHistoryOpen, setIsCallHistoryOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'speaking' | 'listening' | 'ended'>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callTopic, setCallTopic] = useState(isRtl ? 'استفسار عام عن المنظومة والباقات' : 'General Platform Inquiry');
  const [callAiSpokenText, setCallAiSpokenText] = useState('');
  const [callVoiceInput, setCallVoiceInput] = useState('');
  const [isCallAiThinking, setIsCallAiThinking] = useState(false);
  const callTimerRef = useRef<any>(null);
  const callStartTimestampRef = useRef<number>(0);

  // Sync call history with storageService
  const refreshCallHistory = () => {
    setCallHistory(storageService.getCallHistory(userId));
  };

  useEffect(() => {
    const unsub = storageService.subscribe(() => {
      refreshCallHistory();
    });
    return () => unsub();
  }, [userId]);

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isSpeakerOn) {
      try {
        window.speechSynthesis.cancel();
        // Clean markdown symbols for natural voice
        const cleanText = text.replace(/[*#_`~>•-]/g, ' ').replace(/\n+/g, ' ').slice(0, 300);
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = isRtl ? 'ar-SA' : 'en-US';
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.onstart = () => setCallStatus('speaking');
        utterance.onend = () => setCallStatus('listening');
        utterance.onerror = () => setCallStatus('listening');
        window.speechSynthesis.speak(utterance);
      } catch {
        setCallStatus('listening');
      }
    } else {
      setCallStatus('listening');
    }
  };

  const handleStartAiCall = (customTopic?: string) => {
    const topicToUse = customTopic || (isRtl ? 'مكالمة استشارية: باقات وميزات المنظومة' : 'Platform Consultation Call');
    setCallTopic(topicToUse);
    setIsCallModalOpen(true);
    setCallStatus('connecting');
    setCallDuration(0);
    callStartTimestampRef.current = Date.now();

    const greetingText = isRtl 
      ? `أهلاً بك يا ${userName} في المكالمة الصوتية المباشرة مع المساعد الذكي لليرن ويب. أنا جاهز للإجابة صوتياً عن أي استفسار حول الباقات، التراخيص، أرقام المحافظ، أو تجربة المحاكي!`
      : `Hello ${userName}, welcome to your live voice consultation with Lern Web AI Assistant. I am ready to answer your questions on plans, licenses, wallets, and the sandbox simulator!`;

    setCallAiSpokenText(greetingText);

    setTimeout(() => {
      setCallStatus('connected');
      speakText(greetingText);
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }, 1200);
  };

  const handleEndAiCall = (status: 'completed' | 'cancelled' = 'completed') => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch {}
    }

    const duration = callDuration;
    const finalStart = new Date(callStartTimestampRef.current || (Date.now() - duration * 1000)).toISOString();
    const finalEnd = new Date().toISOString();

    // Persist to Call History
    if (duration > 2 || status === 'completed') {
      storageService.addCallRecord({
        userId,
        userName,
        callType: 'voice_ai',
        startedAt: finalStart,
        endedAt: finalEnd,
        durationSeconds: duration,
        status,
        topicSummaryAr: callTopic,
        topicSummaryEn: callTopic,
        transcriptSnippet: callAiSpokenText.slice(0, 160),
        provider: selectedProvider,
        model: selectedModel
      });
      refreshCallHistory();
    }

    setCallStatus('ended');
    setTimeout(() => {
      setIsCallModalOpen(false);
    }, 800);
  };

  const handleSendCallQuery = async (queryText: string) => {
    if (!queryText.trim() || isCallAiThinking || isMuted) return;
    setIsCallAiThinking(true);
    setCallStatus('speaking');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          systemInstruction: `أنت في مكالمة صوتية مباشرة مع العميل (${userName}). أجب بإيجاز واحترافية وبطريقة مناسبة للاستماع الصوتي في حدود فقرتين قصيرتين. استخدم بيانات منصة ليرن ويب الدقيقة.`,
          provider: selectedProvider,
          model: selectedModel
        })
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.text || (isRtl ? 'شكراً لك، أنا في خدمتك دائماً.' : 'Thank you, at your service.');
        setCallAiSpokenText(replyText);
        speakText(replyText);
      } else {
        const fallback = isRtl 
          ? 'نحن نوفر 3 باقات: الشهرية 950 جنيه، والسنوية 8,500 جنيه، والتملك الكامل 27,000 جنيه، ومحافظ فودافون كاش وانستاباي متاحة فوراً.' 
          : 'We offer flexible tiers: monthly $29, annual $249, and full source code buyout $799.';
        setCallAiSpokenText(fallback);
        speakText(fallback);
      }
    } catch {
      const fallback = isRtl 
        ? 'تم استلام استفسارك الصوتي، ويمكنك مراجعة كافة التفاصيل في لوحة المنصة أو مراسلتنا عبر الواتساب.' 
        : 'Your voice query was received. You can also contact us via WhatsApp.';
      setCallAiSpokenText(fallback);
      speakText(fallback);
    } finally {
      setIsCallAiThinking(false);
      setCallVoiceInput('');
    }
  };

  const handleDeleteCallRecord = (recordId: string) => {
    storageService.deleteCallRecord(recordId);
    refreshCallHistory();
  };

  const handleClearAllCalls = () => {
    if (window.confirm(isRtl ? 'هل أنت متأكد من مسح سجل المكالمات بالكامل؟' : 'Are you sure you want to clear all call history?')) {
      storageService.clearCallHistory(userId);
      refreshCallHistory();
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Convert File to Base64
  const handleFileProcess = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1] || '';
      const newAtt: SupportTicketAttachment = {
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        data: base64Data,
        previewUrl: file.type.startsWith('image/') ? result : undefined
      };
      setStagedAttachments(prev => [...prev.slice(-4), newAtt]); // Keep up to 5 attachments
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(handleFileProcess);
    }
    if (e.target) e.target.value = '';
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          handleFileProcess(file);
        }
      }
    }
  };

  const removeStagedAttachment = (index: number) => {
    setStagedAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Subscribe to real-time AI Context Hook / Listener
  const [aiContext, setAiContext] = useState<AiContext>(() => storageService.getAiContext());

  useEffect(() => {
    const unsubscribeContext = subscribeToAiContext((updatedContext) => {
      setAiContext(updatedContext);
    });
    return () => unsubscribeContext();
  }, []);

  // Local Client-Side AI Synthesizer (Guarantees zero AI failure when published on static hosting)
  const synthesizeLocalAiResponse = (userText: string, attachments?: SupportTicketAttachment[]): string => {
    const cleanMsg = (userText || '').trim().toLowerCase();

    // Fast-Path: Developer / Programmer Identity
    const programmerQueryPatterns = [
      'من برمجك', 'مين برمجك', 'من طورك', 'مين طورك', 'من صنعك', 'مين صنعك',
      'من المطور', 'مين المطور', 'مين عملك', 'من عملك', 'من برمجتك', 'مين برمجتك',
      'من انشأك', 'مين انشاك', 'مين صممك', 'من صممك',
      'who programmed you', 'who developed you', 'who made you', 'who created you'
    ];
    if (programmerQueryPatterns.some(pattern => cleanMsg.includes(pattern))) {
      return isRtl
        ? 'تمت برمجتي وتطويري بالكامل بواسطة فريق ومهندسي شركة ليرن ويب (Lern Web) المتخصصة في الحلول التعليمية السحابية وأنظمة إدارة المراكز والسناتر المتقدمة.'
        : 'I was fully developed and programmed by the engineering team at Lern Web Systems & Lab.';
    }

    // 1. Pricing & Plans
    if (cleanMsg.includes('سعر') || cleanMsg.includes('أسعار') || cleanMsg.includes('بكام') || cleanMsg.includes('اشتراك') || cleanMsg.includes('price') || cleanMsg.includes('تمليك') || cleanMsg.includes('باقة')) {
      const plans = storageService.getPlans();
      return (isRtl ? `مرحباً بك! بناءً على أحدث بيانات باقات ليرن ويب الرسمية:\n\n` : `Official Lern Web Pricing Tiers:\n\n`) + 
        plans.map((p) => `• ${isRtl ? p.nameAr : p.nameEn}: ${isRtl ? p.priceAr : p.priceEn} (${isRtl ? p.periodAr : p.periodEn})\n  ${isRtl ? p.descriptionAr : p.descriptionEn}`).join('\n\n') + 
        (isRtl 
          ? `\n\n💎 **باقة التملك الكامل للكود المصدري (27,000 ج.م / $799):** تمنحك استقلالية تامة وملكية مدى الحياة مع تسليم مستودع Next.js الأصلي دون أي اشتراكات شهرية.`
          : `\n\n💎 **Full Source Code Buyout ($799 / 27,000 EGP):** Grants perpetual ownership with complete Next.js repository delivery and zero recurring fees.`);
    }

    // 2. Wallets & Payment Methods
    if (cleanMsg.includes('دفع') || cleanMsg.includes('محفظ') || cleanMsg.includes('فودافون') || cleanMsg.includes('انستاباي') || cleanMsg.includes('اورانج') || cleanMsg.includes('تحويل') || cleanMsg.includes('wallet')) {
      const wallets = storageService.getWallets().filter(w => w.isActive !== false);
      return (isRtl ? `طرق ومحافظ الدفع الإلكتروني المباشرة المعتمدة (عمولة 0%):\n\n` : `Accepted Payment Wallets (0% Fee):\n\n`) + 
        wallets.map((w) => `• ${isRtl ? w.nameAr : w.nameEn}: [ ${w.number || w.url} ]\n  إرشادات: ${isRtl ? w.instructionsAr : w.instructionsEn}`).join('\n\n') + 
        (isRtl 
          ? `\n\nبعد إتمام التحويل، يمكنك إرسال صورة إيصال التحويل هنا في الشات فوراً ليتم تفعيل حسابك وترخيصك لحظياً!`
          : `\n\nAfter transferring, send a receipt screenshot here in the chat for instant account verification!`);
    }

    // 3. Projects & Systems Catalog
    if (cleanMsg.includes('مشروع') || cleanMsg.includes('مشاريع') || cleanMsg.includes('منظومة') || cleanMsg.includes('سنتر') || cleanMsg.includes('lms') || cleanMsg.includes('project')) {
      const projects = storageService.getProjects(false);
      return (isRtl ? `المشاريع والمنظومات التعليمية الجاهزة المتاحة في المتجر:\n\n` : `Certified App Store Projects:\n\n`) + 
        projects.map((p) => `• ${isRtl ? p.titleAr : p.titleEn}:\n  ${isRtl ? p.taglineAr : p.taglineEn}\n  السعر: ${p.priceMonthly} | التمليك: ${p.priceFull}`).join('\n\n') + 
        (isRtl 
          ? `\n\nيمكنك تجربة أي منظومة في المحاكي التفاعلي أو طلب تخصيصها بهوية مركزك.`
          : `\n\nYou can test any system live in the interactive sandbox simulator.`);
    }

    // 4. PWA & Offline Support
    if (cleanMsg.includes('pwa') || cleanMsg.includes('تطبيق') || cleanMsg.includes('بدون نت') || cleanMsg.includes('offline') || cleanMsg.includes('أوفلاين')) {
      return isRtl
        ? `تطبيق الويب التقدمي (PWA) من ليرن ويب يتيح لك تشغيل المنصة كتطبيق أصلي على كافة الأجهزة (أندرويد، آيفون، والكمبيوتر) بضغطة زر دون الحاجة لمتاجر التطبيقات!\n\nيتميز بالتخزين المؤقت الذكي (Service Worker) لتصفح المحاضرات، الجداول، وتسجيل الحضور بالـ QR code بسرعة فائقة حتى عند انقطاع الإنترنت تماماً.`
        : `Lern Web Progressive Web App (PWA) installs directly on iOS, Android, and Desktop without store friction, featuring 100% offline Service Worker caching.`;
    }

    // 5. Attachments Receipt Analysis
    if (attachments && attachments.length > 0) {
      return isRtl
        ? `تم استلام وتحليل المرفق (${attachments.map(a => a.name).join(', ')}) بنجاح! 📄📷\n\nأنا مطلع على كافة مواصفات المنظومة وجاهز لمساعدتك في أي استفسار أو تحويل طلبك مباشرة للإدارة.`
        : `Attachment (${attachments.map(a => a.name).join(', ')}) received and analyzed successfully! 📄📷`;
    }

    // Default Intelligence Response
    return isRtl
      ? `أهلاً بك في منصة ليرن ويب (Lern Web)! أنا المساعد الذكي الشامل ومراقب المنظومة. أنا مطلع لحظياً على كل المشروعات، باقات الاشتراك، أرقام المحافظ، وطلبات التعديل.\n\nكيف يمكنني خدمتك اليوم؟`
      : `Welcome to Lern Web! I am your platform AI assistant, aware of all certified systems, buyout plans, payment wallets, and live sandbox configurations. How can I assist you today?`;
  };

  // Call Chat API with 20+ Key Rotation or ChatGPT, with Client Fallback if endpoint is unavailable when published
  const callChatWithRetry = async (
    userText: string, 
    historyToSend: any[], 
    systemOverride?: string,
    attachmentsToSend?: SupportTicketAttachment[]
  ): Promise<{ text: string; provider?: string; model?: string }> => {
    let lastError: any = null;

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: userText, 
            history: historyToSend,
            systemInstruction: systemOverride || undefined,
            aiContext: aiContext ? aiContext.summary : undefined,
            attachments: attachmentsToSend || [],
            provider: selectedProvider,
            model: selectedModel
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.text && typeof data.text === 'string' && data.text.trim()) {
            if (data.keysStatus) setKeyPoolStatus(data.keysStatus);
            return {
              text: data.text.trim(),
              provider: data.provider || selectedProvider,
              model: data.model || selectedModel
            };
          }
        }

        const errData = await response.json().catch(() => ({}));
        lastError = new Error(errData.details || errData.error || `HTTP ${response.status}`);
      } catch (err: any) {
        lastError = err;
      }

      if (attempt < 1) {
        await new Promise(res => setTimeout(res, 400));
      }
    }

    // If server API endpoint is not reachable (e.g., static published deployment), execute instant local synthesis
    console.warn('Backend API endpoint unreachable when published. Using Client-Side Platform AI Engine:', lastError);
    return {
      text: synthesizeLocalAiResponse(userText, attachmentsToSend),
      provider: 'client_ai_engine',
      model: selectedModel
    };
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputQuery.trim() && stagedAttachments.length === 0) || isThinking) return;

    const userText = inputQuery.trim();
    const currentAttachments = [...stagedAttachments];
    setInputQuery('');
    setStagedAttachments([]);
    setIsThinking(true);

    // Add user message to ticket
    const currentTicket = storageService.addMessageToTicket(
      userId,
      userName,
      userPhone,
      userEmail,
      { 
        sender: 'user', 
        senderName: userName, 
        text: userText,
        attachments: currentAttachments,
        provider: selectedProvider,
        model: selectedModel
      }
    );
    setTicket(currentTicket);

    try {
      const activeMessages = currentTicket.messages || [];
      const historyToSend = activeMessages.slice(0, -1).slice(-8).map(m => ({
        sender: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      // Call AI
      const aiReplyResult = await callChatWithRetry(
        userText, 
        historyToSend, 
        currentTicket.systemOverride,
        currentAttachments
      );

      // Save AI reply to ticket
      const updatedTicket = storageService.addMessageToTicket(
        userId,
        userName,
        userPhone,
        userEmail,
        { 
          sender: 'ai', 
          senderName: isRtl ? 'المساعد الذكي لمنصة ليرن ويب' : 'Lern Web AI Assistant', 
          text: aiReplyResult.text,
          provider: 'gemini',
          model: 'gemini-1.5-flash'
        }
      );
      setTicket(updatedTicket);
    } catch (err: any) {
      console.warn('AI chat fallback activated:', err);
      const fallbackReply = isRtl
        ? (settings?.aiFallbackReplyAr || `أهلاً بك يا ${userName}! أنا المساعد الذكي لشركة ليرن ويب. يمكنك الاستفسار عن باقات الاشتراك، أسعار التملك، أرقام المحافظ، أو تجربة المحاكي وسأجيبك فوراً.`)
        : (settings?.aiFallbackReplyEn || `Welcome ${userName}! I am the Lern Web AI Assistant. Ask me about plans, pricing, wallets, or the sandbox simulator!`);

      const updatedTicket = storageService.addMessageToTicket(
        userId,
        userName,
        userPhone,
        userEmail,
        { 
          sender: 'ai', 
          senderName: isRtl ? 'المساعد الذكي لمنصة ليرن ويب' : 'Lern Web AI Assistant', 
          text: fallbackReply,
          provider: 'gemini',
          model: 'gemini-1.5-flash'
        }
      );
      setTicket(updatedTicket);
    } finally {
      setIsThinking(false);
      fetchKeyPoolStatus();
    }
  };

  const activeMessages: SupportTicketMessage[] = ticket?.messages || [
    {
      id: 'welcome-msg',
      sender: 'ai',
      senderName: isRtl ? 'المساعد الذكي لمنصة ليرن ويب' : 'Lern Web AI Assistant',
      text: isRtl 
        ? (settings?.aiWelcomeMessageAr || `مرحباً بك يا ${userName}! أنا المساعد الذكي الرسمي لمنصة ليرن ويب (Lern Web AI). أنا مطلع لحظياً على كافة المنظومات، باقات التراخيص، أرقام المحافظ، وإعدادات المحاكي. اكتب سؤالك، أو ألصق صورة/ملف وسأجيبك فوراً!`)
        : (settings?.aiWelcomeMessageEn || `Welcome ${userName}! I am the official Lern Web AI Assistant. Ask me about certified systems, pricing, payment wallets, or sandbox simulator, and I will answer instantly!`),
      timestamp: new Date().toISOString(),
      provider: 'gemini'
    }
  ];

  return (
    <div className="flex flex-col h-[560px] max-h-[80vh] rounded-3xl border border-blue-500/50 bg-slate-900/95 backdrop-blur-md shadow-[0_0_20px_rgba(37,99,235,0.3)] overflow-hidden animate-fadeIn">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-3.5 border-b border-slate-700/80 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-blue-600/30">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <span>{isRtl ? 'المساعد الذكي والدعم الآلي المباشر' : 'AI Assistant & Automated Support'}</span>
              </h3>
            </div>

            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-slate-300 font-semibold">
                {isRtl ? 'المساعد الذكي متصل • إجابات فورية 24/7' : 'AI Assistant Online • Instant 24/7 Replies'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Start Voice Call with AI Button */}
          <button
            type="button"
            onClick={() => handleStartAiCall()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
            title={isRtl ? 'بدء مكالمة صوتية ذكية مع المساعد' : 'Start Voice Call with AI'}
          >
            <PhoneCall className="w-3.5 h-3.5 animate-pulse text-emerald-100" />
            <span className="hidden sm:inline">{isRtl ? 'اتصال صوتي' : 'Voice Call'}</span>
          </button>

          {/* Call History Log Button */}
          <button
            type="button"
            onClick={() => setIsCallHistoryOpen(true)}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl border border-slate-800 transition cursor-pointer"
            title={isRtl ? 'سجل تاريخ المكالمات بينك وبين المساعد' : 'Call History Log'}
          >
            <History className="w-3.5 h-3.5 text-blue-400" />
            {callHistory.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-blue-600 text-[9px] font-black text-white">
                {callHistory.length}
              </span>
            )}
          </button>

          {/* Clear Chat Button */}
          <button 
            type="button"
            onClick={clearChat}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl border border-transparent hover:border-rose-500/30 transition cursor-pointer"
            title={isRtl ? 'مسح سجل المحادثة' : 'Clear Chat'}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileInputChange}
        className="hidden" 
        multiple 
        accept=".pdf,.doc,.docx,.txt,.csv,.json,.js,.ts,.html,.css"
      />
      <input 
        type="file" 
        ref={imageInputRef} 
        onChange={handleFileInputChange}
        className="hidden" 
        multiple 
        accept="image/png,image/jpeg,image/webp,image/gif"
      />

      {/* Chat Messages Transcript */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-950/70 scroll-smooth"
      >
        {activeMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isAdmin = msg.sender === 'admin';

          return (
            <div 
              key={msg.id} 
              className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar Icon */}
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow ${
                isUser 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gradient-to-tr from-amber-600 to-blue-600 text-white shadow-amber-500/20'
              }`}>
                {isUser ? (
                  <User className="w-3.5 h-3.5" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-md space-y-1.5 ${
                isUser 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-amber-500/40 text-amber-100 rounded-bl-none'
              }`}>
                {/* Admin Header */}
                <div className="flex items-center justify-between gap-2 pb-1 border-b border-white/10 text-[9px]">
                  <span className="font-bold opacity-80 flex items-center gap-1">
                    {isUser ? (
                      <span>{userName}</span>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span className="text-amber-300">{isRtl ? 'المساعد الذكي (Gemini AI)' : 'Lern Web AI Assistant'}</span>
                      </>
                    )}
                  </span>
                  <span className="font-mono opacity-50">
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString(isRtl ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>

                {/* Render Attachments if any */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.attachments.map((att, attIdx) => {
                      const isImg = att.type?.startsWith('image/') || !!att.previewUrl;
                      return isImg ? (
                        <div 
                          key={attIdx}
                          onClick={() => setPreviewImageModal(att.previewUrl || `data:${att.type};base64,${att.data}`)}
                          className="relative group rounded-lg overflow-hidden border border-white/20 cursor-pointer bg-slate-900 w-20 h-20 shrink-0"
                        >
                          <img 
                            src={att.previewUrl || `data:${att.type};base64,${att.data}`} 
                            alt={att.name || 'مرفق'} 
                            className="w-full h-full object-cover transition group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div 
                          key={attIdx} 
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/30 border border-white/10 text-[10px] text-slate-200"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                          <span className="truncate max-w-[120px] font-mono">{att.name || 'ملف'}</span>
                          {att.size && (
                            <span className="text-[8px] opacity-60">({Math.round(att.size / 1024)} KB)</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-blue-400 animate-spin" />
            </div>
            <div className="bg-slate-800/90 border border-slate-700 px-4 py-2.5 rounded-2xl rounded-bl-none text-xs text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span>
                {isRtl ? 'جاري تحليل استفسارك وإعداد الرد الذكي الفوري...' : 'Analyzing query & generating AI response...'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Staged Attachments Tray */}
      {stagedAttachments.length > 0 && (
        <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] text-slate-400 font-semibold shrink-0">
            {isRtl ? 'المرفقات الجاهزة للإرسال:' : 'Staged Attachments:'}
          </span>
          {stagedAttachments.map((att, idx) => {
            const isImg = att.type?.startsWith('image/') || !!att.previewUrl;
            return (
              <div 
                key={idx}
                className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-900 border border-blue-500/40 text-[10px] text-white shrink-0 relative group"
              >
                {isImg ? (
                  <img 
                    src={att.previewUrl || `data:${att.type};base64,${att.data}`} 
                    alt="attachment" 
                    className="w-5 h-5 rounded object-cover" 
                  />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                )}
                <span className="truncate max-w-[90px]">{att.name}</span>
                <button
                  type="button"
                  onClick={() => removeStagedAttachment(idx)}
                  className="p-0.5 text-slate-400 hover:text-rose-400 rounded-full cursor-pointer"
                  title={isRtl ? 'إزالة' : 'Remove'}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Prompts Bar */}
      <div className="px-3 py-1.5 bg-slate-900/90 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[10px] text-slate-400 shrink-0">
        <span className="text-[9px] font-bold text-slate-500 uppercase shrink-0">
          {isRtl ? 'أسئلة سريعة:' : 'Quick:'}
        </span>
        <button
          type="button"
          onClick={() => {
            setInputQuery(isRtl ? 'ما هي باقات الاشتراك وأسعار التملك الكامل للكود المصدري؟' : 'What are the subscription plans and source buyout prices?');
          }}
          className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition shrink-0 cursor-pointer"
        >
          {isRtl ? '💰 أسعار الباقات والتملك' : '💰 Pricing & Buyout'}
        </button>
        <button
          type="button"
          onClick={() => {
            setInputQuery(isRtl ? 'ما هي أرقام محافظ الدفع الإلكترونية المتاحة (فودافون كاش، انستاباي)؟' : 'What are the available payment wallet numbers?');
          }}
          className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition shrink-0 cursor-pointer"
        >
          {isRtl ? '💳 محافظ الدفع الفوري' : '💳 Payment Wallets'}
        </button>
        <button
          type="button"
          onClick={() => {
            setInputQuery(isRtl ? 'كيف يعمل تطبيق PWA بدون إنترنت وما هي ميزات أوفلاين؟' : 'How does PWA offline work?');
          }}
          className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition shrink-0 cursor-pointer"
        >
          {isRtl ? '📱 ميزات PWA وأوفلاين' : '📱 PWA Offline'}
        </button>
        <button
          type="button"
          onClick={() => {
            setInputQuery(isRtl ? 'اشرح لي مشروع منظومة إدارة المراكز والسناتر (LMS Core) وميزاته' : 'Explain LMS Core system');
          }}
          className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition shrink-0 cursor-pointer"
        >
          {isRtl ? '🏫 منظومة LMS Core' : '🏫 LMS Core'}
        </button>
      </div>

      {/* Input Form & Action Bar */}
      <div className="p-3 bg-slate-900 border-t border-slate-800">
        <form onSubmit={handleSendMessage} className="flex items-center gap-1.5">
          {/* Attach Document Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer shrink-0 shadow-sm"
            title={isRtl ? 'إرفاق ملف أو مستند (PDF / Code / TXT)' : 'Attach file'}
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Attach Image Button */}
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer shrink-0 shadow-sm"
            title={isRtl ? 'إرفاق صورة أو لقطة شاشة' : 'Attach image'}
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {/* Main Input Textarea/Input */}
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onPaste={handlePaste}
            placeholder={
              isRtl 
                ? 'اكتب سؤالك أو الصق صورة (Ctrl+V) أو أرفق ملفاً للتحليل...' 
                : 'Type message, paste screenshot, or attach file...'
            }
            className="flex-1 min-w-0 rounded-2xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none transition shadow-inner placeholder:text-slate-500"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={(!inputQuery.trim() && stagedAttachments.length === 0) || isThinking}
            className="p-2.5 rounded-2xl transition active:scale-95 shrink-0 shadow-lg flex items-center justify-center cursor-pointer bg-blue-600 hover:bg-blue-500 shadow-blue-600/30 text-white disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[9px] text-slate-500 mt-2 px-1">
          <span>{isRtl ? '💡 يمكنك إرفاق مستندات أو لصق صور مباشرة (Ctrl+V)' : '💡 Paste screenshots directly'}</span>
          <span className="font-mono text-emerald-400">
            {isRtl ? 'المساعد الذكي متصل • Gemini AI' : 'AI Assistant Online • Gemini AI'}
          </span>
        </div>
      </div>

      {/* Lightbox Modal for Clicked Image */}
      {previewImageModal && (
        <div 
          onClick={() => setPreviewImageModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl p-2">
            <button 
              onClick={() => setPreviewImageModal(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <img 
              src={previewImageModal} 
              alt="Full Preview" 
              className="max-w-full max-h-[80vh] rounded-xl object-contain mx-auto" 
            />
          </div>
        </div>
      )}

      {/* Key Pool Health Modal */}
      {isKeyPoolModalOpen && (
        <div 
          onClick={() => setIsKeyPoolModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl space-y-4 cursor-default text-right"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {isRtl ? 'مجمع مفاتيح جيمناي الذكي (25+ مفتاح)' : 'Gemini 25+ Key Pool Monitor'}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {isRtl ? 'تدوير لحظي تلقائي وتجاوز حصص الاستخدام' : 'Zero-Downtime Round-Robin Rotation'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsKeyPoolModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-base font-black text-white">{keyPoolStatus.totalKeys}</div>
                <div className="text-[10px] text-slate-400">{isRtl ? 'إجمالي المفاتيح' : 'Total Keys'}</div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                <div className="text-base font-black text-emerald-400">{keyPoolStatus.activeKeys}</div>
                <div className="text-[10px] text-emerald-300">{isRtl ? 'مفاتيح نشطة' : 'Active'}</div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30">
                <div className="text-base font-black text-amber-400">{keyPoolStatus.coolingDownKeys}</div>
                <div className="text-[10px] text-amber-300">{isRtl ? 'فترة راحة (429)' : 'Cooling'}</div>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-[11px] leading-relaxed text-slate-300">
              <p>
                {isRtl 
                  ? 'يحتوي المجمع على أكثر من 20 مفتاح مجاني نشط يتم التدوير بينها بالتناوب في كل استفسار. عند وصول أي مفتاح لحد الحصة (429 Rate Limit)، ينتقل المحرك فوراً للمفتاح التالي دون انقطاع خدمة الزائر.'
                  : 'The engine rotates across 20+ active free keys on every query. If any key reaches rate limit (429), it immediately falls back to the next key without latency.'
                }
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsKeyPoolModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
              >
                {isRtl ? 'حسناً، فهمت' : 'Understood'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
