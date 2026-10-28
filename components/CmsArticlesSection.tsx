/**
 * Next.js Project Structure Identifier:
 * components/CmsArticlesSection.jsx
 * 
 * Project Identity: ليرن ويب | Lern Web
 * Purpose: Dynamic CMS Articles & Knowledgebase Section
 * Features:
 *   - Live reactive listing from storageService / Firestore
 *   - Category filtering & instant search
 *   - Detailed reader modal with full article content, tags & author info
 *   - Quick shortcut to CMS Admin Article Manager
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Clock, User, ArrowUpRight, Sparkles, 
  Tag, Share2, BookOpen, ChevronRight, X, Edit3, Check
} from 'lucide-react';
import { storageService, CmsArticle } from '../src/services/storageService';
import SectionMediaShowcase from '../src/components/SectionMediaShowcase';

interface CmsArticlesSectionProps {
  lang?: 'ar' | 'en';
  isAdmin?: boolean;
  onOpenAdminCms?: () => void;
  showToast?: (message: string, type?: 'success' | 'error') => void;
}

export default function CmsArticlesSection({
  lang = 'ar',
  isAdmin = false,
  onOpenAdminCms = () => {},
  showToast = () => {}
}: CmsArticlesSectionProps) {
  const isRtl = lang === 'ar';

  const [articles, setArticles] = useState<CmsArticle[]>(() => storageService.getArticles(false));
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<CmsArticle | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setArticles(storageService.getArticles(false));
    });
    return () => unsubscribe();
  }, []);

  const categories = [
    { id: 'all', labelAr: 'كافة المقالات', labelEn: 'All Articles' },
    { id: 'tech', labelAr: 'تقنية وتطوير', labelEn: 'Tech & Dev' },
    { id: 'ai', labelAr: 'ذكاء اصطناعي', labelEn: 'Artificial Intelligence' },
    { id: 'pwa', labelAr: 'تطبيقات الويب التقدمية', labelEn: 'PWA & Offline' },
    { id: 'education', labelAr: 'التحول الرقمي التعليمي', labelEn: 'EdTech' }
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesSearch = 
      (art.titleAr && art.titleAr.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (art.titleEn && art.titleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (art.excerptAr && art.excerptAr.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (art.excerptEn && art.excerptEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (art.tags && art.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'tech') return (art.categoryAr?.includes('تقنية') || art.categoryEn?.toLowerCase().includes('tech'));
    if (selectedCategory === 'ai') return (art.categoryAr?.includes('ذكاء') || art.categoryEn?.toLowerCase().includes('ai'));
    if (selectedCategory === 'pwa') return (art.categoryAr?.includes('PWA') || art.categoryEn?.toLowerCase().includes('pwa') || art.tags?.includes('PWA'));
    if (selectedCategory === 'education') return (art.categoryAr?.includes('تعليم') || art.categoryEn?.toLowerCase().includes('ed'));
    return true;
  });

  const handleShareArticle = (art: CmsArticle) => {
    const title = isRtl ? art.titleAr : art.titleEn;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title, text: isRtl ? art.excerptAr : art.excerptEn, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${title} - ${url}`);
      setCopiedLink(true);
      showToast(isRtl ? 'تم نسخ رابط المقال بنجاح!' : 'Article link copied!', 'success');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <section id="articles" className="w-full space-y-8 my-12 animate-fadeIn scroll-mt-24">
      {/* Header Container */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-400">
              <FileText className="w-3.5 h-3.5" />
              <span>{isRtl ? 'نظام إدارة المحتوى | Content Management System (CMS)' : 'Content Management System (CMS)'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              {isRtl ? 'مركز المعرفة، المقالات البرمجية والدراسات' : 'Knowledge Center & CMS Articles'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isRtl 
                ? 'مقالات ودراسات تقنية متخصصة تدار لحظياً عبر نظام إدارة المحتوى (CMS) لدعم التحول الرقمي، تقنيات PWA، وتطبيقات الذكاء الاصطناعي.'
                : 'Curated technical studies and architectural deep dives managed live through the CMS engine to accelerate software development.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {isAdmin && (
              <button
                onClick={onOpenAdminCms}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs md:text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition active:scale-95"
              >
                <Edit3 className="w-4 h-4" />
                <span>{isRtl ? 'إدارة مقالات الـ CMS' : 'Manage in CMS'}</span>
              </button>
            )}
            <div className="rounded-2xl border border-slate-700/80 bg-slate-950/60 px-4 py-2 text-xs font-mono text-slate-300">
              <span className="text-blue-400 font-bold">{articles.length}</span> {isRtl ? 'مقال متاح' : 'Articles Published'}
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'ابحث في مقالات المعرفة البرمجية...' : 'Search articles and topics...'}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 pr-10 pl-4 py-2.5 text-xs md:text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {isRtl ? cat.labelAr : cat.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Target Section Videos for Articles */}
      <SectionMediaShowcase targetSection="articles" lang={lang} />

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400 space-y-3">
          <BookOpen className="w-12 h-12 mx-auto text-slate-600 opacity-60" />
          <h4 className="font-bold text-white text-base">
            {isRtl ? 'لا توجد مقالات مطابقة لبحثك' : 'No articles match your query'}
          </h4>
          <p className="text-xs text-slate-400">
            {isRtl ? 'جرب البحث بكلمات أخرى أو اختر فئة مختلفة.' : 'Try adjusting your search keywords or category filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              onClick={() => setActiveArticle(art)}
              className="group rounded-3xl border border-slate-800 bg-slate-900/90 p-5 md:p-6 shadow-xl hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-4">
                {/* Image / Header Thumbnail */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group-hover:border-slate-700 transition">
                  {art.imageUrl ? (
                    <img 
                      src={art.imageUrl} 
                      alt={art.titleAr} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900/60 via-indigo-950 to-slate-950 flex items-center justify-center">
                      <FileText className="w-12 h-12 text-blue-400/40" />
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className="rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700 px-2.5 py-1 text-[11px] font-bold text-blue-300">
                      {isRtl ? art.categoryAr : art.categoryEn}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <span className="flex items-center gap-1 rounded-lg bg-slate-950/80 backdrop-blur-md px-2 py-1 text-[10px] font-mono text-slate-300">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{art.readTime || '4 دقائق'}</span>
                    </span>
                  </div>
                </div>

                {/* Article Meta */}
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>{art.author || (isRtl ? 'فريق ليرن ويب' : 'Lern Web Team')}</span>
                  </span>
                  <span className="font-mono text-slate-500">
                    {art.createdAt ? new Date(art.createdAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US') : ''}
                  </span>
                </div>

                {/* Title & Excerpt */}
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                    {isRtl ? art.titleAr : art.titleEn}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {isRtl ? art.excerptAr : art.excerptEn}
                  </p>
                </div>

                {/* Tags */}
                {art.tags && art.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {art.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/60">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300">
                <span className="flex items-center gap-1">
                  <span>{isRtl ? 'قراءة المقال بالكامل' : 'Read Article'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
                <span className="text-slate-500 text-[11px] font-mono">
                  {art.viewsCount ? `${art.viewsCount} مشاهدة` : 'CMS Live'}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 text-slate-100 p-6 sm:p-8 md:p-10 shadow-2xl space-y-6">
            {/* Close Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-6 left-6 rounded-full bg-slate-800 border border-slate-700 p-2 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-3 pt-2 border-b border-slate-800 pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-blue-500/20 border border-blue-500/40 px-3 py-1 text-xs font-bold text-blue-400">
                  {isRtl ? activeArticle.categoryAr : activeArticle.categoryEn}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activeArticle.readTime || '5 دقائق'}</span>
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400">
                  {activeArticle.author || 'Lern Web'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {isRtl ? activeArticle.titleAr : activeArticle.titleEn}
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                {isRtl ? activeArticle.excerptAr : activeArticle.excerptEn}
              </p>
            </div>

            {/* Article Image */}
            {activeArticle.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-800 max-h-80 bg-slate-950">
                <img 
                  src={activeArticle.imageUrl} 
                  alt={activeArticle.titleAr} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Full Content */}
            <div className="prose prose-invert max-w-none text-slate-200 text-sm md:text-base leading-relaxed space-y-4">
              {(isRtl ? activeArticle.contentAr : activeArticle.contentEn)
                ?.split('\n\n')
                .map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed text-slate-300">
                    {paragraph}
                  </p>
                ))}
            </div>

            {/* Tags and Share */}
            <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-slate-500" />
                {activeArticle.tags?.map((t, idx) => (
                  <span key={idx} className="rounded-md bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs text-slate-300 font-mono">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShareArticle(activeArticle)}
                  className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-bold text-white transition"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-blue-400" />}
                  <span>{copiedLink ? (isRtl ? 'تم النسخ' : 'Copied') : (isRtl ? 'مشاركة' : 'Share')}</span>
                </button>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2 text-xs font-bold text-white transition"
                >
                  {isRtl ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
