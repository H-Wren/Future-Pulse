import { AnimatePresence, motion } from 'motion/react';
import { RefreshCw, Clock, Newspaper } from 'lucide-react';
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
    <div className="bg-surface border-2 border-border rounded-[6px] flex-1 flex flex-col min-h-[600px] overflow-hidden">
      {/* Header bar */}
      <div className="editorial-topbar">
        <div className="flex items-center gap-2">
          <Newspaper className="w-3.5 h-3.5" />
          <span>Intelligence Console</span>
        </div>
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {report && !isGenerating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
              >
                <ExportMenu content={report} />
              </motion.div>
            )}
          </AnimatePresence>
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="font-mono text-[0.5625rem] font-[500] tracking-[0.14em] uppercase text-text-muted hover:text-text-primary px-2 py-1 rounded-[4px] hover:bg-surface-subtle transition-colors"
            >
              <Clock className="w-3 h-3 inline mr-1 align-middle" />
              历史
            </button>
          )}
          {report && !isGenerating && (
            <span className="font-mono text-[0.5rem] font-[500] tracking-[0.18em] uppercase text-success border-2 border-success/30 rounded-[4px] px-2 py-0.5 leading-none">
              Complete
            </span>
          )}
          {isGenerating && (
            <RefreshCw className="w-3 h-3 animate-spin text-primary" />
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="p-5 lg:p-8 flex-1 overflow-auto bg-[#f8f6f0] dark:bg-[#1e1c18]">
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
          {(status === 'idle' || (!report && !error && status !== 'generating' && status !== 'error')) && (
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
