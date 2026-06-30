import { Newspaper } from 'lucide-react';
import { t } from '../../i18n';

export default function ReportEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 lg:py-24 text-center">
      <div className="w-16 h-16 border-2 border-border rounded-[6px] flex items-center justify-center mb-6">
        <Newspaper className="w-7 h-7 text-text-muted" />
      </div>
      <h3 className="editorial-heading-sm text-text-muted mb-2">
        {t('output.empty.title')}
      </h3>
      <p className="editorial-body-sm text-text-muted max-w-sm">
        {t('output.empty.hint')}
      </p>
      <div className="flex gap-2 mt-6">
        <span className="editorial-tag">Executive Summary</span>
        <span className="editorial-tag">Key Findings</span>
        <span className="editorial-tag">Action Items</span>
      </div>
      <div className="mt-8 font-mono text-[0.5625rem] tracking-[0.18em] uppercase text-text-muted border-2 border-dashed border-border rounded-[6px] px-4 py-2">
        Ready &bull; Awaiting Input
      </div>
    </div>
  );
}
