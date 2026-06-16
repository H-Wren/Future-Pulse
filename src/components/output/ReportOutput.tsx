import { AnimatePresence, motion } from 'motion/react';
import { RefreshCw, Clock } from 'lucide-react';
import ReportEmptyState from './ReportEmptyState';
import ReportLoadingState from './ReportLoadingState';
import ReportErrorState from './ReportErrorState';
import ReportContent from './ReportContent';
import ExportMenu from '../ExportMenu';
import type { ReportStatus } from '../../types/report';

interface ReportOutputProps {
  status: ReportStatus;
  report: string;
  error: string;
  isGenerating: boolean;
  onRetry: () => void;
  onOpenHistory?: () => void;
}

export default function ReportOutput({
  status,
  report,
  error,
  isGenerating,
  onRetry,
  onOpenHistory,
}: ReportOutputProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-zinc-200 dark:border-slate-700/50 flex-1 flex flex-col min-h-[700px] overflow-hidden">
      <div className="p-4 border-b border-zinc-100 dark:border-slate-700/50 bg-zinc-50/80 dark:bg-slate-800/90 flex items-center justify-between shadow-sm z-10 relative">
        <div className="flex items-center gap-2">
          <RefreshCw
            className={`w-4 h-4 text-indigo-600 dark:text-indigo-400 ${isGenerating ? 'animate-spin' : ''}`}
          />
          <h2 className="font-semibold text-zinc-800 dark:text-slate-200 text-sm tracking-wide">
            情报终端输出 (Intelligence Console)
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {report && !isGenerating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2"
              >
                <ExportMenu content={report} />
              </motion.div>
            )}
          </AnimatePresence>
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 bg-zinc-50 dark:bg-slate-800 hover:bg-zinc-100 dark:hover:bg-slate-700 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              历史
            </button>
          )}
          {report && !isGenerating && (
            <span className="text-[11px] uppercase tracking-wider font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-md">
              分析完成
            </span>
          )}
        </div>
      </div>

      <div className="p-6 lg:p-10 flex-1 overflow-auto bg-white dark:bg-slate-900/60">
        <AnimatePresence mode="wait">
          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ReportErrorState error={error} onRetry={onRetry} />
            </motion.div>
          )}
          {status === 'generating' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ReportLoadingState />
            </motion.div>
          )}
          {status === 'complete' && report && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ReportContent content={report} />
            </motion.div>
          )}
          {status === 'idle' && !report && !error && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ReportEmptyState />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
