/**
 * Project: ليرن ويب | Lern Web
 * File: components/AboutUsSection.jsx
 * About Us section describing Lern Web universal software engineering & SaaS marketplace.
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Code2, Rocket, Globe, CheckCircle2, Cpu, ExternalLink } from 'lucide-react';
import { storageService } from '../src/services/storageService';
import SectionMediaShowcase from '../src/components/SectionMediaShowcase';

export default function AboutUsSection({ lang = 'ar', onClose = () => {} }) {
  const isRtl = lang === 'ar';
  const [achievements, setAchievements] = useState(() => storageService.getAchievements());

  useEffect(() => {
    const unsub = storageService.subscribe(() => {
      setAchievements(storageService.getAchievements());
    });
    return () => unsub();
  }, []);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-6 md:p-10 shadow-2xl space-y-8 animate-fadeIn max-w-5xl mx-auto my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-bold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'عن المنظومة' : 'About Lern Web'}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white">
            {isRtl ? 'ليرن ويب | المنظومة الشاملة لتوليد وتخصيص المشاريع البرمجية' : 'Lern Web | Universal Software & SaaS Factory'}
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {isRtl 
              ? 'نحن المنصة العربية الرائدة التي تتيح لأصحاب الأعمال والمطورين إطلاق وتخصيص كافة المشاريع البرمجية (متاجر إلكترونية، أنظمة SaaS، أدوات الذكاء الاصطناعي، بوابات الحضور، ومنصات المراكز التعليمية) بتملك كامل وبدون تعقيد.'
              : 'The premier platform empowering businesses and developers to launch and customize all software projects and SaaS applications with full ownership and instant deployment.'}
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition"
        >
          {isRtl ? 'إغلاق القسم' : 'Close Section'}
        </button>
      </div>

      {/* Target Section Videos for About Us */}
      <SectionMediaShowcase targetSection="about" lang={lang} />

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Code2 className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white">
            {isRtl ? 'مشاريع برمجية غير محدودة' : 'Universal Software Engineering'}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isRtl 
              ? 'لا تقتصر على التعليم فقط، بل نتيح لك بناء أي نظام برمجي أو متجر أو تطبيق ويب أو لوحة تحكم بزحمة أو أتمتة متكاملة.'
              : 'Not limited to education—build any web application, e-commerce store, CRM pipeline, or AI tool instantly.'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white">
            {isRtl ? 'تخصيص ذكي بالذكاء الاصطناعي' : 'AI-Powered Customization'}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isRtl 
              ? 'مساعد ذكي متطور يترجم طلبك النصي إلى تعديلات فورية في الأكواد والتصميم، مع مراجعة واعتماد مباشر من الإدارة.'
              : 'Advanced AI assistant translating your text prompt into live code modifications and staged previews.'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white">
            {isRtl ? 'تملك كامل وشفرة مصدرية' : 'Full Source Code Ownership'}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isRtl 
              ? 'احصل على كامل السورس كود بصيغة Next.js و Tailwind CSS بدون أي اشتراكات شهرية إجبارية مع دعم النشر على Vercel.'
              : 'Receive complete uncompressed source code with zero recurring fees and instant Vercel cloud deployment.'}
          </p>
        </div>
      </div>

      {/* Achievements Section - Dynamic Grid from storageService */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 md:p-8 space-y-8">
        <div className="space-y-3 border-b border-amber-500/10 pb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-1 text-xs font-bold text-amber-400 mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{isRtl ? 'سجل الإنجازات والتميز' : 'Milestones & Achievements'}</span>
          </div>
          <h4 className="text-2xl md:text-3xl font-black text-white">
            {isRtl ? 'قسم إنجازاتنا وسابقة الأعمال' : 'Our Achievements & Work Showcase'}
          </h4>
          <p className="text-sm text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {isRtl 
              ? 'منذ انطلاقنا، تمكنا من تحقيق نجاحات متتالية وإطلاق مشاريع نوعية تخدم أكثر من 300 عميل بمختلف القطاعات. إليك أبرز المحطات والنتائج.'
              : 'Highlights of our track record, milestone accomplishments, and successful customer deployments.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {achievements.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                {item.imageUrl && (
                  <div className="overflow-hidden rounded-xl h-48 bg-slate-950 border border-slate-800">
                    <img src={item.imageUrl} alt={item.titleAr} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-[11px] font-bold text-amber-400">
                    {isRtl ? item.categoryAr : item.categoryEn}
                  </span>
                  {item.metricNumber && (
                    <span className="text-xs font-black text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                      {item.metricNumber} {isRtl ? item.metricLabelAr : item.metricLabelEn}
                    </span>
                  )}
                </div>

                <h5 className="text-lg font-bold text-white leading-snug">
                  {isRtl ? item.titleAr : item.titleEn}
                </h5>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  {isRtl ? item.descriptionAr : item.descriptionEn}
                </p>
              </div>

              {item.linkUrl && (
                <div className="pt-3 border-t border-slate-800 flex justify-end">
                  <a 
                    href={item.linkUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300"
                  >
                    <span>{isRtl ? 'عرض تفاصيل الإنجاز' : 'View Achievement Details'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-slate-950/60 rounded-3xl p-6 border border-slate-800 text-center space-y-4">
           <h5 className="text-base font-bold text-amber-400">
             {isRtl ? 'أرقام تتحدث عن إنجازاتنا:' : 'Our Numbers Speak:'}
           </h5>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4">
                <div className="text-2xl font-black text-white">300+</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">{isRtl ? 'عميل نشط' : 'Active Clients'}</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-black text-white">1M+</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">{isRtl ? 'مستخدم نهائي' : 'End Users'}</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-black text-white">99.9%</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">{isRtl ? 'وقت التشغيل' : 'Uptime'}</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-black text-white">24/7</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">{isRtl ? 'دعم فني' : 'Tech Support'}</div>
              </div>
           </div>
        </div>
      </div>


      {/* Mission Footer */}
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl">
            LW
          </div>
          <div>
            <h4 className="text-sm md:text-base font-bold text-white">
              {isRtl ? 'هل أنت مستعد لإطلاق مشروعك البرمجي القادم؟' : 'Ready to launch your next software project?'}
            </h4>
            <p className="text-xs text-slate-300">
              {isRtl ? 'تصفح المتجر الآن أو جرب محاكي التخصيص الفوري.' : 'Explore the store or test the live sandbox preview.'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-2.5 text-xs md:text-sm font-bold text-white shadow-md transition"
        >
          {isRtl ? 'ابدأ الآن' : 'Get Started'}
        </button>
      </div>
    </div>
  );
}
