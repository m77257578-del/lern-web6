import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { storageService } from '../services/storageService';

interface DynamicClientWatermarkProps {
  currentUser?: any;
  isUserLoggedIn?: boolean;
}

export const DynamicClientWatermark: React.FC<DynamicClientWatermarkProps> = ({
  currentUser,
  isUserLoggedIn
}) => {
  const [position, setPosition] = useState({ x: 10, y: 20 });
  const [direction, setDirection] = useState({ dx: 0.25, dy: 0.2 });

  const clientName = currentUser?.name || currentUser?.email?.split('@')[0] || 'زائر ليرن ويب';
  const clientPhone = currentUser?.phone || currentUser?.email || 'الجلسة المحمية';

  // Floating bounce motion across viewport
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        let newX = prev.x + direction.dx;
        let newY = prev.y + direction.dy;
        let newDx = direction.dx;
        let newDy = direction.dy;

        if (newX > 80 || newX < 5) newDx = -newDx;
        if (newY > 85 || newY < 10) newDy = -newDy;

        setDirection({ dx: newDx, dy: newDy });
        return { x: newX, y: newY };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [direction]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden select-none" dir="rtl">
      {/* 1. Tiled Semi-Transparent Watermark Pattern */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-12 p-8 opacity-[0.08] dark:opacity-[0.12] rotate-[-15deg] scale-110 pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center justify-center text-center space-y-1 text-slate-400 dark:text-slate-200">
            <div className="flex items-center gap-1.5 font-extrabold text-xs md:text-sm tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>{clientName}</span>
            </div>
            <div className="font-mono text-[10px] md:text-xs text-slate-400">
              {clientPhone} • LERN WEB
            </div>
          </div>
        ))}
      </div>

      {/* 2. Floating Animated Security Badge Watermark */}
      <div
        className="absolute transition-all duration-300 ease-linear pointer-events-none"
        style={{ top: `${position.y}%`, left: `${position.x}%` }}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 dark:bg-slate-950/70 border border-slate-700/40 text-slate-300/80 backdrop-blur-xs shadow-lg opacity-25 hover:opacity-40 transition-opacity">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span className="text-[11px] font-bold tracking-tight">
            {clientName} ({clientPhone})
          </span>
          <span className="text-[9px] font-mono text-emerald-400 border-r border-slate-700 pr-2 mr-1">
            محمي ضد التسجيل
          </span>
        </div>
      </div>
    </div>
  );
};
