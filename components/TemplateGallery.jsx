/**
 * Next.js Project Structure Identifier:
 * components/TemplateGallery.jsx
 * 
 * Project Identity: ليرن ويب | Lern Web
 * Purpose: Template Gallery component allowing users to filter, preview, and select
 *          from various website starter templates (E-Commerce, Corporate, SaaS AI,
 *          Real Estate, Healthcare, Restaurant Menu, News Media, LMS Academy),
 *          which instantaneously populates the Sandbox preview environment.
 */

import React, { useState } from 'react';
import { 
  Sparkles, Play, Eye, ShoppingCart, Building2, Cpu, Home, 
  Stethoscope, Utensils, Newspaper, GraduationCap, CheckCircle2, 
  Search, Filter, ArrowRight, ArrowLeft, Layers, ShieldCheck, Zap
} from 'lucide-react';

export const STARTER_TEMPLATES = [
  {
    id: 'template-ecommerce-1',
    category: 'ecommerce',
    titleAr: 'متجر التجزئة والسلة الذكية',
    titleEn: 'Smart E-Commerce Storefront',
    badgeAr: 'متجر إلكتروني',
    badgeEn: 'E-Commerce',
    taglineAr: 'متجر متكامل مع سلة تسوق حية وسداد آمن بالمحافظ الرقمية',
    taglineEn: 'Full-featured online store with live cart & local wallet checkout',
    descriptionAr: 'قالب متجر إلكتروني احترافي جاهز للإطلاق فوراً. يتضمن معالجة سلة التسوق، معروض المنتجات، كود الكوبونات، وإشعار طلبات الفواتير عبر المحافظ الإلكترونية.',
    descriptionEn: 'Turnkey online store with dynamic shopping cart, product catalog showcase, coupon codes, and local mobile wallet payment routing.',
    theme: 'emerald',
    accentColor: '#10b981',
    icon: ShoppingCart,
    techStack: ['Next.js', 'Tailwind CSS', 'PWA Engine', 'Vodafone Cash'],
    featuresAr: [
      'سلة تسوق تفاعلية تحدّث الكميات لحظياً',
      'بوابة دفع مدمجة بالمحافظ الإلكترونية المحلية',
      'تتبع حالة الشحن ورقم الطلب المرجعي',
      'توافق كامل مع الهواتف وشاشات اللمس'
    ],
    featuresEn: [
      'Interactive cart with real-time quantity calculation',
      'Integrated local mobile wallet checkout',
      'Shipment order tracking with reference numbers',
      '100% Mobile & Touch-screen responsive'
    ],
    sandboxConfig: {
      category: 'ecommerce',
      centerName: 'متجر ليرن ويب الفاخر | Lern Web Store',
      theme: 'emerald',
      bannerText: '🎉 خصم 20% لفترة محدودة على جميع المنتجات باستخدام كود LERN20',
      activeCourse: 'سماعات بلوتوث عازلة للضوضاء',
      studentCount: 3890,
      tutorName: 'فريق الدعم والخدمات'
    }
  },
  {
    id: 'template-corporate-1',
    category: 'corporate',
    titleAr: 'شركة البرمجيات والحلول السحابية',
    titleEn: 'Corporate Tech & Software Agency',
    badgeAr: 'موقع شركات',
    badgeEn: 'Corporate',
    taglineAr: 'موقع رسمي واستشاري لاستعراض أعمال الشركات وحجز الجلسات',
    taglineEn: 'Enterprise portal with service portfolio and consultation booking',
    descriptionAr: 'واجهة فاخرة للشركات ووكالات التقنية تشمل بروفايل الخدمات، نموذج طلب عروض الأسعار، استعراض المشاريع السابقة، وحجز المواعيد الاستشارية.',
    descriptionEn: 'Sleek enterprise site designed for consultancies and tech agencies featuring service catalogs, proposal requests, and consultation calendars.',
    theme: 'ocean',
    accentColor: '#3a86ff',
    icon: Building2,
    techStack: ['Next.js', 'Tailwind CSS', 'Edge API', 'Calendar Sync'],
    featuresAr: [
      'حجز مواعيد استشارة تقنية فورية',
      'معرض شركاء النجاح والمشاريع المنجزة',
      'نموذج استقبال طلبات دراسات الجدوى',
      'تصميم أنيق متوافق مع هوية المؤسسات'
    ],
    featuresEn: [
      'Instant strategy call appointment booking',
      'Portfolio & client partner showcase',
      'RFQ & feasibility study request forms',
      'Polished executive brand identity layout'
    ],
    sandboxConfig: {
      category: 'corporate',
      centerName: 'شركة ليرن ويب للحلول السحابية | Lern Web Enterprise',
      theme: 'ocean',
      bannerText: '🚀 نساعد المؤسسات والشركات الكبرى على التحول الرقمي الكامل مع ضمان سرعة Edge',
      activeCourse: 'استشارات التحول الرقمي والذكاء الاصطناعي',
      studentCount: 420,
      tutorName: 'مستشار التقنية الرئيسي'
    }
  },
  {
    id: 'template-saas-ai-1',
    category: 'saas_ai',
    titleAr: 'منصة SaaS ومحرك الذكاء الاصطناعي',
    titleEn: 'Generative AI & SaaS Studio',
    badgeAr: 'تطبيق SaaS & AI',
    badgeEn: 'SaaS & AI',
    taglineAr: 'استوديو ذكاء اصطناعي تفاعلي مع باقات اشتراكات ومؤشر توكينات',
    taglineEn: 'Interactive AI playground with subscription plans & usage telemetry',
    descriptionAr: 'قالب سحابي لتطبيقات الذكاء الاصطناعي التوليدي، يتضمن شاشة تجربة الأوامر (Prompt Playground)، جدول باقات الاشتراكات، ومؤشر استهلاك الـ API.',
    descriptionEn: 'Cloud-native SaaS app starter built for generative AI tools, prompt engineering sandboxes, tiered subscription pricing, and real-time usage meters.',
    theme: 'midnight',
    accentColor: '#8b5cf6',
    icon: Cpu,
    techStack: ['Next.js', 'Gemini AI API', 'Tailwind CSS', 'Edge Functions'],
    featuresAr: [
      'مختبر تجربة الأوامر والتوليد الذكي الفوري',
      'شاشة استهلاك الـ Tokens وقياس الضغط',
      'جدول باقات واشتراكات شهرية وسنوية',
      'توليد استجابات بسرعة لاتنسي 180ms'
    ],
    featuresEn: [
      'Interactive prompt playground with live output',
      'Real-time token telemetry & usage gauge',
      'Tiered pricing & subscription billing table',
      'Sub-200ms ultra-low latency response engine'
    ],
    sandboxConfig: {
      category: 'saas_ai',
      centerName: 'منصة الذكاء الاصطناعي التوليدي | AI Studio v4.0',
      theme: 'midnight',
      bannerText: '✨ تم تحديث نموذج الذكاء الاصطناعي مع تحسين سرعة المعالجة بنسبة 40%',
      activeCourse: 'محرك أتمتة الوظائف والنصوص',
      studentCount: 15400,
      tutorName: 'مهندس الذكاء الاصطناعي'
    }
  },
  {
    id: 'template-realestate-1',
    category: 'real_estate',
    titleAr: 'البوابة العقارية وحجز المعاينات',
    titleEn: 'Real Estate & Property Portal',
    badgeAr: 'بوابة عقارات',
    badgeEn: 'Real Estate',
    taglineAr: 'دليل عقاري فاخر لعرض الوحدات وحساب الأقساط وحجز الجولات',
    taglineEn: 'Property marketplace with mortgage calculator & tour booking',
    descriptionAr: 'قالب مخصص للشركات العقارية والمسوقين، يحتوي على فلترة الوحدات السكنية والتجارية، صور الفيلات والشقق، وحاسبة التمويل العقاري.',
    descriptionEn: 'Comprehensive real estate portal with residential/commercial property filters, high-res unit showcases, and interactive mortgage payment estimators.',
    theme: 'amber',
    accentColor: '#f59e0b',
    icon: Home,
    techStack: ['Next.js', 'Tailwind CSS', 'Mortgage Engine', 'Map Picker'],
    featuresAr: [
      'حجز معاينة ميدانية للفيلا والشقق',
      'حاسبة التمويل والأقساط الشهرية',
      'عرض المواصفات: المساحة، الغرف، الموقع',
      'ربط مباشر مع مستشار المبيعات عبر واتساب'
    ],
    featuresEn: [
      'On-site tour appointment booking',
      'Interactive mortgage & monthly installment estimator',
      'Detailed specs: sqm, bedrooms, amenities',
      'Direct WhatsApp connection to sales advisors'
    ],
    sandboxConfig: {
      category: 'real_estate',
      centerName: 'المجموعة العقارية الحديثة | Premier Real Estate',
      theme: 'amber',
      bannerText: '🏡 احجز وحدتك الفاخرة الآن واستفد من خصم الرواد ومقدم 5% فقط',
      activeCourse: 'مشروع الفيلات المستقلة بالشيخ زايد',
      studentCount: 1280,
      tutorName: 'مستشار العقارات الرئيسي'
    }
  },
  {
    id: 'template-medical-1',
    category: 'medical',
    titleAr: 'المجمع الطبي وحجز العيادات',
    titleEn: 'Healthcare & Medical Clinic Portal',
    badgeAr: 'مجمع طبي',
    badgeEn: 'Healthcare',
    taglineAr: 'منصة حجز المواعيد للعيادات والاستشارات مع مواعيد الأطباء',
    taglineEn: 'Doctor appointment scheduler with specialty categories',
    descriptionAr: 'قالب متكامل للعيادات والمراكز الطبية والمستشفيات، يسمح للمرضى باختيار التخصص الطبي، تحديد الطبيب المناسب، وحجز موعد الكشف.',
    descriptionEn: 'Turnkey clinic & healthcare suite allowing patients to select medical specialties, view doctor credentials, and schedule consultation slots.',
    theme: 'emerald',
    accentColor: '#10b981',
    icon: Stethoscope,
    techStack: ['Next.js', 'Tailwind CSS', 'Appointment Engine', 'SMS/WA Alerts'],
    featuresAr: [
      'جدول مواعيد دقيق وحجز كشف أونلاين',
      'عرض تقييمات وخبرات الأطباء والاستشاريين',
      'خط طوارئ 24/7 مع إشعار فوري',
      'سجل طبي مصغر للزيارات المسبقة'
    ],
    featuresEn: [
      'Precision online appointment slot scheduler',
      'Doctor credentials & patient review badges',
      '24/7 Hotline bar with instant dispatch',
      'Micro medical record visit tracker'
    ],
    sandboxConfig: {
      category: 'medical',
      centerName: 'المجمع الطبي المتخصص | Care Medical Center',
      theme: 'emerald',
      bannerText: '🩺 تفعيل خدمة الاستشارات الطبية السريعة والحجز أونلاين لتوفير وقت الانتظار',
      activeCourse: 'عيادة جراحة القلب والأوعية الدموية',
      studentCount: 5200,
      tutorName: 'كبير أطباء المجمع'
    }
  },
  {
    id: 'template-hospitality-1',
    category: 'hospitality',
    titleAr: 'المنيو الرقمي وحجز الطاولات',
    titleEn: 'Restaurant QR Menu & Delivery',
    badgeAr: 'منيو مطاعم',
    badgeEn: 'QR Menu',
    taglineAr: 'منيو إلكتروني سريع يعمل بالـ QR للطلب المباشر أو الدليفري',
    taglineEn: 'Rapid digital menu with table QR scan and direct delivery',
    descriptionAr: 'قالب مطاعم وكافيهات حديث يعمل عبر مسح رمز QR من الطاولة أو الطلب السريع أونلاين مع تحويل الطلبات مباشرة لواتساب المطبخ.',
    descriptionEn: 'Modern hospitality menu layout supporting optical QR table scanning, item customization, and instant order dispatch to kitchen WhatsApp.',
    theme: 'amber',
    accentColor: '#f59e0b',
    icon: Utensils,
    techStack: ['Next.js', 'Tailwind CSS', 'QR Engine', 'WhatsApp API'],
    featuresAr: [
      'منيو رقمي سريعة ومقسم حسب الأطباق',
      'طلب مباشر من الطاولة بدون انتظار الجرسون',
      'إرسال تفاصيل الوجبات لواتساب المطعم',
      'دعم تعديل المكونات والطلبات الخاصة'
    ],
    featuresEn: [
      'Categorized digital menu with dish previews',
      'Direct table ordering without waiter delay',
      'Automated order summary to kitchen WhatsApp',
      'Item add-ons & special request toggles'
    ],
    sandboxConfig: {
      category: 'hospitality',
      centerName: 'مطعم وجراند كافيه ليرن ويب | Grand Gourmet',
      theme: 'amber',
      bannerText: '🍽️ اطلب وجبتك المفضلة الآن واستلمها فوراً أو احجز طاولتك بالصالة',
      activeCourse: 'وجبة برجر دبل تشيز صوص فاخر',
      studentCount: 9400,
      tutorName: 'الشيف الرئيسي'
    }
  },
  {
    id: 'template-news-1',
    category: 'news_media',
    titleAr: 'المجلة الإخبارية والبوابة الصحفية',
    titleEn: 'News Portal & Digital Magazine',
    badgeAr: 'بوابة إخبارية',
    badgeEn: 'News Portal',
    taglineAr: 'بوابة نشر صحفية مع شريط أخبار عاجلة ومقالات تفاعلية',
    taglineEn: 'Publishing portal with breaking news ticker & article feeds',
    descriptionAr: 'قالب المجلات والصحف الرقمية، يتضمن شريط الأخبار العاجلة المتحرك، التغطيات الحية، مقاطع الفيديو، ومشاركة المقالات.',
    descriptionEn: 'Digital magazine and news publishing template equipped with breaking news ticker, live feeds, embedded media, and social sharing.',
    theme: 'midnight',
    accentColor: '#8b5cf6',
    icon: Newspaper,
    techStack: ['Next.js', 'Tailwind CSS', 'RSS Feed', 'PWA Offline'],
    featuresAr: [
      'شريط أخبار عاجلة حي ومحدث لحظياً',
      'عرض المقالات مع عداد المشاهدات ووقت القراءة',
      'دعم وضع القراءة المريح والمظلم',
      'مشاركة المقالات على جميع المنصات'
    ],
    featuresEn: [
      'Live breaking news ticker bar',
      'Article reader with view counter & read time',
      'Distraction-free dark mode reading option',
      'One-click social media article sharing'
    ],
    sandboxConfig: {
      category: 'news_media',
      centerName: 'بوابة أخبار التقنية اليوم | Tech News Daily',
      theme: 'midnight',
      bannerText: '🔴 عاجل: تغطية صحفية حية لأحدث التطورات الاقتصادية والتكنولوجية العالمية',
      activeCourse: 'تقرير حصري: ثورة الخوادم السحابية والـ Edge',
      studentCount: 34000,
      tutorName: 'رئيس التحرير'
    }
  },
  {
    id: 'template-lms-1',
    category: 'lms_edu',
    titleAr: 'الأكاديمية والمنظومة التعليمية',
    titleEn: 'Smart LMS & Tutor Academy',
    badgeAr: 'أكاديمية تعليمية',
    badgeEn: 'Smart LMS',
    taglineAr: 'منظومة إدارة المراكز والسناتر مع اختبارات وحضور بالـ QR',
    taglineEn: 'Unified learning management system with AI quizzes & QR check-in',
    descriptionAr: 'قالب المنظومة التعليمية الشاملة للمعلمين والسناتر: إدارة الحصص، الامتحانات المؤمنة بالذكاء الاصطناعي، ومسح بطاقات الحضور بالباركود.',
    descriptionEn: 'Enterprise learning platform built for tutors & educational hubs: cohort management, AI-graded examinations, and sub-200ms optical QR attendance.',
    theme: 'ocean',
    accentColor: '#3a86ff',
    icon: GraduationCap,
    techStack: ['Next.js', 'Tailwind CSS', 'AI Quiz Engine', 'QR Scanner'],
    featuresAr: [
      'بوابة الحضور السريعة بالباركود للطلاب',
      'امتحانات إلكترونية وتصحيح آلي فوري',
      'إرسال إشعارات الحضور لأولياء الأمور',
      'قاعة محاضرات ذكية وبنوك أسئلة'
    ],
    featuresEn: [
      'Millisecond optical QR student check-in',
      'AI-graded online exams with instant scoring',
      'Automated parent WhatsApp attendance dispatch',
      'Interactive smart classroom & question banks'
    ],
    sandboxConfig: {
      category: 'lms',
      centerName: 'أكاديمية ليرن ويب المتخصصة | Lern Web Academy',
      theme: 'ocean',
      bannerText: '📢 تنبيه: تم فتح باب التسجيل لكورسات الترم الثاني وتفعيل بنك الأسئلة الشامل',
      activeCourse: 'كورس البرمجة المتقدمة والفيزياء الحديثة',
      studentCount: 1420,
      tutorName: 'أ. د. كريم المنشاوي'
    }
  }
];

export default function TemplateGallery({ 
  lang = 'ar', 
  t, 
  onSelectTemplate,
  adminSettings
}) {
  const isRtl = lang === 'ar';
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewModalTemplate, setPreviewModalTemplate] = useState(null);

  const categoriesList = [
    { id: 'all', labelAr: 'جميع القوالب', labelEn: 'All Templates' },
    { id: 'ecommerce', labelAr: 'متاجر إلكترونية', labelEn: 'E-Commerce' },
    { id: 'corporate', labelAr: 'شركات وأعمال', labelEn: 'Corporate' },
    { id: 'saas_ai', labelAr: 'SaaS وذكاء اصطناعي', labelEn: 'SaaS & AI' },
    { id: 'real_estate', labelAr: 'عقارات', labelEn: 'Real Estate' },
    { id: 'medical', labelAr: 'طبي وعيادات', labelEn: 'Healthcare' },
    { id: 'hospitality', labelAr: 'مطاعم ومنيو', labelEn: 'Restaurant Menu' },
    { id: 'news_media', labelAr: 'صحافة وإعلام', labelEn: 'News Media' },
    { id: 'lms_edu', labelAr: 'أكاديميات وتعليم', labelEn: 'Education' }
  ];

  const filteredTemplates = STARTER_TEMPLATES.filter((tpl) => {
    const matchesCat = selectedCategory === 'all' || tpl.category === selectedCategory || (selectedCategory === 'lms_edu' && (tpl.category === 'lms' || tpl.category === 'lms_edu'));
    const title = isRtl ? tpl.titleAr : tpl.titleEn;
    const desc = isRtl ? tpl.descriptionAr : tpl.descriptionEn;
    const tag = isRtl ? tpl.taglineAr : tpl.taglineEn;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || 
      title.toLowerCase().includes(q) || 
      desc.toLowerCase().includes(q) || 
      tag.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleLaunch = (tpl) => {
    if (onSelectTemplate) {
      onSelectTemplate(tpl.sandboxConfig || tpl);
    }
    if (previewModalTemplate) setPreviewModalTemplate(null);
  };

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Template Gallery Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 p-6 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs md:text-sm font-semibold text-purple-300">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>{isRtl ? 'معرض قوالب الانطلاق السريعة v4.0' : 'Website Starter Template Gallery v4.0'}</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            {isRtl ? 'اختر قالبك الجاهز واختبره فوراً داخل المحاكي' : 'Choose a Starter Template & Launch in Sandbox'}
          </h2>

          <p className="text-base md:text-lg text-slate-300 leading-relaxed">
            {isRtl 
              ? 'مجموعة جاهزة من النماذج والهياكل البرمجية الكاملة للمتاجر، الشركات، منصات الذكاء الاصطناعي، العيادات، العقارات والمنيو الرقمي. بنقرة واحدة يتم تحميل القالب داخل محاكي الساندبوكس الحي لتعديله وتخصيصه بالكامل.'
              : 'A curated suite of battle-tested web starter templates for E-Commerce, Corporate agencies, SaaS AI, Healthcare clinics, Real Estate, and QR menus. One click loads the full template directly into the live sandbox for customization.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs md:text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-slate-200 font-medium">{isRtl ? 'تحميل تلقائي سريع للمحاكي' : 'Instant 1-Click Sandbox Injection'}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? 'كود غير مضغوط قابل للنسخ والتعديل' : 'Clean Unminified Next.js Source'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-xl">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${isRtl ? 'right-4' : 'left-4'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'ابحث في قوالب المتاجر، الشركات، العقارات، والذكاء الاصطناعي...' : 'Search templates by category or name...'}
            className={`w-full rounded-2xl border border-slate-800 bg-slate-900/90 py-3.5 text-sm md:text-base text-slate-100 placeholder-slate-500 transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${isRtl ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'}`}
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={selectedCategory === cat.id ? { backgroundColor: adminSettings?.primaryColor || '#8b5cf6' } : {}}
              className={`rounded-xl px-3.5 py-2 text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'text-white shadow-lg ring-2 ring-purple-500/40'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {isRtl ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tpl) => {
          const Icon = tpl.icon;
          const title = isRtl ? tpl.titleAr : tpl.titleEn;
          const badge = isRtl ? tpl.badgeAr : tpl.badgeEn;
          const tagline = isRtl ? tpl.taglineAr : tpl.taglineEn;
          const description = isRtl ? tpl.descriptionAr : tpl.descriptionEn;
          const features = isRtl ? tpl.featuresAr : tpl.featuresEn;

          return (
            <div
              key={tpl.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-900/20"
            >
              {/* Top Accent line */}
              <div 
                className="h-1.5 w-full"
                style={{ backgroundColor: tpl.accentColor }}
              />

              <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Header Badges & Icon */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <span 
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-bold text-white uppercase tracking-wider"
                        style={{ backgroundColor: tpl.accentColor }}
                      >
                        {badge}
                      </span>
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                        {title}
                      </h3>
                    </div>

                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-slate-700/60"
                      style={{ backgroundColor: `${tpl.accentColor}20`, color: tpl.accentColor }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <p className="text-xs md:text-sm font-semibold text-slate-200">
                    {tagline}
                  </p>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {description}
                  </p>

                  {/* Features Bullet List */}
                  <div className="space-y-1.5 pt-1">
                    {features.slice(0, 3).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {tpl.techStack.map((tech, tIdx) => (
                      <span 
                        key={tIdx} 
                        className="rounded-md bg-slate-950 border border-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setPreviewModalTemplate(tpl)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'المواصفات والتفاصيل' : 'Preview Details'}</span>
                  </button>

                  <button
                    onClick={() => handleLaunch(tpl)}
                    style={{ backgroundColor: adminSettings?.primaryColor || '#8b5cf6' }}
                    className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs md:text-sm font-bold text-white shadow-lg hover:opacity-90 transition active:scale-95 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isRtl ? 'تشغيل بالمحاكي' : 'Launch Template'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Template Detailed Modal */}
      {previewModalTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 shadow-2xl text-slate-100 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span 
                  className="inline-block rounded-md px-2.5 py-0.5 text-xs font-bold text-white"
                  style={{ backgroundColor: previewModalTemplate.accentColor }}
                >
                  {isRtl ? previewModalTemplate.badgeAr : previewModalTemplate.badgeEn}
                </span>
                <h3 className="text-2xl font-bold text-white">
                  {isRtl ? previewModalTemplate.titleAr : previewModalTemplate.titleEn}
                </h3>
              </div>
              <button
                onClick={() => setPreviewModalTemplate(null)}
                className="rounded-xl border border-slate-800 bg-slate-800 p-2 text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isRtl ? 'عن هذا القالب' : 'About this Template'}
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {isRtl ? previewModalTemplate.descriptionAr : previewModalTemplate.descriptionEn}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isRtl ? 'الوظائف والميزات الفريدة' : 'Key Built-in Features'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(isRtl ? previewModalTemplate.featuresAr : previewModalTemplate.featuresEn).map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-xl bg-slate-950 p-2.5 border border-slate-800 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setPreviewModalTemplate(null)}
                className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                {isRtl ? 'إغلاق' : 'Close'}
              </button>
              <button
                onClick={() => handleLaunch(previewModalTemplate)}
                className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-xs md:text-sm font-bold text-white shadow-lg hover:bg-purple-500 transition"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isRtl ? 'تشغيل القالب فوراً في المحاكي' : 'Load into Sandbox Simulator'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
