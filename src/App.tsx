/**
 * Project Identity: ليرن ويب | Lern Web
 * Architecture Framework: Next.js (App Router Layout Structure) + React Vite Runtime
 * Purpose: Dynamic Web Application with Dedicated CMS Control Panel, Interactive Marketplace,
 *          Live Sandbox Simulator, Real-Time Firestore Sync, and One-Page Seamless Architecture.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Layers, Play, Video, ShieldCheck, Sun, Moon, 
  Globe, Download, Smartphone, Code2, ArrowUpRight,
  CheckCircle2, Menu, X, Share2, Terminal, Copy, Check, Lock, User, Sparkles, Printer, BarChart3, Rocket, Clock, Bot, LogOut, LayoutDashboard, FileText, HelpCircle,
  Crown, Sliders, Bell, ArrowDown, ChevronUp, Radio, Compass, MessageSquare, Zap, ExternalLink, Activity, ArrowRight, Star, CreditCard, ChevronRight, ChevronLeft, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import AppStore from '../components/AppStore';
import FaqSection from '../components/FaqSection';
import PwaDiagnostics from '../components/PwaDiagnostics';
import UserProfileSection from '../components/UserProfileSection';
import ProductTour from '../components/ProductTour';
import AboutUsSection from '../components/AboutUsSection';
import AdminDashboard from '../components/AdminDashboard';
import SecretLoginModal from '../components/SecretLoginModal';
import PlatformRating from './components/PlatformRating';
import { WelcomeModal } from './components/WelcomeModal';
import { SocialMediaBar } from './components/SocialMediaIcons';
import ClientNotificationsSection from '../components/ClientNotificationsSection';
import AiSupportChat from './components/AiSupportChat';
import ClientSpendingChart from './components/ClientSpendingChart';
import { PublishedProjectsSection } from './components/PublishedProjectsSection';
import CmsArticlesSection from '../components/CmsArticlesSection';
import PaymentWalletsSection from './components/PaymentWalletsSection';
import GlobalSkeletonLoader from '../components/GlobalSkeletonLoader';
import Three3DLoaderPortal from './components/Three3DLoaderPortal';
import SectionMediaShowcase from './components/SectionMediaShowcase';
import HomeSection from './components/HomeSection';
import SupportHelpCenter from '../components/SupportHelpCenter';
import { toast } from 'sonner';
import { translations } from './data/translations';
import { APPS_DATA, WALLET_OPTIONS, MEDIA_RESOURCES, AppItem } from './data/storeData';
import { 
  storageService, buildWhatsAppUrl, ProjectItem, AdminSettings, WalletConfig, MediaResourceItem, AiCustomizationDraft, UserOrder, PublishedProject,
  getProjects, getSettings, getWallets, getMediaResources, getPlans, getNotifications, UserNotification, CmsArticle, AnnouncementBanner
} from './services/storageService';
import { subscribeToAuthChanges, signOutUser } from './services/firebaseService';

const VSCODE_CODE_CATALOG: Record<string, { lang: string; title: string; code: string }> = {
  'app/page.jsx': {
    lang: 'javascript',
    title: 'app/page.jsx (Root layout routing and state coordinator)',
    code: `/**
 * Next.js Project Structure Identifier:
 * app/page.jsx
 * 
 * Project Identity: ليرن ويب | Lern Web
 * Architecture Framework: Next.js (App Router Layout Structure)
 * Purpose: Dynamic Web Application with Dedicated CMS Control Panel & One-Page Architecture
 */

'use client';

import React, { useState } from 'react';
import AppStore from '@/components/AppStore';
import SandboxPreview from '@/components/SandboxPreview';

export default function Page() {
  const [theme, setTheme] = useState('dark');
  return (
    <div className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}>
      <AppStore />
    </div>
  );
}`
  },
  'app/layout.jsx': {
    lang: 'javascript',
    title: 'app/layout.jsx (Bilingual context wrappers, metadata providers, and global font injections)',
    code: `export const metadata = {
  title: 'ليرن ويب | Lern Web - المنظومة التعليمية السحابية المتكاملة',
  description: 'سوق أدوات ومحاكي مراكز تعليمية متطورة مع محرك PWA ونظام CMS ولوحة تحكم مخصصة وتملك كامل للكود المصدري.',
  manifest: '/manifest.json',
  icons: { icon: '/icon.svg', apple: '/icon-192.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}`
  }
};

export default function App() {
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') toast.success(message);
    else toast.error(message);
  }, []);

  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const t = translations[lang] || translations.ar;
  const isRtl = lang === 'ar';

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [viewMode] = useState<'tabs'>('tabs');
  const [activeTab, setActiveTab] = useState<'hero' | 'store' | 'sandbox' | 'articles' | 'faq' | 'rating' | 'media' | 'billing' | 'vscode' | 'client-dashboard' | 'about' | 'cms-dashboard' | 'wallets' | 'published-projects'>('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sandboxConfig, setSandboxConfig] = useState<any>(null);
  const [isAnnouncementDismissed, setIsAnnouncementDismissed] = useState<boolean>(false);

  // Autostart skip logic for testing/verification
  const isAutostart = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('autostart') === '1';
  
  const [showThreeDLoader, setShowThreeDLoader] = useState(!isAutostart);
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(() => !isAutostart && !localStorage.getItem('hasSeenWelcome'));

  // Admin Master State
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // Client Authentication State
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isClientLoginOpen, setIsClientLoginOpen] = useState(false);
  const [isSecretLoginOpen, setIsSecretLoginOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (activeTab === 'client-dashboard' && isUserLoggedIn && !localStorage.getItem('hasSeenTour')) {
      setShowTour(true);
    }
  }, [activeTab, isUserLoggedIn]);

  const [userDrafts, setUserDrafts] = useState<AiCustomizationDraft[]>(() => storageService.getAiDrafts());
  const prevDraftStatuses = useRef<Record<string, string>>({});

  useEffect(() => {
    if (isUserLoggedIn && userDrafts.length > 0) {
      userDrafts.forEach((draft) => {
        const prevStatus = prevDraftStatuses.current[draft.id];
        if (prevStatus && prevStatus !== draft.status) {
          const statusMapAr: Record<string, string> = {
            'pending_review': 'قيد المراجعة الفنية',
            'in_progress': 'قيد التنفيذ والبرمجة',
            'completed': 'تم التنفيذ / جاهز',
            'approved_published': 'تم الاعتماد والنشر بالمتجر',
            'rejected': 'تم الرفض / يحتاج مراجعة'
          };
          const statusMapEn: Record<string, string> = {
            'pending_review': 'Pending Review',
            'in_progress': 'In Progress',
            'completed': 'Completed / Ready',
            'approved_published': 'Approved & Published',
            'rejected': 'Rejected / Needs Review'
          };
          const statusLabel = isRtl ? statusMapAr[draft.status] : statusMapEn[draft.status];
          let details = isRtl 
            ? `🔔 تحديث حالة: طلبك "${draft.modifiedConfig?.centerName || 'المنصة'}" أصبح الآن [${statusLabel}]`
            : `🔔 Status Update: Your request "${draft.modifiedConfig?.centerName || 'Platform'}" is now [${statusLabel}]`;
          if (draft.notes) {
            details += isRtl ? `\n\nملاحظة الإدارة: ${draft.notes}` : `\n\nAdmin Note: ${draft.notes}`;
          }
          showToast(details, 'success');
        }
        prevDraftStatuses.current[draft.id] = draft.status;
      });
    } else if (!isUserLoggedIn) {
      prevDraftStatuses.current = {};
    }
  }, [userDrafts, isUserLoggedIn, isRtl, showToast]);

  const [projects, setProjects] = useState<ProjectItem[]>(() => getProjects(false));
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => getSettings());
  const [wallets, setWallets] = useState<WalletConfig[]>(() => getWallets());
  const [mediaItems, setMediaItems] = useState<MediaResourceItem[]>(() => {
    const stored = getMediaResources();
    return stored.length > 0 ? stored : (MEDIA_RESOURCES as any[]);
  });
  const [notifications, setNotifications] = useState<UserNotification[]>(() => getNotifications());
  const [userOrders, setUserOrders] = useState<UserOrder[]>(() => storageService.getUserOrders());
  const [articles, setArticles] = useState<CmsArticle[]>(() => storageService.getArticles(false));
  const [announcements, setAnnouncements] = useState<AnnouncementBanner[]>(() => storageService.getAnnouncements());
  const [publishedProjects, setPublishedProjects] = useState<PublishedProject[]>(() => storageService.getPublishedProjects());

  const refreshStorageData = () => {
    const isAdminActive = storageService.isAdminLoggedIn();
    setIsAdmin(isAdminActive);
    setIsUserLoggedIn(storageService.isUserLoggedIn());
    setCurrentUser(storageService.getCurrentUser());
    setProjects(storageService.getProjects(isAdminActive));
    setAdminSettings(storageService.getSettings());
    setWallets(storageService.getWallets());
    const storedMedia = storageService.getMediaResources();
    setMediaItems(storedMedia.length > 0 ? storedMedia : (MEDIA_RESOURCES as any[]));
    setUserDrafts(storageService.getAiDrafts());
    setNotifications(storageService.getNotifications());
    setUserOrders(storageService.getUserOrders());
    setArticles(storageService.getArticles(false));
    setAnnouncements(storageService.getAnnouncements());
    setPublishedProjects(storageService.getPublishedProjects());
  };

  useEffect(() => {
    refreshStorageData();
    storageService.syncNow();

    const unsubscribeStorage = storageService.subscribe(() => {
      refreshStorageData();
    });

    const unsubscribeAuth = subscribeToAuthChanges((user) => {
      if (user) {
        setIsUserLoggedIn(true);
        setCurrentUser({
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'User',
          phone: '',
          email: user.email,
          createdAt: user.metadata.creationTime
        });
      } else {
        const localUser = storageService.getCurrentUser();
        setIsUserLoggedIn(!!localUser);
        setCurrentUser(localUser);
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsSecretLoginOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const handleContextMenu = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('input, textarea, pre, code')) {
        e.preventDefault();
      }
    };
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
      unsubscribeAuth();
      unsubscribeStorage();
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  const scrollToSection = (id: string) => {
    setActiveTab(id as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    scrollToSection('hero');
  };

  const handleClientLogout = async () => {
    try {
      await signOutUser();
    } catch (e) {
      console.warn('Firebase signout skipped', e);
    }
    storageService.logoutUser();
    setIsUserLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('store');
    showToast(isRtl ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully', 'success');
  };

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [activeVsCodeFile, setActiveVsCodeFile] = useState('app/page.jsx');
  const [hasCopiedFile, setHasCopiedFile] = useState(false);

  const effectiveTheme = adminSettings?.themeMode === 'dark' 
    ? 'dark' 
    : adminSettings?.themeMode === 'light' 
      ? 'light' 
      : theme;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';

    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }

    if (adminSettings?.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', adminSettings.primaryColor);
    }
    if (adminSettings?.accentColor) {
      document.documentElement.style.setProperty('--accent-color', adminSettings.accentColor);
    }
    if (adminSettings?.fontFamily) {
      const fontMap: Record<string, string> = {
        cairo: "'Cairo', sans-serif",
        tajawal: "'Tajawal', sans-serif",
        inter: "'Inter', sans-serif",
        almarai: "'Almarai', sans-serif"
      };
      document.body.style.fontFamily = fontMap[adminSettings.fontFamily] || "'Cairo', sans-serif";
    }
  }, [lang, isRtl, effectiveTheme, adminSettings]);

  useEffect(() => {
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      alert(isRtl 
        ? 'يمكنك تثبيت التطبيق مباشرة من قائمة إعدادات المتصفح (Install App أو Add to Home Screen).' 
        : 'You can install the app directly via your browser menu (Install App / Add to Home Screen).');
    }
  };

  const handleLaunchAppInSandbox = (itemOrConfig: any) => {
    if (!itemOrConfig) return;

    if (itemOrConfig.category && itemOrConfig.centerName) {
      setSandboxConfig(itemOrConfig);
    } else if (itemOrConfig.defaultSandboxConfig) {
      setSandboxConfig({
        category: itemOrConfig.category || 'lms',
        centerName: isRtl ? itemOrConfig.titleAr : itemOrConfig.titleEn,
        theme: itemOrConfig.defaultSandboxConfig.theme,
        activeCourse: isRtl ? itemOrConfig.defaultSandboxConfig.activeCourse : itemOrConfig.titleEn,
        bannerText: isRtl ? itemOrConfig.defaultSandboxConfig.bannerText : 'Active runtime deployment configured',
        activeTab: 'courses',
        studentCount: 850,
        tutorName: 'فريق ليرن ويب التقني',
        hasQuiz: itemOrConfig.defaultSandboxConfig.hasQuiz
      });
    } else {
      setSandboxConfig(itemOrConfig);
    }

    setActiveTab('sandbox');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyCode = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setHasCopiedFile(true);
    setTimeout(() => setHasCopiedFile(false), 2500);
  };

  const activeAnnouncement = announcements.find(a => a.isActive);

  return (
    <div className={`min-h-screen transition-colors duration-300 star-field animate-stars ${
      effectiveTheme === 'dark' 
        ? 'bg-slate-950 text-slate-100' 
        : 'bg-slate-50 text-slate-900'
    }`}>
      {showThreeDLoader && (
        <Three3DLoaderPortal lang={lang} onEnterPlatform={() => setShowThreeDLoader(false)} />
      )}
      
      {/* Dynamic CMS Announcement Ticker */}
      {!isAnnouncementDismissed && activeAnnouncement && (
        <aside aria-label="CMS announcement banner" className="no-print bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-500/30 px-4 py-2 text-amber-200 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-md z-40 relative">
          <div className="max-w-7xl mx-auto flex-1 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] border border-amber-500/30">
              {isRtl ? activeAnnouncement.badgeAr : activeAnnouncement.badgeEn}
            </span>
            <span className="font-medium text-slate-200">
              {isRtl ? activeAnnouncement.messageAr : activeAnnouncement.messageEn}
            </span>
            {activeAnnouncement.targetUrl && (
              <button
                onClick={() => {
                  const target = activeAnnouncement.targetUrl;
                  if (target && target.startsWith('#')) {
                    scrollToSection(target.replace('#', ''));
                  }
                }}
                className="font-bold underline text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                {isRtl ? 'عرض التفاصيل ←' : 'Learn more →'}
              </button>
            )}
          </div>
          <button
            onClick={() => setIsAnnouncementDismissed(true)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
            title={isRtl ? 'إغلاق التنبيه' : 'Dismiss'}
          >
            <X className="w-4 h-4" />
          </button>
        </aside>
      )}

      {/* Admin Mode Floating Header Ribbon if Logged In */}
      {isAdmin && (
        <div className="no-print bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 border-b border-blue-400/40 px-4 py-2 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm shadow-xl z-50 sticky top-0">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-emerald-500/30 animate-pulse" />
            <span className="font-bold">👑 {isRtl ? 'وضع تحكم المشرف والـ CMS نشط:' : 'CMS Master Admin Active:'}</span>
            <span className="text-slate-200 hidden md:inline">{isRtl ? 'تحكم كامل في نشر المقالات، إدارة المشاريع وتتبع مسودات الـ AI' : 'Full CMS & Projects Authority'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                storageService.logoutAdmin();
                refreshStorageData();
                showToast(isRtl ? 'تم تسجيل الخروج من الإدارة' : 'Logged out of admin', 'success');
              }}
              className="rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-3 py-1 text-white transition cursor-pointer"
            >
              {isRtl ? 'خروج' : 'Logout'}
            </button>
          </div>
        </div>
      )}

      {/* PWA Install Banner */}
      {!isInstalled && (
        <aside aria-label="PWA install banner" className="no-print relative z-30 border-b border-blue-500/20 bg-gradient-to-r from-blue-950 via-indigo-950 to-blue-900 px-4 py-2 text-white shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <Smartphone className="w-3.5 h-3.5 text-blue-300" />
              <span className="font-semibold">{t.pwaInstallTitle}:</span>
              <span className="text-slate-300 hidden md:inline">{t.pwaInstallDesc}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 px-3 py-1 font-bold text-white shadow transition active:scale-95"
              >
                <Download className="w-3 h-3" />
                <span>{t.installNow}</span>
              </button>

              {isIOS && (
                <button
                  onClick={() => setShowIOSModal(true)}
                  className="rounded-xl border border-white/20 bg-white/10 px-2 py-1 text-[11px] text-white hover:bg-white/20"
                >
                  iPhone Guide
                </button>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* Global Real-time Sync & Skeleton Loading Indicator Layer */}
      <GlobalSkeletonLoader lang={lang} />

      {/* Global Sticky Header */}
      <header className={`no-print sticky ${isAdmin ? 'top-10' : 'top-0'} z-30 border-b backdrop-blur-xl transition-colors ${
        theme === 'dark' 
          ? 'border-slate-800/80 bg-slate-950/90' 
          : 'border-slate-200/80 bg-white/90'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={handleLogoClick}
              title={isRtl ? 'ليرن ويب | Lern Web' : 'Lern Web'}
              className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 p-0.5 shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-transform overflow-hidden cursor-pointer select-none border-0 shrink-0"
            >
              <img 
                src="/assets/aistudio/image_69117c9b__1__7fdc7aea.jpg" 
                alt="Lern Web Logo" 
                className="w-full h-full object-cover rounded-[14px] pointer-events-none"
              />
            </button>

            <div 
              onClick={() => scrollToSection('hero')}
              className="space-y-0.5 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="font-black text-lg md:text-xl tracking-tight text-white hover:text-blue-400 transition-colors">
                  {adminSettings?.centerName || 'ليرن ويب'}
                </span>
                <span className="text-[11px] font-bold text-blue-400 font-mono">
                  LERN WEB
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                {isRtl ? 'تطبيق ويب ديناميكي • نظام CMS • لوحة تحكم مخصصة' : 'Dynamic Web App & Dedicated CMS Panel'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links (Laptop & Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-1.5 overflow-x-auto">
            {[
              { id: 'hero', label: isRtl ? 'الرئيسية' : 'Home', icon: Compass },
              { id: 'store', label: isRtl ? 'سوق المنظومات' : 'App Store', icon: Layers },
              { id: 'published-projects', label: isRtl ? 'مشروعات منشورة' : 'Projects', icon: Globe },
              { id: 'rating', label: isRtl ? 'تقييم المنصة' : 'Rate Platform', icon: Star },
              { id: 'articles', label: isRtl ? 'المقالات والـ CMS' : 'CMS & Articles', icon: FileText },
              { id: 'wallets', label: isRtl ? 'طرق الدفع' : 'Payment Methods', icon: CreditCard },
              { id: 'faq', label: isRtl ? 'الأسئلة الشائعة' : 'FAQ', icon: HelpCircle },
              { id: 'about', label: isRtl ? 'من نحن' : 'About Us', icon: Sparkles }
            ].map((nav) => {
              const Icon = nav.icon;
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => scrollToSection(nav.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-bold' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{nav.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Admin Dashboard Launch Button if Admin */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setIsAdminDashboardOpen(true)}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition shadow-sm cursor-pointer border border-amber-500/50 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 ring-2 ring-amber-500/20"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{isRtl ? 'لوحة المشرف' : 'Admin Panel'}</span>
              </button>
            )}

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-200 hover:border-slate-700 transition active:scale-95"
              title={isRtl ? 'Switch to English' : 'تحويل للعربية'}
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span className={isMobileMenuOpen ? 'inline' : 'hidden sm:inline'}>{lang === 'ar' ? 'EN' : 'AR'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')}
              className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:text-white hover:border-slate-700 transition active:scale-95"
            >
              {effectiveTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Replay 3D Portal Button */}
            <button
              onClick={() => setShowThreeDLoader(true)}
              title={isRtl ? 'عرض بوابة الدخول والتحميل ثلاثية الأبعاد (3D Portal)' : 'Replay 3D Entry Portal'}
              className="flex items-center gap-1 rounded-xl border border-blue-500/40 bg-blue-600/20 px-2.5 py-2 text-xs font-bold text-blue-300 hover:bg-blue-600/30 transition cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-blue-400 animate-pulse" />
              <span className="hidden lg:inline">3D</span>
            </button>

            {/* Client User Login / Profile Button */}
            {isUserLoggedIn ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollToSection('client-dashboard')}
                  className="flex items-center gap-2 rounded-xl border border-blue-500/50 bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-2 text-xs md:text-sm font-bold text-white hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/30 transition active:scale-95 cursor-pointer"
                  title={isRtl ? 'فتح لوحة العميل وحسابي' : 'Open Client Dashboard'}
                >
                  {currentUser?.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt="Avatar" className="w-5 h-5 rounded-full object-cover border border-white/40" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white">
                      {(currentUser?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[110px] truncate">{currentUser?.name || (isRtl ? 'لوحة العميل' : 'My Account')}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClientLogout}
                  title={isRtl ? 'تسجيل الخروج' : 'Logout'}
                  className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2 text-rose-300 hover:bg-rose-500/20 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsClientLoginOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-blue-500/50 bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-xs md:text-sm font-bold text-white hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/30 transition active:scale-95 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>{isRtl ? 'دخول العميل' : 'Client Login'}</span>
              </button>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:text-white cursor-pointer active:scale-95"
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation Drawer - Rendered directly above all page content (z-[9999]) */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-[9999] bg-slate-950/98 text-slate-100 backdrop-blur-3xl flex flex-col animate-fadeIn select-none overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label={isRtl ? 'أقسام منصة ليرن ويب' : 'Lern Web Platform Sections'}
        >
          {/* Drawer Top Navigation Bar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-slate-900/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow-md overflow-hidden shrink-0">
                <img 
                  src="/assets/aistudio/image_69117c9b__1__7fdc7aea.jpg" 
                  alt="Lern Web Logo" 
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
              <div className="text-right">
                <span className="font-black text-base md:text-lg text-white block">
                  {adminSettings?.centerName || 'ليرن ويب'}
                </span>
                <span className="text-[10px] text-blue-400 font-mono block">
                  LERN WEB PLATFORM
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-1.5 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-slate-700 transition active:scale-95 cursor-pointer"
              aria-label={isRtl ? 'إغلاق القائمة' : 'Close Menu'}
            >
              <X className="w-5 h-5 text-rose-400" />
              <span>{isRtl ? 'إغلاق' : 'Close'}</span>
            </button>
          </div>

          {/* Quick Actions (Language & Theme) */}
          <div className="px-5 py-3 border-b border-slate-800/60 bg-slate-900/40 grid grid-cols-2 gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 py-2.5 text-xs font-bold text-white shadow transition active:scale-95 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-blue-400" />
              <span>{lang === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 py-2.5 text-xs font-bold text-white shadow transition active:scale-95 cursor-pointer"
            >
              {effectiveTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              <span>{effectiveTheme === 'dark' ? (isRtl ? 'المظهر الفاتح' : 'Light') : (isRtl ? 'المظهر الداكن' : 'Dark')}</span>
            </button>
          </div>

          {/* Scrollable Navigation Sections List */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
            <div className="px-1 text-right">
              <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest block">
                {isRtl ? 'أقسام المنظومة التعليمية' : 'Platform Sections'}
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                {isRtl ? 'اضغط على أي قسم للانتقال إليه مباشرة' : 'Tap any section to navigate immediately'}
              </p>
            </div>

            <div className="space-y-2">
              {[
                { 
                  id: 'hero', 
                  labelAr: 'الرئيسية', 
                  labelEn: 'Home', 
                  descAr: 'واجهة البداية وأبرز مميزات المنظومة', 
                  descEn: 'Platform overview and highlights',
                  icon: Compass,
                  color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                },
                { 
                  id: 'store', 
                  labelAr: 'سوق المنظومات والأدوات', 
                  labelEn: 'App Store', 
                  descAr: 'تصفح كافة التطبيقات والمنصات الجاهزة', 
                  descEn: 'Explore all certified systems and tools',
                  icon: Layers,
                  color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
                },
                { 
                  id: 'articles', 
                  labelAr: 'المقالات والـ CMS', 
                  labelEn: 'CMS & Articles', 
                  descAr: 'أدلة التشغيل ومقالات التحول الرقمي', 
                  descEn: 'Knowledgebase and digital transformation guides',
                  icon: FileText,
                  color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                },
                { 
                  id: 'wallets', 
                  labelAr: 'طرق الدفع والاشتراك', 
                  labelEn: 'Payment Methods', 
                  descAr: 'فودافون كاش، انستاباي، والتحويلات', 
                  descEn: 'Vodafone Cash, InstaPay, and direct transfers',
                  icon: CreditCard,
                  color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                },
                { 
                  id: 'published-projects', 
                  labelAr: 'مشروعات منشورة', 
                  labelEn: 'Published Projects', 
                  descAr: 'استعراض المنصات والمراكز الحية', 
                  descEn: 'Live client academies and deployments',
                  icon: Globe,
                  color: 'text-sky-400 bg-sky-500/10 border-sky-500/20'
                },
                { 
                  id: 'faq', 
                  labelAr: 'الأسئلة الشائعة', 
                  labelEn: 'FAQ', 
                  descAr: 'إجابات فورية وشاملة لكل استفساراتك', 
                  descEn: 'Instant answers to all common questions',
                  icon: HelpCircle,
                  color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
                },
                { 
                  id: 'rating', 
                  labelAr: 'تقييم المنصة', 
                  labelEn: 'Rate Platform', 
                  descAr: 'آراء ومراجعات المراكز والمدربين', 
                  descEn: 'Client ratings and feedback',
                  icon: Star,
                  color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                },
                { 
                  id: 'about', 
                  labelAr: 'من نحن', 
                  labelEn: 'About Us', 
                  descAr: 'رؤية ليرن ويب ومنظومة العمل', 
                  descEn: 'Learn more about our team and mission',
                  icon: Sparkles,
                  color: 'text-pink-400 bg-pink-500/10 border-pink-500/20'
                },
                ...(isAdmin ? [{
                  id: 'cms-dashboard',
                  labelAr: '👑 لوحة تحكم المشرف والـ CMS',
                  labelEn: '👑 Admin & CMS Panel',
                  descAr: 'إدارة المحتوى والمشاريع وتعديل الإعدادات',
                  descEn: 'Full CMS authority and platform settings',
                  icon: Crown,
                  color: 'text-amber-300 bg-amber-500/20 border-amber-500/40',
                  highlight: true
                }] : [])
              ].map((nav) => {
                const Icon = nav.icon;
                const isCurrent = activeTab === nav.id;
                return (
                  <button
                    key={nav.id}
                    type="button"
                    onClick={() => {
                      scrollToSection(nav.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                      nav.highlight 
                        ? 'bg-gradient-to-r from-amber-600/20 to-amber-950/40 border-amber-500/40 text-amber-200 shadow-lg' 
                        : isCurrent 
                          ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-600/30' 
                          : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 text-right">
                      <div className={`p-2.5 rounded-xl border ${isCurrent ? 'bg-white/20 border-white/30 text-white' : nav.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm md:text-base block">
                          {isRtl ? nav.labelAr : nav.labelEn}
                        </span>
                        <span className={`text-xs block mt-0.5 ${isCurrent ? 'text-blue-100' : 'text-slate-400'}`}>
                          {isRtl ? nav.descAr : nav.descEn}
                        </span>
                      </div>
                    </div>

                    <div className={isCurrent ? 'text-white' : 'text-slate-500'}>
                      {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer of Mobile Drawer */}
          <div className="px-5 py-4 border-t border-slate-800/80 bg-slate-900/80 space-y-3 shrink-0">
            {isUserLoggedIn ? (
              <button
                type="button"
                onClick={() => {
                  handleClientLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-sm font-bold text-rose-300 hover:bg-rose-500/20 transition active:scale-95 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{isRtl ? 'تسجيل الخروج من الحساب' : 'Log Out'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsClientLoginOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-3.5 text-sm font-black text-white shadow-xl shadow-blue-600/30 transition active:scale-95 cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>{isRtl ? 'تسجيل الدخول / فتح حساب عميل' : 'Client Sign In / Register'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Tabbed Container Flow */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 md:py-10">
        <div className="space-y-8 animate-fadeIn">
            {activeTab === 'hero' && (
              <HomeSection
                lang={lang}
                t={t}
                adminSettings={adminSettings}
                projects={projects}
                publishedProjects={publishedProjects}
                onNavigate={(tab) => scrollToSection(tab)}
                onLaunchSandbox={handleLaunchAppInSandbox}
                targetWhatsAppNumber={adminSettings?.targetWhatsAppNumber || '201024889921'}
                showToast={showToast}
              />
            )}

            {activeTab === 'articles' && (
              <CmsArticlesSection
                lang={lang}
                isAdmin={isAdmin}
                onOpenAdminCms={() => setIsAdminDashboardOpen(true)}
                showToast={showToast}
              />
            )}

            {activeTab === 'about' && (
              <AboutUsSection
                lang={lang}
                onClose={() => scrollToSection('hero')}
              />
            )}

            {activeTab === 'store' && (
              <AppStore
                apps={projects as any}
                lang={lang}
                t={t}
                onLaunchSandbox={handleLaunchAppInSandbox}
                onSelectAppForDeploy={handleLaunchAppInSandbox}
                isAdmin={isAdmin}
                isUserLoggedIn={isUserLoggedIn}
                adminSettings={adminSettings}
                onOpenLogin={() => setIsClientLoginOpen(true)}
                onOpenAdminPortal={() => setIsAdminDashboardOpen(true)}
                showToast={showToast}
              />
            )}

            {activeTab === 'wallets' && (
              <PaymentWalletsSection
                wallets={wallets}
                adminSettings={adminSettings}
                lang={lang}
                showToast={showToast}
              />
            )}

            {activeTab === 'faq' && (
              <FaqSection lang={lang} adminSettings={adminSettings} />
            )}

            {activeTab === 'rating' && (
              <PlatformRating lang={lang} showToast={showToast} />
            )}

            {activeTab === 'published-projects' && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-bold text-white">{isRtl ? 'مشروعات منشورة' : 'Published Projects'}</h2>
                <PublishedProjectsSection projects={publishedProjects} lang={lang} isAdmin={isAdmin} onRefresh={refreshStorageData} />
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{t.mediaTitle}</h2>
                  <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">{t.mediaSubtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mediaItems.filter(m => isAdmin || m.isPublished !== false).map((res) => (
                    <div key={res.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-lg flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-400">
                            {isRtl ? res.categoryAr : res.categoryEn}
                          </span>
                          <span className="font-mono text-slate-400">
                            {isRtl ? res.durationOrReadTimeAr : res.durationOrReadTimeEn}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white">{isRtl ? res.titleAr : res.titleEn}</h3>
                        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{isRtl ? res.summaryAr : res.summaryEn}</p>
                      </div>

                      {res.type === 'video' ? (
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                          <iframe 
                            src={res.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'} 
                            title={res.titleAr} 
                            className="w-full h-full border-0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen 
                          />
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                          {isRtl ? res.contentAr : res.contentEn}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <PaymentWalletsSection
                wallets={wallets}
                adminSettings={adminSettings}
                lang={lang}
                showToast={showToast}
              />
            )}

            {activeTab === 'vscode' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-md bg-emerald-500/20 px-3 py-1 text-xs font-mono font-bold text-emerald-400">
                    <Terminal className="w-4 h-4" />
                    <span>VS Code Environment & Vercel Edge Pipeline</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{t.vsCodeExplorerTitle}</h2>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">{t.vsCodeExplorerSubtitle}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Structure:</h4>
                    {Object.keys(VSCODE_CODE_CATALOG).map((fileName) => (
                      <button
                        key={fileName}
                        onClick={() => setActiveVsCodeFile(fileName)}
                        className={`w-full text-left font-mono text-xs px-3 py-2.5 rounded-xl transition flex items-center justify-between ${
                          activeVsCodeFile === fileName ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>{fileName}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                      </button>
                    ))}
                  </div>

                  <div className="lg:col-span-3 rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div className="space-y-0.5">
                        <span className="text-xs font-mono text-blue-400">{VSCODE_CODE_CATALOG[activeVsCodeFile]?.title}</span>
                        <h4 className="text-base font-mono font-bold text-white">{activeVsCodeFile}</h4>
                      </div>

                      <button
                        onClick={() => handleCopyCode(VSCODE_CODE_CATALOG[activeVsCodeFile]?.code || '')}
                        className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition shadow"
                      >
                        {hasCopiedFile ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{hasCopiedFile ? t.fileCopied : t.copyFileCode}</span>
                      </button>
                    </div>

                    <div className="rounded-xl bg-slate-900 p-4 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto max-h-[500px]" dir="ltr">
                      <pre className="text-left font-mono whitespace-pre">{VSCODE_CODE_CATALOG[activeVsCodeFile]?.code}</pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'client-dashboard' && (
              <div className="space-y-8 animate-fadeIn min-h-[500px]">
                {isUserLoggedIn ? (
                  <div className="space-y-8">
                    <div className="rounded-3xl border border-blue-500/40 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 p-6 md:p-10 shadow-2xl space-y-4">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h2 className="text-3xl md:text-4xl font-black text-white">
                            {isRtl ? `مرحباً بك، ${currentUser?.name || 'عميلنا العزيز'}` : `Welcome back, ${currentUser?.name || 'Valued Client'}`}
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={handleClientLogout}
                          className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-400 inline ml-1" />
                          <span>{isRtl ? 'تسجيل الخروج' : 'Log Out'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-6">
                        <ClientNotificationsSection 
                          currentUser={currentUser}
                          lang={lang} 
                          onRefresh={refreshStorageData} 
                        />
                        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 shadow-xl">
                          <ClientSpendingChart 
                            orders={userOrders.filter(o => o.userId === currentUser?.id)} 
                            lang={lang} 
                          />
                        </div>
                        <SupportHelpCenter 
                          lang={lang} 
                          currentUser={currentUser} 
                          showToast={showToast} 
                        />
                      </div>

                      <div className="space-y-6">
                        <UserProfileSection
                          currentUser={currentUser}
                          userDraftsCount={userDrafts.length}
                          lang={lang}
                          onUserUpdated={(updated) => setCurrentUser(updated)}
                          onLogout={handleClientLogout}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center space-y-4">
                    <User className="w-12 h-12 text-blue-400 mx-auto opacity-80" />
                    <h3 className="text-xl font-bold text-white">
                      {isRtl ? 'تسجيل الدخول إلى حساب العميل' : 'Client Account Access'}
                    </h3>
                    <button
                      onClick={() => setIsClientLoginOpen(true)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg"
                    >
                      <span>{isRtl ? 'تسجيل الدخول الآن' : 'Sign In Now'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
      </main>

      {/* iOS Install Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-900 p-6 text-white space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold">{t.iosInstallGuide}</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">1</span>
                <p>{t.iosStep1}</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">2</span>
                <p>{t.iosStep2}</p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full rounded-2xl bg-slate-800 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* Global Footer */}
      <footer className="no-print mt-16 border-t border-slate-800/80 bg-slate-950 py-10 px-4 text-center text-xs text-slate-400 space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <SocialMediaBar
            links={adminSettings.socialLinksList || [
              { id: 'tg', app: 'telegram', url: adminSettings.socialLinks.telegram || '#', isActive: !!adminSettings.socialLinks.telegram },
            ]}
            lang={lang}
            variant="circle"
            size="md"
          />
        </div>

        <p>
          {isRtl 
            ? 'منظومة ليرن ويب | Lern Web التعليمية المتكاملة • محرك PWA • نظام إدارة محتوى (CMS) • التواصل المباشر مع الإدارة' 
            : 'Lern Web Cloud Educational Ecosystem • Dynamic Single Page Architecture • Full CMS & Dedicated Control Panel'}
        </p>

        <div className="flex items-center justify-center gap-2 text-slate-500 text-[11px]">
          <span>Next.js App Router • Tailwind CSS • Vercel Edge Architecture</span>
        </div>
      </footer>

      {/* Unified Login Modal for Clients and Staff/Admin */}
      <SecretLoginModal
        isOpen={isClientLoginOpen || isSecretLoginOpen}
        initialTab="login"
        onClose={() => {
          setIsClientLoginOpen(false);
          setIsSecretLoginOpen(false);
        }}
        onUserSuccess={(user: any) => {
          refreshStorageData();
          setIsUserLoggedIn(true);
          setCurrentUser(user);
          setActiveTab('client-dashboard');
          showToast(isRtl ? `مرحباً بك يا ${user?.name || 'عميلنا العزيز'}! تم تسجيل الدخول بنجاح.` : `Welcome ${user?.name || 'Client'}! Signed in successfully.`, 'success');
        }}
        onAdminSuccess={() => {
          refreshStorageData();
          setIsAdmin(true);
          setIsAdminDashboardOpen(true);
          showToast(isRtl ? 'تم تسجيل دخول المشرف بنجاح وفتح لوحة التحكم.' : 'Admin Dashboard unlocked.', 'success');
        }}
        lang={lang}
      />

      {/* Modal Admin Dashboard (when launched explicitly via modal) */}
      {isAdminDashboardOpen && (
        <AdminDashboard
          lang={lang}
          onClose={() => setIsAdminDashboardOpen(false)}
          onRefreshData={refreshStorageData}
          onOpenSandboxWithConfig={(cfg: any) => {
            setSandboxConfig(cfg);
            setActiveTab('sandbox');
          }}
          inline={false}
        />
      )}

      {/* Floating Support & Administration Chat Widget */}
      {adminSettings.isAiChatEnabled !== false && (
        <div className="fixed bottom-6 right-6 z-50">
          <motion.button
            onClick={() => setIsAiChatOpen(!isAiChatOpen)}
            className={`relative rounded-full p-4 text-white shadow-2xl transition-all duration-300 cursor-pointer border border-white/20 overflow-hidden ${
              isAiChatOpen 
                ? 'bg-slate-800' 
                : 'bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600'
            }`}
            title={isRtl ? 'المساعد الذكي والدعم الآلي المباشر (24/7)' : 'AI Assistant & Automated Support'}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            animate={isAiChatOpen ? {} : {
              boxShadow: [
                "0 0 0 0px rgba(37, 99, 235, 0.2)",
                "0 0 0 15px rgba(37, 99, 235, 0)",
                "0 0 0 0px rgba(37, 99, 235, 0.2)"
              ],
              scale: [1, 1.05, 1]
            }}
            transition={isAiChatOpen ? {} : {
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              },
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            {/* Animated Halo Ring */}
            {!isAiChatOpen && (
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-blue-400/30"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            
            {isAiChatOpen ? (
              <X className="w-8 h-8 relative z-10" />
            ) : (
              <motion.div 
                className="relative"
                whileHover="hover"
              >
                <Bot className="w-9 h-9 relative z-10" />
                
                {/* Floating Reactions on Hover */}
                <motion.div 
                  className="absolute -top-6 -left-2 text-lg"
                  variants={{
                    hover: { opacity: 1, y: -10, scale: 1.2, transition: { delay: 0.1 } }
                  }}
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                >
                  😊
                </motion.div>
                <motion.div 
                  className="absolute -top-8 left-6 text-lg"
                  variants={{
                    hover: { opacity: 1, y: -15, scale: 1.2, transition: { delay: 0.2 } }
                  }}
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                >
                  ⚡
                </motion.div>
                <motion.div 
                  className="absolute -top-4 -right-6 text-lg"
                  variants={{
                    hover: { opacity: 1, y: -5, scale: 1.2, transition: { delay: 0.3 } }
                  }}
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                >
                  🤖
                </motion.div>

                <motion.div 
                  className="absolute -top-1 -right-1"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </motion.div>
              </motion.div>
            )}
          </motion.button>

          <AnimatePresence>
            {isAiChatOpen && (
              <motion.div 
                className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 z-[9999] w-auto md:w-96 max-w-[calc(100vw-2rem)] shadow-2xl"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <AiSupportChat lang={lang} currentUser={currentUser} settings={adminSettings} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <WelcomeModal
        isOpen={showWelcomeModal}
        lang={lang}
        onClose={() => {
          localStorage.setItem('hasSeenWelcome', 'true');
          setShowWelcomeModal(false);
        }}
        onNavigate={(tab: string) => {
          localStorage.setItem('hasSeenWelcome', 'true');
          setShowWelcomeModal(false);
          setActiveTab(tab as any);
        }}
      />
    </div>
  );
}
