import zh from './zh';
import en from './en';

export type Locale = 'zh' | 'en';

const locales: Record<Locale, Record<string, string>> = { zh, en };

function getBrowserLocale(): Locale {
  try {
    const lang = navigator.language;
    if (lang.startsWith('zh')) return 'zh';
  } catch {
    // fall through
  }
  return 'en';
}

function getStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem('future-pulse-locale');
    if (stored === 'zh' || stored === 'en') return stored;
  } catch {
    // ignore
  }
  return null;
}

let currentLocale: Locale = getStoredLocale() ?? getBrowserLocale();

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  currentLocale = locale;
  try {
    localStorage.setItem('future-pulse-locale', locale);
  } catch {
    // ignore
  }
  // Dispatch custom event so components can re-render
  window.dispatchEvent(new Event('localechange'));
}

export function t(key: string, params?: Record<string, string | number>): string {
  const dict = locales[currentLocale];
  let value = dict[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(`{${k}}`, String(v));
    }
  }
  return value;
}

// Hook to force re-render on locale change
export function subscribeLocaleChange(callback: () => void): () => void {
  window.addEventListener('localechange', callback);
  return () => window.removeEventListener('localechange', callback);
}
