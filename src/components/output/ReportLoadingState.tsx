import { Search } from 'lucide-react';

export default function ReportLoadingState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-slate-500 space-y-6 py-20">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-zinc-100 dark:border-slate-700 rounded-2xl rotate-45 transform" />
        <div className="w-20 h-20 border-4 border-indigo-600/80 dark:border-indigo-400/80 rounded-2xl rotate-45 transform border-t-transparent animate-spin absolute top-0 left-0" />
        <Search className="w-6 h-6 text-indigo-500 dark:text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-zinc-600 dark:text-slate-300 tracking-wide">
          正在调用 Google Search API 构建情报网...
        </p>
        <p className="text-xs text-zinc-400 dark:text-slate-500 max-w-xs mx-auto">
          分析全球 AI 产品迭代动态，并运用 Gemini 模型与您的能力域进行深度对齐。
        </p>
      </div>
    </div>
  );
}
