import { motion } from 'motion/react';
import { Target } from 'lucide-react';

export default function ReportEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-slate-500 space-y-5 py-20"
    >
      <motion.div
        animate={{ rotate: [0, 3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 h-20 bg-zinc-50 dark:bg-slate-800 rounded-2xl border border-zinc-100 dark:border-slate-700 flex items-center justify-center shadow-inner"
      >
        <Target className="w-8 h-8 text-zinc-300 dark:text-slate-600" />
      </motion.div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-zinc-500 dark:text-slate-400 tracking-wide">
          终端已就绪，等待获取指令
        </p>
        <p className="text-xs text-zinc-400 dark:text-slate-500">
          填写左侧信息后点击生成，获取专属 AI 算力报告
        </p>
      </div>
    </motion.div>
  );
}
