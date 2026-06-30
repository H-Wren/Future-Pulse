import { Loader2 } from 'lucide-react';

export default function ReportLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 lg:py-24">
      <div className="flex items-center gap-3 mb-8">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span className="font-mono text-[0.625rem] font-[500] tracking-[0.18em] uppercase text-primary">
          Processing Intelligence
        </span>
      </div>

      {/* Skeleton blocks */}
      <div className="w-full max-w-lg space-y-4 animate-fade-in">
        <div className="h-6 bg-surface-subtle border border-border rounded-[4px] w-3/4" />
        <div className="space-y-2.5">
          <div className="h-4 bg-surface-subtle border border-border rounded-[3px] w-full" />
          <div className="h-4 bg-surface-subtle border border-border rounded-[3px] w-5/6" />
          <div className="h-4 bg-surface-subtle border border-border rounded-[3px] w-4/6" />
        </div>
        <div className="h-4 bg-surface-subtle border border-border rounded-[3px] w-2/3 mt-6" />
        <hr className="editorial-rule my-6" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-16 bg-surface-subtle border border-border rounded-[6px]" />
          <div className="h-16 bg-surface-subtle border border-border rounded-[6px]" />
          <div className="h-16 bg-surface-subtle border border-border rounded-[6px]" />
        </div>
      </div>
    </div>
  );
}
