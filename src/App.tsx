import { useState } from 'react';
import Header from './components/Header';
import MainLayout from './components/layout/MainLayout';
import UserProfilePanel from './components/sidebar/UserProfilePanel';
import ReportOutput from './components/output/ReportOutput';
import ApiKeyModal from './components/ApiKeyModal';
import { useGenerateReport, isPublicMode } from './hooks/useGenerateReport';
import { useLocale } from './hooks/useLocale';

const PUBLIC_MODE = isPublicMode();

export default function App() {
  const { locale, toggleLocale, t } = useLocale();
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);

  const {
    resume,
    setResume,
    focus,
    setFocus,
    timeRange,
    setTimeRange,
    reportLang,
    setReportLang,
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
    <div className="min-h-screen bg-canvas text-text-primary transition-colors">
      <Header locale={locale} onToggleLocale={toggleLocale} />

      <MainLayout
        sidebar={
          <UserProfilePanel
            resume={resume}
            focus={focus}
            timeRange={timeRange}
            reportLang={reportLang}
            isGenerating={isGenerating}
            providerId={providerId}
            model={model}
            currentProvider={currentProvider}
            onResumeChange={setResume}
            onFocusChange={setFocus}
            onTimeRangeChange={setTimeRange}
            onReportLangChange={setReportLang}
            onGenerate={generateReport}
            onProviderChange={setProviderId}
            onModelChange={setModel}
            onOpenApiKeys={() => setApiKeyModalOpen(true)}
            publicMode={PUBLIC_MODE}
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

      {!PUBLIC_MODE && (
        <ApiKeyModal
          open={apiKeyModalOpen}
          onClose={() => setApiKeyModalOpen(false)}
          onSaved={() => {}}
        />
      )}
    </div>
  );
}
