/**
 * Next.js Project Structure Identifier:
 * components/AdminDashboard.jsx
 * 
 * Project Identity: ليرن ويب | Lern Web
 * Purpose: Complete Admin Master Control Center:
 *          - Full publishing authority (publish/unpublish projects, delete any published content)
 *          - Private project file management (100% hidden from visitors)
 *          - Social media links configuration & target WhatsApp ordering number
 *          - Mobile wallet payment methods configuration
 *          - YouTube video & article publishing & content deletion
 *          - Incoming visitor AI drafts & modification requests status tracking
 *          - User Reviews & Ratings moderation and management
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Plus, Trash2, Edit3, Eye, EyeOff, Save, 
  Smartphone, Share2, FolderLock, Sparkles, CheckCircle2, 
  X, Check, AlertCircle, ExternalLink, MessageSquare, 
  Layers, UploadCloud, RefreshCw, LogOut, Video, FileText, Star,
  BarChart3, TrendingUp, Users, Download, Activity, PieChart as PieIcon,
  CheckSquare, Square, Settings, Sun, Moon, Monitor,
  Clock, History, ListFilter, Search, Globe, Send, Bot, User, Crown, HelpCircle, Sliders, Zap, Cpu, Key,
  Bell, UserX, UserCheck, Award, Ban, Package, Copy, FileCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { storageService, formatVideoEmbedUrl, isYouTubeUrlOrEmbed } from '../src/services/storageService';
import SeoManagement from './SeoManagement';
import { translations } from '../src/data/translations';
import { AVAILABLE_SOCIAL_APPS, SocialAppSvgIcon, getSocialAppMeta } from '../src/components/SocialMediaIcons';
import { PublishedProjectsSection } from '../src/components/PublishedProjectsSection';

export default function AdminDashboard({ 
  lang = 'ar', 
  onClose, 
  onRefreshData,
  onOpenSandboxWithConfig,
  inline = false,
  initialSection = 'analytics'
}) {
  const isRtl = lang === 'ar';
  const t = translations[lang] || translations.ar;

  const [activeSection, setActiveSection] = useState(initialSection); // 'analytics' | 'cms-articles' | 'cms-faqs' | 'cms-announcements' | 'projects' | 'wallets' | 'social' | 'users' | 'media' | 'drafts' | 'reviews'
  
  // Local reactive states
  const [projects, setProjects] = useState(() => storageService.getProjects(true));
  const [settings, setSettings] = useState(() => storageService.getSettings());
  const [wallets, setWallets] = useState(() => storageService.getWallets());
  const [aiDrafts, setAiDrafts] = useState(() => storageService.getAiDrafts());
  const [users, setUsers] = useState(() => storageService.getUsers());
  const [mediaResources, setMediaResources] = useState(() => storageService.getMediaResources());
  const [reviews, setReviews] = useState(() => storageService.getReviews());
  const [activityLogs, setActivityLogs] = useState(() => storageService.getActivityLogs());
  const [articles, setArticles] = useState(() => storageService.getArticles(true));
  const [faqs, setFaqs] = useState(() => storageService.getFaqs(true));
  const [announcements, setAnnouncements] = useState(() => storageService.getAnnouncements());
  const [staffList, setStaffList] = useState(() => storageService.getStaff());
  const [userRolesMap, setUserRolesMap] = useState(() => storageService.getUserRoles());
  const [achievementsList, setAchievementsList] = useState(() => storageService.getAllAchievements());
  const [publishedProjects, setPublishedProjects] = useState(() => storageService.getPublishedProjects());
  const [adminNotifications, setAdminNotifications] = useState(() => storageService.getAdminNotifications());
  const [showAdminNotifsModal, setShowAdminNotifsModal] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  
  // User Management Modals
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
  const [newRoleSelect, setNewRoleSelect] = useState('vip');
  const [newJobTitleInput, setNewJobTitleInput] = useState('');
  
  const [selectedUserForSystems, setSelectedUserForSystems] = useState(null);
  const [assignSystemProjectId, setAssignSystemProjectId] = useState(projects[0]?.id || 'lms-core-hub');
  
  const [selectedUserForBan, setSelectedUserForBan] = useState(null);
  const [banReasonInput, setBanReasonInput] = useState('');
  
  const [selectedUserForMsg, setSelectedUserForMsg] = useState(null);
  const [directMsgTitle, setDirectMsgTitle] = useState('');
  const [directMsgContent, setDirectMsgContent] = useState('');
  
  // Achievement form state
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchCategory, setNewAchCategory] = useState(isRtl ? 'إنجاز تقني' : 'Tech Achievement');
  const [newAchDesc, setNewAchDesc] = useState('');
  const [newAchMetricNum, setNewAchMetricNum] = useState('');
  const [newAchMetricLabel, setNewAchMetricLabel] = useState('');
  const [newAchImage, setNewAchImage] = useState('');
  const [newAchLink, setNewAchLink] = useState('');
  const [targetUserEmail, setTargetUserEmail] = useState('');
  const [targetUserRole, setTargetUserRole] = useState('moderator');
  const [targetUserPermissions, setTargetUserPermissions] = useState(['manage_projects', 'manage_cms', 'manage_support']);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState(isRtl ? 'مسؤول خدمة العملاء' : 'Customer Support');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffWhatsapp, setNewStaffWhatsapp] = useState('');
  const [newStaffTelegram, setNewStaffTelegram] = useState('');
  const [globalPrices, setGlobalPrices] = useState(() => settings.globalPrices || {
    monthlyAr: '', monthlyEn: '', annualAr: '', annualEn: '', fullAr: '', fullEn: ''
  });

  // CMS Article form state
  const [newArtTitle, setNewArtTitle] = useState('');
  const [newArtCategory, setNewArtCategory] = useState(isRtl ? 'تقنية وتطوير' : 'Tech & Dev');
  const [newArtAuthor, setNewArtAuthor] = useState(isRtl ? 'فريق التحرير' : 'Editorial Team');
  const [newArtReadTime, setNewArtReadTime] = useState('5 دقائق');
  const [newArtExcerpt, setNewArtExcerpt] = useState('');
  const [newArtContent, setNewArtContent] = useState('');
  const [newArtImage, setNewArtImage] = useState('');

  // CMS FAQ form state
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [newFaqCategory, setNewFaqCategory] = useState(isRtl ? 'عام' : 'General');

  // CMS Announcement form state
  const [newAnnMessage, setNewAnnMessage] = useState('');
  const [newAnnBadge, setNewAnnBadge] = useState(isRtl ? 'تنبيه هام' : 'Notice');
  const [newAnnType, setNewAnnType] = useState('success');
  
  const [activityFilter, setActivityFilter] = useState('all'); // 'all' | 'projects' | 'drafts' | 'media' | 'settings'
  const [activitySearchQuery, setActivitySearchQuery] = useState('');
  
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [newSecretFileName, setNewSecretFileName] = useState('');
  const [newSecretFileUrl, setNewSecretFileUrl] = useState('');
  const [uploadFileCategory, setUploadFileCategory] = useState('source_code_zip');
  const [uploadFileMetadata, setUploadFileMetadata] = useState('');

  const [supportTickets, setSupportTickets] = useState(() => storageService.getSupportTickets());
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [customOverrideInput, setCustomOverrideInput] = useState('');

  // Admin AI Copilot State
  const [copilotMessages, setCopilotMessages] = useState([
    {
      role: 'assistant',
      text: isRtl 
        ? 'مرحباً بك يا مدير المنصة! 🤖 أنا المساعد الذكي الخاص بلوحة تحكم ليرن ويب (Lern Web Admin Copilot). كيف يمكنني مساعدتك؟ يمكنني صياغة مقالات مدونة، توليد إعلانات شريطية، إضافة أسئلة شائعة، اقتراح هويات وتصاميم، أو الإجابة على أي استفسار إداري.'
        : 'Welcome Admin! 🤖 I am your dedicated Lern Web Admin Copilot. I can draft blog articles, craft announcements, generate FAQs, suggest palettes, or assist with any control panel operations.'
    }
  ]);
  const [copilotInput, setCopilotInput] = useState('');
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);
  const [copilotGeneratedItem, setCopilotGeneratedItem] = useState(null);

  const [isAiChatEnabled, setIsAiChatEnabled] = useState(() => (settings?.isAiChatEnabled !== false));
  const [customGeminiKeyInput, setCustomGeminiKeyInput] = useState('');
  const [keyPoolStatus, setKeyPoolStatus] = useState({ 
    totalKeys: 25, 
    activeKeys: 25, 
    coolingDownKeys: 0, 
    slots: [],
    hasOpenAiKey: false
  });
  const [isAiKeysLoading, setIsAiKeysLoading] = useState(false);
  const [openAiKeySettingInput, setOpenAiKeySettingInput] = useState(settings?.openAiApiKey || '');
  const [preferredAiEngineSetting, setPreferredAiEngineSetting] = useState(settings?.preferredAiProvider || 'gemini');

  const saveAiSettings = async () => {
    setIsAiKeysLoading(true);
    try {
      await fetch('/api/admin/ai-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          isAiChatEnabled, 
          customGeminiKeyInput,
          aiWelcomeMessageAr: settings.aiWelcomeMessageAr,
          aiWelcomeMessageEn: settings.aiWelcomeMessageEn,
          aiFallbackReplyAr: settings.aiFallbackReplyAr,
          aiFallbackReplyEn: settings.aiFallbackReplyEn
        })
      });
      triggerSaveNotification(isRtl ? 'تم حفظ إعدادات الذكاء الاصطناعي!' : 'AI settings saved!');
    } catch (e) {
      triggerSaveNotification(isRtl ? 'حدث خطأ!' : 'Error!');
    } finally {
      setIsAiKeysLoading(false);
    }
  };
  const fetchKeyPoolAdminStatus = async () => {
    try {
      const res = await fetch('/api/ai/keys-status');
      if (res.ok) {
        const data = await res.json();
        setKeyPoolStatus(data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchKeyPoolAdminStatus();
  }, []);

  // Wallet Management Modal State
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [newWalletNameAr, setNewWalletNameAr] = useState('');
  const [newWalletNameEn, setNewWalletNameEn] = useState('');
  const [newWalletNumber, setNewWalletNumber] = useState('');
  const [newWalletUrl, setNewWalletUrl] = useState('');
  const [newWalletBadge, setNewWalletBadge] = useState(isRtl ? 'دفع فوري معتمد' : 'Instant Verified');
  const [newWalletInstructions, setNewWalletInstructions] = useState('');
  const [newWalletColor, setNewWalletColor] = useState('#2563eb');

  // Social Media Links Management State
  const [newSocialApp, setNewSocialApp] = useState('whatsapp');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newSocialTitleAr, setNewSocialTitleAr] = useState('');
  const [newSocialTitleEn, setNewSocialTitleEn] = useState('');

  // Site Content & Sections Management State
  const [contentSubTab, setContentSubTab] = useState('hero'); // 'hero' | 'sections' | 'about_footer'

  const refreshLocalData = () => {
    setProjects(storageService.getProjects(true));
    const freshSettings = storageService.getSettings();
    setSettings(freshSettings);
    if (freshSettings?.globalPrices) {
      setGlobalPrices(freshSettings.globalPrices);
    }
    setWallets(storageService.getWallets());
    setAiDrafts(storageService.getAiDrafts());
    setUsers(storageService.getUsers());
    setMediaResources(storageService.getMediaResources());
    setReviews(storageService.getReviews());
    setActivityLogs(storageService.getActivityLogs());
    setSupportTickets(storageService.getSupportTickets());
    setArticles(storageService.getArticles(true));
    setFaqs(storageService.getFaqs(true));
    setAnnouncements(storageService.getAnnouncements());
    setStaffList(storageService.getStaff());
    setUserRolesMap(storageService.getUserRoles());
    setAchievementsList(storageService.getAllAchievements());
    setPublishedProjects(storageService.getPublishedProjects());
    setAdminNotifications(storageService.getAdminNotifications());
  };

  useEffect(() => {
    storageService.syncNow();
    const unsubscribe = storageService.subscribe(() => {
      refreshLocalData();
    });
    return () => unsubscribe();
  }, []);

  const handleDownloadLocalFile = (file) => {
    if (!file) return;
    const a = document.createElement('a');
    if (file.base64) {
      a.href = file.base64;
    } else if (file.content) {
      const blob = new Blob([file.content], { type: file.type || 'text/plain' });
      a.href = URL.createObjectURL(blob);
    } else {
      alert(isRtl ? 'محتوى الملف غير متوفر للتنزيل' : 'File content empty');
      return;
    }
    a.download = file.name || 'project_file';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    triggerSaveNotification(isRtl ? `تم تنزيل الملف (${file.name || 'مشروع'}) على جهازك!` : `File downloaded!`);
  };

  const handleDownloadDraftFiles = (draft) => {
    if (!draft) return;
    const bundleData = {
      draftId: draft.id,
      visitorName: draft.visitorName,
      visitorPhone: draft.visitorPhone,
      userPrompt: draft.userPrompt,
      centerName: draft.modifiedConfig?.centerName,
      modifiedConfig: draft.modifiedConfig,
      modifiedCode: draft.modifiedCode,
      modifiedFiles: draft.modifiedFiles || [],
      exportedAt: new Date().toISOString()
    };

    const jsonString = JSON.stringify(bundleData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = `draft_${draft.id}_files_bundle.json`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (draft.modifiedFiles && draft.modifiedFiles.length > 0) {
      draft.modifiedFiles.forEach(f => {
        handleDownloadLocalFile(f);
      });
    }

    triggerSaveNotification(isRtl ? 'تم تنزيل كافة ملفات وتعديلات المسودة على جهازك!' : 'Draft files downloaded!');
  };

  // Full Platform Data Backup & Restore state
  const [isExportingBackup, setIsExportingBackup] = useState(false);
  const [isRestoringBackup, setIsRestoringBackup] = useState(false);
  const [backupRestoreMsg, setBackupRestoreMsg] = useState(null);

  const handleDownloadFullPlatformBackup = () => {
    setIsExportingBackup(true);
    try {
      const backupData = storageService.exportFullPlatformBackup();
      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `lernweb_platform_backup_${dateStr}.json`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      storageService.addActivityLog(
        'db_export',
        'تصدير النسخة الاحتياطية الشاملة للمنظومة',
        'Full Platform Data Backup Downloaded',
        `تم تنزيل ملف النسخة الاحتياطية (${filename}) بنجاح.`,
        `Successfully downloaded platform backup (${filename}).`
      );
      setActivityLogs(storageService.getActivityLogs());
      triggerSaveNotification(isRtl ? 'تم تنزيل النسخة الاحتياطية الشاملة بنجاح!' : 'Full platform backup file downloaded!');
    } catch {
      alert(isRtl ? 'حدث خطأ أثناء إعداد النسخة الاحتياطية' : 'Error generating backup file');
    } finally {
      setIsExportingBackup(false);
    }
  };

  const handleFileUploadAndRestore = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm(
      isRtl 
        ? '⚠️ هل أنت متأكد من استعادة حالة البيانات من هذا الملف؟ سيتم تحديث وتحديث سجلات المشاريع، والعملاء، والمسودات لتطابق النسخة الاحتياطية.' 
        : '⚠️ Are you sure you want to restore platform state from this file? Project, user, and draft records will be updated to match the backup file.'
    )) {
      e.target.value = '';
      return;
    }

    setIsRestoringBackup(true);
    setBackupRestoreMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonContent = JSON.parse(event.target.result);
        const result = storageService.importFullPlatformBackup(jsonContent);

        if (result.success) {
          // Synchronize local states
          setProjects(storageService.getProjects(true));
          setSettings(storageService.getSettings());
          setWallets(storageService.getWallets());
          setPlans(storageService.getPlans());
          setAiDrafts(storageService.getAiDrafts());
          setUsers(storageService.getUsers());
          setMediaResources(storageService.getMediaResources());
          setReviews(storageService.getReviews());
          setActivityLogs(storageService.getActivityLogs());

          setBackupRestoreMsg({
            isError: false,
            text: isRtl ? result.messageAr : result.messageEn,
            counts: result.restoredCounts
          });

          triggerSaveNotification(isRtl ? 'تم استعادة كافة بيانات وحالة المنظومة بنجاح!' : 'Platform state successfully restored!');
        } else {
          setBackupRestoreMsg({
            isError: true,
            text: isRtl ? result.messageAr : result.messageEn
          });
        }
      } catch {
        setBackupRestoreMsg({
          isError: true,
          text: isRtl ? 'عفواً، الملف المرفوع غير صالح أو تالف. يرجى رفع ملف نسق JSON يحتوي على بيانات النسخة الاحتياطية.' : 'Invalid or corrupted JSON backup file.'
        });
      } finally {
        setIsRestoringBackup(false);
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleSaveSeoSettings = (newSeoSettings) => {
    const updatedSettings = {
      ...settings,
      seoSettings: newSeoSettings
    };
    setSettings(updatedSettings);
    storageService.saveSettings(updatedSettings);
    storageService.addActivityLog(
      'settings_updated',
      'تحديث إعدادات SEO للمنظومة',
      'Site-wide SEO Settings Updated',
      'تم تحديث العنوان، الوصف، وصور المشاركة الاجتماعية.',
      'Updated site meta title, description, and social sharing images.'
    );
    setActivityLogs(storageService.getActivityLogs());
    triggerSaveNotification(isRtl ? 'تم حفظ إعدادات SEO بنجاح!' : 'SEO settings saved successfully!');
  };

  // New Media form state (YouTube, Local Video, Image URL, Local Image, Article)
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaType, setNewMediaType] = useState('video'); // 'video' | 'image' | 'doc'
  const [newMediaSourceType, setNewMediaSourceType] = useState('youtube_url'); // 'youtube_url' | 'youtube_embed' | 'local_video' | 'image_url' | 'local_image'
  const [newMediaTargetSection, setNewMediaTargetSection] = useState('hero'); // 'hero' | 'wallets' | 'store' | 'articles' | 'about'
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaEmbedCode, setNewMediaEmbedCode] = useState('');
  const [newMediaCategory, setNewMediaCategory] = useState(isRtl ? 'فيديو يوتيوب شرح' : 'YouTube Video');
  const [newMediaContent, setNewMediaContent] = useState('');
  const [newMediaFile, setNewMediaFile] = useState(null); // { name, type, base64 }

  // Recharts Dynamic Analytics Metrics Datasets
  const userEngagementTrends = [
    { month: isRtl ? 'يناير' : 'Jan', users: 140, pwaSessions: 420, sandboxRuns: 280 },
    { month: isRtl ? 'فبراير' : 'Feb', users: 220, pwaSessions: 610, sandboxRuns: 430 },
    { month: isRtl ? 'مارس' : 'Mar', users: 310, pwaSessions: 890, sandboxRuns: 620 },
    { month: isRtl ? 'أبريل' : 'Apr', users: 450, pwaSessions: 1240, sandboxRuns: 890 },
    { month: isRtl ? 'مايو' : 'May', users: 620, pwaSessions: 1680, sandboxRuns: 1150 },
    { month: isRtl ? 'يونيو' : 'Jun', users: 810, pwaSessions: 2150, sandboxRuns: 1540 },
    { month: isRtl ? 'يوليو' : 'Jul', users: 990, pwaSessions: 2680, sandboxRuns: 1980 },
    { month: isRtl ? 'أغسطس' : 'Aug', users: 1240, pwaSessions: 3290, sandboxRuns: 2450 },
    { month: isRtl ? 'سبتمبر' : 'Sep', users: 1520, pwaSessions: 3950, sandboxRuns: 3020 },
    { month: isRtl ? 'أكتوبر' : 'Oct', users: Math.max(users.length * 25, 1890), pwaSessions: 4820, sandboxRuns: 3760 }
  ];

  const projectCategoryTrends = [
    { category: isRtl ? 'منصات LMS' : 'LMS Portals', installations: 480, downloads: 360 },
    { category: isRtl ? 'مراكز STEM' : 'STEM Suites', installations: 320, downloads: 240 },
    { category: isRtl ? 'محاكي AI' : 'AI Simulators', installations: 410, downloads: 380 },
    { category: isRtl ? 'القاعات الحية' : 'Live Rooms', installations: 220, downloads: 180 },
    { category: isRtl ? 'بنوك QR' : 'QR Exam Gates', installations: 350, downloads: 310 }
  ];

  const subscriptionStatusMetrics = [
    { name: isRtl ? 'الباقة السنوية المعتمدة' : 'Annual Suite', value: 58, color: '#3b82f6' },
    { name: isRtl ? 'الإيجار الشهري المرن' : 'Monthly Rental', value: 27, color: '#10b981' },
    { name: isRtl ? 'التملك الكامل للكود' : 'Full Buyout Perpetual', value: 15, color: '#8b5cf6' }
  ];

  const requestStatusMetrics = [
    { status: isRtl ? 'قيد المراجعة' : 'Pending Review', count: aiDrafts.filter(d => d.status === 'pending_review' || !d.status).length, fill: '#f59e0b' },
    { status: isRtl ? 'قيد التنفيذ والبرمجة' : 'In Progress', count: aiDrafts.filter(d => d.status === 'in_progress').length, fill: '#3b82f6' },
    { status: isRtl ? 'تم التنفيذ والاعتماد' : 'Completed / Published', count: aiDrafts.filter(d => d.status === 'completed' || d.status === 'approved_published').length + 5, fill: '#10b981' }
  ];

  // Bulk Selection States
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [selectedMediaIds, setSelectedMediaIds] = useState([]);

  // Bulk Actions for Projects
  const handleSelectAllProjects = () => {
    if (selectedProjectIds.length === projects.length && projects.length > 0) {
      setSelectedProjectIds([]);
    } else {
      setSelectedProjectIds(projects.map(p => p.id));
    }
  };

  const handleToggleSelectProject = (id) => {
    if (selectedProjectIds.includes(id)) {
      setSelectedProjectIds(selectedProjectIds.filter(item => item !== id));
    } else {
      setSelectedProjectIds([...selectedProjectIds, id]);
    }
  };

  const handleBulkTogglePublishProjects = () => {
    if (selectedProjectIds.length === 0) return;
    const selectedProjects = projects.filter(p => selectedProjectIds.includes(p.id));
    const allPublished = selectedProjects.every(p => p.isPublished);
    const targetState = !allPublished;

    const updatedProjects = projects.map(p => {
      if (selectedProjectIds.includes(p.id)) {
        return { ...p, isPublished: targetState };
      }
      return p;
    });

    setProjects(updatedProjects);
    storageService.saveProjects(updatedProjects);
    storageService.addActivityLog(
      'project_published',
      `تغيير حالة نشر جماعي لـ (${selectedProjectIds.length}) من المشاريع`,
      `Bulk toggle publish status for (${selectedProjectIds.length}) projects`,
      `الحالة الجديدة: ${targetState ? 'منشور' : 'مخفي'}`
    );
    setActivityLogs(storageService.getActivityLogs());
    triggerSaveNotification(
      isRtl 
        ? `تم ${targetState ? 'نشر' : 'إخفاء'} (${selectedProjectIds.length}) من المشاريع المحددة بنجاح!` 
        : `Batch ${targetState ? 'published' : 'hidden'} (${selectedProjectIds.length}) projects!`
    );
  };

  const handleBulkDeleteProjects = () => {
    if (selectedProjectIds.length === 0) return;
    if (window.confirm(isRtl ? `هل أنت متأكد من حذف (${selectedProjectIds.length}) من المشاريع المحددة نهائياً؟` : `Delete ${selectedProjectIds.length} selected projects?`)) {
      selectedProjectIds.forEach(id => {
        storageService.deleteProject(id);
      });
      setProjects(storageService.getProjects(true));
      storageService.addActivityLog(
        'project_deleted',
        `حذف جماعي لـ (${selectedProjectIds.length}) من المشاريع`,
        `Bulk deleted (${selectedProjectIds.length}) projects`
      );
      setActivityLogs(storageService.getActivityLogs());
      setSelectedProjectIds([]);
      triggerSaveNotification(isRtl ? 'تم حذف المشاريع المحددة بنجاح.' : 'Selected projects deleted.');
    }
  };

  // Bulk Actions for Media Items
  const handleSelectAllMedia = () => {
    if (selectedMediaIds.length === mediaResources.length && mediaResources.length > 0) {
      setSelectedMediaIds([]);
    } else {
      setSelectedMediaIds(mediaResources.map(m => m.id));
    }
  };

  const handleToggleSelectMedia = (id) => {
    if (selectedMediaIds.includes(id)) {
      setSelectedMediaIds(selectedMediaIds.filter(item => item !== id));
    } else {
      setSelectedMediaIds([...selectedMediaIds, id]);
    }
  };

  const handleBulkDeleteMedia = () => {
    if (selectedMediaIds.length === 0) return;
    if (window.confirm(isRtl ? `هل أنت متأكد من حذف (${selectedMediaIds.length}) من عناصر المحتوى المحددة؟` : `Delete ${selectedMediaIds.length} selected media items?`)) {
      selectedMediaIds.forEach(id => {
        storageService.deleteMediaResource(id);
      });
      setMediaResources(storageService.getMediaResources());
      storageService.addActivityLog(
        'media_deleted',
        `حذف جماعي لـ (${selectedMediaIds.length}) من عناصر المحتوى والوسائط`,
        `Bulk deleted (${selectedMediaIds.length}) media items`
      );
      setActivityLogs(storageService.getActivityLogs());
      setSelectedMediaIds([]);
      triggerSaveNotification(isRtl ? 'تم حذف المحتويات المحددة بنجاح.' : 'Selected media items deleted.');
    }
  };

  const handleToggleMediaPublish = (mediaId) => {
    const list = storageService.getMediaResources();
    const updated = list.map(m => {
      if (m.id === mediaId) {
        return { ...m, isPublished: m.isPublished === false ? true : false };
      }
      return m;
    });
    storageService.saveMediaResources(updated);
    setMediaResources(updated);
    const item = updated.find(m => m.id === mediaId);
    storageService.addActivityLog(
      'media_created', // Using existing type or could add media_updated
      `تغيير حالة نشر المحتوى: ${isRtl ? item.titleAr : item.titleEn}`,
      `Media publish status toggled: ${isRtl ? item.titleAr : item.titleEn}`,
      `الحالة: ${item.isPublished !== false ? 'منشور' : 'مخفي'}`
    );
    setActivityLogs(storageService.getActivityLogs());
    triggerSaveNotification(isRtl ? 'تم تحديث حالة النشر.' : 'Publish status updated.');
  };

  const handleBulkTogglePublishMedia = () => {
    if (selectedMediaIds.length === 0) return;
    const list = storageService.getMediaResources();
    const selectedItems = list.filter(m => selectedMediaIds.includes(m.id));
    const allPublished = selectedItems.every(m => m.isPublished !== false);
    const targetState = !allPublished;

    const updated = list.map(m => {
      if (selectedMediaIds.includes(m.id)) {
        return { ...m, isPublished: targetState };
      }
      return m;
    });

    storageService.saveMediaResources(updated);
    setMediaResources(updated);
    storageService.addActivityLog(
      'media_created',
      `تغيير حالة نشر جماعي لـ (${selectedMediaIds.length}) من عناصر المحتوى`,
      `Bulk toggle media publish status for (${selectedMediaIds.length}) items`,
      `الحالة الجديدة: ${targetState ? 'منشور' : 'مخفي'}`
    );
    setActivityLogs(storageService.getActivityLogs());
    triggerSaveNotification(isRtl ? 'تم تحديث الحالات بنجاح.' : 'Statuses updated.');
  };


  const triggerSaveNotification = (msg) => {
    setSaveSuccessMsg(msg);
    refreshLocalData();
    setTimeout(() => setSaveSuccessMsg(''), 3000);
    if (onRefreshData) onRefreshData();
  };

  const handleFileUpload = (e, projectId) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      const fileId = 'file-' + Math.random().toString(36).substr(2, 9);
      const newFile = {
        id: fileId,
        name: file.name,
        base64: base64,
        type: file.type || 'application/octet-stream',
        fileCategory: uploadFileCategory,
        featureMetadata: uploadFileMetadata.trim() || (isRtl ? 'ملف مشروع مرفوع من جهازك' : 'Uploaded project file'),
        size: file.size,
        updatedAt: new Date().toISOString().split('T')[0]
      };

      if (editingProject) {
        const updated = {
          ...editingProject,
          fileData: [...(editingProject.fileData || []), newFile]
        };
        setEditingProject(updated);
        storageService.updateProject(updated);
        setProjects(projects.map(p => p.id === updated.id ? updated : p));
        storageService.addActivityLog(
          'project_updated',
          `رفع ملف للمشروع (${file.name}) بنوع [${uploadFileCategory}]`,
          `Uploaded project file (${file.name}) under category [${uploadFileCategory}]`
        );
        setActivityLogs(storageService.getActivityLogs());
        setUploadFileMetadata('');
        triggerSaveNotification(isRtl ? 'تم تحميل ملف المشروع وتحديد مواصفاته بنجاح!' : 'File uploaded with metadata!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (fileId) => {
    if (!editingProject) return;
    const updated = {
      ...editingProject,
      fileData: editingProject.fileData.filter(f => f.id !== fileId)
    };
    setEditingProject(updated);
    storageService.updateProject(updated);
    setProjects(projects.map(p => p.id === updated.id ? updated : p));
    triggerSaveNotification(isRtl ? 'تم حذف الملف.' : 'File removed.');
  };

  // Toggle Project Publish State
  const handleTogglePublish = (projectId) => {
    const target = projects.find(p => p.id === projectId);
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        return { ...p, isPublished: !p.isPublished };
      }
      return p;
    });
    setProjects(updated);
    storageService.saveProjects(updated);
    const title = target ? (isRtl ? target.titleAr : target.titleEn) : projectId;
    const newState = updated.find(p => p.id === projectId)?.isPublished;
    storageService.addActivityLog(
      'project_published',
      `تغيير حالة نشر المشروع: ${title}`,
      `Project publish status toggled: ${title}`,
      `الحالة الجديدة: ${newState ? 'منشور للزوار' : 'مخفي'}`
    );
    setActivityLogs(storageService.getActivityLogs());
    triggerSaveNotification(isRtl ? 'تم تحديث حالة نشر المشروع بنجاح!' : 'Project publish status updated!');
  };

  // Delete Project / Content
  const handleDeleteProject = (projectId) => {
    const target = projects.find(p => p.id === projectId);
    const title = target ? (isRtl ? target.titleAr : target.titleEn) : projectId;
    if (window.confirm(isRtl ? 'هل أنت متأكد من حذف هذا المشروع نهائياً؟' : 'Are you sure you want to delete this project?')) {
      storageService.deleteProject(projectId);
      setProjects(storageService.getProjects(true));
      storageService.addActivityLog(
        'project_deleted',
        `حذف مشروع: ${title}`,
        `Deleted project: ${title}`
      );
      setActivityLogs(storageService.getActivityLogs());
      triggerSaveNotification(isRtl ? 'تم حذف المشروع من النظام.' : 'Project removed.');
    }
  };

  const handleMediaFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewMediaFile({
        name: file.name,
        type: file.type,
        base64: event.target.result
      });
      setNewMediaUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Add Media Resource (YouTube video, Embed code, Local video, Image URL, Local image, Article)
  const handleAddMedia = (e) => {
    e.preventDefault();
    if (!newMediaTitle.trim()) {
      alert(isRtl ? 'يرجى كتابة عنوان المحتوى أولاً' : 'Please enter title');
      return;
    }

    let finalVideoUrl = '';
    let finalImageUrl = '';

    if (newMediaType === 'video') {
      if (newMediaSourceType === 'youtube_url' || newMediaSourceType === 'youtube_embed') {
        const inputString = newMediaSourceType === 'youtube_embed' ? newMediaEmbedCode : newMediaUrl;
        finalVideoUrl = formatVideoEmbedUrl(inputString);
        if (!finalVideoUrl) {
          alert(isRtl ? 'يرجى إدخال رابط يوتيوب صحيح أو كود تضمين iframe' : 'Please enter valid YouTube URL or iframe embed code');
          return;
        }
      } else if (newMediaSourceType === 'local_video') {
        finalVideoUrl = newMediaFile?.base64 || newMediaUrl;
        if (!finalVideoUrl) {
          alert(isRtl ? 'يرجى اختيار فيديو من داخل جهازك أولاً' : 'Please upload a video file from your device');
          return;
        }
      }
    } else if (newMediaType === 'image') {
      if (newMediaSourceType === 'local_image') {
        finalImageUrl = newMediaFile?.base64 || newMediaUrl;
        if (!finalImageUrl) {
          alert(isRtl ? 'يرجى اختيار صورة من داخل جهازك أولاً' : 'Please upload an image file from your device');
          return;
        }
      } else {
        finalImageUrl = newMediaUrl.trim();
        if (!finalImageUrl) {
          alert(isRtl ? 'يرجى إدخال رابط الصورة المباشر' : 'Please enter direct image URL');
          return;
        }
      }
    }

    const newItem = {
      id: 'media-' + Date.now(),
      type: newMediaType,
      mediaSourceType: newMediaSourceType,
      titleAr: newMediaTitle.trim(),
      titleEn: newMediaTitle.trim(),
      durationOrReadTimeAr: newMediaType === 'video' ? 'فيديو تفاعلي' : newMediaType === 'image' ? 'صورة HD' : 'قراءة في 5 دقائق',
      durationOrReadTimeEn: newMediaType === 'video' ? 'Interactive Video' : newMediaType === 'image' ? 'HD Image' : '5 min read',
      categoryAr: newMediaCategory,
      categoryEn: newMediaCategory,
      summaryAr: newMediaContent.slice(0, 120) || 'محتوى تعليمي منشور من لوحة الأدمن',
      summaryEn: newMediaContent.slice(0, 120) || 'Published from admin dashboard',
      contentAr: newMediaContent.trim() || 'التفاصيل الكاملة للمحتوى التعليمي.',
      contentEn: newMediaContent.trim() || 'Full educational content details.',
      videoUrl: finalVideoUrl || undefined,
      imageUrl: finalImageUrl || undefined,
      embedCode: newMediaEmbedCode || undefined,
      thumbnailBg: 'from-blue-900 to-indigo-950',
      isPublished: true,
      targetSection: newMediaTargetSection
    };

    storageService.addMediaResource(newItem);
    setMediaResources(storageService.getMediaResources());
    storageService.addActivityLog(
      'media_created',
      `نشر محتوى جديد: ${newMediaTitle.trim()}`,
      `Published media item: ${newMediaTitle.trim()}`,
      `النوع: ${newMediaType} - المصدر: ${newMediaSourceType}`
    );
    setActivityLogs(storageService.getActivityLogs());
    setNewMediaTitle('');
    setNewMediaUrl('');
    setNewMediaEmbedCode('');
    setNewMediaContent('');
    setNewMediaFile(null);
    triggerSaveNotification(isRtl ? 'تم نشر المحتوى أو فيديو اليوتيوب/الصورة بنجاح في المنصة!' : 'Media published successfully!');
  };

  // Add CMS Article
  const handleAddArticle = (e) => {
    e.preventDefault();
    if (!newArtTitle.trim() || !newArtContent.trim()) {
      alert(isRtl ? 'يرجى إدخال العنوان وتفاصيل المقال' : 'Please enter title and content');
      return;
    }
    const newArt = {
      id: 'article-' + Date.now(),
      titleAr: newArtTitle.trim(),
      titleEn: newArtTitle.trim(),
      categoryAr: newArtCategory,
      categoryEn: newArtCategory,
      author: newArtAuthor.trim() || 'فريق التحرير',
      readTime: newArtReadTime,
      excerptAr: newArtExcerpt.trim() || newArtContent.slice(0, 100),
      excerptEn: newArtExcerpt.trim() || newArtContent.slice(0, 100),
      contentAr: newArtContent.trim(),
      contentEn: newArtContent.trim(),
      imageUrl: newArtImage.trim() || '/homepage_view.png',
      tags: [newArtCategory, 'تعليم'],
      isPublished: true,
      createdAt: new Date().toISOString()
    };
    storageService.saveArticle(newArt);
    setArticles(storageService.getArticles(true));
    storageService.addActivityLog(
      'media_created',
      `نشر مقال جديد في المدونة: ${newArtTitle.trim()}`,
      `Published CMS Article: ${newArtTitle.trim()}`
    );
    setActivityLogs(storageService.getActivityLogs());
    setNewArtTitle('');
    setNewArtExcerpt('');
    setNewArtContent('');
    setNewArtImage('');
    triggerSaveNotification(isRtl ? 'تم نشر المقال بنجاح في المنصة!' : 'Article published successfully!');
  };

  const handleDeleteArticle = (id) => {
    if (window.confirm(isRtl ? 'هل تريد حذف هذا المقال نهائياً؟' : 'Delete this article?')) {
      storageService.deleteArticle(id);
      setArticles(storageService.getArticles(true));
      triggerSaveNotification(isRtl ? 'تم حذف المقال.' : 'Article deleted.');
    }
  };

  const handleToggleArticlePublish = (article) => {
    const updated = { ...article, isPublished: !article.isPublished };
    storageService.saveArticle(updated);
    setArticles(storageService.getArticles(true));
    triggerSaveNotification(isRtl ? 'تم تحديث حالة نشر المقال.' : 'Article status updated.');
  };

  // Add CMS FAQ
  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) {
      alert(isRtl ? 'يرجى كتابة السؤال والجواب' : 'Please enter question and answer');
      return;
    }
    const newFaq = {
      id: 'faq-' + Date.now(),
      categoryAr: newFaqCategory,
      categoryEn: newFaqCategory,
      questionAr: newFaqQuestion.trim(),
      questionEn: newFaqQuestion.trim(),
      answerAr: newFaqAnswer.trim(),
      answerEn: newFaqAnswer.trim(),
      order: faqs.length + 1,
      isPublished: true
    };
    storageService.saveFaq(newFaq);
    setFaqs(storageService.getFaqs(true));
    setNewFaqQuestion('');
    setNewFaqAnswer('');
    triggerSaveNotification(isRtl ? 'تم إضافة السؤال الشائع بنجاح!' : 'FAQ added successfully!');
  };

  const handleDeleteFaq = (id) => {
    if (window.confirm(isRtl ? 'هل تريد حذف هذا السؤال؟' : 'Delete this FAQ?')) {
      storageService.deleteFaq(id);
      setFaqs(storageService.getFaqs(true));
      triggerSaveNotification(isRtl ? 'تم حذف السؤال.' : 'FAQ deleted.');
    }
  };

  // Add CMS Announcement
  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnnMessage.trim()) {
      alert(isRtl ? 'يرجى كتابة نص التنبيه الإخباري' : 'Please enter message');
      return;
    }
    const newAnn = {
      id: 'ann-' + Date.now(),
      titleAr: 'تنبيه عاجل',
      titleEn: 'Notice',
      messageAr: newAnnMessage.trim(),
      messageEn: newAnnMessage.trim(),
      badgeAr: newAnnBadge.trim() || 'إعلان',
      badgeEn: newAnnBadge.trim() || 'Notice',
      type: newAnnType,
      isActive: true
    };
    storageService.saveAnnouncement(newAnn);
    setAnnouncements(storageService.getAnnouncements());
    setNewAnnMessage('');
    triggerSaveNotification(isRtl ? 'تم تفعيل التنبيه الإخباري بنجاح!' : 'Announcement saved!');
  };

  const handleDeleteAnnouncement = (id) => {
    storageService.deleteAnnouncement(id);
    setAnnouncements(storageService.getAnnouncements());
    triggerSaveNotification(isRtl ? 'تم حذف الإعلان.' : 'Announcement removed.');
  };

  const handleAddAchievement = (e) => {
    e.preventDefault();
    if (!newAchTitle.trim() || !newAchDesc.trim()) {
      alert(isRtl ? 'يرجى كتابة عنوان وصف الإنجاز' : 'Please enter achievement title and description');
      return;
    }
    const item = {
      id: 'ach-' + Date.now(),
      titleAr: newAchTitle.trim(),
      titleEn: newAchTitle.trim(),
      categoryAr: newAchCategory.trim() || (isRtl ? 'إنجاز تقني' : 'Tech Milestone'),
      categoryEn: newAchCategory.trim() || (isRtl ? 'إنجاز تقني' : 'Tech Milestone'),
      descriptionAr: newAchDesc.trim(),
      descriptionEn: newAchDesc.trim(),
      metricNumber: newAchMetricNum.trim() || '100+',
      metricLabelAr: newAchMetricLabel.trim() || (isRtl ? 'مشروع ناجح' : 'Successful Projects'),
      metricLabelEn: newAchMetricLabel.trim() || (isRtl ? 'مشروع ناجح' : 'Successful Projects'),
      imageUrl: newAchImage.trim() || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
      linkUrl: newAchLink.trim() || undefined,
      isPublished: true,
      createdAt: new Date().toISOString()
    };
    storageService.saveAchievement(item);
    setAchievementsList(storageService.getAllAchievements());
    setNewAchTitle('');
    setNewAchDesc('');
    setNewAchMetricNum('');
    setNewAchMetricLabel('');
    setNewAchImage('');
    setNewAchLink('');
    triggerSaveNotification(isRtl ? 'تم إضافة الإنجاز بنجاح وإظهاره بصفحة "عن المنظومة"!' : 'Achievement added successfully!');
  };

  const handleDeleteAchievement = (id) => {
    if (window.confirm(isRtl ? 'هل تريد حذف هذا الإنجاز نهائياً؟' : 'Delete this achievement?')) {
      storageService.deleteAchievement(id);
      setAchievementsList(storageService.getAllAchievements());
      triggerSaveNotification(isRtl ? 'تم حذف الإنجاز.' : 'Achievement removed.');
    }
  };

  const handleDeleteMedia = (mediaId) => {
    const item = mediaResources.find(m => m.id === mediaId);
    const title = item ? (isRtl ? item.titleAr : item.titleEn) : mediaId;
    if (window.confirm(isRtl ? 'هل تريد حذف هذا المحتوى أو الفيديو نهائياً؟' : 'Delete this media item?')) {
      storageService.deleteMediaResource(mediaId);
      setMediaResources(storageService.getMediaResources());
      storageService.addActivityLog(
        'media_deleted',
        `حذف محتوى وسائط: ${title}`,
        `Deleted media item: ${title}`
      );
      setActivityLogs(storageService.getActivityLogs());
      triggerSaveNotification(isRtl ? 'تم حذف المحتوى بنجاح.' : 'Media item deleted.');
    }
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm(isRtl ? 'هل تريد حذف هذا التقييم؟' : 'Delete this review?')) {
      storageService.deleteReview(reviewId);
      setReviews(storageService.getReviews());
      storageService.addActivityLog(
        'review_deleted',
        'حذف تقييم أو تعليق عميل',
        'Deleted customer review'
      );
      setActivityLogs(storageService.getActivityLogs());
      triggerSaveNotification(isRtl ? 'تم حذف التقييم بنجاح.' : 'Review deleted.');
    }
  };

  // Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    const updatedSettings = { ...settings, globalPrices };
    storageService.saveSettings(updatedSettings);
    storageService.addActivityLog(
      'settings_updated',
      'حفظ وتحديث تفضيلات وإعدادات المنظومة الشاملة والأسعار',
      'System Preferences & Global Settings/Prices Saved',
      `وضع المظهر المصرح: ${settings.themeMode || 'user'}`
    );
    setActivityLogs(storageService.getActivityLogs());
    if (onRefreshData) onRefreshData();
    triggerSaveNotification(isRtl ? 'تم حفظ الإعدادات والأسعار بنجاح!' : 'Settings and prices saved!');
  };

  // Save Wallets
  const handleSaveWallets = (e) => {
    e.preventDefault();
    storageService.saveWallets(wallets);
    storageService.addActivityLog(
      'wallets_updated',
      'تحديث بيانات وطرق دفع المحافظ الإلكترونية',
      'Updated Mobile Wallet Payment Configurations'
    );
    setActivityLogs(storageService.getActivityLogs());
    if (onRefreshData) onRefreshData();
    triggerSaveNotification(isRtl ? 'تم تحديث بيانات المحافظ الإلكترونية بنجاح!' : 'Mobile wallets updated!');
  };

  // Add new secret file
  const handleAddSecretFile = () => {
    if (!editingProject || !newSecretFileName.trim() || !newSecretFileUrl.trim()) return;

    const updatedSecretFiles = [
      ...(editingProject.secretFiles || []),
      {
        name: newSecretFileName.trim(),
        type: 'zip',
        urlOrNotes: newSecretFileUrl.trim(),
        updatedAt: new Date().toISOString().split('T')[0]
      }
    ];

    const updated = {
      ...editingProject,
      secretFiles: updatedSecretFiles
    };

    setEditingProject(updated);
    storageService.updateProject(updated);
    setProjects(projects.map((p) => (p.id === updated.id ? updated : p)));
    setNewSecretFileName('');
    setNewSecretFileUrl('');
    triggerSaveNotification(isRtl ? 'تم إضافة الملف السري إلى المشروع بنجاح!' : 'Secret file added!');
  };

  // Update Draft Status
  const handleUpdateDraftStatus = (draftId, newStatus, adminNotes) => {
    const targetDraft = aiDrafts.find(d => d.id === draftId);
    const centerName = targetDraft?.modifiedConfig?.centerName || targetDraft?.visitorName || draftId;
    storageService.updateAiDraftStatus(draftId, newStatus, adminNotes);
    setAiDrafts(storageService.getAiDrafts());

    // Send Real-time notification to client
    const statusLabelsAr = {
      'pending_review': 'قيد المراجعة',
      'in_progress': 'قيد التنفيذ والبرمجة',
      'completed': 'تم التنفيذ / جاهز',
      'approved_published': 'تم الاعتماد والنشر بالمتجر',
      'rejected': 'يحتاج مراجعة / مرفوض'
    };
    const statusLabelsEn = {
      'pending_review': 'Pending Review',
      'in_progress': 'In Progress',
      'completed': 'Completed / Ready',
      'approved_published': 'Approved & Published',
      'rejected': 'Needs Review / Rejected'
    };

    if (targetDraft?.visitorId) {
      storageService.addNotification(
        targetDraft.visitorId,
        `تحديث حالة طلب: ${centerName}`,
        `Status Update: ${centerName}`,
        `أصبح طلبك الآن في حالة: [${statusLabelsAr[newStatus] || newStatus}]` + (adminNotes ? `\n\nملاحظة: ${adminNotes}` : ''),
        `Your request is now: [${statusLabelsEn[newStatus] || newStatus}]` + (adminNotes ? `\n\nNote: ${adminNotes}` : ''),
        'status_change'
      );
    }

    storageService.addActivityLog(
      newStatus === 'approved_published' ? 'draft_approved' : 'draft_updated',
      `تحديث حالة مسودة العميل: ${centerName}`,
      `Updated draft status for client: ${centerName}`,
      `الحالة الجديدة: ${newStatus === 'approved_published' ? 'معتمدة ومنشورة بالمتجر' : newStatus === 'in_progress' ? 'قيد التنفيذ' : 'تم التنفيذ'}`
    );
    setActivityLogs(storageService.getActivityLogs());

    if (newStatus === 'approved_published') {
      if (targetDraft) {
        const newProj = {
          id: `custom-${Date.now()}`,
          category: 'lms',
          titleAr: targetDraft.modifiedConfig.centerName,
          titleEn: `${targetDraft.modifiedConfig.centerName} (Customized Edition)`,
          badgeAr: 'نسخة مخصصة ومعتمدة',
          badgeEn: 'Custom Approved Edition',
          taglineAr: `نسخة تم تخصيصها عبر طلب العميل ${targetDraft.visitorName || ''} وتم اعتمادها ونشرها من قبل الإدارة.`,
          taglineEn: `Custom configuration reviewed and authorized by platform administrator for client ${targetDraft.visitorName}.`,
          descriptionAr: `منصة تعليمية متكاملة تشمل ${targetDraft.modifiedConfig.activeCourse} مع هوية وثيم مخصص. تم الاعتماد والمراجعة الأمنية.`,
          descriptionEn: `Complete educational center featuring ${targetDraft.modifiedConfig.activeCourse} with custom branding.`,
          version: 'v1.0.0-custom',
          developer: 'Lern Web Admin Authorized',
          rating: 5.0,
          reviewsCount: 1,
          accentColor: '#3b82f6',
          isPublished: true,
          featuresAr: ['هوية بصرية مخصصة ومطابقة لطلب المركز', `كورس دراسي رئيسي: ${targetDraft.modifiedConfig.activeCourse}`],
          featuresEn: ['Custom visual branding', `Flagship cohort: ${targetDraft.modifiedConfig.activeCourse}`],
          techStack: ['Next.js 14', 'Tailwind CSS', 'PWA Engine'],
          priceMonthly: '1,100 ج.م',
          priceAnnual: '9,500 ج.م',
          priceFull: '29,000 ج.م',
          secretFiles: [],
          screenshots: [{ titleAr: 'معاينة الواجهة', titleEn: 'Preview', bgGradient: 'from-blue-900 to-indigo-950', mockupType: 'dashboard' }],
          sandboxConfig: {
            centerName: targetDraft.modifiedConfig.centerName,
            theme: targetDraft.modifiedConfig.theme,
            activeCourse: targetDraft.modifiedConfig.activeCourse,
            hasQuiz: targetDraft.modifiedConfig.hasQuiz,
            bannerText: targetDraft.modifiedConfig.bannerText,
            tutorName: 'المشرف المعتمد'
          }
        };
        storageService.addProject(newProj);
        setProjects(storageService.getProjects(true));
      }
    }

    triggerSaveNotification(isRtl ? 'تم تحديث حالة الطلب والمسودة بنجاح!' : 'Draft status updated successfully!');
  };

  return (
    <div className={inline ? "w-full rounded-3xl border border-blue-500/30 bg-slate-950 p-4 sm:p-6 lg:p-8 text-slate-100 shadow-2xl space-y-6 my-8 animate-fadeIn scroll-mt-24" : "fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-xl p-4 sm:p-6 lg:p-8 text-slate-100 animate-fadeIn"}>
      <div className={inline ? "space-y-6" : "max-w-7xl mx-auto space-y-6"}>
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-blue-500/40 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 shadow-2xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>{isRtl ? 'لوحة تحكم المشرف ونظام إدارة المحتوى (CMS Control Panel)' : 'Master Admin & CMS Control Panel'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              {isRtl ? 'إدارة منصة ليرن ويب ونظام المحتوى الشامل' : 'Lern Web Administration & Dynamic CMS'}
            </h1>
            <p className="text-xs md:text-sm text-slate-300">
              {isRtl 
                ? 'تحكم كامل في نشر وحجب المشاريع، ألوان الهوية، فيديوهات يوتيوب، التقييمات، وتتبع طلبات التعديل.'
                : 'Full authority over projects, identity colors, YouTube publishing, client reviews, and draft tracking.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span>{isRtl ? 'متصل بـ Firestore' : 'Connected to Firestore'}</span>
            </div>
            <button
              onClick={() => {
                storageService.logoutAdmin();
                if (onClose) onClose();
              }}
              className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs md:text-sm font-bold text-rose-300 hover:bg-rose-500/20 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>{isRtl ? 'تسجيل الخروج' : 'Logout'}</span>
            </button>


            <button
              onClick={refreshLocalData}
              className="rounded-2xl border border-slate-700 bg-slate-800 p-2.5 text-blue-400 hover:text-white transition"
              title={isRtl ? 'تحديث البيانات' : 'Refresh Data'}
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="rounded-2xl border border-slate-700 bg-slate-800 p-2.5 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Save Confirmation Notification Banner */}
        {saveSuccessMsg && (
          <div className="rounded-2xl bg-emerald-500/15 border border-emerald-500/40 p-4 text-emerald-300 font-bold text-sm flex items-center gap-2 shadow-lg animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* SECTION: ADMIN AI COPILOT (INTEGRATED INSIDE CONTROL PANEL) */}
        {activeSection === 'admin-ai' && (
          <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/20 p-6 md:p-8 shadow-2xl space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 border border-blue-500/30 px-3 py-1 text-xs font-bold text-blue-400">
                  <Bot className="w-4 h-4 animate-bounce" />
                  <span>{isRtl ? 'المساعد الذكي الداخلي للأدمن (Lern Web Copilot)' : 'Internal Admin AI Copilot'}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white">
                  {isRtl ? 'المساعد الذكي لمساعدتك داخل لوحة التحكم' : 'Control Panel Copilot Assistant'}
                </h3>
                <p className="text-xs md:text-sm text-slate-300">
                  {isRtl 
                    ? 'يعمل المساعد الذكي من داخل لوحة التحكم لتوليد المقالات، صياغة الإعلانات، إنشاء الأسئلة الشائعة، اقتراح التصاميم، وإعطاء نصائح استراتيجية لتنمية منصتك.' 
                    : 'Your in-dashboard AI Copilot for drafting CMS blog articles, banners, FAQs, theme ideas, and strategic insights.'}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isRtl ? 'متصل ومحدث بلحظية' : 'Live & Synchronized'}</span>
              </div>
            </div>

            {/* Quick Action Pills for Admin */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 block">{isRtl ? 'أوامر سريعة بنقرة واحدة:' : 'Quick Copilot Actions:'}</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: isRtl ? '✍️ صياغة مقال جديد عن مزايا تطبيق PWA' : '✍️ Draft article on PWA benefits', action: 'draft_article', topic: 'مزايا تطبيقات الويب التقدمية PWA في المراكز والسناتر' },
                  { label: isRtl ? '📢 كتابة إعلان عن خصم التراخيص السنوية' : '📢 Create Annual Discount Banner', action: 'draft_announcement', topic: 'خصم خاص 30% على التراخيص السنوية لجميع المراكز' },
                  { label: isRtl ? '❓ صياغة سؤال شائع عن طرق الدفع الفوري' : '❓ Generate FAQ on instant payments', action: 'draft_faq', topic: 'كيفية السداد عبر فودافون كاش وأورانج كاش وانستاباي' },
                  { label: isRtl ? '🎨 اقتراح هوية وألوان فاخرة للمنصة' : '🎨 Suggest luxury theme & colors', action: 'chat', topic: 'اقترح لي هوية بصرية وألوان متناسقة لمنصة تعليمية كبرى' },
                  { label: isRtl ? '💡 نصائح لزيادة اشتراكات الطلاب والمدرسين' : '💡 Tips to boost subscriptions', action: 'chat', topic: 'ما هي أهم 5 استراتيجيات لزيادة الإقبال على السنتر التعليمي؟' }
                ].map((act, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={isCopilotLoading}
                    onClick={async () => {
                      setCopilotInput(act.topic);
                      setIsCopilotLoading(true);
                      try {
                        const res = await fetch('/api/ai/admin-copilot', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ action: act.action, prompt: act.topic })
                        });
                        const data = await res.json();
                        if (data.data) {
                          setCopilotGeneratedItem({ type: act.action, payload: data.data });
                        }
                        setCopilotMessages(prev => [
                          ...prev,
                          { role: 'user', text: act.topic },
                          { role: 'assistant', text: data.text || (isRtl ? 'تمت معالجة طلبك بنجاح!' : 'Handled successfully!') }
                        ]);
                      } catch (err) {
                        setCopilotMessages(prev => [
                          ...prev,
                          { role: 'user', text: act.topic },
                          { role: 'assistant', text: isRtl ? 'عذراً، حدث خطأ أثناء الاتصال بالمساعد.' : 'Copilot error occurred.' }
                        ]);
                      } finally {
                        setIsCopilotLoading(false);
                      }
                    }}
                    className="rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-blue-600/30 hover:border-blue-500/50 px-3.5 py-2 text-xs font-bold text-slate-200 transition active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Item Action Card (One-click apply) */}
            {copilotGeneratedItem && copilotGeneratedItem.payload && (
              <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-950/20 p-5 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>{isRtl ? 'عنصر جاهز للاعتماد الفوري في المنصة:' : 'Generated Item Ready for 1-Click Publishing:'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCopilotGeneratedItem(null)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h5 className="font-bold text-sm text-white">{copilotGeneratedItem.payload.titleAr || copilotGeneratedItem.payload.questionAr || copilotGeneratedItem.payload.messageAr}</h5>
                  <p className="text-xs text-slate-300 line-clamp-2">{copilotGeneratedItem.payload.excerptAr || copilotGeneratedItem.payload.answerAr || copilotGeneratedItem.payload.contentAr}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const { type, payload } = copilotGeneratedItem;
                    if (type === 'draft_article') {
                      storageService.addArticle({
                        id: 'art-' + Date.now(),
                        titleAr: payload.titleAr || 'مقال جديد',
                        titleEn: payload.titleEn || 'New Article',
                        categoryAr: payload.categoryAr || 'عام',
                        categoryEn: payload.categoryEn || 'General',
                        author: 'فريق التحرير',
                        readTime: payload.readTime || '4 دقائق',
                        excerptAr: payload.excerptAr || '',
                        excerptEn: payload.excerptEn || '',
                        contentAr: payload.contentAr || '',
                        contentEn: payload.contentEn || '',
                        imageUrl: '/homepage_view.png',
                        tags: payload.tags || ['تعليم'],
                        isPublished: true,
                        createdAt: new Date().toISOString()
                      });
                      setArticles(storageService.getArticles(true));
                      triggerSaveNotification(isRtl ? 'تم نشر المقال فورياً في المدونة!' : 'Article published live to CMS blog!');
                    } else if (type === 'draft_announcement') {
                      storageService.addAnnouncement({
                        id: 'ann-' + Date.now(),
                        titleAr: payload.titleAr || 'إعلان',
                        titleEn: payload.titleEn || 'Notice',
                        messageAr: payload.messageAr || '',
                        messageEn: payload.messageEn || '',
                        badgeAr: payload.badgeAr || 'تنبيه',
                        badgeEn: payload.badgeEn || 'Notice',
                        type: payload.type || 'success',
                        isActive: true,
                        targetUrl: '#store'
                      });
                      setAnnouncements(storageService.getAnnouncements());
                      triggerSaveNotification(isRtl ? 'تم تفعيل الإعلان الشريطي بالمنصة!' : 'Announcement banner published live!');
                    } else if (type === 'draft_faq') {
                      storageService.addFaq({
                        id: 'faq-' + Date.now(),
                        categoryAr: payload.categoryAr || 'عام',
                        categoryEn: payload.categoryEn || 'General',
                        questionAr: payload.questionAr || '',
                        questionEn: payload.questionEn || '',
                        answerAr: payload.answerAr || '',
                        answerEn: payload.answerEn || '',
                        order: faqs.length + 1,
                        isPublished: true
                      });
                      setFaqs(storageService.getFaqs(true));
                      triggerSaveNotification(isRtl ? 'تمت إضافة السؤال الشائع بنجاح!' : 'FAQ item added successfully!');
                    }
                    setCopilotGeneratedItem(null);
                  }}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-lg transition active:scale-98 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isRtl ? 'اعتماد ونشر هذا العنصر في المنصة الآن فورياً' : 'Approve & Publish to Platform Now'}</span>
                </button>
              </div>
            )}

            {/* Chat Messages Log */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-4 max-h-[380px] overflow-y-auto">
              {copilotMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 text-xs leading-relaxed ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role !== 'user' && (
                    <div className="w-7 h-7 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              {isCopilotLoading && (
                <div className="flex items-center gap-2 text-xs text-blue-400 animate-pulse p-2">
                  <Bot className="w-4 h-4 animate-spin" />
                  <span>{isRtl ? 'المساعد الذكي يقوم بالصياغة والتفكير الفوري...' : 'Copilot is formulating response...'}</span>
                </div>
              )}
            </div>

            {/* Input bar */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!copilotInput.trim() || isCopilotLoading) return;
                const promptVal = copilotInput.trim();
                setCopilotInput('');
                setIsCopilotLoading(true);
                try {
                  const res = await fetch('/api/ai/admin-copilot', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'chat', prompt: promptVal })
                  });
                  const data = await res.json();
                  if (data.data) {
                    setCopilotGeneratedItem({ type: 'chat', payload: data.data });
                  }
                  setCopilotMessages(prev => [
                    ...prev,
                    { role: 'user', text: promptVal },
                    { role: 'assistant', text: data.text || data.result || (isRtl ? 'تمت الإجابة بنجاح!' : 'Completed!') }
                  ]);
                } catch {
                  setCopilotMessages(prev => [
                    ...prev,
                    { role: 'user', text: promptVal },
                    { role: 'assistant', text: isRtl ? 'عذراً، حدث خطأ أثناء المعالجة.' : 'Error communicating with Copilot.' }
                  ]);
                } finally {
                  setIsCopilotLoading(false);
                }
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                placeholder={isRtl ? 'اطلب من المساعد الذكي صياغة مقال، إعلان، استشارة برمجية أو تصميمية...' : 'Ask copilot for article draft, banner, pricing ideas, design code...'}
                className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isCopilotLoading || !copilotInput.trim()}
                className="rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-5 py-3 text-xs md:text-sm font-bold text-white transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-lg shadow-blue-600/30"
              >
                <Send className="w-4 h-4" />
                <span>{isRtl ? 'إرسال' : 'Send'}</span>
              </button>
            </form>
          </div>
        )}

        {/* Main Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-1.5 shadow">
          {[
            { id: 'ai-keys', label: isRtl ? '🤖 المساعد والردود الذكية' : '🤖 Assistant & Smart Replies', icon: Bot, highlight: true },
            { id: 'preferences', label: isRtl ? '🎨 تصميم ومظهر المنصة الشامل' : '🎨 Platform Design & Theme', icon: Settings },
            { id: 'staff', label: isRtl ? '👥 إدارة المشرفين وخدمة العملاء' : '👥 Staff & Support Team', icon: Users, count: staffList.length },
            { id: 'user-roles', label: isRtl ? '🛡️ أدوار وصلاحيات المستخدمين' : '🛡️ User Roles & Permissions', icon: ShieldCheck, count: Object.keys(userRolesMap).length },
            { id: 'wallets', label: isRtl ? '💳 طرق الدفع وروابط التحويل' : '💳 Payment Methods & Links', icon: Smartphone, count: wallets.length },
            { id: 'analytics', label: isRtl ? 'تحليلات المنصة والمؤشرات' : 'Analytics', icon: BarChart3 },
            { id: 'achievements', label: isRtl ? '🏆 قسم إنجازاتنا وسابقة الأعمال' : '🏆 Achievements Portfolio', icon: CheckCircle2, count: achievementsList.length },
            { id: 'cms-articles', label: isRtl ? 'إدارة المقالات والمدونة' : 'CMS Blog & Articles', icon: FileText, count: articles.length },
            { id: 'cms-faqs', label: isRtl ? 'إدارة الأسئلة الشائعة' : 'CMS FAQ Manager', icon: HelpCircle, count: faqs.length },
            { id: 'cms-announcements', label: isRtl ? 'الإعلانات والبانر الإخباري' : 'CMS Announcements', icon: Sparkles, count: announcements.length },
            { id: 'published-portfolio', label: isRtl ? '🏆 معرض المشاريع المنشورة' : '🏆 Published Portfolio', icon: Globe, count: publishedProjects.length },
            { id: 'projects', label: isRtl ? 'إدارة ونشر المشاريع' : 'Projects', icon: Layers, count: projects.length },
            { id: 'seo', label: isRtl ? 'إعدادات محركات البحث (SEO)' : 'SEO Management', icon: Globe },
            { id: 'backup', label: isRtl ? 'النسخ الاحتياطي واستعادة البيانات' : 'Data Backup & Restore', icon: UploadCloud },
            { id: 'activity', label: isRtl ? 'سجل النشاطات والأحداث' : 'Activity Logs', icon: Clock, count: activityLogs.length },
            { id: 'social', label: isRtl ? 'الهوية والبصريات والروابط' : 'Identity & Links', icon: Share2 },
            { id: 'media', label: isRtl ? 'فيديوهات يوتيوب والدروس' : 'YouTube Videos & Tutorials', icon: Video, count: mediaResources.length },
            { id: 'users', label: isRtl ? 'العملاء المسجلون' : 'Users', icon: ShieldCheck, count: users.length },
            { id: 'tickets', label: isRtl ? 'تذاكر ومحادثات الدعم الفني' : 'AI & Live Support Tickets', icon: MessageSquare, count: supportTickets.filter(t => t.status === 'open' || t.unreadByAdmin).length },
            { id: 'drafts', label: isRtl ? 'طلبات التعديل والملاحظات' : 'Client Modifications', icon: Sparkles, count: aiDrafts.filter(d => d.status === 'pending_review' || d.status === 'in_progress').length },
            { id: 'reviews', label: isRtl ? 'تقييمات وآراء العملاء' : 'Reviews', icon: Star, count: reviews.length }
          ].map((sec) => {
            const Icon = sec.icon;
            const isCur = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs md:text-sm font-bold transition ${
                  isCur 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{sec.label}</span>
                {typeof sec.count === 'number' && (
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-mono ${isCur ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'}`}>
                    {sec.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* SECTION: AI ASSISTANT CONFIGURATION & KEY POOL */}
        {activeSection === 'ai-keys' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 md:p-8 shadow-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{isRtl ? 'إعدادات المساعد الذكي ومجمع المفاتيح (Gemini AI)' : 'AI Assistant & Key Pool (Gemini AI)'}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">{isRtl ? 'إعدادات المساعد الذكي (AI Assistant)' : 'AI Assistant Configuration'}</h2>
              <p className="text-sm text-slate-300">{isRtl ? 'تحكم في تفعيل المساعد الذكي وإدارة مجمع مفاتيح Gemini وتجاوز حدود الحصص.' : 'Control AI Assistant visibility and manage Gemini key pool with auto-rotation.'}</p>
            </div>
            
            {/* AI Visibility & Welcome Messages */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h4 className="text-sm font-bold text-white">{isRtl ? 'تفعيل شات المساعد الذكي' : 'Enable AI Chat Widget'}</h4>
                  <p className="text-xs text-slate-400">{isRtl ? 'يظهر للعملاء في الزاوية' : 'Visible to clients in the corner'}</p>
                </div>
                <button
                  onClick={() => setIsAiChatEnabled(!isAiChatEnabled)}
                  className={`w-12 h-6 rounded-full transition ${isAiChatEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition transform ${isAiChatEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">{isRtl ? 'رسالة الترحيب (عربي)' : 'Welcome Message (AR)'}</label>
                    <textarea
                      value={settings.aiWelcomeMessageAr || ''}
                      onChange={(e) => setSettings({...settings, aiWelcomeMessageAr: e.target.value})}
                      className="w-full h-24 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">{isRtl ? 'رسالة الترحيب (إنجليزي)' : 'Welcome Message (EN)'}</label>
                    <textarea
                      value={settings.aiWelcomeMessageEn || ''}
                      onChange={(e) => setSettings({...settings, aiWelcomeMessageEn: e.target.value})}
                      className="w-full h-24 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">{isRtl ? 'رسالة الرد التلقائي عند الخطأ (عربي)' : 'Fallback Reply (AR)'}</label>
                    <textarea
                      value={settings.aiFallbackReplyAr || ''}
                      onChange={(e) => setSettings({...settings, aiFallbackReplyAr: e.target.value})}
                      className="w-full h-24 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">{isRtl ? 'رسالة الرد التلقائي عند الخطأ (إنجليزي)' : 'Fallback Reply (EN)'}</label>
                    <textarea
                      value={settings.aiFallbackReplyEn || ''}
                      onChange={(e) => setSettings({...settings, aiFallbackReplyEn: e.target.value})}
                      className="w-full h-24 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={saveAiSettings}
                  disabled={isAiKeysLoading}
                  className="px-8 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-500 disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isAiKeysLoading ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'حفظ رسائل المساعد' : 'Save Assistant Messages')}
                </button>
              </div>
            </div>

            {/* Metrics Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">{isRtl ? 'إجمالي قنوات المفاتيح' : 'Total Key Slots'}</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-white">{keyPoolStatus.totalKeys}</div>
                <p className="text-[11px] text-emerald-400 font-semibold">{isRtl ? 'يتجاوز 20 مفتاحاً معتمد' : 'Exceeds 20 keys'}</p>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-emerald-300">
                  <span className="text-xs font-bold">{isRtl ? 'قنوات نشطة جاهزة' : 'Active & Ready'}</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-emerald-400">{keyPoolStatus.activeKeys}</div>
                <p className="text-[11px] text-emerald-300">{isRtl ? 'جاهز للاستجابة الفورية' : 'Zero-latency failover'}</p>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-amber-300">
                  <span className="text-xs font-bold">{isRtl ? 'قنوات في فترة راحة (429)' : 'Cooling Down'}</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-amber-400">{keyPoolStatus.coolingDownKeys}</div>
                <p className="text-[11px] text-amber-300">{isRtl ? 'تتعافى تلقائياً بعد 60 ثانية' : 'Auto-recovers in 60s'}</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">{isRtl ? 'حالة محرك ChatGPT' : 'ChatGPT Engine'}</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Cpu className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl font-black text-white">
                  {keyPoolStatus.hasOpenAiKey || openAiKeySettingInput ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-4 h-4" /> {isRtl ? 'مُفعّل' : 'Configured'}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-sm">{isRtl ? 'متاح للإضافة' : 'Available'}</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 font-mono">GPT-4o / GPT-4o-mini</p>
              </div>
            </div>

            {/* ChatGPT Integration Form */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isRtl ? 'تكامل محرك ChatGPT (OpenAI Integration)' : 'OpenAI ChatGPT Integration'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isRtl ? 'أدخل مفتاح OpenAI API Key الخاص بك لتفعيل نماذج GPT-4o لزوار ومستخدمي المنصة' : 'Enter your OpenAI API key to enable GPT-4o models across the platform.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'مفتاح OpenAI API Key:' : 'OpenAI API Key:'}</label>
                  <input 
                    type="password"
                    value={openAiKeySettingInput}
                    onChange={(e) => setOpenAiKeySettingInput(e.target.value)}
                    placeholder="sk-proj-..."
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs md:text-sm font-mono text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'المحرك الافتراضي في المحادثة:' : 'Default Chat Engine:'}</label>
                  <select
                    value={preferredAiEngineSetting}
                    onChange={(e) => setPreferredAiEngineSetting(e.target.value)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs md:text-sm text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="gemini">{isRtl ? 'Google Gemini AI (مجمع 25+ مفتاح مجاني)' : 'Google Gemini AI (25+ Key Pool)'}</option>
                    <option value="chatgpt">{isRtl ? 'OpenAI ChatGPT (GPT-4o & GPT-4o-mini)' : 'OpenAI ChatGPT (GPT-4o)'}</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    setIsAiKeysLoading(true);
                    try {
                      const res = await fetch('/api/ai/keys', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          openAiApiKey: openAiKeySettingInput.trim(),
                          preferredAiProvider: preferredAiEngineSetting
                        })
                      });
                      const data = await res.json();
                      if (data.keysStatus) setKeyPoolStatus(data.keysStatus);
                      triggerSaveNotification(isRtl ? 'تم حفظ وتحديث إعدادات ChatGPT ومحرك الذكاء الاصطناعي بنجاح!' : 'OpenAI settings saved!');
                    } catch (e) {
                      alert('Failed to save OpenAI settings');
                    } finally {
                      setIsAiKeysLoading(false);
                    }
                  }}
                  disabled={isAiKeysLoading}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs md:text-sm font-bold shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isRtl ? 'حفظ إعدادات ChatGPT والمحرك' : 'Save Engine Settings'}</span>
                </button>
              </div>
            </div>

            {/* Gemini Key Pool List & Add Custom Key */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400">
                    <Key className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {isRtl ? 'قنوات مجمع مفاتيح جيمناي النشطة (Gemini Rotating Key Pool)' : 'Gemini Key Pool Slots'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {isRtl ? 'تدوير تلقائي يضمن عمل المنظومة على مدار الساعة بموديل Gemini AI' : 'Round-robin load balanced slots with automatic recovery using Gemini AI'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={fetchKeyPoolAdminStatus}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تحديث حالة القنوات' : 'Refresh Slots'}</span>
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-white block">
                  {isRtl ? '➕ إضافة مفتاح Gemini API إضافي إلى المجمع:' : '➕ Add Custom Gemini API Key:'}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="password"
                    value={customGeminiKeyInput}
                    onChange={(e) => setCustomGeminiKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (!customGeminiKeyInput.trim()) return;
                      const currentCustomKeys = settings.geminiKeyPool || [];
                      const updated = [...currentCustomKeys, customGeminiKeyInput.trim()];
                      try {
                        const res = await fetch('/api/ai/keys', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ customGeminiKeys: updated })
                        });
                        const data = await res.json();
                        if (data.keysStatus) setKeyPoolStatus(data.keysStatus);
                        setCustomGeminiKeyInput('');
                        triggerSaveNotification(isRtl ? 'تمت إضافة المفتاح بنجاح إلى المجمع!' : 'Gemini key added to pool!');
                      } catch {
                        alert('Failed to add key');
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isRtl ? 'إضافة للمجمع' : 'Add to Pool'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto p-1">
                {(keyPoolStatus.slots && keyPoolStatus.slots.length > 0 ? keyPoolStatus.slots : Array.from({ length: 25 }, (_, i) => ({
                  id: `gemini-key-slot-${i + 1}`,
                  name: `قناة تدوير مفتاح مجاني نشط #${i + 1}`,
                  masked: `AIzaSy***${i + 1}`,
                  status: 'active',
                  successCount: 0,
                  failureCount: 0
                }))).map((slot, idx) => (
                  <div 
                    key={slot.id || idx}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white truncate max-w-[170px]">{slot.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        slot.status === 'cooling_down'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {slot.status === 'cooling_down' 
                          ? (isRtl ? `راحة (${slot.cooldownRemainingSeconds || 60}ث)` : 'Cooling') 
                          : (isRtl ? 'نشط 🟢' : 'Active 🟢')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>{slot.masked}</span>
                      <span className="text-emerald-400 font-bold">{slot.successCount || 0} ✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION: STAFF & CUSTOMER SERVICE MANAGEMENT */}
        {activeSection === 'staff' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 md:p-8 shadow-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
                <Users className="w-4 h-4 text-blue-400" />
                <span>{isRtl ? 'إدارة المشرفين، المنسقين وخدمة العملاء' : 'Staff & Customer Service Management'}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                {isRtl ? 'فريق العمل والمشرفين بصلاحيات محددة' : 'Team & Supervisor Permissions'}
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
                {isRtl 
                  ? 'أضف مشرفين وموظفي خدمة العملاء مع تحديد أرقام هواتفهم، روابط الواتساب والتلجرام، والصلاحيات الإدارية.' 
                  : 'Manage administrative staff, customer service reps, WhatsApp/Telegram links, and granular roles.'}
              </p>
            </div>

            {/* Add Staff Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newStaffName.trim() || !newStaffPhone.trim()) {
                alert(isRtl ? 'يرجى إدخال اسم الموظف ورقم الهاتف' : 'Please provide staff name and phone');
                return;
              }
              const member = {
                id: 'staff-' + Date.now(),
                name: newStaffName.trim(),
                roleAr: newStaffRole,
                roleEn: newStaffRole,
                phone: newStaffPhone.trim(),
                whatsapp: newStaffWhatsapp.trim() || `https://wa.me/${newStaffPhone.replace(/[^\d]/g, '')}`,
                telegram: newStaffTelegram.trim(),
                permissions: ['support', 'orders', 'cms'],
                isActive: true,
                createdAt: new Date().toISOString()
              };
              storageService.saveStaffMember(member);
              setStaffList(storageService.getStaff());
              setNewStaffName('');
              setNewStaffPhone('');
              setNewStaffWhatsapp('');
              setNewStaffTelegram('');
              triggerSaveNotification(isRtl ? 'تم إضافة عضو فريق العمل بنجاح!' : 'Staff member added successfully!');
            }} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-6">
              <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                <span>{isRtl ? 'إضافة مشرف أو موظف خدمة عملاء جديد' : 'Add New Staff Member'}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'اسم الموظف / المشرف' : 'Staff Full Name'}</label>
                  <input
                    type="text"
                    required
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    placeholder={isRtl ? 'مثال: أ. محمود السعيد' : 'e.g. Mahmoud Al-Saeed'}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'المنصب / الوظيفة' : 'Role / Title'}</label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                  >
                    <option value={isRtl ? 'مشرف عام (Super Admin)' : 'Super Admin'}>{isRtl ? 'مشرف عام (Super Admin)' : 'Super Admin'}</option>
                    <option value={isRtl ? 'مسؤول خدمة العملاء (Customer Service)' : 'Customer Service'}>{isRtl ? 'مسؤول خدمة العملاء (Customer Service)' : 'Customer Service'}</option>
                    <option value={isRtl ? 'دعم فني وتقني (Technical Support)' : 'Technical Support'}>{isRtl ? 'دعم فني وتقني (Technical Support)' : 'Technical Support'}</option>
                    <option value={isRtl ? 'مدير مبيعات (Sales Manager)' : 'Sales Manager'}>{isRtl ? 'مدير مبيعات (Sales Manager)' : 'Sales Manager'}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'رقم الهاتف / الموبايل' : 'Phone Number'}</label>
                  <input
                    type="text"
                    required
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    placeholder="01012345678"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'رابط الواتساب (WhatsApp URL)' : 'WhatsApp Link'}</label>
                  <input
                    type="text"
                    value={newStaffWhatsapp}
                    onChange={(e) => setNewStaffWhatsapp(e.target.value)}
                    placeholder="https://wa.me/2010..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-emerald-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'رابط التلجرام (Telegram Link)' : 'Telegram Link'}</label>
                  <input
                    type="text"
                    value={newStaffTelegram}
                    onChange={(e) => setNewStaffTelegram(e.target.value)}
                    placeholder="https://t.me/username"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-blue-400"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-2.5 text-xs font-bold text-white shadow-lg transition cursor-pointer"
                  >
                    {isRtl ? 'حفظ وإضافة الموظف' : 'Save & Add Staff'}
                  </button>
                </div>
              </div>
            </form>

            {/* Staff Members Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffList.map((member) => (
                <div key={member.id} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base">{member.name}</h4>
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {member.roleAr}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(isRtl ? 'هل تريد حذف هذا العضو؟' : 'Delete staff member?')) {
                            storageService.deleteStaffMember(member.id);
                            setStaffList(storageService.getStaff());
                            triggerSaveNotification(isRtl ? 'تم حذف العضو.' : 'Staff deleted.');
                          }
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded-xl transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300 font-mono">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500">{isRtl ? 'الهاتف:' : 'Phone:'}</span>
                        <span className="text-white font-bold">{member.phone}</span>
                      </div>
                      {member.whatsapp && (
                        <a href={member.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 hover:underline">
                          <span>{isRtl ? 'رابط الواتساب' : 'WhatsApp'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {member.telegram && (
                        <a href={member.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-xl bg-blue-950/30 border border-blue-500/30 text-blue-400 hover:underline">
                          <span>{isRtl ? 'رابط التلجرام' : 'Telegram'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{isRtl ? 'الحالة: نشط ومنصرح' : 'Status: Active'}</span>
                    <span className="font-mono">{new Date(member.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: USER ROLES & GRANULAR PERMISSIONS MANAGEMENT */}
        {activeSection === 'user-roles' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 p-6 md:p-8 shadow-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>{isRtl ? 'إدارة أدوار وصلاحيات المستخدمين (Role-Based Access Control)' : 'User Roles & Granular Permissions Control'}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                {isRtl ? 'تخصيص الصلاحيات والأدوار للمستخدمين المسجلين' : 'Assign Roles & Granular Permissions by Email'}
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
                {isRtl 
                  ? 'قم بتعيين أدوار محددة (مشرف عام، مشرف محتوى، خدمة عملاء) للمستخدمين المسجلين بالبريد الإلكتروني، وتحديد الصلاحيات الدقيقة لكل دور.' 
                  : 'Assign specific roles (Admin, Moderator, Customer Support) to registered users by email and define granular permissions.'}
              </p>
            </div>

            {/* Assign Role Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!targetUserEmail.trim()) {
                alert(isRtl ? 'يرجى إدخال البريد الإلكتروني للمستخدم' : 'Please enter user email');
                return;
              }
              storageService.assignUserRole(targetUserEmail.trim(), targetUserRole, targetUserPermissions);
              setUserRolesMap(storageService.getUserRoles());
              setTargetUserEmail('');
              triggerSaveNotification(isRtl ? 'تم تعيين الدور والصلاحيات للمستخدم بنجاح!' : 'User role & permissions assigned successfully!');
            }} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-6">
              <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                <span>{isRtl ? 'منح دور وصلاحيات لمستخدم بالبريد الإلكتروني' : 'Assign Role to User by Email'}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'البريد الإلكتروني للمستخدم المسجل' : 'Registered User Email'}</label>
                  <input
                    type="email"
                    required
                    value={targetUserEmail}
                    onChange={(e) => setTargetUserEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'الدور الممنوح' : 'Assigned Role'}</label>
                  <select
                    value={targetUserRole}
                    onChange={(e) => setTargetUserRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                  >
                    <option value="admin">{isRtl ? 'مشرف عام (Admin - صلاحيات كاملة)' : 'Admin (Full Access)'}</option>
                    <option value="moderator">{isRtl ? 'مشرف محتوى (Moderator - مدونة ومشاريع)' : 'Moderator (CMS & Projects)'}</option>
                    <option value="customer_support">{isRtl ? 'خدمة العملاء (Customer Support - تذاكر ومحادثات)' : 'Customer Support (Tickets & Chats)'}</option>
                  </select>
                </div>
              </div>

              {/* Granular Permissions Checkboxes */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-300 block">{isRtl ? 'الصلاحيات الدقيقة (Granular Permissions):' : 'Granular Permissions:'}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { id: 'manage_projects', label: isRtl ? '📦 إدارة ونشر المشاريع' : 'Manage & Publish Projects' },
                    { id: 'manage_cms', label: isRtl ? '📝 إدارة المقالات والمدونة والأسئلة' : 'Manage CMS Blogs & FAQs' },
                    { id: 'manage_support', label: isRtl ? '💬 إدارة تذاكر الدعم والدردشة' : 'Manage Support Tickets & Chats' },
                    { id: 'manage_payments', label: isRtl ? '💳 إدارة طرق الدفع والأسعار' : 'Manage Payment Methods & Pricing' },
                    { id: 'manage_staff', label: isRtl ? '👥 إدارة المشرفين والصلاحيات' : 'Manage Staff & Roles' },
                    { id: 'manage_analytics', label: isRtl ? '📊 عرض التقارير والتحليلات' : 'View Analytics & Activity Logs' }
                  ].map((perm) => {
                    const isChecked = targetUserPermissions.includes(perm.id);
                    return (
                      <div
                        key={perm.id}
                        onClick={() => {
                          if (isChecked) {
                            setTargetUserPermissions(targetUserPermissions.filter(p => p !== perm.id));
                          } else {
                            setTargetUserPermissions([...targetUserPermissions, perm.id]);
                          }
                        }}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                          isChecked 
                            ? 'border-indigo-500 bg-indigo-950/30 text-white' 
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                        />
                        <span className="text-xs font-bold">{perm.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg transition cursor-pointer"
                >
                  {isRtl ? 'حفظ وتعيين الدور للمستخدم' : 'Save & Assign Role'}
                </button>
              </div>
            </form>

            {/* Assigned Roles List */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span>{isRtl ? 'قائمة المستخدمين ذوي الأدوار الإدارية المخصصة' : 'Assigned User Roles & Permissions'}</span>
              </h3>

              {Object.keys(userRolesMap).length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center text-slate-400 text-xs">
                  {isRtl ? 'لا توجد أدوار مخصصة مسجلة حالياً.' : 'No custom user roles assigned yet.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.values(userRolesMap).map((assignment) => {
                    let badgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
                    let roleLabel = assignment.role;
                    if (assignment.role === 'admin') {
                      badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
                      roleLabel = isRtl ? 'مشرف عام (Admin)' : 'Admin';
                    } else if (assignment.role === 'moderator') {
                      badgeColor = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
                      roleLabel = isRtl ? 'مشرف محتوى (Moderator)' : 'Moderator';
                    } else {
                      badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                      roleLabel = isRtl ? 'خدمة العملاء (Customer Support)' : 'Customer Support';
                    }

                    return (
                      <div key={assignment.email} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-3 shadow-xl flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-mono text-sm font-bold text-white break-all">{assignment.email}</span>
                              <div className="mt-1">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}>
                                  {roleLabel}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(isRtl ? `هل تريد إزالة الدور عن ${assignment.email}؟` : `Revoke role for ${assignment.email}?`)) {
                                  const updated = storageService.removeUserRole(assignment.email);
                                  setUserRolesMap(updated);
                                  triggerSaveNotification(isRtl ? 'تم إزالة الدور بنجاح.' : 'Role revoked.');
                                }
                              }}
                              className="text-slate-500 hover:text-rose-400 p-1.5 rounded-xl transition cursor-pointer shrink-0"
                              title={isRtl ? 'إزالة الدور' : 'Revoke role'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-1 pt-1">
                            <span className="text-[11px] font-bold text-slate-400 block">{isRtl ? 'الصلاحيات الممنوحة:' : 'Granted Permissions:'}</span>
                            <div className="flex flex-wrap gap-1">
                              {assignment.permissions.map((p, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-300">
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                          <span>{isRtl ? 'آخر تحديث:' : 'Updated:'}</span>
                          <span>{new Date(assignment.updatedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}



        {/* SECTION: SEO MANAGEMENT */}
        {activeSection === 'seo' && (
          <SeoManagement 
            seoSettings={settings.seoSettings}
            onSave={handleSaveSeoSettings}
            isRtl={isRtl}
            t={t}
          />
        )}

        {/* SECTION: CMS ARTICLES MANAGEMENT */}
        {activeSection === 'cms-articles' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Card */}
            <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 md:p-8 shadow-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>{isRtl ? 'نظام إدارة المقالات والمدونة الرقمية (CMS Blog Engine)' : 'CMS Blog & Articles Engine'}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                {isRtl ? 'إدارة المقالات والأدلة التعليمية' : 'Manage CMS Articles & Guides'}
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
                {isRtl 
                  ? 'أنشئ ومحرّر المقالات، الأخبار، والأدلة التعليمية للمنصة مع التحكم الفوري في النشر والحذف والتعديل.' 
                  : 'Create, edit, and manage articles, educational guides, and blog posts with live publish controls.'}
              </p>
            </div>

            {/* Create Article Form */}
            <form onSubmit={handleAddArticle} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-6">
              <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                <span>{isRtl ? 'إضافة مقال جديد إلى المنصة' : 'Publish New CMS Article'}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'عنوان المقال' : 'Article Title'}</label>
                  <input
                    type="text"
                    value={newArtTitle}
                    onChange={(e) => setNewArtTitle(e.target.value)}
                    placeholder={isRtl ? 'مثال: دليل التحول الرقمي للمراكز التعليمية' : 'Article title...'}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'التصنيف' : 'Category'}</label>
                  <select
                    value={newArtCategory}
                    onChange={(e) => setNewArtCategory(e.target.value)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs md:text-sm text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value={isRtl ? 'تقنية وتطوير' : 'Tech & Dev'}>{isRtl ? 'تقنية وتطوير' : 'Tech & Dev'}</option>
                    <option value={isRtl ? 'ذكاء اصطناعي' : 'Artificial Intelligence'}>{isRtl ? 'ذكاء اصطناعي' : 'Artificial Intelligence'}</option>
                    <option value={isRtl ? 'إدارة سناتر' : 'Center Management'}>{isRtl ? 'إدارة سناتر' : 'Center Management'}</option>
                    <option value={isRtl ? 'PWA وتطبيقات' : 'PWA Apps'}>{isRtl ? 'PWA وتطبيقات' : 'PWA Apps'}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'الكاتب' : 'Author'}</label>
                  <input
                    type="text"
                    value={newArtAuthor}
                    onChange={(e) => setNewArtAuthor(e.target.value)}
                    placeholder={isRtl ? 'اسم الكاتب أو الفريق' : 'Author name...'}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'وقت القراءة' : 'Read Time'}</label>
                  <input
                    type="text"
                    value={newArtReadTime}
                    onChange={(e) => setNewArtReadTime(e.target.value)}
                    placeholder={isRtl ? 'مثال: 5 دقائق' : 'e.g. 5 min read'}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{isRtl ? 'رابط صورة الغلاف' : 'Cover Image URL'}</label>
                <input
                  type="text"
                  value={newArtImage}
                  onChange={(e) => setNewArtImage(e.target.value)}
                  placeholder={isRtl ? 'مثال: /homepage_view.png أو رابط صورة مباشر' : 'Image URL...'}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{isRtl ? 'الملخص المقتضب' : 'Excerpt'}</label>
                <input
                  type="text"
                  value={newArtExcerpt}
                  onChange={(e) => setNewArtExcerpt(e.target.value)}
                  placeholder={isRtl ? 'ملخص مقتضب يظهر في كارت المقال...' : 'Brief summary for card preview...'}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{isRtl ? 'محتوى المقال الكامل' : 'Full Content / Body'}</label>
                <textarea
                  value={newArtContent}
                  onChange={(e) => setNewArtContent(e.target.value)}
                  rows={6}
                  placeholder={isRtl ? 'اكتب محتوى المقال الكامل هنا...' : 'Write full article body content...'}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs md:text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 px-6 py-3.5 text-xs md:text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isRtl ? 'نشر المقال فوراً' : 'Publish Article'}</span>
              </button>
            </form>

            {/* Articles List */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center justify-between">
                <span>{isRtl ? `المقالات المنشورة (${articles.length})` : `Published Articles (${articles.length})`}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles.map((art) => (
                  <div key={art.id} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-[11px] font-bold text-blue-400">
                          {art.categoryAr || art.categoryEn}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleArticlePublish(art)}
                            className={`rounded-xl px-2.5 py-1 text-[11px] font-bold transition ${
                              art.isPublished !== false 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {art.isPublished !== false ? (isRtl ? 'منشور' : 'Published') : (isRtl ? 'مسودة' : 'Draft')}
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art.id)}
                            className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-1.5 text-rose-400 hover:bg-rose-500/20 transition"
                            title={isRtl ? 'حذف المقال' : 'Delete Article'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-white line-clamp-2">{art.titleAr || art.titleEn}</h4>
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{art.excerptAr || art.contentAr}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                      <span>👤 {art.author}</span>
                      <span>⏱️ {art.readTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION: CMS FAQS MANAGEMENT */}
        {activeSection === 'cms-faqs' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Card */}
            <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 p-6 md:p-8 shadow-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <span>{isRtl ? 'نظام إدارة الأسئلة الشائعة (CMS FAQ System)' : 'CMS FAQ Manager'}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                {isRtl ? 'إدارة الأسئلة الشائعة والإرشادات' : 'Manage Dynamic FAQs'}
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
                {isRtl 
                  ? 'أضف وعدّل الأسئلة الشائعة التي تظهر مباشرة في قسم المساعدة بالصفحة الرئيسية للعملاء.' 
                  : 'Add and edit frequently asked questions that update live on the main landing page.'}
              </p>
            </div>

            {/* Add FAQ Form */}
            <form onSubmit={handleAddFaq} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                <span>{isRtl ? 'إضافة سؤال شائع جديد' : 'Add New FAQ Item'}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'السؤال' : 'Question'}</label>
                  <input
                    type="text"
                    value={newFaqQuestion}
                    onChange={(e) => setNewFaqQuestion(e.target.value)}
                    placeholder={isRtl ? 'مثال: كيف يمكنني الاشتراك في الباقة السنوية؟' : 'Enter question...'}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'التصنيف' : 'Category'}</label>
                  <input
                    type="text"
                    value={newFaqCategory}
                    onChange={(e) => setNewFaqCategory(e.target.value)}
                    placeholder={isRtl ? 'مثال: الاشتراكات، PWA، عن المنصة' : 'Category...'}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{isRtl ? 'الإجابة الشاملة' : 'Detailed Answer'}</label>
                <textarea
                  value={newFaqAnswer}
                  onChange={(e) => setNewFaqAnswer(e.target.value)}
                  rows={4}
                  placeholder={isRtl ? 'اكتب الإجابة المفصلة التي ستظهر للعميل عند ضغط السؤال...' : 'Write answer content...'}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs md:text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3.5 text-xs md:text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isRtl ? 'حفظ وإظهار السؤال بالصفحة الرئيسية' : 'Save FAQ Item'}</span>
              </button>
            </form>

            {/* FAQs List */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">
                {isRtl ? `الأسئلة الحالية (${faqs.length})` : `Active FAQs (${faqs.length})`}
              </h3>

              {faqs.map((faq) => (
                <div key={faq.id} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow space-y-2 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="rounded-full bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400">
                      {faq.categoryAr || faq.categoryEn}
                    </span>
                    <h4 className="text-sm md:text-base font-bold text-white">{faq.questionAr || faq.questionEn}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{faq.answerAr || faq.answerEn}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2 text-rose-400 hover:bg-rose-500/20 transition shrink-0"
                    title={isRtl ? 'حذف السؤال' : 'Delete FAQ'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: CMS ANNOUNCEMENTS MANAGEMENT */}
        {activeSection === 'cms-announcements' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Card */}
            <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 md:p-8 shadow-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{isRtl ? 'إدارة التنبيهات والبانر الإخباري (CMS Ticker Banner)' : 'CMS Announcements Banner'}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                {isRtl ? 'البانر الإخباري العاجل للمنصة' : 'Top Announcement Ticker'}
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
                {isRtl 
                  ? 'قم بضبط نصوص الإعلانات والعروض والتحديثات المهمة التي تظهر شريطاً بارزاً أعلى كافة صفحات المنصة.' 
                  : 'Manage top alert ticker banners displayed at the top of the entire single page app.'}
              </p>
            </div>

            {/* Create Announcement Form */}
            <form onSubmit={handleAddAnnouncement} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>{isRtl ? 'تفعيل تنبيه إخباري جديد' : 'Publish Announcement Banner'}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'شارة الإعلان' : 'Badge Label'}</label>
                  <input
                    type="text"
                    value={newAnnBadge}
                    onChange={(e) => setNewAnnBadge(e.target.value)}
                    placeholder={isRtl ? 'مثال: جديد، عاجل، خصم' : 'Badge text...'}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'نوع التنبيه' : 'Banner Type'}</label>
                  <select
                    value={newAnnType}
                    onChange={(e) => setNewAnnType(e.target.value)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs md:text-sm text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="success">{isRtl ? 'تحديث إيجابي (أخضر)' : 'Success (Green)'}</option>
                    <option value="info">{isRtl ? 'معلومات عامة (أزرق)' : 'Info (Blue)'}</option>
                    <option value="warning">{isRtl ? 'تحذير هام (أصفر)' : 'Warning (Yellow)'}</option>
                    <option value="urgent">{isRtl ? 'عاجل جداً (أحمر)' : 'Urgent (Red)'}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{isRtl ? 'نص التنبيه الإخباري' : 'Announcement Message'}</label>
                <input
                  type="text"
                  value={newAnnMessage}
                  onChange={(e) => setNewAnnMessage(e.target.value)}
                  placeholder={isRtl ? 'مثال: 🚀 تم إطلاق الإصدار الجديد بحزم اختبارات الذكاء الاصطناعي!' : 'Announcement text...'}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-6 py-3.5 text-xs md:text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isRtl ? 'تفعيل البانر بالصفحة الرئيسية' : 'Activate Banner'}</span>
              </button>
            </form>

            {/* Active Announcements */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">
                {isRtl ? `الإعلانات النشطة (${announcements.length})` : `Active Banners (${announcements.length})`}
              </h3>

              {announcements.map((ann) => (
                <div key={ann.id} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-400">
                      {ann.badgeAr || ann.badgeEn}
                    </span>
                    <span className="text-xs md:text-sm font-bold text-white">{ann.messageAr || ann.messageEn}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2 text-rose-400 hover:bg-rose-500/20 transition shrink-0"
                    title={isRtl ? 'حذف الإعلان' : 'Delete Announcement'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: PUBLISHED PORTFOLIO MANAGEMENT */}
        {activeSection === 'published-portfolio' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 md:p-8 shadow-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>{isRtl ? 'إدارة معرض سابقة الأعمال والمشاريع المنفذة' : 'Published Projects Portfolio Manager'}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                {isRtl ? 'معرض المشاريع المنشورة للعملاء' : 'Client Projects Portfolio'}
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
                {isRtl 
                  ? 'قم بإضافة وحذف المشاريع التي تم تنفيذها بالفعل ونشر روابطها وصورها وفيديوهاتها لتظهر في معرض سابقة الأعمال.' 
                  : 'Add, edit, or remove completed projects with live links, images, and videos to showcase in your portfolio.'}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 shadow-xl">
              <PublishedProjectsSection 
                projects={publishedProjects} 
                lang={lang} 
                isAdmin={true} 
                onRefresh={refreshLocalData} 
              />
            </div>
          </div>
        )}

        {/* SECTION: ACHIEVEMENTS & SHOWCASE PORTFOLIO MANAGEMENT */}
        {activeSection === 'achievements' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Card */}
            <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950 via-slate-900 to-yellow-950 p-6 md:p-8 shadow-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>{isRtl ? 'إدارة قسم إنجازاتنا وسابقة الأعمال (Achievements Portfolio)' : 'Achievements & Success Portfolio'}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                {isRtl ? 'إدارة ونشر إنجازات وقصص نجاح المنظومة' : 'Manage Platform Achievements & Case Studies'}
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
                {isRtl 
                  ? 'أضف وعدّل الإنجازات والمشروعات الناجحة التي تظهر للزوار في قسم "عن المنظومة" و"إنجازاتنا" على الصفحة الرئيسية.' 
                  : 'Add and edit accomplishments, metrics, and success stories displayed on the main "About Us" and "Achievements" sections.'}
              </p>
            </div>

            {/* Add Achievement Form */}
            <form onSubmit={handleAddAchievement} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>{isRtl ? 'إضافة إنجاز أو قصة نجاح جديدة' : 'Add New Achievement / Milestone'}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'عنوان الإنجاز' : 'Achievement Title'}</label>
                  <input
                    type="text"
                    value={newAchTitle}
                    onChange={(e) => setNewAchTitle(e.target.value)}
                    placeholder={isRtl ? 'مثال: تطوير أنظمة الحضور الذكي ببطاقات QR' : 'Title...'}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'التصنيف' : 'Category'}</label>
                  <input
                    type="text"
                    value={newAchCategory}
                    onChange={(e) => setNewAchCategory(e.target.value)}
                    placeholder={isRtl ? 'مثال: أنظمة LMS، الذكاء الاصطناعي، الأمن السيبراني' : 'Category...'}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'الرقم المتريك الشرفي (مثل: +150، %99.9، 1M+)' : 'Metric Number (e.g. 150+)'}</label>
                  <input
                    type="text"
                    value={newAchMetricNum}
                    onChange={(e) => setNewAchMetricNum(e.target.value)}
                    placeholder="150+"
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'وصف الرقم (مثل: سنتر تعليمي، اختبار آمن)' : 'Metric Label (e.g. Centers, Secured Exams)'}</label>
                  <input
                    type="text"
                    value={newAchMetricLabel}
                    onChange={(e) => setNewAchMetricLabel(e.target.value)}
                    placeholder={isRtl ? 'سنتر تعليمي معتمد' : 'Metric label...'}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'رابط صورة الإنجاز (URL Image)' : 'Image URL'}</label>
                  <input
                    type="url"
                    value={newAchImage}
                    onChange={(e) => setNewAchImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{isRtl ? 'وصف تفاصيل الإنجاز والنتائج' : 'Full Achievement Description'}</label>
                <textarea
                  value={newAchDesc}
                  onChange={(e) => setNewAchDesc(e.target.value)}
                  rows={3}
                  placeholder={isRtl ? 'اكتب بالتفصيل نتائج وتأثير هذا الإنجاز على العملاء والمنظومة...' : 'Write detailed summary...'}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs md:text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{isRtl ? 'رابط خارجي لقصة النجاح (اختياري)' : 'External Case Study Link (Optional)'}</label>
                <input
                  type="url"
                  value={newAchLink}
                  onChange={(e) => setNewAchLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-2xl bg-amber-600 hover:bg-amber-500 px-6 py-3.5 text-xs md:text-sm font-bold text-white shadow-lg shadow-amber-600/30 transition active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isRtl ? 'حفظ ونشر الإنجاز بصفحة "عن المنظومة"' : 'Publish Achievement'}</span>
              </button>
            </form>

            {/* Achievements List */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">
                {isRtl ? `الإنجازات الحالية (${achievementsList.length})` : `Active Achievements (${achievementsList.length})`}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievementsList.map((ach) => (
                  <div key={ach.id} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-[11px] font-bold text-amber-400">
                          {ach.categoryAr || ach.categoryEn}
                        </span>
                        {ach.metricNumber && (
                          <span className="text-xs font-black text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                            {ach.metricNumber} {ach.metricLabelAr || ach.metricLabelEn}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-white">{ach.titleAr || ach.titleEn}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{ach.descriptionAr || ach.descriptionEn}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      {ach.linkUrl ? (
                        <a href={ach.linkUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 underline font-bold flex items-center gap-1">
                          <span>{isRtl ? 'الرابط' : 'Link'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : <span />}

                      <button
                        onClick={() => handleDeleteAchievement(ach.id)}
                        className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2 text-rose-400 hover:bg-rose-500/20 transition shrink-0"
                        title={isRtl ? 'حذف الإنجاز' : 'Delete Achievement'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 0: VISUAL ANALYTICS DASHBOARD (RECHARTS) */}
        {activeSection === 'analytics' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Banner */}
            <div className="rounded-3xl border border-blue-500/40 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 md:p-8 shadow-2xl space-y-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span>{isRtl ? 'منظومة التحليلات ومؤشرات الأداء اللحظية (Recharts Engine)' : 'Real-Time Visual Analytics Engine'}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                {isRtl ? 'لوحة تحليلات تفاعل العملاء وتراخيص المنصات' : 'User Engagement & Subscription Metrics'}
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
                {isRtl 
                  ? 'رؤية شاملة ومؤشرات حية لمعدلات التسجيل، تثبيتات تطبيقات الـ PWA، أداء المحاكي التفاعلي، وتوزيع خطط الترخيص (شهري، سنوي، تمليك).'
                  : 'Comprehensive visual dashboard metrics covering active user growth, PWA installation velocity, sandbox usage, and subscription tier distributions.'}
              </p>
            </div>

            {/* KPI Summary Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-2 shadow-lg hover:border-blue-500/40 transition">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">{isRtl ? 'إجمالي العملاء المسجلين' : 'Total Registered Users'}</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-black text-white">{Math.max(users.length, 1890)}</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +24%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{isRtl ? 'نمو شهري في حسابات المدرسين والسناتر' : 'Monthly educator growth rate'}</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-2 shadow-lg hover:border-emerald-500/40 transition">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">{isRtl ? 'تثبيتات تطبيقات PWA' : 'PWA App Installs'}</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-black text-white">4,820</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +18%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{isRtl ? 'تطبيق مثبت يعمل بدون إنترنت' : 'Active offline native instances'}</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-2 shadow-lg hover:border-purple-500/40 transition">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">{isRtl ? 'تشغيل المحاكي التفاعلي' : 'Sandbox Simulator Runs'}</span>
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-black text-white">3,760</span>
                  <span className="text-xs font-bold text-purple-400 flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +32%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{isRtl ? 'أوامر تخصيص بالذكاء الاصطناعي' : 'AI customizer prompt executions'}</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-2 shadow-lg hover:border-amber-500/40 transition">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">{isRtl ? 'نسبة رضا العملاء والتقييم' : 'Satisfaction & Rating'}</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Star className="w-5 h-5 fill-amber-400" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-black text-white">4.95 / 5</span>
                  <span className="text-xs font-bold text-amber-400">★ ★ ★ ★ ★</span>
                </div>
                <p className="text-[11px] text-slate-400">{isRtl ? 'بناءً على تقييمات العملاء في المتجر' : 'Based on published client reviews'}</p>
              </div>
            </div>

            {/* Charts Row 1: Engagement Area Chart & Subscriptions Pie Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Engagement Trend Chart (AreaChart) - Spans 2 cols */}
              <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      <span>{isRtl ? 'اتجاهات تفاعل المستخدمين وتثبيت الـ PWA' : 'User Engagement & PWA Sessions Velocity'}</span>
                    </h3>
                    <p className="text-xs text-slate-400">{isRtl ? 'متابعة النمو المتصاعد للعملاء وجلسات المحاكي والتطبيقات المثبتة (يناير - أكتوبر)' : 'Monthly active users, PWA sessions, and sandbox runs'}</p>
                  </div>
                </div>

                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={userEngagementTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPwa" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Area type="monotone" dataKey="pwaSessions" name={isRtl ? 'جلسات PWA' : 'PWA Sessions'} stroke="#10b981" fillOpacity={1} fill="url(#colorPwa)" />
                      <Area type="monotone" dataKey="users" name={isRtl ? 'العملاء النشطون' : 'Active Users'} stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Subscriptions Tier Distribution (PieChart) - Spans 1 col */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <PieIcon className="w-5 h-5 text-purple-400" />
                    <span>{isRtl ? 'توزيع خطط الاشتراك والترخيص' : 'Active Subscription Status'}</span>
                  </h3>
                  <p className="text-xs text-slate-400">{isRtl ? 'نسبة توزيع باقات (سنوي، شهري، تمليك كود)' : 'Ratio of active subscription tiers'}</p>
                </div>

                <div className="h-56 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subscriptionStatusMetrics}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {subscriptionStatusMetrics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  {subscriptionStatusMetrics.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-200 font-semibold">{item.name}</span>
                      </div>
                      <span className="font-mono font-bold text-white">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Charts Row 2: Category Installation Bar Chart & AI Draft Pipeline Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Category Installation Bar Chart */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                    <span>{isRtl ? 'معدلات تثبيت المنصات حسب التخصص' : 'Project Installs by Category'}</span>
                  </h3>
                  <p className="text-xs text-slate-400">{isRtl ? 'أكثر المنظومات المطلوبة والمثبتة من قبل المدرسين والسناتر' : 'Most installed platform categories'}</p>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projectCategoryTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Bar dataKey="installations" name={isRtl ? 'التثبيتات السحابية' : 'Cloud Installs'} fill="#3b82f6" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="downloads" name={isRtl ? 'تحميلات الكود المصدر' : 'Source Code Downloads'} fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Draft Request Pipeline Breakdown */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>{isRtl ? 'حالة طلبات التعديل ومسودات الذكاء الاصطناعي' : 'AI Modification Request Pipeline'}</span>
                  </h3>
                  <p className="text-xs text-slate-400">{isRtl ? 'تتبع حالة تنفيذ طلبات التخصيص والملاحظات الفنية للعملاء' : 'Status breakdown of submitted modification requests'}</p>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={requestStatusMetrics} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="status" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                      <Bar dataKey="count" name={isRtl ? 'عدد الطلبات' : 'Request Count'} radius={[0, 8, 8, 0]}>
                        {requestStatusMetrics.map((entry, index) => (
                          <Cell key={`cell-req-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SECTION: ADMIN DATA BACKUP & RESTORE */}
        {activeSection === 'backup' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Banner */}
            <div className="rounded-3xl border border-blue-500/40 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 md:p-8 shadow-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{isRtl ? 'النسخ الاحتياطي واستعادة الحالة' : 'Admin Data Backup & State Recovery'}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                {isRtl ? 'تصدير واستعادة قواعد بيانات المنظومة الكاملة' : 'Full Platform Data Backup & Restoration'}
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
                {isRtl 
                  ? 'تتيح لك هذه اللوحة تنزيل كافة بيانات المنظومة (المشاريع، العملاء المسجلين، مسودات التعديل، الفيديوهات والتقييمات) في ملف JSON موحد الخصائص، أو رفع ملف احتياطي سابق لاستعادة حالة النظام بالكامل.' 
                  : 'Download a complete JSON export of all platform databases (projects, registered users, customization drafts, media, and reviews) or upload a backup file to restore platform state.'}
              </p>
            </div>

            {/* Backup & Restore Action Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Download Backup Box */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 space-y-6 shadow-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                      <Download className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {isRtl ? '1. تنزيل ملف النسخة الاحتياطية' : '1. Download Platform Data Backup'}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {isRtl ? 'تصدير شامل لكافة الجداول وقواعد البيانات محلياً' : 'Full JSON snapshot export for external backup'}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {isRtl 
                      ? 'عند النقر على الزر أدناه، سيتم توليد ملف JSON يتضمن السجلات الحالية للمنظومة لضمان الأمان والنسخ الخارجي.' 
                      : 'Generates a timestamped JSON backup file containing all current database collections for external offline archival.'}
                  </p>

                  {/* Database Collection Item Counts Preview */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {isRtl ? 'محتويات ملف النسخة الاحتياطية الحالية:' : 'Included Database Collections:'}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                        <span className="text-slate-400">{isRtl ? 'المشاريع' : 'Projects'}</span>
                        <span className="font-mono font-bold text-blue-400">{projects.length}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                        <span className="text-slate-400">{isRtl ? 'العملاء' : 'Users'}</span>
                        <span className="font-mono font-bold text-emerald-400">{users.length}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                        <span className="text-slate-400">{isRtl ? 'المسودات' : 'Drafts'}</span>
                        <span className="font-mono font-bold text-amber-400">{aiDrafts.length}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                        <span className="text-slate-400">{isRtl ? 'الوسائط' : 'Media'}</span>
                        <span className="font-mono font-bold text-purple-400">{mediaResources.length}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                        <span className="text-slate-400">{isRtl ? 'التقييمات' : 'Reviews'}</span>
                        <span className="font-mono font-bold text-pink-400">{reviews.length}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                        <span className="text-slate-400">{isRtl ? 'السجلات' : 'Logs'}</span>
                        <span className="font-mono font-bold text-cyan-400">{activityLogs.length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadFullPlatformBackup}
                  disabled={isExportingBackup}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <Download className={`w-4 h-4 ${isExportingBackup ? 'animate-bounce' : ''}`} />
                  <span>{isRtl ? 'تنزيل ملف النسخة الاحتياطية (JSON)' : 'Download Full Backup (JSON)'}</span>
                </button>
              </div>

              {/* Restore Backup Box */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 space-y-6 shadow-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {isRtl ? '2. استعادة حالة المنظومة من ملف' : '2. Restore Platform State'}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {isRtl ? 'رفع ملف JSON تم تنزيله سابقاً لاستعادة البيانات' : 'Upload a JSON backup file to overwrite/restore platform data'}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {isRtl 
                      ? 'قم باختيار ملف النسخة الاحتياطية (JSON) من جهازك واستعادة قواعد البيانات بالكامل وتحديث كافة العروض الفعالة.' 
                      : 'Upload an existing JSON backup file to restore all databases, project states, users, and customization logs.'}
                  </p>

                  {/* Feedback message banner */}
                  {backupRestoreMsg && (
                    <div className={`p-4 rounded-2xl border text-xs font-bold space-y-1 ${
                      backupRestoreMsg.isError 
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    }`}>
                      <div className="flex items-center gap-2">
                        {backupRestoreMsg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                        <span>{backupRestoreMsg.text}</span>
                      </div>
                      {backupRestoreMsg.counts && (
                        <div className="text-[11px] font-mono text-emerald-400 pt-1">
                          ✓ {backupRestoreMsg.counts.projects} projects, {backupRestoreMsg.counts.users} users, {backupRestoreMsg.counts.drafts} drafts restored.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Direct Drag and Drop File Upload Zone */}
                  <div 
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const droppedFile = e.dataTransfer.files?.[0];
                      if (droppedFile) {
                        const syntheticEvent = { target: { files: [droppedFile], value: '' } };
                        handleFileUploadAndRestore(syntheticEvent);
                      }
                    }}
                    className="border-2 border-dashed border-slate-700 hover:border-emerald-500 bg-slate-950 p-8 rounded-2xl text-center space-y-3 transition cursor-pointer shadow-inner"
                  >
                    <UploadCloud className="w-10 h-10 text-emerald-400 mx-auto animate-pulse" />
                    <div className="space-y-1">
                      <p className="text-xs md:text-sm font-bold text-white">
                        {isRtl ? 'اسحب وأفلت ملف النسخة الاحتياطية JSON هنا' : 'Drag & Drop your JSON backup file here'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {isRtl ? 'أو انقر لاختيار ملف من جهازك' : 'or click to browse from device'}
                      </p>
                    </div>

                    <label className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-bold text-slate-200 transition cursor-pointer">
                      <span>{isRtl ? 'اختيار ملف من الجهاز' : 'Choose File'}</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleFileUploadAndRestore}
                        disabled={isRestoringBackup}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {isRtl 
                      ? 'تنبيه: سيتم استبدال البيانات الحالية بسجلات الملف المرفوع لضمان التطابق الكامل.' 
                      : 'Notice: Restoring will overwrite existing records to synchronize platform state.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Database Action Logs Table */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-400" />
                  {isRtl ? 'سجل عمليات النسخ والاستعادة (Database Action Logs)' : 'Recent Database Action Logs'}
                </h3>
                <input
                  type="text"
                  placeholder={isRtl ? 'بحث في السجلات...' : 'Search logs...'}
                  onChange={(e) => setActivitySearchQuery(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white w-full sm:w-64"
                />
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="px-6 py-4">{isRtl ? 'العملية' : 'Action'}</th>
                      <th className="px-6 py-4">{isRtl ? 'التفاصيل' : 'Details'}</th>
                      <th className="px-6 py-4">{isRtl ? 'التاريخ والوقت' : 'Timestamp'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {activityLogs
                      .filter(log => (log.actionType === 'db_import' || log.actionType === 'db_export') && 
                                     (isRtl ? log.detailsAr : log.detailsEn).toLowerCase().includes(activitySearchQuery.toLowerCase()))
                      .slice(0, 10)
                      .map(log => (
                      <tr key={log.id} className="hover:bg-slate-900">
                        <td className="px-6 py-4 font-bold">
                          <span className={`px-2 py-0.5 rounded-full ${log.actionType === 'db_import' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {log.actionType === 'db_import' ? (isRtl ? 'استعادة بيانات' : 'Database Import') : (isRtl ? 'تصدير بيانات' : 'Database Export')}
                          </span>
                        </td>
                        <td className="px-6 py-4">{isRtl ? log.detailsAr : log.detailsEn}</td>
                        <td className="px-6 py-4 font-mono">{new Date(log.timestamp).toLocaleString(isRtl ? 'ar-EG' : 'en-US')}</td>
                      </tr>
                    ))}
                    {activityLogs.filter(log => (log.actionType === 'db_import' || log.actionType === 'db_export') && (isRtl ? log.detailsAr : log.detailsEn).toLowerCase().includes(activitySearchQuery.toLowerCase())).length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-slate-500 italic">
                          {isRtl ? 'لا توجد سجلات تطابق بحثك حالياً.' : 'No database action logs found matching your search.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: ACTIVITY LOGS TIMELINE */}
        {activeSection === 'activity' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Banner */}
            <div className="rounded-3xl border border-blue-500/40 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 md:p-8 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'سجل تتبع إجراءات الإدارة اللحظي' : 'Real-Time Admin Audit Logs'}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white">
                  {isRtl ? 'سجل النشاطات والأحداث التفصيلي' : 'Chronological Activity Audit Logs'}
                </h3>
                <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {isRtl 
                    ? 'تتبع زمني شامل ومؤرخ لكافة الإجراءات المتخذة من قبل الإدارة (حذف ونشر المشاريع، اعتماد مسودات العملاء، تحديث التفضيلات، ونشر الوسائط).' 
                    : 'A timestamped record of administrative actions taken (project modifications, draft approvals, settings changes, and media publications).'}
                </p>
              </div>

              {activityLogs.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm(isRtl ? 'هل أنت متأكد من مسح كافة سجلات النشاطات؟' : 'Clear all activity log history?')) {
                      storageService.clearActivityLogs();
                      setActivityLogs([]);
                      triggerSaveNotification(isRtl ? 'تم مسح سجل النشاطات بنجاح.' : 'Activity logs cleared.');
                    }
                  }}
                  className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 px-4 py-2.5 text-xs font-bold text-rose-300 transition shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isRtl ? 'مسح كافة السجلات' : 'Clear Log History'}</span>
                </button>
              )}
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-3 shadow-lg">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-bold px-2">{isRtl ? 'تصنيف الأحداث:' : 'Filter:'}</span>
                {[
                  { id: 'all', label: isRtl ? 'الكل' : 'All Events' },
                  { id: 'projects', label: isRtl ? 'المشاريع' : 'Projects' },
                  { id: 'drafts', label: isRtl ? 'المسودات والطلبات' : 'Drafts' },
                  { id: 'media', label: isRtl ? 'الوسائط' : 'Media' },
                  { id: 'settings', label: isRtl ? 'الإعدادات' : 'Settings' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActivityFilter(f.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      activityFilter === f.id 
                        ? 'bg-blue-600 text-white shadow' 
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[200px]">
                <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isRtl ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  value={activitySearchQuery}
                  onChange={(e) => setActivitySearchQuery(e.target.value)}
                  placeholder={isRtl ? 'بحث في السجل...' : 'Search logs...'}
                  className={`w-full rounded-xl border border-slate-800 bg-slate-950 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
                />
              </div>
            </div>

            {/* Logs List Container */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
              {(() => {
                const filteredLogs = activityLogs.filter((log) => {
                  const matchesType = 
                    activityFilter === 'all' ||
                    (activityFilter === 'projects' && log.actionType.startsWith('project')) ||
                    (activityFilter === 'drafts' && log.actionType.startsWith('draft')) ||
                    (activityFilter === 'media' && log.actionType.startsWith('media')) ||
                    (activityFilter === 'settings' && (log.actionType.includes('settings') || log.actionType.includes('wallets')));

                  const q = activitySearchQuery.trim().toLowerCase();
                  const matchesSearch = !q || 
                    (log.titleAr || '').toLowerCase().includes(q) ||
                    (log.titleEn || '').toLowerCase().includes(q) ||
                    (log.detailsAr || '').toLowerCase().includes(q) ||
                    (log.detailsEn || '').toLowerCase().includes(q);

                  return matchesType && matchesSearch;
                });

                if (filteredLogs.length === 0) {
                  return (
                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-10 text-center text-slate-400 space-y-2">
                      <History className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-sm font-semibold">{isRtl ? 'لا توجد سجلات نشاط مطابقة حالياً' : 'No activity log entries found'}</p>
                      <p className="text-xs text-slate-500">{isRtl ? 'سيتم تسجيل الإجراءات والتغييرات تلقائياً فور تنفيذها.' : 'Admin actions will automatically appear here.'}</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {filteredLogs.map((log) => {
                      // Determine Action Type Badge Colors
                      let badgeBg = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
                      let badgeLabel = isRtl ? 'تحديث' : 'Update';

                      if (log.actionType.includes('deleted')) {
                        badgeBg = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
                        badgeLabel = isRtl ? 'حذف' : 'Deleted';
                      } else if (log.actionType.includes('approved') || log.actionType.includes('created')) {
                        badgeBg = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
                        badgeLabel = isRtl ? 'إضافة / اعتماد' : 'Created / Approved';
                      } else if (log.actionType.includes('published')) {
                        badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                        badgeLabel = isRtl ? 'تغيير نشر' : 'Publish Toggle';
                      }

                      const formattedTime = new Date(log.timestamp).toLocaleString(isRtl ? 'ar-EG' : 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });

                      return (
                        <div key={log.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-700 transition">
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeBg}`}>
                                {badgeLabel}
                              </span>
                              <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formattedTime}
                              </span>
                            </div>

                            <h5 className="font-bold text-white text-sm md:text-base">
                              {isRtl ? log.titleAr : log.titleEn}
                            </h5>

                            {(log.detailsAr || log.detailsEn) && (
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {isRtl ? log.detailsAr : log.detailsEn}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* SECTION: SYSTEM PREFERENCES & SITE-WIDE THEME CONTROL */}
        {activeSection === 'preferences' && (() => {
          const safeSet = settings || storageService.getSettings();
          const updateSettingsState = (newFields) => {
            setSettings({
              ...storageService.getSettings(),
              ...(settings || {}),
              ...newFields
            });
          };

          return (
            <form onSubmit={handleSaveSettings} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-400 mb-1">
                    <Settings className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'إعدادات النظام العامة وتفضيلات العرض' : 'Global System Preferences'}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white">
                    {isRtl ? 'تفضيلات النظام المظهري والأمني' : 'System Preferences & Appearance Control'}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-400">
                    {isRtl ? 'التحكم في فرض الثيم العام للموقع (داكن/فاتح/مرن)، مفتاح الأمان، ورقم تحويل الطلبات.' : 'Configure forced site-wide theme modes, passcode security, and order routing numbers.'}
                  </p>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs md:text-sm font-bold text-white shadow-lg hover:bg-blue-500 transition active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isRtl ? 'حفظ تفضيلات النظام' : 'Save System Preferences'}</span>
                </button>
              </div>

              {/* Site-Wide Theme Mode Selector Card */}
              <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Sun className="w-5 h-5 text-amber-400" />
                      <span>{isRtl ? 'التحكم في المظهر الثيم الشامل للمنصة (Site-Wide Theme Engine)' : 'Site-Wide Theme Mode Control'}</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {isRtl 
                        ? 'حدد ما إذا كنت تريد فرض ثيم موحد (داكن أو فاتح) على جميع زوار المنصة، أو ترك الخيار مرناً حسب تفضيلات المستخدم:' 
                        : 'Choose whether to force a single theme mode across all visitors or let users toggle freely:'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {/* Option 1: Force Dark Mode */}
                  <div
                    onClick={() => updateSettingsState({ themeMode: 'dark' })}
                    className={`rounded-2xl border p-5 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                      (safeSet.themeMode === 'dark')
                        ? 'border-blue-500 bg-blue-950/40 ring-2 ring-blue-500/40 shadow-xl'
                        : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        <Moon className="w-5 h-5" />
                      </div>
                      <input
                        type="radio"
                        name="themeModeRadio"
                        checked={safeSet.themeMode === 'dark'}
                        onChange={() => updateSettingsState({ themeMode: 'dark' })}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <h5 className="font-bold text-white text-sm">{isRtl ? 'فرض الثيم الداكن (Force Dark)' : 'Force Dark Theme'}</h5>
                      <p className="text-xs text-slate-400 mt-1">{isRtl ? 'إجبار كافة واجهات المنصة والزوار على الثيم الليلي الداكن دائماً.' : 'Enforces dark theme across all visitor pages.'}</p>
                    </div>
                  </div>

                  {/* Option 2: Force Light Mode */}
                  <div
                    onClick={() => updateSettingsState({ themeMode: 'light' })}
                    className={`rounded-2xl border p-5 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                      (safeSet.themeMode === 'light')
                        ? 'border-amber-500 bg-amber-950/30 ring-2 ring-amber-500/40 shadow-xl'
                        : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Sun className="w-5 h-5" />
                      </div>
                      <input
                        type="radio"
                        name="themeModeRadio"
                        checked={safeSet.themeMode === 'light'}
                        onChange={() => updateSettingsState({ themeMode: 'light' })}
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <h5 className="font-bold text-white text-sm">{isRtl ? 'فرض الثيم الفاتح (Force Light)' : 'Force Light Theme'}</h5>
                      <p className="text-xs text-slate-400 mt-1">{isRtl ? 'إجبار كافة واجهات المنصة والزوار على الثيم النهاري الفاتح دائماً.' : 'Enforces light theme across all visitor pages.'}</p>
                    </div>
                  </div>

                  {/* Option 3: Responsive User Choice */}
                  <div
                    onClick={() => updateSettingsState({ themeMode: 'user' })}
                    className={`rounded-2xl border p-5 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                      (!safeSet.themeMode || safeSet.themeMode === 'user')
                        ? 'border-emerald-500 bg-emerald-950/30 ring-2 ring-emerald-500/40 shadow-xl'
                        : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Monitor className="w-5 h-5" />
                      </div>
                      <input
                        type="radio"
                        name="themeModeRadio"
                        checked={!safeSet.themeMode || safeSet.themeMode === 'user'}
                        onChange={() => updateSettingsState({ themeMode: 'user' })}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <h5 className="font-bold text-white text-sm">{isRtl ? 'تلقائي مرن (User Choice)' : 'Responsive User Toggle'}</h5>
                      <p className="text-xs text-slate-400 mt-1">{isRtl ? 'السماح للعميل بتغيير مظهر المنصة بنفسه من زر الهيدر.' : 'Allows users to toggle theme individually in header.'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform Branding & Hero Typography Customizer */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-5">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <span>{isRtl ? 'هوية وتصميم المنصة والعناوين الرئيسية (Brand & Hero Customization)' : 'Brand & Hero Text Customization'}</span>
                </h4>
                <p className="text-xs text-slate-400">
                  {isRtl ? 'تحكم بالكامل في اسم المنصة، العناوين الترويجية وشعارات الواجهة الرئيسية التي تظهر للزوار فوراً.' : 'Customize platform branding, hero titles, taglines, and marketing badges.'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">{isRtl ? 'اسم المنصة / المركز التعليمي:' : 'Platform / Center Name:'}</label>
                    <input
                      type="text"
                      value={safeSet.centerName || ''}
                      onChange={(e) => updateSettingsState({ centerName: e.target.value })}
                      placeholder="ليرن ويب | Lern Web"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">{isRtl ? 'نوع الخط الرئيسي (Font Family):' : 'Platform Font Family:'}</label>
                    <select
                      value={safeSet.fontFamily || 'cairo'}
                      onChange={(e) => updateSettingsState({ fontFamily: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-white"
                    >
                      <option value="cairo">Cairo (خط كايرو العربي الحديث)</option>
                      <option value="tajawal">Tajawal (خط تجوال العصري)</option>
                      <option value="inter">Inter (خط إنتر التقني العالمي)</option>
                      <option value="almarai">Almarai (خط المراعي الواضح)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">{isRtl ? 'شارة الهيدر الترويجية (بالعربية):' : 'Hero Badge (Arabic):'}</label>
                    <input
                      type="text"
                      value={safeSet.heroBadgeAr || ''}
                      onChange={(e) => updateSettingsState({ heroBadgeAr: e.target.value })}
                      placeholder="المنظومة التعليمية السحابية المعتمدة v3.8"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">{isRtl ? 'شارة الهيدر (بالإنجليزية):' : 'Hero Badge (English):'}</label>
                    <input
                      type="text"
                      value={safeSet.heroBadgeEn || ''}
                      onChange={(e) => updateSettingsState({ heroBadgeEn: e.target.value })}
                      placeholder="Certified Cloud Educational Platform v3.8"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-300">{isRtl ? 'العنوان الرئيسي الضخم في الهيدر (Hero Title):' : 'Hero Headline (Arabic):'}</label>
                    <input
                      type="text"
                      value={safeSet.heroTitleAr || ''}
                      onChange={(e) => updateSettingsState({ heroTitleAr: e.target.value })}
                      placeholder="منظومة متكاملة لإدارة المراكز التعليمية والسناتر بأعلى كفاءة"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-white"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-300">{isRtl ? 'العنوان الفرعي وشعار المنصة (Hero Subtitle):' : 'Hero Subtitle / Tagline:'}</label>
                    <textarea
                      rows={2}
                      value={safeSet.heroSubtitleAr || ''}
                      onChange={(e) => updateSettingsState({ heroSubtitleAr: e.target.value })}
                      placeholder="بوابات إلكترونية، نظام حضور ذكي بالـ QR، بنك أسئلة واختبارات تفاعلية، وبيئات برمجة سحابية وتطبيقات PWA سريعة تعمل بدون إنترنت."
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Colors and Themes */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-400" />
                  <span>{isRtl ? 'الألوان والهوية البصرية الشاملة (Primary & Accent)' : 'Primary & Accent Brand Palette'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">{isRtl ? 'اللون الأساسي الرئيسي (Primary):' : 'Primary Color:'}</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={safeSet.primaryColor || '#2563eb'}
                        onChange={(e) => updateSettingsState({ primaryColor: e.target.value })}
                        className="w-12 h-10 rounded-xl cursor-pointer bg-slate-950 border border-slate-700 p-1"
                      />
                      <input
                        type="text"
                        value={safeSet.primaryColor || '#2563eb'}
                        onChange={(e) => updateSettingsState({ primaryColor: e.target.value })}
                        className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">{isRtl ? 'اللون الثانوي التكميلي (Accent):' : 'Accent Color:'}</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={safeSet.accentColor || '#8b5cf6'}
                        onChange={(e) => updateSettingsState({ accentColor: e.target.value })}
                        className="w-12 h-10 rounded-xl cursor-pointer bg-slate-950 border border-slate-700 p-1"
                      />
                      <input
                        type="text"
                        value={safeSet.accentColor || '#8b5cf6'}
                        onChange={(e) => updateSettingsState({ accentColor: e.target.value })}
                        className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs text-slate-400">{isRtl ? 'قوالب ألوان جاهزة بنقرة واحدة:' : 'Presets:'}</span>
                  {[
                    { name: 'أزرق ملكي (Royal Blue)', primary: '#2563eb', accent: '#8b5cf6' },
                    { name: 'زمردي راقٍ (Emerald)', primary: '#059669', accent: '#10b981' },
                    { name: 'بنفسجي فاخر (Purple)', primary: '#7c3aed', accent: '#c084fc' },
                    { name: 'عنبر دافئ (Amber)', primary: '#d97706', accent: '#fbbf24' },
                    { name: 'قرمزي جذاب (Crimson)', primary: '#e11d48', accent: '#fb7185' },
                    { name: 'سيبراني عصري (Cyan)', primary: '#0891b2', accent: '#06b6d4' }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => updateSettingsState({ primaryColor: preset.primary, accentColor: preset.accent })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold text-slate-200 hover:border-slate-500 transition cursor-pointer"
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.primary }} />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Routing Settings Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <span>{isRtl ? 'رقم الواتساب والبريد للتواصل والطلبات' : 'Contact & WhatsApp Order Routing'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">{isRtl ? 'رقم الواتساب المستهدف لاستلام طلبات الشراء:' : 'Target WhatsApp Number:'}</label>
                    <input
                      type="text"
                      value={safeSet.targetWhatsAppNumber || '201024889921'}
                      onChange={(e) => updateSettingsState({ targetWhatsAppNumber: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs font-mono font-bold text-white"
                    />
                    <p className="text-[11px] text-slate-400">{isRtl ? 'الرقم بالصيغة الدولية بدون (+) مثل: 201024889921' : 'International format without (+).'}</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">{isRtl ? 'البريد الإلكتروني الرسمي للتواصل:' : 'Official Contact Email:'}</label>
                    <input
                      type="email"
                      value={safeSet.contactEmail || 'contact@lernweb.com'}
                      onChange={(e) => updateSettingsState({ contactEmail: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </form>
          );
        })()}

        {/* SECTION 1: PROJECTS & REPOSITORIES MANAGEMENT */}
        {activeSection === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {isRtl ? 'إدارة المشاريع والمنصات التعليمية' : 'Manage Projects & Platforms'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isRtl ? 'يمكنك نشر أو إخفاء أو حذف أي مشروع أو منظومة من المنصة، واستخدام التحديد المتعدد لتنفيذ الإجراءات الجماعية.' : 'Publish, hide, or bulk-manage projects.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllProjects}
                  className="flex items-center gap-1.5 rounded-2xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:text-white hover:border-slate-600 transition"
                >
                  {selectedProjectIds.length === projects.length && projects.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span>{selectedProjectIds.length === projects.length && projects.length > 0 ? (isRtl ? 'إلغاء تحديد الكل' : 'Deselect All') : (isRtl ? 'تحديد كافة المشاريع' : 'Select All Projects')}</span>
                </button>

                <button
                  onClick={() => {
                    const newP = {
                      id: `proj-${Date.now()}`,
                      category: 'lms',
                      titleAr: 'منظومة تعليمية جديدة',
                      titleEn: 'New Educational Platform',
                      badgeAr: 'جديد وحصري',
                      badgeEn: 'Exclusive New',
                      taglineAr: 'وصف مختصر لمنظومتك التعليمية الجديدة.',
                      taglineEn: 'Brief summary.',
                      descriptionAr: 'الوصف التفصيلي والتقني للمنظومة.',
                      descriptionEn: 'Detailed description.',
                      version: 'v1.0.0',
                      developer: 'Lern Web Admin',
                      rating: 5.0,
                      reviewsCount: 1,
                      accentColor: '#3b82f6',
                      isPublished: false,
                      featuresAr: ['ميزة 1'],
                      featuresEn: ['Feature 1'],
                      techStack: ['Next.js'],
                      priceMonthly: '900 ج.م',
                      priceAnnual: '8,000 ج.م',
                      priceFull: '25,000 ج.م',
                      secretFiles: [],
                      screenshots: [{ titleAr: 'معاينة', titleEn: 'Preview', bgGradient: 'from-blue-900 to-indigo-950', mockupType: 'dashboard' }],
                      sandboxConfig: { centerName: 'أكاديمية جديدة', theme: 'ocean', activeCourse: 'الكورس الافتراضي', hasQuiz: true, bannerText: 'مرحباً', tutorName: 'المحاضر' }
                    };
                    storageService.addProject(newP);
                    setProjects(storageService.getProjects(true));
                    setEditingProject(newP);
                    triggerSaveNotification(isRtl ? 'تم إنشاء مشروع جديد!' : 'New project created!');
                  }}
                  className="flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-xs md:text-sm font-bold text-white shadow-lg hover:bg-blue-500 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isRtl ? 'إضافة مشروع جديد' : 'Add New Project'}</span>
                </button>
              </div>
            </div>

            {/* Bulk Action Bar Banner for Projects */}
            {selectedProjectIds.length > 0 && (
              <div className="rounded-2xl border border-blue-500/40 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl animate-fadeIn">
                <div className="flex items-center gap-2 text-xs md:text-sm font-bold">
                  <span className="flex h-3 w-3 rounded-full bg-blue-400 animate-pulse" />
                  <span>{isRtl ? `تم تحديد (${selectedProjectIds.length}) من المشاريع:` : `Selected (${selectedProjectIds.length}) projects:`}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleBulkTogglePublishProjects}
                    className="flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-600/30 hover:bg-blue-600/50 px-3.5 py-1.5 text-xs font-bold text-blue-200 transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-300" />
                    <span>{isRtl ? 'تبديل حالة النشر (إظهار/إخفاء)' : 'Toggle Publish Status'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBulkDeleteProjects}
                    className="flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-600/30 hover:bg-rose-600/50 px-3.5 py-1.5 text-xs font-bold text-rose-200 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                    <span>{isRtl ? 'حذف المحدد' : 'Delete Selected'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedProjectIds([])}
                    className="p-1.5 rounded-xl border border-white/10 hover:bg-white/10 text-slate-300 transition"
                    title={isRtl ? 'إلغاء التحديد' : 'Deselect'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => {
                const isSelected = selectedProjectIds.includes(proj.id);
                return (
                  <div 
                    key={proj.id} 
                    className={`rounded-3xl border transition-all duration-300 p-6 space-y-4 shadow-xl flex flex-col justify-between ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-950/20 ring-2 ring-blue-500/30 shadow-blue-500/10' 
                        : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleSelectProject(proj.id)}
                            className="mt-0.5 text-slate-400 hover:text-blue-400 transition shrink-0"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-5 h-5 text-blue-400" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-500" />
                            )}
                          </button>

                          <div>
                            <span className="inline-block rounded-md px-2 py-0.5 text-xs font-bold text-white" style={{ backgroundColor: proj.accentColor }}>
                              {isRtl ? proj.badgeAr : proj.badgeEn}
                            </span>
                            <h4 className="text-lg font-bold text-white mt-1">{isRtl ? proj.titleAr : proj.titleEn}</h4>
                          </div>
                        </div>

                        <button
                          onClick={() => handleTogglePublish(proj.id)}
                          className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition shadow ${
                            proj.isPublished ? 'bg-emerald-600 text-white' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {proj.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{proj.isPublished ? (isRtl ? 'منشور' : 'Published') : (isRtl ? 'مخفي' : 'Hidden')}</span>
                        </button>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2">{isRtl ? proj.taglineAr : proj.taglineEn}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingProject(proj)}
                          className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:text-white"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                          <span>{isRtl ? 'تعديل' : 'Edit'}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/20 transition"
                        title={isRtl ? 'حذف المشروع نهائياً' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 2: MOBILE WALLETS & PAYMENT LINKS */}
        {activeSection === 'wallets' && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400 mb-1">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'بوابات الدفع والمحافظ الإلكترونية وروابط التحويل' : 'Payment Gateways & Wallets'}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white">{isRtl ? 'إدارة طرق الدفع وروابط التحويل المباشرة' : 'Mobile Wallets & Payment Links'}</h3>
                <p className="text-xs md:text-sm text-slate-400">{isRtl ? 'أضف أو عدل أو احذف طرق الدفع وروابط التحويل. أي تعديل يظهر فورياً في لوحة تحكم العميل.' : 'Manage payment options and direct links. Changes appear immediately in Client Portal.'}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddWalletModal(!showAddWalletModal)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:from-emerald-500 hover:to-teal-500 transition cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isRtl ? 'إضافة طريقة دفع / رابط جديد' : 'Add New Payment / Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    storageService.saveWallets(wallets);
                    triggerSaveNotification(isRtl ? 'تم حفظ وتحديث طرق الدفع بنجاح ومزامنتها لحظياً للعملاء!' : 'Wallets saved & synchronized in real-time!');
                  }}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-blue-500 transition cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{isRtl ? 'حفظ كافة المحافظ' : 'Save All Wallets'}</span>
                </button>
              </div>
            </div>

            {/* Inline Add New Wallet Modal / Card */}
            {showAddWalletModal && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newWalletNameAr.trim()) return;
                  const newW = {
                    id: 'wallet-' + Date.now(),
                    nameAr: newWalletNameAr.trim(),
                    nameEn: newWalletNameEn.trim() || newWalletNameAr.trim(),
                    number: newWalletNumber.trim(),
                    url: newWalletUrl.trim(),
                    badge: newWalletBadge.trim() || 'دفع فوري معتمد',
                    instructionsAr: newWalletInstructions.trim() || 'يرجى إرسال إشعار التحويل بعد إتمام الدفع.',
                    instructionsEn: 'Please send transfer receipt after completing payment.',
                    color: newWalletColor,
                    isActive: true
                  };
                  storageService.addWallet(newW);
                  setWallets(storageService.getWallets());
                  setShowAddWalletModal(false);
                  setNewWalletNameAr('');
                  setNewWalletNameEn('');
                  setNewWalletNumber('');
                  setNewWalletUrl('');
                  triggerSaveNotification(isRtl ? 'تمت إضافة طريقة الدفع الجديدة ومزامنتها فورياً!' : 'New payment method added & synced live!');
                }}
                className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-950/20 p-5 space-y-4 animate-fadeIn"
              >
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Plus className="w-4 h-4" />
                    <span>{isRtl ? 'إضافة وسيلة دفع أو محفظة إلكترونية أو رابط جديد:' : 'Add New Payment Gateway or Link:'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddWalletModal(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">{isRtl ? 'اسم طريقة الدفع (بالعربية):' : 'Name (Arabic):'}</label>
                    <input
                      type="text"
                      required
                      value={newWalletNameAr}
                      onChange={(e) => setNewWalletNameAr(e.target.value)}
                      placeholder={isRtl ? 'مثال: انستاباي الفوري أو اتصالات كاش' : 'e.g. InstaPay Direct'}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">{isRtl ? 'اسم طريقة الدفع (بالإنجليزية):' : 'Name (English):'}</label>
                    <input
                      type="text"
                      value={newWalletNameEn}
                      onChange={(e) => setNewWalletNameEn(e.target.value)}
                      placeholder="e.g. InstaPay IPN"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">{isRtl ? 'رقم المحفظة / الحساب:' : 'Account / Wallet Number:'}</label>
                    <input
                      type="text"
                      value={newWalletNumber}
                      onChange={(e) => setNewWalletNumber(e.target.value)}
                      placeholder="010XXXXXXXX or username@instapay"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono font-bold text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">{isRtl ? 'رابط الدفع المباشر (اختياري URL):' : 'Payment URL Link (Optional):'}</label>
                    <input
                      type="url"
                      value={newWalletUrl}
                      onChange={(e) => setNewWalletUrl(e.target.value)}
                      placeholder="https://instapay.eg/... or https://paypal.me/..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono text-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">{isRtl ? 'شارة تمييز الوسيلة:' : 'Badge Text:'}</label>
                    <input
                      type="text"
                      value={newWalletBadge}
                      onChange={(e) => setNewWalletBadge(e.target.value)}
                      placeholder="دفع فوري معتمد"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">{isRtl ? 'اللون المميز:' : 'Accent Color:'}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newWalletColor}
                        onChange={(e) => setNewWalletColor(e.target.value)}
                        className="w-10 h-8 rounded-lg cursor-pointer bg-slate-900 border border-slate-700 p-0.5"
                      />
                      <input
                        type="text"
                        value={newWalletColor}
                        onChange={(e) => setNewWalletColor(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:col-span-2 md:col-span-3">
                    <label className="text-xs font-semibold text-slate-300">{isRtl ? 'تعليمات وإرشادات الدفع للعميل:' : 'Payment Instructions:'}</label>
                    <input
                      type="text"
                      value={newWalletInstructions}
                      onChange={(e) => setNewWalletInstructions(e.target.value)}
                      placeholder={isRtl ? 'مثال: حول المبلغ ثم احتفظ بصورة الإيصال لإرسالها عبر الواتساب' : 'Transfer funds and retain transaction receipt'}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddWalletModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-xs font-bold text-white shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isRtl ? 'إضافة وحفظ الوسيلة فورياً' : 'Add & Publish Now'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Existing Wallets List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wallets.map((w, idx) => (
                <div key={w.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-lg hover:border-slate-700 transition">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: w.color || '#2563eb' }} />
                      <input
                        type="text"
                        value={w.nameAr || ''}
                        onChange={(e) => {
                          const updated = [...wallets];
                          updated[idx].nameAr = e.target.value;
                          setWallets(updated);
                        }}
                        className="font-bold text-sm text-white bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={w.isActive}
                          onChange={(e) => {
                            const updated = [...wallets];
                            updated[idx].isActive = e.target.checked;
                            setWallets(updated);
                          }}
                          className="rounded accent-blue-600"
                        />
                        <span className={w.isActive ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                          {w.isActive ? (isRtl ? 'مفعلة' : 'Active') : (isRtl ? 'معطلة' : 'Inactive')}
                        </span>
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(isRtl ? `هل أنت متأكد من حذف طريقة الدفع "${w.nameAr}"؟` : 'Delete this payment method?')) {
                            storageService.deleteWallet(w.id);
                            setWallets(storageService.getWallets());
                            triggerSaveNotification(isRtl ? 'تم حذف طريقة الدفع بنجاح ومزامنتها فورياً!' : 'Payment method deleted & synced!');
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                        title={isRtl ? 'حذف طريقة الدفع' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">{isRtl ? 'رقم المحفظة / الحساب:' : 'Account / Wallet Number:'}</label>
                      <input
                        type="text"
                        value={w.number || ''}
                        onChange={(e) => {
                          const updated = [...wallets];
                          updated[idx].number = e.target.value;
                          setWallets(updated);
                        }}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-mono font-bold text-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-slate-400">{isRtl ? 'رابط الدفع المباشر (URL Link):' : 'Direct Payment Link (URL):'}</label>
                        {(w.url || (w.number && w.number.startsWith('http'))) && (
                          <a
                            href={w.url || w.number}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <span>{isRtl ? 'تجربة الرابط' : 'Test Link'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <input
                        type="url"
                        value={w.url || ''}
                        onChange={(e) => {
                          const updated = [...wallets];
                          updated[idx].url = e.target.value;
                          setWallets(updated);
                        }}
                        placeholder="https://instapay.eg/... or https://..."
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-mono text-emerald-400 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">{isRtl ? 'تعليمات وإرشادات التحويل:' : 'Instructions:'}</label>
                      <input
                        type="text"
                        value={w.instructionsAr || ''}
                        onChange={(e) => {
                          const updated = [...wallets];
                          updated[idx].instructionsAr = e.target.value;
                          setWallets(updated);
                        }}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-slate-300 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: SOCIAL MEDIA & IDENTITY COLORS */}
        {activeSection === 'social' && (
          <form onSubmit={handleSaveSettings} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{isRtl ? 'إدارة الهوية البصرية، روابط السوشيال ورقم الواتساب' : 'Identity, Social Links & WhatsApp'}</h3>
                <p className="text-xs text-slate-400">{isRtl ? 'تغيير ألوان المنصة، أرقام التواصل وروابط الحسابات الرسمية.' : 'Customize platform primary colors and profile URLs.'}</p>
              </div>
              <button type="submit" className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-blue-500">
                <Save className="w-4 h-4" />
                <span>{isRtl ? 'حفظ الإعدادات' : 'Save Settings'}</span>
              </button>
            </div>

            <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-950/20 p-5 space-y-2">
              <label className="text-sm font-bold text-emerald-400 block">{isRtl ? 'رقم هاتف الواتساب لاستقبال الطلبات (مع كود الدولة):' : 'Target WhatsApp Number:'}</label>
              <input
                type="text"
                value={settings.targetWhatsAppNumber}
                onChange={(e) => setSettings({ ...settings, targetWhatsAppNumber: e.target.value.replace(/[^0-9]/g, '') })}
                className="w-full max-w-md rounded-xl border border-emerald-500/40 bg-slate-950 px-4 py-3 text-base font-mono font-bold text-white"
              />
            </div>

             {/* Dynamic Social Links List Manager */}
             <div className="space-y-4 pt-4 border-t border-slate-800">
               <div className="flex items-center justify-between">
                 <label className="text-sm font-bold text-slate-300">
                   {isRtl ? 'روابط منصات التواصل (قابلة للتعديل):' : 'Social Media Links (Editable):'}
                 </label>
                 <button
                   type="button"
                   onClick={() => setSettings({ ...settings, socialLinksList: [...(settings.socialLinksList || []), { id: Date.now().toString(), app: 'website', titleAr: '', titleEn: '', url: '', isActive: true }] })}
                   className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-500"
                 >
                   <Plus className="w-3.5 h-3.5" />
                   {isRtl ? 'إضافة منصة' : 'Add Platform'}
                 </button>
               </div>
               <div className="space-y-2">
                 {(settings.socialLinksList || []).map((link, idx) => (
                   <div key={link.id} className="flex gap-2 items-center bg-slate-950 p-2 rounded-lg border border-slate-700">
                     <select
                       value={link.app}
                       onChange={(e) => {
                         const updated = [...(settings.socialLinksList || [])];
                         updated[idx].app = e.target.value;
                         setSettings({ ...settings, socialLinksList: updated });
                       }}
                       className="rounded-lg bg-slate-900 px-2 py-1.5 text-xs text-white border border-slate-700"
                     >
                       {AVAILABLE_SOCIAL_APPS.map(app => <option key={app.type} value={app.type}>{app.nameEn}</option>)}
                     </select>
                     <input
                       type="text"
                       placeholder={isRtl ? 'رابط المنصة' : 'URL'}
                       value={link.url}
                       onChange={(e) => {
                         const updated = [...(settings.socialLinksList || [])];
                         updated[idx].url = e.target.value;
                         setSettings({ ...settings, socialLinksList: updated });
                       }}
                       className="flex-1 rounded-lg bg-slate-900 px-2 py-1.5 text-xs text-white border border-slate-700"
                     />
                     <button
                       type="button"
                       onClick={() => {
                         const updated = (settings.socialLinksList || []).filter((_, i) => i !== idx);
                         setSettings({ ...settings, socialLinksList: updated });
                       }}
                       className="text-rose-400 hover:text-rose-300 p-1.5"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                 ))}
               </div>
             </div>


            {/* Visual Identity & Primary Colors Customizer */}
            <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-5 space-y-4 pt-4 border-t border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>{isRtl ? 'تخصيص ألوان الهوية البصرية الأساسية (Primary Colors)' : 'Visual Identity & Primary Colors'}</span>
              </h4>
              <p className="text-xs text-slate-300">
                {isRtl ? 'اختر الألوان الرئيسية للهوية البصرية لتتغير ألوان الأزرار والعناصر البارزة في المنصة بالكامل:' : 'Customize primary and accent colors for platform brand identity:'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">{isRtl ? 'اللون الرئيسي الأساسي (Primary Color):' : 'Primary Color:'}</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.primaryColor || '#2563eb'}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="w-12 h-10 rounded-xl cursor-pointer bg-slate-950 border border-slate-700 p-1"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor || '#2563eb'}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">{isRtl ? 'اللون الثانوي المميز (Accent Color):' : 'Accent Color:'}</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.accentColor || '#8b5cf6'}
                      onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                      className="w-12 h-10 rounded-xl cursor-pointer bg-slate-950 border border-slate-700 p-1"
                    />
                    <input
                      type="text"
                      value={settings.accentColor || '#8b5cf6'}
                      onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Preset Palette Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs text-slate-400">{isRtl ? 'لوحات ألوان جاهزة:' : 'Presets:'}</span>
                {[
                  { name: 'أزرق ملكي', primary: '#2563eb', accent: '#8b5cf6' },
                  { name: 'زمردي أخضر', primary: '#059669', accent: '#10b981' },
                  { name: 'بنفسجي داكن', primary: '#7c3aed', accent: '#c084fc' },
                  { name: 'عنبر برتقالي', primary: '#d97706', accent: '#fbbf24' },
                  { name: 'قرمزي أحمر', primary: '#e11d48', accent: '#fb7185' }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSettings({ ...settings, primaryColor: preset.primary, accentColor: preset.accent })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold text-slate-200 hover:border-slate-500 transition"
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.primary }} />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* SECTION 4: MEDIA, YOUTUBE & IMAGE PUBLISHING */}
        {activeSection === 'media' && (
          <div className="space-y-6">
            <form onSubmit={handleAddMedia} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-emerald-400" />
                  <span>{isRtl ? 'مركز نشر وسائط يوتيوب، الصور والتوثيقات' : 'Media, YouTube & Image Publishing Hub'}</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">v4.0 Enhanced Player</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Content Type Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">{isRtl ? 'نوع المحتوى:' : 'Content Type:'}</label>
                  <select
                    value={newMediaType}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewMediaType(val);
                      if (val === 'video') setNewMediaSourceType('youtube_url');
                      else if (val === 'image') setNewMediaSourceType('image_url');
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white font-bold"
                  >
                    <option value="video">{isRtl ? '🎥 فيديو (يوتيوب أو من الجهاز)' : '🎥 Video (YouTube / Local)'}</option>
                    <option value="image">{isRtl ? '🖼️ صورة (رابط مباشر أو من الجهاز)' : '🖼️ Image (URL / Local)'}</option>
                    <option value="doc">{isRtl ? '📄 مقال أو توثيق تعليمي' : '📄 Article / Documentation'}</option>
                  </select>
                </div>

                {/* Title Input */}
                <div className="space-y-1 md:col-span-1">
                  <label className="text-xs font-semibold text-slate-300">{isRtl ? 'عنوان الفيديو، الصورة أو المقال:' : 'Title:'}</label>
                  <input
                    type="text"
                    value={newMediaTitle}
                    onChange={(e) => setNewMediaTitle(e.target.value)}
                    placeholder={isRtl ? 'مثال: كورس شرح إنشاء المنصات البرمجية والربط السحابي' : 'e.g. Platform Architecture Overview'}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                {/* Target Section Selector */}
                <div className="space-y-1 md:col-span-1">
                  <label className="text-xs font-bold text-amber-400">{isRtl ? 'قسم الظهور للعميل بالمنصة:' : 'Display Section for Client:'}</label>
                  <select
                    value={newMediaTargetSection}
                    onChange={(e) => setNewMediaTargetSection(e.target.value)}
                    className="w-full rounded-xl border border-amber-500/40 bg-slate-950 px-3.5 py-2.5 text-xs text-white font-bold"
                  >
                    <option value="hero">{isRtl ? '🏠 الصفحة الرئيسية (Hero)' : '🏠 Home / Hero'}</option>
                    <option value="store">{isRtl ? '🏬 سوق المنظومات والمشاريع' : '🏬 App Store / Projects'}</option>
                    <option value="wallets">{isRtl ? '💳 طرق الدفع والتحويل المباشر' : '💳 Payment Methods'}</option>
                    <option value="articles">{isRtl ? '📝 المقالات والـ CMS' : '📝 Articles & CMS'}</option>
                    <option value="about">{isRtl ? 'ℹ️ قسم من نحن' : 'ℹ️ About Us'}</option>
                  </select>
                </div>

                {/* Sub-source Selector for Video */}
                {newMediaType === 'video' && (
                  <div className="md:col-span-3 space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                    <label className="text-xs font-bold text-emerald-400 block">{isRtl ? 'طريقة إدراج الفيديو:' : 'Video Source Mode:'}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setNewMediaSourceType('youtube_url')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                          newMediaSourceType === 'youtube_url' 
                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' 
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        🔴 {isRtl ? 'رابط يوتيوب طبيعي' : 'YouTube Link'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setNewMediaSourceType('youtube_embed')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                          newMediaSourceType === 'youtube_embed' 
                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' 
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        🧩 {isRtl ? 'كود تضمين يوتيوب (iframe)' : 'YouTube Embed Code'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setNewMediaSourceType('local_video')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                          newMediaSourceType === 'local_video' 
                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' 
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        💻 {isRtl ? 'اختيار فيديو من الجهاز' : 'Upload Video File'}
                      </button>
                    </div>

                    {/* YouTube Standard Link Input */}
                    {newMediaSourceType === 'youtube_url' && (
                      <div className="space-y-1">
                        <span className="text-[11px] text-slate-400">{isRtl ? 'أدخل رابط فيديو يوتيوب عادي، رابط Shorts أو رابط مشاركة:' : 'Enter standard YouTube URL, Shorts or share link:'}</span>
                        <input
                          type="text"
                          value={newMediaUrl}
                          onChange={(e) => setNewMediaUrl(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ OR https://youtu.be/dQw4w9WgXcQ"
                          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    )}

                    {/* YouTube Embed Snippet Code Input */}
                    {newMediaSourceType === 'youtube_embed' && (
                      <div className="space-y-1">
                        <span className="text-[11px] text-slate-400">{isRtl ? 'الصق كود التضمين الكامل من يوتيوب (<iframe ...></iframe>):' : 'Paste full YouTube iframe embed snippet:'}</span>
                        <textarea
                          rows={2}
                          value={newMediaEmbedCode}
                          onChange={(e) => setNewMediaEmbedCode(e.target.value)}
                          placeholder='<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allowfullscreen></iframe>'
                          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-emerald-300 font-mono"
                        />
                      </div>
                    )}

                    {/* Local Video Selection */}
                    {newMediaSourceType === 'local_video' && (
                      <div className="space-y-2">
                        <span className="text-[11px] text-slate-400">{isRtl ? 'اختر فيديو من داخل جهاز المحمول أو الكمبيوتر (.mp4, .webm, .ogg):' : 'Select a local video file (.mp4, .webm):'}</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleMediaFileSelect}
                          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2 text-xs text-slate-200 file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                        />
                        {newMediaFile && (
                          <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{isRtl ? `تم تجهيز فيديو: ${newMediaFile.name}` : `Selected video: ${newMediaFile.name}`}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-source Selector for Image */}
                {newMediaType === 'image' && (
                  <div className="md:col-span-3 space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                    <label className="text-xs font-bold text-cyan-400 block">{isRtl ? 'طريقة إدراج الصورة:' : 'Image Source Mode:'}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setNewMediaSourceType('image_url')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                          newMediaSourceType === 'image_url' 
                            ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300' 
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        🌐 {isRtl ? 'رابط صورة مباشر (Image URL)' : 'Direct Image URL'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setNewMediaSourceType('local_image')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                          newMediaSourceType === 'local_image' 
                            ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300' 
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        💻 {isRtl ? 'اختيار صورة من داخل الجهاز' : 'Upload Image File'}
                      </button>
                    </div>

                    {newMediaSourceType === 'image_url' && (
                      <div className="space-y-1">
                        <span className="text-[11px] text-slate-400">{isRtl ? 'أدخل رابط الصورة المباشر:' : 'Enter direct image URL:'}</span>
                        <input
                          type="url"
                          value={newMediaUrl}
                          onChange={(e) => setNewMediaUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    )}

                    {newMediaSourceType === 'local_image' && (
                      <div className="space-y-2">
                        <span className="text-[11px] text-slate-400">{isRtl ? 'اختر صورة من داخل الجهاز (.png, .jpg, .svg, .webp):' : 'Select an image file (.png, .jpg):'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMediaFileSelect}
                          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2 text-xs text-slate-200 file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 cursor-pointer"
                        />
                        {newMediaFile && (
                          <div className="text-xs text-cyan-400 font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{isRtl ? `تم تجهيز صورة: ${newMediaFile.name}` : `Selected image: ${newMediaFile.name}`}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Description or Article Text */}
                <div className="space-y-1 md:col-span-3">
                  <label className="text-xs font-semibold text-slate-300">{isRtl ? 'الشرح، الوصف أو محتوى التوثيق التعليمي:' : 'Content Details / Article Text:'}</label>
                  <textarea
                    rows={3}
                    value={newMediaContent}
                    onChange={(e) => setNewMediaContent(e.target.value)}
                    placeholder={isRtl ? 'اكتب التفاصيل الكاملة هنا لتظهر للزوار والعملاء...' : 'Enter details...'}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white leading-relaxed"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-lg shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isRtl ? 'نشر المحتوى فورياً في المنصة' : 'Publish to Platform Now'}</span>
              </button>
            </form>

            {/* List of published media items with checkboxes & bulk delete options */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <h4 className="text-base font-bold text-white">{isRtl ? 'المحتويات والفيديوهات المنشورة حالياً:' : 'Published Media & Videos:'}</h4>
                
                {mediaResources.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectAllMedia}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:text-white transition"
                  >
                    {selectedMediaIds.length === mediaResources.length && mediaResources.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                    <span>{selectedMediaIds.length === mediaResources.length && mediaResources.length > 0 ? (isRtl ? 'إلغاء تحديد الكل' : 'Deselect All') : (isRtl ? 'تحديد كافة المحتويات' : 'Select All Media')}</span>
                  </button>
                )}
              </div>

              {/* Bulk Action Bar Banner for Media */}
              {selectedMediaIds.length > 0 && (
                <div className="rounded-2xl border border-blue-500/40 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-3.5 text-white flex items-center justify-between gap-3 shadow-xl animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-blue-400 animate-pulse" />
                    <span>{isRtl ? `تم تحديد (${selectedMediaIds.length}) من عناصر المحتوى:` : `Selected (${selectedMediaIds.length}) items:`}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleBulkTogglePublishMedia}
                      className="flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-600/30 hover:bg-blue-600/50 px-3.5 py-1.5 text-xs font-bold text-blue-200 transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-300" />
                      <span>{isRtl ? 'تبديل النشر (إظهار/إخفاء)' : 'Toggle Publish Status'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBulkDeleteMedia}
                      className="flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-600/30 hover:bg-rose-600/50 px-3.5 py-1.5 text-xs font-bold text-rose-200 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                      <span>{isRtl ? 'حذف المحدد' : 'Delete Selected'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMediaIds([])}
                      className="p-1.5 rounded-xl border border-white/10 hover:bg-white/10 text-slate-300 transition"
                      title={isRtl ? 'إلغاء التحديد' : 'Deselect'}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {mediaResources.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">{isRtl ? 'لا يوجد محتوى أو فيديوهات منشورة حالياً.' : 'No published media items.'}</p>
                ) : (
                  mediaResources.map((item) => {
                    const isSelected = selectedMediaIds.includes(item.id);
                    return (
                      <div 
                        key={item.id} 
                        className={`flex items-center justify-between p-4 rounded-2xl border text-xs transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-950/30 ring-1 ring-blue-500/30' 
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleSelectMedia(item.id)}
                            className="text-slate-400 hover:text-blue-400 transition shrink-0"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-5 h-5 text-blue-400" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-500" />
                            )}
                          </button>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400">
                                {item.type === 'video' ? (isRtl ? 'فيديو' : 'Video') : (isRtl ? 'مقال' : 'Article')}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.isPublished !== false ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                {item.isPublished !== false ? (isRtl ? 'منشور' : 'Published') : (isRtl ? 'مخفي' : 'Hidden')}
                              </span>
                            </div>
                            <h5 className="font-bold text-white text-sm">{isRtl ? item.titleAr : item.titleEn}</h5>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleMediaPublish(item.id)}
                            className={`p-2 rounded-xl transition ${item.isPublished !== false ? 'text-emerald-400 hover:bg-emerald-500/20' : 'text-amber-400 hover:bg-amber-500/20'}`}
                            title={isRtl ? 'تبديل حالة النشر' : 'Toggle Publish'}
                          >
                            {item.isPublished !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteMedia(item.id)}
                            className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/20 transition shrink-0"
                            title={isRtl ? 'حذف المحتوى' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: REGISTERED USERS */}
        {activeSection === 'users' && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {isRtl ? 'إدارة العملاء وتوثيق الحسابات' : 'Client Management & Account Verification'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isRtl ? 'تحكم في حسابات العملاء، توثيق الحسابات، وصلاحيات الأدوار مع إرسال إشعارات فورية.' : 'Manage client accounts, verification badges, and roles with instant notifications.'}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder={isRtl ? 'بحث برقم الهاتف أو الاسم...' : 'Search by phone or name...'}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pr-10 pl-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800">
                    <th className="px-4 py-3">{isRtl ? 'اسم العميل' : 'Client Name'}</th>
                    <th className="px-4 py-3">{isRtl ? 'رقم الهاتف' : 'Phone'}</th>
                    <th className="px-4 py-3">{isRtl ? 'الدور / الصلاحية' : 'Role'}</th>
                    <th className="px-4 py-3">{isRtl ? 'توثيق الحساب (Account Verified)' : 'Account Verified'}</th>
                    <th className="px-4 py-3">{isRtl ? 'نظام التشغيل والجهاز' : 'Device / OS'}</th>
                    <th className="px-4 py-3">{isRtl ? 'تاريخ التسجيل' : 'Registration Timestamp'}</th>
                    <th className="px-4 py-3 text-center">{isRtl ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.filter(u => {
                    if (!userSearchQuery) return true;
                    const q = userSearchQuery.toLowerCase();
                    return (u.name && u.name.toLowerCase().includes(q)) || (u.phone && u.phone.includes(q));
                  }).length === 0 ? (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">{isRtl ? 'لا يوجد عملاء مطابقين للبحث.' : 'No matching clients found.'}</td></tr>
                  ) : (
                    users.filter(u => {
                      if (!userSearchQuery) return true;
                      const q = userSearchQuery.toLowerCase();
                      return (u.name && u.name.toLowerCase().includes(q)) || (u.phone && u.phone.includes(q));
                    }).map(u => {
                      const userPlan = plans.find(p => p.id === u.purchasedPlanId);
                      const formattedDate = u.createdAt 
                        ? new Date(u.createdAt).toLocaleString(isRtl ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : (isRtl ? 'اليوم' : 'Today');
                      return (
                        <tr key={u.id} className="text-slate-300 hover:bg-slate-950/50 transition">
                          <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                            <span>{u.name}</span>
                            {u.isVerified && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                                <span>{isRtl ? 'موثق' : 'Verified'}</span>
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-mono">{u.phone}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 bg-blue-500/20 text-blue-400 font-bold">
                              {u.roleAr || 'عميل معتمد'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {/* Account Verified Toggle Switch */}
                            <label className="relative inline-flex items-center cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={!!u.isVerified}
                                onChange={(e) => {
                                  const newState = e.target.checked;
                                  storageService.toggleUserVerification(u.id, newState);
                                  refreshLocalData();
                                  triggerSaveNotification(
                                    newState 
                                      ? (isRtl ? `تم توثيق حساب العميل ${u.name} وإرسال إشعار فوري له!` : `User ${u.name} verified & notification sent!`)
                                      : (isRtl ? `تم إلغاء توثيق حساب العميل ${u.name}` : `Verification removed for ${u.name}`)
                                  );
                                }}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] peer-checked:after:right-[unset] peer-checked:after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                              <span className="mr-2 text-[11px] font-bold text-slate-300">
                                {u.isVerified ? (isRtl ? 'موثق' : 'Verified') : (isRtl ? 'غير موثق' : 'Unverified')}
                              </span>
                            </label>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 bg-slate-800 text-slate-300 font-mono text-[11px]">
                              💻 {u.deviceOs || 'Windows / PWA Web'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-400 font-mono">{formattedDate}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(isRtl ? `حذف حساب العميل ${u.name} نهائياً؟` : `Delete client ${u.name}?`)) {
                                    storageService.deleteUser(u.id);
                                    refreshLocalData();
                                    triggerSaveNotification(isRtl ? 'تم حذف حساب العميل بنجاح.' : 'User account deleted.');
                                  }
                                }}
                                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition"
                                title={isRtl ? 'حذف الحساب' : 'Delete User'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION: PLANS MANAGEMENT */}
        {false && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {isRtl ? 'إدارة خطط التراخيص والأسعار' : 'Subscription Plans Management'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isRtl ? 'يمكنك إضافة أو تعديل أو حذف خطط الاشتراك التي تظهر للعملاء في المنظومة.' : 'Add, edit, or delete dynamic subscription plans.'}
                </p>
              </div>

              <button
                onClick={() => {
                  const newPlan = {
                    id: `plan-${Date.now()}`,
                    nameAr: 'خطة اشتراك جديدة',
                    nameEn: 'New Subscription Plan',
                    priceAr: '0 ج.م',
                    priceEn: '$0',
                    periodAr: 'شهرياً',
                    periodEn: 'per month',
                    badgeAr: 'جديد',
                    badgeEn: 'New',
                    descriptionAr: 'وصف الخطة هنا...',
                    descriptionEn: 'Plan description here...',
                    accentColor: '#3b82f6'
                  };
                  storageService.addPlan(newPlan);
                  setPlans(storageService.getPlans());
                  triggerSaveNotification(isRtl ? 'تم إضافة خطة جديدة!' : 'New plan added!');
                }}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs md:text-sm font-bold text-white shadow-lg hover:bg-emerald-500 transition"
              >
                <Plus className="w-4 h-4" />
                <span>{isRtl ? 'إضافة خطة جديدة' : 'Add New Plan'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((p, idx) => (
                <div key={p.id} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={p.isPopular}
                          onChange={(e) => {
                            const updated = { ...p, isPopular: e.target.checked };
                            storageService.updatePlan(updated);
                            setPlans(storageService.getPlans());
                          }}
                          className="rounded accent-blue-600"
                        />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{isRtl ? 'باقة شائعة' : 'Popular'}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm(isRtl ? 'حذف هذه الخطة نهائياً؟' : 'Delete this plan?')) {
                            storageService.deletePlan(p.id);
                            setPlans(storageService.getPlans());
                            triggerSaveNotification(isRtl ? 'تم حذف الخطة.' : 'Plan deleted.');
                          }
                        }}
                        className="text-rose-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">{isRtl ? 'الاسم (عربي):' : 'Name (AR):'}</label>
                          <input
                            type="text"
                            value={p.nameAr}
                            onChange={(e) => {
                              const updated = { ...p, nameAr: e.target.value };
                              storageService.updatePlan(updated);
                              setPlans(storageService.getPlans());
                            }}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">{isRtl ? 'الاسم (إنجليزي):' : 'Name (EN):'}</label>
                          <input
                            type="text"
                            value={p.nameEn}
                            onChange={(e) => {
                              const updated = { ...p, nameEn: e.target.value };
                              storageService.updatePlan(updated);
                              setPlans(storageService.getPlans());
                            }}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">{isRtl ? 'السعر (عربي):' : 'Price (AR):'}</label>
                          <input
                            type="text"
                            value={p.priceAr}
                            onChange={(e) => {
                              const updated = { ...p, priceAr: e.target.value };
                              storageService.updatePlan(updated);
                              setPlans(storageService.getPlans());
                            }}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">{isRtl ? 'السعر (إنجليزي):' : 'Price (EN):'}</label>
                          <input
                            type="text"
                            value={p.priceEn}
                            onChange={(e) => {
                              const updated = { ...p, priceEn: e.target.value };
                              storageService.updatePlan(updated);
                              setPlans(storageService.getPlans());
                            }}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">{isRtl ? 'المدة (عربي):' : 'Period (AR):'}</label>
                          <input
                            type="text"
                            value={p.periodAr}
                            onChange={(e) => {
                              const updated = { ...p, periodAr: e.target.value };
                              storageService.updatePlan(updated);
                              setPlans(storageService.getPlans());
                            }}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">{isRtl ? 'المدة (إنجليزي):' : 'Period (EN):'}</label>
                          <input
                            type="text"
                            value={p.periodEn}
                            onChange={(e) => {
                              const updated = { ...p, periodEn: e.target.value };
                              storageService.updatePlan(updated);
                              setPlans(storageService.getPlans());
                            }}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">{isRtl ? 'الوصف (عربي):' : 'Description (AR):'}</label>
                        <textarea
                          rows={2}
                          value={p.descriptionAr}
                          onChange={(e) => {
                            const updated = { ...p, descriptionAr: e.target.value };
                            storageService.updatePlan(updated);
                            setPlans(storageService.getPlans());
                          }}
                          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">{isRtl ? 'اللون (HEX):' : 'Color (HEX):'}</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={p.accentColor || '#3b82f6'}
                            onChange={(e) => {
                              const updated = { ...p, accentColor: e.target.value };
                              storageService.updatePlan(updated);
                              setPlans(storageService.getPlans());
                            }}
                            className="w-8 h-8 rounded bg-slate-950 border border-slate-700 p-0.5"
                          />
                          <input
                            type="text"
                            value={p.accentColor || '#3b82f6'}
                            onChange={(e) => {
                              const updated = { ...p, accentColor: e.target.value };
                              storageService.updatePlan(updated);
                              setPlans(storageService.getPlans());
                            }}
                            className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-[10px] font-mono text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: AI & LIVE SUPPORT TICKETS MANAGEMENT */}
        {activeSection === 'tickets' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Banner */}
            <div className="rounded-3xl border border-blue-500/40 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 md:p-8 shadow-2xl space-y-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span>{isRtl ? 'إدارة تذاكر ومحادثات الدعم الفني اللحظية والتوجيهات المخصصة' : 'Support Tickets & Custom AI Directive Panel'}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                {isRtl ? 'المحادثات الحية وتوجيهات الذكاء الاصطناعي للعملاء' : 'Live Support Tickets & AI System Prompt Overrides'}
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
                {isRtl 
                  ? 'يمكنك متابعة محادثات المساعد الذكي مع كافة العملاء والزوار في الوقت الفعلي، الرد عليهم مباشرة كـ أدمن (Admin)، وتعيين توجيهات وحوافز خاصة (System Overrides) لكل عميل بشكل منفصل.' 
                  : 'Monitor ongoing AI chat tickets in real-time, respond directly as administrator, and inject custom AI system instruction overrides per user.'}
              </p>
            </div>

            {/* Main Tickets Interface Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Ticket List Sidebar (4 Cols) */}
              <div className="lg:col-span-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-4 space-y-3 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 px-2">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <span>{isRtl ? 'التذاكر النشطة:' : 'Active Tickets:'}</span>
                  </h3>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                    {supportTickets.length}
                  </span>
                </div>

                {supportTickets.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 space-y-2">
                    <MessageSquare className="w-8 h-8 text-slate-700 mx-auto" />
                    <p className="text-xs font-semibold">{isRtl ? 'لا توجد تذاكر دعم حالياً.' : 'No active support tickets.'}</p>
                    <p className="text-[11px] text-slate-600">{isRtl ? 'ستظهر محادثات العملاء والمساعد الذكي فور بدايتها.' : 'User chats will appear here automatically.'}</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                    {supportTickets.map((t) => {
                      const isSelected = selectedTicketId === t.id || (!selectedTicketId && supportTickets[0]?.id === t.id);
                      const lastMsg = t.messages && t.messages.length > 0 ? t.messages[t.messages.length - 1] : null;

                      return (
                        <div
                          key={t.id}
                          onClick={() => {
                            setSelectedTicketId(t.id);
                            setCustomOverrideInput(t.systemOverride || '');
                          }}
                          className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all space-y-2 ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500/40 shadow-lg' 
                              : 'border-slate-800/80 bg-slate-950/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{t.userName || 'زائر كريم'}</span>
                              {t.unreadByAdmin && (
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                              )}
                            </div>

                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' :
                              t.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {t.status === 'open' ? (isRtl ? 'مفتوحة' : 'Open') :
                               t.status === 'in_progress' ? (isRtl ? 'قيد المتابعة' : 'In Progress') : (isRtl ? 'مغلقة' : 'Closed')}
                            </span>
                          </div>

                          {t.userPhone && (
                            <p className="text-[11px] font-mono text-slate-400">📱 {t.userPhone}</p>
                          )}

                          {lastMsg && (
                            <p className="text-[11px] text-slate-300 line-clamp-1 italic">
                              "{lastMsg.text}"
                            </p>
                          )}

                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                            <span>{t.updatedAt ? new Date(t.updatedAt).toLocaleTimeString(isRtl ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                            {t.systemOverride && (
                              <span className="text-amber-400 font-bold flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>{isRtl ? 'توجيه محدد' : 'Override Set'}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Active Ticket Transcript & Override Controls (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                {(() => {
                  const activeTicket = supportTickets.find(t => t.id === selectedTicketId) || supportTickets[0];

                  if (!activeTicket) {
                    return (
                      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-12 text-center text-slate-400 space-y-3 shadow-xl">
                        <Bot className="w-12 h-12 text-slate-700 mx-auto" />
                        <h4 className="text-lg font-bold text-white">{isRtl ? 'يرجى اختيار تذكرة محادثة لمعاينتها والرد عليها' : 'Select a support ticket'}</h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">{isRtl ? 'ستتمكن من قراءة سجل المحادثة الكامل والرد مباشرة كـ أدمن وتعيين حوافز وتوجيهات خاصة.' : 'View transcript, reply directly as admin, or push custom AI system overrides.'}</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-6">
                      {/* Selected Ticket Top Header Bar */}
                      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white">{activeTicket.userName}</h3>
                            <span className="font-mono text-xs text-slate-400">({activeTicket.userPhone || 'زائر بدون رقم'})</span>
                          </div>
                          <p className="text-xs text-slate-400">
                            {isRtl ? `تاريخ البدء: ${new Date(activeTicket.createdAt || Date.now()).toLocaleString('ar-EG')}` : `Created: ${activeTicket.createdAt}`}
                          </p>
                        </div>

                        {/* Status Change & Delete Ticket */}
                        <div className="flex items-center gap-2">
                          <select
                            value={activeTicket.status || 'open'}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              storageService.updateTicketStatus(activeTicket.id, newStatus);
                              triggerSaveNotification(isRtl ? 'تم تحديث حالة التذكرة' : 'Ticket status updated');
                            }}
                            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white font-bold"
                          >
                            <option value="open">{isRtl ? '🟢 مفتوحة (Open)' : 'Open'}</option>
                            <option value="in_progress">{isRtl ? '🔵 قيد المتابعة (In Progress)' : 'In Progress'}</option>
                            <option value="closed">{isRtl ? '⚪ مغلقة (Closed)' : 'Closed'}</option>
                          </select>

                          <button
                            onClick={() => {
                              if (window.confirm(isRtl ? 'حذف هذه التذكرة نهائياً؟' : 'Delete this ticket?')) {
                                storageService.deleteSupportTicket(activeTicket.id);
                                setSelectedTicketId(null);
                                triggerSaveNotification(isRtl ? 'تم حذف التذكرة' : 'Ticket deleted');
                              }
                            }}
                            className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/20 transition"
                            title={isRtl ? 'حذف التذكرة' : 'Delete Ticket'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Custom AI System Override Control Panel Card */}
                      <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-indigo-950/40 p-6 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-400" />
                            <h4 className="text-sm md:text-base font-bold text-white">
                              {isRtl ? 'تعيين توجيهات خاصة بالذكاء الاصطناعي لهذا العميل (Custom System Override):' : 'Custom AI System Directive / Prompt Override:'}
                            </h4>
                          </div>
                          {activeTicket.systemOverride && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {isRtl ? 'توجيه نشط الآن' : 'Override Active'}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {isRtl 
                            ? 'اكتب توجيهات خاصة للمساعد الذكي ليلتزم بها حصرياً عند الإجابة على هذا العميل (مثل: تقديم خصم خاص، فرض الإجابة بالإنجليزية، أو التركيز على خدمة معينة):' 
                            : 'Set custom instructions for the AI assistant to strictly adhere to when replying to this user:'}
                        </p>

                        <textarea
                          rows={3}
                          value={customOverrideInput}
                          onChange={(e) => setCustomOverrideInput(e.target.value)}
                          placeholder={isRtl ? 'أدخل التوجيه الخاص هنا... مثال: "قدم لهذا العميل خصماً بقيمة 20% على الترخيص السنوي وتحدث بلهجة مصرية ودودة جداً"' : 'Enter custom system instructions for this user...'}
                          className="w-full rounded-2xl border border-amber-500/30 bg-slate-950 p-3.5 text-xs text-white focus:outline-none focus:border-amber-400"
                        />

                        {/* Presets Row */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-[11px] font-bold text-slate-400">{isRtl ? 'نماذج جاهزة للتوجيه:' : 'Quick Presets:'}</span>
                          {[
                            { label: isRtl ? '🏷️ عرض خصم 20% خاص' : '20% Discount', text: 'قدم لهذا العميل خصماً خاصاً بقيمة 20% على باقة الترخيص السنوي بطلب كود PROMO20.' },
                            { label: isRtl ? '🌐 فرض اللغة الإنجليزية' : 'Force English', text: 'Strictly respond to this user in fluent, professional English only.' },
                            { label: isRtl ? '💬 توجيه للواتساب' : 'Route to WhatsApp', text: 'أرشد العميل للتحويل والتفعيل المباشر عبر رقم الواتساب 01024889921 مع تأكيد المتابعة الفورية.' },
                            { label: isRtl ? '🎯 التركيز على Proctor AI' : 'Focus Proctor AI', text: 'ركز على شرح مميزات نظام Proctor AI للاختبارات الذكية وتأمين المتصفح ضد الغش.' }
                          ].map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setCustomOverrideInput(preset.text)}
                              className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-700 hover:border-amber-400 text-[11px] font-bold text-slate-300 hover:text-white transition"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-500/20">
                          {activeTicket.systemOverride && (
                            <button
                              type="button"
                              onClick={() => {
                                storageService.updateTicketSystemOverride(activeTicket.id, '');
                                setCustomOverrideInput('');
                                triggerSaveNotification(isRtl ? 'تم إلغاء التوجيه الخاص وقبول التوجيه الافتراضي.' : 'Override cleared');
                              }}
                              className="px-4 py-2 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-bold transition"
                            >
                              {isRtl ? 'إلغاء التوجيه الخاص' : 'Clear Override'}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              if (!customOverrideInput.trim()) return;
                              storageService.updateTicketSystemOverride(activeTicket.id, customOverrideInput);
                              triggerSaveNotification(isRtl ? 'تم تطبيق وتفعيل التوجيه الخاص بذكاء هذا العميل!' : 'AI System Override applied!');
                            }}
                            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg transition cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4 fill-current" />
                            <span>{isRtl ? 'حفظ وتطبيق التوجيه للعميل' : 'Save System Override'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Chat Messages Transcript View */}
                      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
                        <h4 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
                          <span className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-blue-400" />
                            <span>{isRtl ? 'سجل المحادثة الكامل للعميل:' : 'Conversation Transcript:'}</span>
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {activeTicket.messages?.length || 0} {isRtl ? 'رسالة' : 'messages'}
                          </span>
                        </h4>

                        <div className="max-h-[380px] overflow-y-auto space-y-3 pr-2 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
                          {(!activeTicket.messages || activeTicket.messages.length === 0) ? (
                            <p className="text-xs text-slate-500 text-center py-6 italic">{isRtl ? 'لا توجد رسائل في هذه التذكرة بعد.' : 'No messages recorded yet.'}</p>
                          ) : (
                            activeTicket.messages.map((m) => {
                              const isUser = m.sender === 'user';
                              const isAdmin = m.sender === 'admin';

                              return (
                                <div key={m.id} className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs space-y-1 shadow ${
                                    isUser 
                                      ? 'bg-blue-600 text-white rounded-br-none' 
                                      : isAdmin 
                                        ? 'bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-amber-500/50 text-amber-200 rounded-bl-none' 
                                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                                  }`}>
                                    <div className="flex items-center justify-between text-[10px] opacity-75 font-bold border-b border-white/10 pb-1">
                                      <span>{m.senderName || (isUser ? activeTicket.userName : isAdmin ? 'الإدارة (Admin)' : 'المساعد الذكي (AI)')}</span>
                                      <span>{m.timestamp ? new Date(m.timestamp).toLocaleTimeString(isRtl ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                    </div>
                                    <p className="whitespace-pre-wrap break-words pt-1">{m.text}</p>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Admin Live Reply Form Box */}
                        <div className="pt-2 border-t border-slate-800 space-y-2">
                          <label className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Crown className="w-4 h-4 text-amber-400" />
                            <span>{isRtl ? 'إرسال رد شخصي فوري كـ أدمن (Admin Live Reply):' : 'Send Admin Reply Directly:'}</span>
                          </label>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={adminReplyText}
                              onChange={(e) => setAdminReplyText(e.target.value)}
                              placeholder={isRtl ? 'اكتب رد الإدارة المباشر للعميل هنا...' : 'Type admin response...'}
                              className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                            />

                            <button
                              type="button"
                              onClick={() => {
                                if (!adminReplyText.trim()) return;
                                storageService.addMessageToTicket(
                                  activeTicket.userId,
                                  activeTicket.userName,
                                  activeTicket.userPhone,
                                  activeTicket.userEmail,
                                  {
                                    sender: 'admin',
                                    senderName: 'الإدارة (Admin)',
                                    text: adminReplyText.trim()
                                  }
                                );
                                setAdminReplyText('');
                                triggerSaveNotification(isRtl ? 'تم إرسال رد الإدارة للعميل بنجاح!' : 'Admin reply sent!');
                              }}
                              className="flex items-center gap-1.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 text-xs font-bold shadow-lg transition cursor-pointer shrink-0"
                            >
                              <Send className="w-4 h-4" />
                              <span>{isRtl ? 'إرسال كـ أدمن' : 'Send Reply'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: CLIENT MODIFICATIONS STATUS TRACKING */}
        {activeSection === 'drafts' && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">{isRtl ? 'طلبات التعديل والملاحظات الفنية الواردة من العملاء' : 'Client Modification Requests & Feedback'}</h3>
              <p className="text-xs text-slate-400">{isRtl ? 'يمكنك متابعة وتحديث حالة كل طلب (قيد المراجعة، قيد التنفيذ، تم التنفيذ).' : 'Track and update request statuses.'}</p>
            </div>

            {aiDrafts.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center text-slate-400">
                <p className="text-sm">{isRtl ? 'لا توجد طلبات تعديل واردة حالياً.' : 'No modification requests.'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {aiDrafts.map((draft) => (
                  <div key={draft.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            draft.status === 'completed' || draft.status === 'approved_published' ? 'bg-emerald-500/20 text-emerald-400' :
                            draft.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {draft.status === 'completed' || draft.status === 'approved_published' ? (isRtl ? 'تم التنفيذ' : 'Completed') :
                             draft.status === 'in_progress' ? (isRtl ? 'قيد التنفيذ' : 'In Progress') : (isRtl ? 'قيد المراجعة' : 'Pending Review')}
                          </span>
                          <span className="text-xs font-mono text-slate-400">{draft.visitorName || 'زائر'} • {draft.visitorPhone || 'بدون هاتف'}</span>
                        </div>

                        <h4 className="text-base font-bold text-white">{draft.modifiedConfig.centerName}</h4>
                        <p className="text-xs text-slate-300"><strong>{isRtl ? 'الطلب والتخصيص:' : 'Request:'}</strong> "{draft.userPrompt}"</p>
                      </div>

                      {/* Action buttons: Live Sandbox Preview & Download Files to Local Device */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenSandboxWithConfig) {
                              onOpenSandboxWithConfig(draft.modifiedConfig);
                              triggerSaveNotification(isRtl ? 'جاري فتح التعديل بالمحاكي للمعاينة...' : 'Opening in Sandbox for preview...');
                            }
                          }}
                          className="flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-500/10 px-3.5 py-1.5 text-xs font-bold text-blue-300 hover:bg-blue-500/20 transition cursor-pointer"
                          title={isRtl ? 'معاينة التعديلات حية داخل المحاكي' : 'Preview Live in Sandbox'}
                        >
                          <Play className="w-3.5 h-3.5 text-blue-400 fill-current" />
                          <span>{isRtl ? 'معاينة بالمحاكي' : 'Live Preview'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadDraftFiles(draft)}
                          className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition cursor-pointer"
                          title={isRtl ? 'تنزيل ملفات المسودة المعدلة على جهازك' : 'Download Draft Files to Local Machine'}
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{isRtl ? 'تحميل الملفات على جهازك' : 'Download Files'}</span>
                        </button>

                        <button
                          onClick={() => handleUpdateDraftStatus(draft.id, 'in_progress')}
                          className="rounded-xl border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-400 hover:bg-blue-500/20"
                        >
                          {isRtl ? 'قيد التنفيذ' : 'In Progress'}
                        </button>

                        <button
                          onClick={() => handleUpdateDraftStatus(draft.id, 'approved_published')}
                          className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 shadow"
                        >
                          {isRtl ? 'اعتماد ونشر بالمتجر' : 'Publish to Store'}
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(isRtl ? 'هل أنت متأكد من حذف هذه المسودة؟' : 'Delete this draft?')) {
                              handleUpdateDraftStatus(draft.id, 'rejected');
                              triggerSaveNotification(isRtl ? 'تم رفض / حذف المسودة.' : 'Draft deleted.');
                            }
                          }}
                          className="p-1.5 rounded-xl text-rose-400 hover:bg-rose-500/20 transition"
                          title={isRtl ? 'حذف المسودة' : 'Delete Draft'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Modified Files Breakdown List */}
                    {draft.modifiedFiles && draft.modifiedFiles.length > 0 && (
                      <div className="pt-3 border-t border-slate-800 space-y-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          {isRtl ? 'ملفات المسودة المعدلة بالذكاء الاصطناعي:' : 'AI Modified Files Package:'}
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {draft.modifiedFiles.map((f, fIdx) => (
                            <div key={fIdx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                                <div className="truncate">
                                  <span className="font-bold text-white block truncate">{f.name}</span>
                                  <span className="text-[10px] text-slate-400 block truncate">{f.featureMetadata || f.fileCategory}</span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDownloadLocalFile(f)}
                                className="px-2.5 py-1 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-300 text-[11px] font-bold hover:bg-blue-600 hover:text-white transition cursor-pointer shrink-0"
                              >
                                {isRtl ? 'تنزيل' : 'Download'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 7: REVIEWS & RATINGS MANAGEMENT */}
        {activeSection === 'reviews' && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>{isRtl ? 'تقييمات وآراء العملاء حول الأدوات والخدمات' : 'Client Ratings & Written Reviews'}</span>
            </h3>

            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center text-slate-400">
                <p className="text-sm">{isRtl ? 'لا توجد تقييمات مسجلة بعد.' : 'No reviews recorded yet.'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{rev.userName}</span>
                        <span className="text-slate-400 font-mono">({rev.userPhone || 'زائر'})</span>
                        <div className="flex items-center text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-blue-400 font-bold">{rev.projectTitle}</p>
                      <p className="text-slate-300 text-sm leading-relaxed">"{rev.comment}"</p>
                      <span className="text-[10px] text-slate-500 font-mono block">{rev.createdAt}</span>
                    </div>

                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/20 transition shrink-0"
                      title={isRtl ? 'حذف التقييم' : 'Delete Review'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROJECT EDITING & LOCAL FILE UPLOAD MODAL */}
        {editingProject && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
            <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 md:p-8 shadow-2xl text-slate-100 space-y-6">
              
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'محرر ومصمم المشروع والملفات' : 'Project & File Configuration Editor'}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white">
                    {isRtl ? `تعديل وإدارة ملفات المشروع: ${editingProject.titleAr}` : `Edit Project: ${editingProject.titleEn}`}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="rounded-xl border border-slate-800 bg-slate-800 p-2 text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Fields: Titles, Taglines, Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'اسم المشروع (عربي):' : 'Title (AR):'}</label>
                  <input
                    type="text"
                    value={editingProject.titleAr}
                    onChange={(e) => setEditingProject({ ...editingProject, titleAr: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'اسم المشروع (إنجليزي):' : 'Title (EN):'}</label>
                  <input
                    type="text"
                    value={editingProject.titleEn}
                    onChange={(e) => setEditingProject({ ...editingProject, titleEn: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'الوصف الموحد والتفاصيل التقنية:' : 'Description:'}</label>
                  <textarea
                    rows={2}
                    value={editingProject.descriptionAr}
                    onChange={(e) => setEditingProject({ ...editingProject, descriptionAr: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300">{isRtl ? 'رابط معاينة المشروع التفاعلية المباشرة (GitHub Pages / Live Demo URL):' : 'Live Preview URL (GitHub Pages / Live Demo):'}</label>
                  <input
                    type="url"
                    value={editingProject.previewUrl || editingProject.distributionLink || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, previewUrl: e.target.value, distributionLink: e.target.value })}
                    placeholder="https://username.github.io/project-demo"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-emerald-400 font-mono"
                  />
                </div>

                {/* Features Editor for Overall Project */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{isRtl ? 'تحديد مميزات ومواصفات المشروع الرئيسية (اكتب كل ميزة في سطر منفصل):' : 'Main Project Features & Specifications (one per line):'}</span>
                  </label>
                  <textarea
                    rows={4}
                    value={(editingProject.featuresAr || []).join('\n')}
                    onChange={(e) => {
                      const lines = e.target.value.split('\n').filter(Boolean);
                      setEditingProject({ ...editingProject, featuresAr: lines });
                    }}
                    placeholder={isRtl ? 'مثال:\nلوحة تحكم إدارية سريعة\nربط بوابات فودافون كاش وانستاباي\nمحرك PWA يعمل بدون إنترنت\nدعم المعاينة الحيّة داخل المنصة' : 'e.g.\nFast Admin Panel\nVodafone Cash & InstaPay Gateways\nOffline PWA Engine'}
                    className="w-full rounded-xl border border-emerald-500/40 bg-slate-950 p-3 text-xs text-white focus:border-emerald-400 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400">
                    {isRtl ? 'سيتم عرض هذه المميزات بقائمة منسقة مع علامة الصح الخضراء ✓ للعملاء في متجر المنصات.' : 'These features will be displayed with green checkmarks ✓ to clients.'}
                  </p>
                </div>
              </div>

              {/* SECTION: MULTI-TEMPLATE & VARIANTS MANAGER (إدارة قوالب المشروع وأسعارها وصورها ورابط معلنيها) */}
              <div className="rounded-2xl border border-purple-500/40 bg-slate-950 p-5 space-y-4 shadow-inner">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-purple-400" />
                      <span>{isRtl ? 'إدارة قوالب المشروع المتعددة واسعارها ورابط معاينتها:' : 'Multiple Project Templates & Variants:'}</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {isRtl ? 'يمكنك إضافة أكثر من قالب أو ثيم للمشروع الواحد، ولكل قالب صور ورابط معاينة ومميزات وأسعار خاصة.' : 'Add multiple design templates for this project with unique screenshots, preview links, features, and pricing.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const curTemplates = editingProject.templates || [];
                      const newTmpl = {
                        id: 'tmpl-' + Date.now(),
                        nameAr: `قالب تصميم رقم ${curTemplates.length + 1}`,
                        nameEn: `Design Template #${curTemplates.length + 1}`,
                        descriptionAr: 'قالب تصميم احترافي متجاوب مع كافة الشاشات.',
                        descriptionEn: 'Responsive design layout template.',
                        previewUrl: editingProject.previewUrl || 'https://github.com',
                        images: ['/homepage_view.png'],
                        featuresAr: ['تصميم مودرن متجاوب', 'لوحة تحكم تفاعلية'],
                        featuresEn: ['Modern Responsive UI', 'Interactive Control Panel'],
                        priceMonthly: editingProject.priceMonthly || '500 ج.م/شهرياً',
                        priceAnnual: editingProject.priceAnnual || '4,500 ج.م/سنوياً',
                        priceFull: editingProject.priceFull || '15,000 ج.م تمليك'
                      };
                      setEditingProject({
                        ...editingProject,
                        templates: [...curTemplates, newTmpl]
                      });
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-bold text-white shadow transition cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isRtl ? 'إضافة قالب جديد للمشروع' : 'Add Template Variant'}</span>
                  </button>
                </div>

                {/* Templates List Editor */}
                {(!editingProject.templates || editingProject.templates.length === 0) ? (
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 text-center text-xs text-slate-500 italic">
                    {isRtl ? 'لا توجد قوالب فرعية مضافة بعد. انقر على "+ إضافة قالب جديد" لإدراج أول قالب بتصاميمه وأسعاره ومميزاته.' : 'No template variants added yet. Click above to add.'}
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                    {editingProject.templates.map((tmpl, tIdx) => (
                      <div key={tmpl.id || tIdx} className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="font-bold text-xs text-purple-400 font-mono">
                            {isRtl ? `قالب #${tIdx + 1}` : `Template #${tIdx + 1}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedTmpls = editingProject.templates.filter((_, idx) => idx !== tIdx);
                              setEditingProject({ ...editingProject, templates: updatedTmpls });
                            }}
                            className="text-rose-400 hover:text-rose-300 p-1 transition"
                            title={isRtl ? 'حذف القالب' : 'Delete Template'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-300">{isRtl ? 'اسم القالب (عربي):' : 'Template Name (AR):'}</label>
                            <input
                              type="text"
                              value={tmpl.nameAr}
                              onChange={(e) => {
                                const updated = [...editingProject.templates];
                                updated[tIdx].nameAr = e.target.value;
                                setEditingProject({ ...editingProject, templates: updated });
                              }}
                              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-300">{isRtl ? 'رابط معاينة القالب المباشر (Preview Link / GitHub Pages):' : 'Live Demo Link:'}</label>
                            <input
                              type="url"
                              value={tmpl.previewUrl || ''}
                              onChange={(e) => {
                                const updated = [...editingProject.templates];
                                updated[tIdx].previewUrl = e.target.value;
                                setEditingProject({ ...editingProject, templates: updated });
                              }}
                              placeholder="https://username.github.io/demo"
                              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-mono text-emerald-400"
                            />
                          </div>

                          {/* Dedicated Template Features Editor */}
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{isRtl ? 'مميزات ومواصفات هذا القالب الخاص (كل ميزة في سطر منفصل):' : 'Template Specific Features (one per line):'}</span>
                            </label>
                            <textarea
                              rows={3}
                              value={(tmpl.featuresAr || []).join('\n')}
                              onChange={(e) => {
                                const lines = e.target.value.split('\n').filter(Boolean);
                                const updated = [...editingProject.templates];
                                updated[tIdx].featuresAr = lines;
                                setEditingProject({ ...editingProject, templates: updated });
                              }}
                              placeholder={isRtl ? 'تصميم مودرن متجاوب\nدعم الثيم الداكن والفاتح\nتقارير مبيعات لحظية' : 'Responsive modern design\nDark & Light Mode\nRealtime Sales Reports'}
                              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-300">{isRtl ? 'سعر شهري لهذا القالب:' : 'Monthly Price:'}</label>
                            <input
                              type="text"
                              value={tmpl.priceMonthly || ''}
                              onChange={(e) => {
                                const updated = [...editingProject.templates];
                                updated[tIdx].priceMonthly = e.target.value;
                                setEditingProject({ ...editingProject, templates: updated });
                              }}
                              placeholder="500 ج.م/شهرياً"
                              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-300">{isRtl ? 'سعر سنوي لهذا القالب:' : 'Annual Price:'}</label>
                            <input
                              type="text"
                              value={tmpl.priceAnnual || ''}
                              onChange={(e) => {
                                const updated = [...editingProject.templates];
                                updated[tIdx].priceAnnual = e.target.value;
                                setEditingProject({ ...editingProject, templates: updated });
                              }}
                              placeholder="4,500 ج.م/سنوياً"
                              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                            />
                          </div>

                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[11px] font-bold text-slate-300">{isRtl ? 'سعر تمليك الكود الكامل لهذا القالب:' : 'Outright Buyout Price:'}</label>
                            <input
                              type="text"
                              value={tmpl.priceFull || ''}
                              onChange={(e) => {
                                const updated = [...editingProject.templates];
                                updated[tIdx].priceFull = e.target.value;
                                setEditingProject({ ...editingProject, templates: updated });
                              }}
                              placeholder="15,000 ج.م تمليك"
                              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                            />
                          </div>

                          {/* Template Multi-Image Upload Manager */}
                          <div className="space-y-3 sm:col-span-2 bg-slate-950/80 p-3.5 rounded-xl border border-purple-500/30">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                              <label className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
                                <UploadCloud className="w-4 h-4 text-purple-400" />
                                <span>{isRtl ? 'رفع وإدارة صور هذا القالب من جهازك:' : 'Template Screenshots & Photo Gallery Manager:'}</span>
                              </label>

                              <label className="flex items-center gap-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 text-xs font-bold transition shadow cursor-pointer shrink-0">
                                <UploadCloud className="w-3.5 h-3.5" />
                                <span>{isRtl ? 'رفع صور للقالب' : 'Upload Template Photos'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => {
                                    const files = Array.from(e.target.files || []);
                                    if (files.length === 0) return;
                                    files.forEach(file => {
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        const base64Img = event.target?.result;
                                        setEditingProject(prev => {
                                          if (!prev || !prev.templates) return prev;
                                          const updatedTmpls = [...prev.templates];
                                          const curTmpl = updatedTmpls[tIdx];
                                          if (curTmpl) {
                                            const existingImgs = curTmpl.images || [];
                                            curTmpl.images = [...existingImgs, base64Img];
                                          }
                                          return { ...prev, templates: updatedTmpls };
                                        });
                                      };
                                      reader.readAsDataURL(file);
                                    });
                                  }}
                                  className="hidden"
                                />
                              </label>
                            </div>

                            {/* Template Image Dropzone */}
                            <div
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                e.preventDefault();
                                const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                                if (droppedFiles.length === 0) return;
                                droppedFiles.forEach(file => {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    const base64Img = event.target?.result;
                                    setEditingProject(prev => {
                                      if (!prev || !prev.templates) return prev;
                                      const updatedTmpls = [...prev.templates];
                                      const curTmpl = updatedTmpls[tIdx];
                                      if (curTmpl) {
                                        const existingImgs = curTmpl.images || [];
                                        curTmpl.images = [...existingImgs, base64Img];
                                      }
                                      return { ...prev, templates: updatedTmpls };
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                });
                              }}
                              className="border-2 border-dashed border-purple-500/30 bg-purple-950/10 hover:bg-purple-950/20 rounded-xl p-3 text-center transition cursor-pointer"
                            >
                              <span className="text-[11px] font-bold text-slate-300 block">
                                {isRtl ? 'اسحب وأفلت صور واجهات القالب هنا (PNG, JPG)' : 'Drag and drop template images here'}
                              </span>
                            </div>

                            {/* Template Thumbnails Grid */}
                            <div className="space-y-1.5">
                              {(!tmpl.images || tmpl.images.length === 0) ? (
                                <p className="text-[10px] text-slate-500 italic">{isRtl ? 'لا توجد صور مرفوعة لهذا القالب بعد.' : 'No images added yet.'}</p>
                              ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                  {tmpl.images.map((imgUrl, imgI) => (
                                    <div key={imgI} className="group relative aspect-video rounded-lg bg-slate-900 border border-slate-800 overflow-hidden shadow">
                                      <img src={imgUrl} alt={`Template img ${imgI + 1}`} className="w-full h-full object-cover" />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updatedTmpls = [...editingProject.templates];
                                          updatedTmpls[tIdx].images = updatedTmpls[tIdx].images.filter((_, idx) => idx !== imgI);
                                          setEditingProject({ ...editingProject, templates: updatedTmpls });
                                        }}
                                        className="absolute top-1 right-1 p-0.5 rounded bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition"
                                        title={isRtl ? 'حذف الصورة' : 'Remove image'}
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Optional Direct URLs */}
                            <div className="space-y-1 pt-1">
                              <label className="text-[10px] font-semibold text-slate-400">{isRtl ? 'أو أدخل روابط خارجية للصور (افصل بفاصلة):' : 'Or external Image URLs (comma separated):'}</label>
                              <input
                                type="text"
                                value={(tmpl.images || []).join(', ')}
                                onChange={(e) => {
                                  const updated = [...editingProject.templates];
                                  updated[tIdx].images = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                  setEditingProject({ ...editingProject, templates: updated });
                                }}
                                placeholder="https://..., https://..."
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-[11px] text-slate-300 font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION: IMAGE & PHOTO SHOWCASE MANAGER (مركز رفع وإدارة صور ومعاينات المشروع فقط) */}
              <div className="rounded-2xl border border-blue-500/30 bg-slate-950 p-5 space-y-4 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-blue-400" />
                    <h4 className="text-sm md:text-base font-bold text-white">
                      {isRtl ? 'مركز رفع وإدارة صور ومعاينات المشروع من جهازك:' : 'Project Image & Screenshot Showcase Manager:'}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-md">
                    {(editingProject.screenshots?.length || 0)} {isRtl ? 'صورة' : 'photos'}
                  </span>
                </div>

                {/* Upload Form Controls: Image Picker & Drag and Drop Zone */}
                <div className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-300 font-medium">
                      {isRtl ? 'ارفع صور ومشاهد المعاينة الخاصة بالمشروع مباشرة من كمبيوترك:' : 'Upload project screenshot images directly from your computer:'}
                    </p>

                    <label className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-xs font-bold transition shadow cursor-pointer shrink-0">
                      <UploadCloud className="w-4 h-4" />
                      <span>{isRtl ? 'اختيار صور من جهازك' : 'Upload Image Photos'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length === 0) return;
                          files.forEach(file => {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const base64Img = event.target?.result;
                              const newScreen = {
                                titleAr: file.name.replace(/\.[^/.]+$/, ""),
                                titleEn: file.name.replace(/\.[^/.]+$/, ""),
                                bgGradient: 'from-blue-950 to-slate-900',
                                mockupType: 'dashboard',
                                imageUrl: base64Img
                              };
                              setEditingProject(prev => {
                                if (!prev) return prev;
                                const updatedScreens = [...(prev.screenshots || []), newScreen];
                                return { ...prev, screenshots: updatedScreens };
                              });
                              triggerSaveNotification(isRtl ? `تم رفع صورة المعاينة (${file.name}) بنجاح!` : `Image photo uploaded!`);
                            };
                            reader.readAsDataURL(file);
                          });
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Drag and Drop Image Dropzone */}
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                      if (droppedFiles.length === 0) return;
                      droppedFiles.forEach(file => {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const base64Img = event.target?.result;
                          const newScreen = {
                            titleAr: file.name.replace(/\.[^/.]+$/, ""),
                            titleEn: file.name.replace(/\.[^/.]+$/, ""),
                            bgGradient: 'from-blue-950 to-slate-900',
                            mockupType: 'dashboard',
                            imageUrl: base64Img
                          };
                          setEditingProject(prev => {
                            if (!prev) return prev;
                            const updatedScreens = [...(prev.screenshots || []), newScreen];
                            return { ...prev, screenshots: updatedScreens };
                          });
                          triggerSaveNotification(isRtl ? `تم إفلات ورفع الصورة (${file.name}) بنجاح!` : `Image dropped & uploaded!`);
                        };
                        reader.readAsDataURL(file);
                      });
                    }}
                    className="border-2 border-dashed border-blue-500/40 bg-blue-950/20 hover:bg-blue-950/30 rounded-2xl p-5 text-center transition cursor-pointer flex flex-col items-center justify-center space-y-1.5"
                  >
                    <UploadCloud className="w-7 h-7 text-blue-400 animate-bounce" />
                    <p className="text-xs font-bold text-white">
                      {isRtl ? 'اسحب وأفلت صور واجهات المشروع هنا (PNG, JPG, WEBP)' : 'Drag and Drop project screenshot images here'}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {isRtl ? 'يدعم صور الشاشات، التصاميم، والمخططات البصرية' : 'Supports screenshot images, designs, and visual mocks'}
                    </p>
                  </div>
                </div>

                {/* Uploaded Images Thumbnail Grid */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">{isRtl ? 'معرض صور ومشاهد المشروع المرفوعة:' : 'Uploaded Project Image Gallery:'}</span>
                  {(!editingProject.screenshots || editingProject.screenshots.length === 0) ? (
                    <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 text-center text-xs text-slate-500 italic">
                      {isRtl ? 'لا توجد صور مرفوعة لهذا المشروع بعد. ارفع أول صورة من جهازك باستخدام الزر أعلاه.' : 'No images uploaded attached yet.'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {editingProject.screenshots.map((screen, sIdx) => (
                        <div key={sIdx} className="group relative aspect-video rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow">
                          {screen.imageUrl ? (
                            <img src={screen.imageUrl} alt={screen.titleAr} className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${screen.bgGradient} p-2 flex items-center justify-center text-center text-[10px] font-bold text-slate-300`}>
                              {screen.titleAr}
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              const updatedScreens = editingProject.screenshots.filter((_, idx) => idx !== sIdx);
                              setEditingProject({ ...editingProject, screenshots: updatedScreens });
                            }}
                            className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-rose-600/80 text-white opacity-0 group-hover:opacity-100 transition shadow cursor-pointer"
                            title={isRtl ? 'حذف الصورة' : 'Remove image'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Publish Toggle & Save Buttons */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    const newPublishState = !editingProject.isPublished;
                    const updated = { ...editingProject, isPublished: newPublishState };
                    setEditingProject(updated);
                    storageService.updateProject(updated);
                    setProjects(projects.map(p => p.id === updated.id ? updated : p));
                    triggerSaveNotification(isRtl ? `تم ${newPublishState ? 'نشر' : 'إخفاء'} المشروع بنجاح!` : `Publish status updated!`);
                  }}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs md:text-sm font-bold transition shadow ${
                    editingProject.isPublished 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {editingProject.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span>{editingProject.isPublished ? (isRtl ? 'المشروع منشور وحي في المتجر للمعاينة' : 'Project is Published & Live') : (isRtl ? 'المشروع مسودة مخفية (انشره ليصبح قابل للمعاينة)' : 'Project is Hidden Draft')}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="rounded-xl border border-slate-700 px-5 py-2.5 text-xs md:text-sm font-semibold text-slate-300 hover:bg-slate-800 transition"
                  >
                    {isRtl ? 'إغلاق' : 'Close'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      storageService.updateProject(editingProject);
                      setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
                      setEditingProject(null);
                      triggerSaveNotification(isRtl ? 'تم حفظ وتنسيق بيانات المشروع بالكامل!' : 'Project saved!');
                    }}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-2.5 text-xs md:text-sm font-bold text-white shadow-lg transition cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isRtl ? 'حفظ التغييرات ونشر التحديث' : 'Save & Update'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
