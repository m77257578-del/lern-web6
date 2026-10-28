/**
 * Next.js Project Structure Identifier:
 * app/layout.jsx
 * 
 * Project Identity: ليرن ويب | Lern Web
 * Architecture Framework: Next.js (App Router Layout Structure)
 * Deployment Pipeline: Optimized for Instant Vercel Edge Deployment
 * Purpose: Bilingual context wrappers, metadata providers, and global font injections
 */

import './globals.css';

export const metadata = {
  title: 'ليرن ويب | Lern Web - المنظومة التعليمية السحابية المتكاملة',
  description: 'سوق أدوات ومحاكي مراكز تعليمية متطورة مع محرك PWA وترخيص مرن وتملك كامل للكود المصدري.',
  applicationName: 'Lern Web',
  keywords: [
    'ليرن ويب', 'Lern Web', 'منصة تعليمية', 'سنتر تعليمي', 
    'LMS Next.js', 'PWA Educational App', 'اختبارات ذكية', 'فودافون كاش'
  ],
  authors: [{ name: 'Lern Web Technologies' }],
  creator: 'Lern Web Team',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon-192.png',
    apple: '/icon-192.png',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#090d16' },
  ],
  openGraph: {
    title: 'ليرن ويب | Lern Web',
    description: 'سوق أدوات ومحاكي مراكز تعليمية مع محرك PWA وترخيص تشغيلي مرن',
    siteName: 'Lern Web Platform',
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ليرن ويب | Lern Web',
    description: 'المنظومة السحابية المتكاملة للمراكز والسناتر التعليمية',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2563eb',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className="dark scroll-smooth">
      <head>
        {/* Preconnect to Google Fonts for Cairo, Inter and JetBrains Mono */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
        {/* PWA Apple Touch and Mobile Web App Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="LernWeb" />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white min-h-screen">
        {/* Main Application Container */}
        <div id="app-root" className="min-h-screen flex flex-col justify-between">
          {children}
        </div>

        {/* Global Client-side Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('[LernWeb PWA] Service worker registered on scope: ', reg.scope);
                  }).catch(function(err) {
                    console.log('[LernWeb PWA] Service worker registration note: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
