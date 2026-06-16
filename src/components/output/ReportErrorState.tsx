interface ReportErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function ReportErrorState({ error, onRetry }: ReportErrorStateProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center py-20">
      <div className="bg-red-50 dark:bg-red-900/20 text-danger p-4 rounded-xl text-sm border border-danger/20 dark:border-danger/30 shadow-sm max-w-md">
        <div className="flex items-start gap-3">
          <div className="bg-red-100 dark:bg-red-800/50 p-1 rounded shrink-0 text-base">❌</div>
          <div className="space-y-3">
            <span className="block pt-0.5">{error}</span>
            <button
              onClick={onRetry}
              className="text-xs font-medium text-danger hover:text-red-700 dark:hover:text-red-300 underline underline-offset-2"
            >
              点击重试
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
