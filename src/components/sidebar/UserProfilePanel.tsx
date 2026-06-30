import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { FileText, Target, Zap, Loader2, User, Settings2, Bookmark, Clock, Upload, CheckCircle2, AlertTriangle, Globe } from 'lucide-react';
import { PROVIDERS } from '../../utils/providers';
import type { ProviderId } from '../../utils/providers';
import type { AIProvider } from '../../utils/providers';
import type { TimeRange, ReportLang } from '../../hooks/useGenerateReport';
import { TIME_RANGE_LABELS } from '../../hooks/useGenerateReport';
import { extractTextFromPDF } from '../../utils/pdf';
import { t } from '../../i18n';

interface UserProfilePanelProps {
  resume: string;
  focus: string;
  timeRange: TimeRange;
  reportLang: ReportLang;
  isGenerating: boolean;
  providerId: ProviderId;
  model: string;
  currentProvider: AIProvider;
  onResumeChange: (value: string) => void;
  onFocusChange: (value: string) => void;
  onTimeRangeChange: (value: TimeRange) => void;
  onReportLangChange: (value: ReportLang) => void;
  onGenerate: () => void;
  onProviderChange: (id: ProviderId) => void;
  onModelChange: (model: string) => void;
  onOpenApiKeys: () => void;
  publicMode?: boolean;
}

type PdfStatus = 'idle' | 'parsing' | 'done' | 'error';

export default function UserProfilePanel({
  resume,
  focus,
  timeRange,
  reportLang,
  isGenerating,
  providerId,
  model,
  currentProvider,
  onResumeChange,
  onFocusChange,
  onTimeRangeChange,
  onReportLangChange,
  onGenerate,
  onProviderChange,
  onModelChange,
  onOpenApiKeys,
  publicMode = false,
}: UserProfilePanelProps) {
  const [pdfStatus, setPdfStatus] = useState<PdfStatus>('idle');
  const [pdfName, setPdfName] = useState('');
  const [pdfError, setPdfError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValid = resume.trim().length >= 20 && focus.trim().length >= 2;

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setPdfError(t('sidebar.pdf.error'));
      setPdfStatus('error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setPdfError('PDF too large (max 10MB)');
      setPdfStatus('error');
      return;
    }

    setPdfName(file.name);
    setPdfStatus('parsing');
    setPdfError('');

    try {
      const text = await extractTextFromPDF(file);
      const cleaned = text.trim();

      if (cleaned.length < 20) {
        setPdfError(t('sidebar.pdf.error'));
        setPdfStatus('error');
        return;
      }

      const merged = resume.trim()
        ? `${resume.trim()}\n\n--- PDF: ${file.name} ---\n\n${cleaned}`
        : cleaned;
      onResumeChange(merged);
      setPdfStatus('done');
    } catch (err: any) {
      setPdfError(err.message || t('sidebar.pdf.error'));
      setPdfStatus('error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-surface border-2 border-border rounded-[6px] overflow-hidden"
    >
      {/* Section header */}
      <div className="editorial-topbar">
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5" />
          <span>{t('sidebar.header')}</span>
        </div>
        {!publicMode && (
          <button
            onClick={onOpenApiKeys}
            className="flex items-center gap-1 text-text-muted hover:text-primary transition-colors"
            aria-label="Configure API Keys"
          >
            <Settings2 className="w-3 h-3" />
            <span>{t('sidebar.apiKey')}</span>
          </button>
        )}
      </div>

      <div className="p-5 space-y-6">
        {/* Time Range */}
        <div className="space-y-2.5">
          <label className="editorial-mono-label flex items-center gap-2 text-text-muted">
            <Clock className="w-3 h-3" />
            {t('sidebar.timeRange.label')}
          </label>
          <div className="flex gap-1.5">
            {(Object.entries(TIME_RANGE_LABELS) as [TimeRange, string][]).map(
              ([key, label]) => (
                <button
                  key={key}
                  onClick={() => onTimeRangeChange(key)}
                  disabled={isGenerating}
                  className={`flex-1 px-2.5 py-1.5 text-[0.6875rem] font-mono font-[500] uppercase tracking-[0.1em] rounded-[4px] border-2 transition-colors ${
                    timeRange === key
                      ? 'border-primary bg-primary text-cream'
                      : 'border-border bg-surface text-text-muted hover:border-primary'
                  } disabled:opacity-40`}
                >
                  {t(`timeRange.${key}`)}
                </button>
              ),
            )}
          </div>
        </div>

        {/* AI Model (hidden in public mode) */}
        {!publicMode && (
          <>
            <div className="space-y-2.5">
              <label className="editorial-mono-label flex items-center gap-2 text-text-muted">
                <Zap className="w-3 h-3" />
                {t('sidebar.provider.label')}
              </label>
              <div className="flex gap-2">
                <select
                  value={providerId}
                  onChange={(e) => onProviderChange(e.target.value as ProviderId)}
                  className="editorial-select flex-1 min-w-0"
                  disabled={isGenerating}
                >
                  {(Object.entries(PROVIDERS) as [ProviderId, typeof PROVIDERS[ProviderId]][]).map(
                    ([id, p]) => (
                      <option key={id} value={id}>{p.name}</option>
                    ),
                  )}
                </select>
                <select
                  value={model}
                  onChange={(e) => onModelChange(e.target.value)}
                  className="editorial-select flex-1 min-w-0"
                  disabled={isGenerating}
                >
                  {currentProvider.models.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
            <hr className="editorial-rule" />
          </>
        )}

        {/* Resume + PDF Upload */}
        <div className="space-y-2.5">
          <label className="editorial-mono-label flex items-center justify-between text-text-muted">
            <span className="flex items-center gap-2">
              <FileText className="w-3 h-3" />
              {t('sidebar.resume.label')}
            </span>
            <span className="tabular-nums">{resume.length}c</span>
          </label>

          {/* PDF Upload Row */}
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handlePdfUpload}
              className="hidden"
              aria-label="Upload PDF resume"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isGenerating || pdfStatus === 'parsing'}
              className="editorial-btn-ghost flex items-center gap-1.5 text-[0.6875rem] py-1 px-2.5"
            >
              {pdfStatus === 'parsing' ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Upload className="w-3 h-3" />
              )}
              {pdfStatus === 'done' ? t('sidebar.pdf.parsed') : t('sidebar.pdf.upload')}
            </button>

            {pdfStatus === 'done' && (
              <span className="flex items-center gap-1 text-[0.625rem] font-mono text-success">
                <CheckCircle2 className="w-3 h-3" />
                {pdfName.length > 18 ? pdfName.slice(0, 16) + '…' : pdfName}
              </span>
            )}

            {pdfStatus === 'error' && (
              <span className="flex items-center gap-1 text-[0.625rem] font-mono text-danger">
                <AlertTriangle className="w-3 h-3" />
                {pdfError}
              </span>
            )}
          </div>

          <textarea
            value={resume}
            onChange={(e) => onResumeChange(e.target.value)}
            className="editorial-input resize-none"
            rows={8}
            placeholder={t('sidebar.resume.placeholder')}
          />
        </div>

        {/* Report Language */}
        <div className="space-y-2.5">
          <label className="editorial-mono-label flex items-center gap-2 text-text-muted">
            <Globe className="w-3 h-3" />
            {t('sidebar.reportLang.label')}
          </label>
          <div className="flex gap-1.5">
            {(['zh', 'en'] as ReportLang[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onReportLangChange(lang)}
                disabled={isGenerating}
                className={`flex-1 px-2.5 py-1.5 text-[0.6875rem] font-mono font-[500] uppercase tracking-[0.1em] rounded-[4px] border-2 transition-colors ${
                  reportLang === lang
                    ? 'border-primary bg-primary text-cream'
                    : 'border-border bg-surface text-text-muted hover:border-primary'
                } disabled:opacity-40`}
              >
                {t(`reportLang.${lang}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Focus */}
        <div className="space-y-2.5">
          <label className="editorial-mono-label flex items-center gap-2 text-text-muted">
            <Target className="w-3 h-3" />
            {t('sidebar.focus.label')}
          </label>
          <textarea
            value={focus}
            onChange={(e) => onFocusChange(e.target.value)}
            className="editorial-input resize-none"
            rows={2}
            placeholder={t('sidebar.focus.placeholder')}
          />
        </div>

        {/* Generate */}
        <button
          onClick={onGenerate}
          disabled={isGenerating || !isValid}
          className="editorial-btn w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('sidebar.generating')}
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              {t('sidebar.generate')}
            </>
          )}
        </button>

        {/* Footer status */}
        <hr className="editorial-rule" />
        <div className="flex items-center gap-3 text-[0.625rem] font-mono font-[500] tracking-[0.14em] uppercase text-text-muted">
          <Bookmark className="w-3 h-3" />
          <span>{t('sidebar.footer.status')}</span>
        </div>
      </div>
    </motion.div>
  );
}
