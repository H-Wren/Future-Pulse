import { motion } from 'motion/react';
import { Cpu, Moon, Sun, Languages } from 'lucide-react';
import { useTheme } from '../utils/ThemeContext';

interface HeaderProps {
  locale: 'zh' | 'en';
  onToggleLocale: () => void;
}

export default function Header({ locale, onToggleLocale }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-surface/80 dark:bg-surface/80 backdrop-blur-xl border-b border-border sticky top-0 z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 10 }}
            className="bg-primary p-2.5 rounded-xl shadow-sm"
          >
            <Cpu className="w-5 h-5 text-surface" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary">
              Future Pulse{' '}
              <span className="font-medium text-text-muted text-sm ml-2">
                v2.0
              </span>
            </h1>
            <p className="text-xs text-text-secondary font-medium tracking-wide uppercase mt-0.5">
              AI 算力监控与产品重构 Agent
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={onToggleLocale}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:bg-surface-subtle transition-colors"
            aria-label="切换语言"
          >
            <Languages className="w-3.5 h-3.5" />
            {locale === 'zh' ? 'EN' : '中'}
          </motion.button>
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg text-text-secondary hover:bg-surface-subtle transition-colors"
            aria-label="切换主题"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </motion.button>
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-success bg-success-glow px-3 py-1.5 rounded-full border border-success-border shadow-sm">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(74,140,108,0.6)]" />
            System Online &amp; Grounded
          </div>
        </div>
      </div>
    </motion.header>
  );
}
