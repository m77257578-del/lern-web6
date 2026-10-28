import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X, User, Rocket, Edit3, Check } from 'lucide-react';

export default function ProductTour({ lang = 'ar', onClose }) {
  const isRtl = lang === 'ar';
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Sparkles className="w-8 h-8 text-blue-400" />,
      title: isRtl ? 'مرحباً بك في لوحة العميل!' : 'Welcome to your Dashboard!',
      content: isRtl 
        ? 'هذه هي وجهتك الرئيسية لمتابعة طلباتك، تعديل بياناتك، والوصول إلى أدوات ليرن ويب.'
        : 'This is your central hub for tracking requests, managing your profile, and accessing Lern Web tools.'
    },
    {
      icon: <Rocket className="w-8 h-8 text-purple-400" />,
      title: isRtl ? 'تخصيص الأدوات (AI Customizer)' : 'AI Customizer Sandbox',
      content: isRtl 
        ? 'يمكنك الوصول للمحاكي من هنا لتخصيص الأدوات عبر الذكاء الاصطناعي ثم إرسال طلب التعديل للأدمن.'
        : 'Use the Sandbox to customize platforms with AI, preview changes, and submit requests for admin review.'
    },
    {
      icon: <Edit3 className="w-8 h-8 text-amber-400" />,
      title: isRtl ? 'إدارة الملف الشخصي' : 'Profile Management',
      content: isRtl 
        ? 'قم بتحديث بيانات الاتصال الخاصة بك ومعاينة تاريخ انضمامك وإجمالي مشاريعك من هذا القسم.'
        : 'Update your contact information, view your registration history, and track total platform deployments.'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-8 text-white shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
        
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            {steps[currentStep].icon}
          </div>
          <h2 className="text-2xl font-black">{steps[currentStep].title}</h2>
          <p className="text-slate-300 leading-relaxed">{steps[currentStep].content}</p>
          
          <div className="flex items-center justify-center gap-2 pt-2">
            {steps.map((_, index) => (
              <div key={index} className={`w-2.5 h-2.5 rounded-full ${index === currentStep ? 'bg-blue-500' : 'bg-slate-700'}`} />
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-bold text-white hover:from-blue-500 hover:to-indigo-500 transition active:scale-95"
          >
            {currentStep < steps.length - 1 ? (isRtl ? 'التالي' : 'Next') : (isRtl ? 'ابدأ الاستخدام' : 'Get Started')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
