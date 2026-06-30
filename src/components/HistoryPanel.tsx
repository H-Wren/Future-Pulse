import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Trash2, X, FileText, Loader2 } from 'lucide-react';
import { getAllReports, deleteReport, clearAllReports } from '../utils/storage';
import { isPublicMode } from '../hooks/useGenerateReport';
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
          className="fixed inset-0 z-40 bg-ink/30"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-surface border-l-2 border-border flex flex-col"
          >
            {/* Header */}
            <div className="editorial-topbar">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>历史报告</span>
                <span className="font-mono text-[0.5rem] ml-1">({reports.length})</span>
              </div>
              <div className="flex items-center gap-2">
                {reports.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="font-mono text-[0.5625rem] tracking-[0.1em] uppercase text-danger hover:text-danger/70 transition-colors"
                  >
                    清空
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1 rounded-[4px] text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-5 h-5 animate-spin text-text-muted" />
                </div>
              ) : reports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-text-muted">
                  <FileText className="w-8 h-8 mb-3 opacity-40" />
                  <p className="editorial-mono-label">暂无记录</p>
                </div>
              ) : (
                reports.map((report, i) => (
                    <motion.button
                      key={report.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => handleLoad(report)}
                      className="w-full text-left p-3.5 rounded-[6px] border-2 border-border bg-surface-subtle/30 hover:bg-surface-subtle hover:border-primary/40 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="editorial-mono-caption text-text-muted">
                            {new Date(report.createdAt).toLocaleString('zh-CN')}
                          </p>
                          {!isPublicMode() && (
                            <p className="editorial-mono-caption text-primary mt-1">
                              {report.providerId} / {report.model}
                            </p>
                          )}
                          <p className="editorial-body-sm text-text-secondary mt-1.5 line-clamp-2">
                            {(report.content || '').replace(/^#.*$/gm, '').replace(/^>.*$/gm, '').replace(/^\*\*.*\*\*$/gm, '').replace(/^[-*] /gm, '').split('\n').filter((l) => l.trim().length > 10)[0]?.trim()?.slice(0, 120) || report.focus}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDelete(report.id, e)}
                          className="p-1.5 rounded-[4px] text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-all shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
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
