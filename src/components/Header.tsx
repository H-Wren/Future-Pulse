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
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-slate-700/50 sticky top-0 z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 10 }}
            className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2.5 rounded-xl shadow-sm"
          >
            <Cpu className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Future Pulse{' '}
              <span className="font-medium text-zinc-400 dark:text-zinc-500 text-sm ml-2">
                v2.0
              </span>
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium tracking-wide uppercase mt-0.5">
              AI 算力监控与产品重构 Agent
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={onToggleLocale}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="切换语言"
          >
            <Languages className="w-3.5 h-3.5" />
            {locale === 'zh' ? 'EN' : '中'}
          </motion.button>
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="切换主题"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </motion.button>
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            System Online &amp; Grounded
          </div>
        </div>
      </div>
    </motion.header>
  );
}
