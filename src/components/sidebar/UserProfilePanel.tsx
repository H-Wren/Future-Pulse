import { motion } from 'motion/react';
import { FileText, Target, Zap, Loader2, User, Settings2, Bookmark } from 'lucide-react';
import { PROVIDERS } from '../../utils/providers';
import type { ProviderId } from '../../utils/providers';
import type { AIProvider } from '../../utils/providers';

interface UserProfilePanelProps {
  resume: string;
  focus: string;
  isGenerating: boolean;
  providerId: ProviderId;
  model: string;
  currentProvider: AIProvider;
  onResumeChange: (value: string) => void;
  onFocusChange: (value: string) => void;
  onGenerate: () => void;
  onProviderChange: (id: ProviderId) => void;
  onModelChange: (model: string) => void;
  onOpenApiKeys: () => void;
  t?: (key: string) => string;
}

export default function UserProfilePanel({
  resume,
  focus,
  isGenerating,
  providerId,
  model,
  currentProvider,
  onResumeChange,
  onFocusChange,
  onGenerate,
  onProviderChange,
  onModelChange,
  onOpenApiKeys,
  t,
}: UserProfilePanelProps) {
  const isValid = resume.trim().length >= 20 && focus.trim().length >= 2;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-surface border-2 border-border rounded-[6px] overflow-hidden"
    >
      {/* Section header — mono label bar */}
      <div className="editorial-topbar">
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5" />
          <span>Profile</span>
        </div>
        <button
          onClick={onOpenApiKeys}
          className="flex items-center gap-1 text-text-muted hover:text-primary transition-colors"
          aria-label="Configure API Keys"
        >
          <Settings2 className="w-3 h-3" />
          <span>API Key</span>
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* AI Model Selector */}
        <div className="space-y-2.5">
          <label className="editorial-mono-label flex items-center gap-2 text-text-muted">
            <Zap className="w-3 h-3" />
            {t?.('sidebar.provider.label') ?? 'AI 模型'}
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

        {/* Resume */}
        <div className="space-y-2.5">
          <label className="editorial-mono-label flex items-center justify-between text-text-muted">
            <span className="flex items-center gap-2">
              <FileText className="w-3 h-3" />
              {t?.('sidebar.resume.label') ?? '能力域资产'}
            </span>
            <span className="text-text-muted">{resume.length}c</span>
          </label>
          <textarea
            value={resume}
            onChange={(e) => onResumeChange(e.target.value)}
            className="editorial-input resize-none"
            rows={8}
            placeholder={t?.('sidebar.resume.placeholder') ?? '粘贴您的简历或能力描述...'}
          />
        </div>

        {/* Focus */}
        <div className="space-y-2.5">
          <label className="editorial-mono-label flex items-center gap-2 text-text-muted">
            <Target className="w-3 h-3" />
            {t?.('sidebar.focus.label') ?? '提效焦点'}
          </label>
          <textarea
            value={focus}
            onChange={(e) => onFocusChange(e.target.value)}
            className="editorial-input resize-none"
            rows={2}
            placeholder={t?.('sidebar.focus.placeholder') ?? '例如：产品经理转型、项目管理、品牌效应'}
          />
        </div>

        {/* Generate button */}
        <button
          onClick={onGenerate}
          disabled={isGenerating || !isValid}
          className="editorial-btn w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t?.('sidebar.generating') ?? '接入数据流中...'}
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              {t?.('sidebar.generate') ?? '生成情报报告'}
            </>
          )}
        </button>

        {/* System status */}
        <hr className="editorial-rule" />
        <div className="flex items-center gap-3 text-[0.625rem] font-mono font-[500] tracking-[0.14em] uppercase text-text-muted">
          <Bookmark className="w-3 h-3" />
          <span>{providerId === 'gemini' ? 'Gemini API · Grounded' : providerId}</span>
        </div>
      </div>
    </motion.div>
  );
}
