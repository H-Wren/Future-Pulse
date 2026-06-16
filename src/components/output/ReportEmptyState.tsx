import { motion } from 'motion/react';
import { Target } from 'lucide-react';

export default function ReportEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col items-center justify-center text-text-muted space-y-5 py-20"
    >
      <motion.div
        animate={{ rotate: [0, 3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 h-20 bg-surface-subtle rounded-2xl border border-border-light flex items-center justify-center shadow-inner"
      >
        <Target className="w-8 h-8 text-text-muted" />
      </motion.div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-text-secondary tracking-wide">
          终端已就绪，等待获取指令
        </p>
        <p className="text-xs text-text-muted">
          填写左侧信息后点击生成，获取专属 AI 算力报告
        </p>
      </div>
    </motion.div>
  );
}
