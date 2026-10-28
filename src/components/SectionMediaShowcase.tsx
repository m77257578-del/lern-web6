/**
 * Project: ليرن ويب | Lern Web
 * File: src/components/SectionMediaShowcase.tsx
 * Purpose: Renders section-specific published videos and media resources chosen by the admin.
 */

import React, { useState, useEffect } from 'react';
import { Play, Video, ExternalLink, X, Film, Sparkles } from 'lucide-react';
import { getMediaResources, MediaResourceItem, formatVideoEmbedUrl, isYouTubeUrlOrEmbed } from '../services/storageService';

interface SectionMediaShowcaseProps {
  targetSection: 'hero' | 'wallets' | 'store' | 'articles' | 'about' | string;
  lang?: 'ar' | 'en';
}

export default function SectionMediaShowcase({ targetSection, lang = 'ar' }: SectionMediaShowcaseProps) {
  const isRtl = lang === 'ar';
  const [mediaList, setMediaList] = useState<MediaResourceItem[]>([]);
  const [activeVideoModal, setActiveVideoModal] = useState<MediaResourceItem | null>(null);

  useEffect(() => {
    const allMedia = getMediaResources();
    const filtered = allMedia.filter(m => 
      m.isPublished !== false && 
      (m.targetSection === targetSection || (!m.targetSection && targetSection === 'hero'))
    );
    setMediaList(filtered);
  }, [targetSection]);

  if (!mediaList || mediaList.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-4 my-6 animate-fadeIn">
      <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Video className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{isRtl ? '📹 فيديوهات توضيحية وشروحات مرئية' : '📹 Visual Video Demonstrations'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {isRtl ? 'استعرض الفيديوهات والشروحات المرفقة لهذا القسم:' : 'Watch published videos for this section:'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold font-mono px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            {mediaList.length} {isRtl ? 'فيديو متوفر' : 'Videos Available'}
          </span>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaList.map((item) => {
            const videoEmbedUrl = formatVideoEmbedUrl(item.videoUrl || item.embedCode || '');
            const isYt = isYouTubeUrlOrEmbed(item.videoUrl || item.embedCode || '');

            return (
              <div 
                key={item.id}
                className="group relative rounded-2xl border border-slate-800 bg-slate-950 p-3 space-y-3 shadow-lg hover:border-blue-500/60 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Thumbnail / Video Preview Area */}
                <div 
                  onClick={() => setActiveVideoModal(item)}
                  className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden cursor-pointer border border-slate-800 group-hover:scale-[1.02] transition-transform"
                >
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.titleAr} className="w-full h-full object-cover" />
                  ) : isYt && videoEmbedUrl ? (
                    <iframe 
                      src={videoEmbedUrl} 
                      title={item.titleAr}
                      className="w-full h-full pointer-events-none"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-indigo-950 flex flex-col items-center justify-center p-4 text-center">
                      <Film className="w-8 h-8 text-blue-400 mb-1" />
                      <span className="text-xs font-bold text-slate-200">{isRtl ? item.titleAr : item.titleEn}</span>
                    </div>
                  )}

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-slate-950/50 group-hover:bg-slate-950/30 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {isRtl ? item.titleAr : item.titleEn}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {isRtl ? (item.summaryAr || item.contentAr) : (item.summaryEn || item.contentEn)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveVideoModal(item)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRtl ? 'تشغيل الفيديو الآن' : 'Play Video'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideoModal && (() => {
        const videoEmbedUrl = formatVideoEmbedUrl(activeVideoModal.videoUrl || activeVideoModal.embedCode || '');
        const isYt = isYouTubeUrlOrEmbed(activeVideoModal.videoUrl || activeVideoModal.embedCode || '');

        return (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
            <div className="relative w-full max-w-4xl rounded-3xl border border-slate-800 bg-slate-900 p-4 sm:p-6 shadow-2xl space-y-4 text-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <h3 className="text-base sm:text-lg font-bold">
                    {isRtl ? activeVideoModal.titleAr : activeVideoModal.titleEn}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Viewport */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                {isYt || videoEmbedUrl.startsWith('http') ? (
                  <iframe
                    src={videoEmbedUrl}
                    title={activeVideoModal.titleAr}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video 
                    src={activeVideoModal.videoUrl || activeVideoModal.contentAr} 
                    controls 
                    className="w-full h-full"
                  />
                )}
              </div>

              {activeVideoModal.contentAr && (
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {isRtl ? activeVideoModal.contentAr : activeVideoModal.contentEn}
                </p>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
