import { motion } from 'motion/react';
import { FileText, Target, Zap, Loader2, UserCircle, Settings2 } from 'lucide-react';
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
      transition={{ duration: 0.3 }}
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-zinc-200 dark:border-slate-700/50 overflow-hidden"
    >
      <div className="p-4 border-b border-zinc-100 dark:border-slate-700/50 bg-zinc-50/80 dark:bg-slate-800/90 flex items-center gap-2">
        <UserCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="font-semibold text-zinc-800 dark:text-slate-200 text-sm tracking-wide">
          {t?.('sidebar.profile.title') ?? '用户核心资产分析 (Profile)'}
        </h2>
      </div>

      <div className="p-5 space-y-6">
        {/* AI Provider Selector */}
        <div className="space-y-2.5">
          <label className="flex items-center justify-between text-sm font-semibold text-zinc-800 dark:text-slate-200">
            <span>{t?.('sidebar.provider.label') ?? 'AI 模型'}</span>
            <button
              onClick={onOpenApiKeys}
              className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5" />
              {t?.('sidebar.provider.configure') ?? '配置 API Key'}
            </button>
          </label>
          <div className="flex gap-2">
            <select
              value={providerId}
              onChange={(e) => onProviderChange(e.target.value as ProviderId)}
              className="flex-1 px-3 py-2.5 text-sm bg-zinc-50 dark:bg-slate-900/60 border border-zinc-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all dark:text-slate-200"
              disabled={isGenerating}
            >
              {(Object.entries(PROVIDERS) as [ProviderId, typeof PROVIDERS[ProviderId]][]).map(
                ([id, p]) => (
                  <option key={id} value={id}>
                    {p.name}
                  </option>
                ),
              )}
            </select>
            <select
              value={model}
              onChange={(e) => onModelChange(e.target.value)}
              className="flex-1 px-3 py-2.5 text-sm bg-zinc-50 dark:bg-slate-900/60 border border-zinc-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all dark:text-slate-200"
              disabled={isGenerating}
            >
              {currentProvider.models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resume textarea */}
        <div className="space-y-2.5">
          <label className="flex items-center justify-between text-sm font-semibold text-zinc-800 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-400 dark:text-slate-500" />
              {t?.('sidebar.resume.label') ?? '当前简历能力域'}
            </div>
            <span className="text-xs text-zinc-400 dark:text-slate-500 font-normal">
              {resume.length} 字
            </span>
          </label>
          <textarea
            value={resume}
            onChange={(e) => onResumeChange(e.target.value)}
            className="w-full h-56 p-3 text-sm bg-zinc-50 dark:bg-slate-900/60 border border-zinc-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all resize-none shadow-inner leading-relaxed dark:text-slate-200 dark:placeholder-slate-500"
            placeholder={t?.('sidebar.resume.placeholder') ?? '粘贴您的简历内容...'}
          />
        </div>

        {/* Focus textarea */}
        <div className="space-y-2.5">
          <label className="flex items-center justify-between text-sm font-semibold text-zinc-800 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-zinc-400 dark:text-slate-500" />
              {t?.('sidebar.focus.label') ?? '本轮提效与重构焦点'}
            </div>
          </label>
          <textarea
            value={focus}
            onChange={(e) => onFocusChange(e.target.value)}
            rows={2}
            className="w-full p-3 text-sm bg-zinc-50 dark:bg-slate-900/60 border border-zinc-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all resize-none shadow-inner leading-relaxed dark:text-slate-200 dark:placeholder-slate-500"
            placeholder={t?.('sidebar.focus.placeholder') ?? '例如：产品经理转型、编校准确、项目管理、品牌效应'}
          />
        </div>

        {/* Generate button */}
        <motion.button
          onClick={onGenerate}
          disabled={isGenerating || !isValid}
          whileHover={isValid && !isGenerating ? { scale: 1.01 } : {}}
          whileTap={isValid && !isGenerating ? { scale: 0.98 } : {}}
          className="w-full group relative flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3.5 px-4 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t?.('sidebar.generating') ?? '正在接入全球 AI 数据流...'}
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              {t?.('sidebar.generate') ?? '生成算力边界专属报告'}
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
