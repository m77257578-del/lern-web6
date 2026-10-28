/**
 * Project: ليرن ويب | Lern Web
 * File: src/components/PaymentWalletsSection.tsx
 * Purpose: Dedicated Payment Methods & Wallets Section (طرق الدفع والتحويل المباشر).
 */

import React, { useState } from 'react';
import { CreditCard, Copy, Check, ShieldCheck, ExternalLink, Send, Smartphone } from 'lucide-react';
import { WalletConfig, buildWhatsAppUrl } from '../services/storageService';
import SectionMediaShowcase from './SectionMediaShowcase';

interface PaymentWalletsSectionProps {
  wallets: WalletConfig[];
  adminSettings: any;
  lang?: 'ar' | 'en';
  showToast?: (msg: string, type?: 'success' | 'error') => void;
}

export default function PaymentWalletsSection({ wallets, adminSettings, lang = 'ar', showToast }: PaymentWalletsSectionProps) {
  const isRtl = lang === 'ar';
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeWallets = wallets.filter(w => w.isActive !== false);
  const targetWhatsApp = adminSettings?.targetWhatsAppNumber || '201024889921';

  const handleCopy = (id: string, number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
    if (showToast) {
      showToast(isRtl ? 'تم نسخ رقم الحساب/المحفظة بنجاح!' : 'Account/Wallet number copied successfully!', 'success');
    }
  };

  return (
    <section id="wallets" className="scroll-mt-24 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl border border-blue-500/40 bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-950 p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-300">
            <CreditCard className="w-4 h-4 text-blue-400" />
            <span>{isRtl ? 'بوابة طرق الدفع والتحويل المباشر' : 'Direct Payment Methods & Wallets'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            {isRtl ? 'طرق الدفع المعتمدة لتحويل المستحقات وإتمام التفعيل' : 'Approved Payment Channels for Direct Settlement'}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {isRtl 
              ? 'قم بالتحويل عبر إحدى وسائل الدفع أدناه (فودافون كاش، انستاباي، المحافظ الإلكترونية، أو التحويل البنكي)، ثم أرسل إيصال التحويل عبر الواتساب لتفعيل حسابك ومشاريعك فورياً.'
              : 'Transfer securely via any approved payment channel below, then submit your receipt via WhatsApp for instant activation.'}
          </p>
        </div>
      </div>

      {/* Published Videos for Payment Methods */}
      <SectionMediaShowcase targetSection="wallets" lang={lang} />

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeWallets.map((wallet) => {
          const isCopied = copiedId === wallet.id;
          return (
            <div 
              key={wallet.id}
              className="transform-gpu hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-6 backdrop-blur-xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow-lg"
                      style={{ backgroundColor: wallet.color || '#3b82f6' }}
                    >
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">
                        {isRtl ? wallet.nameAr : (wallet.nameEn || wallet.nameAr)}
                      </h3>
                      <span className="text-[11px] font-bold text-blue-400">
                        {wallet.badge || (isRtl ? 'محفظة معتمدة' : 'Verified Wallet')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Number Box */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 flex items-center justify-between gap-3">
                  <span className="font-mono text-base md:text-lg font-black text-emerald-400 tracking-wider truncate">
                    {wallet.number}
                  </span>
                  <button
                    onClick={() => handleCopy(wallet.id, wallet.number)}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-2 text-xs font-bold text-white transition shrink-0 cursor-pointer shadow-md"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{isCopied ? (isRtl ? 'تم النسخ' : 'Copied') : (isRtl ? 'نسخ' : 'Copy')}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {isRtl ? wallet.instructionsAr : (wallet.instructionsEn || wallet.instructionsAr)}
                </p>
              </div>

              {/* Action Button to WhatsApp */}
              <div className="pt-4 border-t border-slate-800/80 relative z-10">
                <a
                  href={buildWhatsAppUrl(targetWhatsApp, isRtl ? `مرحباً، قمت بالتحويل عبر ${wallet.nameAr} وهذ هو إيصال الدفع.` : `Hello, I have transferred via ${wallet.nameAr} and here is my payment receipt.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-3 text-xs md:text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition active:scale-95 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isRtl ? 'إرسال الإيصال عبر الواتساب' : 'Send Receipt via WhatsApp'}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
