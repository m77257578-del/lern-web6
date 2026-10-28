/**
 * Project: ليرن ويب | Lern Web
 * File: src/components/Three3DLoaderPortal.tsx
 * Purpose: Stunning 3D futuristic computer terminal boot sequence & holographic entry loader.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Terminal, Cpu, ShieldCheck, Zap, Globe, ArrowRight, Play } from 'lucide-react';

interface Three3DLoaderPortalProps {
  lang?: 'ar' | 'en';
  onEnterPlatform: () => void;
}

export default function Three3DLoaderPortal({ lang = 'ar', onEnterPlatform }: Three3DLoaderPortalProps) {
  const isRtl = lang === 'ar';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [bootStep, setBootStep] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const bootLogs = isRtl ? [
    '🔌 [BOOT] جاري الاتصال بشبكة السحابة الآمنة Vercel Edge...',
    '⚡ [KEY POOL] تحميل مجمع مفاتيح الذكاء الاصطناعي (25+ مفتاح نشط)...',
    '🧠 [AI ENGINE] تهيئة محرك Gemini 3.8 & ChatGPT Multimodal...',
    '🎨 [3D ENGINE] تشغيل رسومات العرض ثلاثية الأبعاد (3D Hologram Pipeline)...',
    '🚀 [READY] منظومة ليرن ويب التعليمية جاهزة بالكامل!'
  ] : [
    '🔌 [BOOT] Connecting to Vercel Edge secure cloud network...',
    '⚡ [KEY POOL] Loading 25+ active Gemini AI keys pool...',
    '🧠 [AI ENGINE] Initializing Gemini 3.8 & ChatGPT multimodal engine...',
    '🎨 [3D ENGINE] Activating 3D Holographic render pipeline...',
    '🚀 [READY] Lern Web Educational Platform is ready!'
  ];

  // 3D Canvas Matrix / Particle Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes for 3D grid effect
    const particles: { x: number; y: number; z: number; vx: number; vy: number }[] = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 800 + 100,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2
      });
    }

    let angle = 0;

    const render = () => {
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      angle += 0.005;
      const cx = width / 2;
      const cy = height / 2;

      // Draw 3D rotating grid lines
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      const offset = (Date.now() * 0.03) % gridSize;

      for (let x = -width; x < width * 2; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x + offset, 0);
        ctx.lineTo(x + offset - width, height);
        ctx.stroke();
      }

      // Draw 3D particles & connecting lines
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -width) p.x = width;
        if (p.x > width) p.x = -width;
        if (p.y < -height) p.y = height;
        if (p.y > height) p.y = -height;

        // 3D projection
        const fov = 400;
        const scale = fov / (fov + p.z);
        const x2d = cx + p.x * scale;
        const y2d = cy + p.y * scale;
        const radius = Math.max(1, scale * 3);

        ctx.fillStyle = idx % 2 === 0 ? '#3b82f6' : '#10b981';
        ctx.beginPath();
        ctx.arc(x2d, y2d, radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const scale2 = fov / (fov + p2.z);
          const x2d2 = cx + p2.x * scale2;
          const y2d2 = cy + p2.y * scale2;
          const dist = Math.hypot(x2d - x2d2, y2d - y2d2);

          if (dist < 90) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${1 - dist / 90})`;
            ctx.beginPath();
            ctx.moveTo(x2d, y2d);
            ctx.lineTo(x2d2, y2d2);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Progress simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsReady(true);
          return 100;
        }
        const next = prev + 2;
        if (next > 20 && next <= 40) setBootStep(1);
        else if (next > 40 && next <= 70) setBootStep(2);
        else if (next > 70 && next <= 90) setBootStep(3);
        else if (next > 90) setBootStep(4);
        return next;
      });
    }, 35);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-white overflow-hidden select-none font-mono">
      {/* 3D Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Holographic Glowing Central Terminal Card */}
      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-blue-500/40 bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl shadow-blue-500/20 space-y-6 text-center animate-fadeIn">
        
        {/* Top Logo & Hologram Ring */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/60 animate-spin" style={{ animationDuration: '10s' }} />
          <div className="absolute inset-2 rounded-full border border-emerald-500/60 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '6s' }} />
          <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/50">
            <Cpu className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-xs font-bold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'محرك 3D ومتاجر ليرن ويب السحابية' : 'Lern Web 3D Cloud Engine'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-wider">
            <span className="animate-rocket-up inline-block">🚀</span> {isRtl ? 'ليرن ويب | Lern Web' : 'Lern Web Platform'}
          </h1>
          <p className="text-xs text-slate-400 font-sans">
            {isRtl ? 'منظومة إلكترونية متكاملة مع محاكي مراكز وتطبيق PWA ذكي' : 'Integrated Educational Suite & PWA Engine'}
          </p>
        </div>

        {/* Terminal Log Output Stream */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 text-left text-xs text-emerald-400 h-24 overflow-hidden flex flex-col justify-end shadow-inner font-mono">
          <div className="space-y-1">
            {bootLogs.slice(0, bootStep + 1).map((log, idx) => (
              <div key={idx} className="animate-fadeIn opacity-90 truncate">
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 relative">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-400">{isRtl ? 'جاري تهيئة الأنظمة الثلاثية الأبعاد...' : 'Initializing 3D Systems...'}</span>
            <span className="text-blue-400 font-mono flex items-center gap-2">
                <span className="animate-orbit text-xl">🛰️</span>
                {loadingProgress}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-150"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>

        {/* Enter Platform Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onEnterPlatform}
            className={`w-full flex items-center justify-center gap-3 rounded-2xl py-4 text-sm font-bold shadow-xl transition-all duration-300 cursor-pointer ${
              isReady 
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white shadow-blue-600/50 hover:scale-102 animate-bounce' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>{isRtl ? 'دخول المنصة بوضع 3D والبدء الآن' : 'Enter 3D Platform & Start Now'}</span>
            <ArrowRight className="w-5 h-5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
