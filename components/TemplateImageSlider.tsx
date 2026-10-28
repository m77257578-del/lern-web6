/**
 * Next.js Project Structure Identifier:
 * components/TemplateImageSlider.tsx
 * 
 * Project Identity: ليرن ويب | Lern Web
 * Purpose: High-fidelity interactive Image Gallery & Slider for project and template previews.
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, ExternalLink, X, Image as ImageIcon } from 'lucide-react';

interface TemplateImageSliderProps {
  images: string[];
  lang?: 'ar' | 'en';
  onLaunchPreview?: () => void;
}

export default function TemplateImageSlider({ images = [], lang = 'ar', onLaunchPreview }: TemplateImageSliderProps) {
  const isRtl = lang === 'ar';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-video rounded-2xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-2">
        <ImageIcon className="w-10 h-10 text-slate-600 animate-pulse" />
        <span className="text-xs text-slate-500 font-bold">
          {isRtl ? 'لا توجد صور معاينة مرفوعة لهذا القالب بعد' : 'No screenshot images uploaded yet'}
        </span>
      </div>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Large Display Viewport */}
      <div className="group relative aspect-video w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
        <img
          src={images[currentIndex]}
          alt={`Template preview ${currentIndex + 1}`}
          className="w-full h-full object-contain bg-slate-950 transition-all duration-300"
          onError={(e) => {
            // Fallback gradient if broken link
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Navigation Arrows if more than 1 image */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/80 hover:bg-blue-600 text-white border border-slate-700 opacity-90 group-hover:opacity-100 transition shadow-xl cursor-pointer"
              title={isRtl ? 'الصورة السابقة' : 'Previous image'}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/80 hover:bg-blue-600 text-white border border-slate-700 opacity-90 group-hover:opacity-100 transition shadow-xl cursor-pointer"
              title={isRtl ? 'الصورة التالية' : 'Next image'}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter Badge */}
        <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-800 text-slate-200 text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Lightbox / Fullscreen button */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {onLaunchPreview && (
            <button
              type="button"
              onClick={onLaunchPreview}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isRtl ? 'معاينة حيّة' : 'Live Preview'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-blue-600 text-white border border-slate-700 transition shadow cursor-pointer"
            title={isRtl ? 'عرض ملء الشاشة' : 'Fullscreen preview'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-16 aspect-video rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                currentIndex === idx 
                  ? 'border-blue-500 ring-2 ring-blue-500/40 opacity-100 scale-105' 
                  : 'border-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Fullscreen Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[120] flex flex-col bg-black/95 text-white animate-fadeIn p-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
            <span className="text-sm font-bold font-mono text-slate-300">
              {currentIndex + 1} / {images.length} - {isRtl ? 'معاينة شاشة القالب' : 'Template Screenshot View'}
            </span>

            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 w-full flex items-center justify-center relative overflow-hidden">
            <img
              src={images[currentIndex]}
              alt={`Fullscreen ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/90 hover:bg-blue-600 text-white border border-slate-700 shadow-2xl cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/90 hover:bg-blue-600 text-white border border-slate-700 shadow-2xl cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
