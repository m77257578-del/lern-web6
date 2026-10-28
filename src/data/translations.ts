/**
 * Project: ليرن ويب | Lern Web
 * File: src/data/translations.ts
 * Bilingual dictionary for Arabic (RTL) and English (LTR)
 */

export interface TranslationDict {
  appName: string;
  appSubtitle: string;
  pwaInstallTitle: string;
  pwaInstallDesc: string;
  installNow: string;
  installed: string;
  iosInstallGuide: string;
  iosStep1: string;
  iosStep2: string;
  close: string;
  navStore: string;
  navSandbox: string;
  navMediaDocs: string;
  navBilling: string;
  navAiStudio: string;
  navCodeViewer: string;
  themeToggle: string;
  langToggle: string;
  searchPlaceholder: string;
  categories: {
    all: string;
    ecommerce: string;
    corporate: string;
    saas_ai: string;
    lms_edu: string;
    real_estate: string;
    medical: string;
    hospitality: string;
    news_media: string;
    lms: string;
    stem: string;
    ai: string;
    operations: string;
  };
  filterAll: string;
  version: string;
  developer: string;
  launchInSandbox: string;
  deployApp: string;
  downloadPackage: string;
  featuresTitle: string;
  screenshotsTitle: string;
  specifications: string;
  closeModal: string;
  sandboxTitle: string;
  sandboxSubtitle: string;
  viewportDesktop: string;
  viewportTablet: string;
  viewportMobile: string;
  reloadSandbox: string;
  inspectSandbox: string;
  aiPromptPlaceholder: string;
  aiSend: string;
  aiThinking: string;
  aiQuickPrompts: string[];
  billingTitle: string;
  billingSubtitle: string;
  tierMonthlyTitle: string;
  tierMonthlyBadge: string;
  tierMonthlyPrice: string;
  tierMonthlyPeriod: string;
  tierMonthlyDesc: string;
  tierAnnualTitle: string;
  tierAnnualBadge: string;
  tierAnnualPrice: string;
  tierAnnualPeriod: string;
  tierAnnualDesc: string;
  tierFullTitle: string;
  tierFullBadge: string;
  tierFullPrice: string;
  tierFullPeriod: string;
  tierFullDesc: string;
  choosePlan: string;
  paymentModalTitle: string;
  paymentModalDesc: string;
  selectWallet: string;
  copyNumber: string;
  copied: string;
  walletNumber: string;
  referenceInputPlaceholder: string;
  confirmPayment: string;
  sendWhatsAppProof: string;
  secureGuarantee: string;
  mediaTitle: string;
  mediaSubtitle: string;
  videoChannelTitle: string;
  docsChannelTitle: string;
  watchVideo: string;
  readDoc: string;
  vsCodeExplorerTitle: string;
  vsCodeExplorerSubtitle: string;
  copyFileCode: string;
  fileCopied: string;
  heroMarketingTitle: string;
  heroMarketingSubtitle: string;
  heroFeature1: string;
  heroFeature2: string;
  heroFeature3: string;
  heroCta: string;
}

export const translations: { ar: TranslationDict; en: TranslationDict } = {
  ar: {
    appName: "ليرن ويب | Lern Web",
    appSubtitle: "المنظومة التعليمية السحابية المتكاملة: سوق أدوات، محاكي مراكز حية، ومحرك PWA قابل للتثبيت الفوري",
    pwaInstallTitle: "تثبيت تطبيق ليرن ويب على جهازك",
    pwaInstallDesc: "احصل على تجربة تشغيل سريعة ومستقلة بدون متصفح مع إمكانية العمل دون اتصال بالإنترنت",
    installNow: "تثبيت التطبيق الآن",
    installed: "التطبيق مثبت لديك",
    iosInstallGuide: "طريقة التثبيت على أجهزة iPhone / iPad",
    iosStep1: "اضغط على زر المشاركة (Share) في أسفل متصفح Safari",
    iosStep2: "مرر للأسفل واختر 'إضافة إلى الصفحة الرئيسية (Add to Home Screen)'",
    close: "إغلاق",
    navStore: "سوق المنصات والأدوات",
    navSandbox: "محاكي الساندبوكس الحي",
    navMediaDocs: "قنوات الفيديو والشروحات",
    navBilling: "نظام الاشتراكات",
    navAiStudio: "المساعد الذكي لمنصة ليرن ويب",
    navCodeViewer: "أكواد Next.js لـ VS Code",
    themeToggle: "تبديل المظهر",
    langToggle: "English",
    searchPlaceholder: "ابحث في جميع مواقع الويب، المتاجر، الشركات، وتطبيقات السحاب...",
    categories: {
      all: "جميع المنظومات والمواقع",
      ecommerce: "المتاجر والتجارة الإلكترونية",
      corporate: "الشركات والأعمال التجارية",
      saas_ai: "تطبيقات السحاب والمراكز الرقمية",
      lms_edu: "التعليم والأكاديميات الذكية",
      real_estate: "العقارات والحجوزات",
      medical: "المستشفيات والعيادات الطبية",
      hospitality: "المطاعم والمنيو الرقمي",
      news_media: "المجلات والمحتوى الإخباري",
      lms: "إدارة المراكز (LMS)",
      stem: "مختبرات الكود والعلوم",
      ai: "الدعم والتواصل المباشر",
      operations: "التشغيل والمتاجر",
    },
    filterAll: "الكل",
    version: "الإصدار",
    developer: "المطور",
    launchInSandbox: "تشغيل المعاينة المباشرة داخل التطبيق",
    deployApp: "بدء التثبيت والنشر",
    downloadPackage: "تحميل الحزمة البرمجية",
    featuresTitle: "الميزات الوظيفية الفريدة",
    screenshotsTitle: "معاينة الواجهات والأصول البصرية",
    specifications: "المواصفات التقنية",
    closeModal: "إغلاق النافذة",
    sandboxTitle: "محاكي مركز ليرن ويب التفاعلي",
    sandboxSubtitle: "بيئة معزولة بنظام iframe تحاكي بناء المراكز التعليمية المستقلة في الوقت الفعلي",
    viewportDesktop: "شاشة كمبيوتر",
    viewportTablet: "جهاز لوحي (iPad)",
    viewportMobile: "هاتف جوال",
    reloadSandbox: "إعادة تحميل المحاكي",
    inspectSandbox: "سجل أحداث المحاكي",
    aiPromptPlaceholder: "اكتب تعليماتك للذكاء الاصطناعي لتعديل المركز فورياً (مثلاً: غير الثيم إلى الزمردي، أضف كورس فيزياء، عدل اسم المركز)...",
    aiSend: "تطبيق التعديل الذكي",
    aiThinking: "جاري تحليل الأمر وإعادة بناء المعاينة...",
    aiQuickPrompts: [
      "تغيير هوية المركز إلى 'أكاديمية المتفوقين'",
      "تطبيق ثيم أخضر زمردي مع شريط تنبيه للامتحانات",
      "إضافة كورس برمجة Python مع شهادة معتمدة",
      "تحويل وضع العرض إلى التركيز على اختبارات أونلاين"
    ],
    billingTitle: "باقات التراخيص وحقوق الملكية التشغيلية",
    billingSubtitle: "اختر النموذج الأنسب لمركزك: اشتراك شهري مرن، ترخيص سنوي مخفض، أو تملك كامل للكود المصدر دون أي عمولات لاحقة",
    tierMonthlyTitle: "الاشتراك الشهري المرن",
    tierMonthlyBadge: "للمراكز الناشئة",
    tierMonthlyPrice: "950 ج.م / $29",
    tierMonthlyPeriod: "شهرياً يتم التجديد تلقائياً أو يدوياً",
    tierMonthlyDesc: "مثالي للمدرسين والسناتر الصغيرة التي تبدأ رحلتها الرقمية، يشمل الاستضافة السحابية ومحاكي الطلاب والتحديثات المستمرة.",
    tierAnnualTitle: "الترخيص السنوي المتقدم",
    tierAnnualBadge: "الأكثر طلباً وتوفيراً (خصم شهرين)",
    tierAnnualPrice: "8,500 ج.م / $249",
    tierAnnualPeriod: "سنوياً (يوفر أكثر من 30%)",
    tierAnnualDesc: "يشمل اسم نطاق خاص بالمركز (Custom Domain)، دعم فني فوري VIP، سعة غير محدودة للطلاب وبوابة دفع مدمجة.",
    tierFullTitle: "التملك الكامل للكود المصدر",
    tierFullBadge: "ملكية مدى الحياة (White Label)",
    tierFullPrice: "27,000 ج.م / $799",
    tierFullPeriod: "دفعة واحدة فقط - تملك 100% مدى الحياة",
    tierFullDesc: "احصل على كامل الكود المصدري غير المضغوط لـ Next.js و Tailwind، بدون أي اشتراكات شهرية، حق تعديل كامل وإمكانية استضافته على خوادمك الخاصة.",
    choosePlan: "اختيار الباقة والمتابعة للدفع",
    paymentModalTitle: "بوابة الدفع الآمن بالمحافظ الإلكترونية المحلية",
    paymentModalDesc: "قم بالتحويل إلى رقم المحفظة المعتمد بالأسفل، ثم أدخل رقم العملية أو اضغط للمتابعة عبر واتساب لتفعيل الخدمة فورياً.",
    selectWallet: "اختر وسيلة الدفع المفضلة لديك:",
    copyNumber: "نسخ الرقم",
    copied: "تم النسخ بنجاح!",
    walletNumber: "رقم المحفظة / الحساب:",
    referenceInputPlaceholder: "أدخل رقم العملية المرجعي (Transaction ID) أو اسم المحول...",
    confirmPayment: "تأكيد الدفع وإرسال الإشعار",
    sendWhatsAppProof: "إرسال إيصال التحويل عبر واتساب فوري",
    secureGuarantee: "ضمان أمان معتمد: يتم تفعيل حسابك وحجز نطاقك في غضون 10 دقائق بعد مطابقة العملية.",
    mediaTitle: "القنوات التعليمية والتوثيق التقني",
    mediaSubtitle: "فيديوهات تدريبية عالية الدقة وأدلة تقنية مفصلة لنشر وإدارة مراكز ليرن ويب بنقرة واحدة",
    videoChannelTitle: "شروحات الفيديو التدريبية المباشرة",
    docsChannelTitle: "المقالات والتوثيق التقني وتجهيز Vercel",
    watchVideo: "مشاهدة الفيديو",
    readDoc: "قراءة الدليل",
    vsCodeExplorerTitle: "مستكشف الكود المصدر لبيئة VS Code و Vercel",
    vsCodeExplorerSubtitle: "توليد ملفات Next.js App Router غير المضغوطة والجاهزة للنسخ أو النشر المباشر على Edge",
    copyFileCode: "نسخ الكود بالكامل لـ VS Code",
    fileCopied: "تم نسخ محتوى الملف!",
    heroMarketingTitle: "حول رؤيتك إلى واقع رقمي في دقائق",
    heroMarketingSubtitle: "منصة ليرن ويب توفر لك أحدث التقنيات لبناء المتاجر، الشركات، والأنظمة التعليمية باحترافية وسهولة تامة.",
    heroFeature1: "تصميمات عصرية ومتجاوبة",
    heroFeature2: "دعم فني متواصل",
    heroFeature3: "سرعة في الأداء والتثبيت",
    heroCta: "ابدأ مشروعك الآن"
  },
  en: {
    appName: "Lern Web | ليرن ويب",
    appSubtitle: "Unified cloud educational ecosystem: dynamic tool store, live center sandbox simulator, and installable PWA engine",
    pwaInstallTitle: "Install Lern Web App on Your Device",
    pwaInstallDesc: "Experience instant standalone desktop & mobile execution with offline-ready local caching",
    installNow: "Install App Now",
    installed: "App Already Installed",
    iosInstallGuide: "How to Install on iPhone / iPad",
    iosStep1: "Tap the Share button at the bottom of Safari toolbar",
    iosStep2: "Scroll down and select 'Add to Home Screen'",
    close: "Close",
    navStore: "App & Platform Store",
    navSandbox: "Live Center Sandbox",
    navMediaDocs: "Media & Technical Docs",
    navBilling: "Licensing & Ownership",
    navAiStudio: "Direct Support & Administration",
    navCodeViewer: "VS Code Source Files",
    themeToggle: "Toggle Theme",
    langToggle: "العربية",
    searchPlaceholder: "Search all website types, e-commerce, corporate apps, and cloud tools...",
    categories: {
      all: "All Websites & Platforms",
      ecommerce: "E-Commerce & Online Stores",
      corporate: "Corporate & Business Portfolios",
      saas_ai: "SaaS & Cloud Platforms",
      lms_edu: "Smart Education & Academies",
      real_estate: "Real Estate & Booking Portals",
      medical: "Healthcare & Clinic Systems",
      hospitality: "Restaurants & Digital QR Menus",
      news_media: "News & Media Publishing Hubs",
      lms: "LMS & Learning Centers",
      stem: "STEM Labs & Coding",
      ai: "Support & Direct Communication",
      operations: "Attendance & Student Portals",
    },
    filterAll: "All",
    version: "Version",
    developer: "Developer",
    launchInSandbox: "Test in Live Sandbox",
    deployApp: "Deploy / Provision",
    downloadPackage: "Download Package",
    featuresTitle: "Core Functional Capabilities",
    screenshotsTitle: "Interface Showcase & Visual Previews",
    specifications: "Technical Specifications",
    closeModal: "Close Window",
    sandboxTitle: "Interactive Lern Web Center Sandbox",
    sandboxSubtitle: "Isolated iframe sandbox container mimicking real-time dynamic educational center builds",
    viewportDesktop: "Desktop Screen",
    viewportTablet: "Tablet (iPad)",
    viewportMobile: "Mobile Device",
    reloadSandbox: "Reload Sandbox",
    inspectSandbox: "Sandbox Event Log",
    aiPromptPlaceholder: "Prompt the AI assistant to instantly modify sandbox center runtime (e.g., Switch theme to Emerald, add Physics course, change title)...",
    aiSend: "Execute AI Customization",
    aiThinking: "Analyzing prompt & rebuilding live sandbox...",
    aiQuickPrompts: [
      "Rename academy to 'Excellence Global Academy'",
      "Apply Emerald green theme with urgent exam alert banner",
      "Add interactive Python Coding Bootcamp with certificate",
      "Switch center view to focus on live interactive assessments"
    ],
    billingTitle: "Licensing Tiers & Operational Ownership",
    billingSubtitle: "Choose the optimal model for your educational center: flexible monthly subscription, discounted annual license, or full source code buyout with zero royalties",
    tierMonthlyTitle: "Flexible Monthly Rental",
    tierMonthlyBadge: "Starter Centers",
    tierMonthlyPrice: "$29 / 950 EGP",
    tierMonthlyPeriod: "Billed monthly, cancel or pause anytime",
    tierMonthlyDesc: "Ideal for individual tutors and growing tutoring centers. Includes cloud hosting, student portal simulator, and rolling updates.",
    tierAnnualTitle: "Advanced Annual License",
    tierAnnualBadge: "Most Popular (2 Months Free)",
    tierAnnualPrice: "$249 / 8,500 EGP",
    tierAnnualPeriod: "Billed annually (Save over 30%)",
    tierAnnualDesc: "Includes Custom Domain mapping, VIP priority SLA support, unlimited student quotas, and integrated wallet payment routing.",
    tierFullTitle: "Full Outright Source Buyout",
    tierFullBadge: "Lifetime White-Label Ownership",
    tierFullPrice: "$799 / 27,000 EGP",
    tierFullPeriod: "Single one-time payment - 100% Lifetime Source",
    tierFullDesc: "Receive complete uncompressed Next.js & Tailwind source code. Zero recurring fees, unlimited center deployments, and private hosting rights.",
    choosePlan: "Select Tier & Proceed to Payment",
    paymentModalTitle: "Secure Local Mobile Wallet Payment Gateway",
    paymentModalDesc: "Transfer funds to the verified mobile wallet account below, then enter transaction ID or connect via WhatsApp for instant activation.",
    selectWallet: "Select Your Preferred Mobile Wallet / Method:",
    copyNumber: "Copy Number",
    copied: "Copied successfully!",
    walletNumber: "Wallet Number / Account ID:",
    referenceInputPlaceholder: "Enter Transaction ID or sender phone number...",
    confirmPayment: "Confirm Payment & Transmit Proof",
    sendWhatsAppProof: "Send Payment Receipt via Instant WhatsApp",
    secureGuarantee: "Verified Security: Your center portal is provisioned and domain locked within 10 minutes of confirmation.",
    mediaTitle: "Instructional Streaming & Technical Documentation",
    mediaSubtitle: "High-definition instructional video streams and step-by-step guides for deploying and mastering Lern Web",
    videoChannelTitle: "Instructional Video Channel",
    docsChannelTitle: "Technical Guides & Vercel Edge Deployment",
    watchVideo: "Watch Video",
    readDoc: "Read Guide",
    vsCodeExplorerTitle: "VS Code & Vercel Source Code Explorer",
    vsCodeExplorerSubtitle: "Generate uncompressed, ready-to-copy Next.js App Router code files for local VS Code and Edge deployment",
    copyFileCode: "Copy File Code for VS Code",
    fileCopied: "File content copied to clipboard!",
    heroMarketingTitle: "Turn Your Vision into Digital Reality in Minutes",
    heroMarketingSubtitle: "Lern Web provides the ultimate toolkit for building high-performance stores, corporate sites, and educational platforms effortlessly.",
    heroFeature1: "Ultra-Modern Responsive UI",
    heroFeature2: "24/7 Dedicated Technical Support",
    heroFeature3: "Lightning Fast Edge Deployment",
    heroCta: "Launch Your Project Now"
  }
};
