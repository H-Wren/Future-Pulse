import { useState } from 'react';
import Header from './components/Header';
import MainLayout from './components/layout/MainLayout';
import UserProfilePanel from './components/sidebar/UserProfilePanel';
import ReportOutput from './components/output/ReportOutput';
import ApiKeyModal from './components/ApiKeyModal';
import { useGenerateReport } from './hooks/useGenerateReport';
import { useLocale } from './hooks/useLocale';

export default function App() {
  const { locale, toggleLocale, t } = useLocale();
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);

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
          />
        }
      />

      <ApiKeyModal
        open={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        onSaved={() => {
          // Future: could re-fetch keys here
        }}
      />
    </div>
  );
}
