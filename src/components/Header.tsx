import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Cpu, Moon, Sun, Languages } from 'lucide-react';
import { useTheme } from '../utils/ThemeContext';
import { t } from '../i18n';

interface HeaderProps {
  locale: 'zh' | 'en';
  onToggleLocale: () => void;
}

export default function Header({ locale, onToggleLocale }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  // Sync document title with locale
  useEffect(() => {
    document.title = locale === 'zh'
      ? 'Future Pulse — AI 技术情报终端'
      : 'Future Pulse — AI Intelligence Terminal';
  }, [locale]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-surface border-b-2 border-border sticky top-0 z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 border-2 border-primary rounded-[6px]">
            <Cpu className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-[500] tracking-tight text-text-primary leading-tight"
                style={{ fontFamily: "'Source Serif 4', serif" }}>
              {t('app.title')}
              <span className="font-mono text-[0.625rem] tracking-wider uppercase text-text-muted ml-2 align-middle font-[500]">
                {t('app.version')}
              </span>
            </h1>
            <p className="font-mono text-[0.5625rem] tracking-[0.18em] uppercase text-text-muted mt-0.5 font-[500]">
              {t('app.subtitle')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleLocale}
            className="font-mono text-[0.625rem] font-[500] tracking-[0.14em] uppercase px-2.5 py-1.5 rounded-[4px] text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors border border-transparent hover:border-border"
            aria-label="Toggle language"
          >
            <Languages className="w-3 h-3 inline mr-1 align-middle" />
            {t('lang.switch')}
          </button>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-[4px] text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          <div className="ml-2 font-mono text-[0.5625rem] font-[500] tracking-[0.14em] uppercase text-success border-2 border-success/30 rounded-[4px] px-2.5 py-1 leading-none">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-success mr-1.5 align-middle animate-pulse" />
            {t('header.status.online')}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
