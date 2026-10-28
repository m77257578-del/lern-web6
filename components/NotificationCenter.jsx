/**
 * Next.js Project Structure Identifier:
 * components/NotificationCenter.jsx
 * 
 * Project Identity: ليرن ويب | Lern Web
 * Purpose: Real-time notification feed for clients to track status changes and system alerts.
 */

import React from 'react';
import { Bell, CheckCircle2, Clock, Info, ShieldAlert, X, Trash2 } from 'lucide-react';
import { storageService } from '../src/services/storageService';

export default function NotificationCenter({ notifications = [], lang = 'ar', onRefresh = () => {} }) {
  const isRtl = lang === 'ar';

  const handleMarkAsRead = (id) => {
    storageService.markNotificationAsRead(id);
    onRefresh();
  };

  const handleClearAll = () => {
    const userId = storageService.getCurrentUser()?.id;
    if (userId) {
      storageService.clearUserNotifications(userId);
      onRefresh();
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 shadow-xl space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-5 h-5 text-blue-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900 animate-pulse" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {isRtl ? 'مركز الإشعارات الحية' : 'Notification Center'}
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              {isRtl ? 'تنبيهات فورية من النظام والإدارة' : 'Real-time platform alerts'}
            </p>
          </div>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="p-2 text-slate-500 hover:text-rose-400 transition"
            title={isRtl ? 'مسح الكل' : 'Clear All'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-10 text-center text-slate-500 space-y-3">
          <Bell className="w-10 h-10 text-slate-800 mx-auto" />
          <p className="text-xs font-bold">{isRtl ? 'لا توجد إشعارات جديدة حالياً' : 'No new notifications'}</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
          {notifications.map((notif) => {
            const Icon = notif.type === 'status_change' ? CheckCircle2 : notif.type === 'admin_note' ? ShieldAlert : Info;
            const iconColor = notif.type === 'status_change' ? 'text-emerald-400' : notif.type === 'admin_note' ? 'text-amber-400' : 'text-blue-400';
            
            return (
              <div 
                key={notif.id} 
                className={`relative group p-4 rounded-2xl border transition-all duration-300 ${
                  notif.read 
                    ? 'border-slate-800 bg-slate-950/30 opacity-70' 
                    : 'border-blue-500/30 bg-blue-500/5 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/10'
                }`}
              >
                {!notif.read && (
                  <button
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition text-blue-400 hover:text-white"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}

                <div className="flex gap-3">
                  <div className={`mt-1 shrink-0 p-2 rounded-xl bg-slate-900 border border-slate-800 ${iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-sm font-bold ${notif.read ? 'text-slate-300' : 'text-white'}`}>
                        {isRtl ? notif.titleAr : notif.titleEn}
                      </h4>
                      <span className="text-[9px] font-mono text-slate-500 shrink-0">
                        {new Date(notif.createdAt).toLocaleTimeString(isRtl ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">
                      {isRtl ? notif.messageAr : notif.messageEn}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
