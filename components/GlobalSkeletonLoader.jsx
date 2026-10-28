import React, { useState, useEffect } from 'react';
import { Layers, RefreshCw, Sparkles, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { storageService, subscribeToSyncState } from '../src/services/storageService';

export default function GlobalSkeletonLoader({ lang = 'ar', forceShow = false }) {
  const isRtl = lang === 'ar';
  const [isSyncing, setIsSyncing] = useState(() => storageService.getIsSyncing());

  useEffect(() => {
    const unsubscribe = subscribeToSyncState((syncingState) => {
      setIsSyncing(syncingState);
    });
    return () => unsubscribe();
  }, []);

  if (!isSyncing && !forceShow) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex flex-col justify-between overflow-hidden animate-fadeIn">
      {/* Top Floating Glass Bar Indicator */}
      <div className="pt-20 px-4 flex justify-center pointer-events-auto">
        <div className="rounded-2xl border border-blue-500/40 bg-slate-950/90 backdrop-blur-xl px-5 py-3 shadow-2xl flex items-center gap-3 text-xs md:text-sm font-bold text-slate-100 ring-1 ring-blue-500/30 animate-pulse">
          <div className="relative flex items-center justify-center">
            <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
            <span className="absolute w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-black">{isRtl ? 'جاري مزامنة وتحديث بيانات المنظومة...' : 'Synchronizing Live Database...'}</span>
            <span className="hidden sm:inline text-slate-400 font-mono text-[11px]">{isRtl ? '• Firestore Real-Time' : '• Firestore Real-Time'}</span>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Ambient Shimmer Line */}
      <div className="w-full h-1 bg-gradient-to-r from-blue-600 via-emerald-400 to-indigo-600 animate-pulse" style={{ animationDuration: '1.5s' }} />
    </div>
  );
}

export function SectionCardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-fadeIn">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl relative overflow-hidden">
          {/* Shimmer Light Beam Effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-slate-800/30 to-transparent animate-shimmer" />

          {/* Card Top Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-6 w-24 rounded-full bg-slate-800 animate-pulse" />
            <div className="h-4 w-12 rounded-full bg-slate-800 animate-pulse" />
          </div>

          {/* Title & Tagline Skeleton */}
          <div className="space-y-2 pt-2">
            <div className="h-6 w-3/4 rounded-xl bg-slate-800 animate-pulse" />
            <div className="h-4 w-full rounded-lg bg-slate-800/80 animate-pulse" />
            <div className="h-4 w-5/6 rounded-lg bg-slate-800/60 animate-pulse" />
          </div>

          {/* Tech Stack Pills Skeleton */}
          <div className="flex gap-2 pt-2">
            <div className="h-5 w-16 rounded-md bg-slate-800/80 animate-pulse" />
            <div className="h-5 w-20 rounded-md bg-slate-800/80 animate-pulse" />
            <div className="h-5 w-14 rounded-md bg-slate-800/80 animate-pulse" />
          </div>

          {/* Footer Pricing & Button Skeleton */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
            <div className="h-6 w-20 rounded-lg bg-slate-800 animate-pulse" />
            <div className="h-9 w-28 rounded-xl bg-slate-800 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
