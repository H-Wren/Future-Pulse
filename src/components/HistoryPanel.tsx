import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Trash2, X, FileText, Loader2 } from 'lucide-react';
import { getAllReports, deleteReport, clearAllReports } from '../utils/storage';
import type { SavedReport } from '../types/report';

interface HistoryPanelProps {
  open: boolean;
  onClose: () => void;
  onLoadReport: (report: SavedReport) => void;
}

export default function HistoryPanel({ open, onClose, onLoadReport }: HistoryPanelProps) {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(false);

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const all = await getAllReports();
      setReports(all);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) loadReports();
  }, [open, loadReports]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteReport(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClearAll = async () => {
    await clearAllReports();
    setReports([]);
  };

  const handleLoad = (report: SavedReport) => {
    onLoadReport(report);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-surface dark:bg-surface shadow-2xl border-l border-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-light">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-text-primary">历史报告</h2>
                <span className="text-xs text-text-muted ml-1">
                  ({reports.length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                {reports.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-danger hover:text-red-700 dark:hover:text-red-400 font-medium transition-colors"
                  >
                    清空全部
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-surface-subtle transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
                </div>
              ) : reports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-text-muted">
                  <FileText className="w-10 h-10 mb-3 text-text-muted" />
                  <p className="text-sm">暂无历史报告</p>
                </div>
              ) : (
                reports.map((report) => (
                  <motion.button
                    key={report.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleLoad(report)}
                    className="w-full text-left p-4 rounded-xl bg-surface-subtle border border-border-light hover:border-primary/30 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-text-muted font-mono">
                          {new Date(report.createdAt).toLocaleString('zh-CN')}
                        </p>
                        <p className="text-xs text-primary font-medium mt-0.5">
                          {report.providerId} / {report.model}
                        </p>
                        <p className="text-sm text-text-secondary mt-1 truncate">
                          {report.focus}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDelete(report.id, e)}
                        className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-red-50 dark:hover:bg-red-900/30 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
