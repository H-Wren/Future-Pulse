import { useState, useEffect, useCallback } from 'react';
import { getLocale, setLocale, t, subscribeLocaleChange, type Locale } from '../i18n';

export function useLocale() {
  const [locale, setLocaleState] = useState(getLocale);

  useEffect(() => {
    return subscribeLocaleChange(() => setLocaleState(getLocale()));
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'zh' ? 'en' : 'zh');
  }, [locale]);

  return { locale, toggleLocale, t };
}
