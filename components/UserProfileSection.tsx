/**
 * Next.js Project Structure Identifier:
 * components/UserProfileSection.tsx
 * 
 * Project Identity: ليرن ويب | Lern Web
 * Purpose: Client Profile section within Client Dashboard:
 *          - Device image file upload for profile picture (رفع صورة الملف من الجهاز)
 *          - Dedicated Activity Log (سجل النشاط) with login timestamps, profile updates, and order execution dates
 *          - Account settings, direct administration messaging, and session safety.
 */

import React, { useState } from 'react';
import { 
  User, Phone, Mail, Calendar, Rocket, ShieldCheck, 
  Save, CheckCircle2, AlertCircle, Edit3, Clock, Sparkles, LogOut, Trash2, BarChart3,
  MessageSquare, Send, Upload, Camera, Package, Globe, Check, History, Activity, ShieldAlert,
  X, Filter, FileCheck, FileSpreadsheet, FileText, Download, Printer, Search,
  Copy, ExternalLink, Key, Award, Eye, EyeOff
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { storageService } from '../src/services/storageService';
import JoinPlatformForm from '../src/components/JoinPlatformForm';

interface UserProfileSectionProps {
  currentUser?: any;
  userDraftsCount?: number;
  lang?: 'ar' | 'en';
  onUserUpdated?: (updated: any) => void;
  onLogout?: () => void;
}

export default function UserProfileSection({ 
  currentUser, 
  userDraftsCount = 0, 
  lang = 'ar',
  onUserUpdated = (_updated: any) => {},
  onLogout = () => {}
}: UserProfileSectionProps) {
  const isRtl = lang === 'ar';
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [supportMsgInput, setSupportMsgInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activityFilter, setActivityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLinkKey, setCopiedLinkKey] = useState<string | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passErrorMsg, setPassErrorMsg] = useState('');
  const [passSuccessMsg, setPassSuccessMsg] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPassErrorMsg('');
    setPassSuccessMsg('');

    if (currentUser?.password && currentPassword !== currentUser.password) {
      setPassErrorMsg(isRtl ? 'كلمة المرور الحالية غير صحيحة' : 'Current password is incorrect');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setPassErrorMsg(isRtl ? 'كلمة المرور الجديدة يجب أن تتكون من 4 خانات أو أرقام على الأقل' : 'New password must be at least 4 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassErrorMsg(isRtl ? 'كلمة المرور الجديدة وتأكيدها غير متطابقين' : 'New password and confirmation do not match');
      return;
    }

    setIsChangingPass(true);
    try {
      const updated = storageService.updateUserProfile(currentUser.id, {
        password: newPassword
      });

      storageService.addActivityLog(
        'user_updated' as any,
        `قام العميل (${currentUser.name}) بتغيير كلمة المرور الخاصة بحسابه بنجاح`,
        `User (${currentUser.name}) changed account password successfully`
      );

      if (updated) {
        onUserUpdated(updated);
        setPassSuccessMsg(isRtl ? 'تم تغيير كلمة المرور بنجاح!' : 'Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPassSuccessMsg(''), 4000);
      } else {
        setPassErrorMsg(isRtl ? 'تعذر حفظ كلمة المرور، حاول مجدداً' : 'Failed to update password');
      }
    } catch {
      setPassErrorMsg(isRtl ? 'حدث خطأ أثناء تغيير كلمة المرور' : 'Error updating password');
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLinkKey(key);
    setTimeout(() => setCopiedLinkKey(null), 2500);
  };

  const activityData = [
    { day: isRtl ? 'السبت' : 'Sat', hours: 2 },
    { day: isRtl ? 'الأحد' : 'Sun', hours: 4 },
    { day: isRtl ? 'الاثنين' : 'Mon', hours: 3 },
    { day: isRtl ? 'الثلاثاء' : 'Tue', hours: 5 },
    { day: isRtl ? 'الأربعاء' : 'Wed', hours: 2 },
    { day: isRtl ? 'الخميس' : 'Thu', hours: 6 },
    { day: isRtl ? 'الجمعة' : 'Fri', hours: 1 },
  ];

  const formattedRegDate = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : (isRtl ? 'اليوم' : 'Today');

  // Handle uploading avatar directly from device file picker
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(isRtl ? 'حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت' : 'File too large, please select an image under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const base64 = event.target?.result as string;
      if (!base64) return;
      setAvatarUrl(base64);
      
      if (currentUser?.id) {
        const updated = storageService.updateUserProfile(currentUser.id, {
          avatarUrl: base64
        });

        // Record Activity Log Entry
        storageService.addActivityLog(
          'user_updated' as any,
          `قام العميل (${currentUser.name}) برفع صورة شخصية جديدة من جهازه`,
          `User (${currentUser.name}) uploaded a new profile picture from device`,
          `تاريخ التحديث: ${new Date().toLocaleString()}`
        );

        if (updated) {
          onUserUpdated(updated);
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 3000);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    if (currentUser?.id) {
      const updated = storageService.updateUserProfile(currentUser.id, {
        avatarUrl: ''
      });
      if (updated) {
        onUserUpdated(updated);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage(isRtl ? 'يرجى إدخال الاسم الكامل' : 'Please enter your full name');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage(isRtl ? 'يرجى إدخال رقم الهاتف' : 'Please enter your phone number');
      return;
    }

    if (currentUser?.id) {
      const updated = storageService.updateUserProfile(currentUser.id, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        avatarUrl: avatarUrl
      });

      // Record Activity Log
      storageService.addActivityLog(
        'user_updated' as any,
        `تحديث بيانات حساب العميل (${name.trim()})`,
        `Account profile updated for user (${name.trim()})`
      );

      if (updated) {
        onUserUpdated(updated);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3500);
      }
    }
  };

  // Dynamic Client Activity Log entries & Purchased Platforms
  const userOrders = storageService.getUserOrders().filter(o => o.userId === currentUser?.id);
  const userDrafts = storageService.getAiDrafts().filter(d => d.visitorId === currentUser?.id);
  const officialSystems = currentUser?.purchasedSystems || [];

  const unifiedPurchasedPlatforms = [
    ...officialSystems.map((sys: any) => ({
      id: sys.id,
      titleAr: sys.platformNameAr || sys.projectTitleAr || sys.title,
      titleEn: sys.platformNameEn || sys.projectTitleEn || sys.title,
      category: sys.category || 'lms',
      planType: sys.planType || 'full',
      amount: sys.amount || '',
      licenseKey: sys.licenseKey || 'LERN-2026-CERTIFIED',
      certificateNumber: sys.certificateNumber || 'CERT-LW-2026-ACTIVE',
      status: sys.status || 'active',
      isConfirmed: true,
      confirmedAt: sys.confirmedAt || sys.purchasedAt || sys.date,
      vercelUrl: sys.generatedVercelUrl || (sys.platformNameEn ? `https://${sys.platformNameEn.toLowerCase().replace(/[^a-z0-9-]/g, '')}.vercel.app` : 'https://vercel.app'),
      notes: sys.notes
    })),
    ...userOrders
      .filter((ord: any) => ord.status !== 'confirmed')
      .map((ord: any) => ({
        id: ord.id,
        titleAr: ord.platformNameAr || ord.projectTitle || (isRtl ? 'منصة قيد المراجعة والتحقق' : 'Platform Under Verification'),
        titleEn: ord.platformNameEn || ord.projectTitle || 'Platform Under Verification',
        category: 'lms',
        planType: ord.planType || 'annual',
        amount: ord.amount || '',
        licenseKey: isRtl ? 'يُولد فور اعتماد السداد' : 'Generated upon approval',
        certificateNumber: isRtl ? 'قيد المراجعة' : 'Pending',
        status: ord.status || 'pending',
        isConfirmed: false,
        confirmedAt: ord.createdAt,
        vercelUrl: ord.generatedVercelUrl || (ord.platformNameEn ? `https://${ord.platformNameEn.toLowerCase().replace(/[^a-z0-9-]/g, '')}.vercel.app` : 'https://vercel.app'),
        senderPhone: ord.senderPhone,
        referenceId: ord.referenceId,
        paymentMethod: ord.paymentMethod,
        notes: ord.adminNotes
      }))
  ];
  const purchasedSystems = unifiedPurchasedPlatforms;

  const rawLogs = [
    {
      id: 'act-login-latest',
      category: 'login',
      titleAr: 'تسجيل دخول ناجح إلى حسابك',
      titleEn: 'Successful Account Sign In',
      detailsAr: 'تم تسجيل الدخول إلى منصة ليرن ويب بنجاح من متصفحك الحالي.',
      detailsEn: 'Signed in successfully to Lern Web from your current browser.',
      timestamp: currentUser?.createdAt ? new Date().toISOString() : new Date().toISOString(),
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: Clock
    },
    {
      id: 'act-profile-mod',
      category: 'profile',
      titleAr: 'تعديل بيانات الحساب وصورة الملف الشخصي',
      titleEn: 'Profile & Avatar Modification',
      detailsAr: `الاسم المسجل: ${currentUser?.name || name} | الهاتف: ${currentUser?.phone || phone}`,
      detailsEn: `Registered Name: ${currentUser?.name || name} | Phone: ${currentUser?.phone || phone}`,
      timestamp: currentUser?.createdAt || new Date().toISOString(),
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      icon: Edit3
    },
    ...(currentUser?.isVerified ? [{
      id: 'act-verified',
      category: 'verification',
      titleAr: 'تأكيد وتوثيق الحساب من إدارة المنصة',
      titleEn: 'Account Verification Confirmed',
      detailsAr: 'حسابك موثق رسمياً وتم تفعيل كافة الصلاحيات المتقدمة.',
      detailsEn: 'Account officially verified with enhanced privileges enabled.',
      timestamp: currentUser?.verifiedAt || new Date().toISOString(),
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      icon: ShieldCheck
    }] : []),
    ...userOrders.map((o, idx) => ({
      id: `act-order-${o.id || idx}`,
      category: 'order',
      titleAr: `تنفيذ طلب شراء: ${o.projectTitle || o.planType}`,
      titleEn: `Order Placed: ${o.projectTitle || o.planType}`,
      detailsAr: `طريقة الدفع: ${o.paymentMethod} | المبلغ: ${o.amount} | الحالة: ${o.status}`,
      detailsEn: `Payment: ${o.paymentMethod} | Amount: ${o.amount} | Status: ${o.status}`,
      timestamp: o.createdAt || new Date().toISOString(),
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      icon: Package
    })),
    ...userDrafts.map((d, idx) => ({
      id: `act-draft-${d.id || idx}`,
      category: 'order',
      titleAr: `مسودة تخصيص بالذكاء الاصطناعي: ${d.modifiedConfig?.centerName || d.projectTitle}`,
      titleEn: `AI Customization Staged: ${d.modifiedConfig?.centerName || d.projectTitle}`,
      detailsAr: `حالة الطلب: ${d.status} | نص الطلب: "${d.userPrompt.slice(0, 60)}..."`,
      detailsEn: `Status: ${d.status} | Prompt: "${d.userPrompt.slice(0, 60)}..."`,
      timestamp: d.forkedAt || new Date().toISOString(),
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      icon: Rocket
    }))
  ];

  const filteredLogs = rawLogs.filter(log => {
    const matchesCategory = activityFilter === 'all' || log.category === activityFilter;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const titleAr = (log.titleAr || '').toLowerCase();
    const titleEn = (log.titleEn || '').toLowerCase();
    const detailsAr = (log.detailsAr || '').toLowerCase();
    const detailsEn = (log.detailsEn || '').toLowerCase();
    const category = (log.category || '').toLowerCase();
    const timestamp = new Date(log.timestamp).toLocaleString().toLowerCase();

    return (
      titleAr.includes(q) ||
      titleEn.includes(q) ||
      detailsAr.includes(q) ||
      detailsEn.includes(q) ||
      category.includes(q) ||
      timestamp.includes(q)
    );
  });

  const filteredSystems = purchasedSystems.filter((sys: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const titleAr = (sys.titleAr || sys.title || '').toLowerCase();
    const titleEn = (sys.titleEn || sys.title || '').toLowerCase();
    const license = (sys.licenseKey || sys.license || '').toLowerCase();
    const vercel = (sys.vercelUrl || '').toLowerCase();
    const status = (sys.status || '').toLowerCase();

    return titleAr.includes(q) || titleEn.includes(q) || license.includes(q) || vercel.includes(q) || status.includes(q);
  });

  // Handle Exporting Activity Log to Excel (CSV with UTF-8 BOM)
  const handleExportCSV = () => {
    const headers = isRtl 
      ? ['المعرف', 'الفئة', 'عنوان النشاط', 'التفاصيل', 'التاريخ والوقت']
      : ['ID', 'Category', 'Activity Title', 'Details', 'Timestamp'];

    const rows = filteredLogs.map((log) => {
      const formattedDate = new Date(log.timestamp).toLocaleString(isRtl ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      return [
        `"${log.id}"`,
        `"${log.category.toUpperCase()}"`,
        `"${(isRtl ? log.titleAr : log.titleEn).replace(/"/g, '""')}"`,
        `"${(isRtl ? log.detailsAr : log.detailsEn).replace(/"/g, '""')}"`,
        `"${formattedDate}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `sijill_alnashat_lernweb_${currentUser?.name || 'client'}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Record Activity
    storageService.addActivityLog(
      'user_updated' as any,
      `قام العميل بطلب وتصدير سجل النشاط بفرمت Excel (CSV)`,
      `User exported activity log report in Excel (CSV) format`
    );
  };

  // Handle Exporting Activity Log to PDF / Printable View
  const handleExportPDF = () => {
    const dateStr = new Date().toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const rowsHtml = filteredLogs.map((log, idx) => {
      const formattedDate = new Date(log.timestamp).toLocaleString(isRtl ? 'ar-EG' : 'en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      return `
        <tr style="border-bottom: 1px solid #e2e8f0; ${idx % 2 === 0 ? 'background-color: #f8fafc;' : ''}">
          <td style="padding: 10px 12px; font-weight: bold; color: #2563eb;">#${idx + 1}</td>
          <td style="padding: 10px 12px;"><span style="display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; background: #e0e7ff; color: #3730a3;">${log.category.toUpperCase()}</span></td>
          <td style="padding: 10px 12px; font-weight: bold; color: #0f172a;">${isRtl ? log.titleAr : log.titleEn}</td>
          <td style="padding: 10px 12px; color: #334155; font-size: 12px;">${isRtl ? log.detailsAr : log.detailsEn}</td>
          <td style="padding: 10px 12px; font-family: monospace; font-size: 12px; color: #64748b; white-space: nowrap;">${formattedDate}</td>
        </tr>
      `;
    }).join('');

    const filterLabelMapAr: Record<string, string> = {
      all: 'الكل (جميع الأحداث)',
      login: 'تسجيل دخول',
      profile: 'تحديث بيانات',
      order: 'طلب جديد وتنفيذ العمليات',
      verification: 'تأكيد التوثيق'
    };
    const currentFilterLabel = isRtl 
      ? (filterLabelMapAr[activityFilter] || 'الكل') 
      : activityFilter.toUpperCase();

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="${isRtl ? 'rtl' : 'ltr'}" lang="${isRtl ? 'ar' : 'en'}">
      <head>
        <meta charset="utf-8">
        <title>${isRtl ? 'تقرير سجل النشاط التفصيلي - ليرن ويب' : 'Detailed Activity Log Report - Lern Web'}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 30px; color: #0f172a; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563eb; padding-bottom: 15px; margin-bottom: 20px; }
          .brand { font-size: 22px; font-weight: 900; color: #1e40af; }
          .subtitle { font-size: 12px; color: #64748b; }
          .meta-card { background: #f1f5f9; border-radius: 12px; padding: 15px; margin-bottom: 25px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; font-size: 13px; }
          .meta-item { display: flex; flex-direction: column; }
          .meta-label { font-size: 11px; color: #64748b; font-weight: bold; }
          .meta-val { font-weight: bold; color: #0f172a; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; text-align: ${isRtl ? 'right' : 'left'}; }
          th { background: #1e293b; color: #ffffff; padding: 12px; font-weight: bold; font-size: 12px; }
          .footer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #cbd5e1; font-size: 11px; color: #64748b; text-align: center; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">ليرن ويب | LERN WEB</div>
            <div class="subtitle">${isRtl ? 'تقرير شفافية الحساب وسجل النشاط التفصيلي للعميل' : 'Client Detailed Activity Log & Audit Report'}</div>
          </div>
          <button class="no-print" onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer;">
            ${isRtl ? '🖨️ طباعة / حفظ PDF' : '🖨️ Print / Save PDF'}
          </button>
        </div>

        <div class="meta-card">
          <div class="meta-item">
            <span class="meta-label">${isRtl ? 'اسم العميل:' : 'Client Name:'}</span>
            <span class="meta-val">${currentUser?.name || (isRtl ? 'عميل المنظومة' : 'Valued Client')}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">${isRtl ? 'الهاتف / المعرف:' : 'Phone / ID:'}</span>
            <span class="meta-val">${currentUser?.phone || ''} (${currentUser?.id || 'client-id'})</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">${isRtl ? 'توع التصفية:' : 'Filter Applied:'}</span>
            <span class="meta-val" style="color: #2563eb;">${currentFilterLabel}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">${isRtl ? 'تاريخ التصدير:' : 'Export Date:'}</span>
            <span class="meta-val">${dateStr}</span>
          </div>
        </div>

        <h3 style="font-size: 16px; margin-bottom: 10px; color: #1e293b;">
          ${isRtl ? 'تفاصيل سجل الأحداث والعمليات (' + filteredLogs.length + ' سجل):' : 'Logged Events & Operations (' + filteredLogs.length + ' logs):'}
        </h3>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>${isRtl ? 'الفئة' : 'Category'}</th>
              <th>${isRtl ? 'عنوان النشاط' : 'Activity Title'}</th>
              <th>${isRtl ? 'التفاصيل' : 'Details'}</th>
              <th>${isRtl ? 'التاريخ والوقت' : 'Timestamp'}</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer">
          ${isRtl ? 'تم إصدار هذا المستند أوتوماتيكياً من منصة ليرن ويب (Lern Web Cloud) لتعزيز الشفافية والتحكم للعميل.' : 'Document automatically generated by Lern Web Cloud for client transparency and compliance.'}
        </div>

        <script>
          setTimeout(() => { window.print(); }, 500);
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();

    // Record Activity
    storageService.addActivityLog(
      'user_updated' as any,
      `قام العميل بطلب وتصدير سجل النشاط بفرمت PDF`,
      `User exported activity log report in PDF format`
    );
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-8 animate-fadeIn">
      {/* Section Header with Profile Avatar & Upload from Device */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-800 p-0.5 shadow-2xl overflow-hidden shrink-0 flex items-center justify-center text-white font-black text-3xl border border-blue-400/30">
              {avatarUrl ? (
                <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover rounded-[22px]" />
              ) : (
                <span>{(name || 'U').charAt(0).toUpperCase()}</span>
              )}
            </div>

            {/* Direct Device Upload Button */}
            <label 
              className="absolute -bottom-2 -left-2 flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xl border border-blue-400/50 cursor-pointer transition active:scale-95 z-10"
              title={isRtl ? 'رفع صورة ملفك من جهازك' : 'Upload image from device'}
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isRtl ? 'رفع من الجهاز' : 'Upload'}</span>
              <input type="file" accept="image/*" onChange={handleAvatarFileUpload} className="hidden" />
            </label>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 px-3 py-0.5 text-xs font-bold text-blue-300">
                <User className="w-3.5 h-3.5" />
                <span>{isRtl ? 'صورة ومستندات الحساب' : 'Profile Avatar'}</span>
              </span>

              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10 text-xs font-semibold cursor-pointer"
                  title={isRtl ? 'حذف الصورة الشخصية' : 'Remove Avatar'}
                >
                  <X className="w-3.5 h-3.5 inline" />
                  <span className="hidden sm:inline mr-1">{isRtl ? 'إزالة الصورة' : 'Remove'}</span>
                </button>
              )}
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-white">
              {name || (isRtl ? 'عميلنا العزيز' : 'Valued Client')}
            </h3>

            <p className="text-xs text-slate-300 font-mono flex items-center gap-2">
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{phone || 'غير مسجل'}</span>
              {email && <span className="text-slate-500">• {email}</span>}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <label className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg cursor-pointer transition active:scale-95">
            <Camera className="w-4 h-4" />
            <span>{isRtl ? 'اختر صورة من الجهاز 📁' : 'Browse Device Image 📁'}</span>
            <input type="file" accept="image/*" onChange={handleAvatarFileUpload} className="hidden" />
          </label>

          <span className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 text-xs font-bold text-emerald-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
            <span>{isRtl ? 'حساب عميل موثق' : 'Verified Client'}</span>
          </span>
        </div>
      </div>

      {/* Profile Summary Cards (Metrics Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">{isRtl ? 'تاريخ انضمام الحساب' : 'Registration Date'}</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-lg md:text-xl font-bold text-white">
            {formattedRegDate}
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{isRtl ? 'عضوية نشطة في المنظومة' : 'Active platform member'}</span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">{isRtl ? 'إجمالي نشر المنصات والمشاريع' : 'Total Deployments'}</span>
            <Rocket className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{userDraftsCount}</span>
            <span className="text-xs font-bold text-purple-400">{isRtl ? 'منصة / تعديل' : 'Deployments'}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {isRtl ? 'طلبات التخصيص والنشر المرسلة للأدمن' : 'AI customization drafts and deployments'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">{isRtl ? 'معرف العميل (Client ID)' : 'Account Reference ID'}</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-sm font-bold text-amber-400 truncate">
            {currentUser?.id || 'u-client-001'}
          </div>
          <p className="text-[11px] text-slate-400">
            {isRtl ? 'مرجع دعم وتفعيل التراخيص والخدمات' : 'Reference for technical support & licenses'}
          </p>
        </div>
      </div>

      {/* DEDICATED ACTIVITY LOG SECTION (سجل النشاط والشفافية مع خيارات التصدير) */}
      <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 p-6 md:p-8 space-y-5 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400 border border-blue-500/30">
              <History className="w-4 h-4 text-blue-400" />
              <span>{isRtl ? 'سجل النشاط والشفافية والتحكم' : 'Account Activity & Audit Trail'}</span>
            </div>
            <h4 className="text-xl md:text-2xl font-black text-white">
              {isRtl ? 'سجل النشاط والعمليات بالحساب' : 'Your Activity History & Transparency Logs'}
            </h4>
            <p className="text-xs md:text-sm text-slate-300">
              {isRtl 
                ? 'تتبع كامل لتواريخ تسجيل الدخول، تعديلات بيانات الحساب والصورة، وتواريخ تنفيذ الطلبات والمنصات.' 
                : 'Track login timestamps, profile & avatar modifications, and order execution records.'}
            </p>
          </div>

          {/* Export Action Buttons (PDF & Excel) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-md transition active:scale-95 cursor-pointer"
              title={isRtl ? 'تصدير وحفظ التقرير كملف PDF' : 'Export & Save report as PDF'}
            >
              <FileText className="w-4 h-4" />
              <span>{isRtl ? 'تصدير PDF 📄' : 'Export PDF 📄'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md transition active:scale-95 cursor-pointer"
              title={isRtl ? 'تصدير السجل إلى جدول إكسيل (CSV)' : 'Export log to Excel spreadsheet (CSV)'}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{isRtl ? 'تصدير Excel 📊' : 'Export Excel 📊'}</span>
            </button>
          </div>
        </div>

        {/* Dedicated Search Bar for Activity Logs & Order History */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-blue-400 absolute right-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl 
                ? '🔍 ابحث في تاريخ الطلبات، سجل الدخول، المشتريات وتعديلات الحساب...' 
                : '🔍 Search order history, login records, purchases, and profile updates...'}
              className="w-full rounded-2xl border border-blue-500/40 bg-slate-900/90 pr-10 pl-10 py-3 text-xs md:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title={isRtl ? 'مسح البحث' : 'Clear search'}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {searchQuery.trim() && (
            <div className="text-[11px] text-blue-300 font-bold flex items-center justify-between px-1">
              <span>
                {isRtl 
                  ? `نتائج مطابقة للبحث "${searchQuery}": (${filteredLogs.length} سجل نشاط، ${filteredSystems.length} منصات/طلبات)` 
                  : `Results for "${searchQuery}": (${filteredLogs.length} activity logs, ${filteredSystems.length} orders)`}
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-amber-400 hover:text-amber-300 underline cursor-pointer"
              >
                {isRtl ? 'إلغاء البحث ✕' : 'Clear Search ✕'}
              </button>
            </div>
          )}
        </div>

        {/* Filters and Search toolbar */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
          <span className="text-xs text-slate-400 font-bold hidden sm:inline">
            {isRtl ? `عدد الأحداث: (${filteredLogs.length})` : `Total Events: (${filteredLogs.length})`}
          </span>

          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'all', labelAr: 'الكل 🌐', labelEn: 'All' },
              { id: 'login', labelAr: 'تسجيل دخول 🔑', labelEn: 'Login' },
              { id: 'profile', labelAr: 'تحديث بيانات 📝', labelEn: 'Profile Updates' },
              { id: 'order', labelAr: 'طلب جديد 🛒', labelEn: 'New Orders' },
              { id: 'verification', labelAr: 'توثيق الحساب 🛡️', labelEn: 'Verification' }
            ].map(f => {
              const count = rawLogs.filter(l => f.id === 'all' || l.category === f.id).length;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActivityFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    activityFilter === f.id 
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/30' 
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{isRtl ? f.labelAr : f.labelEn}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    activityFilter === f.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Activity Timeline Items */}
        <div className="space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-xs space-y-2">
              <p>{isRtl ? 'لا توجد سجلات نشاط مطابقة للبحث أو التصفية المختارة' : 'No activity logs matching selected search or filter'}</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-1 rounded-xl bg-blue-600/30 text-blue-300 hover:bg-blue-600/50 text-xs font-bold transition cursor-pointer"
                >
                  {isRtl ? 'إعادة ضبط البحث' : 'Reset Search'}
                </button>
              )}
            </div>
          ) : (
            filteredLogs.map((log) => {
              const LogIcon = log.icon || Activity;
              const formattedDate = new Date(log.timestamp).toLocaleString(isRtl ? 'ar-EG' : 'en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div 
                  key={log.id} 
                  className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 hover:bg-slate-900 transition flex items-start justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                      <LogIcon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${log.badgeColor}`}>
                          {log.category.toUpperCase()}
                        </span>
                        <h5 className="font-bold text-sm text-white">{isRtl ? log.titleAr : log.titleEn}</h5>
                      </div>
                      <p className="text-xs text-slate-300">{isRtl ? log.detailsAr : log.detailsEn}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500 inline" />
                      <span>{formattedDate}</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Purchased Systems & Platforms List - Section 4: My Purchased Platforms */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-400" />
              <span>{isRtl ? 'منصاتي المشتراة والمفعلة (إدارة الأنظمة والروابط)' : 'My Purchased Platforms (Systems & Live Links)'}</span>
            </h4>
            <p className="text-xs text-slate-400">
              {isRtl 
                ? 'استعراض كافة المنصات المشتراة، أنظمة الاشتراك، روابط الإنتاج Vercel، ومفاتيح التراخيص الرسمية.' 
                : 'Manage your acquired platforms, active subscription tiers, production Vercel URLs, and license certificates.'}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
            {filteredSystems.length} {isRtl ? 'منصة مسجلة' : 'Registered Platforms'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSystems.length === 0 ? (
            <div className="col-span-full text-center py-12 rounded-xl border border-dashed border-slate-800 bg-slate-900/50 space-y-3">
              <Package className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-400 font-medium">
                {isRtl ? 'لا توجد أنظمة أو طلبات شراء مسجلة حالياً' : 'No purchased systems found yet.'}
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isRtl 
                  ? 'يمكنك تصفح متجر المنصات واختيار نموذجك المفضل وطلب التفعيل بالدفع اليدوي السريع.' 
                  : 'Browse our project store, customize your platform name, and checkout via manual wallet payment.'}
              </p>
            </div>
          ) : (
            filteredSystems.map((sys: any, idx: number) => {
              const isPending = sys.status === 'pending';
              const isRejected = sys.status === 'rejected';
              const isActive = sys.status === 'active' || sys.status === 'confirmed' || (!isPending && !isRejected);
              const tierLabel = sys.planType === 'monthly'
                ? (isRtl ? 'اشتراك شهري' : 'Monthly Tier')
                : sys.planType === 'annual'
                ? (isRtl ? 'اشتراك سنوي (خصم خاص)' : 'Annual Subscription')
                : (isRtl ? 'تمليك دائم مدى الحياة' : 'Lifetime Ownership');

              const vercelLink = sys.vercelUrl || (sys.titleEn ? `https://${sys.titleEn.toLowerCase().replace(/[^a-z0-9-]/g, '')}.vercel.app` : 'https://vercel.app');

              return (
                <div 
                  key={sys.id || idx} 
                  className={`rounded-2xl border p-5 space-y-4 flex flex-col justify-between transition-all duration-300 ${
                    isActive 
                      ? 'border-emerald-500/30 bg-slate-900/90 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-950/20' 
                      : isRejected
                      ? 'border-rose-500/30 bg-rose-950/10'
                      : 'border-amber-500/30 bg-slate-900/90 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-950/20'
                  }`}
                >
                  {/* Top Bar: Badges & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {tierLabel}
                      </span>
                      {sys.amount && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                          {sys.amount}
                        </span>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div>
                      {isActive && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>{isRtl ? 'مفعل وجاهز للعمل' : 'Active & Deployed'}</span>
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                          <Clock className="w-3 h-3 text-amber-400 animate-spin" />
                          <span>{isRtl ? 'قيد المراجعة والتحقق' : 'Under Verification'}</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                          <AlertCircle className="w-3 h-3" />
                          <span>{isRtl ? 'مرفوض / يحتاج تعديل' : 'Rejected'}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Platform Titles */}
                  <div className="space-y-1">
                    <h5 className="font-bold text-base text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{isRtl ? (sys.titleAr || sys.title) : (sys.titleEn || sys.title)}</span>
                    </h5>
                    {sys.titleEn && sys.titleAr && (
                      <p className="text-xs text-slate-400 font-mono">
                        {isRtl ? sys.titleEn : sys.titleAr}
                      </p>
                    )}
                  </div>

                  {/* Generated Production Vercel Link Box */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1 text-blue-400">
                        <Globe className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'رابط الإنتاج المباشر (Vercel):' : 'Production Vercel Link:'}</span>
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {isActive ? (isRtl ? 'رابط حي' : 'Live') : (isRtl ? 'محجوز لك' : 'Reserved')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                      <span className="text-xs font-mono text-cyan-300 truncate select-all dir-ltr" dir="ltr">
                        {vercelLink}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyText(vercelLink, `vercel-${sys.id || idx}`)}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition flex items-center gap-1 text-[10px]"
                          title={isRtl ? 'نسخ الرابط' : 'Copy URL'}
                        >
                          {copiedLinkKey === `vercel-${sys.id || idx}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={vercelLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded hover:bg-slate-800 text-blue-400 hover:text-blue-300 transition"
                          title={isRtl ? 'فتح الرابط في نافذة جديدة' : 'Open in new tab'}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* License & Certification Details */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-1">
                      <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                        <Key className="w-3 h-3 text-amber-400" />
                        <span>{isRtl ? 'مفتاح الترخيص:' : 'License Key:'}</span>
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-slate-200 text-[11px] truncate select-all">
                          {sys.licenseKey || sys.license || 'LERN-2026-CERTIFIED'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(sys.licenseKey || sys.license || 'LERN-2026-CERTIFIED', `lic-${sys.id || idx}`)}
                          className="text-slate-400 hover:text-white p-0.5"
                        >
                          {copiedLinkKey === `lic-${sys.id || idx}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-1">
                      <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                        <Award className="w-3 h-3 text-purple-400" />
                        <span>{isRtl ? 'رقم الشهادة:' : 'Certificate ID:'}</span>
                      </div>
                      <span className="font-mono text-purple-300 text-[11px] truncate block select-all">
                        {sys.certificateNumber || 'CERT-LW-2026-ACTIVE'}
                      </span>
                    </div>
                  </div>

                  {/* Payment / Verification Details if Pending */}
                  {isPending && (
                    <div className="text-[11px] p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>{isRtl ? 'المحفظة / وسيلة التحويل:' : 'Payment Method:'} <strong>{sys.paymentMethod || 'Vodafone Cash'}</strong></span>
                        {sys.senderPhone && <span>{isRtl ? 'رقم المحول:' : 'Sender:'} {sys.senderPhone}</span>}
                      </div>
                      {sys.referenceId && (
                        <div>{isRtl ? 'كود العملية المرجي:' : 'Ref Code:'} <span className="font-mono font-bold select-all">{sys.referenceId}</span></div>
                      )}
                      <div className="text-[10px] text-amber-300/80 pt-1 border-t border-amber-500/20">
                        {isRtl ? 'يقوم فريق الإدارة بمطابقة الإيصال وتفعيل النظام في غضون دقائق معدودة.' : 'Admin team is verifying your receipt. Activation completes shortly.'}
                      </div>
                    </div>
                  )}

                  {/* Footer note & activation date */}
                  <div className="pt-2 flex items-center justify-between text-[11px] border-t border-slate-800 text-slate-400">
                    <span className="font-mono text-[10px]">
                      {sys.confirmedAt ? new Date(sys.confirmedAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US') : ''}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-300">
                      Lern Web Enterprise Cloud
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Learning Activity Chart */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          <span>{isRtl ? 'نشاطك التعليمي هذا الأسبوع' : 'Your Learning Activity This Week'}</span>
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
              <Area type="monotone" dataKey="hours" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Join Platform Section (Conditional) */}
      {storageService.getSettings().isJoinPlatformEnabled && (
        <JoinPlatformForm lang={lang} />
      )}


      {/* Edit Contact Information & Avatar Form */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-blue-400" />
            <span>{isRtl ? 'تعديل معلومات الحساب والصورة الشخصية:' : 'Edit Account Information & Avatar:'}</span>
          </h4>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isSaved && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'تم حفظ وتحديث بيانات الحساب بنجاح!' : 'Account information updated successfully!'}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>{isRtl ? 'الاسم الكامل:' : 'Full Name:'}</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isRtl ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs md:text-sm text-white focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isRtl ? 'رقم الهاتف / الواتساب:' : 'Phone / WhatsApp:'}</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={isRtl ? 'أدخل رقم الهاتف' : 'Enter your phone number'}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs md:text-sm text-white focus:border-blue-500 focus:outline-none transition font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{isRtl ? 'البريد الإلكتروني:' : 'Email Address:'}</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isRtl ? 'name@example.com' : 'name@example.com'}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs md:text-sm text-white focus:border-blue-500 focus:outline-none transition font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-purple-400" />
                <span>{isRtl ? 'رابط الصورة الشخصية (أو ارفع من الجهاز أعلاه):' : 'Avatar Image URL (or upload from device above):'}</span>
              </label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs md:text-sm text-white focus:border-blue-500 focus:outline-none transition font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{isRtl ? 'رفع صورة جديدة مباشرة من جهازه 📁' : 'Upload new avatar directly from device 📁'}</span>
              <input type="file" accept="image/*" onChange={handleAvatarFileUpload} className="hidden" />
            </label>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-xs md:text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isRtl ? 'حفظ التغييرات' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Card for Client */}
      <div className="rounded-2xl border border-amber-500/30 bg-slate-950 p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <span>{isRtl ? 'تغيير كلمة المرور والخصوصية:' : 'Change Account Password & Security:'}</span>
          </h4>
          <span className="text-xs text-amber-400/80 font-medium">
            {isRtl ? 'تغيير كلمة السر الخاصة بحسابك' : 'Update your personal password'}
          </span>
        </div>

        {passErrorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{passErrorMsg}</span>
          </div>
        )}

        {passSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{passSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-400" />
                <span>{isRtl ? 'كلمة المرور الحالية:' : 'Current Password:'}</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder={isRtl ? 'أدخل كلمة السر الحالية' : 'Current password'}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-2.5 text-xs md:text-sm text-white focus:border-amber-500 focus:outline-none transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>{isRtl ? 'كلمة المرور الجديدة:' : 'New Password:'}</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={isRtl ? 'أدخل كلمة السر الجديدة' : 'New password'}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-2.5 text-xs md:text-sm text-white focus:border-amber-500 focus:outline-none transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isRtl ? 'تأكيد كلمة المرور الجديدة:' : 'Confirm New Password:'}</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={isRtl ? 'أعد كتابة كلمة السر' : 'Confirm new password'}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs md:text-sm text-white focus:border-amber-500 focus:outline-none transition font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isChangingPass}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 px-6 py-2.5 text-xs md:text-sm font-bold text-white shadow-lg shadow-amber-600/20 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Key className="w-4 h-4" />
              <span>{isChangingPass ? (isRtl ? 'جاري التحديث...' : 'Updating...') : (isRtl ? 'تحديث كلمة المرور' : 'Update Password')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Contact Administration & Live Support Box */}
      <div className="rounded-2xl border border-blue-500/40 bg-gradient-to-br from-blue-950/30 via-slate-950 to-indigo-950/40 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <span>{isRtl ? 'مراسلة الإدارة والدعم الفني المباشر:' : 'Direct Administration & Support Chat:'}</span>
          </h4>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            {isRtl ? 'متصل بالدعم الفوري' : 'Live Support Online'}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {isRtl 
            ? 'أرسل استفسارك أو طلبك مباشرة إلى إدارة المنصة وسيقوم فريق الدعم أو الإدارة بالرد عليك فوراً في لوحة حسابك:' 
            : 'Send your inquiries or requests directly to platform administration. Our support team will reply directly to your dashboard:'}
        </p>

        {/* Messages Transcript */}
        <div className="max-h-[260px] overflow-y-auto space-y-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          {(() => {
            const ticket = storageService.getTicketByUserId(currentUser?.id);
            const messages = ticket?.messages || [];
            if (messages.length === 0) {
              return (
                <p className="text-xs text-slate-500 text-center py-6 italic">
                  {isRtl ? 'لا توجد رسائل سابقة مع الإدارة. ابدأ بإرسال رسالتك الآن!' : 'No previous messages with admin. Start the conversation!'}
                </p>
              );
            }
            return messages.map((m) => {
              const isUser = m.sender === 'user';
              const isAdmin = m.sender === 'admin';
              return (
                <div key={m.id} className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl text-xs space-y-1 ${
                    isUser 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : isAdmin 
                        ? 'bg-gradient-to-r from-indigo-950 to-slate-900 border border-amber-500/50 text-amber-200 rounded-bl-none' 
                        : 'bg-slate-800 text-slate-200 rounded-bl-none'
                  }`}>
                    <div className="flex items-center justify-between text-[10px] opacity-75 font-bold border-b border-white/10 pb-1">
                      <span>{m.senderName || (isUser ? currentUser.name : 'الإدارة')}</span>
                      <span>{m.timestamp ? new Date(m.timestamp).toLocaleTimeString(isRtl ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                    </div>
                    <p className="whitespace-pre-wrap break-words pt-1">{m.text}</p>
                  </div>
                </div>
              );
            });
          })()}
        </div>

        {/* Send Form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (!supportMsgInput.trim()) return;
            storageService.addMessageToTicket(
              currentUser.id,
              currentUser.name,
              currentUser.phone,
              currentUser.email || '',
              { sender: 'user', text: supportMsgInput.trim() }
            );
            setSupportMsgInput('');
            alert(isRtl ? 'تم إرسال رسالتك للإدارة بنجاح!' : 'Message sent to admin!');
          }}
          className="flex gap-2 pt-1"
        >
          <input
            type="text"
            value={supportMsgInput}
            onChange={(e) => setSupportMsgInput(e.target.value)}
            placeholder={isRtl ? 'اكتب رسالتك للإدارة هنا...' : 'Type your message to administration...'}
            className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isRtl ? 'إرسال للإدارة' : 'Send'}</span>
          </button>
        </form>
      </div>

      {/* Account Session & Danger Zone Actions */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>{isRtl ? 'إدارة الجلسة وحذف الحساب:' : 'Session Management & Account Safety:'}</span>
        </h4>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              storageService.logoutUser();
              onLogout();
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-xs font-bold text-slate-200 hover:border-slate-500 hover:text-white transition cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-amber-400" />
            <span>{isRtl ? 'تسجيل الخروج من الحساب' : 'Logout of Account'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-5 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isRtl ? 'حذف الحساب والمسودات المسجلة' : 'Delete Account & Saved Drafts'}</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Account Deletion */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl border border-rose-500/40 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {isRtl ? 'تأكيد حذف الحساب نهائياً' : 'Confirm Permanent Account Deletion'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isRtl ? 'إجراء غير قابل للتراجع' : 'Irreversible Action'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isRtl 
                ? 'سيتم مسح بيانات حسابك بالكامل، بالإضافة إلى جميع مسودات الذكاء الاصطناعي والتعديلات التي أنشأتها، وسيتم تسجيل خروجك فوراً.'
                : 'All account data, saved drafts, and AI customizations will be deleted permanently. You will be logged out immediately.'}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (currentUser?.id) {
                    storageService.deleteUserAccount(currentUser.id);
                  } else {
                    storageService.logoutUser();
                  }
                  setShowDeleteConfirm(false);
                  onLogout();
                }}
                className="rounded-xl bg-rose-600 hover:bg-rose-500 px-5 py-2 text-xs font-bold text-white shadow-lg transition"
              >
                {isRtl ? 'نعم، احذف الحساب الآن' : 'Yes, Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
