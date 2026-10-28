/**
 * Next.js Project Structure Identifier:
 * components/ClientNotificationsSection.jsx
 * 
 * Project Identity: ليرن ويب | Lern Web
 * Purpose: In-app client notification center linking admin actions (such as status updates or order approvals)
 *          to instant client notifications with interactive Approve / Object (موافقة أو اعتراض) actions.
 */

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, XCircle, AlertCircle, Clock, Check, X, MessageSquare, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { storageService } from '../src/services/storageService';

export default function ClientNotificationsSection({ currentUser, lang = 'ar', onRefresh = () => {} }) {
  const isRtl = lang === 'ar';
  const [notifications, setNotifications] = useState([]);
  const [objectionModalNotif, setObjectionModalNotif] = useState(null);
  const [objectionNoteInput, setObjectionNoteInput] = useState('');
  const [successToastMsg, setSuccessToastMsg] = useState('');

  const loadNotifications = () => {
    if (!currentUser?.id) return;
    const all = storageService.getNotifications ? storageService.getNotifications() : [];
    // Filter notifications for this specific user or broadcast to all users
    const userNotifs = all.filter(n => n.userId === currentUser.id || n.userId === 'all' || n.targetRole === 'user');
    setNotifications(userNotifs);
  };

  useEffect(() => {
    loadNotifications();
    const unsub = storageService.subscribe(() => {
      loadNotifications();
    });
    return () => unsub();
  }, [currentUser]);

  const handleApprove = (notif) => {
    storageService.respondToClientNotification(notif.id, 'approved', isRtl ? 'وافق العميل على التحديث الإداري' : 'Client approved admin update');
    setSuccessToastMsg(isRtl ? '✅ تم إرسال موافقتك للإدارة بنجاح!' : '✅ Approval sent to admin!');
    setTimeout(() => setSuccessToastMsg(''), 3500);
    loadNotifications();
    onRefresh();
  };

  const handleObjectSubmit = (e) => {
    e.preventDefault();
    if (!objectionModalNotif) return;
    storageService.respondToClientNotification(
      objectionModalNotif.id, 
      'objected', 
      objectionNoteInput.trim() || (isRtl ? 'اعتراض العميل على الإجراء الإداري' : 'Client objected admin update')
    );
    setSuccessToastMsg(isRtl ? '⚠️ تم إرسال اعتراضك مع الملاحظات للإدارة بنجاح.' : '⚠️ Objection sent to admin.');
    setTimeout(() => setSuccessToastMsg(''), 3500);
    setObjectionModalNotif(null);
    setObjectionNoteInput('');
    loadNotifications();
    onRefresh();
  };

  const markAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.read) {
        storageService.markNotificationAsRead(n.id);
      }
    });
    loadNotifications();
    onRefresh();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400">
            <Bell className="w-3.5 h-3.5" />
            <span>{isRtl ? 'مركز الإشعارات والتنبيهات الإدارية الفورية' : 'In-App Notification Center'}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white">
            {isRtl ? 'الإشعارات وتحديثات الطلبات الإدارية' : 'Admin Status Updates & Notifications'}
          </h3>
          <p className="text-xs md:text-sm text-slate-300">
            {isRtl 
              ? 'تابع التحديثات الفورية لحالة طلباتك ومشاريعك، ويمكنك الرد بالموافقة أو تقديم اعتراض وملاحظات مباشرة للإدارة.' 
              : 'Track instant status updates for your orders and drafts, and respond with approval or objections.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-bold text-amber-300 animate-pulse">
              <span>{unreadCount} {isRtl ? 'غير مقروء' : 'unread'}</span>
            </span>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              {isRtl ? 'تعليم الكل كمقروء' : 'Mark all as read'}
            </button>
          )}
        </div>
      </div>

      {successToastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successToastMsg}</span>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-12 text-center text-slate-500 space-y-3">
            <Bell className="w-12 h-12 text-slate-700 mx-auto" />
            <h4 className="text-base font-bold text-slate-300">{isRtl ? 'لا توجد إشعارات حالياً' : 'No notifications yet'}</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">{isRtl ? 'ستظهر هنا إشعارات الإدارة وتحديثات حالات طلباتك ومشاريعك فور صدورها.' : 'Admin updates and status changes will appear here.'}</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const isRead = notif.read;
            const respStatus = notif.responseStatus; // 'approved' | 'objected' | undefined

            return (
              <div 
                key={notif.id}
                className={`rounded-2xl border p-5 space-y-3 transition-all ${
                  !isRead 
                    ? 'border-blue-500/60 bg-gradient-to-r from-blue-950/30 via-slate-950 to-slate-950 shadow-xl ring-1 ring-blue-500/30' 
                    : 'border-slate-800 bg-slate-950/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${!isRead ? 'bg-blue-400 animate-ping' : 'bg-slate-600'}`} />
                    <h4 className="text-sm font-bold text-white">
                      {isRtl ? notif.titleAr : notif.titleEn}
                    </h4>
                    {!isRead && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400">
                        {isRtl ? 'جديد' : 'New'}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{new Date(notif.createdAt).toLocaleString(isRtl ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </span>
                </div>

                <p className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {isRtl ? notif.messageAr : notif.messageEn}
                </p>

                {/* Response Status or Interactive Approve / Object Buttons */}
                <div className="pt-2 border-t border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {respStatus === 'approved' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-300">
                        <Check className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'تمت الموافقة على هذا التحديث' : 'Approved'}</span>
                      </span>
                    ) : respStatus === 'objected' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-1 text-xs font-bold text-rose-300">
                        <X className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'تم تقديم اعتراض وملاحظات' : 'Objected'}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">
                        {isRtl ? 'يرجى مراجعة التحديث الإداري واتخاذ القرار:' : 'Please review and respond:'}
                      </span>
                    )}
                  </div>

                  {!respStatus && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleApprove(notif)}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-bold shadow transition cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'موافقة (Approve)' : 'Approve'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setObjectionModalNotif(notif)}
                        className="flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 px-4 py-2 text-xs font-bold transition cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'اعتراض وتعديل' : 'Object / Disagree'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Objection Modal with Note Input */}
      {objectionModalNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl border border-rose-500/40 bg-slate-900 p-6 md:p-8 shadow-2xl space-y-5 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5 text-rose-400">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h4 className="text-base font-bold text-white">
                  {isRtl ? 'تقديم اعتراض وملاحظات للإدارة' : 'Submit Objection & Feedback'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setObjectionModalNotif(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isRtl 
                ? 'يرجى كتابة أسباب الاعتراض أو التعديلات المطلوبة على هذا الإجراء الإداري ليتم إرسالها فوراً إلى لوحة تحكم الأدمن ومراجعتها:' 
                : 'Please state your reason for objection or required changes for admin review:'}
            </p>

            <form onSubmit={handleObjectSubmit} className="space-y-4">
              <textarea
                rows={4}
                value={objectionNoteInput}
                onChange={(e) => setObjectionNoteInput(e.target.value)}
                placeholder={isRtl ? 'اكتب ملاحظاتك هنا... مثال: نرجو تعديل اسم المركز أو مراجعة قيمة الطلب' : 'Enter your feedback here...'}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-3.5 text-xs text-white focus:outline-none focus:border-rose-500"
                required
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setObjectionModalNotif(null)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white px-5 py-2 text-xs font-bold shadow-lg transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isRtl ? 'إرسال الاعتراض للإدارة' : 'Send Objection'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
