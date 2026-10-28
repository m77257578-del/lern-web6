/**
 * Project: ليرن ويب | Lern Web
 * File: src/components/ProjectPurchaseModal.tsx
 * Purpose: Integrated Project Management & Automated Manual Payment Verification Gateway:
 *          1. On-site live iframe project preview & dynamic 3-tier pricing (Monthly, Yearly, Lifetime Tamleek)
 *          2. Authenticated customization & Instant Vercel URL generation (e.g. https://<slug>.vercel.app)
 *          3. Automated locked pricing calculation & manual wallet verification (Sender #, Reference Code, Receipt upload)
 *          4. Automated structured WhatsApp messaging to Admin & real-time client order tracking
 */

import React, { useState, useEffect, useId } from 'react';
import { 
  X, Check, Copy, ExternalLink, ShieldCheck, CreditCard, 
  Upload, Image, Smartphone, Globe, Lock, Play, Sparkles, 
  CheckCircle2, AlertCircle, Send, ArrowRight, ArrowLeft, RefreshCw,
  Eye, Laptop, Monitor
} from 'lucide-react';
import { ProjectItem, ProjectTemplate, WalletConfig, AdminSettings, storageService, buildWhatsAppUrl, UserOrder } from '../services/storageService';
import { kashierPaymentService } from '../services/kashierPaymentService';

interface ProjectPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectItem | null;
  selectedTemplate?: ProjectTemplate | null;
  initialPlan?: 'monthly' | 'annual' | 'full';
  currentUser: any;
  isUserLoggedIn: boolean;
  wallets: WalletConfig[];
  adminSettings: AdminSettings;
  lang?: 'ar' | 'en';
  onOpenLogin: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  onSuccessOrder?: (order: UserOrder) => void;
  onLaunchSandbox?: (config: any) => void;
}

export default function ProjectPurchaseModal({
  isOpen,
  onClose,
  project,
  selectedTemplate,
  initialPlan = 'annual',
  currentUser,
  isUserLoggedIn,
  wallets,
  adminSettings,
  lang = 'ar',
  onOpenLogin,
  showToast,
  onSuccessOrder,
  onLaunchSandbox
}: ProjectPurchaseModalProps) {
  const isRtl = lang === 'ar';
  const receiptInputId = useId();

  // Selected Plan Tier State
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | 'full'>(initialPlan);

  // Platform Customization State
  const [platformNameAr, setPlatformNameAr] = useState('');
  const [platformNameEn, setPlatformNameEn] = useState('');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '');
  const [hasCopiedUrl, setHasCopiedUrl] = useState(false);

  // Manual Payment Gateway State
  const [selectedWalletId, setSelectedWalletId] = useState<string>(wallets[0]?.id || 'vodafone-cash');
  const [senderPhone, setSenderPhone] = useState('');
  const [referenceCode, setReferenceCode] = useState('');
  const [receiptImage, setReceiptImage] = useState<string>('');
  const [receiptFileName, setReceiptFileName] = useState('');
  const [copiedWalletId, setCopiedWalletId] = useState<string | null>(null);

  // Embedded Live Preview Toggle State
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');

  // Payment Gateway Mode State
  const [paymentGatewayMode, setPaymentGatewayMode] = useState<'manual' | 'online_kashier'>('manual');
  const isOnlinePaymentActive = adminSettings?.isOnlinePaymentGatewayEnabled === true || kashierPaymentService.isEnabled();

  // Form Validation & Submission State
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<UserOrder | null>(null);

  useEffect(() => {
    if (initialPlan) {
      setSelectedPlan(initialPlan);
    }
  }, [initialPlan]);

  useEffect(() => {
    if (currentUser?.phone && !contactPhone) {
      setContactPhone(currentUser.phone);
    }
  }, [currentUser, contactPhone]);

  if (!isOpen || !project) return null;

  // Active Template or fallback
  const curTemplate = selectedTemplate || (project.templates && project.templates.length > 0 ? project.templates[0] : null);

  // Pricing calculations
  const priceMonthly = curTemplate?.priceMonthly || project.priceMonthly || '950 ج.م / $29';
  const priceAnnual = curTemplate?.priceAnnual || project.priceAnnual || '8,500 ج.م / $249';
  const priceFull = curTemplate?.priceFull || project.priceFull || '27,000 ج.م / $799';

  const lockedPrice = selectedPlan === 'monthly' ? priceMonthly : selectedPlan === 'annual' ? priceAnnual : priceFull;

  const planLabels = {
    monthly: {
      ar: 'اشتراك شهري مرن',
      en: 'Flexible Monthly Rental',
      badgeAr: 'تجربة سريعة',
      badgeEn: 'Starter',
      descAr: 'إيجار سحابي مرن يشمل الدعم وتحديثات الأمان المستمرة.',
      descEn: 'Cloud operational rental including support and maintenance.'
    },
    annual: {
      ar: 'اشتراك سنوي معتمد (الأكثر توفيراً)',
      en: 'Annual Certified License (Best Value)',
      badgeAr: 'الأكثر توفيراً وطلباً',
      badgeEn: 'Best Value',
      descAr: 'خصم سنوي خاص + اسم نطاق مخصص ودعم فني على مدار 24 ساعة.',
      descEn: 'Discounted annual plan with priority support & custom domain.'
    },
    full: {
      ar: 'تملك كامل للكود المصدري (تمليك نهائي)',
      en: 'Full Source Code Buyout (Tamleek)',
      badgeAr: 'ملكية مدى الحياة 100%',
      badgeEn: '100% Perpetual Ownership',
      descAr: 'استلام كامل الكود المصدري غير المضغوط بدون أي اشتراكات دورية.',
      descEn: 'Outright uncompressed source code ownership. Zero recurring fees.'
    }
  };

  // Instant Vercel Production URL Generation
  const sanitizedSlug = platformNameEn.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  const generatedVercelUrl = sanitizedSlug ? `https://${sanitizedSlug}-lern-web.vercel.app/` : 'https://vercel.app';

  // Active Selected Wallet
  const activeWallets = wallets.filter(w => w.isActive !== false);
  const selectedWallet = activeWallets.find(w => w.id === selectedWalletId) || activeWallets[0] || wallets[0];

  // Target WhatsApp
  const targetWhatsApp = adminSettings?.targetWhatsAppNumber || '201024889921';

  // Embedded Preview URL
  const previewUrl = curTemplate?.previewUrl || project.previewUrl || 'https://lernweb.com';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(generatedVercelUrl);
    setHasCopiedUrl(true);
    setTimeout(() => setHasCopiedUrl(false), 2500);
    showToast(isRtl ? 'تم نسخ رابط Vercel بنجاح!' : 'Vercel URL copied successfully!', 'success');
  };

  const handleCopyWalletNumber = (number: string, id: string) => {
    navigator.clipboard.writeText(number);
    setCopiedWalletId(id);
    setTimeout(() => setCopiedWalletId(null), 2500);
    showToast(isRtl ? 'تم نسخ رقم الحساب/المحفظة!' : 'Wallet number copied!', 'success');
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setValidationError(isRtl ? 'حجم الصورة كبير جداً، يرجى اختيار إيصال أقل من 8 ميجابايت' : 'File is too large, please select an image under 8MB');
      return;
    }

    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setReceiptImage(base64);
      setValidationError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Gatekeeping: Check authentication
    if (!isUserLoggedIn) {
      showToast(isRtl ? 'يرجى تسجيل الدخول أولاً لإتمام طلب المنصة والدفع' : 'Please log in to complete purchase', 'error');
      onOpenLogin();
      return;
    }

    // Validate Required Inputs
    if (!platformNameAr.trim()) {
      setValidationError(isRtl ? 'يرجى كتابة اسم المنصة بالعربية' : 'Please enter platform name in Arabic');
      return;
    }

    if (!platformNameEn.trim()) {
      setValidationError(isRtl ? 'يرجى كتابة اسم المنصة بالإنجليزية لتوليد رابط Vercel' : 'Please enter platform name in English');
      return;
    }

    if (!contactPhone.trim()) {
      setValidationError(isRtl ? 'يرجى إدخال رقم الهاتف للتواصل والدعم' : 'Please enter your contact phone number');
      return;
    }

    if (!senderPhone.trim()) {
      setValidationError(isRtl ? 'يرجى إدخال رقم المحفظة أو الحساب الذي قمت بالتحويل منه' : 'Please enter sender wallet/phone number');
      return;
    }

    if (!referenceCode.trim()) {
      setValidationError(isRtl ? 'يرجى إدخال كود أو رقم العملية / التحويل (Reference ID)' : 'Please enter transaction reference code');
      return;
    }

    if (!receiptImage) {
      setValidationError(isRtl ? 'يرجى إرفاق صورة إيصال أو سكرين شوت التحويل لإثبات الدفع' : 'Please upload payment receipt screenshot');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = 'ord-' + Date.now();
      const newOrder: UserOrder = {
        id: orderId,
        userId: currentUser?.id || 'client-anon',
        userName: currentUser?.name || platformNameAr.trim(),
        userPhone: contactPhone.trim(),
        userEmail: currentUser?.email || '',
        planType: selectedPlan,
        amount: lockedPrice,
        paymentMethod: selectedWallet ? (isRtl ? selectedWallet.nameAr : selectedWallet.nameEn) : 'Vodafone Cash',
        walletName: selectedWallet ? (isRtl ? selectedWallet.nameAr : selectedWallet.nameEn) : '',
        walletNumber: selectedWallet?.number || '',
        senderPhone: senderPhone.trim(),
        referenceId: referenceCode.trim(),
        receiptImage: receiptImage,
        platformNameAr: platformNameAr.trim(),
        platformNameEn: platformNameEn.trim(),
        generatedVercelUrl: generatedVercelUrl,
        createdAt: new Date().toISOString(),
        status: 'pending',
        projectId: project.id,
        projectTitle: isRtl ? project.titleAr : project.titleEn
      };

      // 1. Save in Storage Service & Firebase sync
      storageService.saveUserOrder(newOrder);

      // 2. Prepare Structured WhatsApp Message to Admin
      const planNameSelected = isRtl ? planLabels[selectedPlan].ar : planLabels[selectedPlan].en;
      const walletNameSelected = selectedWallet ? (isRtl ? selectedWallet.nameAr : selectedWallet.nameEn) : 'المحفظة الرسمية';
      
      const planEnglishName = selectedPlan === 'monthly' ? 'Monthly' : selectedPlan === 'annual' ? 'Yearly' : 'Lifetime';
      
      let whatsAppMessage = '';
      if (isRtl) {
        whatsAppMessage = `Hello Admin, 
لقد قمت بإرسال تأكيد الدفع اليدوي لشراء وتفعيل المنصة. إليك تفاصيل المعاملة:
- Client Name: ${newOrder.userName}
- Purchased Platform: ${newOrder.platformNameAr} (${newOrder.platformNameEn})
- Selected Plan: ${planNameSelected} (${planEnglishName})
- Transferred From: ${newOrder.senderPhone}
- Transaction Code: ${newOrder.referenceId}
- Anticipated Live Link: ${newOrder.generatedVercelUrl}
- Locked Price: ${newOrder.amount}
- Wallet: ${walletNameSelected} (${selectedWallet?.number || ''})
Please verify my proof image on the Admin Dashboard to activate my system.`;
      } else {
        whatsAppMessage = `Hello Admin, 
I have submitted a manual payment confirmation for my platform purchase. Here are my transaction details:
- Client Name: ${newOrder.userName}
- Purchased Platform: ${newOrder.platformNameAr} (${newOrder.platformNameEn})
- Selected Plan: ${planEnglishName} (Monthly / Yearly / Lifetime)
- Transferred From: ${newOrder.senderPhone}
- Transaction Code: ${newOrder.referenceId}
- Anticipated Live Link: ${newOrder.generatedVercelUrl}
- Locked Price: ${newOrder.amount}
Please verify my proof image on the Admin Dashboard to activate my system.`;
      }

      // 3. Trigger WhatsApp Chat directly
      const waUrl = buildWhatsAppUrl(targetWhatsApp, whatsAppMessage);
      window.open(waUrl, '_blank');

      // 4. Update UI State & Notify
      setSubmittedOrder(newOrder);
      if (onSuccessOrder) onSuccessOrder(newOrder);
      showToast(isRtl ? 'تم تسجيل وتوثيق طلبك وفتح رسالة واتساب مع الإدارة بنجاح!' : 'Order recorded & WhatsApp opened successfully!', 'success');

    } catch (err: any) {
      setValidationError(isRtl ? 'حدث خطأ أثناء حفظ الطلب، يرجى المحاولة مرة أخرى' : 'Failed to record order, please retry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 shadow-2xl text-slate-100 space-y-6 my-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 px-3 py-0.5 text-xs font-bold text-blue-400">
                <CreditCard className="w-3.5 h-3.5" />
                <span>{isRtl ? 'بوابة طلب وتخصيص المنصة والدفع اليدوي الآلي' : 'Platform Customization & Payment Gateway'}</span>
              </span>
              <span className="rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-bold">
                {isRtl ? 'تحقق آمن 100%' : '100% Secure Manual Verification'}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white">
              {isRtl ? project.titleAr : project.titleEn}
            </h2>
            <p className="text-xs md:text-sm text-slate-300">
              {isRtl 
                ? 'خصص هوية منصتك الرقمية، احصل على رابط Vercel الفوري، وأكمل التحويل البنكي بسهولة.' 
                : 'Customize your platform parameters, claim your Vercel URL, and verify manual transfer.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-800 bg-slate-800/80 p-2.5 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Modal Confirmation View */}
        {submittedOrder ? (
          <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-950 p-6 md:p-8 space-y-6 text-center animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mx-auto flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-black text-white">
                {isRtl ? '🎉 تم إرسال طلب الشراء وتوثيق الإيصال بنجاح!' : '🎉 Order Submitted & Documented Successfully!'}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {isRtl 
                  ? 'تم تسجيل طلبك وحفظ إيصال الدفع في لوحة تحكم الإدارة بحالة [قيد المراجعة والتحقق]. كما تم إرسال كافة تفاصيل المنصة ورابط Vercel عبر الواتساب للإدارة للمراجعة الفورية.'
                  : 'Your order is recorded with status PENDING. Details and your Vercel link were routed to the Admin for verification.'}
              </p>
            </div>

            {/* Generated Production URL Card */}
            <div className="rounded-2xl border border-blue-500/30 bg-slate-900 p-5 max-w-lg mx-auto space-y-3 text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {isRtl ? '🌐 رابط الإنتاج المباشر المحجوز لمنصتك:' : 'Your Reserved Production Vercel URL:'}
              </span>
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm">
                <span className="text-blue-400 font-bold truncate">{submittedOrder.generatedVercelUrl}</span>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shrink-0 cursor-pointer"
                >
                  {hasCopiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{hasCopiedUrl ? (isRtl ? 'تم النسخ' : 'Copied') : (isRtl ? 'نسخ الرابط' : 'Copy')}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800 text-slate-300">
                <div>
                  <span className="text-slate-500 block">{isRtl ? 'اسم المنصة:' : 'Platform:'}</span>
                  <span className="font-bold text-white">{submittedOrder.platformNameAr}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{isRtl ? 'النظام والباقة:' : 'Plan Tier:'}</span>
                  <span className="font-bold text-emerald-400">{submittedOrder.amount}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <a
                href={buildWhatsAppUrl(targetWhatsApp, isRtl ? `مرحباً، أود متابعة حالة تفعيل طلبي رقم: ${submittedOrder.id}` : `Hello, tracking order: ${submittedOrder.id}`)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-600/30 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isRtl ? 'فتح محادثة الواتساب مع الإدارة' : 'Open WhatsApp Chat'}</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-6 py-3 text-sm font-bold text-white transition cursor-pointer"
              >
                {isRtl ? 'إغلاق ومتابعة المنصة' : 'Close and Continue'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="space-y-6">

            {/* Validation Alert */}
            {validationError && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs md:text-sm font-bold flex items-center gap-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{validationError}</span>
              </div>
            )}

            {/* PILLAR 1: ON-SITE EMBEDDED PROJECT PREVIEW & DYNAMIC 3-TIER PRICING */}
            <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>{isRtl ? '1. المعاينة المباشرة داخل المنصة واختيار نظام الاشتراك' : '1. On-Site Live Preview & Plan Selection'}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isRtl ? 'يمكنك تجربة المنصة حياً واختيار الباقة المناسبة لميزانيتك:' : 'Interact with live project preview and pick your target pricing system:'}
                  </p>
                </div>

                {/* On-Site Iframe Preview Trigger */}
                <button
                  type="button"
                  onClick={() => setShowLivePreview(!showLivePreview)}
                  className="flex items-center gap-2 rounded-xl bg-blue-600/20 border border-blue-500/40 hover:bg-blue-600/30 px-3.5 py-1.5 text-xs font-bold text-blue-300 transition cursor-pointer shrink-0"
                >
                  {showLivePreview ? <Eye className="w-4 h-4 text-blue-400" /> : <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />}
                  <span>{showLivePreview ? (isRtl ? 'إخفاء المعاينة الحية' : 'Hide Live Preview') : (isRtl ? 'تشغيل المعاينة المباشرة هنا' : 'Launch Embedded Preview')}</span>
                </button>
              </div>

              {/* Embedded Iframe Container */}
              {showLivePreview && (
                <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-bold text-white">{isRtl ? 'المحاكي التفاعلي المباشر (Embedded View)' : 'Live Interactive Simulator'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setPreviewViewport('desktop')}
                        className={`p-1.5 rounded-lg text-xs font-bold transition ${previewViewport === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                        title="Desktop View"
                      >
                        <Laptop className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewViewport('mobile')}
                        className={`p-1.5 rounded-lg text-xs font-bold transition ${previewViewport === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                        title="Mobile View"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className={`mx-auto rounded-xl overflow-hidden border border-slate-800 bg-slate-950 transition-all ${
                    previewViewport === 'mobile' ? 'w-full max-w-sm aspect-[9/16] max-h-[460px]' : 'w-full aspect-[16/10] max-h-[400px]'
                  }`}>
                    <iframe
                      src={previewUrl}
                      title={project.titleAr}
                      className="w-full h-full border-0"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                </div>
              )}

              {/* Dynamic 3 Pricing Tiers (Monthly, Yearly, Lifetime Tamleek) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                
                {/* 1. Monthly Subscription */}
                <div 
                  onClick={() => setSelectedPlan('monthly')}
                  className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    selectedPlan === 'monthly'
                      ? 'border-blue-500 bg-blue-950/40 ring-2 ring-blue-500/40 shadow-xl'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                        {isRtl ? 'الاشتراك الشهري' : 'Monthly Tier'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {isRtl ? planLabels.monthly.badgeAr : planLabels.monthly.badgeEn}
                      </span>
                    </div>
                    <div className="text-xl font-black text-white">{priceMonthly}</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {isRtl ? planLabels.monthly.descAr : planLabels.monthly.descEn}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className={selectedPlan === 'monthly' ? 'text-blue-400 font-bold' : 'text-slate-500'}>
                      {selectedPlan === 'monthly' ? (isRtl ? '✓ محدد ومقفل' : '✓ Selected') : (isRtl ? 'انقر للاختيار' : 'Click to select')}
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPlan === 'monthly' ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-700'}`}>
                      {selectedPlan === 'monthly' && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </div>
                </div>

                {/* 2. Yearly Subscription (Best Value) */}
                <div 
                  onClick={() => setSelectedPlan('annual')}
                  className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden ${
                    selectedPlan === 'annual'
                      ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/40 shadow-xl'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                        {isRtl ? 'الترخيص السنوي' : 'Annual Tier'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {isRtl ? planLabels.annual.badgeAr : planLabels.annual.badgeEn}
                      </span>
                    </div>
                    <div className="text-xl font-black text-white">{priceAnnual}</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {isRtl ? planLabels.annual.descAr : planLabels.annual.descEn}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className={selectedPlan === 'annual' ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {selectedPlan === 'annual' ? (isRtl ? '✓ محدد ومقفل' : '✓ Selected') : (isRtl ? 'انقر للاختيار' : 'Click to select')}
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPlan === 'annual' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-700'}`}>
                      {selectedPlan === 'annual' && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </div>
                </div>

                {/* 3. Full Source Buyout (Tamleek) */}
                <div 
                  onClick={() => setSelectedPlan('full')}
                  className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    selectedPlan === 'full'
                      ? 'border-purple-500 bg-purple-950/40 ring-2 ring-purple-500/40 shadow-xl'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-purple-400">
                        {isRtl ? 'التملك الكامل للكود' : 'Lifetime Buyout'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {isRtl ? planLabels.full.badgeAr : planLabels.full.badgeEn}
                      </span>
                    </div>
                    <div className="text-xl font-black text-white">{priceFull}</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {isRtl ? planLabels.full.descAr : planLabels.full.descEn}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className={selectedPlan === 'full' ? 'text-purple-400 font-bold' : 'text-slate-500'}>
                      {selectedPlan === 'full' ? (isRtl ? '✓ محدد ومقفل' : '✓ Selected') : (isRtl ? 'انقر للاختيار' : 'Click to select')}
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPlan === 'full' ? 'border-purple-500 bg-purple-500 text-white' : 'border-slate-700'}`}>
                      {selectedPlan === 'full' && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* PILLAR 2: SECURE GATEKEEPING & PLATFORM CUSTOMIZATION + INSTANT URL GENERATION */}
            <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6 shadow-xl">
              <div className="space-y-1 border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>{isRtl ? '2. تخصيص هوية المنصة وتوليد رابط Vercel الإنتاجي فورياً' : '2. Platform Customization & Instant Vercel URL'}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  {isRtl ? 'أدخل اسم منصتك بالعربية والإنجليزية ليتم توليد وحجز النطاق المباشر لك فورياً:' : 'Enter your platform names to instantly synthesize and reserve your production URL:'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Platform Name in Arabic */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isRtl ? '1. اسم المنصة بالعربية *' : '1. Platform Name (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={platformNameAr}
                    onChange={(e) => setPlatformNameAr(e.target.value)}
                    placeholder={isRtl ? 'مثال: أكاديمية المستقبل التعليمية' : 'e.g. Al-Mostaqbal Academy'}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs md:text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                {/* 2. Platform Name in English */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isRtl ? '2. اسم المنصة بالإنجليزية (لتوليد النطاق) *' : '2. Platform Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={platformNameEn}
                    onChange={(e) => setPlatformNameEn(e.target.value)}
                    placeholder={isRtl ? 'مثال: mahmoud أو future-academy' : 'e.g. mahmoud'}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs md:text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition font-mono"
                  />
                </div>
              </div>

              {/* 3. Contact Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>{isRtl ? '3. رقم الهاتف / الواتساب للتواصل والدعم الفني *' : '3. Contact Phone / WhatsApp *'}</span>
                  {currentUser?.phone && (
                    <span className="text-[10px] text-blue-400 font-normal">
                      {isRtl ? 'مسترجع من ملفك الشخصي' : 'From your account'}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs md:text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition font-mono"
                />
              </div>

              {/* Instant Vercel Production URL Generation Card */}
              <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-blue-950/30 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-emerald-300">
                      {isRtl ? 'رابط الإنتاج الرسمي المتولد تلقائياً (Your Production URL):' : 'Instant Auto-Generated Vercel Link:'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Vercel Edge Cloud</span>
                </div>

                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs md:text-sm">
                  <span className="text-emerald-400 font-bold truncate tracking-wide">
                    {generatedVercelUrl}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shrink-0 cursor-pointer shadow"
                  >
                    {hasCopiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{hasCopiedUrl ? (isRtl ? 'تم النسخ' : 'Copied') : (isRtl ? 'نسخ الرابط' : 'Copy')}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  {isRtl 
                    ? `بمجرد كتابة الاسم الإنجليزي "${platformNameEn || 'mahmoud'}"، يُحجز ويُربط الرابط السحابي مباشرة لمنصتك.` 
                    : 'Your custom production URL is derived automatically from your English name input.'}
                </p>
              </div>
            </div>

            {/* PILLAR 3: THE AUTOMATED MANUAL PAYMENT GATEWAY (Locked Calculation & Wallet Verification) */}
            <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:p-6 shadow-xl">
              <div className="space-y-1 border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>{isRtl ? '3. بوابة الدفع اليدوي والتحقق الآلي من الإيصال' : '3. Automated Manual Payment Gateway'}</span>
                  </h3>
                  <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 text-xs font-bold text-amber-400">
                    <Lock className="w-3 h-3" />
                    <span>{isRtl ? 'المبلغ مغلق ومحسوب تلقائياً' : 'Locked Calculated Amount'}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  {isRtl ? 'تم قفل الباقة وحساب السعر بدقة لمنع الأخطاء الحسابية. اختر المحفظة وأدخل بيانات السداد:' : 'System locks chosen tier and calculates exact pricing without manual error:'}
                </p>
              </div>

              {/* Conditional Online Gateway Selector (Hidden by default unless enabled in Admin Settings) */}
              {isOnlinePaymentActive && (
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-indigo-500/40">
                  <button
                    type="button"
                    onClick={() => setPaymentGatewayMode('manual')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      paymentGatewayMode === 'manual'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'تحويل يدوي وإرفاق الإيصال' : 'Manual Wallet Transfer'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentGatewayMode('online_kashier')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      paymentGatewayMode === 'online_kashier'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'دفع إلكتروني مباشر (Kashier / Visa)' : 'Online Card Checkout (Kashier)'}</span>
                  </button>
                </div>
              )}

              {/* Locked Price Summary Banner */}
              <div className="p-4 rounded-2xl border border-blue-500/40 bg-blue-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                <div className="space-y-0.5">
                  <span className="text-xs text-blue-300 font-bold">
                    {isRtl ? 'النظام والباقة المقفلة:' : 'Locked System Tier:'} {isRtl ? planLabels[selectedPlan].ar : planLabels[selectedPlan].en}
                  </span>
                  <div className="text-xs text-slate-400">
                    {isRtl ? 'المشروع:' : 'Project:'} {isRtl ? project.titleAr : project.titleEn}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">{isRtl ? 'المبلغ المطلوب سداده:' : 'Exact Due Amount:'}</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono tracking-tight">{lockedPrice}</span>
                </div>
              </div>

              {/* Choose Admin Payment Wallet */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-slate-300 block">
                  {isRtl ? 'اختر وسيلة ومحفظة التحويل المطلوبة:' : 'Select Destination Payment Wallet:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeWallets.map((w) => {
                    const isSelected = selectedWalletId === w.id;
                    const isCopied = copiedWalletId === w.id;
                    return (
                      <div
                        key={w.id}
                        onClick={() => setSelectedWalletId(w.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-950/40 ring-2 ring-blue-500/40 shadow-lg'
                            : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white truncate">{isRtl ? w.nameAr : w.nameEn}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">{w.badge || 'فوري'}</span>
                        </div>

                        <div className="flex items-center justify-between gap-1 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-emerald-400">
                          <span className="truncate">{w.number}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyWalletNumber(w.number, w.id);
                            }}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer shrink-0"
                            title="Copy"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sender Details Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* 1. Sender Wallet/Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isRtl ? 'رقم المحفظة / الهاتف المحول منه *' : "Sender's Wallet / Phone Number *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder={isRtl ? 'مثال: 01012345678 أو IPA address' : 'e.g. 01012345678'}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs md:text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition font-mono"
                  />
                </div>

                {/* 2. Transaction / Reference Code */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isRtl ? 'رقم / كود المعاملة أو الحوالة (Reference Code) *' : 'Transaction / Reference Code *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={referenceCode}
                    onChange={(e) => setReferenceCode(e.target.value)}
                    placeholder={isRtl ? 'كود التحويل الصادر من تطبيق المحفظة أو البنك' : 'e.g. TXN-9842104'}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs md:text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition font-mono"
                  />
                </div>
              </div>

              {/* 3. Proof of Payment Upload */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-slate-300 block">
                  {isRtl ? 'إثبات الدفع: رفع لقطة شاشة / صورة الإيصال *' : 'Proof of Payment: Upload Receipt Screenshot *'}
                </label>

                {receiptImage ? (
                  <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 flex items-center justify-between gap-4 animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl border border-slate-700 overflow-hidden bg-slate-950 shrink-0">
                        <img src={receiptImage} alt="Payment Receipt" className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block truncate max-w-xs">{receiptFileName || (isRtl ? 'صورة الإيصال المرفقة' : 'Receipt Image Attached')}</span>
                        <span className="text-[11px] text-emerald-400 font-semibold">{isRtl ? 'جاهز للاعتماد والمراجعة ✓' : 'Ready for verification ✓'}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setReceiptImage('');
                        setReceiptFileName('');
                      }}
                      className="px-3 py-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition cursor-pointer"
                    >
                      {isRtl ? 'تغيير الصورة' : 'Change Image'}
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor={receiptInputId}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-800 hover:border-blue-500 bg-slate-900/60 hover:bg-slate-900 cursor-pointer transition text-center space-y-2"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">
                        {isRtl ? 'انقر هنا لاختيار صورة الإيصال أو اسحبها وأفلتها' : 'Click to browse receipt screenshot or drag & drop'}
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {isRtl ? 'الصيغ المدعومة: PNG, JPG, JPEG (أقل من 8 ميجابايت)' : 'PNG, JPG or JPEG up to 8MB'}
                      </span>
                    </div>
                    <input
                      id={receiptInputId}
                      type="file"
                      accept="image/*"
                      required
                      onChange={handleReceiptUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* PILLAR 4: CLOSING THE LOOP - WHATSAPP AUTOMATION TRIGGER & SUBMIT BUTTON */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  {isRtl ? 'يتم حفظ المعاملة فورياً وإرسال بيانات الاعتماد آلياً عبر الواتساب.' : 'Order is stored instantly with automated WhatsApp verification.'}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 sm:w-auto px-5 py-3 rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 text-xs md:text-sm font-bold transition cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 sm:w-auto flex-1 flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs md:text-sm shadow-xl shadow-emerald-600/30 transition active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{isRtl ? 'جاري توثيق الطلب...' : 'Documenting Order...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{isRtl ? 'تأكيد الطلب وإرسال عبر واتساب 🚀' : 'Confirm & Send via WhatsApp 🚀'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
