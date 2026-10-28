import React from 'react';
import { 
  Sparkles, ArrowUpRight, MessageSquare, Smartphone, Shield, Cpu, 
  Layers, CreditCard, FileText, HelpCircle, ArrowRight, ArrowLeft,
  CheckCircle2, Star, Play, ExternalLink, Zap, Terminal, Rocket, Globe
} from 'lucide-react';
import { buildWhatsAppUrl, ProjectItem, AdminSettings, PublishedProject } from '../services/storageService';

interface HomeSectionProps {
  lang: 'ar' | 'en';
  t: any;
  adminSettings: AdminSettings;
  projects: ProjectItem[];
  publishedProjects?: PublishedProject[];
  onNavigate: (tab: string) => void;
  onLaunchSandbox: (app: any) => void;
  targetWhatsAppNumber: string;
  showToast?: (message: string, type?: 'success' | 'error') => void;
}

export default function HomeSection({
  lang = 'ar',
  t,
  adminSettings,
  projects = [],
  publishedProjects = [],
  onNavigate,
  onLaunchSandbox,
  targetWhatsAppNumber = '201024889921',
}: HomeSectionProps) {
  const isRtl = lang === 'ar';
  const primaryColor = adminSettings?.primaryColor || '#2563eb';

  // Take top 3 published projects for featured showcase
  const featuredProjects = projects.filter(p => p.isPublished).slice(0, 3);

  return (
    <div className="w-full space-y-12 animate-fadeIn">
      {/* High-Fidelity Marketing Hero Section */}
      <section 
        aria-label="Hero Section" 
        className="relative overflow-hidden rounded-[2.5rem] border border-slate-800 bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 p-8 md:p-16 shadow-3xl text-center"
      >
        {/* Ambient Glowing Blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/20 blur-[100px] animate-pulse pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-purple-500/20 blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto space-y-8">
          {/* Top Decorative Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-6 py-2 text-xs md:text-sm font-bold text-blue-400 tracking-wide uppercase animate-fadeIn">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>{isRtl ? 'بوابتك نحو التحول الرقمي' : 'Your Gateway to Digital Transformation'}</span>
          </div>

          {/* Main Title (العبارة الرئيسية) */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-slate-300 leading-tight">
            {t.heroMarketingTitle}
          </h1>

          {/* Subtitle (العبارة الفرعية) */}
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl font-medium">
            {t.heroMarketingSubtitle}
          </p>

          {/* Action Buttons (الأزرار تحتها) */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => onNavigate('store')}
              style={{ backgroundColor: primaryColor }}
              className="px-8 py-4 rounded-2xl text-white font-bold text-base md:text-lg shadow-2xl shadow-blue-900/40 hover:scale-105 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>{t.heroCta}</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>

            <a
              href={buildWhatsAppUrl(targetWhatsAppNumber, isRtl ? 'مرحباً، أود الاستفسار عن نظام الاشتراكات والترخيص' : 'Hello, I would like to inquire about the Subscription System')}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-base md:text-lg hover:bg-white/10 transition-colors flex items-center gap-2 backdrop-blur-md cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <span>{isRtl ? 'نظام الاشتراكات' : 'Subscription System'}</span>
            </a>

            <button
              type="button"
              onClick={() => onNavigate('wallets')}
              className="px-6 py-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-200 font-bold text-sm md:text-base hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>{isRtl ? 'طرق الدفع والاشتراك' : 'Payment Methods'}</span>
            </button>
          </div>

          {/* Value Props Bar (العبارات الثلاث) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-12 border-t border-slate-800/60">
            {[
              { icon: Smartphone, label: t.heroFeature1, color: 'text-emerald-400', descAr: 'تجربة سلسة على الموبايل والكمبيوتر', descEn: 'Seamless mobile and desktop experience' },
              { icon: Shield, label: t.heroFeature2, color: 'text-blue-400', descAr: 'فريق متخصص لمرافقتك وتدريبك', descEn: 'Dedicated engineering and support team' },
              { icon: Cpu, label: t.heroFeature3, color: 'text-purple-400', descAr: 'محرك Edge و PWA فائق السرعة', descEn: 'High-speed Edge & PWA execution' }
            ].map((prop, i) => (
              <div key={i} className="flex items-center justify-center gap-3.5 group p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
                <div className={`p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 ${prop.color} group-hover:scale-110 transition-transform`}>
                  <prop.icon className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <span className="block text-sm md:text-base font-bold text-slate-100">{prop.label}</span>
                  <span className="block text-xs text-slate-400">{isRtl ? prop.descAr : prop.descEn}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Navigation Hub */}
      <section aria-label="Quick Hub" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {[
          {
            id: 'store',
            titleAr: 'سوق المنظومات',
            titleEn: 'System Store',
            descAr: 'تصفح كل المنصات الجاهزة',
            descEn: 'Browse all ready platforms',
            icon: Layers,
            color: 'from-blue-600/20 to-indigo-600/20 border-blue-500/30 text-blue-400'
          },
          {
            id: 'published-projects',
            titleAr: 'مشروعات منشورة',
            titleEn: 'Published Projects',
            descAr: 'تطبيقات ومراكز حية للعملاء',
            descEn: 'Live client deployments',
            icon: Globe,
            color: 'from-sky-600/20 to-cyan-600/20 border-sky-500/30 text-sky-400'
          },
          {
            id: 'rating',
            titleAr: 'تقييم المنصة',
            titleEn: 'Rate Platform',
            descAr: 'آراء ومراجعات عملائنا',
            descEn: 'Reviews and feedback',
            icon: Star,
            color: 'from-yellow-600/20 to-amber-600/20 border-yellow-500/30 text-yellow-400'
          },
          {
            id: 'wallets',
            titleAr: 'طرق الدفع',
            titleEn: 'Payment Methods',
            descAr: 'فودافون كاش، انستاباي',
            descEn: 'Vodafone Cash, InstaPay',
            icon: CreditCard,
            color: 'from-amber-600/20 to-orange-600/20 border-amber-500/30 text-amber-400'
          },
          {
            id: 'articles',
            titleAr: 'المقالات والـ CMS',
            titleEn: 'CMS & Articles',
            descAr: 'أدلة التشغيل والتحول الرقمي',
            descEn: 'Guides and insights',
            icon: FileText,
            color: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/30 text-emerald-400'
          },
          {
            id: 'faq',
            titleAr: 'الأسئلة الشائعة',
            titleEn: 'FAQ',
            descAr: 'إجابات فورية لكل استفساراتك',
            descEn: 'Answers to common questions',
            icon: HelpCircle,
            color: 'from-purple-600/20 to-pink-600/20 border-purple-500/30 text-purple-400'
          }
        ].map((hub) => {
          const Icon = hub.icon;
          return (
            <button
              key={hub.id}
              type="button"
              onClick={() => onNavigate(hub.id)}
              className={`p-4 rounded-2xl border bg-gradient-to-br ${hub.color} hover:scale-[1.02] active:scale-95 transition-all text-right flex flex-col justify-between gap-3 shadow-lg cursor-pointer`}
            >
              <div className="flex items-center justify-between w-full">
                <Icon className="w-5 h-5" />
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm md:text-base leading-tight">{isRtl ? hub.titleAr : hub.titleEn}</h3>
                <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">{isRtl ? hub.descAr : hub.descEn}</p>
              </div>
            </button>
          );
        })}
      </section>

      {/* Published Projects Showcase Section on Laptop/Desktop & All Views */}
      <section aria-label="Published Projects Showcase" className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
              <Globe className="w-3.5 h-3.5" />
              <span>{isRtl ? 'معرض الأعمال والمشاريع الحية' : 'Live Client Portfolios'}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              {isRtl ? 'مشروعات منشورة لعملائنا' : 'Published Projects & Portfolios'}
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              {isRtl ? 'نماذج وتطبيقات تم إطلاقها وتشغيلها بنجاح لمراكز وأكاديميات وشركات شريكة' : 'Production applications successfully deployed for partner centers & enterprises'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('published-projects')}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600/20 hover:bg-sky-600 border border-sky-500/40 text-sky-300 hover:text-white px-4 py-2 text-xs md:text-sm font-bold transition-all cursor-pointer shrink-0"
          >
            <span>{isRtl ? 'عرض كل المشروعات المنشورة' : 'View All Published Projects'}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

        {publishedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedProjects.slice(0, 3).map((pub) => (
              <div 
                key={pub.id}
                className="rounded-3xl border border-slate-800 bg-slate-900/90 overflow-hidden hover:border-slate-700 transition shadow-xl flex flex-col justify-between group"
              >
                {pub.imageUrl && (
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img 
                      src={pub.imageUrl} 
                      alt={pub.titleAr || pub.titleEn} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 backdrop-blur-md">
                      {isRtl ? 'مشروع حي ومعتمد' : 'Live Project'}
                    </span>
                  </div>
                )}

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
                      {isRtl ? pub.titleAr : pub.titleEn}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                      {isRtl ? pub.descriptionAr : pub.descriptionEn}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    {pub.websiteUrl ? (
                      <a
                        href={pub.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 py-2.5 px-3 text-xs font-bold text-white shadow transition active:scale-95"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'زيارة المنصة الحية' : 'Visit Live App'}</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onNavigate('published-projects')}
                        className="flex-1 rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 px-3 text-xs font-bold text-slate-200 transition"
                      >
                        {isRtl ? 'معاينة التفاصيل' : 'Preview Details'}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onNavigate('published-projects')}
                      className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title={isRtl ? 'المزيد في المعرض' : 'More'}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center space-y-3">
            <Globe className="w-10 h-10 text-sky-400 mx-auto opacity-70" />
            <h4 className="text-base font-bold text-white">{isRtl ? 'معرض المشروعات المنشورة' : 'Published Projects Portfolio'}</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {isRtl ? 'يمكنك استعراض المشروعات المعتمدة وتجربة الأنظمة الحية للعملاء' : 'Explore certified client systems and active educational hubs'}
            </p>
            <button
              type="button"
              onClick={() => onNavigate('published-projects')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 px-4 py-2 text-xs font-bold text-white transition active:scale-95"
            >
              <span>{isRtl ? 'فتح قسم المشروعات المنشورة' : 'Open Projects Portfolio'}</span>
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </section>

      {/* Platform Rating & Reviews Section */}
      <section aria-label="Platform Rating" className="space-y-6">
        <div className="rounded-[2.5rem] border border-amber-500/30 bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 p-6 md:p-10 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{isRtl ? 'تقييم المنصة وثقة العملاء' : 'Platform Rating & Trust'}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                {isRtl ? 'تقييم منصة ليرن ويب (4.9 / 5)' : 'Lern Web Platform Rating (4.9 / 5)'}
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
                {isRtl 
                  ? 'انضم إلى مئات المعلمين والمراكز التعليمية الذين أطلقوا منصاتهم بنجاح مع ليرن ويب بتملك كامل ودعم فني مستمر.' 
                  : 'Join hundreds of educators and academies operating their branded platforms with full source buyout and ongoing engineering SLA.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('rating')}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs md:text-sm shadow-xl shadow-amber-500/20 hover:scale-105 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Star className="w-4 h-4 fill-slate-950" />
                <span>{isRtl ? 'أضف تقييمك الآن' : 'Submit Your Review'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('rating')}
                className="px-5 py-3 rounded-2xl border border-slate-700 bg-slate-800/80 text-white font-bold text-xs md:text-sm hover:bg-slate-700 transition cursor-pointer"
              >
                <span>{isRtl ? 'استعراض كل التقييمات' : 'View All Reviews'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <h4 className="text-sm font-bold text-white">{isRtl ? 'أفضل منصة لإدارة السناتر' : 'Best LMS for Academies'}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isRtl ? '«تسجيل الحضور بالـ QR في أجزاء من الثانية وفّر علينا ساعات عمل يومية، والطلاب وأولياء الأمور معجبون بالنظام.»' : '"QR check-in saved us hours every single day."'}
              </p>
              <span className="text-[11px] font-bold text-slate-500 block">{isRtl ? '— أ. د. كريم المنشاوي (مركز تعليمي)' : '— Academy Director'}</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <h4 className="text-sm font-bold text-white">{isRtl ? 'سلاسة تطبيق PWA بلا إنترنت' : 'PWA Offline Reliability'}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isRtl ? '«التطبيق يعمل مباشرة حتى عند ضعف شبكة المحمول بالقاعات مع دعم كامل للتثبيت الفوري دون متجر.»' : '"PWA runs flawlessly offline inside our classrooms."'}
              </p>
              <span className="text-[11px] font-bold text-slate-500 block">{isRtl ? '— م. محمد الشريف (مؤسسة تعليمية)' : '— Lead Instructor'}</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <h4 className="text-sm font-bold text-white">{isRtl ? 'دعم فني وتملك حقيقي' : 'Full Buyout & Support'}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isRtl ? '«استلمنا الكود المصدري كاملاً وقمنا بربط دومين المركز الخاص بنا، فريق الدعم الفني متجاوب ومحترف.»' : '"Full uncompressed source code delivered with domain setup."'}
              </p>
              <span className="text-[11px] font-bold text-slate-500 block">{isRtl ? '— أ. سارة النجار (أكاديمية لغات)' : '— Language Academy'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Platforms Preview from Marketplace */}
      {featuredProjects.length > 0 && (
        <section aria-label="Featured Projects" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                <Rocket className="w-3.5 h-3.5" />
                <span>{isRtl ? 'منظومات مميزة في ليرن ويب' : 'Featured Platforms'}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                {isRtl ? 'أبرز المنظومات والحلول الرقمية' : 'Featured Digital Solutions'}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('store')}
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              <span>{isRtl ? 'تصفح كل المنظومات في السوق' : 'View all in Store'}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <div 
                key={project.id}
                className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition shadow-xl group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {isRtl ? (project.badgeAr || 'منظومة معتمدة') : (project.badgeEn || 'Verified System')}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{project.version || 'v3.8'}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {isRtl ? project.titleAr : project.titleEn}
                  </h3>

                  <p className="text-xs md:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                    {isRtl ? project.taglineAr : project.taglineEn}
                  </p>

                  {/* Rating Display */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 pt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{project.rating}</span>
                    <span className="text-slate-500 font-normal">({project.reviewsCount})</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onLaunchSandbox(project)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'تشغيل المعاينة المباشرة داخل التطبيق' : 'Launch Preview'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('store')}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
                    title={isRtl ? 'التفاصيل والطلب' : 'Details'}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Platform Guarantees Banner */}
      <section aria-label="Platform Guarantees" className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-right">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm md:text-base">{isRtl ? 'تملك كامل للكود المصدري' : 'Full Source Code Ownership'}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{isRtl ? 'حرية استضافة بدون قيود شهرية إجبارية' : 'Host on your own servers with no locks'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm md:text-base">{isRtl ? 'محرك PWA يعمل بلا إنترنت' : 'PWA Offline Ready'}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{isRtl ? 'تخزين ذكي وتشغيل فوري كتطبيق أصلي' : 'Native app feel with Service Worker cache'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm md:text-base">{isRtl ? 'دعم فني وتدريب معتمد' : 'Verified Engineering Support'}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{isRtl ? 'مرافقة تقنية مستمرة لضمان نجاحك' : 'Direct technical assistance & onboarding'}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
