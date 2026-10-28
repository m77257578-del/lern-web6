/**
 * Next.js Project Structure Identifier:
 * components/SupportHelpCenter.tsx
 * 
 * Project Identity: ليرن ويب | Lern Web
 * Purpose: Dedicated Support & Help Center component for client-dashboard.
 *          Pulls FAQ data and enables real-time search across platform issues.
 */

import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, Search, ChevronDown, ChevronUp, Sparkles, 
  MessageSquare, Send, CheckCircle2, AlertCircle, BookOpen, ExternalLink, ShieldCheck 
} from 'lucide-react';
import { storageService } from '../src/services/storageService';

interface SupportHelpCenterProps {
  lang?: 'ar' | 'en';
  currentUser?: any;
  showToast?: (message: string, type?: 'success' | 'error') => void;
}

export default function SupportHelpCenter({ lang = 'ar', currentUser, showToast = () => {} }: SupportHelpCenterProps) {
  const isRtl = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openIdx, setOpenIdx] = useState(0);
  const [faqs, setFaqs] = useState(() => storageService.getFaqs());
  const [ticketInput, setTicketInput] = useState('');
  const [ticketTitle, setTicketTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setFaqs(storageService.getFaqs());
    });
    return () => unsubscribe();
  }, []);

  const defaultFaqs = [
    {
      id: 'faq-1',
      icon: Sparkles,
      categoryAr: 'عن المنصة',
      categoryEn: 'Platform Overview',
      questionAr: 'ما هي منصة ليرن ويب (Lern Web) وكيف تفيد المركز التعليمي؟',
      questionEn: 'What is Lern Web and how does it empower educational centers?',
      answerAr: 'منظومة ليرن ويب هي بيئة سحابية متكاملة تتيح للمدرسين والمراكز والسناتر التعليمية إطلاق منصاتهم الخاصة بهوية بصرية مستقلة، وتتضمن بوابات إدارة الطلاب، نظام الحضور الذكي بالـ QR، وبنوك الأسئلة والاختبارات التفاعلية.',
      answerEn: 'Lern Web is a unified cloud ecosystem enabling educators and academies to deploy custom branded portals featuring student hubs, sub-200ms QR check-in gates, and AI-proctored exam suites.'
    },
    {
      id: 'faq-2',
      icon: BookOpen,
      categoryAr: 'نظام الاشتراكات',
      categoryEn: 'Pricing & Licensing',
      questionAr: 'ما هي باقات الاشتراك والترخيص المتاحة (شهرى، سنوى، تمليك)؟',
      questionEn: 'What pricing and licensing tiers are available?',
      answerAr: 'تقدم المنصة 3 باقات مرنة:\n1. الإيجار الشهري: اشتراك مرن بتكلفة تشغيل منخفضة.\n2. السنوي المعتمد: تشمل استضافة فائقة السرعة ودعم فني دوري.\n3. التملك الكامل: تسليم كامل للكود المصدري الأصلي دون أي رسوم مستقبلية.',
      answerEn: 'We offer 3 flexible tiers: Monthly Rental, Annual Suite with high-performance Vercel Edge hosting, and Full Source Code Buyout with perpetual license ownership.'
    },
    {
      id: 'faq-3',
      icon: HelpCircle,
      categoryAr: 'التثبيت والتطبيق',
      categoryEn: 'PWA & Installation',
      questionAr: 'كيف يمكنني تثبيت التطبيق على جهازي أو الهاتف المحمول؟',
      questionEn: 'How can I install the app on my device or mobile phone?',
      answerAr: 'يمكنك النقر على زر "تثبيت التطبيق" في أعلى الصفحة، أو اختيار "إضافة إلى الشاشة الرئيسية" من قائمة المتصفح (Chrome أو Safari) ليعمل التطبيق كنظام PWA مستقل بدون إنترنت.',
      answerEn: 'You can tap the Install App button in the header or choose "Add to Home Screen" from your browser menu to use the app offline as a native PWA.'
    },
    {
      id: 'faq-4',
      icon: ShieldCheck,
      categoryAr: 'الأمان والخصوصية',
      categoryEn: 'Security & Privacy',
      questionAr: 'هل بيانات الطلاب والاختبارات محمية وآمنة بالكامل؟',
      questionEn: 'Are student records and exams fully secured and private?',
      answerAr: 'نعم، تعتمد المنظومة على قواعد بيانات مشفرة مع قواعد أمان صارمة (Firestore Security Rules) تمنع أي وصول غير مصرح به وتضمن عزل كامل لبيانات كل مركز تعليمي.',
      answerEn: 'Yes, the ecosystem relies on encrypted databases with strict security rules ensuring full isolation and privacy for every educational center.'
    }
  ];

  const combinedFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  const categories = ['all', ...new Set(combinedFaqs.map(f => isRtl ? f.categoryAr : f.categoryEn))];

  const filteredFaqs = combinedFaqs.filter(item => {
    const q = isRtl ? item.questionAr : item.questionEn;
    const a = isRtl ? item.answerAr : item.answerEn;
    const cat = isRtl ? item.categoryAr : item.categoryEn;

    const matchesSearch = searchQuery.trim() === '' || 
      q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || cat === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim() || !ticketInput.trim()) {
      showToast(isRtl ? 'يرجى كتابة عنوان ورسالة الاستفسار' : 'Please enter title and message', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      storageService.addMessageToTicket(
        currentUser?.id || 'client-guest',
        currentUser?.name || 'Client',
        currentUser?.phone || '',
        currentUser?.email || '',
        {
          sender: 'user',
          text: `[${ticketTitle.trim()}] ${ticketInput.trim()}`
        }
      );
      showToast(isRtl ? 'تم إرسال تذكرة الدعم بنجاح إلى الإدارة!' : 'Support ticket submitted successfully!', 'success');
      setTicketTitle('');
      setTicketInput('');
    } catch {
      showToast(isRtl ? 'حدث خطأ أثناء إرسال التذكرة' : 'Error submitting ticket', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isRtl ? 'مركز الدعم والمساعدة الفورية' : 'Support & Help Center'}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white">
            {isRtl ? 'الأسئلة الشائعة والبحث في المشكلات الشائعة' : 'FAQ & Common Platform Issues Search'}
          </h3>
          <p className="text-xs md:text-sm text-slate-300">
            {isRtl 
              ? 'ابحث فوراً في إرشادات ومشاكل المنظومة الشائعة، أو تواصل مباشرة مع فريق الدعم الفني للإدارة.' 
              : 'Instantly search knowledge base articles or open a direct support ticket with platform administration.'}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-400 shrink-0">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{isRtl ? 'دعم فني 24/7' : '24/7 Support'}</span>
        </span>
      </div>

      {/* Search & Category Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute right-4 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'ابحث عن سؤال، مشكلة أو ميزة (مثل: PWA، الاشتراكات، الـ QR)...' : 'Search FAQ, issues, or features...'}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 pr-11 pl-4 py-3 text-xs md:text-sm text-white focus:border-blue-500 focus:outline-none transition shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat === 'all' ? (isRtl ? 'الكل' : 'All') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-10 space-y-3 bg-slate-950 rounded-2xl border border-slate-800">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="text-base font-bold text-white">
              {isRtl ? 'لم يتم العثور على نتائج مطابقة لبحثك' : 'No matching FAQ found'}
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {isRtl ? 'يمكنك إرسال استفسارك مباشرة عبر تذكرة الدعم الفني أدناه وسيتم الرد عليك فوراً.' : 'You can submit your question via the support ticket form below.'}
            </p>
          </div>
        ) : (
          filteredFaqs.map((item: any, idx: number) => {
            const isOpen = openIdx === idx;
            const q = isRtl ? item.questionAr : item.questionEn;
            const a = isRtl ? item.answerAr : item.answerEn;
            const cat = isRtl ? item.categoryAr : item.categoryEn;

            return (
              <div 
                key={item.id || idx}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'border-blue-500/50 bg-slate-950 shadow-lg' 
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full p-4 md:p-5 flex items-center justify-between text-right gap-4 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-blue-400 border border-blue-500/20 block w-fit">
                        {cat}
                      </span>
                      <h4 className="text-xs md:text-sm font-bold text-white">
                        {q}
                      </h4>
                    </div>
                  </div>

                  <div className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-blue-400" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line animate-fadeIn">
                    {a}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Open New Support Ticket Box */}
      <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/20 via-slate-950 to-indigo-950/20 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          <h4 className="text-sm md:text-base font-bold text-white">
            {isRtl ? 'لم تجد إجابة لسؤالك؟ افتح تذكرة دعم فني جديدة:' : 'Could not find your answer? Open a support ticket:'}
          </h4>
        </div>

        <form onSubmit={handleSendTicket} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              {isRtl ? 'عنوان التذكرة أو المشكلة:' : 'Ticket Subject / Issue Title:'}
            </label>
            <input
              type="text"
              value={ticketTitle}
              onChange={(e) => setTicketTitle(e.target.value)}
              placeholder={isRtl ? 'مثال: استفسار بخصوص ربط بوابة الدفع أو تفعيل رخصة المركز' : 'e.g., Question regarding payment gateway setup'}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              {isRtl ? 'تفاصيل الاستفسار أو المشكلة:' : 'Issue Details / Message:'}
            </label>
            <textarea
              rows={3}
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder={isRtl ? 'اكتب تفاصيل استفسارك وسيقوم فريق الأدمن بالرد عليك في لوحة حسابك...' : 'Describe your issue in detail...'}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none transition resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:from-blue-500 hover:to-indigo-500 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isRtl ? 'إرسال تذكرة الدعم' : 'Submit Support Ticket'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
