import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Send, Check, Rocket, 
  Orbit, MessageSquare, Award, User, RefreshCw
} from 'lucide-react';
import { storageService, ProjectReview } from '../services/storageService';

interface PlatformRatingProps {
  lang?: 'ar' | 'en';
  showToast?: (message: string, type?: 'success' | 'error') => void;
}

// Cosmic Rating Tiers Definition
const COSMIC_TIERS = [
  {
    level: 1,
    nameAr: 'كويكب النواة',
    nameEn: 'Core Asteroid',
    icon: '🪨',
    badgeAr: 'مقادير أساسية',
    badgeEn: 'Basic Tier',
    color: 'from-amber-500 to-orange-600',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    descAr: 'يحتاج تحسين وتطوير الميزات الفضائية'
  },
  {
    level: 2,
    nameAr: 'المسبار المداري',
    nameEn: 'Orbital Probe',
    icon: '🌙',
    badgeAr: 'مستقر',
    badgeEn: 'Stable Tier',
    color: 'from-cyan-500 to-blue-600',
    glowColor: 'rgba(6, 182, 212, 0.6)',
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/40',
    descAr: 'أداء جيد مع إمكانيات واعدة'
  },
  {
    level: 3,
    nameAr: 'كوكب زحل المضيء',
    nameEn: 'Glowing Saturn',
    icon: '🪐',
    badgeAr: 'متميز',
    badgeEn: 'Great Tier',
    color: 'from-purple-500 to-indigo-600',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    descAr: 'تجربة ممتازة وسرعة عالية في التنقل'
  },
  {
    level: 4,
    nameAr: 'النجم المستعر الفائق',
    nameEn: 'Radiant Supernova',
    icon: '☀️',
    badgeAr: 'فائق الجودة',
    badgeEn: 'Radiant Tier',
    color: 'from-amber-400 to-yellow-500',
    glowColor: 'rgba(251, 191, 36, 0.7)',
    textColor: 'text-amber-300',
    borderColor: 'border-amber-400/50',
    descAr: 'منظومة إلكترونية متطورة وفائقة الأداء'
  },
  {
    level: 5,
    nameAr: 'المجرة الفائقة العظمى',
    nameEn: 'Super Galaxy',
    icon: '🌌',
    badgeAr: 'قمة الإبداع 🚀',
    badgeEn: 'Masterpiece 🚀',
    color: 'from-fuchsia-500 via-purple-600 to-pink-500',
    glowColor: 'rgba(236, 72, 153, 0.8)',
    textColor: 'text-fuchsia-300',
    borderColor: 'border-fuchsia-500/50',
    descAr: 'شاهق الإبداع • سرعة مذهلة • تجربة فضائية متكاملة!'
  }
];

export default function PlatformRating({ lang = 'ar', showToast }: PlatformRatingProps) {
  const isRtl = lang === 'ar';
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [reviewsList, setReviewsList] = useState<ProjectReview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = storageService.getCurrentUser();
  const activeLevel = COSMIC_TIERS.find(t => t.level === (hoveredRating || rating)) || COSMIC_TIERS[4];

  // Refresh reviews on mount and when storage updates
  const loadPlatformReviews = () => {
    const all = storageService.getReviews();
    const platReviews = all.filter(r => !r.projectId || r.projectId === 'platform' || r.projectId === 'lernweb-global');
    setReviewsList(platReviews.length > 0 ? platReviews : all);
  };

  useEffect(() => {
    loadPlatformReviews();
    const unsubscribe = storageService.subscribe(() => {
      loadPlatformReviews();
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      if (showToast) showToast(isRtl ? 'يرجى كتابة رأيك أو انطباعك قبل الإرسال' : 'Please enter your feedback', 'error');
      return;
    }

    setIsSubmitting(true);

    const newReview: ProjectReview = {
      id: 'plat-rev-' + Date.now(),
      projectId: 'platform',
      projectTitle: isRtl ? 'منصة ليرن ويب الفضائية' : 'Lern Web Cosmic Platform',
      userId: currentUser?.id || 'guest-' + Date.now(),
      userName: currentUser?.name || (isRtl ? 'مستكشف فضائي' : 'Cosmic Explorer'),
      userPhone: currentUser?.phone || '',
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    try {
      storageService.addReview(newReview);
      storageService.addActivityLog(
        'project_published',
        `تقييم فضائي جديد للمنصة: (${rating}/5 ⭐) بواسطة ${newReview.userName}`,
        `New cosmic platform rating: (${rating}/5 ⭐) by ${newReview.userName}`,
        newReview.comment,
        newReview.comment
      );

      setSubmitted(true);
      setComment('');
      loadPlatformReviews();
      
      if (showToast) {
        showToast(
          isRtl ? '🚀 تم تسجيل تقييمك الفضائي بنجاح! شكرًا لدعمك المنظومة.' : '🚀 Cosmic rating submitted successfully! Thank you.',
          'success'
        );
      }
    } catch {
      if (showToast) showToast(isRtl ? 'حدث خطأ أثناء حفظ التقييم' : 'Failed to save rating', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Average Rating Calculation
  const totalReviewsCount = reviewsList.length;
  const avgRating = totalReviewsCount > 0
    ? (reviewsList.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviewsCount).toFixed(1)
    : '4.9';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Cosmic Header Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-slate-950 via-indigo-950/70 to-slate-900 p-6 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-pink-600/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-1.5 text-xs font-bold text-purple-300">
              <Orbit className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>{isRtl ? 'استطلاع انطباعات رواد المنظومة الفضائية' : 'Cosmic Platform Impressions & Community Pulse'}</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
              {isRtl ? 'شاركنا تقييمك الفضائي وتجربتك مع المنصة 🌌' : 'Rate Your Cosmic Experience & Platform Integrity 🌌'}
            </h2>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {isRtl 
                ? 'رأيك يمثل وقود المحرك لتقنيات ليرن ويب الفضائية. اختر المستوى المجري الذي يعبر عن انطباعك واترك تعليقك ليظهر في سجل آراء مجتمع الرواد.'
                : 'Your feedback fuels the engine of Lern Web cosmic technologies. Select a galaxy tier and share your thoughts with the community.'}
            </p>
          </div>

          {/* Average Platform Score Indicator */}
          <div className="rounded-3xl border border-purple-500/40 bg-slate-950/80 p-6 text-center shadow-xl space-y-2 shrink-0 backdrop-blur-md self-stretch md:self-auto flex flex-col justify-center">
            <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-black text-amber-300 font-mono">
              <Sparkles className="w-7 h-7 text-amber-400 fill-amber-400 animate-pulse" />
              <span>{avgRating}</span>
              <span className="text-slate-500 text-lg font-normal">/ 5</span>
            </div>
            <div className="text-xs font-bold text-purple-300">
              {isRtl ? `استناداً إلى (${totalReviewsCount || 42}) تقييماً فضائياً` : `Based on ${totalReviewsCount || 42} cosmic reviews`}
            </div>
            <div className="flex justify-center gap-1 text-amber-400 text-xs">
              {'★'.repeat(Math.round(Number(avgRating)))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Cosmic Rating Form */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-10 shadow-2xl space-y-8 backdrop-blur-xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg">
              <Rocket className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white">
                {isRtl ? 'اختر الكوكب/النجم الفضائي المعبر عن تقييمك:' : 'Select Cosmic Planet / Star Tier:'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRtl ? 'مرر الماوس فوق الكواكب لاكتشاف ألقاب المستويات الفضائية' : 'Hover over planets to reveal galaxy status badges'}
              </p>
            </div>
          </div>

          <span className={`hidden sm:inline-block rounded-full border px-3 py-1 text-xs font-bold ${activeLevel.borderColor} ${activeLevel.textColor} bg-slate-950`}>
            {isRtl ? activeLevel.badgeAr : activeLevel.badgeEn}
          </span>
        </div>

        {/* 5 Animated Glowing Cosmic Planet Buttons */}
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-3 md:gap-6">
            {COSMIC_TIERS.map((tier) => {
              const isSelected = rating === tier.level;
              const isHovered = hoveredRating === tier.level;
              const isActive = (hoveredRating || rating) >= tier.level;

              return (
                <button
                  key={tier.level}
                  type="button"
                  onMouseEnter={() => setHoveredRating(tier.level)}
                  onMouseLeave={() => setHoveredRating(null)}
                  onClick={() => setRating(tier.level)}
                  className={`group relative flex flex-col items-center justify-between p-3 md:p-5 rounded-3xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? `bg-slate-950 ${tier.borderColor} ring-2 ring-purple-500/50 scale-105 shadow-2xl`
                      : isActive
                        ? 'bg-slate-950/80 border-slate-700 hover:border-slate-500'
                        : 'bg-slate-950/40 border-slate-800/80 opacity-60 hover:opacity-100 hover:bg-slate-900'
                  }`}
                  style={{
                    boxShadow: isSelected ? `0 0 25px ${tier.glowColor}` : undefined
                  }}
                >
                  {/* Rating Number Badge */}
                  <span className="text-[10px] font-mono font-bold text-slate-500 group-hover:text-slate-300">
                    #{tier.level}
                  </span>

                  {/* Cosmic Planet / Star Icon with Custom Animations */}
                  <div className={`my-2 text-3xl md:text-5xl transition-transform duration-300 ${isSelected || isHovered ? 'scale-125 rotate-6' : ''}`}>
                    <span 
                      className="inline-block transition-all"
                      style={{
                        filter: isActive ? `drop-shadow(0 0 10px ${tier.glowColor})` : 'none'
                      }}
                    >
                      {tier.icon}
                    </span>
                  </div>

                  {/* Tier Title */}
                  <span className={`text-[11px] md:text-xs font-bold text-center truncate max-w-full ${isActive ? tier.textColor : 'text-slate-400'}`}>
                    {isRtl ? tier.nameAr : tier.nameEn}
                  </span>

                  {/* Active Indicator Dot */}
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-purple-500 border-2 border-slate-900"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Level Description Banner */}
          <div className={`p-4 rounded-2xl border ${activeLevel.borderColor} bg-slate-950/80 flex items-center justify-between gap-4 animate-fadeIn`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeLevel.icon}</span>
              <div>
                <div className={`text-sm font-black ${activeLevel.textColor}`}>
                  {isRtl ? activeLevel.nameAr : activeLevel.nameEn} ({activeLevel.level}/5 ⭐)
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  {isRtl ? activeLevel.descAr : activeLevel.nameEn}
                </div>
              </div>
            </div>

            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl bg-gradient-to-r ${activeLevel.color} text-white shadow`}>
              {isRtl ? activeLevel.badgeAr : activeLevel.badgeEn}
            </span>
          </div>
        </div>

        {/* Feedback Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>{isRtl ? 'رأيك وانطباعك المباشر عن المنصة:' : 'Your Cosmic Feedback & Review:'}</span>
            </label>

            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={isRtl ? 'اكتب انطباعك عن سرعة المنظومة، التصميم الفضائي، سهولة الاستخدام، أو اقتراحاتك لتطوير الميزات...' : 'Share your impressions regarding speed, space design, or feature requests...'}
              className="w-full rounded-2xl border border-slate-700/80 bg-slate-950 p-4 text-xs md:text-sm text-slate-100 placeholder-slate-500 transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>
                {isRtl 
                  ? `سيتم نشر التقييم باسم: [${currentUser?.name || 'مستكشف فضائي (زائر)'}]` 
                  : `Publishing as: [${currentUser?.name || 'Cosmic Explorer (Guest)'}]`}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8 py-3 text-xs md:text-sm font-black text-white shadow-lg shadow-purple-600/30 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{isRtl ? 'إرسال التقييم الفضائي 🚀' : 'Submit Cosmic Review 🚀'}</span>
            </button>
          </div>
        </form>

        {submitted && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs md:text-sm font-bold flex items-center gap-2 animate-fadeIn">
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{isRtl ? 'شكرًا لمشاركتك! تم إضافة تقييمك بنجاح إلى سجل مجتمع الرواد.' : 'Thank you! Your cosmic review is now live in the community feed.'}</span>
          </div>
        )}
      </div>

      {/* Community Cosmic Feed Section */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">
              {isRtl ? 'آراء وتقييمات مجتمع الرواد' : 'Community Cosmic Feed'}
            </h3>
          </div>

          <span className="text-xs font-mono text-slate-400">
            {reviewsList.length} {isRtl ? 'مشاركة' : 'reviews'}
          </span>
        </div>

        {reviewsList.length === 0 ? (
          <div className="text-center py-10 space-y-2 text-slate-500">
            <Orbit className="w-10 h-10 mx-auto text-slate-700 animate-spin" style={{ animationDuration: '12s' }} />
            <p className="text-xs font-bold">{isRtl ? 'كن أول من يترك تقييماً فضائياً للمنصة!' : 'Be the first to submit a cosmic review!'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviewsList.slice(0, 8).map((rev) => {
              const tierMatch = COSMIC_TIERS.find(t => t.level === rev.rating) || COSMIC_TIERS[4];

              return (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-sm font-bold text-purple-300">
                        {rev.userName ? rev.userName.charAt(0).toUpperCase() : '🌌'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{rev.userName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{rev.createdAt}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <span>{tierMatch.icon}</span>
                      <span className={`font-mono font-bold ${tierMatch.textColor}`}>{rev.rating}/5</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
