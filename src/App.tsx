import Header from './components/Header';
import MainLayout from './components/layout/MainLayout';
import UserProfilePanel from './components/sidebar/UserProfilePanel';
import ReportOutput from './components/output/ReportOutput';
import { useGenerateReport } from './hooks/useGenerateReport';

export default function App() {
  const {
    resume,
    setResume,
    focus,
    setFocus,
    report,
    status,
    error,
    generateReport,
    isGenerating,
  } = useGenerateReport();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-slate-950 text-zinc-900 dark:text-slate-100 font-sans transition-colors">
      <Header />
      <MainLayout
        sidebar={
          <UserProfilePanel
            resume={resume}
            focus={focus}
            isGenerating={isGenerating}
            onResumeChange={setResume}
            onFocusChange={setFocus}
            onGenerate={generateReport}
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
    </div>
  );
}
