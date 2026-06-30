import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ReportErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function ReportErrorState({ error, onRetry }: ReportErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 lg:py-24">
      <div className="w-16 h-16 border-2 border-danger/40 rounded-[6px] flex items-center justify-center mb-6">
        <AlertTriangle className="w-7 h-7 text-danger" />
      </div>
      <div className="max-w-md text-center">
        <h3 className="editorial-heading-sm text-danger mb-2">
          生成中断
        </h3>
        <p className="editorial-body-sm text-text-secondary mb-6 font-mono text-[0.6875rem] leading-relaxed">
          {error}
        </p>
        <button onClick={onRetry} className="editorial-btn">
          <RefreshCw className="w-4 h-4" />
          重试
        </button>
      </div>
    </div>
  );
}
