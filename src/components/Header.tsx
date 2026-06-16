import { Cpu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../utils/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-slate-700/50 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2.5 rounded-xl shadow-sm">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Future Pulse{' '}
              <span className="font-medium text-zinc-400 dark:text-zinc-500 text-sm ml-2">v2.0</span>
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium tracking-wide uppercase mt-0.5">
              AI 算力监控与产品重构 Agent
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="切换主题"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            System Online &amp; Grounded
          </div>
        </div>
      </div>
    </header>
  );
}
