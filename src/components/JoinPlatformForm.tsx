import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { Send, User, Phone, Briefcase, Link, Camera, Award, FileText, Clock, MessageSquare } from 'lucide-react';

export default function JoinPlatformForm({ lang = 'ar' }: { lang?: 'ar' | 'en' }) {
  const isRtl = lang === 'ar';
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'customer_service',
    profileLink: '',
    gitHubLink: '',
    nationalIdPhotoUrl: '',
    yearsExperience: 0,
    reason: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const application = {
      ...formData,
      id: 'app-' + Date.now(),
      status: 'pending',
      appliedAt: new Date().toISOString()
    };
    const whatsappUrl = storageService.addApplication(application as any);
    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank');
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 text-center rounded-3xl bg-slate-900 border border-emerald-500/30 text-emerald-400">
        <h3 className="text-2xl font-black mb-2">{isRtl ? 'تم إرسال طلبك بنجاح!' : 'Application Submitted!'}</h3>
        <p>{isRtl ? 'سنقوم بمراجعة طلبك والتواصل معك قريباً.' : 'We will review your application and contact you soon.'}</p>
      </div>
    );
  }

    <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl animate-fadeIn">
      <div className="space-y-1">
        <h3 className="text-2xl font-black text-white flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-blue-400" />
          <span>{isRtl ? 'انضم إلى فريق عمل ليرن ويب' : 'Join Lern Web Team'}</span>
        </h3>
        <p className="text-xs text-slate-400">
          {isRtl 
            ? 'هل لديك الخبرة والشغف؟ قدم طلبك الآن للانضمام لمطوري أو مشرفي المنصة.' 
            : 'Do you have the passion? Apply now to join our developers or support team.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-400" />
            <span>{isRtl ? 'الاسم الكامل:' : 'Full Name:'}</span>
          </label>
          <input 
            required 
            type="text" 
            placeholder={isRtl ? 'مثال: أحمد محمد' : 'e.g. Ahmed Mohamed'} 
            className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:border-blue-500 focus:outline-none transition" 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isRtl ? 'رقم الهاتف (للتواصل):' : 'Phone Number:'}</span>
          </label>
          <input 
            required 
            type="text" 
            placeholder="010XXXXXXXX" 
            className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white font-mono focus:border-blue-500 focus:outline-none transition" 
            onChange={e => setFormData({...formData, phone: e.target.value})} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{isRtl ? 'المجال المطلوب:' : 'Desired Role:'}</span>
          </label>
          <select 
            className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:border-blue-500 focus:outline-none transition" 
            onChange={e => setFormData({...formData, role: e.target.value as any})}
          >
            <option value="customer_service">{isRtl ? 'خدمة عملاء ودعم فني' : 'Customer Service'}</option>
            <option value="programmer">{isRtl ? 'مبرمج ومطور (Full Stack)' : 'Programmer'}</option>
            <option value="monitor">{isRtl ? 'مراقب جودة ومنصة' : 'Monitor'}</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>{isRtl ? 'سنوات الخبرة في هذا المجال:' : 'Years of Experience:'}</span>
          </label>
          <input 
            required 
            type="number" 
            min="0"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:border-blue-500 focus:outline-none transition" 
            onChange={e => setFormData({...formData, yearsExperience: parseInt(e.target.value) || 0})} 
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Link className="w-3.5 h-3.5 text-blue-400" />
          <span>{isRtl ? 'رابط حساب البروفايل (فيسبوك/لينكد إن):' : 'Profile Link (FB/LinkedIn):'}</span>
        </label>
        <input 
          required 
          type="url" 
          placeholder="https://..." 
          className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-blue-400 font-mono focus:border-blue-500 focus:outline-none transition" 
          onChange={e => setFormData({...formData, profileLink: e.target.value})} 
        />
      </div>
      
      {formData.role === 'programmer' ? (
        <div className="space-y-1.5 animate-fadeIn">
          <label className="text-xs font-bold text-white flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-white" />
            <span>رابط حساب جيت هاب (GitHub Link):</span>
          </label>
          <input 
            required 
            type="url" 
            placeholder="https://github.com/username" 
            className="w-full rounded-xl bg-slate-950 border border-white/20 p-3 text-sm text-white font-mono focus:border-white focus:outline-none transition" 
            onChange={e => setFormData({...formData, gitHubLink: e.target.value})} 
          />
        </div>
      ) : (
        <div className="space-y-1.5 animate-fadeIn">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>{isRtl ? 'رابط صورة البطاقة الشخصية (صورة واضحة):' : 'National ID Photo URL:'}</span>
          </label>
          <input 
            required 
            type="url" 
            placeholder="https://..." 
            className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white font-mono focus:border-blue-500 focus:outline-none transition" 
            onChange={e => setFormData({...formData, nationalIdPhotoUrl: e.target.value})} 
          />
          <p className="text-[10px] text-slate-500 italic">{isRtl ? 'ارفع الصورة على أي مركز رفع وأدخل الرابط هنا' : 'Upload photo and paste link here'}</p>
        </div>
      )}
      
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
          <span>{isRtl ? 'لماذا تريد العمل معنا؟ وماذا ستقدم للمنصة؟' : 'Reason for joining & Contribution:'}</span>
        </label>
        <textarea 
          required 
          rows={3}
          placeholder={isRtl ? 'اكتب باختصار خبراتك وسبب اختيارك لنا...' : 'Briefly describe your experience and why you chose us...'} 
          className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-slate-300 focus:border-blue-500 focus:outline-none transition" 
          onChange={e => setFormData({...formData, reason: e.target.value})} 
        />
      </div>

      <button 
        type="submit" 
        className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base shadow-lg shadow-blue-600/20 transition active:scale-95 flex items-center justify-center gap-2"
      >
        <Send className="w-5 h-5" />
        <span>{isRtl ? 'إرسال طلب الانضمام الآن' : 'Submit My Application'}</span>
      </button>
    </form>
}
