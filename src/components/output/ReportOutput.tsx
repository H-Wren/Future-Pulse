import { RefreshCw } from 'lucide-react';
import ReportEmptyState from './ReportEmptyState';
import ReportLoadingState from './ReportLoadingState';
import ReportErrorState from './ReportErrorState';
import ReportContent from './ReportContent';
import type { ReportStatus } from '../../types/report';

interface ReportOutputProps {
  status: ReportStatus;
  report: string;
  error: string;
  isGenerating: boolean;
  onRetry: () => void;
}

export default function ReportOutput({
  status,
  report,
  error,
  isGenerating,
  onRetry,
}: ReportOutputProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-zinc-200 dark:border-slate-700/50 flex-1 flex flex-col min-h-[700px] overflow-hidden">
      <div className="p-4 border-b border-zinc-100 dark:border-slate-700/50 bg-zinc-50/80 dark:bg-slate-800/90 flex items-center justify-between shadow-sm z-10 relative">
        <div className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 text-indigo-600 dark:text-indigo-400 ${isGenerating ? 'animate-spin' : ''}`} />
          <h2 className="font-semibold text-zinc-800 dark:text-slate-200 text-sm tracking-wide">
            情报终端输出 (Intelligence Console)
          </h2>
        </div>
        {report && !isGenerating && (
          <span className="text-[11px] uppercase tracking-wider font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-md">
            分析完成
          </span>
        )}
      </div>

      <div className="p-6 lg:p-10 flex-1 overflow-auto bg-white dark:bg-slate-900/60">
        {status === 'error' && <ReportErrorState error={error} onRetry={onRetry} />}
        {status === 'generating' && <ReportLoadingState />}
        {status === 'complete' && report && <ReportContent content={report} />}
        {status === 'idle' && !report && !error && <ReportEmptyState />}
      </div>
    </div>
  );
}
