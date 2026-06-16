import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import MainLayout from './components/layout/MainLayout';
import UserProfilePanel from './components/sidebar/UserProfilePanel';
import ReportOutput from './components/output/ReportOutput';
import ApiKeyModal from './components/ApiKeyModal';
import HistoryPanel from './components/HistoryPanel';
import { useGenerateReport } from './hooks/useGenerateReport';
import { useLocale } from './hooks/useLocale';
import { saveReport } from './utils/storage';
import type { SavedReport } from './types/report';
import type { ReportStatus } from './types/report';

export default function App() {
  const { locale, toggleLocale, t } = useLocale();
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const prevStatusRef = useRef<ReportStatus>('idle');

  const {
    resume,
    setResume,
    focus,
    setFocus,
    report,
    status,
    error,
    currentProvider,
    providerId,
    model,
    setModel,
    setProviderId,
    generateReport,
    isGenerating,
  } = useGenerateReport();

  // Auto-save report when generation completes
  useEffect(() => {
    if (status === 'complete' && prevStatusRef.current === 'generating' && report) {
      const saved: SavedReport = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        providerId,
        model,
        resumeSnippet: resume.slice(0, 100),
        focus,
        content: report,
      };
      saveReport(saved).catch(console.error);
    }
    prevStatusRef.current = status;
  }, [status, report, providerId, model, resume, focus]);

  const handleLoadReport = (saved: SavedReport) => {
    setResume(saved.resumeSnippet.length > 0 ? saved.resumeSnippet : '');
    setFocus(saved.focus);

    // Restore provider and model if possible
    // Note: this is a simplified version - we just set the content
    // A full version would reload the report into the output view
    // For now, we'll set the resume/focus and let the user click generate
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-slate-950 text-zinc-900 dark:text-slate-100 font-sans transition-colors">
      <Header locale={locale} onToggleLocale={toggleLocale} />

      <MainLayout
        sidebar={
          <UserProfilePanel
            resume={resume}
            focus={focus}
            isGenerating={isGenerating}
            providerId={providerId}
            model={model}
            currentProvider={currentProvider}
            onResumeChange={setResume}
            onFocusChange={setFocus}
            onGenerate={generateReport}
            onProviderChange={setProviderId}
            onModelChange={setModel}
            onOpenApiKeys={() => setApiKeyModalOpen(true)}
            t={t}
          />
        }
        content={
          <ReportOutput
            status={status}
            report={report}
            error={error}
            isGenerating={isGenerating}
            onRetry={generateReport}
            onOpenHistory={() => setHistoryOpen(true)}
          />
        }
      />

      <ApiKeyModal
        open={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        onSaved={() => {}}
      />

      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onLoadReport={handleLoadReport}
      />
    </div>
  );
}
