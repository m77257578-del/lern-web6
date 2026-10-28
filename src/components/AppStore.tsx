/**
 * Project Identity: ليرن ويب | Lern Web
 * Purpose: Custom multi-functional application marketplace engine with Error Boundary protection.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Download, ExternalLink, Play, Star, Shield, Cpu, 
  Sparkles, CheckCircle2, ChevronRight, Layers, Smartphone, 
  Terminal, BarChart3, QrCode, ArrowUpRight, BookOpen, Filter, X, MessageSquare, Send, Check,
  Clock, Trash2, History, Share2, CreditCard
} from 'lucide-react';
import { storageService, buildWhatsAppUrl } from '../services/storageService';
import FaqSection from '../../components/FaqSection';
import TemplateGallery from '../../components/TemplateGallery';
import TemplateImageSlider from '../../components/TemplateImageSlider';
import SectionMediaShowcase from './SectionMediaShowcase';
import { SectionCardSkeleton } from '../../components/GlobalSkeletonLoader';
import ProjectPurchaseModal from './ProjectPurchaseModal';
import { APPS_DATA } from '../data/storeData';

class AppStoreErrorBoundary extends React.Component<{ children: React.ReactNode; lang: string }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("AppStore Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const isRtl = this.props.lang === 'ar';
      return (
        <div className="rounded-3xl border border-rose-500/40 bg-slate-900/95 p-8 md:p-12 text-center space-y-4 shadow-2xl animate-fadeIn my-8">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
            <X className="w-8 h-8" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white">
            {isRtl ? 'عفواً، حدث خطأ مؤقت أثناء تحميل سوق المنظومات' : 'Oops, temporary error loading App Store'}
          </h3>
          <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto">
            {isRtl ? 'يرجى المحاولة مرة أخرى أو إعادة تحديث الصفحة للاستمرار.' : 'Please try again or refresh the page.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs md:text-sm transition shadow-lg cursor-pointer"
          >
            {isRtl ? 'إعادة تحميل الصفحة' : 'Reload Page'}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

interface AppStoreProps {
  apps?: any[];
  lang?: 'ar' | 'en';
  t?: any;
  onLaunchSandbox?: (app: any) => void;
  onSelectAppForDeploy?: (app: any) => void;
  isAdmin?: boolean;
  isUserLoggedIn?: boolean;
  adminSettings?: any;
  onOpenLogin?: () => void;
  onOpenAdminPortal?: () => void;
  showToast?: (msg: string, type?: 'success' | 'error') => void;
}

function AppStoreContent({ 
  apps = [], 
  lang = 'ar', 
  t, 
  onLaunchSandbox, 
  onSelectAppForDeploy = (_app) => {},
  isAdmin = false,
  isUserLoggedIn = false,
  adminSettings,
  onOpenLogin = () => {},
  onOpenAdminPortal = () => {},
  showToast
}: AppStoreProps) {
  const isRtl = lang === 'ar';
  const appsList = (Array.isArray(apps) && apps.length > 0) ? apps : APPS_DATA;
  const targetWhatsAppNumber = adminSettings?.targetWhatsAppNumber || '201024889921';
  const [storeSubTab, setStoreSubTab] = useState<'marketplace' | 'gallery'>('marketplace');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalApp, setActiveModalApp] = useState<any>(null);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [embeddedPreviewUrl, setEmbeddedPreviewUrl] = useState<string | null>(null);
  const [previewDeviceMode, setPreviewDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [exportSuccessId, setExportSuccessId] = useState<string | null>(null);
  const [purchaseModalProject, setPurchaseModalProject] = useState<any>(null);
  const [purchaseModalTemplate, setPurchaseModalTemplate] = useState<any>(null);
  const [purchaseModalInitialPlan, setPurchaseModalInitialPlan] = useState('annual');

  const handleShare = async (app: any) => {
    const title = isRtl ? (app.titleAr || app.title) : (app.titleEn || app.title);
    const url = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out ${title} on Lern Web!`,
          url: url
        });
      } catch {
        navigator.clipboard.writeText(url);
        if (showToast) showToast(isRtl ? 'تم نسخ الرابط!' : 'Link copied!', 'success');
      }
    } else {
      navigator.clipboard.writeText(url);
      if (showToast) showToast(isRtl ? 'تم نسخ الرابط!' : 'Link copied!', 'success');
    }
  };

  const handleExportProjectJson = (appToExport: any) => {
    if (!appToExport) return;

    const exportData = {
      exportVersion: '1.0',
      exportedAt: new Date().toISOString(),
      project: {
        id: appToExport.id,
        category: appToExport.category,
        titleAr: appToExport.titleAr || '',
        titleEn: appToExport.titleEn || '',
        badgeAr: appToExport.badgeAr || '',
        badgeEn: appToExport.badgeEn || '',
        taglineAr: appToExport.taglineAr || '',
        taglineEn: appToExport.taglineEn || '',
        descriptionAr: appToExport.descriptionAr || '',
        descriptionEn: appToExport.descriptionEn || '',
        version: appToExport.version || '1.0.0',
        developer: appToExport.developer || '',
        rating: appToExport.rating || 5,
        reviewsCount: appToExport.reviewsCount || 0,
        accentColor: appToExport.accentColor || '#2563eb',
        isPublished: appToExport.isPublished ?? true,
        featuresAr: appToExport.featuresAr || [],
        featuresEn: appToExport.featuresEn || [],
        techStack: appToExport.techStack || [],
        screenshots: appToExport.screenshots || [],
        sandboxConfig: appToExport.sandboxConfig || {}
      }
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = `${appToExport.id}_config_backup.json`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    storageService.addActivityLog(
      'settings_updated',
      `تصدير ملف النسخة الاحتياطية JSON للمشروع: ${appToExport.titleAr || appToExport.id}`,
      `Exported JSON Config Backup for Project: ${appToExport.titleEn || appToExport.id}`,
      `تم تصدير وحفظ الملف (${filename}) محلياً.`,
      `Successfully exported and saved file (${filename}) locally.`
    );

    setExportSuccessId(appToExport.id);
    setTimeout(() => setExportSuccessId(null), 3000);
  };

  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
  const [reviewsList, setReviewsList] = useState(() => storageService.getReviews());
  const [recentSearches, setRecentSearches] = useState(() => storageService.getRecentSearches());
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSaveSearchQuery = (queryToSave: string) => {
    if (!queryToSave || !queryToSave.trim()) return;
    const updated = storageService.addRecentSearch(queryToSave);
    setRecentSearches(updated);
  };

  const handleSelectRecentSearch = (query: string) => {
    setSearchQuery(query);
    handleSaveSearchQuery(query);
    setIsSearchFocused(false);
  };

  const handleRemoveRecentSearch = (e: React.MouseEvent, queryToRemove: string) => {
    e.stopPropagation();
    const updated = storageService.removeRecentSearch(queryToRemove);
    setRecentSearches(updated);
  };

  const handleClearAllRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    storageService.clearRecentSearches();
    setRecentSearches([]);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleSaveSearchQuery(searchQuery);
      setIsSearchFocused(false);
    }
  };

  const visibleApps = isAdmin ? appsList : appsList.filter((app: any) => app.isPublished !== false);

  const filteredApps = visibleApps.filter((app: any) => {
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    const matchesType = selectedType === 'all' || 
      (selectedType === 'cloud' && (app.techStack?.some((ts: string) => ts.toLowerCase().includes('edge') || ts.toLowerCase().includes('cloud') || ts.toLowerCase().includes('next.js')))) ||
      (selectedType === 'simulator' && (app.screenshots?.some((s: any) => s.mockupType) || app.defaultSandboxConfig)) ||
      (selectedType === 'educational' && (app.category === 'lms' || app.category === 'stem' || app.category === 'ai'));

    const title = isRtl ? (app.titleAr || app.title || '') : (app.titleEn || app.title || '');
    const tagline = isRtl ? (app.taglineAr || '') : (app.taglineEn || '');
    const desc = isRtl ? (app.descriptionAr || '') : (app.descriptionEn || '');
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || 
                          title.toLowerCase().includes(q) || 
                          tagline.toLowerCase().includes(q) ||
                          desc.toLowerCase().includes(q) ||
                          (app.developer || '').toLowerCase().includes(q);
    return matchesCategory && matchesType && matchesSearch;
  });

  const handleReviewSubmit = (e: React.FormEvent, projectId: string, projectTitle: string) => {
    e.preventDefault();
    if (!isUserLoggedIn && !isAdmin) {
      onOpenLogin();
      return;
    }
    if (!userComment.trim()) return;

    const currentUser = storageService.getCurrentUser();
    const newReview = {
      id: 'rev-' + Date.now(),
      projectId,
      projectTitle,
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || (isRtl ? 'زائر مسجل' : 'Registered Client'),
      userPhone: currentUser?.phone || '',
      rating: userRating,
      comment: userComment.trim(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    storageService.addReview(newReview);
    setReviewsList(storageService.getReviews());
    setUserComment('');
    setUserRating(5);
    setReviewSuccessMsg(isRtl ? 'تم إضافة تقييمك بنجاح! شكرًا لمشاركتك.' : 'Review submitted successfully!');
    setTimeout(() => setReviewSuccessMsg(''), 3500);
  };

  const categoriesList = [
    { id: 'all', label: t?.categories?.all || 'الكل' },
    { id: 'ecommerce', label: t?.categories?.ecommerce || 'المتاجر الإلكترونية' },
    { id: 'corporate', label: t?.categories?.corporate || 'مواقع الشركات' },
    { id: 'saas_ai', label: t?.categories?.saas_ai || 'خدمات SaaS والذكاء الاصطناعي' },
    { id: 'real_estate', label: t?.categories?.real_estate || 'العقارات والإنشاءات' },
    { id: 'medical', label: t?.categories?.medical || 'العيادات والمراكز الطبية' },
    { id: 'hospitality', label: t?.categories?.hospitality || 'المطاعم والفنادق' },
    { id: 'news_media', label: t?.categories?.news_media || 'الأخبار والمدونات' },
    { id: 'lms_edu', label: t?.categories?.lms_edu || 'المنصات التعليمية' },
    { id: 'lms', label: t?.categories?.lms || 'إدارة السناتر' },
    { id: 'stem', label: t?.categories?.stem || 'معامل STEM' },
    { id: 'ai', label: t?.categories?.ai || 'الذكاء الاصطناعي' },
    { id: 'operations', label: t?.categories?.operations || 'إدارة التشغيل' }
  ];

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Marketplace Catalog Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 md:p-8 rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/20 shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-400">
            <Layers className="w-3.5 h-3.5" />
            <span>{isRtl ? 'سوق المنظومات والأدوات' : 'Platform & Tool Store'}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white">
            {isRtl ? 'استكشف واطلب المنظومات الجاهزة' : 'Explore & Provision Ready Platforms'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {isRtl 
              ? 'اختر من بين منظومات إدارة المراكز، الاختبارات الذكية، والمتاجر مع إمكانية التشغيل في المحاكي.'
              : 'Choose from certified educational management systems, smart assessment suites, and web applications.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={buildWhatsAppUrl(targetWhatsAppNumber, isRtl ? 'أريد الاستفسار عن منظومات المتجر' : 'I want to inquire about store platforms')}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs md:text-sm hover:bg-white/10 transition-colors flex items-center gap-2 backdrop-blur-md"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>{isRtl ? 'طلب مشروع مخصص' : 'Custom Request'}</span>
          </a>
        </div>
      </div>

      {/* Marketplace vs Template Gallery SubTab Navigation */}
      <div className="flex items-center justify-center pt-2">
        <div className="inline-flex items-center p-1.5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl gap-2">
          <button
            type="button"
            onClick={() => setStoreSubTab('marketplace')}
            style={storeSubTab === 'marketplace' ? { backgroundColor: adminSettings?.primaryColor || '#2563eb' } : {}}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs md:text-sm font-bold transition-all cursor-pointer ${
              storeSubTab === 'marketplace'
                ? 'text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isRtl ? 'سوق الأدوات والمنصات' : 'Marketplace Apps'}</span>
          </button>

          <button
            type="button"
            onClick={() => setStoreSubTab('gallery')}
            style={storeSubTab === 'gallery' ? { backgroundColor: adminSettings?.primaryColor || '#8b5cf6' } : {}}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs md:text-sm font-bold transition-all cursor-pointer ${
              storeSubTab === 'gallery'
                ? 'text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{isRtl ? 'معرض القوالب الجاهزة (Template Gallery)' : 'Template Gallery'}</span>
          </button>
        </div>
      </div>

      {storeSubTab === 'gallery' ? (
        <TemplateGallery 
          lang={lang} 
          t={t} 
          onSelectTemplate={(tplConfig: any) => {
            if (!isUserLoggedIn && !isAdmin) {
              if (showToast) showToast(isRtl ? 'يرجى تسجيل الدخول أولاً لتشغيل القالب في المحاكي' : 'Please log in first to launch template', 'error');
              onOpenLogin();
              return;
            }
            if (onLaunchSandbox) onLaunchSandbox(tplConfig);
          }} 
          adminSettings={adminSettings} 
        />
      ) : (
        <>
          {/* Search & Dynamic Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div ref={searchContainerRef} className="relative flex-1 max-w-xl">
              <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${isRtl ? 'right-4' : 'left-4'}`} />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={t?.searchPlaceholder || 'بحث في المنظومات...'}
                className={`w-full rounded-2xl border border-slate-800 bg-slate-900/90 py-3.5 text-sm md:text-base text-slate-100 placeholder-slate-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${isRtl ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'}`}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white ${isRtl ? 'left-3' : 'right-3'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {isSearchFocused && recentSearches.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-slate-800 bg-slate-950/95 backdrop-blur-xl shadow-2xl p-2.5 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-slate-800/80 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 font-bold text-slate-300">
                      <History className="w-3.5 h-3.5 text-blue-400" />
                      <span>{isRtl ? 'عمليات البحث الأخيرة' : 'Recent Searches'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearAllRecentSearches}
                      className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 hover:underline transition cursor-pointer"
                    >
                      {isRtl ? 'مسح الكل' : 'Clear All'}
                    </button>
                  </div>

                  <div className="space-y-1">
                    {recentSearches.map((query: string, index: number) => (
                      <div
                        key={index}
                        onClick={() => handleSelectRecentSearch(query)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-900 cursor-pointer text-xs md:text-sm text-slate-200 transition group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Clock className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0 transition-colors" />
                          <span className="truncate font-medium">{query}</span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleRemoveRecentSearch(e, query)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={selectedCategory === cat.id ? { backgroundColor: adminSettings?.primaryColor || '#2563eb' } : {}}
                  className={`rounded-xl px-4 py-2.5 text-xs md:text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'text-white shadow-lg ring-2 ring-blue-500/40'
                      : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project Type Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-3 pb-2 border-t border-slate-800/80">
            <span className="text-sm font-bold text-slate-300">
              {isRtl ? 'فرز حسب النوع:' : 'Filter by Type:'}
            </span>
            {[
              { id: 'all', labelAr: 'الكل', labelEn: 'All Types', icon: Layers },
              { id: 'cloud', labelAr: '☁️ سحابي', labelEn: '☁️ Cloud', icon: Cpu },
              { id: 'simulator', labelAr: '🎮 محاكي', labelEn: '🎮 Simulator', icon: Play },
              { id: 'educational', labelAr: '📚 تعليمي', labelEn: '📚 Educational', icon: BookOpen }
            ].map((typ) => {
              const Icon = typ.icon;
              return (
                <button
                  key={typ.id}
                  onClick={() => setSelectedType(typ.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all border ${
                    selectedType === typ.id
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {isRtl ? typ.labelAr : typ.labelEn}
                </button>
              );
            })}
          </div>

          <SectionMediaShowcase targetSection="store" lang={lang} />

          {filteredApps.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-10 md:p-16 text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {isRtl ? 'لا توجد منصات منشورة حالياً بهذه المعايير' : 'No platforms match current criteria'}
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {filteredApps.map((app: any) => {
                const title = isRtl ? app.titleAr : app.titleEn;
                const badge = isRtl ? app.badgeAr : app.badgeEn;
                const tagline = isRtl ? app.taglineAr : app.taglineEn;
                const description = isRtl ? app.descriptionAr : app.descriptionEn;
                
                const appRevs = reviewsList.filter((r: any) => r.projectId === app.id);
                const currentAvg = appRevs.length > 0
                  ? (appRevs.reduce((acc: number, r: any) => acc + r.rating, 0) / appRevs.length).toFixed(1)
                  : app.rating;
                const currentCount = (app.reviewsCount || 0) + appRevs.length;

                return (
                  <div 
                    key={app.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 transition-all duration-300 hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-900/20"
                  >
                    <div className="h-1.5 w-full transition-all duration-300" style={{ backgroundColor: app.accentColor }} />

                    <div className="p-6 md:p-8 space-y-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span 
                                className="inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white"
                                style={{ backgroundColor: app.accentColor }}
                              >
                                {badge}
                              </span>
                              <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-300">
                                {app.version}
                              </span>

                              {isAdmin && (
                                <div className="flex items-center gap-1.5">
                                  <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                                    app.isPublished 
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  }`}>
                                    {app.isPublished ? (isRtl ? 'منشور للزوار' : 'Published') : (isRtl ? 'مخفي' : 'Hidden')}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleExportProjectJson(app);
                                    }}
                                    className="rounded-md bg-blue-500/20 border border-blue-500/40 hover:bg-blue-500/30 px-2 py-0.5 text-[11px] font-bold text-blue-300 flex items-center gap-1 transition active:scale-95 cursor-pointer"
                                  >
                                    <Download className="w-3 h-3 text-blue-400" />
                                    <span>{exportSuccessId === app.id ? (isRtl ? 'تم التصدير ✓' : 'Exported ✓') : (isRtl ? 'تصدير JSON' : 'Export JSON')}</span>
                                  </button>
                                </div>
                              )}

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShare(app);
                                }}
                                className="rounded-md bg-slate-800 border border-slate-700 hover:bg-slate-700 px-2 py-0.5 text-[11px] font-bold text-slate-300 flex items-center gap-1 transition active:scale-95 cursor-pointer"
                              >
                                <Share2 className="w-3 h-3 text-blue-400" />
                                <span>{isRtl ? 'مشاركة' : 'Share'}</span>
                              </button>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                              {title}
                            </h3>
                          </div>
                        </div>

                        <p className="text-sm md:text-base font-medium text-slate-200">
                          {tagline}
                        </p>

                        <p className="text-xs md:text-sm text-slate-400 leading-relaxed line-clamp-3">
                          {description}
                        </p>

                        <div className="space-y-2 pt-2">
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                            {isRtl ? 'معاينة الواجهات التفاعلية:' : 'Visual Asset Showcase:'}
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            {app.screenshots?.map((screen: any, idx: number) => (
                              <div
                                key={idx}
                                className={`relative h-20 rounded-xl bg-gradient-to-br ${screen.bgGradient || 'from-slate-800 to-slate-900'} p-2 border border-slate-800 flex flex-col justify-between overflow-hidden shadow-inner cursor-pointer hover:opacity-90 transition`}
                                onClick={() => {
                                  if (!isUserLoggedIn && !isAdmin) {
                                    if (showToast) showToast(isRtl ? 'يرجى تسجيل الدخول أولاً' : 'Please log in first', 'error');
                                    onOpenLogin();
                                    return;
                                  }
                                  setActiveModalApp(app);
                                }}
                              >
                                <div className="flex justify-between items-center text-slate-300">
                                  <span className="text-[10px] font-mono text-slate-400">#{idx + 1}</span>
                                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                                </div>
                                <span className="text-[10px] font-medium text-slate-200 truncate">
                                  {isRtl ? screen.titleAr : screen.titleEn}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                          {(isRtl ? app.featuresAr : app.featuresEn)?.slice(0, 3).map((feat: string, fIdx: number) => (
                            <div key={fIdx} className="flex items-center gap-2 text-xs md:text-sm text-slate-300">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>

                        <div 
                          onClick={() => setActiveModalApp(app)}
                          className="flex items-center gap-1.5 rounded-xl bg-slate-800/40 px-3 py-2 text-xs font-bold text-amber-400 border border-slate-700/40 w-fit cursor-pointer hover:bg-slate-800 transition"
                        >
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3.5 h-3.5 ${i < Math.floor(Number(currentAvg)) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} 
                              />
                            ))}
                          </div>
                          <span>{currentAvg}</span>
                          <span className="text-slate-500 font-normal">({currentCount} {isRtl ? 'تقييم' : 'reviews'})</span>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-800/80 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <button
                            onClick={() => {
                              if (!isUserLoggedIn && !isAdmin) {
                                if (showToast) showToast(isRtl ? 'يرجى تسجيل الدخول أولاً' : 'Please log in first', 'error');
                                onOpenLogin();
                                return;
                              }
                              const previewUrl = app.previewUrl || app.distributionLink || 'https://vercel.app';
                              setEmbeddedPreviewUrl(previewUrl);
                            }}
                            className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-500/50 bg-blue-600/15 hover:bg-blue-600 px-3 py-2.5 text-xs font-bold text-blue-400 hover:text-white transition-all shadow cursor-pointer active:scale-95"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{isRtl ? 'معاينة داخل التطبيق' : 'Live Preview'}</span>
                          </button>

                          <button
                            onClick={() => {
                              if (!isUserLoggedIn && !isAdmin) {
                                if (showToast) showToast(isRtl ? 'يرجى تسجيل الدخول أولاً' : 'Please log in first', 'error');
                                onOpenLogin();
                                return;
                              }
                              if (onLaunchSandbox) onLaunchSandbox(app);
                            }}
                            style={{ backgroundColor: adminSettings?.primaryColor || '#2563eb' }}
                            className="flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all active:scale-[0.98]"
                          >
                            <Cpu className="w-3.5 h-3.5" />
                            <span>{t?.launchInSandbox || 'المحاكي'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (!isUserLoggedIn && !isAdmin) {
                                if (showToast) showToast(isRtl ? 'يرجى تسجيل الدخول أولاً لإتمام طلب المنصة والدفع' : 'Please log in first', 'error');
                                onOpenLogin();
                                return;
                              }
                              setPurchaseModalProject(app);
                              setPurchaseModalTemplate(app.templates?.[0] || null);
                              setPurchaseModalInitialPlan('annual');
                            }}
                            className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/50 bg-emerald-600/15 hover:bg-emerald-600 px-3 py-2.5 text-xs font-bold text-emerald-400 hover:text-white transition-all shadow cursor-pointer active:scale-95"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{isRtl ? 'طلب ودفع' : 'Order & Pay'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeModalApp && (() => {
            const templates = activeModalApp.templates || [];
            const curTemplate = templates[selectedTemplateIndex] || null;
            const displayFeatures = curTemplate ? (isRtl ? curTemplate.featuresAr : curTemplate.featuresEn) : (isRtl ? activeModalApp.featuresAr : activeModalApp.featuresEn);
            const displayImages = curTemplate?.images?.length ? curTemplate.images : (activeModalApp.screenshots?.map((s: any) => s.imageUrl || '/homepage_view.png') || []);
            const displayPreviewUrl = curTemplate?.previewUrl || activeModalApp.previewUrl || activeModalApp.distributionLink;

            return (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
                <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 shadow-2xl text-slate-100 space-y-6">
                  
                  <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span 
                          className="inline-block rounded-md px-2.5 py-0.5 text-xs font-bold text-white"
                          style={{ backgroundColor: activeModalApp.accentColor }}
                        >
                          {isRtl ? activeModalApp.badgeAr : activeModalApp.badgeEn}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{activeModalApp.version}</span>
                      </div>

                      <h2 className="text-2xl md:text-3xl font-black text-white">
                        {isRtl ? activeModalApp.titleAr : activeModalApp.titleEn}
                      </h2>
                    </div>

                    <button
                      onClick={() => setActiveModalApp(null)}
                      className="rounded-xl border border-slate-800 bg-slate-800/80 p-2 text-slate-400 hover:text-white transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {templates.length > 0 && (
                    <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950 p-3">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-1">
                        <span>{isRtl ? 'اختر قالب المشروع المطلوب لمشاهدة معاينته:' : 'Select Template Variant:'}</span>
                        <span className="text-blue-400 font-mono">#{selectedTemplateIndex + 1} of {templates.length}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {templates.map((tmpl: any, idx: number) => (
                          <button
                            key={tmpl.id || idx}
                            onClick={() => setSelectedTemplateIndex(idx)}
                            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                              selectedTemplateIndex === idx 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span>{isRtl ? tmpl.nameAr : tmpl.nameEn}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {curTemplate ? (isRtl ? curTemplate.nameAr : curTemplate.nameEn) : (isRtl ? activeModalApp.titleAr : activeModalApp.titleEn)}
                        </h3>
                      </div>

                      {displayPreviewUrl && (
                        <button
                          onClick={() => {
                            if (!isUserLoggedIn && !isAdmin) {
                              if (showToast) showToast(isRtl ? 'يرجى تسجيل الدخول أولاً' : 'Please log in first', 'error');
                              onOpenLogin();
                              return;
                            }
                            setEmbeddedPreviewUrl(displayPreviewUrl);
                          }}
                          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 px-5 py-2.5 text-xs md:text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition active:scale-95 cursor-pointer shrink-0"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>{isRtl ? 'تشغيل المعاينة المباشرة داخل المنصة' : 'Launch Live Embedded Preview'}</span>
                        </button>
                      )}
                    </div>

                    {displayImages.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                          {isRtl ? 'معرض صور ومشاهد معانية القالب والمشروع (Slider/Gallery):' : 'Template Screenshots Gallery Slider:'}
                        </span>
                        <TemplateImageSlider
                          images={displayImages}
                          lang={lang}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {isRtl ? 'مميزات هذا القالب والمشروع:' : 'Template Features:'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {displayFeatures.map((f: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 rounded-xl bg-slate-950 p-3 border border-slate-800 text-xs text-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        <span>{isRtl ? 'تقييمات وآراء العملاء' : 'Client Ratings & Reviews'}</span>
                      </h4>
                    </div>

                    <form onSubmit={(e) => handleReviewSubmit(e, activeModalApp.id, isRtl ? activeModalApp.titleAr : activeModalApp.titleEn)} className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-300 font-bold">{isRtl ? 'اختر تقييمك بالنجوم:' : 'Select Star Rating:'}</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setUserRating(star)}
                              className="p-1 cursor-pointer transition hover:scale-110"
                            >
                              <Star className={`w-5 h-5 ${star <= userRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        rows={2}
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        placeholder={isRtl ? 'اكتب رأيك وتعليقك حول هذا القالب والمشروع...' : 'Write your comment or review about this tool...'}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-white"
                      />

                      {reviewSuccessMsg && (
                        <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>{reviewSuccessMsg}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-500 transition shadow cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'إرسال التقييم' : 'Submit Review'}</span>
                      </button>
                    </form>

                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {reviewsList.filter((r: any) => r.projectId === activeModalApp.id).map((rev: any) => (
                        <div key={rev.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{rev.userName}</span>
                              <div className="flex items-center text-amber-400">
                                {[...Array(rev.rating)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                                ))}
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">{rev.createdAt}</span>
                          </div>
                          <p className="text-slate-300">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
                    <button
                      onClick={() => setActiveModalApp(null)}
                      className="w-full sm:w-auto rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition cursor-pointer"
                    >
                      {t?.closeModal || 'إغلاق'}
                    </button>
                    
                    <button
                      onClick={() => {
                        const appToLaunch = activeModalApp;
                        setActiveModalApp(null);
                        if (!isUserLoggedIn && !isAdmin) {
                          onOpenLogin();
                          return;
                        }
                        if (onLaunchSandbox) onLaunchSandbox(appToLaunch);
                      }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{t?.launchInSandbox || 'تشغيل في المحاكي'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {embeddedPreviewUrl && (
            <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950 text-white animate-fadeIn">
              <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-extrabold text-sm md:text-base">
                    {isRtl ? '👁️ مشغّل المعاينة المباشرة للمشروع (Live Interactive Demo Player)' : 'Live Interactive Demo Player'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEmbeddedPreviewUrl(null)}
                    className="flex items-center gap-1 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-300 hover:bg-rose-600 hover:text-white px-3 py-1.5 text-xs font-bold transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>{isRtl ? 'إغلاق المعاينة' : 'Close Preview'}</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 w-full bg-slate-950 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
                <div className="w-full h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
                  <iframe
                    src={embeddedPreviewUrl}
                    title="Live Project Preview"
                    className="w-full h-full border-0 bg-white"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <FaqSection lang={lang} adminSettings={adminSettings} />

      {purchaseModalProject && (
        <ProjectPurchaseModal
          isOpen={!!purchaseModalProject}
          onClose={() => setPurchaseModalProject(null)}
          project={purchaseModalProject}
          selectedTemplate={purchaseModalTemplate}
          initialPlan={purchaseModalInitialPlan as any}
          currentUser={storageService.getCurrentUser()}
          isUserLoggedIn={isUserLoggedIn}
          wallets={storageService.getWallets()}
          adminSettings={adminSettings}
          lang={lang}
          onOpenLogin={onOpenLogin}
          showToast={showToast || (() => {})}
          onLaunchSandbox={onLaunchSandbox}
        />
      )}
    </div>
  );
}

export default function AppStore(props: AppStoreProps) {
  return (
    <AppStoreErrorBoundary lang={props.lang || 'ar'}>
      <AppStoreContent {...props} />
    </AppStoreErrorBoundary>
  );
}
