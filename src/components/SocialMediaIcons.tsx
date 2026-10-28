/**
 * Project: ليرن ويب | Lern Web
 * File: src/components/SocialMediaIcons.tsx
 * High-fidelity vector SVG brand icons and interactive display bar for all supported social media applications.
 * Requirement: Rendered strictly as social media app icons (not text) with official brand colors and tooltips.
 */

import React from 'react';

export type SocialAppType =
  | 'whatsapp'
  | 'facebook'
  | 'instagram'
  | 'telegram'
  | 'youtube'
  | 'tiktok'
  | 'twitter'
  | 'linkedin'
  | 'discord'
  | 'github'
  | 'snapchat'
  | 'threads'
  | 'phone'
  | 'email'
  | 'website';

export interface SocialAppMeta {
  type: SocialAppType;
  nameAr: string;
  nameEn: string;
  brandColor: string;
  hoverBg: string;
  defaultUrlPrefix: string;
}

export const AVAILABLE_SOCIAL_APPS: SocialAppMeta[] = [
  {
    type: 'whatsapp',
    nameAr: 'واتساب',
    nameEn: 'WhatsApp',
    brandColor: '#25D366',
    hoverBg: 'hover:bg-[#25D366]/20 hover:border-[#25D366]/50 hover:text-[#25D366]',
    defaultUrlPrefix: 'https://wa.me/'
  },
  {
    type: 'facebook',
    nameAr: 'فيسبوك',
    nameEn: 'Facebook',
    brandColor: '#1877F2',
    hoverBg: 'hover:bg-[#1877F2]/20 hover:border-[#1877F2]/50 hover:text-[#1877F2]',
    defaultUrlPrefix: 'https://facebook.com/'
  },
  {
    type: 'instagram',
    nameAr: 'إنستغرام',
    nameEn: 'Instagram',
    brandColor: '#E4405F',
    hoverBg: 'hover:bg-[#E4405F]/20 hover:border-[#E4405F]/50 hover:text-[#E4405F]',
    defaultUrlPrefix: 'https://instagram.com/'
  },
  {
    type: 'telegram',
    nameAr: 'تيليجرام',
    nameEn: 'Telegram',
    brandColor: '#229ED9',
    hoverBg: 'hover:bg-[#229ED9]/20 hover:border-[#229ED9]/50 hover:text-[#229ED9]',
    defaultUrlPrefix: 'https://t.me/'
  },
  {
    type: 'youtube',
    nameAr: 'يوتيوب',
    nameEn: 'YouTube',
    brandColor: '#FF0000',
    hoverBg: 'hover:bg-[#FF0000]/20 hover:border-[#FF0000]/50 hover:text-[#FF0000]',
    defaultUrlPrefix: 'https://youtube.com/'
  },
  {
    type: 'tiktok',
    nameAr: 'تيك توك',
    nameEn: 'TikTok',
    brandColor: '#00F2FE',
    hoverBg: 'hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-400',
    defaultUrlPrefix: 'https://tiktok.com/@'
  },
  {
    type: 'twitter',
    nameAr: 'إكس (تويتر)',
    nameEn: 'X (Twitter)',
    brandColor: '#FFFFFF',
    hoverBg: 'hover:bg-white/20 hover:border-white/50 hover:text-white',
    defaultUrlPrefix: 'https://x.com/'
  },
  {
    type: 'linkedin',
    nameAr: 'لينكد إن',
    nameEn: 'LinkedIn',
    brandColor: '#0A66C2',
    hoverBg: 'hover:bg-[#0A66C2]/20 hover:border-[#0A66C2]/50 hover:text-[#0A66C2]',
    defaultUrlPrefix: 'https://linkedin.com/company/'
  },
  {
    type: 'discord',
    nameAr: 'ديسكورد',
    nameEn: 'Discord',
    brandColor: '#5865F2',
    hoverBg: 'hover:bg-[#5865F2]/20 hover:border-[#5865F2]/50 hover:text-[#5865F2]',
    defaultUrlPrefix: 'https://discord.gg/'
  },
  {
    type: 'github',
    nameAr: 'جيت هاب',
    nameEn: 'GitHub',
    brandColor: '#F0F6FC',
    hoverBg: 'hover:bg-slate-700/40 hover:border-slate-500 hover:text-white',
    defaultUrlPrefix: 'https://github.com/'
  },
  {
    type: 'snapchat',
    nameAr: 'سناب شات',
    nameEn: 'Snapchat',
    brandColor: '#FFFC00',
    hoverBg: 'hover:bg-[#FFFC00]/20 hover:border-[#FFFC00]/50 hover:text-[#FFFC00]',
    defaultUrlPrefix: 'https://snapchat.com/add/'
  },
  {
    type: 'threads',
    nameAr: 'ثريدز',
    nameEn: 'Threads',
    brandColor: '#FFFFFF',
    hoverBg: 'hover:bg-white/20 hover:border-white/50 hover:text-white',
    defaultUrlPrefix: 'https://threads.net/@'
  },
  {
    type: 'phone',
    nameAr: 'اتصال هاتفي',
    nameEn: 'Phone Call',
    brandColor: '#10B981',
    hoverBg: 'hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:text-emerald-400',
    defaultUrlPrefix: 'tel:'
  },
  {
    type: 'email',
    nameAr: 'بريد إلكتروني',
    nameEn: 'Email',
    brandColor: '#F59E0B',
    hoverBg: 'hover:bg-amber-500/20 hover:border-amber-500/50 hover:text-amber-400',
    defaultUrlPrefix: 'mailto:'
  },
  {
    type: 'website',
    nameAr: 'موقع إلكتروني',
    nameEn: 'Website',
    brandColor: '#6366F1',
    hoverBg: 'hover:bg-indigo-500/20 hover:border-indigo-500/50 hover:text-indigo-400',
    defaultUrlPrefix: 'https://'
  }
];

export function getSocialAppMeta(appType: string): SocialAppMeta {
  const match = AVAILABLE_SOCIAL_APPS.find(a => a.type === appType);
  return match || {
    type: 'website',
    nameAr: 'رابط خارجي',
    nameEn: 'External Link',
    brandColor: '#3B82F6',
    hoverBg: 'hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-400',
    defaultUrlPrefix: 'https://'
  };
}

export interface SocialIconProps {
  app: SocialAppType | string;
  className?: string;
  size?: number;
}

export function SocialAppSvgIcon({ app, className = 'w-5 h-5', size }: SocialIconProps) {
  const iconStyle = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  switch (app) {
    case 'whatsapp':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.24-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.45 1.03 2.61.12.17 1.77 2.71 4.3 3.79.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.59.21-1.09.15-1.19-.06-.1-.23-.17-.48-.29" />
        </svg>
      );

    case 'facebook':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );

    case 'instagram':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );

    case 'telegram':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      );

    case 'youtube':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );

    case 'tiktok':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      );

    case 'twitter':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );

    case 'linkedin':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      );

    case 'discord':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      );

    case 'github':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );

    case 'snapchat':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.002.5c-4.148 0-6.797 3.08-6.797 6.273 0 1.32.44 2.502.834 3.284.145.29.13.435-.015.58-.29.29-.87.435-1.305.58-.435.145-.58.435-.58.725 0 .435.435.87 1.015 1.015 1.16.29 2.03.58 2.175 1.305.145.58-.29 1.16-.87 1.595-.58.435-1.305.87-1.885 1.595-.435.58-.29 1.16.29 1.45 1.45.725 3.19.435 4.64.145.435-.145 1.015-.29 1.45.145.435.435.435 1.015.435 1.45 0 .29.145.58.435.58.29 0 .435-.29.435-.58 0-.435 0-1.015.435-1.45.435-.435 1.015-.29 1.45-.145 1.45.29 3.19.58 4.64-.145.58-.29.725-.87.29-1.45-.58-.725-1.305-1.16-1.885-1.595-.58-.435-1.015-1.015-.87-1.595.145-.725 1.015-1.015 2.175-1.305.58-.145 1.015-.58 1.015-1.015 0-.29-.145-.58-.58-.725-.435-.145-1.015-.29-1.305-.58-.145-.145-.16-.29-.015-.58.394-.782.834-1.964.834-3.284C18.799 3.58 16.15.5 12.002.5z" />
        </svg>
      );

    case 'threads':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.002 0c6.626 0 11.998 5.373 11.998 12s-5.372 12-11.998 12C5.375 24 0 18.627 0 12S5.375 0 12.002 0zm.067 4.22c-4.484 0-7.394 2.92-7.394 7.427 0 4.693 3.167 7.784 7.394 7.784 3.111 0 5.485-1.637 6.307-4.341l-2.025-.66c-.571 1.954-2.127 3.003-4.282 3.003-3.13 0-5.289-2.316-5.289-5.786 0-3.328 2.05-5.43 5.289-5.43 2.936 0 4.79 1.704 4.887 4.545v.518h-4.887c-1.991 0-3.22 1.077-3.22 2.668 0 1.545 1.252 2.623 3.09 2.623 1.761 0 3.023-.974 3.493-2.362.48 1.488 1.83 2.362 3.593 2.362 2.502 0 4.14-1.782 4.14-4.521 0-4.664-3.486-7.828-8.196-7.828zm-.044 9.176c-.958 0-1.637-.532-1.637-1.306 0-.814.704-1.328 1.637-1.328h2.791c-.13 1.65-1.258 2.634-2.791 2.634z" />
        </svg>
      );

    case 'phone':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );

    case 'email':
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );

    case 'website':
    default:
      return (
        <svg style={iconStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
  }
}

export interface SocialMediaItemData {
  id: string;
  app: SocialAppType | string;
  url: string;
  titleAr?: string;
  titleEn?: string;
  isActive?: boolean;
}

export interface SocialMediaBarProps {
  links: SocialMediaItemData[];
  lang?: 'ar' | 'en';
  variant?: 'circle' | 'pill' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * SocialMediaBar: Strictly renders as clickable icons of the selected social media apps.
 * Requirement: "وتكون على شكل ايقونات تطبيقات السوشيال ميديا التى يتم اختيارها ليست كتابه"
 */
export function SocialMediaBar({
  links = [],
  lang = 'ar',
  variant = 'circle',
  size = 'md',
  className = ''
}: SocialMediaBarProps) {
  const isRtl = lang === 'ar';
  const activeLinks = (links || []).filter(l => l.isActive !== false && l.url && l.url.trim().length > 0);

  if (activeLinks.length === 0) return null;

  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5 text-xs',
    md: 'w-10 h-10 p-2 text-sm',
    lg: 'w-12 h-12 p-2.5 text-base'
  }[size];

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }[size];

  return (
    <div className={`flex flex-wrap items-center justify-center gap-2.5 ${className}`} role="navigation" aria-label="Social Media Links">
      {activeLinks.map((item) => {
        const meta = getSocialAppMeta(item.app);
        const title = isRtl ? (item.titleAr || meta.nameAr) : (item.titleEn || meta.nameEn);

        return (
          <a
            key={item.id || item.app}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title={title}
            aria-label={title}
            className={`group relative flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/90 text-slate-300 shadow-md transition-all duration-300 hover:scale-110 active:scale-95 ${sizeClasses} ${meta.hoverBg}`}
            style={{ color: meta.brandColor }}
          >
            <SocialAppSvgIcon app={item.app} className={`${iconSizeClasses} transition-transform group-hover:scale-110`} />
            
            {/* Tooltip on Hover */}
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-950/95 px-2 py-0.5 text-[11px] font-bold text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity border border-slate-700/60 z-50">
              {title}
            </span>
          </a>
        );
      })}
    </div>
  );
}
