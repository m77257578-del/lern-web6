import React from 'react';
import { ShieldAlert, RefreshCw, Smartphone, Laptop, CheckCircle2, Lock } from 'lucide-react';

interface SecurityLockModalProps {
  isOpen: boolean;
  lockReason: 'dual_session' | 'screen_capture' | 'blur_protection' | null;
  currentUser?: any;
  onResolveLock: () => void;
  lang?: 'ar' | 'en';
}

export const SecurityLockModal: React.FC<SecurityLockModalProps> = ({
  isOpen,
  lockReason,
  currentUser,
  onResolveLock,
  lang = 'ar'
}) => {
  if (!isOpen) return null;

  const isRtl = lang === 'ar';
  const clientName = currentUser?.name || currentUser?.email || 'العميل';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-4 font-sans animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-lg rounded-3xl border border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/40 p-6 md:p-8 shadow-2xl text-slate-100 space-y-6 text-center">
        
        {/* Lock Icon */}
        <div className="relative w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-400 mx-auto flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/20">
          <ShieldAlert className="w-10 h-10 animate-bounce" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs border-2 border-slate-900">
            ✓
          </div>
        </div>

        {/* Title & Message */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-bold text-amber-300">
            <Lock className="w-3.5 h-3.5" />
            <span>نظام حماية الجلسة والملكية الفكرية • ليرن ويب</span>
          </div>

          <h3 className="text-2xl font-black text-white">
            {lockReason === 'dual_session'
              ? 'تنبيه: تم فتح حسابك من جهاز آخر'
              : lockReason === 'screen_capture'
              ? 'تنبيه أمني: محاولة التقاط/تسجيل الشاشة'
              : 'شاشة القفل المؤقت لحماية المحتوى'}
          </h3>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            {lockReason === 'dual_session' ? (
              <>
                مرحباً بك يا <span className="font-bold text-amber-300">{clientName}</span>! تم اكتشاف جلسة تصفح جديدة لنفس الحساب على جهاز/متصفح آخر في نفس الوقت.
                <br />
                <span className="text-emerald-400 font-semibold block mt-1">
                  لحماية بياناتك، تم قفل هذه الشاشة مؤقتاً. لم يتم حظر حسابك ويمكنك استئناف الجلسة بنقرة واحدة.
                </span>
              </>
            ) : (
              <>
                لحماية الملكية الفكرية والأكواد المخصصة، يمنع نظام ليرن ويب التقاط أو تسجيل الشاشة.
                <br />
                انقر على الزر أدناه لمتابعة استخدام المنصة بأمان.
              </>
            )}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onResolveLock}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-600 to-blue-600 hover:from-amber-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-amber-500/20 transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>المتابعة والاستمرار من هذا الجهاز</span>
          </button>
        </div>

        {/* Footnote */}
        <p className="text-[11px] text-slate-500 font-mono">
          Lern Web Security System • Active Protection Protocol (No Ban)
        </p>
      </div>
    </div>
  );
};
