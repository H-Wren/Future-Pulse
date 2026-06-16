import { Target } from 'lucide-react';

export default function ReportEmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-slate-500 space-y-5 py-20">
      <div className="w-20 h-20 bg-zinc-50 dark:bg-slate-800 rounded-2xl border border-zinc-100 dark:border-slate-700 flex items-center justify-center shadow-inner rotate-3 transition-transform hover:rotate-6">
        <Target className="w-8 h-8 text-zinc-300 dark:text-slate-600" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-zinc-500 dark:text-slate-400 tracking-wide">
          终端已就绪，等待获取指令
        </p>
      </div>
    </div>
  );
}
