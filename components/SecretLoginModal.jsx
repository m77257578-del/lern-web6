/**
 * Next.js Project Structure Identifier:
 * components/SecretLoginModal.jsx
 * 
 * Project Identity: ليرن ويب | Lern Web
 * Purpose: Unified Client Account Sign-In / Registration modal with discreet Admin & Staff authentication.
 */

import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, ShieldAlert, CheckCircle2, User, X, Eye, EyeOff, Sparkles, Phone, Mail } from 'lucide-react';
import { storageService } from '../src/services/storageService';

export default function SecretLoginModal({ 
  isOpen = false, 
  onClose = () => {}, 
  onLoginSuccess = () => {}, 
  onAdminSuccess = () => {}, 
  onUserSuccess = (_user) => {}, 
  initialTab = 'login', 
  lang = 'ar' 
}) {
  const isRtl = lang === 'ar';
  
  const [visitorSubTab, setVisitorSubTab] = useState(initialTab); // 'login' | 'register'
  const [errorMsg, setErrorMsg] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorPassword, setVisitorPassword] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [visitorSuccess, setVisitorSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisitorSubTab(initialTab);
      setErrorMsg('');
      setVisitorPhone('');
      setVisitorPassword('');
      setVisitorName('');
      setVisitorEmail('');
      setVisitorSuccess(false);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleVisitorSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const identifier = visitorPhone.trim();
    const password = visitorPassword.trim();

    // 1. Check Master Admin discreet login (identifier is 'ادمن' or 'admin', password is passcode)
    const settings = storageService.getSettings();
    const adminPass = settings?.adminPasscode || '100100';
    if ((identifier.toLowerCase() === 'ادمن' || identifier.toLowerCase() === 'admin' || identifier.toLowerCase() === 'master') && password === adminPass) {
      storageService.loginAdmin(adminPass);
      if (onAdminSuccess) onAdminSuccess();
      else if (onLoginSuccess) onLoginSuccess();
      onClose();
      return;
    }

    // 2. Check Staff / Moderator discreet login (staff phone number with adminPass or '100100')
    const staffList = storageService.getStaff();
    const matchedStaff = staffList.find(s => s.phone.trim() === identifier && (password === adminPass || password === '100100' || password === s.phone));
    if (matchedStaff) {
      storageService.loginAdmin(adminPass);
      if (onAdminSuccess) onAdminSuccess();
      else if (onLoginSuccess) onLoginSuccess();
      onClose();
      return;
    }

    // 3. Standard Client Registration / Sign In
    if (visitorSubTab === 'register' && !visitorName.trim()) {
      setErrorMsg(isRtl ? 'يرجى إدخال اسمك الكريم للمتابعة' : 'Please provide your full name');
      return;
    }
    if (!identifier) {
      setErrorMsg(isRtl ? 'يرجى إدخال رقم الهاتف' : 'Please provide your phone number');
      return;
    }
    if (!password) {
      setErrorMsg(isRtl ? 'يرجى إدخال كلمة المرور' : 'Please provide a password');
      return;
    }

    let user = null;
    if (visitorSubTab === 'register') {
      user = storageService.registerUser(identifier, visitorName.trim(), password, visitorEmail.trim());
      if (!user) {
        setErrorMsg(
          isRtl 
            ? 'عذراً! هذا الاسم أو رقم الهاتف أو البريد الإلكتروني مسجل ومحفوظ بالفعل بالمنظومة. تم رفض الدخول/التسجيل المكرر.' 
            : 'Registration failed! This name, phone number, or email is already registered in the platform.'
        );
        return;
      }
    } else {
      user = storageService.authenticateUser(identifier, password);
      if (!user) {
        setErrorMsg(isRtl ? 'بيانات الدخول غير صحيحة (رقم الهاتف أو كلمة السر)' : 'Invalid login credentials.');
        return;
      }
      if (user.isBlocked) {
        setErrorMsg(
          isRtl 
            ? `⚠️ تم حظر هذا الحساب وتجميده من قبل إدارة المنصة.${user.blockReason ? ' السبب: ' + user.blockReason : ''} يرجى التواصل مع إدارة المنظومة.` 
            : `⚠️ This account has been suspended by administration.${user.blockReason ? ' Reason: ' + user.blockReason : ''}`
        );
        return;
      }
    }

    if (user) {
      setVisitorSuccess(true);
      if (onUserSuccess) {
        onUserSuccess(user);
      }
      setTimeout(() => {
        setVisitorSuccess(false);
        onClose();
      }, 900);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 p-6 md:p-8 text-white shadow-2xl space-y-6">
        
        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <User className="w-6 h-6 text-white" />
          </div>

          <h3 className="text-xl md:text-2xl font-black">
            {isRtl ? (visitorSubTab === 'login' ? 'تسجيل دخول العميل' : 'إنشاء حساب جديد') : (visitorSubTab === 'login' ? 'Client Sign In' : 'Create Account')}
          </h3>

          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {isRtl ? 'سجل بياناتك للوصول إلى لوحة العميل وحفظ وتتبع مسودات التخصيص' : 'Enter your details to access your dashboard and track AI drafts'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800">
           <button 
             type="button"
             onClick={() => { setVisitorSubTab('login'); setErrorMsg(''); }}
             className={`flex-1 py-2 text-xs font-bold transition-all cursor-pointer ${visitorSubTab === 'login' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
           >
             {isRtl ? 'لدى حساب بالفعل' : 'I have an account'}
           </button>
           <button 
             type="button"
             onClick={() => { setVisitorSubTab('register'); setErrorMsg(''); }}
             className={`flex-1 py-2 text-xs font-bold transition-all cursor-pointer ${visitorSubTab === 'register' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
           >
             {isRtl ? 'إنشاء حساب جديد' : 'Register'}
           </button>
        </div>

        <form onSubmit={handleVisitorSubmit} className="space-y-4">
          {visitorSubTab === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>{isRtl ? 'اسم صاحب المركز / المدرس:' : 'Full Name:'}</span>
              </label>
              <input
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder={isRtl ? 'أدخل اسمك الكريم أو اسم المركز...' : 'Enter your name or center name...'}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                required={visitorSubTab === 'register'}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isRtl ? 'رقم الهاتف / الموبايل:' : 'Phone Number:'}</span>
            </label>
            <input
              type="text"
              value={visitorPhone}
              onChange={(e) => setVisitorPhone(e.target.value)}
              placeholder={isRtl ? 'مثال: 01012345678' : 'e.g. 01012345678'}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none font-mono"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>{isRtl ? 'كلمة السر:' : 'Password:'}</span>
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={visitorPassword}
                onChange={(e) => setVisitorPassword(e.target.value)}
                placeholder={isRtl ? 'أدخل كلمة السر...' : 'Enter password...'}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {visitorSubTab === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{isRtl ? 'البريد الإلكتروني (اختياري):' : 'Email Address (Optional):'}</span>
              </label>
              <input
                type="email"
                value={visitorEmail}
                onChange={(e) => setVisitorEmail(e.target.value)}
                placeholder={isRtl ? 'name@example.com' : 'name@example.com'}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none font-mono"
              />
            </div>
          )}

          {errorMsg && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {visitorSuccess && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-xs text-emerald-300 flex items-center justify-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? 'تمت العملية بنجاح! جاري تحويلك...' : 'Success! Redirecting...'}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isRtl ? (visitorSubTab === 'login' ? 'دخول لوحة العميل' : 'إنشاء الحساب والدخول') : (visitorSubTab === 'login' ? 'Sign In' : 'Register & Enter')}</span>
          </button>
        </form>

        <div className="border-t border-slate-800 pt-3 text-center">
          <p className="text-[11px] text-slate-500">
            {isRtl ? 'نظام ليرن ويب الآمن لتشفير وإدارة بيانات العملاء' : 'Lern Web Secure Client Session'}
          </p>
        </div>
      </div>
    </div>
  );
}
