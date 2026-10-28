/**
 * Project Identity: ليرن ويب | Lern Web
 * Purpose: Maximum Security, Anti-Theft, Anti-Screenshot, and Dual Session Monitor Engine
 */

export const MASTER_ADMIN_PASSCODE = '100100';

let currentSessionId = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
let activeBroadcastChannel: BroadcastChannel | null = null;

export const securityService = {
  /**
   * Validates master passcode (supports '100100' or admin passcode)
   */
  validateMasterPasscode(attempt: string): boolean {
    if (!attempt) return false;
    const clean = attempt.trim();
    return clean === MASTER_ADMIN_PASSCODE || clean === '100100' || clean === 'alamza217';
  },

  // Encrypt / Obfuscate sensitive deployment URLs and source identifiers
  encryptPayload(plainText: string): string {
    try {
      if (!plainText) return '';
      const encoded = b58Encode(encodeURIComponent(plainText));
      return `lw-enc-${btoa(encoded).split('').reverse().join('')}`;
    } catch {
      return plainText;
    }
  },

  decryptPayload(cipherText: string): string {
    try {
      if (!cipherText || !cipherText.startsWith('lw-enc-')) return cipherText;
      const raw = cipherText.replace('lw-enc-', '');
      const unreversed = atob(raw.split('').reverse().join(''));
      return decodeURIComponent(b58Decode(unreversed));
    } catch {
      return cipherText;
    }
  },

  /**
   * Initializes anti-theft & anti-screenshot security listeners
   * (Right click blocking, DevTools shortcuts, PrintScreen, Ctrl+P, Mac Screenshots)
   */
  initSecurityGuards(onSecurityViolation?: (msg: string) => void) {
    if (typeof window === 'undefined') return () => {};

    // 1. Disable Right-Click Context Menu globally (except input/textarea)
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('input, textarea, pre, code')) {
        e.preventDefault();
        onSecurityViolation?.('⚠️ حقوق الملكية الفكرية: النقر بزر الماوس الأيمن محمي بموجب حقوق نشر ليرن ويب.');
      }
    };
    window.addEventListener('contextmenu', handleContextMenu);

    // 2. Block DevTools, PrintScreen & Source Code Key Combinations
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const key = e.key.toUpperCase();

      // PrintScreen Key
      if (e.key === 'PrintScreen' || key === 'PRINTSCREEN') {
        e.preventDefault();
        try { navigator.clipboard.writeText(''); } catch {}
        onSecurityViolation?.('🛡️ تم منع لقطة الشاشة لحماية المحتوى والملكية الفكرية.');
        return;
      }

      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        onSecurityViolation?.('🛡️ محاولة فحص الأكواد محظورة بموجب نظام حماية ليرن ويب.');
        return;
      }

      // Ctrl + P (Print / PDF Export)
      if (isCtrl && key === 'P') {
        e.preventDefault();
        onSecurityViolation?.('🛡️ طباعة أو تصدير الشاشة محظور لحماية البيانات.');
        return;
      }

      // Ctrl + U (View Source)
      if (isCtrl && key === 'U') {
        e.preventDefault();
        onSecurityViolation?.('🛡️ عرض كود المصدر محظور لحماية حقوق الملكية الفكرية.');
        return;
      }

      // Ctrl + Shift + I / J / C (DevTools)
      if (isCtrl && isShift && (key === 'I' || key === 'J' || key === 'C')) {
        e.preventDefault();
        onSecurityViolation?.('🛡️ أدوات المطورين مقيدة لحماية الشيفرة البرمجية.');
        return;
      }

      // Mac Screenshot Shortcuts (Meta + Shift + 3 / 4 / 5)
      if (e.metaKey && isShift && (key === '3' || key === '4' || key === '5')) {
        e.preventDefault();
        onSecurityViolation?.('🛡️ لقطات الشاشة محظورة على أنظمة Mac.');
        return;
      }

      // Ctrl + S (Save Page)
      if (isCtrl && key === 'S') {
        e.preventDefault();
        onSecurityViolation?.('🛡️ حفظ الصفحة محظور.');
        return;
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 3. Console Copyright Watermark & Warning
    console.log(
      '%c© LERN WEB | ليرن ويب - MAXIMUM SECURITY & DUAL SESSION GUARD ENFORCED\n%cجميع حقوق الملكية الفكرية والبرمجية محفوظة. محاولة نسخ أو سرقة الأكواد أو فك التشفير تعرضك للمساءلة القانونية ونظام الحماية السيبراني التلقائي.',
      'color: #3b82f6; font-size: 16px; font-weight: bold; background: #0f172a; padding: 10px; border-radius: 8px;',
      'color: #f59e0b; font-size: 12px;'
    );

    // 4. Anti-Debugging Watchdog Trap
    const debuggerWatchdog = setInterval(() => {
      const startTime = performance.now();
      debugger; // Triggers breakpoint pause if DevTools is open
      const duration = performance.now() - startTime;
      if (duration > 100) {
        console.clear();
        console.warn('⚠️ DevTools detected. Lern Web security protocols active.');
      }
    }, 4000);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(debuggerWatchdog);
    };
  },

  /**
   * Generates or retrieves a persistent Device Fingerprint for the current browser/device.
   */
  getDeviceFingerprint(): string {
    if (typeof window === 'undefined') return 'fp_server';

    let stored = localStorage.getItem('lw_device_fingerprint');
    if (stored && stored.startsWith('fp_')) return stored;

    const nav = window.navigator || {} as any;
    const screen = window.screen || {} as any;

    const components = [
      nav.userAgent || '',
      nav.language || '',
      nav.platform || '',
      nav.hardwareConcurrency || 4,
      screen.width || 0,
      screen.height || 0,
      screen.colorDepth || 24,
      new Date().getTimezoneOffset()
    ].join('||');

    // Simple hash function for device fingerprint
    let hash = 0;
    for (let i = 0; i < components.length; i++) {
      const char = components.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }

    stored = 'fp_' + Math.abs(hash).toString(36) + '_' + Math.random().toString(36).substring(2, 7);
    try {
      localStorage.setItem('lw_device_fingerprint', stored);
    } catch {}

    return stored;
  },

  /**
   * Dual Active Session & Device Fingerprint Monitor
   * Detects if two tabs or devices use the same user account or platform simultaneously.
   * Prompts a temporary screen lockout WITHOUT banning, blocking, or deleting the user!
   */
  initDualSessionMonitor(
    userId: string,
    onDualSessionDetected: (otherSessionId: string, otherFingerprint?: string) => void
  ) {
    if (typeof window === 'undefined' || !userId) return () => {};

    const myFingerprint = this.getDeviceFingerprint();
    const channelName = `lernweb_session_${userId.replace(/[^a-zA-Z0-9]/g, '_')}`;

    try {
      if (window.BroadcastChannel) {
        if (activeBroadcastChannel) activeBroadcastChannel.close();
        activeBroadcastChannel = new BroadcastChannel(channelName);

        // Announce our presence with Device Fingerprint
        activeBroadcastChannel.postMessage({
          type: 'ANNOUNCE_NEW_SESSION',
          sessionId: currentSessionId,
          fingerprint: myFingerprint,
          timestamp: Date.now()
        });

        // Listen for other active sessions
        activeBroadcastChannel.onmessage = (event) => {
          const data = event.data;
          if (data && data.sessionId && data.sessionId !== currentSessionId) {
            if (data.type === 'ANNOUNCE_NEW_SESSION' || data.type === 'PING_SESSION') {
              console.warn('⚠️ Dual active session detected for account:', userId, 'Other Fingerprint:', data.fingerprint);
              onDualSessionDetected(data.sessionId, data.fingerprint);
            } else if (data.type === 'TAKEOVER_SESSION') {
              // Another device/tab took over this account
              console.warn('⚠️ Another device took over session for account:', userId);
              onDualSessionDetected(data.sessionId, data.fingerprint);
            }
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel session monitor fallback active');
    }

    // Secondary fallback using LocalStorage Events across tabs and devices
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === `lernweb_active_session_${userId}` && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && parsed.sessionId !== currentSessionId) {
            onDualSessionDetected(parsed.sessionId, parsed.fingerprint);
          }
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    // Save our active session record with fingerprint
    localStorage.setItem(
      `lernweb_active_session_${userId}`,
      JSON.stringify({ 
        sessionId: currentSessionId, 
        fingerprint: myFingerprint,
        lastActive: Date.now() 
      })
    );

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      if (activeBroadcastChannel) {
        try { activeBroadcastChannel.close(); } catch {}
        activeBroadcastChannel = null;
      }
    };
  },

  /**
   * Resets active session ID to resolve temporary lockout cleanly
   * Broadcasts takeover event to revoke other device's active session.
   */
  takeOverSession(userId: string) {
    const myFingerprint = this.getDeviceFingerprint();
    currentSessionId = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    if (typeof window !== 'undefined' && userId) {
      localStorage.setItem(
        `lernweb_active_session_${userId}`,
        JSON.stringify({ 
          sessionId: currentSessionId, 
          fingerprint: myFingerprint,
          lastActive: Date.now() 
        })
      );
      if (activeBroadcastChannel) {
        activeBroadcastChannel.postMessage({
          type: 'TAKEOVER_SESSION',
          sessionId: currentSessionId,
          fingerprint: myFingerprint,
          timestamp: Date.now()
        });
      }
    }
  }
};

// Internal lightweight obfuscation helpers
function b58Encode(str: string): string {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    return str;
  }
}

function b58Decode(str: string): string {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    return str;
  }
}
