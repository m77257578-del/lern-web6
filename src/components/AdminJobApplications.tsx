import React, { useState } from 'react';
import { storageService, buildWhatsAppUrl } from '../services/storageService';
import { Check, X, User, Phone, Briefcase, Link, Camera, Award, FileText } from 'lucide-react';

export default function AdminJobApplications({ lang = 'ar' }: { lang?: 'ar' | 'en' }) {
  const isRtl = lang === 'ar';
  const [applications, setApplications] = useState(storageService.getApplications());

  const handleStatusUpdate = (id: string, status: 'accepted' | 'rejected') => {
    storageService.updateApplicationStatus(id, status);
    setApplications(storageService.getApplications());
    
    if (status === 'accepted' || status === 'rejected') {
      const app = applications.find(a => a.id === id);
      if (app) {
        const roleLabel = app.role === 'customer_service' ? (isRtl ? 'خدمة عملاء' : 'Customer Service') : 
                          app.role === 'programmer' ? (isRtl ? 'مبرمج' : 'Programmer') : 
                          (isRtl ? 'مراقب' : 'Monitor');
        
        const message = status === 'accepted'
          ? (isRtl 
            ? `مرحباً ${app.name}، مبارك! تم قبول طلب انضمامك كـ ${roleLabel} في منصة ليرن ويب. يرجى الدخول للوحة التحكم باستخدام رقمك وكود 100100.`
            : `Hello ${app.name}, Congratulations! Your application as ${roleLabel} at Lern Web has been accepted. Please log in to your dashboard using your phone number and code 100100.`)
          : (isRtl
            ? `مرحباً ${app.name}، نأسف لإبلاغك بأنه تم رفض طلب انضمامك كـ ${roleLabel} في منصة ليرن ويب حالياً. نتمنى لك التوفيق في فرص أخرى.`
            : `Hello ${app.name}, We regret to inform you that your application as ${roleLabel} at Lern Web has been rejected at this time. We wish you the best of luck.`);
        
        window.open(buildWhatsAppUrl(app.phone, message), '_blank');
      }
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-white">{isRtl ? 'طلبات الانضمام' : 'Job Applications'}</h3>
      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="text-center py-10 bg-slate-950/50 rounded-2xl border border-dashed border-slate-800 text-slate-500">
            {isRtl ? 'لا توجد طلبات انضمام حالياً.' : 'No pending applications.'}
          </div>
        ) : (
          applications.map(app => (
            <div key={app.id} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-lg hover:border-slate-700 transition">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <User size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-white">{app.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold border border-indigo-500/30">
                        {app.role === 'customer_service' ? (isRtl ? 'خدمة عملاء' : 'Customer Service') : 
                         app.role === 'programmer' ? (isRtl ? 'مبرمج' : 'Programmer') : 
                         (isRtl ? 'مراقب' : 'Monitor')}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                        <Phone size={10} />
                        {app.phone}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold">
                        <Award size={10} />
                        {app.yearsExperience} {isRtl ? 'سنوات خبرة' : 'years exp'}
                      </span>
                    </div>
                  </div>
                </div>

                {app.status === 'pending' ? (
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => handleStatusUpdate(app.id, 'rejected')} 
                      className="px-4 py-2 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition flex items-center gap-1.5"
                    >
                      <X size={14}/>
                      <span>{isRtl ? 'رفض' : 'Reject'}</span>
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(app.id, 'accepted')} 
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5"
                    >
                      <Check size={14}/>
                      <span>{isRtl ? 'قبول' : 'Accept'}</span>
                    </button>
                  </div>
                ) : (
                  <span className={`px-4 py-1.5 rounded-xl text-xs font-bold ${
                    app.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                    'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {app.status === 'accepted' ? (isRtl ? 'تم القبول ✓' : 'Accepted') : (isRtl ? 'تم الرفض ✗' : 'Rejected')}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800/50">
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{isRtl ? 'الروابط والمستندات:' : 'Links & Documents:'}</p>
                  <div className="flex flex-wrap gap-2">
                    <a href={app.profileLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-blue-400 hover:border-blue-500 transition">
                      <Link size={12}/>
                      <span>{isRtl ? 'رابط البروفايل' : 'Profile'}</span>
                    </a>
                    {app.gitHubLink && (
                      <a href={app.gitHubLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-white hover:border-white transition">
                        <FileText size={12}/>
                        <span>GitHub</span>
                      </a>
                    )}
                    {app.nationalIdPhotoUrl && (
                      <a href={app.nationalIdPhotoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-amber-400 hover:border-amber-500 transition">
                        <Camera size={12}/>
                        <span>{isRtl ? 'صورة البطاقة' : 'ID Photo'}</span>
                      </a>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{isRtl ? 'سبب الرغبة في الانضمام:' : 'Reason for applying:'}</p>
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
                    "{app.reason}"
                  </div>
                </div>
              </div>
              <p className="text-[9px] text-slate-600 text-right">{new Date(app.appliedAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
