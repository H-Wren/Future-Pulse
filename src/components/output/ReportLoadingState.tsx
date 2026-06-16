import { motion } from 'motion/react';

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <motion.div
      className={`bg-zinc-200 dark:bg-slate-700 rounded-lg ${className ?? ''}`}
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }}
    />
  );
}

export default function ReportLoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 py-4"
    >
      {/* Title skeleton */}
      <div className="space-y-3">
        <SkeletonBlock className="h-8 w-2/3" />
        <SkeletonBlock className="h-4 w-1/3" />
      </div>

      {/* Description skeleton */}
      <div className="space-y-2">
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-5/6" />
        <SkeletonBlock className="h-4 w-4/6" />
      </div>

      {/* Table skeleton */}
      <div className="space-y-2 pt-4">
        <div className="flex gap-4">
          <SkeletonBlock className="h-8 flex-1" />
          <SkeletonBlock className="h-8 flex-1" />
          <SkeletonBlock className="h-8 flex-1" />
          <SkeletonBlock className="h-8 flex-[1.5]" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <SkeletonBlock className="h-6 flex-1" />
            <SkeletonBlock className="h-6 flex-1" />
            <SkeletonBlock className="h-6 flex-1" />
            <SkeletonBlock className="h-6 flex-[1.5]" />
          </div>
        ))}
      </div>

      {/* Bullet points skeleton */}
      <div className="space-y-2 pt-4">
        <SkeletonBlock className="h-4 w-1/4" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-5/6" />
      </div>
    </motion.div>
  );
}
