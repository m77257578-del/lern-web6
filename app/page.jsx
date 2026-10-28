/**
 * Next.js Project Structure Identifier:
 * app/page.jsx
 * 
 * Project Identity: ليرن ويب | Lern Web
 * Architecture Framework: Next.js (App Router Layout Structure)
 * Purpose: Root layout routing and state coordinator, bilingual engine, dynamic shade swapping,
 *          PWA installation tracker, marketplace/sandbox conductor, and secret Master Admin portal.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Layers, Play, Video, ShieldCheck, Sun, Moon, 
  Globe, Download, Smartphone, Code2, ArrowUpRight,
  CheckCircle2, Menu, X, Share2, Terminal, Copy, Check, Lock
} from 'lucide-react';

import AppStore from '../components/AppStore';
import SandboxPreview from '../components/SandboxPreview';
import AdminDashboard from '../components/AdminDashboard';
import SecretLoginModal from '../components/SecretLoginModal';
import { translations } from '../src/data/translations';
import { APPS_DATA, WALLET_OPTIONS, MEDIA_RESOURCES } from '../src/data/storeData';
import { storageService, buildWhatsAppUrl } from '../src/services/storageService';

// Uncompressed code blocks catalog for seamless VS Code copying & inspection
const VSCODE_CODE_CATALOG = {
  'app/page.jsx': {
    lang: 'javascript',
    title: 'app/page.jsx (Root layout routing and state coordinator)',
    code: `// Root layout coordinator with secret admin portal, store, sandbox and PWA engine`
  },
  'app/layout.jsx': {
    lang: 'javascript',
    title: 'app/layout.jsx (Bilingual context wrappers, metadata providers, and global font injections)',
    code: `export const metadata = {
  title: 'ليرن ويب | Lern Web - المنظومة التعليمية السحابية المتكاملة',
  description: 'سوق أدوات ومحاكي مراكز تعليمية متطورة مع محرك PWA وترخيص مرن وتملك كامل للكود المصدري.',
  manifest: '/manifest.json',
  icons: { icon: '/icon.svg', apple: '/icon-192.png' },
};`
  },
  'components/AppStore.jsx': {
    lang: 'javascript',
    title: 'components/AppStore.jsx (Custom multi-functional application marketplace engine)',
    code: `// Complete uncompressed implementation deployed in components/AppStore.jsx`
  },
  'components/SandboxPreview.jsx': {
    lang: 'javascript',
    title: 'components/SandboxPreview.jsx (Isolated iframe sandbox container mimicking dynamic center builds)',
    code: `// Complete uncompressed implementation deployed in components/SandboxPreview.jsx`
  },
  'components/AdminDashboard.jsx': {
    lang: 'javascript',
    title: 'components/AdminDashboard.jsx (Master Admin Control Center: Passcode 100100)',
    code: `// Admin dashboard with publish/unpublish toggle, secret file upload, wallet setup, and AI drafts review`
  },
  'public/manifest.json': {
    lang: 'json',
    title: 'public/manifest.json (Progressive Web App Standalone Manifest)',
    code: `{
  "id": "/",
  "name": "ليرن ويب | Lern Web",
  "short_name": "LernWeb",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#090d16",
  "theme_color": "#2563eb"
}`
  },
  'app/sw.js': {
    lang: 'javascript',
    title: 'app/sw.js (Service Worker caching and offline sync engine)',
    code: `// Service worker for offline caching and standalone shell execution`
  }
};

export default function Page() {
  // Bilingual State: 'ar' (RTL default) | 'en' (LTR)
  const [lang, setLang] = useState('ar');
  const t = translations[lang] || translations.ar;
  const isRtl = lang === 'ar';

  // Dynamic Shade Theme: 'dark' | 'light'
  const [theme, setTheme] = useState('dark');

  // Main Navigation Tabs: 'store' | 'sandbox' | 'media' | 'billing' | 'vscode'
  const [activeTab, setActiveTab] = useState('store');

  // Mobile Navigation Drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active Sandbox Configuration for Cross-Component Provisioning
  const [sandboxConfig, setSandboxConfig] = useState(null);

  // Admin Master State (Secret Login with password 100100)
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSecretLoginOpen, setIsSecretLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  // Persistent Projects, Settings, Wallets
  const [projects, setProjects] = useState(() => storageService.getProjects(false));
  const [adminSettings, setAdminSettings] = useState(() => storageService.getSettings());
  const [wallets, setWallets] = useState(() => storageService.getWallets());

  const refreshStorageData = () => {
    const loggedIn = storageService.isAdminLoggedIn();
    setIsAdmin(loggedIn);
    setProjects(storageService.getProjects(loggedIn));
    setAdminSettings(storageService.getSettings());
    setWallets(storageService.getWallets());
  };

  useEffect(() => {
    refreshStorageData();

    // Secret shortcut: Ctrl+Shift+A opens secret admin login
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsSecretLoginOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogoSecretClick = () => {
    setLogoClicks((prev) => {
      if (prev + 1 >= 3) {
        setIsSecretLoginOpen(true);
        return 0;
      }
      return prev + 1;
    });
  };

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  // VS Code Source Code Viewer
  const [activeVsCodeFile, setActiveVsCodeFile] = useState('app/page.jsx');
  const [hasCopiedFile, setHasCopiedFile] = useState(false);

  // Sync HTML tag attributes for RTL and Theme
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [lang, isRtl, theme]);

  // PWA Prompt Detection
  useEffect(() => {
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true;
    setIsInstalled(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handleBeforeInstall = (e) => {
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

  const handleLaunchAppInSandbox = (app) => {
    if (app && app.defaultSandboxConfig) {
      setSandboxConfig({
        centerName: isRtl ? app.titleAr : app.titleEn,
        theme: app.defaultSandboxConfig.theme,
        activeCourse: isRtl ? app.defaultSandboxConfig.activeCourse : app.titleEn,
        bannerText: isRtl ? app.defaultSandboxConfig.bannerText : 'Active runtime deployment configured',
        activeTab: 'courses',
        studentCount: 850,
        tutorName: 'د. ليرن ويب الأكاديمي',
        hasQuiz: app.defaultSandboxConfig.hasQuiz
      });
    }
    setActiveTab('sandbox');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyCode = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy);
    setHasCopiedFile(true);
    setTimeout(() => setHasCopiedFile(false), 2500);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-slate-950 text-slate-100' 
        : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* 0. Secret Master Admin Operational Banner (Active when logged in with 100100) */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 border-b border-blue-400/40 px-4 py-2.5 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm shadow-xl z-50 sticky top-0">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-emerald-500/30 animate-pulse" />
            <span className="font-bold">👑 {isRtl ? 'وضع تحكم المشرف العام نشط (Master Mode)' : 'Master Admin Mode Active'}:</span>
            <span className="text-slate-200 hidden md:inline">{isRtl ? 'لك الصلاحية الكاملة لنشر وحجب المنصات، تعديل طرق الدفع، ورفع الملفات السرية' : 'Full access to publish, manage wallets & private files'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminDashboardOpen(true)}
              className="rounded-xl bg-blue-500 hover:bg-blue-400 px-3.5 py-1.5 font-bold text-white shadow transition"
            >
              {isRtl ? 'فتح لوحة تحكم الإدارة' : 'Open Admin Panel'}
            </button>
            <button
              onClick={() => {
                storageService.logoutAdmin();
                refreshStorageData();
              }}
              className="rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-3 py-1.5 text-white transition"
            >
              {isRtl ? 'خروج من الإدارة' : 'Logout Admin'}
            </button>
          </div>
        </div>
      )}

      {/* 1. Native PWA & App Installation Engine Banner */}
      {!isInstalled && (
        <aside aria-label="PWA install banner" className="relative z-40 border-b border-blue-500/20 bg-gradient-to-r from-blue-950 via-indigo-950 to-blue-900 px-4 py-2.5 text-white shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <Smartphone className="w-4 h-4 text-blue-300" />
              <span className="font-semibold">{t.pwaInstallTitle}:</span>
              <span className="text-slate-300 hidden md:inline">{t.pwaInstallDesc}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 px-3.5 py-1.5 font-bold text-white shadow transition active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.installNow}</span>
              </button>

              {isIOS && (
                <button
                  onClick={() => setShowIOSModal(true)}
                  className="rounded-xl border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs text-white hover:bg-white/20"
                >
                  iPhone Guide
                </button>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* Main Global Navigation Header */}
      <header className={`sticky ${isAdmin ? 'top-10' : 'top-0'} z-30 border-b backdrop-blur-xl transition-colors ${
        theme === 'dark' 
          ? 'border-slate-800/80 bg-slate-950/85' 
          : 'border-slate-200/80 bg-white/85'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand Mark (Triple-click opens secret admin passcode portal) */}
          <div 
            onClick={() => {
              setActiveTab('store');
              handleLogoSecretClick();
            }}
            className="flex items-center gap-3 cursor-pointer group"
            title={isRtl ? 'انقر هنا 3 مرات لفتح بوابة تسجيل دخول الأدمن السري' : 'Click 3 times for Admin Gate'}
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center font-black text-white text-lg">
                LW
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg md:text-xl tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  ليرن ويب
                </span>
                <span className="text-xs font-bold text-blue-400 font-mono">
                  LERN WEB
                </span>
                {isAdmin && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {isRtl ? 'المنظومة السحابية لمراكز المستقبل' : 'Cloud Ecosystem for Tutoring Centers'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 rounded-2xl border border-slate-800 bg-slate-900/60 p-1.5">
            {[
              { id: 'store', label: t.navStore, icon: Layers },
              { id: 'sandbox', label: t.navSandbox, icon: Play },
              { id: 'media', label: t.navMediaDocs, icon: Video },
              { id: 'billing', label: t.navBilling, icon: ShieldCheck },
              { id: 'vscode', label: t.navCodeViewer, icon: Code2 }
            ].map((nav) => {
              const Icon = nav.icon;
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveTab(nav.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs md:text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{nav.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls: WhatsApp, Language, Theme, Prominent Login, Mobile Toggle */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Social WhatsApp Quick Button */}
            {adminSettings.targetWhatsAppNumber && (
              <a
                href={buildWhatsAppUrl(adminSettings.targetWhatsAppNumber, isRtl ? 'مرحباً، أود الاستفسار عن منصات ليرن ويب التعليمية' : 'Hello, I have an inquiry about Lern Web platforms')}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition shadow-sm"
                title={isRtl ? 'تواصل معنا عبر واتساب' : 'WhatsApp Contact'}
              >
                <span>💬 {isRtl ? 'واتساب' : 'WhatsApp'}</span>
              </a>
            )}

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-200 hover:border-slate-700 transition"
              title={t.langToggle}
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* Dynamic Shade Theme Switcher */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:text-white hover:border-slate-700 transition"
              title={t.themeToggle}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* PROMINENT LOGIN BUTTON (Explicit user request for clear, visible login) */}
            <button
              onClick={() => {
                if (isAdmin) {
                  setIsAdminDashboardOpen(true);
                } else {
                  setIsSecretLoginOpen(true);
                }
              }}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs md:text-sm font-bold transition shadow-sm ${
                isAdmin 
                  ? 'border border-emerald-500/60 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 ring-2 ring-emerald-500/20' 
                  : 'border border-blue-500/50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/30 active:scale-95'
              }`}
              title={isAdmin ? (isRtl ? 'لوحة تحكم المشرف' : 'Admin Panel') : (isRtl ? 'تسجيل دخول المشرف والسنتر (100100)' : 'Admin Login (100100)')}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAdmin ? (isRtl ? 'لوحة الإدارة 👑' : 'Admin Panel 👑') : (isRtl ? 'تسجيل الدخول' : 'Sign In')}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3 animate-fadeIn">
            {/* Prominent Login Option in Mobile Drawer */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (isAdmin) {
                  setIsAdminDashboardOpen(true);
                } else {
                  setIsSecretLoginOpen(true);
                }
              }}
              className={`w-full flex items-center justify-center gap-2.5 rounded-xl py-3 text-sm font-bold shadow-md transition ${
                isAdmin
                  ? 'border border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{isAdmin ? (isRtl ? 'لوحة تحكم الإدارة (الأدمن)' : 'Admin Control Panel') : (isRtl ? 'تسجيل الدخول كمسؤول' : 'Sign In / Admin Login')}</span>
            </button>

            {adminSettings.targetWhatsAppNumber && (
              <a
                href={buildWhatsAppUrl(adminSettings.targetWhatsAppNumber, isRtl ? 'مرحباً، أود الاستفسار عن منصات ليرن ويب التعليمية' : 'Hello, I have an inquiry about Lern Web platforms')}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-2.5 text-xs font-bold text-emerald-400"
              >
                <span>💬 {isRtl ? 'تواصل معنا عبر واتساب' : 'Contact via WhatsApp'}</span>
              </a>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <button
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-slate-200"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
              </button>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              {[
                { id: 'store', label: t.navStore, icon: Layers },
                { id: 'sandbox', label: t.navSandbox, icon: Play },
                { id: 'media', label: t.navMediaDocs, icon: Video },
                { id: 'billing', label: t.navBilling, icon: ShieldCheck },
                { id: 'vscode', label: t.navCodeViewer, icon: Code2 }
              ].map((nav) => {
                const Icon = nav.icon;
                const isActive = activeTab === nav.id;
                return (
                  <button
                    key={nav.id}
                    onClick={() => {
                      setActiveTab(nav.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{nav.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Container Views */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {activeTab === 'store' && (
          <AppStore 
            apps={projects} 
            lang={lang} 
            t={t}
            isAdmin={isAdmin}
            targetWhatsAppNumber={adminSettings.targetWhatsAppNumber}
            onOpenAdminPortal={() => setIsAdminDashboardOpen(true)}
            onLaunchSandbox={handleLaunchAppInSandbox}
          />
        )}

        {activeTab === 'sandbox' && (
          <SandboxPreview 
            lang={lang} 
            t={t}
            initialConfig={sandboxConfig}
            wallets={wallets}
            targetWhatsAppNumber={adminSettings.targetWhatsAppNumber}
            mediaResources={MEDIA_RESOURCES}
          />
        )}

        {activeTab === 'media' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-black text-white">{t.mediaTitle}</h2>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl">{t.mediaSubtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MEDIA_RESOURCES.map((item) => (
                <div key={item.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-blue-400">
                    <span className="rounded-md bg-blue-500/10 px-2 py-1 uppercase">{item.type}</span>
                    <span>{item.duration}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{isRtl ? item.titleAr : item.titleEn}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{isRtl ? item.summaryAr : item.summaryEn}</p>
                  <button 
                    onClick={() => {
                      setActiveTab('sandbox');
                    }}
                    className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300"
                  >
                    <span>{isRtl ? 'عرض الفيديو والتطبيق في المحاكي' : 'Stream in Sandbox Emulator'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-2xl md:text-4xl font-black text-white">{t.billingTitle}</h2>
              <p className="text-slate-400 text-sm md:text-base">{t.billingSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  id: 'monthly',
                  title: isRtl ? 'اشتراك إيجار شهري' : 'Monthly Rental',
                  price: '950 ج.م / $29',
                  period: isRtl ? 'شهرياً' : 'per month',
                  features: isRtl ? ['استضافة سحابية سريعة', 'دعم فني وتحديثات مستمرة', 'بوابة الدفع الإلكترونية'] : ['Cloud hosting', 'Technical support', 'Payment gateway']
                },
                {
                  id: 'annual',
                  title: isRtl ? 'ترخيص سنوي مخفض' : 'Annual Rental License',
                  price: '8,500 ج.م / $249',
                  period: isRtl ? 'سنوياً' : 'per year',
                  badge: isRtl ? 'الأكثر طلباً' : 'Popular',
                  features: isRtl ? ['خصم 25% مقارنة بالشهري', 'اسم نطاق خاص مجاناً (Domain)', 'تدريب كامل لسكرتارية السنتر'] : ['25% discount', 'Custom domain', 'Staff training']
                },
                {
                  id: 'outright',
                  title: isRtl ? 'شراء وتملك الكود كاملاً' : 'Full Outright Purchase',
                  price: '27,000 ج.م / $799',
                  period: isRtl ? 'دفعة واحدة للأبد' : 'one-time lifetime',
                  features: isRtl ? ['تسليم السورس كود كاملاً (Next.js)', 'حقوق التعديل والنشر بدون قيود', 'دليل النشر على Vercel و VPS'] : ['Full source code', 'Unlimited rights', 'Self-hosting guide']
                }
              ].map((plan) => (
                <div key={plan.id} className="relative rounded-3xl border border-slate-800 bg-slate-900/90 p-8 flex flex-col justify-between space-y-6">
                  {plan.badge && (
                    <span className="absolute top-4 right-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                      {plan.badge}
                    </span>
                  )}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">{plan.title}</h3>
                    <div>
                      <span className="text-2xl md:text-3xl font-black text-white">{plan.price}</span>
                      <span className="text-xs text-slate-400 block mt-1">{plan.period}</span>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-300">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={`https://wa.me/${adminSettings.targetWhatsAppNumber}?text=${encodeURIComponent(
                      isRtl 
                        ? `مرحباً، أود الاستفسار والاشتراك في باقة: *${plan.title}* (${plan.price}) عبر منصة ليرن ويب.`
                        : `Hello, I want to subscribe to *${plan.title}* (${plan.price}) from Lern Web.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-sm font-bold text-white transition shadow-lg shadow-emerald-600/25"
                  >
                    <span>{isRtl ? 'طلب الباقة وتأكيد الدفع عبر واتساب' : 'Order Plan via WhatsApp'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'vscode' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-white">{t.vscodeHeader}</h2>
              <p className="text-slate-400 text-sm md:text-base">{t.vscodeSubtitle}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {Object.keys(VSCODE_CODE_CATALOG).map((filePath) => (
                <button
                  key={filePath}
                  onClick={() => setActiveVsCodeFile(filePath)}
                  className={`rounded-xl px-4 py-2 text-xs font-mono font-medium transition ${
                    activeVsCodeFile === filePath 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {filePath}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 md:p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
                <span className="font-mono text-blue-400">{VSCODE_CODE_CATALOG[activeVsCodeFile]?.title}</span>
                <button
                  onClick={() => handleCopyCode(VSCODE_CODE_CATALOG[activeVsCodeFile]?.code || '')}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:text-white"
                >
                  {hasCopiedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{hasCopiedFile ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ الكود' : 'Copy Code')}</span>
                </button>
              </div>
              <pre dir="ltr" className="text-left font-mono text-xs md:text-sm text-slate-300 overflow-x-auto p-2 bg-slate-900/50 rounded-xl leading-relaxed">
                <code>{VSCODE_CODE_CATALOG[activeVsCodeFile]?.code}</code>
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* Secret Admin Login Modal (password 100100) */}
      <SecretLoginModal
        isOpen={isSecretLoginOpen}
        onClose={() => setIsSecretLoginOpen(false)}
        lang={lang}
        onLoginSuccess={() => {
          refreshStorageData();
          setIsAdminDashboardOpen(true);
        }}
      />

      {/* Admin Dashboard Master Center */}
      {isAdminDashboardOpen && (
        <AdminDashboard
          lang={lang}
          onClose={() => {
            setIsAdminDashboardOpen(false);
            refreshStorageData();
          }}
          onRefreshData={refreshStorageData}
          onOpenSandboxWithConfig={(config) => {
            setSandboxConfig(config);
            setIsAdminDashboardOpen(false);
            setActiveTab('sandbox');
          }}
        />
      )}

      {/* Global Footer with Social Links & Discreet Admin Trigger */}
      <footer className="mt-20 border-t border-slate-900 bg-slate-950 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-right">
              <span className="font-bold text-white text-sm">ليرن ويب | Lern Web</span>
              <p className="text-slate-500">المنظومة السحابية المتكاملة للمراكز التعليمية والسناتر</p>
            </div>

            {/* Configured Social Media Links */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {(adminSettings.socialLinks.whatsapp || adminSettings.targetWhatsAppNumber) && (
                <a href={buildWhatsAppUrl(adminSettings.targetWhatsAppNumber || adminSettings.socialLinks.whatsapp)} target="_blank" rel="noreferrer" className="rounded-lg bg-slate-900 p-2 text-slate-300 hover:text-emerald-400">
                  WhatsApp
                </a>
              )}
              {adminSettings.socialLinks.facebook && (
                <a href={adminSettings.socialLinks.facebook} target="_blank" rel="noreferrer" className="rounded-lg bg-slate-900 p-2 text-slate-300 hover:text-blue-400">
                  Facebook
                </a>
              )}
              {adminSettings.socialLinks.telegram && (
                <a href={adminSettings.socialLinks.telegram} target="_blank" rel="noreferrer" className="rounded-lg bg-slate-900 p-2 text-slate-300 hover:text-sky-400">
                  Telegram
                </a>
              )}
              {adminSettings.socialLinks.youtube && (
                <a href={adminSettings.socialLinks.youtube} target="_blank" rel="noreferrer" className="rounded-lg bg-slate-900 p-2 text-slate-300 hover:text-red-400">
                  YouTube
                </a>
              )}
              {adminSettings.socialLinks.tiktok && (
                <a href={adminSettings.socialLinks.tiktok} target="_blank" rel="noreferrer" className="rounded-lg bg-slate-900 p-2 text-slate-300 hover:text-pink-400">
                  TikTok
                </a>
              )}
              {adminSettings.socialLinks.instagram && (
                <a href={adminSettings.socialLinks.instagram} target="_blank" rel="noreferrer" className="rounded-lg bg-slate-900 p-2 text-slate-300 hover:text-purple-400">
                  Instagram
                </a>
              )}
              {adminSettings.socialLinks.twitter && (
                <a href={adminSettings.socialLinks.twitter} target="_blank" rel="noreferrer" className="rounded-lg bg-slate-900 p-2 text-slate-300 hover:text-slate-100">
                  X
                </a>
              )}
            </div>

            {/* Secret Admin Entry in Footer */}
            <button
              onClick={() => {
                if (isAdmin) {
                  setIsAdminDashboardOpen(true);
                } else {
                  setIsSecretLoginOpen(true);
                }
              }}
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-400 transition"
              title="Admin Access"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'لوحة تحكم المشرف' : 'دخول الإدارة'}</span>
            </button>
          </div>

          <div className="text-center text-slate-600 border-t border-slate-900 pt-6">
            © {new Date().getFullYear()} ليرن ويب (Lern Web). جميع الحقوق محفوظة. ترخيص تشغيل وتملك سحابي.
          </div>
        </div>
      </footer>
    </div>
  );
}
