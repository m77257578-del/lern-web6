/**
 * Project: ليرن ويب | Lern Web
 * File: src/data/storeData.ts
 * Universal Web & Software Development Marketplace Catalog
 */

export interface AppItem {
  id: string;
  category: 'ecommerce' | 'corporate' | 'saas_ai' | 'lms_edu' | 'real_estate' | 'medical' | 'hospitality' | 'news_media' | 'lms' | 'stem' | 'ai' | 'operations' | string;
  titleAr: string;
  titleEn: string;
  badgeAr: string;
  badgeEn: string;
  taglineAr: string;
  taglineEn: string;
  descriptionAr: string;
  descriptionEn: string;
  version: string;
  developer: string;
  rating: number;
  reviewsCount: number;
  accentColor: string;
  isPublished?: boolean;
  featuresAr: string[];
  featuresEn: string[];
  techStack: string[];
  priceMonthly?: string;
  priceAnnual?: string;
  priceFull?: string;
  previewUrl?: string;
  templates?: {
    id: string;
    nameAr: string;
    nameEn: string;
    badgeAr?: string;
    badgeEn?: string;
    descriptionAr: string;
    descriptionEn: string;
    previewUrl?: string;
    images: string[];
    featuresAr: string[];
    featuresEn: string[];
    priceMonthly: string;
    priceAnnual: string;
    priceFull: string;
  }[];
  screenshots: {
    titleAr: string;
    titleEn: string;
    bgGradient: string;
    mockupType: 'dashboard' | 'code' | 'quiz' | 'qr' | 'analytics';
    imageUrl?: string;
  }[];
  downloadUrl: string;
  distributionLink: string;
  defaultSandboxConfig: {
    centerName: string;
    theme: 'ocean' | 'midnight' | 'emerald' | 'amber';
    activeCourse: string;
    hasQuiz: boolean;
    bannerText: string;
    tutorName?: string;
  };
}

export const APPS_DATA: AppItem[] = [
  // 1. E-Commerce Category
  {
    id: 'ecommerce-saas-store',
    category: 'ecommerce',
    titleAr: 'منظومة المتاجر الإلكترونية الشاملة (SaaS E-Commerce Hub)',
    titleEn: 'Multi-Vendor SaaS E-Commerce Platform',
    badgeAr: 'متجر إلكتروني متكامل',
    badgeEn: 'Enterprise E-Commerce',
    taglineAr: 'منصة تجارة إلكترونية متكاملة لبيع المنتجات الرقمية والفيزيائية مع إدارة المخزون وبوابات الدفع.',
    taglineEn: 'Complete multi-vendor e-commerce ecosystem with automated inventory, checkout flows, and analytics.',
    descriptionAr: 'منظومة تجارية متكاملة لإنشاء المتاجر الإلكترونية الاحترافية، تتيح للتاجر عرض المنتجات، إدارة المخزون اللحظي، تتبع الشحنات، واستقبال المدفوعات عبر محفظة فودافون كاش، انستاباي، وبطاقات الائتمان مع دعم كامل لتطبيقات الهاتف PWA.',
    descriptionEn: 'Comprehensive commerce engine enabling merchants to launch online storefronts, manage live inventory, track fulfillment, and accept digital payments with native PWA mobile app support.',
    version: 'v3.2.0',
    developer: 'Lern Web Commerce Lab',
    rating: 4.9,
    reviewsCount: 245,
    accentColor: '#0284c7',
    featuresAr: [
      'إدارة المنتجات، الأقسام، والمخزون اللحظي مع تنبيهات نفاد الكمية',
      'سلة تسوق ذكية وبوابة إتمام طلب (Checkout) سلسة وسريعة',
      'لوحة تحكم للمبيعات والأرباح مع رسوم بيانية تفصيلية لحركة الطلبات',
      'دعم الشحن الدولي والمحلي وحساب ضرائب الشحن تلقائياً'
    ],
    featuresEn: [
      'Real-time product catalog, category hierarchy, and inventory alerts',
      'Optimized one-page checkout cart with secure payment routing',
      'Executive sales analytics dashboard tracking revenue and conversion rates',
      'Automated shipping rate calculation and tax compliance rules'
    ],
    techStack: ['Next.js 14', 'Tailwind CSS', 'Stripe / Wallets', 'PostgreSQL / SQLite', 'PWA Engine'],
    screenshots: [
      { titleAr: 'لوحة مبيعات المتجر والطلبات', titleEn: 'Store Sales & Orders Ledger', bgGradient: 'from-sky-950 to-blue-900', mockupType: 'dashboard' },
      { titleAr: 'تحليلات الأداء المالي وسلة التسوق', titleEn: 'Checkout & Financial Telemetry', bgGradient: 'from-blue-900 to-indigo-950', mockupType: 'analytics' }
    ],
    downloadUrl: 'https://github.com/lernweb/ecommerce-saas.git',
    distributionLink: 'https://lernweb.com/deploy/ecommerce',
    defaultSandboxConfig: {
      centerName: 'متجر ليرن ويب الرقمي والتجاري',
      theme: 'ocean',
      activeCourse: 'منتجات العصر الرقمي والبرمجيات',
      hasQuiz: false,
      bannerText: 'خصم 20% على كافة المنتجات الرقمية والفيزيائية لفترة محدودة!',
      tutorName: 'مدير المتجر التجاري'
    }
  },

  // 2. Corporate Business Portfolios Category
  {
    id: 'agency-corporate-pro',
    category: 'corporate',
    titleAr: 'منصة الشركات والمؤسسات التجارية (Corporate Agency Pro)',
    titleEn: 'Corporate Business & Agency Portfolio Engine',
    badgeAr: 'موقع شركات احترافي',
    badgeEn: 'Corporate Portal',
    taglineAr: 'بوابة إلكترونية متكاملة للشركات والمؤسسات لعرض الخدمات، استقبال طلبات العملاء، وحجز المواعيد.',
    taglineEn: 'Premium corporate web engine featured for agencies, enterprises, and service companies with CRM routing.',
    descriptionAr: 'منصة شركات حديثة توفر للشركات التجارية واجهة تعريفية برمجية رفيعة المستوى، تشمل استعراض الخدمات، معرض الأعمال والمشاريع السابقة، حجز الاستشارات الآلية، وبوابة تواصل مع العملاء مرتبطة بنظام إدارة علاقات العملاء (CRM).',
    descriptionEn: 'Modern enterprise solution empowering corporate brands to showcase specialized services, portfolio case studies, automated consult booking, and unified client inquiry CRM pipelines.',
    version: 'v2.6.0',
    developer: 'Lern Web Enterprise Studio',
    rating: 4.9,
    reviewsCount: 198,
    accentColor: '#2563eb',
    featuresAr: [
      'واجهة رئيسية متجاوبة تعكس الهوية البصرية للشركة',
      'نظام حجز مواعيد واستشارات مع تقويم تفاعلي وإشعارات بريدية',
      'معرض أعمال تفاعلي (Portfolio Showcase) مع تصنيف المشاريع',
      'نماذج طلب عروض أسعار (RFQ) مرتبطة بالواتساب والبريد الإلكتروني'
    ],
    featuresEn: [
      'Responsive corporate branding UI with customizable identity shaders',
      'Automated appointment scheduling calendar with instant email notifications',
      'Interactive portfolio project gallery with dynamic tag filtering',
      'Request-for-Quote (RFQ) forms with direct WhatsApp and email integration'
    ],
    techStack: ['Next.js 14', 'Tailwind CSS', 'Framer Motion', 'Cloud SQL'],
    screenshots: [
      { titleAr: 'الواجهة الرئيسية للشركة والخدمات', titleEn: 'Corporate Landing Showcase', bgGradient: 'from-blue-950 to-slate-900', mockupType: 'dashboard' },
      { titleAr: 'بوابة حجز الاستشارات وتتبع العملاء', titleEn: 'Consultation Booking Engine', bgGradient: 'from-indigo-950 to-blue-900', mockupType: 'analytics' }
    ],
    downloadUrl: 'https://github.com/lernweb/corporate-agency-pro.git',
    distributionLink: 'https://lernweb.com/deploy/corporate-agency',
    defaultSandboxConfig: {
      centerName: 'شركة ليرن ويب للحلول البرمجية والاستشارات',
      theme: 'ocean',
      activeCourse: 'خدمات التحول الرقمي وتطوير السحاب',
      hasQuiz: false,
      bannerText: 'مرحباً بكم في بوابة خدمات الشركات: احجز جلسة استشارة مجانية اليوم!',
      tutorName: 'مستشار التحول الرقمي'
    }
  },

  // 3. SaaS & Generative AI Systems Category
  {
    id: 'ai-content-generator',
    category: 'saas_ai',
    titleAr: 'منصة توليد المحتوى والتسويق بالذكاء الاصطناعي (AI Copywriter SaaS)',
    titleEn: 'AI Content & Marketing Copywriting SaaS',
    badgeAr: 'مولد محتوى بالذكاء الاصطناعي',
    badgeEn: 'Generative AI SaaS',
    taglineAr: 'منصة ذكاء اصطناعي متكاملة لتوليد المقالات، إعلانات السوشيال ميديا، والردود التسويقية تلقائياً.',
    taglineEn: 'AI-powered writing assistant for generating blogs, ad copy, social media posts, and landing page texts.',
    descriptionAr: 'أداة سحابية متقدمة لتوليد النصوص التسويقية الاحترافية والمحتوى الإعلاني بلغات متعددة بضغطة زر واحدة. تدعم توليد مقالات تحسين محركات البحث (SEO)، منشورات فيسبوك وانستجرام، وإعلانات جوجل.',
    descriptionEn: 'Advanced cloud utility generating professional marketing copy, blog outlines, and ad scripts in seconds. Powered by modern Gemini AI models.',
    version: 'v2.8.0',
    developer: 'Cognitive GenAI Labs',
    rating: 4.9,
    reviewsCount: 389,
    accentColor: '#8b5cf6',
    featuresAr: [
      'توليد مقالات تحسين محركات البحث (SEO) متكاملة الهياكل',
      'صياغة إعلانات فيسبوك وتويتر وجوجل الجذابة لزيادة المبيعات',
      'ترجمة وتلخيص النصوص الطويلة بدقة فائقة وسرعة قياسية'
    ],
    featuresEn: [
      'SEO-optimized blog article generator with structural subheadings',
      'High-converting ad copy generator for social media marketing',
      'Instant document summarization and multi-language translation'
    ],
    techStack: ['Gemini 3.8 Flash API', 'Next.js', 'Tailwind CSS', 'Vercel Edge'],
    screenshots: [
      { titleAr: 'محرر ومولد النصوص الذكي', titleEn: 'AI Copywriting Studio', bgGradient: 'from-purple-950 to-slate-900', mockupType: 'code' },
      { titleAr: 'تحليلات المحتوى المُولّد', titleEn: 'Content Analytics Hub', bgGradient: 'from-indigo-950 to-purple-900', mockupType: 'dashboard' }
    ],
    downloadUrl: 'https://github.com/lernweb/ai-copywriter.git',
    distributionLink: 'https://lernweb.com/deploy/ai-copywriter',
    defaultSandboxConfig: {
      centerName: 'مختبر توليد المحتوى والتسويق الذكي',
      theme: 'midnight',
      activeCourse: 'مساعد التسويق الذكي والذكاء التوليدي',
      hasQuiz: false,
      bannerText: 'تم توليد أكثر من 15,000 مقال وإعلان تسويقي بنجاح!',
      tutorName: 'مساعد الذكاء الاصطناعي'
    }
  },

  // 4. Real Estate Portals Category
  {
    id: 'realestate-property-portal',
    category: 'real_estate',
    titleAr: 'منصة العقارات والحجوزات الفندقية (Real Estate & Property Portal)',
    titleEn: 'Real Estate Property & Listing Management System',
    badgeAr: 'بوابة عقارات وحجوزات',
    badgeEn: 'Real Estate Portal',
    taglineAr: 'منصة تسويق عقاري وإدارة وحدات سكنية وتجارية مع خرائط تفاعلية وحجز معاينات.',
    taglineEn: 'Property listing engine featured with interactive search maps, agent routing, and viewing schedules.',
    descriptionAr: 'منظومة عقارية متكاملة لتسويق وإدارة العقارات والمشاريع السكنية والتجارية، توفر محرك بحث عقاري متقدم، تصفية حسب السعر والمنطقة، تصفح الصور عالية الجودة، وحجز معاينات فورية مع المكاتب العقارية.',
    descriptionEn: 'Comprehensive real estate portal enabling property developers and brokerages to showcase listings, manage agent leads, filter properties, and schedule virtual or physical viewings.',
    version: 'v2.1.0',
    developer: 'Lern Web RealTech Systems',
    rating: 4.8,
    reviewsCount: 167,
    accentColor: '#059669',
    featuresAr: [
      'محرك بحث وتصفية العقارات (بيع، إيجار، تجاري) حسب السعر والمنطقة',
      'معرض صور وفيديوهات عالية الجودة للوحدات السكنية والتجارية',
      'نظام حجز معاينات عقارية وتواصل مباشر مع الوكيل عبر الواتساب',
      'حاسبة التمويل العقاري والأقساط الشهيرة المتوافقة مع الشريعة'
    ],
    featuresEn: [
      'Property filter engine (sale, rent, commercial) by price range and area',
      'High-resolution media galleries with 360 virtual tour links',
      'Automated viewing request scheduler routed to designated agents',
      'Integrated mortgage and monthly installment estimation calculator'
    ],
    techStack: ['Next.js 14', 'Tailwind CSS', 'Mapbox / Google Maps API', 'Cloud SQL'],
    screenshots: [
      { titleAr: 'دليل الوحدات العقارية والبحث', titleEn: 'Property Listing Directory', bgGradient: 'from-emerald-950 to-slate-900', mockupType: 'dashboard' },
      { titleAr: 'بوابة حجز معاينة وتواصل الوكيل', titleEn: 'Agent Lead & Viewing Scheduler', bgGradient: 'from-teal-900 to-emerald-950', mockupType: 'analytics' }
    ],
    downloadUrl: 'https://github.com/lernweb/realestate-portal.git',
    distributionLink: 'https://lernweb.com/deploy/realestate',
    defaultSandboxConfig: {
      centerName: 'منصة ليرن ويب العقارية للتسويق والخدمات',
      theme: 'emerald',
      activeCourse: 'وحدات متميزة للبيع والإيجار الشديد',
      hasQuiz: false,
      bannerText: 'عروض حصرية: خومات وتمويل عقاري ميسر حتى 10 سنوات!',
      tutorName: 'مستشار العقارات والخدمات'
    }
  },

  // 5. Medical & Healthcare Category
  {
    id: 'clinic-healthcare-system',
    category: 'medical',
    titleAr: 'منظومة المستشفيات والعيادات الطبية (Smart Clinic & Healthcare)',
    titleEn: 'Smart Medical Clinic & Patient Management System',
    badgeAr: 'نظام إدارة عيادات',
    badgeEn: 'Healthcare System',
    taglineAr: 'منصة حجز كشوفات طبية، إدارة سجلات المرضى، وتنظيم مواعيد الأطباء أونلاين.',
    taglineEn: 'Complete clinical workflow suite managing patient records, online appointments, and digital prescriptions.',
    descriptionAr: 'نظام طبي متكامل لإدارة العيادات والمراكز الطبية والمستشفيات، يتيح للمرضى حجز الكشوفات أونلاين، تنظيم جدول مواعيد الأطباء، إدارة السجلات الطبية الإلكترونية (EMR)، وإصدار الروشتات الرقمية.',
    descriptionEn: 'Enterprise clinical management platform streamlining patient check-ins, online appointment scheduling, electronic medical records (EMR), and automated digital prescription dispatches.',
    version: 'v2.5.0',
    developer: 'Lern Web HealthTech Lab',
    rating: 4.9,
    reviewsCount: 210,
    accentColor: '#e11d48',
    featuresAr: [
      'جدول كشوفات حية وحجز أونلاين للمرضى مع تذكير تلقائي عبر الرسائل',
      'ملف طبي إلكتروني موحد لكل مريض يشمل التاريخ المرضي والروشتات',
      'طباعة الروشتات الرقمية والتحاليل المطلوبة بضغطة زر واحدة',
      'لوحة تحكم مالية لتحصيل قيمة الكشوفات والاستشارات الطبية'
    ],
    featuresEn: [
      'Live appointment booking calendar with automated SMS/WhatsApp reminders',
      'Unified Electronic Medical Record (EMR) tracking patient health histories',
      'Digital prescription generator and diagnostic lab request forms',
      'Revenue cycle analytics tracking consultation fees and insurance claims'
    ],
    techStack: ['Next.js 14', 'Tailwind CSS', 'PWA Engine', 'PostgreSQL'],
    screenshots: [
      { titleAr: 'جدول حجز المواعيد والكشوفات الطبية', titleEn: 'Clinical Appointment Calendar', bgGradient: 'from-rose-950 to-slate-900', mockupType: 'dashboard' },
      { titleAr: 'السجل الطبي الإلكتروني للمريض', titleEn: 'Electronic Medical Record (EMR)', bgGradient: 'from-rose-900 to-indigo-950', mockupType: 'analytics' }
    ],
    downloadUrl: 'https://github.com/lernweb/smart-clinic.git',
    distributionLink: 'https://lernweb.com/deploy/smart-clinic',
    defaultSandboxConfig: {
      centerName: 'مركز ليرن ويب الطبي والعيادات التخصصية',
      theme: 'amber',
      activeCourse: 'عيادات الباطنة، الجراحة، والأطفال',
      hasQuiz: false,
      bannerText: 'مواعيد العيادات التخصصية متاحة للحجز أونلاين الآن!',
      tutorName: 'د. المدير الطبي'
    }
  },

  // 6. Hospitality & Restaurants Category
  {
    id: 'restaurant-qr-menu',
    category: 'hospitality',
    titleAr: 'منظومة المطاعم والمنيو الرقمي (Digital QR Menu & Food Order)',
    titleEn: 'Interactive Restaurant QR Menu & Food Ordering Engine',
    badgeAr: 'منيو رقمي وتأكيد طلبات',
    badgeEn: 'Hospitality System',
    taglineAr: 'قائمة طعام إلكترونية تفاعلية لكود QR مع طلبات الطاولات والدليفري المباشر.',
    taglineEn: 'Interactive QR code digital menu system supporting table orders, kitchen displays, and home delivery.',
    descriptionAr: 'منظومة حديثة للمطاعم والكافيهات تقدم منيو تفاعلي مسح كود QR من طاولة المباشر، إمكانية إضافة الوجبات إلى السلة، طلب الطعام مباشرة للمطبخ، وإرسال الطلب مع الموقع للواتساب عند الدليفري.',
    descriptionEn: 'Modern hospitality ordering system presenting table QR menus, direct kitchen display routing, cart management, and seamless delivery dispatch via WhatsApp and SMS.',
    version: 'v3.0.0',
    developer: 'Lern Web Hospitality Tech',
    rating: 4.8,
    reviewsCount: 175,
    accentColor: '#d97706',
    featuresAr: [
      'منيو رقمي سريع بالـ QR يفتح في أقل من ثانية بدون تثبيت تطبيق',
      'إدارة الأطباق، الأصناف، الصور، والأسعار مع إمكانية إخفاء النفاد',
      'طلب الطعام المباشر للطاولة أو الدليفري مع إرسال اللوكيشن تلقائياً',
      'شاشة المطبخ اللحظية (Kitchen Display) لتتبع تحضير الطلبات'
    ],
    featuresEn: [
      'Ultra-fast QR menu loading under 1s with zero app installation',
      'Dynamic menu item management, imagery, and temporary out-of-stock toggles',
      'Table ordering and home delivery checkout with automatic geolocation routing',
      'Real-time Kitchen Display System (KDS) for chef order tracking'
    ],
    techStack: ['Next.js 14', 'Tailwind CSS', 'PWA Engine', 'WebSocket / Realtime DB'],
    screenshots: [
      { titleAr: 'منيو الوجبات التفاعلي وطاولة الطلب', titleEn: 'Digital Table Menu Container', bgGradient: 'from-amber-950 to-slate-900', mockupType: 'qr' },
      { titleAr: 'شاشة المطبخ وإدارة الطلبات', titleEn: 'Kitchen Orders Telemetry', bgGradient: 'from-amber-900 to-red-950', mockupType: 'dashboard' }
    ],
    downloadUrl: 'https://github.com/lernweb/restaurant-qr-menu.git',
    distributionLink: 'https://lernweb.com/deploy/restaurant-qr',
    defaultSandboxConfig: {
      centerName: 'مطعم وكافيه ليرن ويب الضيافة',
      theme: 'amber',
      activeCourse: 'قائمة المأكولات والمشروبات المتميزة',
      hasQuiz: false,
      bannerText: 'مسح كود QR الطاولة واطلب وجبتك المفضلة فوراً!',
      tutorName: 'شيف المطعم الرئيسي'
    }
  },

  // 7. News & Media Publishing Category
  {
    id: 'news-media-portal',
    category: 'news_media',
    titleAr: 'منصة الصحافة والمجلات الإخبارية (Digital News & Media Hub)',
    titleEn: 'Digital News Portal & Editorial Publishing System',
    badgeAr: 'بوابة إخبارية ومجلة',
    badgeEn: 'Digital Media Portal',
    taglineAr: 'منصة نشر إخباري ومجلة إلكترونية متكاملة مع إعلانات سياقية وبث مباشر.',
    taglineEn: 'Modern news publishing CMS supporting breaking alerts, video embedding, and ad monetization.',
    descriptionAr: 'منظومة صحافة ونشر إلكتروني احترافية للمجلات والمواقع الإخبارية، تدعم المقالات المصورة، العاجل الفوري، تقارير الفيديو، الأقسام الإخبارية المتعددة، ومساحات إعلانية لتحقيق الأرباح.',
    descriptionEn: 'Enterprise publishing platform for digital newspapers, magazines, and blogs. Features breaking news ticker, multi-author editorial workflows, video embeds, and integrated ad spaces.',
    version: 'v2.3.0',
    developer: 'Lern Web Media Publishing',
    rating: 4.8,
    reviewsCount: 142,
    accentColor: '#7c3aed',
    featuresAr: [
      'شريط الأخبار العاجلة التفاعلي مع تنبيهات الفورية للزوار',
      'محرر مقالات صحفية متقدم يدعم الصور العالية والفيديوهات',
      'توزيع المقالات حسب الأقسام (سياسة، اقتصاد، تكنولوجيا، رياضة)',
      'جاهزية كاملة لإعلانات Google AdSense وشبكات التسويق'
    ],
    featuresEn: [
      'Breaking news ticker with instant visitor browser notifications',
      'Rich article editor supporting embedded video feeds and photo galleries',
      'Multi-category taxonomies (Tech, Business, Sports, Politics)',
      'Turnkey Google AdSense ad zones and affiliate monetization'
    ],
    techStack: ['Next.js 14 App Router', 'Tailwind CSS', 'Vercel Edge', 'Cloud SQL'],
    screenshots: [
      { titleAr: 'الصفحة الرئيسية للمجلة والأخبار', titleEn: 'News Portal Front Page', bgGradient: 'from-purple-950 to-slate-900', mockupType: 'dashboard' },
      { titleAr: 'صفحة المقال الصحفي والفيديو', titleEn: 'Article Layout & Video Feed', bgGradient: 'from-indigo-950 to-slate-950', mockupType: 'analytics' }
    ],
    downloadUrl: 'https://github.com/lernweb/news-media-portal.git',
    distributionLink: 'https://lernweb.com/deploy/news-media',
    defaultSandboxConfig: {
      centerName: 'شبكة ليرن ويب الإخبارية والإعلامية',
      theme: 'midnight',
      activeCourse: 'تقارير التكنولوجيا والابتكار الرقمي',
      hasQuiz: false,
      bannerText: 'عاجل: إطلاق المنظومة الرقمية الشاملة لجميع الأعمال ومواقع الويب!',
      tutorName: 'رئيس التحرير التنفيذي'
    }
  },

  // 8. LMS & Education Category (Educational Flagships)
  {
    id: 'lms-core-hub',
    category: 'lms_edu',
    titleAr: 'منظومة إدارة المراكز والسناتر التعليمية (LMS Core)',
    titleEn: 'LMS Core Educational Center Manager',
    badgeAr: 'النظام الأساسي المعتمد',
    badgeEn: 'Certified Flagship LMS',
    taglineAr: 'بوابة إلكترونية متكاملة لإدارة الحصص، مجموعات الطلاب، الجداول وسجلات الحضور والغياب للمراكز المدرسين.',
    taglineEn: 'Complete cloud platform for orchestrating classroom sessions, student cohorts, schedules, and fee ledgers.',
    descriptionAr: 'منظومة LMS Core صُممت خصيصاً لمواءمة المتطلبات التشغيلية الواقعية للمراكز التعليمية والسناتر. تتيح للمدرسين إنشاء بوابات خاصة بأسماء مراكزهم، إدارة المحاضرات الحضورية والأونلاين، تتبع اشتراكات وسداد الطلاب، وإصدار بطاقات باركود ذكية للدخول السريع مع إشعارات واتساب تلقائية لأولياء الأمور.',
    descriptionEn: 'Engineered specifically for tutoring centers and academies. Enables educators to deploy white-labeled portals, manage hybrid sessions, automate tuition tracking, and issue dynamic QR smart cards for high-speed student check-in with instant guardian notifications.',
    version: 'v3.8.2',
    developer: 'Lern Web Systems & Lab',
    rating: 4.9,
    reviewsCount: 312,
    accentColor: '#3b82f6',
    featuresAr: [
      'لوحة قيادة تفاعلية للمعلمين والإداريين تدعم تعدد الفروع والقاعات',
      'توليد بطاقات QR ذكية لكل طالب لسرعة تسجيل الحضور عند بوابات السنتر',
      'بوابة دفع مدمجة تدعم فودافون كاش، انستاباي، والتحويلات المباشرة',
      'نظام صلاحيات متقدم يفصل بين صلاحيات السكرتارية، المساعدين، والمعلمين'
    ],
    featuresEn: [
      'Multi-branch administrative dashboard managing physical classrooms and online hubs',
      'Instant student smart QR badge generation for millisecond gate check-in',
      'Integrated payment gateway supporting mobile wallets (Vodafone Cash, InstaPay, STC)',
      'Role-based access controls for tutors, teaching assistants, and accounting staff'
    ],
    techStack: ['Next.js 14', 'Tailwind CSS', 'Vercel Edge', 'SQLite / Cloud SQL', 'PWA Engine'],
    screenshots: [
      { titleAr: 'لوحة إدارة الفروع والطلاب', titleEn: 'Branch & Student Ledger', bgGradient: 'from-blue-900 to-indigo-950', mockupType: 'dashboard' },
      { titleAr: 'بوابة تسجيل الحضور بالباركود', titleEn: 'QR Gate Check-In Terminal', bgGradient: 'from-sky-900 to-slate-900', mockupType: 'qr' }
    ],
    downloadUrl: 'https://github.com/lernweb/lms-core-dist.git',
    distributionLink: 'https://lernweb.com/deploy/lms-core',
    defaultSandboxConfig: {
      centerName: 'أكاديمية ليرن ويب التعليمية المركزية',
      theme: 'ocean',
      activeCourse: 'كورس الرياضيات والعلوم للثانوية العامة',
      hasQuiz: true,
      bannerText: 'تنبيه: بدأ التسجيل في المجموعات الجديدة للفصل الدراسي الثاني!',
      tutorName: 'أ. د. كريم المنشاوي'
    }
  },
  {
    id: 'ai-exam-proctor',
    category: 'lms_edu',
    titleAr: 'منصة الاختبارات الذكية والمراقبة الآلية (Proctor AI)',
    titleEn: 'Proctor AI Smart Examination Suite',
    badgeAr: 'ذكاء اصطناعي فوري',
    badgeEn: 'Real-time AI Shield',
    taglineAr: 'محرك تقييم فوري يمنع تسريب الاختبارات ويكشف محاولات الغش مع تصحيح ذكي للأسئلة.',
    taglineEn: 'High-integrity testing engine featuring active anti-cheat safeguards and semantic open-ended grading.',
    descriptionAr: 'منظومة Proctor AI تقدم تجربة اختبارات آمنة تماماً تدعم بنوك الأسئلة المتدرجة الصعوبة. يقوم المحرك الذكي برصد تبديل النوافذ وشاشات الهاتف، وتوليد نماذج امتحانية عشوائية لمنع الغش الجماعي، بالإضافة إلى تصحيح آلي فوري.',
    descriptionEn: 'A resilient testing ecosystem equipped with algorithmic question randomization and active anti-cheat monitoring. Detects tab switches and clipboard copying.',
    version: 'v2.4.0',
    developer: 'Cognitive Learner Inc.',
    rating: 4.8,
    reviewsCount: 184,
    accentColor: '#8b5cf6',
    featuresAr: [
      'تأمين كامل للمتصفح مع منع النسخ وتصوير الشاشة وتبديل النوافذ',
      'بنوك أسئلة ديناميكية تعيد ترتيب الأسئلة والخيارات لكل طالب',
      'تصحيح فوري مدعوم بالذكاء الاصطناعي مع تقديم تحليل مفصل لكل إجابة'
    ],
    featuresEn: [
      'Lockdown browser environment preventing clipboard copying and tab jumps',
      'Dynamic question pools generating unique permutations per candidate',
      'Instant AI-assisted rubric evaluation with step-by-step diagnostic feedback'
    ],
    techStack: ['WebAssembly', 'Next.js App Router', 'TensorFlow.js', 'Tailwind CSS'],
    screenshots: [
      { titleAr: 'واجهة الامتحان المقفل والمؤقت', titleEn: 'Lockdown Exam Container', bgGradient: 'from-purple-950 to-slate-900', mockupType: 'quiz' },
      { titleAr: 'تحليل سلوكيات الغش المكتشفة', titleEn: 'Anti-Cheat Telemetry Radar', bgGradient: 'from-violet-900 to-indigo-950', mockupType: 'analytics' }
    ],
    downloadUrl: 'https://github.com/lernweb/proctor-ai.git',
    distributionLink: 'https://lernweb.com/deploy/proctor-ai',
    defaultSandboxConfig: {
      centerName: 'مركز التقييم والقياس الذكي',
      theme: 'midnight',
      activeCourse: 'اختبار تجريبي في الفيزياء والكيمياء',
      hasQuiz: true,
      bannerText: 'الاختبار التجريبي مفتوح الآن: ينتهي الوقت المتبقي تلقائياً بعد 15 دقيقة!',
      tutorName: 'أ. د. سمير عبد الرحمن'
    }
  },
  {
    id: 'stem-code-lab',
    category: 'lms_edu',
    titleAr: 'مختبر البرمجة والعلوم التفاعلي (Interactive Code Lab)',
    titleEn: 'Interactive Code Lab & STEM Sandbox',
    badgeAr: 'مختبر سحابي للبرمجة',
    badgeEn: 'Cloud Compiler & Terminal',
    taglineAr: 'بيئة تشغيل تفاعلية داخل المتصفح للغات Python, JS, C++ مع شروحات برمجية ومحرر كود متقدم.',
    taglineEn: 'In-browser interactive coding sandbox with live compilers, Monaco editor, and automated grading.',
    descriptionAr: 'يتيح Interactive Code Lab للطلاب كتابة وتصحيح واختبار الأكواد البرمجية مباشرة من المتصفح بدون الحاجة لتثبيت أي برامج على حواسيبهم.',
    descriptionEn: 'Empowers students to author, compile, and execute code directly within their browser without local installation overhead.',
    version: 'v4.1.0',
    developer: 'VeloCode Open Education',
    rating: 5.0,
    reviewsCount: 420,
    accentColor: '#10b981',
    featuresAr: [
      'محرر كود متقدم يدعم تلوين الصياغة والإكمال التلقائي الذكي',
      'بيئة تشغيل آمنة للغات بايثون، جافاسكربت، و C++ بدون سيرفر خارجي'
    ],
    featuresEn: [
      'Advanced code editor with syntax highlighting and autocomplete',
      'Zero-latency sandboxed WebAssembly execution for Python and JavaScript'
    ],
    techStack: ['Monaco Editor', 'Pyodide (WebAssembly)', 'Tailwind CSS'],
    screenshots: [
      { titleAr: 'محرر بايثون والطرفية الحية', titleEn: 'Python Cloud Workspace', bgGradient: 'from-emerald-950 to-teal-900', mockupType: 'code' }
    ],
    downloadUrl: 'https://github.com/lernweb/code-lab.git',
    distributionLink: 'https://lernweb.com/deploy/code-lab',
    defaultSandboxConfig: {
      centerName: 'أكاديمية المبرمج الصغير والذكاء الاصطناعي',
      theme: 'emerald',
      activeCourse: 'معسكر بايثون للمبتدئين: من الصفر إلى أول تطبيق',
      hasQuiz: false,
      bannerText: 'المختبر يعمل بكفاءة 100%: الكود ينفذ داخل المتصفح فورياً.',
      tutorName: 'مهندس الكود السحابي'
    }
  }
];

export interface WalletOption {
  id: string;
  nameAr: string;
  nameEn: string;
  number: string;
  badge: string;
  instructionsAr: string;
  instructionsEn: string;
  color: string;
}

export const WALLET_OPTIONS: WalletOption[] = [
  {
    id: 'vodafone-cash',
    nameAr: 'فودافون كاش (Vodafone Cash)',
    nameEn: 'Vodafone Cash (Egypt)',
    number: '01024889921',
    badge: 'مصر - الأكثر استخداماً',
    instructionsAr: 'حول المبلغ المطلوب عبر كود *9*7*الرقم*المبلغ# أو تطبيق أنا فودافون، ثم انسخ كود العملية أو احتفظ بلقطة الشاشة.',
    instructionsEn: 'Transfer funds via *9*7*Number*Amount# or Ana Vodafone app, then save transaction screenshot or reference number.',
    color: '#e11d48'
  },
  {
    id: 'orange-cash',
    nameAr: 'أورانج كاش (Orange Cash)',
    nameEn: 'Orange Cash (Egypt)',
    number: '01224889921',
    badge: 'محفظة أورانج كاش الفورية',
    instructionsAr: 'قم بإدخال رقم هاتفك المحمول ليصلك كود التحقق OTP لإتمام الدفع المباشر، أو حول إلى رقم المحفظة.',
    instructionsEn: 'Enter your registered mobile phone number to receive a one-time OTP verification code for instant checkout.',
    color: '#f97316'
  },
  {
    id: 'instapay',
    nameAr: 'انستاباي الفوري (InstaPay)',
    nameEn: 'InstaPay Direct IPN (Egypt)',
    number: 'lernweb@instapay',
    badge: 'تحويل بنكي لحظي 0% عمولة',
    instructionsAr: 'افتح تطبيق انستاباي، اختر تحويل إلى عنوان دفع لحظي (IPA) واكتب lernweb@instapay، ثم اضغط تأكيد.',
    instructionsEn: 'Open InstaPay app, transfer to Instant Payment Address (IPA) lernweb@instapay and submit transaction ID.',
    color: '#6366f1'
  },
  {
    id: 'stc-pay',
    nameAr: 'إس تي سي باي (STC Pay)',
    nameEn: 'STC Pay (Saudi Arabia & Gulf)',
    number: '+966509823412',
    badge: 'المملكة العربية السعودية والخليج',
    instructionsAr: 'حول إلى رقم الجوال المسجل عبر تطبيق STC Pay واختر تحويل محلي فوري، وسيتم تفعيل حسابك مباشرة.',
    instructionsEn: 'Transfer via STC Pay mobile application to the registered phone number with instant cross-border activation.',
    color: '#8b5cf6'
  },
  {
    id: 'bank-wire',
    nameAr: 'التحويل البنكي الدولي (IBAN / Wire)',
    nameEn: 'Direct Bank Wire (IBAN Transfer)',
    number: 'EG380002000100000012345678901',
    badge: 'البنك التجاري الدولي CIB',
    instructionsAr: 'قم بإجراء تحويل بنكي على حساب شركة ليرن ويب تكنولوجيز، ثم أرفق إشعار التحويل البنكي لتفعيل رخصة التملك.',
    instructionsEn: 'Execute wire transfer to Lern Web Technologies account with IBAN reference for full enterprise release.',
    color: '#0284c7'
  }
];

export interface MediaItem {
  id: string;
  type: 'video' | 'doc';
  titleAr: string;
  titleEn: string;
  durationOrReadTimeAr: string;
  durationOrReadTimeEn: string;
  categoryAr: string;
  categoryEn: string;
  summaryAr: string;
  summaryEn: string;
  contentAr: string;
  contentEn: string;
  videoUrl?: string;
  thumbnailBg: string;
}

export const MEDIA_RESOURCES: MediaItem[] = [
  {
    id: 'doc-vercel-edge',
    type: 'doc',
    titleAr: 'الدليل التقني: نشر جميع أنواع مواقع الويب والتطبيقات في ثوانٍ',
    titleEn: 'Technical Documentation: Deploying All Website Types on Global Edge',
    durationOrReadTimeAr: 'قراءة في 6 دقائق',
    durationOrReadTimeEn: '6 min read',
    categoryAr: 'توثيق المطورين',
    categoryEn: 'Developer Docs',
    summaryAr: 'خطوات إعداد ملفات Next.js App Router للمتاجر، الشركات، وتطبيقات السحاب.',
    summaryEn: 'Detailed guide for configuring Next.js App Router files for all web types.',
    thumbnailBg: 'from-emerald-950 to-slate-900',
    contentAr: `# دليل النشر السريع لجميع أنواع مواقع الويب
1. اختر نوع موقعك أو متجرك أو تطبيق السحاب من المتجر.
2. افتح مشروعك في VS Code وقم بإنشاء الهيكل المعتمد.
3. ارفع الكود إلى GitHub ثم ربطه بـ Vercel لإطلاقه عالمياً في أقل من 40 ثانية.`,
    contentEn: `# Instant Global Deployment Guide for All Website Types
1. Select your target site category (E-Commerce, Corporate, SaaS, Healthcare, Real Estate).
2. Author your Next.js App Router layout and pages.
3. Push to GitHub and deploy to global Edge CDN nodes in under 40 seconds!`
  }
];
