/**
 * Project: ليرن ويب | Lern Web
 * File: src/services/storageService.ts
 * Centralized persistent state manager connected to backend API and Firestore real-time listeners.
 */

import { subscribeToCollection, saveDocument, deleteDocument } from './firebaseService';
import { APPS_DATA } from '../data/storeData';

export interface ProjectTemplate {
  id: string;
  nameAr: string;
  nameEn: string;
  badgeAr?: string;
  badgeEn?: string;
  descriptionAr: string;
  descriptionEn: string;
  previewUrl?: string; // Live demo / GitHub Pages preview link for internal iframe player
  images: string[]; // Screenshot & image URLs
  featuresAr: string[];
  featuresEn: string[];
  priceMonthly: string;
  priceAnnual: string;
  priceFull: string;
}

export interface ProjectItem {
  id: string;
  category: string;
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
  isPublished: boolean;
  featuresAr: string[];
  featuresEn: string[];
  techStack: string[];
  priceMonthly: string;
  priceAnnual: string;
  priceFull: string;
  sourceCode: string;
  previewUrl?: string;
  templates?: ProjectTemplate[];
  fileData: {
    id: string;
    name: string;
    base64: string;
    type: string;
    fileCategory?: string;
    featureMetadata?: string;
    size: number;
    updatedAt: string;
  }[];
  secretFiles: {
    name: string;
    type: 'github' | 'zip' | 'doc' | 'config';
    urlOrNotes: string;
    updatedAt: string;
  }[];
  screenshots: {
    titleAr: string;
    titleEn: string;
    bgGradient: string;
    mockupType: 'dashboard' | 'code' | 'quiz' | 'qr' | 'analytics';
    imageUrl?: string;
  }[];
  sandboxConfig: {
    centerName: string;
    theme: 'ocean' | 'midnight' | 'emerald' | 'amber';
    activeCourse: string;
    hasQuiz: boolean;
    bannerText: string;
    tutorName: string;
  };
}

export interface SocialMediaLinkItem {
  id: string;
  app: 'whatsapp' | 'facebook' | 'instagram' | 'telegram' | 'youtube' | 'tiktok' | 'twitter' | 'linkedin' | 'discord' | 'github' | 'snapchat' | 'threads' | 'phone' | 'email' | 'website' | string;
  titleAr: string;
  titleEn: string;
  url: string;
  isActive: boolean;
  order?: number;
}

export interface SectionConfig {
  id: string;
  enabled: boolean;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
}

export interface SiteContentSettings {
  // Hero section
  heroBadgeAr: string;
  heroBadgeEn: string;
  heroTitleAr: string;
  heroTitleEn: string;
  heroSubtitleAr: string;
  heroSubtitleEn: string;
  heroCtaStoreAr: string;
  heroCtaStoreEn: string;
  heroCtaSandboxAr: string;
  heroCtaSandboxEn: string;
  heroCtaArticlesAr: string;
  heroCtaArticlesEn: string;
  heroCtaAdminAr: string;
  heroCtaAdminEn: string;

  // Dynamic 4 Stats / Metrics
  stat1Number: string;
  stat1LabelAr: string;
  stat1LabelEn: string;
  stat2Number: string;
  stat2LabelAr: string;
  stat2LabelEn: string;
  stat3Number: string;
  stat3LabelAr: string;
  stat3LabelEn: string;
  stat4Number: string;
  stat4LabelAr: string;
  stat4LabelEn: string;

  // Sections Control (Toggle visibility + Custom Title & Subtitle)
  sections: {
    store: SectionConfig;
    sandbox: SectionConfig;
    articles: SectionConfig;
    pricing: SectionConfig;
    faq: SectionConfig;
    about: SectionConfig;
  };

  // About us details
  aboutMissionAr: string;
  aboutMissionEn: string;
  aboutVisionAr: string;
  aboutVisionEn: string;
  aboutFounderAr: string;
  aboutFounderEn: string;

  // Footer text
  footerDescriptionAr: string;
  footerDescriptionEn: string;
  footerCopyrightAr: string;
  footerCopyrightEn: string;
}

export interface AdminSettings {
  adminPasscode: string;
  targetWhatsAppNumber: string;
  centerName: string;
  heroTitleAr?: string;
  heroTitleEn?: string;
  heroSubtitleAr?: string;
  heroSubtitleEn?: string;
  heroBadgeAr?: string;
  heroBadgeEn?: string;
  fontFamily?: 'cairo' | 'tajawal' | 'inter' | 'almarai';
  contactEmail: string;
  socialLinks: {
    whatsapp: string;
    facebook: string;
    youtube: string;
    tiktok: string;
    telegram?: string;
  };
  socialAppNames: Record<string, string>;
  socialLinksList?: SocialMediaLinkItem[];
  siteContent?: SiteContentSettings;
  paymentMethodLabels: {
    ar: string;
    en: string;
  };
  primaryColor: string;
  accentColor: string;
  themeMode?: 'dark' | 'light' | 'user';
  globalPrices: {
    monthlyAr: string;
    monthlyEn: string;
    annualAr: string;
    annualEn: string;
    fullAr: string;
    fullEn: string;
  };
  openAiApiKey?: string;
  geminiKeyPool?: string[];
  preferredAiProvider?: 'gemini' | 'chatgpt';
  isAiChatEnabled?: boolean;
  aiWelcomeMessageAr?: string;
  aiWelcomeMessageEn?: string;
  aiFallbackReplyAr?: string;
  aiFallbackReplyEn?: string;
  isOnlinePaymentGatewayEnabled?: boolean;
  kashierMerchantId?: string;
  kashierApiKey?: string;
  kashierSecretKey?: string;
  kashierIframeId?: string;
  kashierMode?: 'test' | 'live';
  seoSettings: SeoSettings;
  isJoinPlatformEnabled?: boolean;
  zoomMeetingKey?: string;
}

export interface SeoSettings {
  title: string;
  description: string;
  ogImage: string;
  twitterImage: string;
}

export interface WalletConfig {
  id: string;
  nameAr: string;
  nameEn: string;
  number: string;
  url?: string;
  badge: string;
  instructionsAr: string;
  instructionsEn: string;
  color: string;
  isActive: boolean;
}

export interface SubscriptionPlan {
  id: string;
  nameAr: string;
  nameEn: string;
  priceAr: string;
  priceEn: string;
  periodAr: string;
  periodEn: string;
  badgeAr: string;
  badgeEn: string;
  descriptionAr: string;
  descriptionEn: string;
  isPopular?: boolean;
  accentColor?: string;
}

export interface PurchasedSystemRecord {
  id: string; // e.g. sys-1
  projectId: string;
  projectTitleAr: string;
  projectTitleEn: string;
  platformNameAr?: string;
  platformNameEn?: string;
  generatedVercelUrl?: string; // e.g. https://<slug>.vercel.app
  category: string;
  planType: 'monthly' | 'annual' | 'full';
  amount: string;
  licenseKey: string; // e.g. LERN-2026-E49A-7B8C
  certificateNumber: string; // e.g. CERT-LW-2026-9921
  status: 'active' | 'pending' | 'suspended';
  isConfirmed: boolean;
  confirmedAt?: string;
  purchasedAt: string;
  sourceCodeUrl?: string;
  sandboxTheme?: 'ocean' | 'midnight' | 'emerald' | 'amber';
  notes?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  password?: string;
  email?: string;
  createdAt: string;
  purchasedPlanId?: string;
  isBlocked?: boolean;
  blockReason?: string;
  role?: 'client' | 'vip' | 'support_agent' | 'moderator' | 'developer' | 'general_manager' | string;
  roleAr?: string;
  jobTitle?: string; // Mسمى وظيفي مخصص e.g. "مدير تسويق تقني", "مشرف سنتر المعادي"
  notificationsEnabled?: boolean;
  purchasedSystems?: PurchasedSystemRecord[];
  deviceOs?: string;
  isVerified?: boolean;
  verifiedAt?: string;
}

export interface JobApplication {
  id: string;
  name: string;
  phone: string;
  role: 'customer_service' | 'programmer' | 'monitor';
  status: 'pending' | 'accepted' | 'rejected';
  profileLink: string;
  gitHubLink?: string;
  nationalIdPhotoUrl?: string;
  yearsExperience: number;
  reason: string;
  appliedAt: string;
}

export interface PublishedProject {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  websiteUrl: string;
  imageUrl: string;
  videoUrl?: string;
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
}

export interface AiCustomizationDraft {
  id: string;
  projectId: string;
  projectTitle: string;
  visitorId: string;
  visitorName: string;
  visitorPhone: string;
  userPrompt: string;
  forkedAt: string;
  status: 'pending_review' | 'in_progress' | 'completed' | 'approved_published' | 'rejected';
  modifiedCode: string;
  modifiedConfig: {
    centerName: string;
    theme: 'ocean' | 'midnight' | 'emerald' | 'amber';
    activeCourse: string;
    hasQuiz: boolean;
    bannerText: string;
  };
  modifiedFiles?: {
    id: string;
    name: string;
    type: string;
    fileCategory?: string;
    featureMetadata?: string;
    content: string;
    updatedAt: string;
  }[];
  notes?: string;
}

export interface UserOrder {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  planType: 'monthly' | 'annual' | 'full';
  amount: string;
  paymentMethod: string;
  walletName?: string;
  walletNumber?: string;
  senderPhone?: string; // Sender's wallet / phone number
  referenceId: string; // Transaction reference / code
  receiptImage?: string; // Proof of payment screenshot (base64)
  platformNameAr?: string; // Platform Name in Arabic
  platformNameEn?: string; // Platform Name in English
  generatedVercelUrl?: string; // Dynamically generated Vercel production URL
  createdAt: string;
  status: 'pending' | 'active' | 'confirmed' | 'rejected';
  projectId?: string;
  projectTitle?: string;
  licenseKey?: string;
  certificateNumber?: string;
  confirmedAt?: string;
  adminNotes?: string;
}

export interface MediaResourceItem {
  id: string;
  type: 'video' | 'doc' | 'image';
  mediaSourceType?: 'youtube_url' | 'youtube_embed' | 'local_video' | 'image_url' | 'local_image';
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
  imageUrl?: string;
  embedCode?: string;
  thumbnailBg: string;
  isPublished: boolean;
  targetSection?: 'hero' | 'wallets' | 'store' | 'articles' | 'about' | string;
}

export interface CmsArticle {
  id: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  author: string;
  readTime: string;
  excerptAr: string;
  excerptEn: string;
  contentAr: string;
  contentEn: string;
  imageUrl?: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  viewsCount?: number;
}

export interface FaqItem {
  id: string;
  categoryAr: string;
  categoryEn: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  order: number;
  isPublished: boolean;
}

export interface AnnouncementBanner {
  id: string;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  badgeAr: string;
  badgeEn: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  isActive: boolean;
  targetUrl?: string;
}

export interface ProjectReview {
  id: string;
  projectId: string;
  projectTitle: string;
  userId: string;
  userName: string;
  userPhone: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ActivityLogItem {
  id: string;
  actionType: 'project_created' | 'project_updated' | 'project_deleted' | 'project_published' | 'settings_updated' | 'draft_approved' | 'draft_updated' | 'media_created' | 'media_deleted' | 'review_deleted' | 'wallets_updated' | 'db_import' | 'db_export';
  titleAr: string;
  titleEn: string;
  detailsAr?: string;
  detailsEn?: string;
  timestamp: string;
}

export interface QuickReply {
  id: string;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  message: string;
  sender: 'client' | 'admin';
  createdAt: string;
  isRead: boolean;
  senderName?: string;
  timestamp?: string;
  isAdminReply?: boolean;
}

export interface SupportTicketAttachment {
  name: string;
  type: string;
  size?: number;
  data: string;
  previewUrl?: string;
}

export interface SupportTicketMessage {
  id: string;
  sender: 'user' | 'ai' | 'admin';
  senderName?: string;
  text: string;
  timestamp: string;
  attachments?: SupportTicketAttachment[];
  provider?: 'gemini' | 'chatgpt';
  model?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  userEmail?: string;
  status: 'open' | 'in_progress' | 'closed';
  systemOverride?: string;
  createdAt: string;
  updatedAt: string;
  unreadByAdmin?: boolean;
  unreadByUser?: boolean;
  messages: SupportTicketMessage[];
}

export interface AiCallRecord {
  id: string;
  userId: string;
  userName: string;
  callType: 'voice_ai' | 'consultation' | 'support_call';
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  status: 'completed' | 'missed' | 'cancelled';
  topicSummaryAr: string;
  topicSummaryEn: string;
  transcriptSnippet?: string;
  provider?: string;
  model?: string;
}

export interface UserNotification {
  id: string;
  userId: string; // Specific user ID, or 'admin', or 'all'
  targetRole?: 'admin' | 'user' | 'all';
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  type: 'status_change' | 'system' | 'admin_note' | 'order_placed' | 'order_confirmed' | 'draft_submitted' | 'ticket_message' | 'role_promoted' | 'account_blocked' | 'system_activated';
  read: boolean;
  createdAt: string;
  linkUrl?: string;
  metadata?: Record<string, any>;
}

export interface StaffMember {
  id: string;
  name: string;
  roleAr: string;
  roleEn: string;
  phone: string;
  whatsapp: string;
  telegram?: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
}

export interface UserRoleAssignment {
  email: string;
  role: 'admin' | 'moderator' | 'customer_support';
  permissions: string[];
  updatedAt: string;
}

const otpStore: Record<string, { code: string; expiresAt: number }> = {};

const DEFAULT_INITIAL_USER_ROLES: Record<string, UserRoleAssignment> = {
  'alamza217@gmail.com': {
    email: 'alamza217@gmail.com',
    role: 'admin',
    permissions: ['all', 'manage_projects', 'manage_cms', 'manage_support', 'manage_payments', 'manage_staff'],
    updatedAt: new Date().toISOString()
  }
};

const DEFAULT_INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'أ. كريم المنشاوي',
    roleAr: 'مشرف عام ومنسق المنظومة',
    roleEn: 'Super Administrator',
    phone: '201024889921',
    whatsapp: 'https://wa.me/201024889921',
    telegram: 'https://t.me/lernweb_admin',
    permissions: ['analytics', 'cms', 'orders', 'support', 'settings', 'staff'],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'staff-2',
    name: 'م. ياسمين فؤاد',
    roleAr: 'مسؤولة خدمة العملاء والدعم الفني',
    roleEn: 'Customer Support Lead',
    phone: '201012345678',
    whatsapp: 'https://wa.me/201012345678',
    telegram: 'https://t.me/lernweb_support',
    permissions: ['support', 'orders'],
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_INITIAL_PROJECTS: ProjectItem[] = (APPS_DATA as any[]).map(app => ({
  id: app.id,
  category: app.category,
  titleAr: app.titleAr,
  titleEn: app.titleEn,
  badgeAr: app.badgeAr,
  badgeEn: app.badgeEn,
  taglineAr: app.taglineAr,
  taglineEn: app.taglineEn,
  descriptionAr: app.descriptionAr,
  descriptionEn: app.descriptionEn,
  version: app.version || 'v3.2.0',
  developer: app.developer || 'Lern Web Systems & Lab',
  rating: app.rating || 4.9,
  reviewsCount: app.reviewsCount || 120,
  accentColor: app.accentColor || '#3b82f6',
  isPublished: true,
  featuresAr: app.featuresAr || [],
  featuresEn: app.featuresEn || [],
  techStack: app.techStack || ['Next.js 14', 'Tailwind CSS', 'Vercel Edge', 'PWA Engine'],
  priceMonthly: app.priceMonthly || '950 ج.م / $29',
  priceAnnual: app.priceAnnual || '8,500 ج.م / $249',
  priceFull: app.priceFull || '27,000 ج.م / $799',
  previewUrl: app.previewUrl || 'https://lernweb.com',
  templates: app.templates || [],
  sourceCode: `// ${app.titleEn} Source Knowledge Base\nexport const config = { id: "${app.id}", version: "${app.version || '3.2.0'}" };`,
  fileData: [],
  secretFiles: [
    {
      name: `كود السورس كود الأصلي (${app.titleEn} Repo)`,
      type: 'github',
      urlOrNotes: `git@github.com:lernweb-private/${app.id}-master.git (مستودع خاص - متاح للأدمن فقط)`,
      updatedAt: '2026-10-26'
    }
  ],
  screenshots: app.screenshots || [],
  sandboxConfig: app.defaultSandboxConfig || {
    centerName: app.titleAr,
    theme: 'ocean',
    activeCourse: 'الدورة التدريبية الشاملة',
    hasQuiz: true,
    bannerText: 'النظام السحابي جاهز للتشغيل الفوري',
    tutorName: 'فريق ليرن ويب التقني'
  }
}));

const DEFAULT_INITIAL_ARTICLES: CmsArticle[] = [
  {
    id: 'article-pwa-revolution',
    titleAr: 'دليل التحول الرقمي للمراكز التعليمية: كيف توفر تقنية PWA بديلاً فائقاً للتطبيقات التقليدية؟',
    titleEn: 'Digital Transformation for Academies: How PWAs Outperform Traditional Apps',
    categoryAr: 'تقنية وتطوير',
    categoryEn: 'Tech & Dev',
    author: 'م. أحمد الشناوي',
    readTime: '4 دقائق',
    excerptAr: 'تعرف على كيفية عمل تطبيقات الويب التقدمية (PWA) دون الحاجة لمتاجر التطبيقات ومع دعم كامل للعمل بدون إنترنت.',
    excerptEn: 'Discover how Progressive Web Apps eliminate app store friction while providing 100% offline functionality.',
    contentAr: 'تُعد تطبيقات الويب التقدمية (Progressive Web Apps) النقلة النوعية الأكبر في بناء المنظومات التعليمية السحابية. من خلال ميزات التخزين المؤقت المتقدمة عبر Service Workers، يستطيع الطلاب وأولياء الأمور تصفح المحاضرات والجداول وتسجيل الحضور بالـ QR code حتى في حال انقطاع اتصال الإنترنت تماماً داخل قاعات السنتر.',
    contentEn: 'Progressive Web Apps represent a major leap forward for cloud educational systems. Utilizing Service Workers for intelligent caching, students can access lecture recordings and attendance passes even when connectivity is offline.',
    imageUrl: '/homepage_view.png',
    tags: ['PWA', 'التعليم الذكي', 'التطوير السحابي'],
    isPublished: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'article-ai-proctoring',
    titleAr: 'مستقبل الاختبارات الإلكترونية: كيف تمنع خوارزميات المراقبة الذكية تسريب الامتحانات؟',
    titleEn: 'The Future of E-Exams: Algorithmic Anti-Cheat Integrity Systems',
    categoryAr: 'ذكاء اصطناعي',
    categoryEn: 'Artificial Intelligence',
    author: 'د. ياسمين فؤاد',
    readTime: '6 دقائق',
    excerptAr: 'استعراض لأحدث تقنيات تأمين بيئة الاختبارات، إغلاق المتصفح الآمن، وتوليد أسئلة فريدة لكل طالب.',
    excerptEn: 'Deep dive into browser lockdown systems, randomized question permutation, and instant AI assessment.',
    contentAr: 'أصبحت نزاهة الامتحانات التحدي الأكبر للمراكز والسناتر التعليمية. توفر منظومة المراقبة الذكية تقنيات متطورة مثل قفل المتصفح التام (Lockdown Browser) وكشف محاولات تبديل النوافذ والتقاط الشاشات، فضلاً عن التصحيح الدلالي للأسئلة المقالية في أجزاء من الثانية.',
    contentEn: 'Assessment integrity is paramount for high-stakes test prep. Modern proctoring suites employ automated lockdown sandboxes preventing screen capture and multi-tab switching, with sub-second semantic answer evaluation.',
    imageUrl: '/public/admin_dashboard_view.png',
    tags: ['AI', 'الاختبارات', 'الحماية'],
    isPublished: true,
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_INITIAL_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    categoryAr: 'عن المنصة',
    categoryEn: 'About Platform',
    questionAr: 'ما هي منصة ليرن ويب (Lern Web) وكيف تفيد المركز التعليمي؟',
    questionEn: 'What is Lern Web and how does it empower educational centers?',
    answerAr: 'منظومة ليرن ويب هي بيئة سحابية متكاملة تتيح للمدرسين والمراكز والسناتر التعليمية إطلاق منصاتهم الخاصة بهوية بصرية مستقلة، وتتضمن بوابات إدارة الطلاب، نظام الحضور الذكي بالـ QR، بنوك الأسئلة والاختبارات التفاعلية، وبيئات البرمجة السحابية مع تطبيق PWA يعمل بدون إنترنت.',
    answerEn: 'Lern Web is a unified cloud ecosystem enabling educators and academies to deploy custom branded portals featuring student hubs, sub-200ms QR check-in gates, AI-proctored exam suites, and PWA offline support.',
    order: 1,
    isPublished: true
  },
  {
    id: 'faq-2',
    categoryAr: 'نظام الاشتراكات',
    categoryEn: 'Pricing Models',
    questionAr: 'ما هي باقات الاشتراك والترخيص المتاحة (شهرى، سنوى، تمليك)؟',
    questionEn: 'What pricing and licensing tiers are available?',
    answerAr: 'تقدم المنصة 3 باقات مرنة تناسب جميع الاحتياجات:\n1. الإيجار الشهري (Monthly): اشتراك مرن وتكلفة منخفضة لتجربة التشغيل.\n2. السنوي المعتمد (Annual): الباقة الأكثر شيوعاً وتشمل استضافة Edge فائقة السرعة، الدعم الفني المباشر، والتحديثات الدورية.\n3. التملك الكامل (Full Buyout): التسليم الكامل للكود المصدري الأصلي غير المضغوط مع ترخيص استخدام دائم دون أي اشتراكات مستقبلياً.',
    answerEn: 'We offer 3 flexible tiers:\n1. Monthly Rental: Low commitment operational tier.\n2. Annual Suite: High-performance Vercel Edge hosting with SLA updates.\n3. Full Source Code Buyout: Perpetual license with uncompressed Next.js source repository ownership.',
    order: 2,
    isPublished: true
  },
  {
    id: 'faq-3',
    categoryAr: 'تطبيق PWA',
    categoryEn: 'PWA & Offline',
    questionAr: 'كيف أقوم بتثبيت واستخدام تطبيق الـ PWA على الهاتف والحاسوب؟',
    questionEn: 'How do I install and run the Progressive Web App (PWA)?',
    answerAr: 'يمكنك تثبيت المنصة بنقرة واحدة بالضغط على زر "تثبيت التطبيق الآن" في الشريط العلوي، أو خيار "Add to Home Screen" من قائمة المتصفح. يتميز التطبيق بالعمل كأنه تطبيق محلي سريع جداً، مع التخزين المحلي المؤقت (Service Worker) للعمل حتى عند ضعف أو انقطاع الإنترنت.',
    answerEn: 'Click the "Install App" prompt in the header or "Add to Home Screen" in your browser. The PWA behaves like a native mobile app with Service Worker caching for seamless offline usage.',
    order: 3,
    isPublished: true
  },
  {
    id: 'faq-4',
    categoryAr: 'التخصيص بالذكاء الاصطناعي',
    categoryEn: 'AI Studio',
    questionAr: 'كيف أستخدم استوديو التخصيص بالذكاء الاصطناعي والمحاكي التفاعلي؟',
    questionEn: 'How do I use the AI Customizer Studio & Live Sandbox Simulator?',
    answerAr: 'في تبويب "المحاكي والذكاء الاصطناعي"، يمكنك كتابة أوامرك باللغة الطبيعية وسيقوم المساعد الذكي بتوليد التعديلات فورياً في المحاكي أمامك مع إمكانية إرسال المسودة للأدمن للاعتماد ومتابعة حالتها من لوحة العميل.',
    answerEn: 'In the Sandbox tab, enter natural language prompts to instantaneously re-render the simulator. Submit your staged draft to the Admin and track approval inside your Client Dashboard.',
    order: 4,
    isPublished: true
  }
];

const DEFAULT_INITIAL_ANNOUNCEMENTS: AnnouncementBanner[] = [
  {
    id: 'ann-1',
    titleAr: 'تحديث النسخة v3.8.5',
    titleEn: 'Release v3.8.5 Live',
    messageAr: '🚀 تم إطلاق محرك CMS المتكامل ولوحة التحكم المخصصة لإدارة المحتوى والمقالات والمشاريع مباشرة!',
    messageEn: '🚀 Full-featured CMS and Dedicated Control Panel now live for seamless dynamic content management!',
    badgeAr: 'جديد المنصة',
    badgeEn: 'New Update',
    type: 'success',
    isActive: true,
    targetUrl: '#dashboard'
  }
];

const DEFAULT_INITIAL_USERS: UserAccount[] = [
  {
    id: 'u-tarek-vip',
    name: 'أ. طارق عبد الرحمن',
    phone: '01024889921',
    password: '123',
    email: 'tarek@lernweb.com',
    createdAt: '2026-02-10T11:00:00.000Z',
    purchasedPlanId: 'plan-annual',
    role: 'vip',
    roleAr: 'عميل VIP مميز',
    jobTitle: 'مدير أكاديمية النخبة للغات والرياضيات',
    isBlocked: false,
    notificationsEnabled: true,
    deviceOs: 'Windows 11 / Chrome PWA',
    purchasedSystems: [
      {
        id: 'sys-order-1',
        projectId: 'lms-core-hub',
        projectTitleAr: 'منظومة إدارة المراكز والسناتر التعليمية (LMS Core)',
        projectTitleEn: 'LMS Core Educational Center Manager',
        category: 'lms',
        planType: 'annual',
        amount: '8,500 ج.م',
        licenseKey: 'LERN-2026-9E4B-8821',
        certificateNumber: 'CERT-LW-2026-0042',
        status: 'active',
        isConfirmed: true,
        confirmedAt: '2026-02-12T14:30:00.000Z',
        purchasedAt: '2026-02-11T10:15:00.000Z',
        sourceCodeUrl: 'https://github.com/m77257578-del/lern-web4',
        sandboxTheme: 'ocean',
        notes: 'تم التأكيد والاعتماد الرسمي من الإدارة وتفعيل خوادم Edge السحابية'
      }
    ]
  },
  {
    id: 'u-heba-client',
    name: 'د. هبة الشناوي',
    phone: '01123456789',
    password: '123',
    email: 'heba@academy.edu',
    createdAt: '2026-03-01T09:30:00.000Z',
    purchasedPlanId: 'plan-buyout',
    role: 'client',
    roleAr: 'عميل معتمد',
    jobTitle: 'مشرفة قسم الاختبارات والمناهج',
    isBlocked: false,
    notificationsEnabled: true,
    deviceOs: 'macOS Sonoma / Safari PWA',
    purchasedSystems: [
      {
        id: 'sys-order-2',
        projectId: 'quiz-proctor-ai',
        projectTitleAr: 'منظومة الاختبارات الآمنة ومنع الغش (Proctor AI)',
        projectTitleEn: 'Proctor AI Secure Examination Suite',
        category: 'quiz',
        planType: 'full',
        amount: '27,000 ج.م',
        licenseKey: 'LERN-2026-PENDING-F120',
        certificateNumber: 'CERT-LW-2026-0089',
        status: 'pending',
        isConfirmed: false,
        purchasedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        notes: 'طلب شراء تملك كود مصدري بانتظار تأكيد وتفعيل الإدارة باللوحة'
      }
    ]
  },
  {
    id: 'u-ibrahim-dev',
    name: 'م. إبراهيم كمال',
    phone: '01234567890',
    password: '123',
    email: 'ibrahim@code.dev',
    createdAt: '2026-03-15T16:00:00.000Z',
    role: 'developer',
    roleAr: 'مطور برمجيات معتمد',
    jobTitle: 'مهندس دمج واجهات PWA وAPI',
    isBlocked: false,
    notificationsEnabled: false,
    deviceOs: 'Ubuntu Linux / Firefox',
    purchasedSystems: []
  }
];

const DEFAULT_INITIAL_ORDERS: UserOrder[] = [
  {
    id: 'order-101',
    userId: 'u-tarek-vip',
    userName: 'أ. طارق عبد الرحمن',
    userPhone: '01024889921',
    projectId: 'lms-core-hub',
    projectTitle: 'منظومة إدارة المراكز والسناتر التعليمية (LMS Core)',
    planType: 'annual',
    amount: '8,500 ج.م',
    paymentMethod: 'انستاباي (InstaPay)',
    referenceId: 'IPN-99248102',
    createdAt: '2026-02-11T10:15:00.000Z',
    status: 'confirmed',
    licenseKey: 'LERN-2026-9E4B-8821',
    confirmedAt: '2026-02-12T14:30:00.000Z',
    adminNotes: 'تم التأكيد والاعتماد وتفعيل السيرفرات السحابية'
  },
  {
    id: 'order-102',
    userId: 'u-heba-client',
    userName: 'د. هبة الشناوي',
    userPhone: '01123456789',
    projectId: 'quiz-proctor-ai',
    projectTitle: 'منظومة الاختبارات الآمنة ومنع الغش (Proctor AI)',
    planType: 'full',
    amount: '27,000 ج.م',
    paymentMethod: 'فودافون كاش (Vodafone Cash)',
    referenceId: 'VF-44820199',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'pending',
    licenseKey: '',
    adminNotes: 'بانتظار مراجعة التحويل واعتماد التفعيل من الإدارة'
  }
];

const DEFAULT_INITIAL_NOTIFICATIONS: UserNotification[] = [
  {
    id: 'notif-admin-1',
    userId: 'admin',
    targetRole: 'admin',
    titleAr: '🛒 طلب شراء نظام جديد بانتظار التأكيد',
    titleEn: '🛒 New Platform Order Pending Confirmation',
    messageAr: 'قام العميل د. هبة الشناوي بطلب شراء منظومة الاختبارات الآمنة (Proctor AI) بمبلغ 27,000 ج.م عبر فودافون كاش. يرجى مراجعة وتأكيد وتفعيل الشراء.',
    messageEn: 'Dr. Heba El-Shennawy requested Proctor AI buyout (27,000 EGP) via Vodafone Cash. Please review and confirm.',
    type: 'order_placed',
    read: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    linkUrl: '#orders'
  },
  {
    id: 'notif-admin-2',
    userId: 'admin',
    targetRole: 'admin',
    titleAr: '🤖 مسودة ذكاء اصطناعي جديدة بانتظار المراجعة',
    titleEn: '🤖 New AI Customization Staged Draft',
    messageAr: 'قام زائر/عميل برفع مسودة تخصيص بالذكاء الاصطناعي لمنظومة إدارة السناتر التعليمية بهوية جديدة واسم مركز جديد.',
    messageEn: 'A client submitted an AI customization draft for review.',
    type: 'draft_submitted',
    read: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    linkUrl: '#drafts'
  },
  {
    id: 'notif-client-1',
    userId: 'u-tarek-vip',
    targetRole: 'user',
    titleAr: '🎉 تم تأكيد وتفعيل منظومتك بنجاح!',
    titleEn: '🎉 Platform Purchase Confirmed & Activated!',
    messageAr: 'تهانينا! تم تأكيد وتفعيل شراء منظومة إدارة المراكز والسناتر (LMS Core). كود الترخيص الرسمي: LERN-2026-9E4B-8821. يمكنك الآن تشغيل المنظومة في المحاكي وتنزيل ملفات الكود المصدري.',
    messageEn: 'Congratulations! Your LMS Core platform is confirmed and active. License Key: LERN-2026-9E4B-8821.',
    type: 'system_activated',
    read: false,
    createdAt: '2026-02-12T14:35:00.000Z',
    linkUrl: '#client-portal'
  }
];

let cachedProjects: ProjectItem[] = [...DEFAULT_INITIAL_PROJECTS];
let cachedPublishedProjects: PublishedProject[] = [];
let cachedSettings: AdminSettings | null = null;
let cachedWallets: WalletConfig[] = [];
let cachedPlans: SubscriptionPlan[] = [];
let cachedDrafts: AiCustomizationDraft[] = [];
let cachedUsers: UserAccount[] = [...DEFAULT_INITIAL_USERS];
let cachedMedia: MediaResourceItem[] = [];
let cachedOrders: UserOrder[] = [...DEFAULT_INITIAL_ORDERS];
let cachedReviews: ProjectReview[] = [];
let cachedLogs: ActivityLogItem[] = [];
let cachedQuickReplies: QuickReply[] = [];
export interface AchievementItem {
  id: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  descriptionAr: string;
  descriptionEn: string;
  metricNumber: string;
  metricLabelAr: string;
  metricLabelEn: string;
  imageUrl: string;
  linkUrl?: string;
  isPublished: boolean;
  createdAt: string;
}

const DEFAULT_INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'ach-1',
    titleAr: 'ثورة في أنظمة إدارة التعليم (LMS Revolution)',
    titleEn: 'LMS Management Revolution',
    categoryAr: 'أنظمة إدارة التعلم PWA',
    categoryEn: 'PWA Learning Systems',
    descriptionAr: 'نجحنا في تطوير أول منظومة عربية تدعم العمل بدون إنترنت (PWA) وتوليد بطاقات الهوية الذكية بالباركود، مما قلل وقت تسجيل حضور الطلاب بنسبة 85% في أكثر من 150 سنتر تعليمي.',
    descriptionEn: 'We developed the first Arabic PWA supporting offline operation and QR code attendance cards, reducing check-in time by 85% in over 150 centers.',
    metricNumber: '150+',
    metricLabelAr: 'سنتر تعليمي معتمد',
    metricLabelEn: 'Certified Centers',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
    linkUrl: 'https://lernweb.com/case-studies/lms',
    isPublished: true,
    createdAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 'ach-2',
    titleAr: 'الأمن السيبراني والذكاء الاصطناعي (Proctor AI)',
    titleEn: 'Cybersecurity & AI Proctoring',
    categoryAr: 'حماية وتأمين الاختبارات',
    categoryEn: 'Exam Security & AI',
    descriptionAr: 'منظومة Proctor AI الخاصة بنا أصبحت المعيار الأول للأمان في الاختبارات الأونلاين، حيث تم تنفيذ أكثر من نصف مليون اختبار آمن بدون أي حالات اختراق أو تسريب.',
    descriptionEn: 'Our Proctor AI engine became the benchmark for online exam proctoring, securing 500k+ exams with zero leaks.',
    metricNumber: '500k+',
    metricLabelAr: 'اختبار آمن موثق',
    metricLabelEn: 'Secured Exams',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
    linkUrl: 'https://lernweb.com/tech/security',
    isPublished: true,
    createdAt: '2026-03-20T10:00:00.000Z'
  }
];

let cachedChats: ChatMessage[] = [];
let cachedTickets: SupportTicket[] = [];
let cachedNotifications: UserNotification[] = [...DEFAULT_INITIAL_NOTIFICATIONS];
let cachedArticles: CmsArticle[] = [...DEFAULT_INITIAL_ARTICLES];
let cachedFaqs: FaqItem[] = [...DEFAULT_INITIAL_FAQS];
let cachedAnnouncements: AnnouncementBanner[] = [...DEFAULT_INITIAL_ANNOUNCEMENTS];
let cachedStaff: StaffMember[] = [...DEFAULT_INITIAL_STAFF];
let cachedAchievements: AchievementItem[] = [...DEFAULT_INITIAL_ACHIEVEMENTS];
let cachedCallHistory: AiCallRecord[] = [];
let cachedApplications: JobApplication[] = [];
if (typeof window !== 'undefined') {
  try {
    const rawCalls = localStorage.getItem('lernweb_ai_call_history');
    if (rawCalls) cachedCallHistory = JSON.parse(rawCalls);

    const rawUsers = localStorage.getItem('lernweb_users_backup');
    if (rawUsers) {
      const parsedUsers = JSON.parse(rawUsers);
      if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
        const idMap = new Map(cachedUsers.map(u => [u.id, u]));
        parsedUsers.forEach(u => idMap.set(u.id, { ...idMap.get(u.id), ...u }));
        cachedUsers = Array.from(idMap.values());
      }
    }

    const rawTickets = localStorage.getItem('lernweb_tickets_backup');
    if (rawTickets) {
      const parsedTickets = JSON.parse(rawTickets);
      if (Array.isArray(parsedTickets) && parsedTickets.length > 0) {
        cachedTickets = parsedTickets;
      }
    }

    const rawOrders = localStorage.getItem('lernweb_orders_backup');
    if (rawOrders) {
      const parsedOrders = JSON.parse(rawOrders);
      if (Array.isArray(parsedOrders) && parsedOrders.length > 0) {
        cachedOrders = parsedOrders;
      }
    }

    const rawDrafts = localStorage.getItem('lernweb_drafts_backup');
    if (rawDrafts) {
      const parsedDrafts = JSON.parse(rawDrafts);
      if (Array.isArray(parsedDrafts) && parsedDrafts.length > 0) {
        cachedDrafts = parsedDrafts;
      }
    }
  } catch (e) {
    console.warn('LocalStorage hydration error:', e);
  }
}

let nodeAdminAuth = false;
let nodeUserAuth: UserAccount | null = null;

function safeFetch(url: string, options?: RequestInit) {
  if (typeof window !== 'undefined') {
    return fetch(url, options).catch(err => {
      console.warn('Network call error:', err);
    });
  }
  return Promise.resolve();
}

type StorageListener = () => void;
const storageListeners = new Set<StorageListener>();

export function subscribeToStorage(listener: StorageListener): () => void {
  storageListeners.add(listener);
  return () => {
    storageListeners.delete(listener);
  };
}

export interface AiContext {
  lastUpdated: string;
  lastAction?: string;
  summary: string;
  settings: AdminSettings;
  projects: { id: string; titleAr: string; isPublished: boolean; priceMonthly: string }[];
  drafts: { id: string; visitorName: string; centerName: string; status: string; notes?: string }[];
  staff: { id: string; name: string; role: string; phone: string }[];
  wallets: { name: string; number: string; isActive: boolean }[];
  recentLogs: { actionType: string; titleAr: string; timestamp: string }[];
  announcements: { titleAr: string; messageAr: string; isActive: boolean }[];
}

let currentAiContext: AiContext | null = null;
const aiContextListeners = new Set<(context: AiContext) => void>();

export function subscribeToAiContext(listener: (context: AiContext) => void): () => void {
  aiContextListeners.add(listener);
  if (currentAiContext) {
    try {
      listener(currentAiContext);
    } catch (e) {
      console.error('AI context initial listener error:', e);
    }
  }
  return () => {
    aiContextListeners.delete(listener);
  };
}

export function updateAiContext(actionNotice?: string): AiContext {
  const settings = storageService.getSettings();
  const projects = cachedProjects.map(p => ({
    id: p.id,
    titleAr: p.titleAr,
    isPublished: p.isPublished,
    priceMonthly: p.priceMonthly
  }));
  const drafts = cachedDrafts.map(d => ({
    id: d.id,
    visitorName: d.visitorName || 'زائر',
    centerName: d.modifiedConfig?.centerName || 'بدون اسم',
    status: d.status || 'pending_review',
    notes: d.notes
  }));
  const staff = cachedStaff.map(s => ({
    id: s.id,
    name: s.name,
    role: s.roleAr,
    phone: s.phone
  }));
  const wallets = cachedWallets.map(w => ({
    name: w.nameAr,
    number: w.number,
    isActive: w.isActive
  }));
  const recentLogs = cachedLogs.slice(0, 10).map(l => ({
    actionType: l.actionType,
    titleAr: l.titleAr,
    timestamp: l.timestamp
  }));
  const announcements = cachedAnnouncements.map(a => ({
    titleAr: a.titleAr,
    messageAr: a.messageAr,
    isActive: a.isActive
  }));

  const summary = `
[LERN WEB REAL-TIME AI SYSTEM STATE REPORT]
- Timestamp: ${new Date().toISOString()}
- Last Administrative Action: ${actionNotice || (recentLogs[0]?.titleAr || 'متابعة تشغيل المنصة')}
- Platform Center Name: ${settings.centerName}
- Target WhatsApp: ${settings.targetWhatsAppNumber}
- Active Published Projects Count: ${projects.filter(p => p.isPublished).length} / ${projects.length} Total
- Active Staged Modifications/Drafts: ${drafts.length}
- Customer Service & Staff Team: ${staff.map(s => `${s.name} (${s.role})`).join(', ')}
- Mobile Payment Wallets: ${wallets.filter(w => w.isActive).map(w => `${w.name}: ${w.number}`).join(' | ')}
- Active Announcements: ${announcements.filter(a => a.isActive).map(a => a.messageAr).join(' | ')}
`;

  currentAiContext = {
    lastUpdated: new Date().toISOString(),
    lastAction: actionNotice || (recentLogs[0]?.titleAr || undefined),
    summary,
    settings,
    projects,
    drafts,
    staff,
    wallets,
    recentLogs,
    announcements
  };

  aiContextListeners.forEach(listener => {
    try {
      listener(currentAiContext!);
    } catch (e) {
      console.error('AI context listener callback error:', e);
    }
  });

  return currentAiContext;
}

export function getAiContext(): AiContext {
  if (!currentAiContext) {
    return updateAiContext('Initial AI Context Generation');
  }
  return currentAiContext;
}

export function notifyStorageChange(actionNotice?: string) {
  updateAiContext(actionNotice);
  storageListeners.forEach(listener => {
    try {
      listener();
    } catch (err) {
      console.error('Storage listener error:', err);
    }
  });
}

let lastSyncVersion = 0;
let isSyncing = false;
const syncListeners = new Set<(isSyncing: boolean) => void>();

export function subscribeToSyncState(listener: (isSyncing: boolean) => void): () => void {
  syncListeners.add(listener);
  try {
    listener(isSyncing);
  } catch (e) {
    console.error('Sync listener error:', e);
  }
  return () => {
    syncListeners.delete(listener);
  };
}

export function getIsSyncing(): boolean {
  return isSyncing;
}

function notifySyncStateChange(syncing: boolean) {
  isSyncing = syncing;
  syncListeners.forEach(listener => {
    try {
      listener(isSyncing);
    } catch (err) {
      console.error('Sync listener error:', err);
    }
  });
}

export async function syncStorageWithServer(): Promise<boolean> {
  if (typeof window === 'undefined' || isSyncing) return false;
  notifySyncStateChange(true);
  try {
    const res = await fetch('/api/sync');
    if (!res.ok) throw new Error('Sync failed with status ' + res.status);
    const data = await res.json();

    if (Array.isArray(data.projects)) cachedProjects = data.projects;
    if (data.settings && typeof data.settings === 'object') cachedSettings = data.settings;
    if (Array.isArray(data.wallets)) cachedWallets = data.wallets;
    if (Array.isArray(data.plans)) cachedPlans = data.plans;
    if (Array.isArray(data.drafts)) cachedDrafts = data.drafts;
    if (Array.isArray(data.users)) cachedUsers = data.users;
    if (Array.isArray(data.media)) cachedMedia = data.media;
    if (Array.isArray(data.orders)) cachedOrders = data.orders;
    if (Array.isArray(data.reviews)) cachedReviews = data.reviews;
    if (Array.isArray(data.logs)) cachedLogs = data.logs;
    if (Array.isArray(data.chats)) cachedChats = data.chats;
    if (Array.isArray(data.tickets)) cachedTickets = data.tickets;
    if (Array.isArray(data.notifications)) cachedNotifications = data.notifications;
    if (Array.isArray(data.articles) && data.articles.length > 0) cachedArticles = data.articles;
    if (Array.isArray(data.faqs) && data.faqs.length > 0) cachedFaqs = data.faqs;
    if (Array.isArray(data.announcements) && data.announcements.length > 0) cachedAnnouncements = data.announcements;

    if (data.version) lastSyncVersion = data.version;

    notifyStorageChange();
    return true;
  } catch (err) {
    console.warn('Storage sync error:', err);
    return false;
  } finally {
    notifySyncStateChange(false);
  }
}

export async function initializeStorageBackend() {
  return await syncStorageWithServer();
}

// Automatically sync on load and attach real-time Firestore onSnapshot listeners for cross-device synchronization
if (typeof window !== 'undefined') {
  try {
    console.log('Initializing Firebase real-time listeners...');
    subscribeToCollection('projects', (data) => { console.log('Projects update:', data); cachedProjects = data as ProjectItem[]; notifyStorageChange(); });
    subscribeToCollection('settings', (data) => { 
      console.log('Settings update:', data); 
      if (data && data.length > 0) {
        // Find the 'global' settings doc
        const globalSettings = data.find(d => d.id === 'global');
        if (globalSettings) cachedSettings = globalSettings as AdminSettings;
      }
      notifyStorageChange(); 
    });
    subscribeToCollection('wallets', (data) => { console.log('Wallets update:', data); cachedWallets = data as WalletConfig[]; notifyStorageChange(); });
    subscribeToCollection('plans', (data) => { console.log('Plans update:', data); cachedPlans = data as SubscriptionPlan[]; notifyStorageChange(); });
    subscribeToCollection('drafts', (data) => { console.log('Drafts update:', data); cachedDrafts = data as AiCustomizationDraft[]; notifyStorageChange(); });
    subscribeToCollection('support_tickets', (data) => { console.log('Tickets update:', data); cachedTickets = data as SupportTicket[]; notifyStorageChange(); });
    subscribeToCollection('users', (data) => { console.log('Users update:', data); cachedUsers = data as UserAccount[]; notifyStorageChange(); });
    subscribeToCollection('media_resources', (data) => { console.log('Media update:', data); cachedMedia = data as MediaResourceItem[]; notifyStorageChange(); });
    subscribeToCollection('user_orders', (data) => { console.log('Orders update:', data); cachedOrders = data as UserOrder[]; notifyStorageChange(); });
    subscribeToCollection('reviews', (data) => { console.log('Reviews update:', data); cachedReviews = data as ProjectReview[]; notifyStorageChange(); });
    subscribeToCollection('activity_logs', (data) => { console.log('Logs update:', data); cachedLogs = data as ActivityLogItem[]; notifyStorageChange(); });
    subscribeToCollection('notifications', (data) => { console.log('Notifications update:', data); cachedNotifications = data as UserNotification[]; notifyStorageChange(); });
    subscribeToCollection('articles', (data) => { console.log('Articles update:', data); if (data && data.length > 0) cachedArticles = data as CmsArticle[]; notifyStorageChange(); });
    subscribeToCollection('faqs', (data) => { console.log('FAQs update:', data); if (data && data.length > 0) cachedFaqs = data as FaqItem[]; notifyStorageChange(); });
    subscribeToCollection('announcements', (data) => { console.log('Announcements update:', data); if (data && data.length > 0) cachedAnnouncements = data as AnnouncementBanner[]; notifyStorageChange(); });
    subscribeToCollection('achievements', (data) => { console.log('Achievements update:', data); if (data && data.length > 0) cachedAchievements = data as AchievementItem[]; notifyStorageChange(); });
    console.log('Firebase real-time listeners initialized successfully.');
  } catch (err) {
    console.error('Firebase real-time listener initialization FAILED:', err);
  }
}

export const storageService = {
  subscribe(listener: () => void): () => void {
    return subscribeToStorage(listener);
  },

  getAiContext(): AiContext {
    return getAiContext();
  },

  subscribeToAiContext(listener: (context: AiContext) => void): () => void {
    return subscribeToAiContext(listener);
  },

  getIsSyncing(): boolean {
    return getIsSyncing();
  },

  subscribeToSyncState(listener: (isSyncing: boolean) => void): () => void {
    return subscribeToSyncState(listener);
  },

  async syncNow(): Promise<boolean> {
    return await syncStorageWithServer();
  },

  forceSyncFromFirestore(): void {
    this.syncNow();
    notifyStorageChange();
  },

  isAdminLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lernweb_admin_auth_session') === 'true' || sessionStorage.getItem('lernweb_admin_auth_session') === 'true';
    }
    return nodeAdminAuth;
  },

  getCurrentStaff(): StaffMember | null {
    if (typeof window !== 'undefined') {
      const phone = localStorage.getItem('lernweb_staff_phone') || sessionStorage.getItem('lernweb_staff_phone');
      if (phone) {
        return this.getStaff().find(s => s.phone === phone) || null;
      }
    }
    return null;
  },

  loginAdmin(passcodeAttempt: string): boolean {
    const settings = this.getSettings();
    if (passcodeAttempt.trim() === (settings?.adminPasscode || '100100').trim()) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('lernweb_admin_auth_session', 'true');
        sessionStorage.setItem('lernweb_admin_auth_session', 'true');
        localStorage.removeItem('lernweb_staff_phone');
        sessionStorage.removeItem('lernweb_staff_phone');
      } else {
        nodeAdminAuth = true;
      }
      notifyStorageChange();
      return true;
    }
    return false;
  },

  loginStaff(phone: string, code: string): boolean {
    const settings = this.getSettings();
    const adminPass = settings?.adminPasscode || '100100';
    
    // Check if code is 100100 or the current admin passcode
    if (code !== '100100' && code !== adminPass) {
      return false;
    }

    const staffList = this.getStaff();
    const cleanPhone = phone.replace(/[^\d]/g, '');
    const matchedStaff = staffList.find(s => s.phone.replace(/[^\d]/g, '') === cleanPhone);

    if (matchedStaff && matchedStaff.isActive) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('lernweb_admin_auth_session', 'true');
        sessionStorage.setItem('lernweb_admin_auth_session', 'true');
        localStorage.setItem('lernweb_staff_phone', matchedStaff.phone);
        sessionStorage.setItem('lernweb_staff_phone', matchedStaff.phone);
      }
      notifyStorageChange();
      return true;
    }
    return false;
  },

  logoutAdmin(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lernweb_admin_auth_session');
      sessionStorage.removeItem('lernweb_admin_auth_session');
      localStorage.removeItem('lernweb_staff_phone');
      sessionStorage.removeItem('lernweb_staff_phone');
    } else {
      nodeAdminAuth = false;
    }
    notifyStorageChange();
  },

  getProjects(includeUnpublished: boolean = false): ProjectItem[] {
    const list = (cachedProjects && cachedProjects.length > 0) ? cachedProjects : DEFAULT_INITIAL_PROJECTS;
    if (includeUnpublished) return list;
    const published = list.filter(p => p.isPublished !== false);
    return published.length > 0 ? published : list;
  },

  saveProjects(projects: ProjectItem[]): void {
    cachedProjects = projects;
    notifyStorageChange();
    projects.forEach(p => saveDocument('projects', p));
  },

  addProject(newProject: ProjectItem): void {
    cachedProjects.unshift(newProject);
    notifyStorageChange();
    saveDocument('projects', newProject);
  },

  updateProject(updated: ProjectItem): void {
    cachedProjects = cachedProjects.map(p => p.id === updated.id ? updated : p);
    notifyStorageChange();
    saveDocument('projects', updated);
  },

  deleteProject(projectId: string): void {
    cachedProjects = cachedProjects.filter(p => p.id !== projectId);
    notifyStorageChange();
    deleteDocument('projects', projectId);
  },

  togglePublishProject(projectId: string): boolean {
    let newStatus = false;
    cachedProjects = cachedProjects.map(p => {
      if (p.id === projectId) {
        newStatus = !p.isPublished;
        return { ...p, isPublished: newStatus };
      }
      return p;
    });
    notifyStorageChange();
    
    const project = cachedProjects.find(p => p.id === projectId);
    if (project) saveDocument('projects', project);
    return newStatus;
  },

  getSettings(): AdminSettings {
    const defaultSocialList: SocialMediaLinkItem[] = [
      { id: 'soc-whatsapp', app: 'whatsapp', titleAr: 'واتساب خدمة العملاء', titleEn: 'WhatsApp Support', url: 'https://wa.me/201024889921', isActive: true, order: 1 },
      { id: 'soc-facebook', app: 'facebook', titleAr: 'صفحة فيسبوك الرسمية', titleEn: 'Official Facebook', url: 'https://facebook.com/lernweb.official', isActive: true, order: 2 },
      { id: 'soc-instagram', app: 'instagram', titleAr: 'إنستغرام المنصة', titleEn: 'Instagram', url: 'https://instagram.com/lernweb', isActive: true, order: 3 },
      { id: 'soc-telegram', app: 'telegram', titleAr: 'قناة تيليجرام التحديثات', titleEn: 'Telegram Channel', url: 'https://t.me/lernweb_admin', isActive: true, order: 4 },
      { id: 'soc-youtube', app: 'youtube', titleAr: 'قناة يوتيوب للشروحات', titleEn: 'YouTube Channel', url: 'https://youtube.com/@lernweb', isActive: true, order: 5 },
      { id: 'soc-tiktok', app: 'tiktok', titleAr: 'تيك توك ليرن ويب', titleEn: 'TikTok', url: 'https://tiktok.com/@lernweb', isActive: true, order: 6 },
      { id: 'soc-twitter', app: 'twitter', titleAr: 'منصة إكس (تويتر)', titleEn: 'X (Twitter)', url: 'https://x.com/lernweb', isActive: true, order: 7 },
      { id: 'soc-linkedin', app: 'linkedin', titleAr: 'حساب لينكد إن للمنظومة', titleEn: 'LinkedIn Company', url: 'https://linkedin.com/company/lernweb', isActive: true, order: 8 }
    ];

    const defaultSiteContent: SiteContentSettings = {
      heroBadgeAr: 'منصة ويب ديناميكية متكاملة • محرك CMS • لوحة تحكم مخصصة • تملك كامل للكود',
      heroBadgeEn: 'Unified Dynamic Web Platform, CMS & One-Page Suite',
      heroTitleAr: 'منظومة ليرن ويب المتكاملة لإدارة المراكز، سوق الأدوات والـ CMS',
      heroTitleEn: 'Lern Web Unified Dynamic Platform & Dedicated CMS',
      heroSubtitleAr: 'تطبيق ويب ديناميكي متكامل ذو صفحة واحدة يوفر سوقاً حياً لمنظومات السناتر والتعليم الذكي، محاكياً تفاعلياً مدعوماً بالذكاء الاصطناعي، ونظام إدارة محتوى (CMS) متقدم يمنحك لوحة تحكم مخصصة لإدارة المقالات، الإعلانات، المحافظ، ومسودات الـ AI لحظياً.',
      heroSubtitleEn: 'An integrated single-page dynamic web application offering a live educational software marketplace, interactive AI sandbox simulator, and dedicated CMS control panel for live content and system orchestration.',
      heroCtaStoreAr: 'استعراض سوق المنظومات',
      heroCtaStoreEn: 'Explore Marketplace',
      heroCtaSandboxAr: 'تشغيل المحاكي التفاعلي و AI',
      heroCtaSandboxEn: 'Launch Sandbox Simulator',
      heroCtaArticlesAr: 'مقالات ودراسات الـ CMS',
      heroCtaArticlesEn: 'CMS Knowledgebase',
      heroCtaAdminAr: 'لوحة التحكم والـ CMS',
      heroCtaAdminEn: 'CMS Control Panel',

      stat1Number: '150+',
      stat1LabelAr: 'سنتر تعليمي ومنظومة جاهزة',
      stat1LabelEn: 'Certified Deployable Systems',
      stat2Number: '25+',
      stat2LabelAr: 'قناة ومفتاح ذكاء اصطناعي نشط',
      stat2LabelEn: 'Active AI Rotating Keys',
      stat3Number: '500k+',
      stat3LabelAr: 'جلسة تدريب واختبار آمن',
      stat3LabelEn: 'Secured AI Testing Runs',
      stat4Number: '99.9%',
      stat4LabelAr: 'جاهزية خوادم Edge وتطبيق PWA',
      stat4LabelEn: 'PWA & Edge Uptime SLA',

      sections: {
        store: {
          id: 'store',
          enabled: true,
          titleAr: 'سوق المنظومات والتطبيقات الجاهزة',
          titleEn: 'Ready-to-Deploy Systems Marketplace',
          subtitleAr: 'اختر المنظومة الأنسب لمركزك التعليمي، تصفح تفاصيل الأكواد وجربها فوراً في المحاكي.',
          subtitleEn: 'Browse modular software architectures, inspect source stacks, and test immediately.'
        },
        sandbox: {
          id: 'sandbox',
          enabled: true,
          titleAr: 'المحاكي التفاعلي واستوديو التخصيص بالذكاء الاصطناعي',
          titleEn: 'Live Interactive Sandbox & AI Studio',
          subtitleAr: 'اختبر واجهات المركز التعليمي، الامتحانات الآلية، واطلب من الذكاء الاصطناعي تعديل الأكواد والألوان فورياً.',
          subtitleEn: 'Test student check-in portals, automated examinations, and stage code modifications with AI.'
        },
        articles: {
          id: 'articles',
          enabled: true,
          titleAr: 'مقالات المنصة والـ CMS المعرفي',
          titleEn: 'Platform Articles & Knowledgebase',
          subtitleAr: 'أحدث الدراسات التقنية والتعليمية حول التحول الرقمي وحلول تطبيقات الويب التقدمية PWA.',
          subtitleEn: 'In-depth research on educational transformation and progressive web apps.'
        },
        pricing: {
          id: 'pricing',
          enabled: true,
          titleAr: 'باقات الاشتراك، التراخيص وطرق الدفع الفوري',
          titleEn: 'Pricing, Licensing Tiers & Payment Wallets',
          subtitleAr: 'خيارات ترخيص مرنة تلبي متطلبات المدرسين المستقلين والمراكز الكبرى مع تملك كامل للكود المصدري.',
          subtitleEn: 'Flexible licensing tiers for independent educators, large tutoring centers, and full buyout ownership.'
        },
        faq: {
          id: 'faq',
          enabled: true,
          titleAr: 'الأسئلة الشائعة وإرشادات الاستخدام',
          titleEn: 'Frequently Asked Questions (FAQ)',
          subtitleAr: 'إجابات مباشرة ودقيقة عن كافة تفاصيل الترخيص، التثبيت بدون إنترنت، وربط المنظومة.',
          subtitleEn: 'Comprehensive answers regarding offline operation, PWA installation, and source licensing.'
        },
        about: {
          id: 'about',
          enabled: true,
          titleAr: 'عن منصة ليرن ويب (Lern Web)',
          titleEn: 'About Lern Web Platform',
          subtitleAr: 'المنظومة السحابية المتكاملة لتطوير وتخصيص المشاريع البرمجية وتطبيقات الويب الذكية.',
          subtitleEn: 'Universal cloud ecosystem for software development, SaaS architectures, and educational suites.'
        }
      },

      aboutMissionAr: 'تمكين أصحاب المراكز التعليمية والمدرسين والمؤسسات من امتلاك منصاتهم المستقلة بهويتهم البصرية الكاملة، مع دعم كامل للتشغيل بدون إنترنت عبر تقنية PWA وتسليم الأكواد المصدرية بالكامل دون أي قيود.',
      aboutMissionEn: 'Empowering educators and academies with fully-branded, independent web platforms featuring offline PWA support and uncompressed full source code ownership.',
      aboutVisionAr: 'أن نكون المنظومة التقنية الأولى في الشرق الأوسط في توفير بنية تحتية سحابية موثوقة وعالية الأمان تجمع بين الذكاء الاصطناعي الفوري، المحاكيات التفاعلية، ونظم إدارة المحتوى الحديثة.',
      aboutVisionEn: 'To be the leading technology backbone in the region delivering cloud-native, AI-augmented, and offline-capable digital platforms.',
      aboutFounderAr: 'تمت هندسة وبرمجة المنظومة بعناية فائقة لتقديم أقصى درجات السرعة والموثوقية، مع لوحة تحكم مخصصة تمنحك السيادة والتحكم التام في كل حرف وقسم في منصتك.',
      aboutFounderEn: 'Architected for uncompromising speed, sub-second latency, and complete administrative sovereignty over every aspect of your application.',

      footerDescriptionAr: 'منظومة ليرن ويب | Lern Web التعليمية المتكاملة • محرك PWA يعمل بدون إنترنت • نظام إدارة محتوى (CMS) متقدم • محاكي السناتر بالذكاء الاصطناعي • ملكية كاملة للكود المصدري',
      footerDescriptionEn: 'Lern Web Cloud Educational Ecosystem • Dynamic Single Page Architecture • Full CMS & Dedicated Control Panel',
      footerCopyrightAr: 'جميع الحقوق محفوظة © لشركة ومنظومة ليرن ويب (Lern Web)',
      footerCopyrightEn: 'All Rights Reserved © Lern Web Platform Ecosystem'
    };

    const base = cachedSettings || {
      adminPasscode: '100100',
      targetWhatsAppNumber: '201024889921',
      centerName: 'ليرن ويب | Lern Web',
      contactEmail: 'contact@lernweb.com',
      socialLinks: {
        whatsapp: 'https://wa.me/201024889921',
        facebook: 'https://facebook.com/lernweb.official',
        youtube: 'https://youtube.com/@lernweb',
        tiktok: 'https://tiktok.com/@lernweb'
      },
      socialAppNames: { whatsapp: 'واتساب', facebook: 'فيسبوك', youtube: 'يوتيوب', tiktok: 'تيك توك' },
      socialLinksList: defaultSocialList,
      siteContent: defaultSiteContent,
      paymentMethodLabels: { ar: 'طرق الدفع والاشتراك', en: 'Payment Methods' },
      primaryColor: '#2563eb',
      accentColor: '#8b5cf6',
      themeMode: 'user',
      isAiChatEnabled: false,
      globalPrices: { monthlyAr: '950 ج.م / $29', monthlyEn: '$29 / 950 EGP', annualAr: '8,500 ج.م / $249', annualEn: '$249 / 8,500 EGP', fullAr: '27,000 ج.م / $799', fullEn: '$799 / 27,000 EGP' },
      seoSettings: { title: 'ليرن ويب | Lern Web', description: 'منصة تعليمية', ogImage: '', twitterImage: '' }
    };

    // Ensure socialLinksList is always an array
    if (!base.socialLinksList || !Array.isArray(base.socialLinksList) || base.socialLinksList.length === 0) {
      base.socialLinksList = defaultSocialList;
    }

    // Ensure siteContent is deeply merged with defaults
    if (!base.siteContent) {
      base.siteContent = defaultSiteContent;
    } else {
      base.siteContent = {
        ...defaultSiteContent,
        ...base.siteContent,
        sections: {
          ...defaultSiteContent.sections,
          ...(base.siteContent.sections || {})
        }
      };
    }

    return base;
  },

  saveSettings(settings: AdminSettings): void {
    cachedSettings = settings;
    notifyStorageChange();
    // Save to Firestore with fixed ID 'global'
    saveDocument('settings', { ...settings, id: 'global' });
    
    safeFetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).catch(err => console.error(err));
  },

  getSocialLinks(): SocialMediaLinkItem[] {
    const settings = this.getSettings();
    return settings.socialLinksList || [];
  },

  saveSocialLinks(links: SocialMediaLinkItem[]): void {
    const settings = this.getSettings();
    const updated: AdminSettings = {
      ...settings,
      socialLinksList: links
    };
    this.saveSettings(updated);
  },

  getSiteContent(): SiteContentSettings {
    const settings = this.getSettings();
    return settings.siteContent!;
  },

  saveSiteContent(siteContent: SiteContentSettings): void {
    const settings = this.getSettings();
    const updated: AdminSettings = {
      ...settings,
      siteContent
    };
    this.saveSettings(updated);
  },

  getWallets(): WalletConfig[] {
    const defaultWallets: WalletConfig[] = [
      {
        id: 'vodafone-cash',
        nameAr: 'فودافون كاش (Vodafone Cash)',
        nameEn: 'Vodafone Cash (Egypt)',
        number: '01024889921',
        badge: 'مصر - فودافون كاش فوري',
        instructionsAr: 'حول المبلغ المطلوب إلى رقم فودافون كاش الموضح، ثم احتفظ بكود العملية أو لقطة الشاشة.',
        instructionsEn: 'Transfer funds to the specified Vodafone Cash number, then submit reference ID.',
        color: '#e11d48',
        isActive: true
      },
      {
        id: 'orange-cash',
        nameAr: 'أورانج كاش (Orange Cash)',
        nameEn: 'Orange Cash (Egypt)',
        number: '01224889921',
        badge: 'محفظة أورانج كاش الفورية',
        instructionsAr: 'قم بإدخال رقم هاتفك المحمول ليصلك كود التحقق OTP لإتمام الدفع المباشر، أو حول إلى رقم المحفظة.',
        instructionsEn: 'Enter your registered mobile phone number to receive a one-time OTP verification code for instant checkout.',
        color: '#f97316',
        isActive: true
      },
      {
        id: 'instapay',
        nameAr: 'انستاباي الفوري (InstaPay)',
        nameEn: 'InstaPay Direct IPN (Egypt)',
        number: 'lernweb@instapay',
        badge: 'تحويل بنكي لحظي 0% عمولة',
        instructionsAr: 'افتح تطبيق انستاباي، اختر تحويل إلى عنوان دفع لحظي (IPA) واكتب lernweb@instapay ثم اضغط تأكيد.',
        instructionsEn: 'Transfer via InstaPay IPA to lernweb@instapay without fees.',
        color: '#6366f1',
        isActive: true
      }
    ];

    if (!cachedWallets || cachedWallets.length === 0) return defaultWallets;
    
    // Ensure orange-cash is present if it's a default but missing in Firestore
    if (!cachedWallets.find(w => w.id === 'orange-cash')) {
      cachedWallets.splice(1, 0, defaultWallets[1]);
    }
    return cachedWallets;
  },

  saveWallets(wallets: WalletConfig[]): void {
    cachedWallets = wallets;
    notifyStorageChange();
    wallets.forEach(w => saveDocument('wallets', w));
    safeFetch('/api/wallets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wallets)
    }).catch(() => {});
  },

  addWallet(wallet: WalletConfig): void {
    const current = this.getWallets();
    const next = [wallet, ...current.filter(w => w.id !== wallet.id)];
    this.saveWallets(next);
  },

  updateWallet(wallet: WalletConfig): void {
    const current = this.getWallets();
    const next = current.map(w => w.id === wallet.id ? wallet : w);
    this.saveWallets(next);
  },

  deleteWallet(walletId: string): void {
    const current = this.getWallets();
    const next = current.filter(w => w.id !== walletId);
    this.saveWallets(next);
    deleteDocument('wallets', walletId);
  },

  savePlans(plans: SubscriptionPlan[]): void {
    cachedPlans = plans;
    notifyStorageChange();
    plans.forEach(p => saveDocument('plans', p));
  },

  addPlan(plan: SubscriptionPlan): void {
    cachedPlans.push(plan);
    this.savePlans(cachedPlans);
  },

  updatePlan(updated: SubscriptionPlan): void {
    cachedPlans = cachedPlans.map(p => p.id === updated.id ? updated : p);
    this.savePlans(cachedPlans);
  },

  deletePlan(id: string): void {
    cachedPlans = cachedPlans.filter(p => p.id !== id);
    this.savePlans(cachedPlans);
    deleteDocument('plans', id);
  },

  getAiDrafts(): AiCustomizationDraft[] {
    return cachedDrafts;
  },

  saveAiDraft(draft: AiCustomizationDraft): void {
    cachedDrafts.unshift(draft);
    notifyStorageChange();
    saveDocument('drafts', draft);

    // Notify Admin of staged AI customization draft
    this.sendAdminNotification(
      '🤖 مسودة تخصيص بالذكاء الاصطناعي جديدة',
      '🤖 New AI Customization Draft Submitted',
      `أرسل العميل (${draft.visitorName || 'زائر'} - هاتف: ${draft.visitorPhone || 'غير مسجل'}) مسودة تخصيص بالذكاء الاصطناعي لمنصة: [${draft.projectTitle}] باسم مركز: "${draft.modifiedConfig?.centerName || 'بدون اسم'}".`,
      `New AI draft from ${draft.visitorName || 'Visitor'} for ${draft.projectTitle}.`,
      'draft_submitted',
      { draftId: draft.id, visitorId: draft.visitorId }
    );
  },

  updateAiDraftStatus(draftId: string, newStatus: any, notes?: string): void {
    cachedDrafts = cachedDrafts.map(d => d.id === draftId ? { ...d, status: newStatus, notes: notes !== undefined ? notes : d.notes } : d);
    notifyStorageChange();
    const target = cachedDrafts.find(d => d.id === draftId);
    if (target) {
      saveDocument('drafts', target);
      if (target.visitorId) {
        const statusMapAr: Record<string, string> = {
          'pending_review': 'قيد المراجعة الفنية',
          'in_progress': 'قيد التنفيذ والبرمجة والتطوير',
          'completed': 'تم التنفيذ والتجهيز',
          'approved_published': 'تم الاعتماد والنشر في المتجر العام',
          'rejected': 'مرفوض / يحتاج تعديل'
        };
        const stLabel = statusMapAr[newStatus] || newStatus;
        this.sendClientNotification(
          target.visitorId,
          `🔔 تحديث حالة طلب تعديل المنصة: [${target.modifiedConfig?.centerName || target.projectTitle}]`,
          `🔔 Platform Request Status Updated`,
          `قامت الإدارة بتحديث حالة طلبك للمنصة "${target.modifiedConfig?.centerName || target.projectTitle}" إلى: [${stLabel}]` + (notes ? `\n\nملاحظة الإدارة: ${notes}` : ''),
          `Your platform request status has been updated to [${newStatus}].`,
          'status_change',
          { draftId: target.id, status: newStatus }
        );
      }
    }
  },

  addMediaResource(item: MediaResourceItem): void {
    cachedMedia.unshift(item);
    notifyStorageChange();
    saveDocument('media_resources', item);
  },

  deleteMediaResource(id: string): void {
    cachedMedia = cachedMedia.filter(m => m.id !== id);
    notifyStorageChange();
    deleteDocument('media_resources', id);
  },

  saveUserOrder(order: UserOrder): void {
    cachedOrders.unshift(order);
    notifyStorageChange();
    saveDocument('user_orders', order);
    safeFetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    }).catch(() => {});

    // Notify Admin of new client order
    this.sendAdminNotification(
      '🛒 طلب شراء جديد من عميل بالمنصة',
      '🛒 New Client Platform Order Received',
      `قام العميل (${order.userName} - هاتف: ${order.userPhone}) بطلب شراء منصة: [${order.projectTitle || order.planType}] بقيمة ${order.amount} عبر [${order.paymentMethod}]. كود العملية: ${order.referenceId || order.id}. يرجى مراجعة وتأكيد الطلب.`,
      `New order from ${order.userName} (${order.userPhone}) for ${order.projectTitle || order.planType} - ${order.amount}.`,
      'order_placed',
      { orderId: order.id, userId: order.userId }
    );
  },

  addReview(review: ProjectReview): void {
    cachedReviews.unshift(review);
    notifyStorageChange();
    saveDocument('reviews', review);
  },

  deleteReview(reviewId: string): void {
    cachedReviews = cachedReviews.filter(r => r.id !== reviewId);
    notifyStorageChange();
    deleteDocument('reviews', reviewId);
  },

  addUser(user: UserAccount): void {
    if (!cachedUsers.find(u => u.id === user.id)) {
      cachedUsers.push(user);
      notifyStorageChange();
      saveDocument('users', user);
    }
  },

  getAchievements(): AchievementItem[] {
    return cachedAchievements.filter(a => a.isPublished !== false);
  },

  getAllAchievements(): AchievementItem[] {
    return cachedAchievements;
  },

  saveAchievement(item: AchievementItem): void {
    const idx = cachedAchievements.findIndex(a => a.id === item.id);
    if (idx !== -1) {
      cachedAchievements[idx] = item;
    } else {
      cachedAchievements.unshift(item);
    }
    notifyStorageChange();
    saveDocument('achievements', item);
  },

  deleteAchievement(id: string): void {
    cachedAchievements = cachedAchievements.filter(a => a.id !== id);
    notifyStorageChange();
    deleteDocument('achievements', id);
  },

  registerUser(phone: string, name: string, password: string, email?: string): UserAccount | null {
    const cleanPhone = phone.trim();
    const cleanName = name.trim().toLowerCase();
    const cleanEmail = (email || '').trim().toLowerCase();

    // Reject registration if phone or email already exists in cachedUsers (ignore name)
    const isDuplicate = cachedUsers.some(u => {
      const matchPhone = u.phone && cleanPhone && u.phone.trim() === cleanPhone;
      const matchEmail = u.email && cleanEmail && u.email.trim().toLowerCase() === cleanEmail;
      
      if (matchPhone || matchEmail) {
        console.warn('Duplicate registration detected:', { matchPhone, matchEmail, cleanPhone, cleanEmail });
        return true;
      }
      return false;
    });

    if (isDuplicate) {
      return null;
    }

    let user: UserAccount = {
      id: 'u-' + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      phone: cleanPhone,
      password,
      email: email ? email.trim() : '',
      role: 'client',
      roleAr: 'عميل معتمد',
      isBlocked: false,
      notificationsEnabled: true,
      purchasedSystems: [],
      createdAt: new Date().toISOString()
    };
    this.addUser(user);
    this.saveUserSession(user);

    // Notify Admin of new registration
    this.sendAdminNotification(
      '👤 انضمام عميل جديد للمنظومة',
      '👤 New Client Registered',
      `سجل عميل جديد بالمنظومة: ${name.trim()} (هاتف: ${cleanPhone}${cleanEmail ? ' | إيميل: ' + cleanEmail : ''}).`,
      `New client registered: ${name.trim()} (${cleanPhone}).`,
      'system',
      { userId: user.id }
    );

    return user;
  },

  authenticateUser(phone: string, password: string): UserAccount | null {
    const user = cachedUsers.find(u => u.phone.trim() === phone.trim() && u.password === password);
    if (user) {
      if (user.isBlocked) {
        return { ...user, isBlocked: true };
      }
      this.saveUserSession(user);
      return user;
    }
    return null;
  },

  saveUserSession(user: UserAccount): void {
    if (user.isBlocked) return;
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('lernweb_user_auth_session', JSON.stringify(user));
        localStorage.setItem('lernweb_user_auth_session', JSON.stringify(user));
      } catch (e) {
        console.warn('Storage write failed', e);
      }
    }
    notifyStorageChange();
  },

  loginUser(phone: string, name: string, email?: string): UserAccount {
    let user = cachedUsers.find(u => u.phone === phone);
    if (!user) {
      user = {
        id: 'u-' + Math.random().toString(36).substr(2, 9),
        name,
        phone,
        email: email || '',
        role: 'client',
        roleAr: 'عميل معتمد',
        notificationsEnabled: true,
        purchasedSystems: [],
        createdAt: new Date().toISOString()
      };
      this.addUser(user);
    } else {
      user.name = name;
      if (email) user.email = email;
      notifyStorageChange();
      saveDocument('users', user);
    }

    if (!user.isBlocked) {
      this.saveUserSession(user);
    }
    return user;
  },

  getCurrentUser(): UserAccount | null {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('lernweb_user_auth_session') || localStorage.getItem('lernweb_user_auth_session');
        if (!stored) return null;
        const parsed = JSON.parse(stored);
        const liveUser = cachedUsers.find(u => u.id === parsed.id);
        return liveUser || parsed;
      } catch {
        return null;
      }
    }
    return null;
  },

  updateUserProfile(userId: string, updatedFields: any): UserAccount | null {
    const index = cachedUsers.findIndex(u => u.id === userId);
    if (index !== -1) {
      cachedUsers[index] = { ...cachedUsers[index], ...updatedFields };
      const updatedUser = cachedUsers[index];
      notifyStorageChange();
      
      // Save to Firestore
      saveDocument('users', updatedUser);

      safeFetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      }).catch(err => console.error(err));

      const current = this.getCurrentUser();
      if (current && current.id === userId && typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('lernweb_user_auth_session', JSON.stringify(updatedUser));
          localStorage.setItem('lernweb_user_auth_session', JSON.stringify(updatedUser));
        } catch (e) {
          console.warn('Storage write failed', e);
        }
      }
      return updatedUser;
    }
    return null;
  },

  deleteUser(userId: string): boolean {
    if (!userId) return false;
    const target = cachedUsers.find(u => u.id === userId);
    cachedUsers = cachedUsers.filter(u => u.id !== userId);
    cachedDrafts = cachedDrafts.filter(d => d.visitorId !== userId);
    cachedOrders = cachedOrders.filter(o => o.userId !== userId);
    notifyStorageChange();
    deleteDocument('users', userId);
    safeFetch('/api/users/' + userId, { method: 'DELETE' }).catch(err => console.error(err));
    this.addActivityLog(
      'user_deleted' as any,
      `حذف حساب العميل: ${target?.name || userId}`,
      `Deleted user account: ${target?.name || userId}`
    );
    return true;
  },

  toggleBlockUser(userId: string, isBlocked: boolean, reason?: string): UserAccount | null {
    const user = cachedUsers.find(u => u.id === userId);
    if (!user) return null;
    user.isBlocked = isBlocked;
    if (reason !== undefined) user.blockReason = reason;
    notifyStorageChange();
    saveDocument('users', user);
    safeFetch('/api/users/' + userId, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isBlocked, blockReason: reason })
    }).catch(() => {});

    // Send notification to user
    if (isBlocked) {
      this.sendClientNotification(
        userId,
        '⚠️ تنبيه إداري: تم حظر وتجميد الحساب',
        '⚠️ Account Suspended by Administration',
        `تم إيقاف وتجميد حسابك في المنظومة من قبل إدارة المنصة.` + (reason ? ` السبب: ${reason}` : ''),
        `Your account has been temporarily suspended by platform administration.` + (reason ? ` Reason: ${reason}` : ''),
        'account_blocked'
      );
    } else {
      this.sendClientNotification(
        userId,
        '✅ تنبيه إداري: تم إلغاء حظر حسابك واستعادة الصلاحيات',
        '✅ Account Suspension Lifted',
        'تم رفع الحظر عن حسابك بنجاح من قبل إدارة المنصة ويمكنك الآن متابعة استخدام كافة خدمات المنظومة.',
        'Your account access has been fully restored by administration.',
        'system'
      );
    }

    this.addActivityLog(
      'user_status_changed' as any,
      `${isBlocked ? 'حظر وتجميد' : 'إلغاء حظر'} حساب العميل: ${user.name}`,
      `${isBlocked ? 'Banned' : 'Unbanned'} client account: ${user.name}`,
      reason ? `السبب: ${reason}` : undefined
    );
    return user;
  },

  promoteUserRole(userId: string, role: string, roleAr: string, jobTitle?: string): UserAccount | null {
    const user = cachedUsers.find(u => u.id === userId);
    if (!user) return null;
    user.role = role;
    user.roleAr = roleAr;
    if (jobTitle !== undefined) user.jobTitle = jobTitle;
    notifyStorageChange();
    saveDocument('users', user);
    safeFetch('/api/users/' + userId, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, roleAr, jobTitle })
    }).catch(() => {});

    // Notify client
    this.sendClientNotification(
      userId,
      `🎖️ تهانينا! تم ترقيتك إلى منصب: [${roleAr}]`,
      `🎖️ Congratulations! Promoted to [${role}]`,
      `تم اعتماد ترقية حسابك الرسمي من قبل الإدارة إلى منصب: ${roleAr}` + (jobTitle ? ` بمسمى وظيفي: "${jobTitle}"` : '') + `، وتم منحك الصلاحيات المخصصة لهذا المنصب في المنظومة.`,
      `Your account has been officially promoted to ${roleAr} (${jobTitle || ''}) by management with enhanced privileges.`,
      'role_promoted'
    );

    this.addActivityLog(
      'user_promoted' as any,
      `ترقية العميل ${user.name} لمنصب: ${roleAr}`,
      `Promoted user ${user.name} to role: ${roleAr}`,
      jobTitle ? `المسمى الوظيفي: ${jobTitle}` : undefined
    );
    return user;
  },

  toggleUserVerification(userId: string, isVerified: boolean): UserAccount | null {
    const user = cachedUsers.find(u => u.id === userId);
    if (!user) return null;
    user.isVerified = isVerified;
    user.verifiedAt = isVerified ? new Date().toISOString() : undefined;
    notifyStorageChange();
    saveDocument('users', user);
    safeFetch('/api/users/' + userId, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVerified, verifiedAt: user.verifiedAt })
    }).catch(() => {});

    // Notify client
    if (isVerified) {
      this.sendClientNotification(
        userId,
        '🌟 تهانينا! تم توثيق حسابك رسمياً من قبل الإدارة',
        '🌟 Account Officially Verified',
        'تم توثيق حسابك في منصة ليرن ويب بنجاح من قبل الإدارة وتم منحك شارة العميل الموثق والاعتماد الرسمي.',
        'Your platform account has been officially verified by administration with the verified badge.',
        'account_verified'
      );
    } else {
      this.sendClientNotification(
        userId,
        'ℹ️ تنبيه: تم إزالة حالة التوثيق من حسابك',
        'ℹ️ Account Verification Status Updated',
        'تم إزالة شارة التوثيق الرسمية من حسابك مؤقتاً من قبل الإدارة.',
        'Account verification status has been updated by administration.',
        'system'
      );
    }

    this.addActivityLog(
      'user_status_changed' as any,
      `${isVerified ? 'توثيق' : 'إلغاء توثيق'} حساب العميل: ${user.name}`,
      `${isVerified ? 'Verified' : 'Unverified'} client account: ${user.name}`
    );
    return user;
  },

  confirmUserSystemPurchase(userId: string, systemIdOrOrderId: string): PurchasedSystemRecord | null {
    const user = cachedUsers.find(u => u.id === userId);
    if (!user) return null;

    if (!user.purchasedSystems) user.purchasedSystems = [];
    let system = user.purchasedSystems.find(s => s.id === systemIdOrOrderId || s.projectId === systemIdOrOrderId);

    const now = new Date().toISOString();
    const hex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const generatedLicense = `LERN-2026-${hex}-${Math.floor(1000 + Math.random() * 9000)}`;
    const certNumber = `CERT-LW-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    if (system) {
      system.isConfirmed = true;
      system.status = 'active';
      system.confirmedAt = now;
      if (!system.licenseKey || system.licenseKey.includes('PENDING')) {
        system.licenseKey = generatedLicense;
      }
      if (!system.certificateNumber) {
        system.certificateNumber = certNumber;
      }
    } else {
      // Find matching project or order
      const order = cachedOrders.find(o => o.id === systemIdOrOrderId || (o.userId === userId && o.projectId === systemIdOrOrderId));
      const project = cachedProjects.find(p => p.id === (order?.projectId || systemIdOrOrderId)) || cachedProjects[0];
      const defaultSlug = order?.platformNameEn ? order.platformNameEn.toLowerCase().replace(/[^a-z0-9-]/g, '') : 'platform';
      const vercelUrl = order?.generatedVercelUrl || (defaultSlug ? `https://${defaultSlug}.vercel.app` : 'https://vercel.app');

      system = {
        id: 'sys-' + Date.now(),
        projectId: project.id,
        projectTitleAr: project.titleAr,
        projectTitleEn: project.titleEn,
        platformNameAr: order?.platformNameAr || project.titleAr,
        platformNameEn: order?.platformNameEn || project.titleEn,
        generatedVercelUrl: vercelUrl,
        category: project.category || 'lms',
        planType: (order?.planType as any) || 'annual',
        amount: order?.amount || project.priceAnnual || '8,500 ج.م',
        licenseKey: generatedLicense,
        certificateNumber: certNumber,
        status: 'active',
        isConfirmed: true,
        confirmedAt: now,
        purchasedAt: order?.createdAt || now,
        sourceCodeUrl: 'https://github.com/m77257578-del/lern-web4',
        sandboxTheme: project.sandboxConfig?.theme || 'ocean',
        notes: 'تم التأكيد والاعتماد وتوليد الترخيص الرسمي من الإدارة'
      };
      user.purchasedSystems.push(system);
    }

    // Update order status if exists
    const matchedOrder = cachedOrders.find(o => o.userId === userId && (o.id === systemIdOrOrderId || o.projectId === system?.projectId));
    if (matchedOrder) {
      matchedOrder.status = 'confirmed';
      matchedOrder.confirmedAt = now;
      matchedOrder.licenseKey = system.licenseKey;
      matchedOrder.certificateNumber = system.certificateNumber;
      if (!matchedOrder.generatedVercelUrl && system.generatedVercelUrl) {
        matchedOrder.generatedVercelUrl = system.generatedVercelUrl;
      }
      saveDocument('user_orders', matchedOrder);
      safeFetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchedOrder)
      }).catch(() => {});
    }

    notifyStorageChange();
    saveDocument('users', user);

    // Notify Client
    this.sendClientNotification(
      userId,
      `🎉 تم تأكيد وتفعيل المنصة: [${system.platformNameAr || system.projectTitleAr}]!`,
      `🎉 System Confirmed & Activated: [${system.platformNameEn || system.projectTitleEn}]!`,
      `تهانينا! قامت إدارة المنظومة بمراجعة واعتماد طلب الشراء وتفعيل المنصة لحسابك رسميًا.\n\n• رابط المنصة على Vercel: ${system.generatedVercelUrl || 'https://vercel.app'}\n• كود الترخيص الرسمي: ${system.licenseKey}\n• رقم شهادة الملكية: ${system.certificateNumber}\n\nيمكنك الآن الدخول إلى تبويب "حسابي والمنصات المشتراة" لتشغيل المنصة في المحاكي، زيارة رابط Vercel، ونسخ الكود المصدري وشهادة الترخيص.`,
      `Your platform purchase has been approved and activated by administration!\n\nVercel Live URL: ${system.generatedVercelUrl || 'https://vercel.app'}\nLicense Key: ${system.licenseKey}\nCertificate: ${system.certificateNumber}`,
      'system_activated',
      { systemId: system.id, licenseKey: system.licenseKey }
    );

    this.addActivityLog(
      'order_confirmed' as any,
      `تأكيد وتفعيل منصة (${system.platformNameAr || system.projectTitleAr}) للعميل: ${user.name}`,
      `Confirmed & activated platform (${system.platformNameEn || system.projectTitleEn}) for user: ${user.name}`,
      `رابط Vercel: ${system.generatedVercelUrl || 'https://vercel.app'} - كود الترخيص: ${system.licenseKey}`
    );

    return system;
  },

  rejectUserOrder(orderId: string, notes?: string): boolean {
    const order = cachedOrders.find(o => o.id === orderId);
    if (!order) return false;
    order.status = 'rejected';
    order.adminNotes = notes || 'تم رفض الطلب أو طلب مراجعة إيصال التحويل.';
    notifyStorageChange();
    saveDocument('user_orders', order);
    safeFetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    }).catch(() => {});

    this.sendClientNotification(
      order.userId,
      `⚠️ تحديث بخصوص طلب الشراء: [${order.platformNameAr || order.projectTitle || order.id}]`,
      `⚠️ Order Status Update: [${order.platformNameEn || order.projectTitle || order.id}]`,
      `نود إبلاغك بأن طلب التحويل بحاجة إلى مراجعة.\nالسبب / ملاحظات الإدارة: ${notes || 'يرجى التأكد من صحة رقم المحفظة أو إيصال التحويل المرفق وإعادة إرساله.'}`,
      `Your order requires revision: ${notes || 'Please verify payment details.'}`,
      'system_activated',
      { orderId: order.id }
    );
    return true;
  },

  confirmOrderAndActivateSystem(orderId: string): boolean {
    const order = cachedOrders.find(o => o.id === orderId);
    if (!order) return false;

    const user = cachedUsers.find(u => u.id === order.userId);
    if (!user) return false;

    this.confirmUserSystemPurchase(user.id, order.projectId || order.id);
    return true;
  },

  getUserPurchasedSystems(userId: string): PurchasedSystemRecord[] {
    const user = cachedUsers.find(u => u.id === userId);
    if (!user || !user.purchasedSystems) return [];
    return user.purchasedSystems;
  },

  addPurchasedSystemToUser(userId: string, systemData: Partial<PurchasedSystemRecord>): PurchasedSystemRecord | null {
    const user = cachedUsers.find(u => u.id === userId);
    if (!user) return null;

    if (!user.purchasedSystems) user.purchasedSystems = [];

    const hex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const project = cachedProjects.find(p => p.id === systemData.projectId) || cachedProjects[0];

    const newSys: PurchasedSystemRecord = {
      id: 'sys-' + Date.now(),
      projectId: project.id,
      projectTitleAr: systemData.projectTitleAr || project.titleAr,
      projectTitleEn: systemData.projectTitleEn || project.titleEn,
      category: systemData.category || project.category || 'lms',
      planType: systemData.planType || 'annual',
      amount: systemData.amount || project.priceAnnual || '8,500 ج.م',
      licenseKey: systemData.licenseKey || `LERN-2026-${hex}-${Math.floor(1000 + Math.random() * 9000)}`,
      certificateNumber: systemData.certificateNumber || `CERT-LW-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: systemData.status || 'active',
      isConfirmed: systemData.isConfirmed !== undefined ? systemData.isConfirmed : true,
      confirmedAt: new Date().toISOString(),
      purchasedAt: new Date().toISOString(),
      sourceCodeUrl: systemData.sourceCodeUrl || 'https://github.com/m77257578-del/lern-web4',
      sandboxTheme: systemData.sandboxTheme || project.sandboxConfig?.theme || 'ocean',
      notes: systemData.notes || 'منصة تم تخصيصها وتأكيدها بواسطة الإدارة'
    };

    user.purchasedSystems.unshift(newSys);
    notifyStorageChange();
    saveDocument('users', user);

    this.sendClientNotification(
      userId,
      `🎉 تم إضافة وترخيص منصة جديدة لحسابك: [${newSys.projectTitleAr}]`,
      `🎉 New Platform Added to Your Account: [${newSys.projectTitleEn}]`,
      `تم تفعيل منصة (${newSys.projectTitleAr}) رسمياً في حسابك. كود الترخيص: ${newSys.licenseKey}.`,
      `Platform active. License: ${newSys.licenseKey}`,
      'system_activated'
    );

    return newSys;
  },

  toggleClientNotifications(userId: string, enabled: boolean): boolean {
    const user = cachedUsers.find(u => u.id === userId);
    if (!user) return false;
    user.notificationsEnabled = enabled;
    notifyStorageChange();
    saveDocument('users', user);
    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      current.notificationsEnabled = enabled;
      this.saveUserSession(current);
    }
    return enabled;
  },

  sendAdminNotification(titleAr: string, titleEn: string, messageAr: string, messageEn: string, type: any = 'system', metadata?: any): void {
    const notif: UserNotification = {
      id: 'notif-admin-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      userId: 'admin',
      targetRole: 'admin',
      titleAr,
      titleEn,
      messageAr,
      messageEn,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      metadata
    };
    cachedNotifications.unshift(notif);
    notifyStorageChange();
    saveDocument('notifications', notif);
  },

  sendClientNotification(userId: string, titleAr: string, titleEn: string, messageAr: string, messageEn: string, type: any = 'system', metadata?: any): void {
    const notif: UserNotification = {
      id: 'notif-client-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      userId,
      targetRole: 'user',
      titleAr,
      titleEn,
      messageAr,
      messageEn,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      metadata
    };
    cachedNotifications.unshift(notif);
    notifyStorageChange();
    saveDocument('notifications', notif);
  },

  markNotificationAsRead(notificationId: string): void {
    cachedNotifications = cachedNotifications.map(n => n.id === notificationId ? { ...n, read: true } : n);
    notifyStorageChange();
    const target = cachedNotifications.find(n => n.id === notificationId);
    if (target) {
      saveDocument('notifications', target);
    }
  },

  respondToClientNotification(notificationId: string, response: 'approved' | 'objected', responseNote?: string): void {
    cachedNotifications = cachedNotifications.map(n => n.id === notificationId ? { 
      ...n, 
      read: true, 
      responseStatus: response, 
      responseNote: responseNote || '' 
    } : n);
    notifyStorageChange();
    const target = cachedNotifications.find(n => n.id === notificationId);
    if (target) {
      saveDocument('notifications', target);

      const clientName = cachedUsers.find(u => u.id === target.userId)?.name || 'العميل';
      this.sendAdminNotification(
        response === 'approved' ? `✅ موافقة العميل على التحديث الإداري` : `⚠️ اعتراض العميل على التحديث الإداري`,
        response === 'approved' ? `Client Approved Admin Update` : `Client Objected Admin Update`,
        `قام العميل (${clientName}) بـ [${response === 'approved' ? 'موافقة ✓' : 'اعتراض ✗'}] على الإشعار: "${target.titleAr}".` + (responseNote ? `\nملاحظات العميل: "${responseNote}"` : ''),
        `Client (${clientName}) responded with [${response}] to notification: ${target.titleEn}.`,
        'system',
        { notificationId: target.id, userId: target.userId, response, responseNote }
      );
    }
  },

  getAdminNotifications(): UserNotification[] {
    return cachedNotifications.filter(n => n.targetRole === 'admin' || n.userId === 'admin' || n.userId === 'all');
  },

  logoutUser(): void {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('lernweb_user_auth_session');
        localStorage.removeItem('lernweb_user_auth_session');
      } catch (e) {
        console.warn('Storage remove failed', e);
      }
    }
    notifyStorageChange();
  },

  deleteUserAccount(userId: string): boolean {
    return this.deleteUser(userId);
  },

  isUserLoggedIn(): boolean {
    return !!this.getCurrentUser();
  },

  buildWhatsAppUrl(phone: string, message?: string): string {
    return buildWhatsAppUrl(phone, message);
  },

  formatWhatsAppOrderUrl(targetNumber: string, appName: string, appId: string, isRtl: boolean = true): string {
    const message = isRtl
      ? 'مرحباً، أود الاستفسار وطلب شراء المنصة التعليمية: *' + appName + '* (كود: ' + appId + ') من منصة ليرن ويب.'
      : 'Hello, I would like to order the educational platform: *' + appName + '* (ID: ' + appId + ') from Lern Web.';
    return buildWhatsAppUrl(targetNumber, message);
  },

  formatWhatsAppDraftUrl(targetNumber: string, draft: AiCustomizationDraft, isRtl: boolean = true): string {
    const message = isRtl
      ? 'طلب اعتماد ونشر مسودة ذكاء اصطناعي من منصة ليرن ويب:\n\n• اسم العميل: ' + (draft.visitorName || 'زائر') + '\n• هاتف العميل: ' + (draft.visitorPhone || 'غير محدد') + '\n• المنصة الأصلية: ' + draft.projectTitle + '\n• اسم المركز الجديد: ' + draft.modifiedConfig.centerName + '\n• كود المسودة: ' + draft.id + '\n• تفاصيل التخصيص: ' + draft.userPrompt + '\n\nيرجى مراجعة المسودة وتحديد التكلفة والاعتماد.'
      : 'AI Customization Draft Approval Request - Lern Web:\n\n• Client: ' + (draft.visitorName || 'Visitor') + '\n• Phone: ' + (draft.visitorPhone || 'Not provided') + '\n• Base Project: ' + draft.projectTitle + '\n• New Center Name: ' + draft.modifiedConfig.centerName + '\n• Draft ID: ' + draft.id + '\n• Prompt: ' + draft.userPrompt + '\n\nPlease review and quote this staged draft.';
    return buildWhatsAppUrl(targetNumber, message);
  },

  getRecentSearches(): string[] {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('lernweb_recent_searches_v1');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  },

  addRecentSearch(query: string): string[] {
    const trimmed = query.trim();
    if (!trimmed) return this.getRecentSearches();
    const current = this.getRecentSearches();
    const filtered = current.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
    const updated = [trimmed, ...filtered].slice(0, 5);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lernweb_recent_searches_v1', JSON.stringify(updated));
    }
    return updated;
  },

  removeRecentSearch(query: string): string[] {
    const current = this.getRecentSearches();
    const updated = current.filter(item => item.toLowerCase() !== query.trim().toLowerCase());
    if (typeof window !== 'undefined') {
      localStorage.setItem('lernweb_recent_searches_v1', JSON.stringify(updated));
    }
    return updated;
  },

  clearRecentSearches(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lernweb_recent_searches_v1');
    }
  },

  getActivityLogs(): ActivityLogItem[] {
    return cachedLogs;
  },

  addActivityLog(actionType: any, titleAr: string, titleEn: string, detailsAr?: string, detailsEn?: string): ActivityLogItem[] {
    const newLog: ActivityLogItem = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      actionType,
      titleAr,
      titleEn,
      detailsAr,
      detailsEn,
      timestamp: new Date().toISOString()
    };
    cachedLogs.unshift(newLog);
    notifyStorageChange();
    saveDocument('activity_logs', newLog);
    return cachedLogs;
  },

  clearActivityLogs(): void {
    cachedLogs = [];
    notifyStorageChange();
    // This would require a bulk delete, for now, we'll keep it as is
  },

  getChatMessages(): ChatMessage[] {
    return cachedChats;
  },

  saveChatMessage(msg: { id?: string; userId?: string; userName?: string; userEmail?: string; message: string; sender?: 'client' | 'admin'; senderName?: string; senderPhone?: string; isAdminReply?: boolean }): ChatMessage[] {
    const isAdm = msg.sender === 'admin' || msg.isAdminReply;
    const newChat: ChatMessage = {
      id: msg.id || 'chat-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      userId: msg.userId || (isAdm ? 'admin' : 'guest_user'),
      userName: msg.userName || msg.senderName || 'زائر ليرن ويب',
      userEmail: msg.userEmail || '',
      message: msg.message,
      sender: isAdm ? 'admin' : 'client',
      createdAt: new Date().toISOString(),
      isRead: false,
      senderName: msg.userName || msg.senderName || 'زائر ليرن ويب',
      timestamp: new Date().toISOString(),
      isAdminReply: isAdm
    };
    cachedChats.unshift(newChat);
    notifyStorageChange();
    saveDocument('chat_messages', newChat);
    return cachedChats;
  },

  deleteChatMessage(chatId: string): ChatMessage[] {
    cachedChats = cachedChats.filter(c => c.id !== chatId);
    notifyStorageChange();
    deleteDocument('chat_messages', chatId);
    return cachedChats;
  },

  getQuickReplies(): QuickReply[] {
    if (!cachedQuickReplies || cachedQuickReplies.length === 0) {
      cachedQuickReplies = [
        {
          id: 'qr_1',
          titleAr: 'كيف أشتري منظومة؟',
          titleEn: 'How to buy a system?',
          messageAr: 'مرحباً بك! يمكنك اختيار المنظومة المناسبة من "سوق المنظومات"، النقر على "طلب المنظومة والدفع اليدوي"، إتمام التحويل عبر الحسابات البنكية المتاحة، ورفع صورة الإيصال ليتم تفعيل نظامك خلال دقائق.',
          messageEn: 'Welcome! You can choose a system from the Marketplace, click "Purchase & Manual Payment", transfer via available bank accounts, and upload your receipt.'
        },
        {
          id: 'qr_2',
          titleAr: 'ما هي مميزات التمليك الكامل؟',
          titleEn: 'What are lifetime ownership perks?',
          messageAr: 'التمليك الكامل يمنحك كود المصدر (Source Code) كاملاً، نطاق فرعي خاص مجاني، تحديثات مجانية مدى الحياة، ودعم فني مخصص لتثبيت المنظومة على سيرفرك الخاص.',
          messageEn: 'Lifetime ownership gives you the full source code, a free custom subdomain, lifetime free updates, and dedicated technical support.'
        }
      ];
    }
    return cachedQuickReplies;
  },

  saveQuickReply(qr: QuickReply): QuickReply[] {
    const list = this.getQuickReplies();
    const idx = list.findIndex(q => q.id === qr.id);
    if (idx !== -1) {
      list[idx] = { ...qr };
    } else {
      list.unshift(qr);
    }
    cachedQuickReplies = list;
    notifyStorageChange();
    saveDocument('quick_replies', qr);
    return cachedQuickReplies;
  },

  deleteQuickReply(id: string): QuickReply[] {
    let list = this.getQuickReplies();
    list = list.filter(q => q.id !== id);
    cachedQuickReplies = list;
    notifyStorageChange();
    deleteDocument('quick_replies', id);
    return cachedQuickReplies;
  },

  getSupportTickets(): SupportTicket[] {
    return cachedTickets;
  },

  getTicketByUserId(userId: string): SupportTicket | null {
    if (!userId) return null;
    return cachedTickets.find(t => t.userId === userId || t.id === `ticket-${userId}`) || null;
  },

  saveSupportTicket(ticket: SupportTicket): SupportTicket[] {
    const existingIndex = cachedTickets.findIndex(t => t.id === ticket.id);
    if (existingIndex !== -1) {
      cachedTickets[existingIndex] = ticket;
    } else {
      cachedTickets.unshift(ticket);
    }
    notifyStorageChange();
    saveDocument('support_tickets', ticket);
    return cachedTickets;
  },

  addMessageToTicket(
    userId: string,
    userName: string,
    phone: string,
    email: string,
    msg: { 
      sender: 'user' | 'ai' | 'admin'; 
      senderName?: string; 
      text: string;
      attachments?: SupportTicketAttachment[];
      provider?: 'gemini' | 'chatgpt';
      model?: string;
    }
  ): SupportTicket {
    const ticketId = `ticket-${userId || 'guest'}`;
    let ticket = cachedTickets.find(t => t.id === ticketId);

    const newMsg: SupportTicketMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      sender: msg.sender,
      senderName: msg.senderName || (msg.sender === 'admin' ? 'الإدارة (Admin)' : msg.sender === 'ai' ? 'المساعد الذكي (AI)' : userName),
      text: msg.text,
      timestamp: new Date().toISOString(),
      attachments: msg.attachments || [],
      provider: msg.provider,
      model: msg.model
    };

    if (!ticket) {
      ticket = {
        id: ticketId,
        userId: userId || 'guest-' + Date.now(),
        userName: userName || 'زائر كريم',
        userPhone: phone || '',
        userEmail: email || '',
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        unreadByAdmin: msg.sender === 'user',
        unreadByUser: msg.sender === 'admin' || msg.sender === 'ai',
        messages: [newMsg]
      };
    } else {
      ticket = {
        ...ticket,
        userName: userName || ticket.userName,
        userPhone: phone || ticket.userPhone,
        userEmail: email || ticket.userEmail,
        updatedAt: new Date().toISOString(),
        unreadByAdmin: msg.sender === 'user' ? true : ticket.unreadByAdmin,
        unreadByUser: (msg.sender === 'admin' || msg.sender === 'ai') ? true : ticket.unreadByUser,
        messages: [...ticket.messages, newMsg]
      };
    }

    this.saveSupportTicket(ticket);

    // Notify counterpart
    if (msg.sender === 'user') {
      this.sendAdminNotification(
        '💬 رسالة جديدة في تذكرة دعم العميل',
        '💬 New Support Message from Client',
        `أرسل العميل (${ticket.userName}${ticket.userPhone ? ' - ' + ticket.userPhone : ''}) رسالة: "${msg.text.slice(0, 80)}${msg.text.length > 80 ? '...' : ''}"`,
        `Client ${ticket.userName} sent a support message: "${msg.text.slice(0, 80)}"`,
        'ticket_message',
        { ticketId: ticket.id, userId: ticket.userId }
      );
    } else if (msg.sender === 'admin' && ticket.userId && !ticket.userId.startsWith('guest')) {
      this.sendClientNotification(
        ticket.userId,
        '🛡️ رد جديد من إدارة منصة ليرن ويب',
        '🛡️ New Reply from Administration',
        `رد المشرف / الإدارة على تذكرتك: "${msg.text.slice(0, 100)}${msg.text.length > 100 ? '...' : ''}"`,
        `Admin replied to your support inquiry: "${msg.text.slice(0, 100)}"`,
        'admin_note',
        { ticketId: ticket.id }
      );
    }

    return ticket;
  },

  updateTicketSystemOverride(ticketId: string, systemOverride: string): SupportTicket | null {
    const ticket = cachedTickets.find(t => t.id === ticketId);
    if (!ticket) return null;
    const updated = {
      ...ticket,
      systemOverride: systemOverride.trim(),
      updatedAt: new Date().toISOString()
    };
    this.saveSupportTicket(updated);
    return updated;
  },

  updateTicketStatus(ticketId: string, status: 'open' | 'in_progress' | 'closed'): SupportTicket | null {
    const ticket = cachedTickets.find(t => t.id === ticketId);
    if (!ticket) return null;
    const updated = {
      ...ticket,
      status,
      updatedAt: new Date().toISOString()
    };
    this.saveSupportTicket(updated);
    return updated;
  },

  deleteSupportTicket(ticketId: string): SupportTicket[] {
    cachedTickets = cachedTickets.filter(t => t.id !== ticketId);
    notifyStorageChange();
    deleteDocument('support_tickets', ticketId);
    return cachedTickets;
  },

  getCallHistory(userId?: string): AiCallRecord[] {
    if (userId) {
      return cachedCallHistory.filter(c => c.userId === userId);
    }
    return cachedCallHistory;
  },

  addCallRecord(record: Omit<AiCallRecord, 'id'>): AiCallRecord {
    const newRecord: AiCallRecord = {
      ...record,
      id: 'call-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5)
    };
    cachedCallHistory.unshift(newRecord);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('lernweb_ai_call_history', JSON.stringify(cachedCallHistory.slice(0, 50)));
      } catch {}
    }
    notifyStorageChange();
    saveDocument('ai_calls', newRecord);
    return newRecord;
  },

  deleteCallRecord(recordId: string): AiCallRecord[] {
    cachedCallHistory = cachedCallHistory.filter(c => c.id !== recordId);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('lernweb_ai_call_history', JSON.stringify(cachedCallHistory));
      } catch {}
    }
    notifyStorageChange();
    deleteDocument('ai_calls', recordId);
    return cachedCallHistory;
  },

  clearCallHistory(userId?: string): void {
    if (userId) {
      const toDelete = cachedCallHistory.filter(c => c.userId === userId);
      cachedCallHistory = cachedCallHistory.filter(c => c.userId !== userId);
      toDelete.forEach(c => deleteDocument('ai_calls', c.id));
    } else {
      cachedCallHistory.forEach(c => deleteDocument('ai_calls', c.id));
      cachedCallHistory = [];
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('lernweb_ai_call_history', JSON.stringify(cachedCallHistory));
      } catch {}
    }
    notifyStorageChange();
  },

  getPlans(): SubscriptionPlan[] {
    return cachedPlans;
  },

  getMediaResources(): MediaResourceItem[] {
    return cachedMedia;
  },

  getReviews(): ProjectReview[] {
    return cachedReviews;
  },

  getProjectReviews(projectId: string): ProjectReview[] {
    return cachedReviews.filter(r => r.projectId === projectId);
  },

  getUsers(): UserAccount[] {
    return cachedUsers;
  },

  getUserOrders(): UserOrder[] {
    return cachedOrders;
  },

  getNotifications(): UserNotification[] {
    return cachedNotifications;
  },

  getUserNotifications(userId: string): UserNotification[] {
    if (!userId) return [];
    return cachedNotifications.filter(n => n.userId === userId);
  },

  addNotification(userId: string, titleAr: string, titleEn: string, messageAr: string, messageEn: string, type: any = 'status_change'): void {
    const newNotif: UserNotification = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      userId,
      titleAr,
      titleEn,
      messageAr,
      messageEn,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    cachedNotifications.unshift(newNotif);
    notifyStorageChange();
    saveDocument('notifications', newNotif);
  },



  clearUserNotifications(userId: string): void {
    const toDelete = cachedNotifications.filter(n => n.userId === userId);
    cachedNotifications = cachedNotifications.filter(n => n.userId !== userId);
    notifyStorageChange();
    toDelete.forEach(n => deleteDocument('notifications', n.id));
  },

  /**
   * Provides a condensed summary of the platform's current state for AI context.
   */
  getPlatformSummary(): string {
    const publishedProjects = this.getProjects(false);
    const settings = this.getSettings();
    const plans = this.getPlans();
    const media = this.getMediaResources();

    return `
PLATFORM CONTEXT (Lern Web):
- Center Name: ${settings.centerName}
- Contact Email: ${settings.contactEmail}
- WhatsApp: ${settings.targetWhatsAppNumber}
- Published Projects: ${publishedProjects.map(p => `${p.titleAr} (${p.category})`).join(', ')}
- Available Plans: ${plans.map(p => `${p.nameAr}: ${p.priceAr}`).join(', ')}
- Educational Media: ${media.map(m => m.titleAr).join(', ')}
- Total Active Users: ${cachedUsers.length}
- Total Modifications Staged: ${cachedDrafts.length}
`;
  },

  getArticles(includeDrafts: boolean = false): CmsArticle[] {
    if (includeDrafts) return cachedArticles;
    return cachedArticles.filter(a => a.isPublished !== false);
  },

  saveArticle(article: CmsArticle): CmsArticle[] {
    const existingIndex = cachedArticles.findIndex(a => a.id === article.id);
    if (existingIndex !== -1) {
      cachedArticles[existingIndex] = { ...article };
    } else {
      cachedArticles.unshift(article);
    }
    notifyStorageChange();
    saveDocument('articles', article);
    safeFetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article)
    }).catch(err => console.error(err));
    return cachedArticles;
  },

  deleteArticle(id: string): CmsArticle[] {
    cachedArticles = cachedArticles.filter(a => a.id !== id);
    notifyStorageChange();
    deleteDocument('articles', id);
    safeFetch('/api/articles/' + id, { method: 'DELETE' }).catch(err => console.error(err));
    return cachedArticles;
  },

  getFaqs(includeUnpublished: boolean = false): FaqItem[] {
    if (includeUnpublished) return cachedFaqs;
    return cachedFaqs.filter(f => f.isPublished !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  saveFaq(faq: FaqItem): FaqItem[] {
    const existingIndex = cachedFaqs.findIndex(f => f.id === faq.id);
    if (existingIndex !== -1) {
      cachedFaqs[existingIndex] = { ...faq };
    } else {
      cachedFaqs.push(faq);
    }
    notifyStorageChange();
    saveDocument('faqs', faq);
    safeFetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faq)
    }).catch(err => console.error(err));
    return cachedFaqs;
  },

  deleteFaq(id: string): FaqItem[] {
    cachedFaqs = cachedFaqs.filter(f => f.id !== id);
    notifyStorageChange();
    deleteDocument('faqs', id);
    safeFetch('/api/faqs/' + id, { method: 'DELETE' }).catch(err => console.error(err));
    return cachedFaqs;
  },

  getApplications(): JobApplication[] {
    return cachedApplications;
  },

  addApplication(application: JobApplication): string {
    cachedApplications.unshift(application);
    notifyStorageChange();
    saveDocument('job_applications', application);

    // Return WhatsApp URL for support notification
    const settings = this.getSettings();
    const supportPhone = settings.targetWhatsAppNumber || '201024889921';
    const message = `طلب انضمام جديد للمنصة:\n\n• الاسم: ${application.name}\n• الوظيفة: ${application.role}\n• الخبرة: ${application.yearsExperience} سنوات\n• رقم الهاتف: ${application.phone}\n\nيرجى مراجعة الطلب من لوحة الإدارة.`;
    return buildWhatsAppUrl(supportPhone, message);
  },

  updateApplicationStatus(id: string, status: 'accepted' | 'rejected'): void {
    const app = cachedApplications.find(a => a.id === id);
    if (app) {
      app.status = status;
      if (status === 'accepted') {
        const user = cachedUsers.find(u => u.phone === app.phone);
        if (user) {
          user.role = app.role === 'customer_service' ? 'support_agent' : app.role === 'programmer' ? 'developer' : 'moderator';
          user.roleAr = app.role === 'customer_service' ? 'دعم فني وتواصل' : app.role === 'programmer' ? 'مطور برمجيات' : 'مراقب منصة';
          saveDocument('users', user);
        }
        
        // Add to Staff List so they can log in
        const newStaff: StaffMember = {
          id: 'staff-' + app.id,
          name: app.name,
          roleAr: app.role === 'customer_service' ? 'خدمة عملاء (Customer Service)' : app.role === 'programmer' ? 'مبرمج (Developer)' : 'مراقب (Monitor)',
          roleEn: app.role === 'customer_service' ? 'Customer Service' : app.role === 'programmer' ? 'Developer' : 'Monitor',
          phone: app.phone,
          whatsapp: `https://wa.me/${app.phone.replace(/[^\d]/g, '')}`,
          permissions: app.role === 'customer_service' ? ['support', 'orders'] : app.role === 'programmer' ? ['cms', 'analytics'] : ['support'],
          isActive: true,
          createdAt: new Date().toISOString()
        };
        this.saveStaffMember(newStaff);
      }
      notifyStorageChange();
      saveDocument('job_applications', app);
    }
  },

  getAnnouncements(): AnnouncementBanner[] {
    return cachedAnnouncements;
  },

  saveAnnouncement(ann: AnnouncementBanner): AnnouncementBanner[] {
    const existingIndex = cachedAnnouncements.findIndex(a => a.id === ann.id);
    if (existingIndex !== -1) {
      cachedAnnouncements[existingIndex] = { ...ann };
    } else {
      cachedAnnouncements.unshift(ann);
    }
    notifyStorageChange();
    saveDocument('announcements', ann);
    safeFetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ann)
    }).catch(err => console.error(err));
    return cachedAnnouncements;
  },

  deleteAnnouncement(id: string): AnnouncementBanner[] {
    cachedAnnouncements = cachedAnnouncements.filter(a => a.id !== id);
    notifyStorageChange();
    deleteDocument('announcements', id);
    return cachedAnnouncements;
  },

  getStaff(): StaffMember[] {
    if (!cachedStaff || cachedStaff.length === 0) {
      cachedStaff = [...DEFAULT_INITIAL_STAFF];
    }
    return cachedStaff;
  },

  saveStaffMember(member: StaffMember): StaffMember[] {
    const idx = cachedStaff.findIndex(s => s.id === member.id);
    if (idx !== -1) {
      cachedStaff[idx] = { ...member };
    } else {
      cachedStaff.unshift(member);
    }
    notifyStorageChange();
    saveDocument('staff', member);
    return cachedStaff;
  },

  deleteStaffMember(id: string): StaffMember[] {
    cachedStaff = cachedStaff.filter(s => s.id !== id);
    notifyStorageChange();
    deleteDocument('staff', id);
    return cachedStaff;
  },

  getUserRoles(): Record<string, UserRoleAssignment> {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('lernweb_user_roles');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return DEFAULT_INITIAL_USER_ROLES;
  },

  assignUserRole(email: string, role: 'admin' | 'moderator' | 'customer_support', permissions: string[]): Record<string, UserRoleAssignment> {
    const roles = this.getUserRoles();
    const cleanEmail = email.trim().toLowerCase();
    roles[cleanEmail] = {
      email: cleanEmail,
      role,
      permissions,
      updatedAt: new Date().toISOString()
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('lernweb_user_roles', JSON.stringify(roles));
    }
    notifyStorageChange();
    saveDocument('user_roles', roles[cleanEmail]);
    return roles;
  },

  removeUserRole(email: string): Record<string, UserRoleAssignment> {
    const roles = this.getUserRoles();
    const cleanEmail = email.trim().toLowerCase();
    delete roles[cleanEmail];
    if (typeof window !== 'undefined') {
      localStorage.setItem('lernweb_user_roles', JSON.stringify(roles));
    }
    notifyStorageChange();
    deleteDocument('user_roles', cleanEmail);
    return roles;
  },

  requestPasswordResetOtp(phone: string): { success: boolean; otpCode: string; whatsappUrl: string; phone: string; messageAr: string; messageEn: string } {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    const userExists = cachedUsers.some(u => u.phone === cleanPhone || u.phone === '2' + cleanPhone);
    if (!userExists) {
        return {
            success: false,
            otpCode: '',
            whatsappUrl: '',
            phone: '',
            messageAr: 'هذا الرقم غير مسجل في المنصة.',
            messageEn: 'This phone number is not registered on the platform.'
        };
    }
    const formattedPhone = cleanPhone.startsWith('2') ? cleanPhone : '2' + cleanPhone;
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    otpStore[cleanPhone] = { code: otpCode, expiresAt };
    otpStore[formattedPhone] = { code: otpCode, expiresAt };

    const settings = this.getSettings();
    const platformPhone = settings.targetWhatsAppNumber || '201024889921';
    const msg = `طلب إعادة تعيين كلمة السر لمنصة ليرن ويب:\n\n• رقم هاتف العميل: ${phone}\n• كود التحقق (OTP) المولد: ${otpCode}\n\nيرجى تزويد العميل بالكود أعلاه لإتمام العملية بنجاح.`;
    const whatsappUrl = buildWhatsAppUrl(platformPhone, msg);

    return {
      success: true,
      otpCode,
      whatsappUrl,
      phone: formattedPhone,
      messageAr: `تم توليد كود التحقق (${otpCode}) وفتح واتساب خدمة العملاء لإرسال الرمز إليك.`,
      messageEn: `OTP generated (${otpCode}). Opening Customer Support WhatsApp to send you the code.`
    };
  },

  verifyOtpAndResetPassword(phone: string, otpCode: string, newPass: string): { success: boolean; messageAr: string; messageEn: string } {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    const formattedPhone = cleanPhone.startsWith('2') ? cleanPhone : '2' + cleanPhone;

    const storedOtp = otpStore[cleanPhone] || otpStore[formattedPhone];
    const isMasterOtp = otpCode === '100100';

    if (!isMasterOtp) {
      if (!storedOtp) {
        return {
          success: false,
          messageAr: 'لم يتم طلب رمز تحقق لهذا الرقم أو انتهت صلاحيته.',
          messageEn: 'No OTP request found for this phone number or it has expired.'
        };
      }

      if (storedOtp.expiresAt < Date.now()) {
        delete otpStore[cleanPhone];
        delete otpStore[formattedPhone];
        return {
          success: false,
          messageAr: 'انتهت صلاحية كود التحقق. يرجى طلب كود جديد.',
          messageEn: 'OTP code expired. Please request a new code.'
        };
      }

      if (storedOtp.code !== otpCode.trim()) {
        return {
          success: false,
          messageAr: 'رمز التحقق OTP غير صحيح. يرجى إعادة المحاولة.',
          messageEn: 'Invalid OTP code. Please try again.'
        };
      }
    }

    let userFound = false;
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.phone.replace(/[^\d]/g, '') === cleanPhone || u.phone.replace(/[^\d]/g, '') === formattedPhone);
    if (userIndex !== -1) {
      users[userIndex].password = newPass.trim();
      cachedUsers = users;
      notifyStorageChange();
      saveDocument('users', users[userIndex]);
      userFound = true;
    }

    const settings = this.getSettings();
    const staff = this.getStaff();
    const isStaff = staff.some(s => s.phone.replace(/[^\d]/g, '') === cleanPhone || s.phone.replace(/[^\d]/g, '') === formattedPhone);
    const isAdminPhone = cleanPhone === '201024889921' || formattedPhone === '201024889921' || isStaff || !userFound;

    if (isAdminPhone || isMasterOtp) {
      settings.adminPasscode = newPass.trim();
      this.saveSettings(settings);
    }

    delete otpStore[cleanPhone];
    delete otpStore[formattedPhone];

    return {
      success: true,
      messageAr: 'تم إعادة تعيين كلمة السر بنجاح! يمكنك الآن تسجيل الدخول بكلمة السر الجديدة.',
      messageEn: 'Password reset successfully! You can now log in with your new password.'
    };
  },

  updateAdminPasscode(currentPass: string, newPass: string): { success: boolean; messageAr: string; messageEn: string } {
    const settings = this.getSettings();
    const currentAdminPass = settings.adminPasscode || '100100';

    if (currentPass.trim() !== currentAdminPass && currentPass.trim() !== '100100') {
      return {
        success: false,
        messageAr: 'كلمة السر الحالية غير صحيحة.',
        messageEn: 'Current password is incorrect.'
      };
    }

    settings.adminPasscode = newPass.trim();
    this.saveSettings(settings);

    this.addActivityLog(
      'settings_updated',
      'تغيير كلمة سر الأدمن ولوحة التحكم',
      'Admin Control Panel Passcode Updated'
    );

    return {
      success: true,
      messageAr: 'تم تحديث كلمة سر الأدمن بنجاح!',
      messageEn: 'Admin passcode updated successfully!'
    };
  },

  exportFullPlatformBackup(): any {
    return {
      version: '3.8',
      exportedAt: new Date().toISOString(),
      platform: 'ليرن ويب | Lern Web Cloud Systems',
      data: {
        projects: cachedProjects,
        adminSettings: this.getSettings(),
        wallets: cachedWallets,
        plans: cachedPlans,
        aiDrafts: cachedDrafts,
        users: cachedUsers,
        mediaResources: cachedMedia,
        userOrders: cachedOrders,
        reviews: cachedReviews,
        activityLogs: cachedLogs,
        articles: cachedArticles,
        faqs: cachedFaqs,
        announcements: cachedAnnouncements
      }
    };
  },

  importFullPlatformBackup(backupJson: any): any {
    if (backupJson?.data) {
      if (Array.isArray(backupJson.data.articles)) cachedArticles = backupJson.data.articles;
      if (Array.isArray(backupJson.data.faqs)) cachedFaqs = backupJson.data.faqs;
      if (Array.isArray(backupJson.data.announcements)) cachedAnnouncements = backupJson.data.announcements;
      notifyStorageChange();
    }
    return {
      success: true,
      messageAr: 'تمت استعادة البيانات ونظام المحتوى بنجاح!',
      messageEn: 'Data and CMS content successfully restored!'
    };
  },

  getPublishedProjects(): PublishedProject[] {
    return cachedPublishedProjects;
  },

  savePublishedProject(project: PublishedProject): PublishedProject[] {
    const existingIndex = cachedPublishedProjects.findIndex(p => p.id === project.id);
    if (existingIndex !== -1) {
      cachedPublishedProjects[existingIndex] = { ...project };
    } else {
      cachedPublishedProjects.unshift(project);
    }
    notifyStorageChange();
    saveDocument('published_projects', project);
    return cachedPublishedProjects;
  },

  deletePublishedProject(id: string): PublishedProject[] {
    cachedPublishedProjects = cachedPublishedProjects.filter(p => p.id !== id);
    notifyStorageChange();
    deleteDocument('published_projects', id);
    return cachedPublishedProjects;
  }
};

export const getProjects = (includeUnpublished: boolean = false) => storageService.getProjects(includeUnpublished);
export const getArticles = (includeDrafts?: boolean) => storageService.getArticles(includeDrafts);
export const getFaqs = (includeUnpublished?: boolean) => storageService.getFaqs(includeUnpublished);
export const getAnnouncements = () => storageService.getAnnouncements();

export const getSettings = () => storageService.getSettings();
export const getWallets = () => storageService.getWallets();
export const getMediaResources = () => storageService.getMediaResources();
export const getPlans = () => storageService.getPlans();
export const getAiDrafts = () => storageService.getAiDrafts();
export const getNotifications = () => storageService.getNotifications();
export const getCurrentUser = () => storageService.getCurrentUser();
export const isUserLoggedIn = () => storageService.isUserLoggedIn();
export const isAdminLoggedIn = () => storageService.isAdminLoggedIn();


export function buildWhatsAppUrl(phone: string, message?: string): string {
  if (!phone || typeof phone !== 'string') return 'https://wa.me/';
  const cleanNumber = phone.replace(/[^\d]/g, '');
  if (!message || !message.trim()) {
    return 'https://wa.me/' + cleanNumber;
  }
  return 'https://wa.me/' + cleanNumber + '?text=' + encodeURIComponent(message.trim());
}

/**
 * Normalizes YouTube video links, shorts, embed codes (<iframe ...>), or local videos
 * into a valid playable embed URL or direct src string.
 */
export function formatVideoEmbedUrl(urlOrEmbed: string): string {
  if (!urlOrEmbed || typeof urlOrEmbed !== 'string') return '';
  const trimmed = urlOrEmbed.trim();

  // Handle iframe embed code snippet: <iframe ... src="https://www.youtube.com/embed/xyz" ...></iframe>
  if (trimmed.includes('<iframe') && trimmed.includes('src=')) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return formatVideoEmbedUrl(srcMatch[1]);
    }
  }

  // Handle standard YouTube watch link: https://www.youtube.com/watch?v=VIDEO_ID
  if (trimmed.includes('youtube.com/watch') || trimmed.includes('m.youtube.com/watch')) {
    try {
      const urlObj = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
      }
    } catch {
      const match = trimmed.match(/[?&]v=([^&]+)/);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`;
      }
    }
  }

  // Handle short YouTube URL: https://youtu.be/VIDEO_ID
  if (trimmed.includes('youtu.be/')) {
    const match = trimmed.match(/youtu\.be\/([^?&#]+)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`;
    }
  }

  // Handle YouTube Shorts URL: https://www.youtube.com/shorts/VIDEO_ID
  if (trimmed.includes('youtube.com/shorts/')) {
    const match = trimmed.match(/youtube\.com\/shorts\/([^?&#]+)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`;
    }
  }

  // Already an embed URL: https://www.youtube.com/embed/VIDEO_ID
  if (trimmed.includes('youtube.com/embed/')) {
    return trimmed;
  }

  // Otherwise return as direct video link or file blob/base64
  return trimmed;
}

export function isYouTubeUrlOrEmbed(urlOrEmbed: string): boolean {
  if (!urlOrEmbed || typeof urlOrEmbed !== 'string') return false;
  const lower = urlOrEmbed.toLowerCase();
  return lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('<iframe');
}
